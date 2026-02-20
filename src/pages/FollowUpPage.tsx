import { useCallback, useEffect, useState } from 'react';
import Card from '../components/Card';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import Table from '../components/Table';
import { useToast } from '../components/Toast';
import { api, type FollowUpTask } from '../lib/api';
import { logError, logEvent } from '../lib/logger';

export default function FollowUpPage() {
  const { pushToast } = useToast();
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const updateTask = async (taskId: string, action: 'complete' | 'postpone' | 'reschedule') => {
    try {
      let updated: FollowUpTask;
      if (action === 'complete') updated = await api.completeFollowUp(taskId);
      else if (action === 'postpone') updated = await api.postponeFollowUp(taskId);
      else {
        const dueDate = prompt('Masukkan tanggal baru (YYYY-MM-DD):') ?? '';
        if (!dueDate) return;
        updated = await api.rescheduleFollowUp(taskId, dueDate);
      }
      setTasks((prev) => prev.map((item) => (item.id === taskId ? updated : item)));
      pushToast(`Follow-up ${action} berhasil.`);
      logEvent('followup_update', { taskId, action });
    } catch (err) {
      pushToast(`Gagal ${action} follow-up.`);
      logError('followup_update', err, { taskId, action });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => void loadTasks()} className="rounded border px-3 py-2 text-sm">Refresh</button>
        <button onClick={async () => { try { const generated = await api.generateFollowUps(); setTasks(generated); pushToast('Jadwal follow-up otomatis dibuat.'); } catch (err) { pushToast('Gagal generate follow-up.'); logError('followup_generate', err); } }} className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Generate by Rule</button>
      </div>

      <Card title="Daftar Follow-up Otomatis">
        {loading ? <LoadingState label="Memuat tugas follow-up..." /> : null}
        {error ? <ErrorState message={error} onRetry={() => void loadTasks()} /> : null}
        {!loading && !error && tasks.length === 0 ? <EmptyState message="Belum ada tugas follow-up." actionLabel="Jadwalkan ulang" onAction={() => void loadTasks()} /> : null}
        {!loading && !error && tasks.length > 0 ? (
          <Table headers={['Pasien', 'Jadwal', 'Rekomendasi', 'Status', 'Aksi Cepat']}>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-4 py-3 text-sm">{task.patientName}</td>
                <td className="px-4 py-3 text-sm">{task.dueDate}</td>
                <td className="px-4 py-3 text-sm">{task.recommendation}</td>
                <td className="px-4 py-3 text-sm"><span className="rounded bg-slate-100 px-2 py-1 text-xs uppercase dark:bg-slate-800">{task.status}</span></td>
                <td className="px-4 py-3 text-sm">
                  <button className="mr-2 rounded bg-emerald-600 px-2 py-1 text-white" onClick={() => void updateTask(task.id, 'complete')}>Selesaikan</button>
                  <button className="mr-2 rounded bg-amber-500 px-2 py-1 text-white" onClick={() => void updateTask(task.id, 'postpone')}>Tunda</button>
                  <button className="rounded bg-blue-600 px-2 py-1 text-white" onClick={() => void updateTask(task.id, 'reschedule')}>Jadwalkan ulang</button>
                </td>
              </tr>
            ))}
          </Table>
        ) : null}
      </Card>
    </div>
  );
}
