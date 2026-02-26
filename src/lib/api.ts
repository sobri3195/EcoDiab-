import { useSyncExternalStore } from 'react';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestInterceptor = (config: RequestInit & { url: string }) => Promise<RequestInit & { url: string }> | (RequestInit & { url: string });
type ResponseErrorInterceptor = (error: ApiError) => Promise<void> | void;

type QueuedMutation = {
  id: string;
  path: string;
  method: Exclude<HttpMethod, 'GET'>;
  body?: unknown;
  createdAt: string;
  retries: number;
};

type SyncStatus = {
  isOnline: boolean;
  isSyncing: boolean;
  pendingMutations: number;
  lastSyncedAt: string | null;
  conflictNotes: string[];
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export class MutationQueuedError extends Error {
  mutation: QueuedMutation;

  constructor(mutation: QueuedMutation) {
    super('Aksi disimpan ke antrean offline dan akan disinkronkan saat koneksi tersedia.');
    this.name = 'MutationQueuedError';
    this.mutation = mutation;
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080/api';
const QUEUE_KEY = 'ecodiab-offline-queue-v1';
const CONFLICT_KEY = 'ecodiab-sync-conflicts-v1';

const requestInterceptors: RequestInterceptor[] = [];
const errorInterceptors: ResponseErrorInterceptor[] = [];
const syncListeners = new Set<() => void>();

let queuedMutations: QueuedMutation[] = loadQueue();
let syncState: SyncStatus = {
  isOnline: navigator.onLine,
  isSyncing: false,
  pendingMutations: queuedMutations.length,
  lastSyncedAt: null,
  conflictNotes: loadConflictNotes(),
};
let syncTimer: number | null = null;

function loadQueue(): QueuedMutation[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadConflictNotes(): string[] {
  try {
    const raw = localStorage.getItem(CONFLICT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
  } catch {
    return [];
  }
}

function persistQueue() {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queuedMutations));
}

function persistConflicts(conflicts: string[]) {
  localStorage.setItem(CONFLICT_KEY, JSON.stringify(conflicts.slice(0, 10)));
}

function emitSyncState() {
  syncState = { ...syncState, pendingMutations: queuedMutations.length };
  syncListeners.forEach((listener) => listener());
}

function setSyncState(patch: Partial<SyncStatus>) {
  syncState = { ...syncState, ...patch, pendingMutations: queuedMutations.length };
  syncListeners.forEach((listener) => listener());
}

function queueMutation(path: string, method: Exclude<HttpMethod, 'GET'>, body?: unknown) {
  const mutation: QueuedMutation = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    path,
    method,
    body,
    createdAt: new Date().toISOString(),
    retries: 0,
  };
  queuedMutations = [...queuedMutations, mutation];
  persistQueue();
  emitSyncState();
  scheduleSync();
  return mutation;
}

async function runQueueSync() {
  if (!navigator.onLine || syncState.isSyncing || queuedMutations.length === 0) return;

  setSyncState({ isSyncing: true });
  const nextQueue: QueuedMutation[] = [];

  for (const mutation of queuedMutations) {
    try {
      const headers = new Headers({ 'Content-Type': 'application/json' });
      const token = localStorage.getItem('ecodiab-token');
      if (token) headers.set('Authorization', `Bearer ${token}`);

      const response = await fetch(`${API_BASE_URL}${mutation.path}`, {
        method: mutation.method,
        headers,
        body: mutation.body !== undefined ? JSON.stringify(mutation.body) : undefined,
      });

      if (response.status === 409 || response.status === 412) {
        const note = `[${new Date().toLocaleString('id-ID')}] Konflik sinkronisasi pada ${mutation.method} ${mutation.path}. Periksa data terbaru lalu ulangi aksi.`;
        const updatedConflicts = [note, ...syncState.conflictNotes].slice(0, 10);
        persistConflicts(updatedConflicts);
        setSyncState({ conflictNotes: updatedConflicts });
        continue;
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
    } catch {
      nextQueue.push({ ...mutation, retries: mutation.retries + 1 });
      if (!navigator.onLine) {
        nextQueue.push(...queuedMutations.slice(queuedMutations.indexOf(mutation) + 1));
        break;
      }
    }
  }

  queuedMutations = nextQueue;
  persistQueue();
  setSyncState({ isSyncing: false, lastSyncedAt: new Date().toISOString() });

  if (queuedMutations.length > 0) {
    scheduleSync();
  }
}

function scheduleSync(delayMs = 1500) {
  if (syncTimer) window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    syncTimer = null;
    void runQueueSync();
  }, delayMs);
}

function initSyncLifecycle() {
  window.addEventListener('online', () => {
    setSyncState({ isOnline: true });
    scheduleSync(500);
  });

  window.addEventListener('offline', () => {
    setSyncState({ isOnline: false });
  });

  if (navigator.onLine && queuedMutations.length > 0) {
    scheduleSync(1200);
  }
}

requestInterceptors.push((config) => {
  const token = localStorage.getItem('ecodiab-token');
  if (!token) return config;
  const headers = new Headers(config.headers);
  headers.set('Authorization', `Bearer ${token}`);
  return { ...config, headers };
});

export function onApiError(handler: ResponseErrorInterceptor) {
  errorInterceptors.push(handler);
  return () => {
    const index = errorInterceptors.indexOf(handler);
    if (index >= 0) errorInterceptors.splice(index, 1);
  };
}

export function initializeOfflineSync() {
  initSyncLifecycle();
}

export function clearConflictNotes() {
  persistConflicts([]);
  setSyncState({ conflictNotes: [] });
}

export function subscribeSyncStatus(listener: () => void) {
  syncListeners.add(listener);
  return () => syncListeners.delete(listener);
}

export function getSyncStatusSnapshot() {
  return syncState;
}

export function useSyncStatus() {
  return useSyncExternalStore(subscribeSyncStatus, getSyncStatusSnapshot, getSyncStatusSnapshot);
}

function isMutationMethod(method: HttpMethod) {
  return method !== 'GET';
}

async function request<T>(path: string, method: HttpMethod, body?: unknown): Promise<T> {
  let config: RequestInit & { url: string } = {
    url: `${API_BASE_URL}${path}`,
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body !== undefined) config.body = JSON.stringify(body);

  for (const interceptor of requestInterceptors) {
    config = await interceptor(config);
  }

  try {
    const response = await fetch(config.url, config);
    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
      const error = new ApiError(
        typeof data === 'object' && data && 'message' in data ? String((data as { message: string }).message) : `Request failed: ${response.status}`,
        response.status,
        data
      );
      await Promise.all(errorInterceptors.map((handler) => handler(error)));
      throw error;
    }

    return data as T;
  } catch (error) {
    const shouldQueue = isMutationMethod(method) && (!navigator.onLine || error instanceof TypeError);
    if (shouldQueue) {
      const queued = queueMutation(path, method as Exclude<HttpMethod, 'GET'>, body);
      throw new MutationQueuedError(queued);
    }
    throw error;
  }
}

