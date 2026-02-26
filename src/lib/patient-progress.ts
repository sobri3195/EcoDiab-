import type { PatientPayload } from './api';

export type ProgressMetricKey = 'hba1c' | 'bmi' | 'systolicBP';

export type PatientProgressPoint = {
  date: string;
  hba1c: number;
  bmi: number;
  systolicBP: number;
};

const metricBounds: Record<ProgressMetricKey, { min: number; max: number }> = {
  hba1c: { min: 5.5, max: 12 },
  bmi: { min: 18, max: 42 },
  systolicBP: { min: 95, max: 190 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashSeed(value: string) {
  return value.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

export function createPatientProgressSeries(patient: PatientPayload, months = 12): PatientProgressPoint[] {
  const seed = hashSeed(patient.id);
  const now = new Date();
  const baseline = {
    hba1c: patient.hba1c ?? 7.8,
    bmi: patient.bmi ?? 28,
    systolicBP: patient.systolicBP ?? 138,
  };

  return Array.from({ length: months }, (_, index) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - index - 1), 1);
    const drift = (index - months / 2) * 0.06;

    const hba1c = clamp(baseline.hba1c + drift + ((seed + index * 13) % 9 - 4) * 0.08, metricBounds.hba1c.min, metricBounds.hba1c.max);
    const bmi = clamp(baseline.bmi + drift * 2 + ((seed + index * 7) % 7 - 3) * 0.2, metricBounds.bmi.min, metricBounds.bmi.max);
    const systolicBP = clamp(
      baseline.systolicBP + drift * 7 + ((seed + index * 5) % 11 - 5) * 1.2,
      metricBounds.systolicBP.min,
      metricBounds.systolicBP.max
    );

    return {
      date: d.toISOString().slice(0, 10),
      hba1c: Number(hba1c.toFixed(1)),
      bmi: Number(bmi.toFixed(1)),
      systolicBP: Number(systolicBP.toFixed(0)),
    };
  });
}

export function filterPatientProgressByDateRange(data: PatientProgressPoint[], startDate: string, endDate: string) {
  return data.filter((point) => {
    const current = point.date;
    if (startDate && current < startDate) return false;
    if (endDate && current > endDate) return false;
    return true;
  });
}

export function getPatientProgressDateRange(data: PatientProgressPoint[]) {
  if (!data.length) return { minDate: '', maxDate: '' };
  return { minDate: data[0].date, maxDate: data[data.length - 1].date };
}
