export type RiskTier = 'Low' | 'Moderate' | 'High' | 'Critical';

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  hba1c: number;
  bmi: number;
  systolicBP: number;
  ldl: number;
  adherence: number;
  visitFrequency: number;
  lastVisit: string;
  riskTier: RiskTier;
  visitPattern: 'Regular' | 'Irregular';
  complications: string[];
  telemedicineEligible: boolean;
};

export type Alert = {
  id: string;
  severity: 'Low' | 'Moderate' | 'High';
  patient: string;
  action: string;
};

export const patients: Patient[] = [
  {
    id: 'P-001',
    name: 'Siti Rahma',
    age: 58,
    gender: 'F',
    hba1c: 9.2,
    bmi: 30.1,
    systolicBP: 156,
    ldl: 158,
    adherence: 52,
    visitFrequency: 2,
    lastVisit: '2025-01-13',
    riskTier: 'High',
    visitPattern: 'Irregular',
    complications: ['Neuropathy'],
    telemedicineEligible: false,
  },
  {
    id: 'P-002',
    name: 'Budi Santoso',
    age: 49,
    gender: 'M',
    hba1c: 7.1,
    bmi: 26.2,
    systolicBP: 132,
    ldl: 118,
    adherence: 81,
    visitFrequency: 4,
    lastVisit: '2025-02-02',
    riskTier: 'Moderate',
    visitPattern: 'Regular',
    complications: [],
    telemedicineEligible: true,
  },
  {
    id: 'P-003',
    name: 'Ayu Putri',
    age: 62,
    gender: 'F',
    hba1c: 10.4,
    bmi: 32.8,
    systolicBP: 170,
    ldl: 172,
    adherence: 45,
    visitFrequency: 1,
    lastVisit: '2024-11-19',
    riskTier: 'Critical',
    visitPattern: 'Irregular',
    complications: ['Retinopathy', 'Nephropathy'],
    telemedicineEligible: false,
  },
  {
    id: 'P-004',
    name: 'Rina Lestari',
    age: 43,
    gender: 'F',
    hba1c: 6.6,
    bmi: 24.8,
    systolicBP: 124,
    ldl: 102,
    adherence: 88,
    visitFrequency: 3,
    lastVisit: '2025-02-11',
    riskTier: 'Low',
    visitPattern: 'Regular',
    complications: [],
    telemedicineEligible: true,
  },
  {
    id: 'P-005',
    name: 'Dedi Saputra',
    age: 54,
    gender: 'M',
    hba1c: 8.4,
    bmi: 28.6,
    systolicBP: 145,
    ldl: 134,
    adherence: 64,
    visitFrequency: 2,
    lastVisit: '2025-01-05',
    riskTier: 'High',
    visitPattern: 'Irregular',
    complications: ['Foot ulcer history'],
    telemedicineEligible: true,
  },
];

export const alerts: Alert[] = [
  { id: 'A1', severity: 'High', patient: 'Ayu Putri', action: 'Urgent retinal screening + BP control plan' },
  { id: 'A2', severity: 'Moderate', patient: 'Siti Rahma', action: 'Medication adherence coaching this week' },
  { id: 'A3', severity: 'Low', patient: 'Budi Santoso', action: 'Switch next visit to telemedicine' },
];

export const riskDistribution = [
  { tier: 'Low', count: 24 },
  { tier: 'Moderate', count: 38 },
  { tier: 'High', count: 19 },
  { tier: 'Critical', count: 8 },
];

export const monthlyVisitReduction = [
  { month: 'Jan', value: 8 },
  { month: 'Feb', value: 12 },
  { month: 'Mar', value: 15 },
  { month: 'Apr', value: 17 },
  { month: 'May', value: 20 },
  { month: 'Jun', value: 24 },
];

export const monthlyPaperReduction = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 180 },
  { month: 'Mar', value: 240 },
  { month: 'Apr', value: 300 },
  { month: 'May', value: 360 },
  { month: 'Jun', value: 420 },
];

export const greenMonthlySeries = [
  { month: 'Jan', co2: 18, avoidedVisits: 20 },
  { month: 'Feb', co2: 23, avoidedVisits: 27 },
  { month: 'Mar', co2: 29, avoidedVisits: 33 },
  { month: 'Apr', co2: 35, avoidedVisits: 40 },
  { month: 'May', co2: 41, avoidedVisits: 47 },
  { month: 'Jun', co2: 49, avoidedVisits: 56 },
];

export const dashboardMetrics = {
  activePatients: 89,
  highRisk: 27,
  telemedicineEligible: 52,
  co2SavedKg: 195,
};

export const dietaryProfiles = {
  standard: {
    calories: 1600,
    foods: ['nasi merah', 'tempe', 'ikan kembung', 'sayur bening', 'pepaya'],
  },
  intensive: {
    calories: 1400,
    foods: ['oat', 'tahu kukus', 'telur rebus', 'bayam', 'jambu biji'],
  },
};