export type DashboardMetrics = {
  activePatients: number;
  highRisk: number;
  telemedicineEligible: number;
  co2SavedKg: number;
};

export type DashboardPayload = {
  metrics: DashboardMetrics;
  riskDistribution: { tier: string; count: number }[];
  monthlyVisitReduction: { month: string; value: number }[];
  monthlyPaperReduction: { month: string; value: number }[];
  alerts: { id: string; severity: string; patient: string; action: string }[];
};

export type PatientPayload = {
  id: string;
  name: string;
  age: number;
  medicalHistory: string;
  gender?: 'M' | 'F';
  hba1c?: number;
  bmi?: number;
  systolicBP?: number;
  ldl?: number;
  adherence?: number;
  visitFrequency?: number;
  lastVisit?: string;
  riskTier?: 'Low' | 'Moderate' | 'High' | 'Critical';
  visitPattern?: 'Regular' | 'Irregular';
  complications?: string[];
  telemedicineEligible?: boolean;
};

export type RiskPredictionResponse = {
  score: number;
  category: 'Low' | 'Moderate' | 'High' | 'Critical';
  reasons: string[];
  complicationProbability?: number;
  hospitalizationRisk?: number;
};

export type FollowUpTask = {
  id: string;
  patientName: string;
  dueDate: string;
  recommendation: string;
  status: 'pending' | 'completed' | 'overdue';
};

export type FollowUpStatus = FollowUpTask['status'];

export const api = {
  get: <T>(path: string) => request<T>(path, 'GET'),
  post: <T>(path: string, body?: unknown) => request<T>(path, 'POST', body),
  put: <T>(path: string, body?: unknown) => request<T>(path, 'PUT', body),
  patch: <T>(path: string, body?: unknown) => request<T>(path, 'PATCH', body),
  delete: <T>(path: string) => request<T>(path, 'DELETE'),

  getDashboard: () => request<DashboardPayload>('/dashboard', 'GET'),
  getPatients: () => request<PatientPayload[]>('/patients', 'GET'),
  getPatientDetail: (id: string) => request<PatientPayload>(`/patients/${id}`, 'GET'),
  createPatient: (payload: Omit<PatientPayload, 'id'>) => request<PatientPayload>('/patients', 'POST', payload),
  updatePatient: (id: string, payload: Omit<PatientPayload, 'id'>) => request<PatientPayload>(`/patients/${id}`, 'PUT', payload),
  deletePatient: (id: string) => request<{ success: boolean }>(`/patients/${id}`, 'DELETE'),
  predictRisk: (payload: Record<string, unknown>) => request<RiskPredictionResponse>('/risk/predict', 'POST', payload),
  saveRiskHistory: (patientId: string, payload: Record<string, unknown>) => request<{ success: boolean }>(`/patients/${patientId}/risk-history`, 'POST', payload),
  getFollowUps: () => request<FollowUpTask[]>('/follow-ups', 'GET'),
  generateFollowUps: () => request<FollowUpTask[]>('/follow-ups/generate', 'POST'),
  completeFollowUp: (id: string) => request<FollowUpTask>(`/follow-ups/${id}/complete`, 'PATCH'),
  postponeFollowUp: (id: string) => request<FollowUpTask>(`/follow-ups/${id}/postpone`, 'PATCH'),
  rescheduleFollowUp: (id: string, dueDate: string) => request<FollowUpTask>(`/follow-ups/${id}/reschedule`, 'PATCH', { dueDate }),
  updateFollowUpStatus: async (id: string, status: FollowUpStatus, dueDate?: string) => {
    try {
      return await request<FollowUpTask>(`/follow-ups/${id}/status`, 'PATCH', { status, dueDate });
    } catch (error) {
      if (error instanceof MutationQueuedError) throw error;
      if (status === 'completed') return api.completeFollowUp(id);
      if (status === 'overdue') return api.postponeFollowUp(id);
      return api.rescheduleFollowUp(id, dueDate ?? new Date().toISOString().slice(0, 10));
    }
  },
  getDietaryRecommendation: (payload: Record<string, unknown>) => request<{ summary: string; recommendations: string[] }>('/dietary/recommendations', 'POST', payload),
};
