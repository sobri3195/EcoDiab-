export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestInterceptor = (config: RequestInit & { url: string }) => Promise<RequestInit & { url: string }> | (RequestInit & { url: string });
type ResponseErrorInterceptor = (error: ApiError) => Promise<void> | void;

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

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080/api';

const requestInterceptors: RequestInterceptor[] = [];
const errorInterceptors: ResponseErrorInterceptor[] = [];

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
  getDietaryRecommendation: (payload: Record<string, unknown>) => request<{ summary: string; recommendations: string[] }>('/dietary/recommendations', 'POST', payload),
};
