import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Drawer from '../components/Drawer';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import { useToast } from '../components/Toast';
import { MutationQueuedError, api, type FollowUpStatus, type FollowUpTask } from '../lib/api';
import { logError, logEvent } from '../lib/logger';

type DragState = {
  taskId: string;
  fromStatus: FollowUpStatus;
} | null;

const STATUS_META: Record<FollowUpStatus, { title: string; badge: string; description: string }> = {
  pending: {
    title: 'Pending',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200',
    description: 'Pasien yang perlu ditindaklanjuti segera.',
  },
  overdue: {
    title: 'Overdue',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
    description: 'Follow-up melewati jadwal dan perlu diprioritaskan.',
  },
  completed: {
    title: 'Completed',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
    description: 'Follow-up yang sudah terselesaikan.',
  },
};

const STATUS_ORDER: FollowUpStatus[] = ['pending', 'overdue', 'completed'];

export default function FollowUpPage() {
  const { pushToast } = useToast();
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>(null);
  const [activeTask, setActiveTask] = useState<FollowUpTask | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getFollowUps();
      setTasks(response);
      logEvent('followups_loaded', { count: response.length });
    } catch (err) {
      setError('Gagal memuat follow-up.');
      logError('followups_load', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const tasksByStatus = useMemo(
    () =>
      STATUS_ORDER.reduce(
        (acc, status) => {
          acc[status] = tasks.filter((task) => task.status === status);
          return acc;
        },
        { pending: [], overdue: [], completed: [] } as Record<FollowUpStatus, FollowUpTask[]>
      ),
    [tasks]
  );

  const optimisticStatusUpdate = async (task: FollowUpTask, targetStatus: FollowUpStatus) => {
    if (task.status === targetStatus) return;

    const previousTasks = tasks;
    const fallbackDate = targetStatus === 'pending' ? new Date().toISOString().slice(0, 10) : task.dueDate;

    setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, status: targetStatus, dueDate: fallbackDate } : item)));

    try {
      const updated = await api.updateFollowUpStatus(task.id, targetStatus, fallbackDate);
      setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)));
      if (activeTask?.id === task.id) {
        setActiveTask(updated);
      }
      pushToast(`Status follow-up ${task.patientName} dipindahkan ke ${STATUS_META[targetStatus].title}.`);
      logEvent('followup_status_changed', { taskId: task.id, from: task.status, to: targetStatus });
    } catch (err) {
      if (err instanceof MutationQueuedError) {
        pushToast(`Offline: perubahan status ${task.patientName} masuk antrean sinkronisasi.`);
        return;
      }
      setTasks(previousTasks);
      if (activeTask?.id === task.id) {
        const previousTask = previousTasks.find((item) => item.id === task.id) ?? null;
        setActiveTask(previousTask);
      }
      pushToast(`Gagal memindahkan status ${task.patientName}. Mengembalikan perubahan.`);
      logError('followup_status_update', err, { taskId: task.id, from: task.status, to: targetStatus });
    }
  };

  const onDropTask = (nextStatus: FollowUpStatus) => {
    if (!dragState) return;

    const task = tasks.find((item) => item.id === dragState.taskId);
    setDragState(null);

    if (!task) return;
    void optimisticStatusUpdate(task, nextStatus);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => void loadTasks()} className="rounded border px-3 py-2 text-sm">Refresh</button>
        <button
          onClick={async () => {
            try {
              const generated = await api.generateFollowUps();
              setTasks(generated);
              pushToast('Jadwal follow-up otomatis dibuat.');
            } catch (err) {
              if (err instanceof MutationQueuedError) {
                pushToast('Offline: permintaan generate follow-up masuk antrean sinkronisasi.');
                return;
              }
              pushToast('Gagal generate follow-up.');
              logError('followup_generate', err);
            }
          }}
          className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
        >
          Generate by Rule
        </button>
      </div>

      <Card title="Follow-up Kanban Board">
        {loading ? <LoadingState label="Memuat tugas follow-up..." /> : null}
        {error ? <ErrorState message={error} onRetry={() => void loadTasks()} /> : null}
        {!loading && !error && tasks.length === 0 ? (
          <EmptyState message="Belum ada tugas follow-up." actionLabel="Muat ulang" onAction={() => void loadTasks()} />
        ) : null}

        {!loading && !error && tasks.length > 0 ? (
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[920px] grid-cols-3 gap-4 lg:min-w-0 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {STATUS_ORDER.map((status) => (
                <section
                  key={status}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => onDropTask(status)}
                  className={`rounded-xl border p-3 transition ${dragState ? 'border-dashed border-emerald-300 dark:border-emerald-700' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <header className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{STATUS_META[status].title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{STATUS_META[status].description}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_META[status].badge}`}>
                      {tasksByStatus[status].length}
                    </span>
                  </header>

                  <div className="space-y-3">
                    {tasksByStatus[status].map((task) => (
                      <article
                        key={task.id}
                        draggable
                        onDragStart={() => setDragState({ taskId: task.id, fromStatus: status })}
                        onDragEnd={() => setDragState(null)}
                        onClick={() => setActiveTask(task)}
                        className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-emerald-300 hover:shadow dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{task.patientName}</h4>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_META[task.status].badge}`}>
                            {STATUS_META[task.status].title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Jadwal: {task.dueDate}</p>
                        <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{task.recommendation}</p>
                      </article>
                    ))}
                    {tasksByStatus[status].length === 0 ? <p className="rounded-lg border border-dashed p-3 text-xs text-slate-400">Tidak ada card.</p> : null}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ) : null}
      </Card>

      <Drawer open={Boolean(activeTask)} onClose={() => setActiveTask(null)} title="Detail Follow-up Pasien">
        {activeTask ? (
          <div className="space-y-4 text-sm">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500">Pasien</p>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{activeTask.patientName}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <p className="text-xs text-slate-500">Status</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{STATUS_META[activeTask.status].title}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <p className="text-xs text-slate-500">Jadwal</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{activeTask.dueDate}</p>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs text-slate-500">Ringkasan Follow-up</p>
              <p className="rounded-lg border border-slate-200 p-3 text-slate-700 dark:border-slate-700 dark:text-slate-300">{activeTask.recommendation}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-slate-500">Pindahkan status cepat</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_ORDER.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void optimisticStatusUpdate(activeTask, status)}
                    disabled={activeTask.status === status}
                    className="rounded border px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {STATUS_META[status].title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
