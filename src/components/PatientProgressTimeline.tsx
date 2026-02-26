import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { PatientPayload } from '../lib/api';
import {
  createPatientProgressSeries,
  filterPatientProgressByDateRange,
  getPatientProgressDateRange,
  type ProgressMetricKey,
} from '../lib/patient-progress';
import { EmptyState, ErrorState, LoadingState } from './PageState';

const metricConfig: Record<ProgressMetricKey, { label: string; color: string }> = {
  hba1c: { label: 'HbA1c (%)', color: '#0ea5e9' },
  bmi: { label: 'BMI', color: '#22c55e' },
  systolicBP: { label: 'Systolic BP (mmHg)', color: '#f97316' },
};

type PatientProgressTimelineProps = {
  patients: PatientPayload[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

export default function PatientProgressTimeline({ patients, loading, error, onRetry }: PatientProgressTimelineProps) {
  const [activePatientId, setActivePatientId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [metricToggles, setMetricToggles] = useState<Record<ProgressMetricKey, boolean>>({
    hba1c: true,
    bmi: true,
    systolicBP: true,
  });

  useEffect(() => {
    if (!patients.length) {
      setActivePatientId('');
      return;
    }
    if (!activePatientId || !patients.some((item) => item.id === activePatientId)) {
      setActivePatientId(patients[0].id);
    }
  }, [activePatientId, patients]);

  const selectedPatient = useMemo(() => patients.find((item) => item.id === activePatientId) ?? null, [activePatientId, patients]);
  const fullData = useMemo(() => (selectedPatient ? createPatientProgressSeries(selectedPatient) : []), [selectedPatient]);
  const dateBounds = useMemo(() => getPatientProgressDateRange(fullData), [fullData]);

  useEffect(() => {
    setStartDate(dateBounds.minDate);
    setEndDate(dateBounds.maxDate);
  }, [dateBounds.maxDate, dateBounds.minDate]);

  const activeMetrics = useMemo(
    () => (Object.keys(metricToggles) as ProgressMetricKey[]).filter((metric) => metricToggles[metric]),
    [metricToggles]
  );

  const chartData = useMemo(() => filterPatientProgressByDateRange(fullData, startDate, endDate), [endDate, fullData, startDate]);

  return (
    <section className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900" aria-label="Patient progress timeline">
      <h3 className="mb-4 text-sm font-semibold">Patient Progress Timeline</h3>

      {loading ? <LoadingState label="Memuat timeline pasien..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={onRetry} /> : null}
      {!loading && !error && patients.length === 0 ? <EmptyState message="Belum ada data pasien untuk timeline." /> : null}

      {!loading && !error && patients.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <label className="text-xs font-medium">
              <span className="mb-1 block">Pilih pasien</span>
              <select
                value={activePatientId}
                aria-label="Pilih pasien untuk timeline"
                onChange={(event) => setActivePatientId(event.target.value)}
                className="w-full rounded border px-2 py-2 text-sm dark:bg-slate-900"
              >
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-medium">
              <span className="mb-1 block">Dari tanggal</span>
              <input
                type="date"
                aria-label="Tanggal mulai timeline"
                value={startDate}
                min={dateBounds.minDate}
                max={endDate || dateBounds.maxDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded border px-2 py-2 text-sm dark:bg-slate-900"
              />
            </label>

            <label className="text-xs font-medium">
              <span className="mb-1 block">Sampai tanggal</span>
              <input
                type="date"
                aria-label="Tanggal akhir timeline"
                value={endDate}
                min={startDate || dateBounds.minDate}
                max={dateBounds.maxDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded border px-2 py-2 text-sm dark:bg-slate-900"
              />
            </label>

            <fieldset className="rounded border p-2" aria-label="Toggles metric timeline">
              <legend className="px-1 text-xs font-medium">Metric</legend>
              {(Object.keys(metricConfig) as ProgressMetricKey[]).map((metric) => (
                <label key={metric} className="mb-1 flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={metricToggles[metric]}
                    onChange={() => setMetricToggles((prev) => ({ ...prev, [metric]: !prev[metric] }))}
                    aria-label={`Toggle ${metricConfig[metric].label}`}
                  />
                  {metricConfig[metric].label}
                </label>
              ))}
            </fieldset>
          </div>

          {activeMetrics.length === 0 ? (
            <EmptyState message="Pilih minimal satu metric untuk menampilkan chart." />
          ) : null}
          {activeMetrics.length > 0 && chartData.length === 0 ? <EmptyState message="Tidak ada data pada rentang tanggal yang dipilih." /> : null}

          {activeMetrics.length > 0 && chartData.length > 0 ? (
            <div className="h-80 w-full" aria-label="Grafik perkembangan pasien" role="img">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  {activeMetrics.map((metric) => (
                    <Area
                      key={`${metric}-area`}
                      type="monotone"
                      dataKey={metric}
                      name={metricConfig[metric].label}
                      stroke={metricConfig[metric].color}
                      fill={metricConfig[metric].color}
                      fillOpacity={0.12}
                    />
                  ))}
                  {activeMetrics.map((metric) => (
                    <Line key={`${metric}-line`} type="monotone" dataKey={metric} name={metricConfig[metric].label} stroke={metricConfig[metric].color} dot={false} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
