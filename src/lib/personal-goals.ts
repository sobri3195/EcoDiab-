export type GoalMetricUnit = 'kg' | 'mg/dL' | 'mmHg' | 'minutes' | '%';

export type GoalProgressEntry = {
  id: string;
  date: string;
  value: number;
  note?: string;
};

export type MilestoneThreshold = 25 | 50 | 75 | 100;

export type PersonalGoal = {
  id: string;
  title: string;
  targetLabel: string;
  baselineValue: number;
  targetValue: number;
  unit: GoalMetricUnit;
  startDate: string;
  endDate: string;
  createdAt: string;
  progress: GoalProgressEntry[];
  completedMilestones: MilestoneThreshold[];
};

export type PersonalGoalCreateInput = {
  title: string;
  targetLabel: string;
  baselineValue: string;
  targetValue: string;
  unit: GoalMetricUnit;
  startDate: string;
  endDate: string;
};

export type GoalValidationErrors = Partial<Record<keyof PersonalGoalCreateInput, string>>;

export type PersonalGoalCreatePayload = {
  title: string;
  metric: string;
  baselineValue: number;
  targetValue: number;
  unit: GoalMetricUnit;
  period: {
    startDate: string;
    endDate: string;
  };
};

const GOAL_STORAGE_KEY = 'ecodiab-personal-goals';
const MILESTONES: MilestoneThreshold[] = [25, 50, 75, 100];

export const emptyGoalForm: PersonalGoalCreateInput = {
  title: '',
  targetLabel: '',
  baselineValue: '',
  targetValue: '',
  unit: 'mg/dL',
  startDate: '',
  endDate: '',
};

export function validateGoalInput(input: PersonalGoalCreateInput): GoalValidationErrors {
  const errors: GoalValidationErrors = {};
  const baseline = Number(input.baselineValue);
  const target = Number(input.targetValue);

  if (input.title.trim().length < 4) {
    errors.title = 'Judul goal minimal 4 karakter.';
  }

  if (input.targetLabel.trim().length < 3) {
    errors.targetLabel = 'Nama metrik minimal 3 karakter.';
  }

  if (!Number.isFinite(baseline) || baseline <= 0) {
    errors.baselineValue = 'Nilai awal harus berupa angka positif.';
  }

  if (!Number.isFinite(target) || target <= 0) {
    errors.targetValue = 'Nilai target harus berupa angka positif.';
  }

  if (Number.isFinite(target) && Number.isFinite(baseline) && target === baseline) {
    errors.targetValue = 'Nilai target harus berbeda dari nilai awal.';
  }

  if (!input.startDate) {
    errors.startDate = 'Tanggal mulai wajib diisi.';
  }

  if (!input.endDate) {
    errors.endDate = 'Tanggal selesai wajib diisi.';
  }

  if (input.startDate && input.endDate) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      errors.startDate = 'Format tanggal tidak valid.';
    } else {
      if (end <= start) {
        errors.endDate = 'Tanggal selesai harus setelah tanggal mulai.';
      }
      if (diffDays > 730) {
        errors.endDate = 'Periode goal maksimal 730 hari.';
      }
    }
  }

  return errors;
}

export function toCreatePayload(input: PersonalGoalCreateInput): PersonalGoalCreatePayload {
  return {
    title: input.title.trim(),
    metric: input.targetLabel.trim(),
    baselineValue: Number(input.baselineValue),
    targetValue: Number(input.targetValue),
    unit: input.unit,
    period: {
      startDate: input.startDate,
      endDate: input.endDate,
    },
  };
}

export function createPersonalGoal(input: PersonalGoalCreateInput): PersonalGoal {
  const payload = toCreatePayload(input);
  return {
    id: `goal-${crypto.randomUUID()}`,
    title: payload.title,
    targetLabel: payload.metric,
    baselineValue: payload.baselineValue,
    targetValue: payload.targetValue,
    unit: payload.unit,
    startDate: payload.period.startDate,
    endDate: payload.period.endDate,
    createdAt: new Date().toISOString(),
    progress: [],
    completedMilestones: [],
  };
}

export function computeGoalProgress(goal: PersonalGoal): number {
  const latestValue = (goal.progress.length > 0 ? goal.progress[goal.progress.length - 1].value : goal.baselineValue);
  const totalDelta = goal.targetValue - goal.baselineValue;
  const currentDelta = latestValue - goal.baselineValue;

  if (totalDelta === 0) return 0;

  const raw = (currentDelta / totalDelta) * 100;
  const normalized = totalDelta > 0 ? raw : (1 - (latestValue - goal.targetValue) / (goal.baselineValue - goal.targetValue)) * 100;
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

export function appendGoalProgress(goal: PersonalGoal, value: number, note?: string) {
  const nextEntry: GoalProgressEntry = {
    id: `progress-${crypto.randomUUID()}`,
    date: new Date().toISOString(),
    value,
    note: note?.trim() ? note.trim() : undefined,
  };

  const nextGoal: PersonalGoal = {
    ...goal,
    progress: [...goal.progress, nextEntry],
  };

  const completion = computeGoalProgress(nextGoal);
  const newlyReachedMilestones = MILESTONES.filter(
    (milestone) => completion >= milestone && !goal.completedMilestones.includes(milestone)
  );

  return {
    goal: {
      ...nextGoal,
      completedMilestones: [...goal.completedMilestones, ...newlyReachedMilestones],
    },
    newlyReachedMilestones,
  };
}

export function loadPersonalGoals(): PersonalGoal[] {
  const raw = localStorage.getItem(GOAL_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as PersonalGoal[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function savePersonalGoals(goals: PersonalGoal[]) {
  localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goals));
}

export function getGoalStatus(goal: PersonalGoal): 'on-track' | 'at-risk' | 'completed' {
  const progress = computeGoalProgress(goal);
  if (progress >= 100) return 'completed';

  const start = new Date(goal.startDate).getTime();
  const end = new Date(goal.endDate).getTime();
  const now = Date.now();
  const elapsed = Math.max(0, now - start);
  const duration = Math.max(1, end - start);
  const expectedProgress = (elapsed / duration) * 100;

  return progress + 15 >= expectedProgress ? 'on-track' : 'at-risk';
}
