import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import { EmptyState } from '../components/PageState';
import { useToast } from '../components/Toast';
import {
  appendGoalProgress,
  computeGoalProgress,
  createPersonalGoal,
  emptyGoalForm,
  getGoalStatus,
  loadPersonalGoals,
  savePersonalGoals,
  toCreatePayload,
  type GoalMetricUnit,
  type GoalValidationErrors,
  type PersonalGoal,
  type PersonalGoalCreateInput,
  validateGoalInput,
} from '../lib/personal-goals';

const UNIT_OPTIONS: GoalMetricUnit[] = ['mg/dL', 'kg', 'mmHg', 'minutes', '%'];

const STATUS_META = {
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' },
  'on-track': { label: 'On Track', className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200' },
  'at-risk': { label: 'At Risk', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200' },
} as const;

function GoalFormFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-300">{message}</p>;
}

export default function PersonalGoalTrackerPage() {
  const { pushToast } = useToast();
  const [goals, setGoals] = useState<PersonalGoal[]>(() => loadPersonalGoals());
  const [form, setForm] = useState<PersonalGoalCreateInput>(emptyGoalForm);
  const [errors, setErrors] = useState<GoalValidationErrors>({});
  const [progressInput, setProgressInput] = useState<Record<string, string>>({});

  useEffect(() => {
    savePersonalGoals(goals);
  }, [goals]);

  const sortedGoals = useMemo(
    () => [...goals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [goals]
  );

  const createGoal = () => {
    const validation = validateGoalInput(form);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      pushToast('Periksa kembali form goal kesehatan Anda.');
      return;
    }

    const payload = toCreatePayload(form);
    const newGoal = createPersonalGoal(form);
    setGoals((prev) => [newGoal, ...prev]);
    setForm(emptyGoalForm);
    setErrors({});
    pushToast(`Goal "${payload.title}" berhasil dibuat.`);
  };

  const updateProgress = (goal: PersonalGoal) => {
    const valueText = progressInput[goal.id] ?? '';
    const value = Number(valueText);

    if (!Number.isFinite(value) || value <= 0) {
      pushToast('Input progres harus angka positif.');
      return;
    }

    const { goal: updatedGoal, newlyReachedMilestones } = appendGoalProgress(goal, value);

    setGoals((prev) => prev.map((item) => (item.id === goal.id ? updatedGoal : item)));
    setProgressInput((prev) => ({ ...prev, [goal.id]: '' }));

    if (newlyReachedMilestones.length === 0) {
      pushToast(`Progres untuk ${goal.title} tersimpan.`);
      return;
    }

    newlyReachedMilestones.forEach((milestone) => {
      pushToast(`🎉 Milestone ${milestone}% tercapai untuk ${goal.title}.`);
    });
  };

  return (
    <div className="space-y-4">
      <Card title="Buat Personal Health Goal">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-500">Nama Goal</label>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Contoh: Turunkan gula darah puasa"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-900"
            />
            <GoalFormFieldError message={errors.title} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Metrik Target</label>
            <input
              value={form.targetLabel}
              onChange={(event) => setForm((prev) => ({ ...prev, targetLabel: event.target.value }))}
              placeholder="Contoh: GDP Pagi"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-900"
            />
            <GoalFormFieldError message={errors.targetLabel} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Nilai Awal</label>
            <input
              value={form.baselineValue}
              type="number"
              onChange={(event) => setForm((prev) => ({ ...prev, baselineValue: event.target.value }))}
              placeholder="160"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-900"
            />
            <GoalFormFieldError message={errors.baselineValue} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Nilai Target</label>
            <input
              value={form.targetValue}
              type="number"
              onChange={(event) => setForm((prev) => ({ ...prev, targetValue: event.target.value }))}
              placeholder="120"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-900"
            />
            <GoalFormFieldError message={errors.targetValue} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Unit</label>
            <select
              value={form.unit}
              onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value as GoalMetricUnit }))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-900"
            >
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-500">Tanggal Mulai</label>
              <input
                value={form.startDate}
                type="date"
                onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-900"
              />
              <GoalFormFieldError message={errors.startDate} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Tanggal Selesai</label>
              <input
                value={form.endDate}
                type="date"
                onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-900"
              />
              <GoalFormFieldError message={errors.endDate} />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <button onClick={createGoal} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Simpan Goal</button>
        </div>
      </Card>

      <Card title="Goal Progress Tracker">
        {sortedGoals.length === 0 ? <EmptyState message="Belum ada personal goal. Mulai dari form di atas." /> : null}

        <div className="space-y-3">
          {sortedGoals.map((goal) => {
            const progress = computeGoalProgress(goal);
            const status = getGoalStatus(goal);
            const statusMeta = STATUS_META[status];
            const latestValue = (goal.progress.length > 0 ? goal.progress[goal.progress.length - 1].value : goal.baselineValue);

            return (
              <article key={goal.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{goal.title}</h3>
                    <p className="text-xs text-slate-500">{goal.targetLabel}: {goal.baselineValue} → {goal.targetValue} {goal.unit}</p>
                    <p className="text-xs text-slate-400">Periode: {goal.startDate} s/d {goal.endDate}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusMeta.className}`}>{statusMeta.label}</span>
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Progres visual</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[25, 50, 75, 100].map((milestone) => (
                    <span
                      key={`${goal.id}-${milestone}`}
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${goal.completedMilestones.includes(milestone as 25 | 50 | 75 | 100) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'}`}
                    >
                      {milestone}%
                    </span>
                  ))}
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto]">
                  <input
                    value={progressInput[goal.id] ?? ''}
                    onChange={(event) => setProgressInput((prev) => ({ ...prev, [goal.id]: event.target.value }))}
                    placeholder={`Update nilai terbaru (sekarang: ${latestValue} ${goal.unit})`}
                    type="number"
                    className="rounded-md border px-3 py-2 text-sm dark:bg-slate-900"
                  />
                  <button
                    onClick={() => updateProgress(goal)}
                    className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Simpan Progres
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
