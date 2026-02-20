import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import { useToast } from '../components/Toast';
import { api, type PatientPayload, type RiskPredictionResponse } from '../lib/api';
import { useAppContext } from '../lib/app-context';
import { logError, logEvent } from '../lib/logger';

const complicationOptions = ['Neuropathy', 'Retinopathy', 'Nephropathy', 'CVD'];

type RiskInput = {
  patientId: string;
  hba1c: number;
  bmi: number;
  systolicBP: number;
  ldl: number;
  priorComplications: string[];
  adherence: number;
  visitFrequency: number;
};

const defaultInput: RiskInput = { patientId: '', hba1c: 7, bmi: 25, systolicBP: 130, ldl: 110, priorComplications: [], adherence: 75, visitFrequency: 3 };

export default function AIRiskPage() {
  const location = useLocation();
  const { pushToast } = useToast();
  const { setLatestRisk } = useAppContext();
  const [input, setInput] = useState<RiskInput>(defaultInput);
  const [result, setResult] = useState<RiskPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const patient = (location.state as { patient?: PatientPayload } | null)?.patient;
    if (patient) {
      setInput((prev) => ({
        ...prev,
        patientId: patient.id,
        hba1c: patient.hba1c ?? prev.hba1c,
        bmi: patient.bmi ?? prev.bmi,
        systolicBP: patient.systolicBP ?? prev.systolicBP,
        ldl: patient.ldl ?? prev.ldl,
        priorComplications: patient.complications ?? [],
        adherence: patient.adherence ?? prev.adherence,
        visitFrequency: patient.visitFrequency ?? prev.visitFrequency,
      }));
      pushToast(`Prefilled from ${patient.name}`);
    }
  }, [location.state, pushToast]);

  const toggleComplication = (item: string) => {
    setInput((prev) => ({ ...prev, priorComplications: prev.priorComplications.includes(item) ? prev.priorComplications.filter((c) => c !== item) : [...prev.priorComplications, item] }));
  };

  const computeRisk = async () => {
    try {
      setLoading(true);
      setError(null);
      const prediction = await api.predictRisk(input as unknown as Record<string, unknown>);
      setResult(prediction);
      setLatestRisk(prediction);
      if (input.patientId) {
        await api.saveRiskHistory(input.patientId, { ...input, ...prediction, generatedAt: new Date().toISOString() });
      }
      pushToast('Risk score berhasil dihitung dan disimpan.');
      logEvent('risk_prediction_submit', { patientId: input.patientId, category: prediction.category });
    } catch (err) {
      setError('Gagal memproses prediksi risiko.');
      logError('risk_prediction', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Risk Stratification Form">
        <div className="grid gap-2">
          <label className="text-sm">Patient ID<input type="text" value={input.patientId} onChange={(e) => setInput((prev) => ({ ...prev, patientId: e.target.value }))} className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-slate-900" /></label>
          {([['HbA1c', 'hba1c'], ['BMI', 'bmi'], ['Systolic BP', 'systolicBP'], ['LDL', 'ldl'], ['Medication adherence (0-100)', 'adherence'], ['Visit frequency (per year)', 'visitFrequency']] as const).map(([label, key]) => (
            <label key={key} className="text-sm">{label}<input type="number" value={input[key]} onChange={(e) => setInput((prev) => ({ ...prev, [key]: Number(e.target.value) }))} className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-slate-900" /></label>
          ))}

          <fieldset className="mt-2"><legend className="mb-1 text-sm">Prior complications</legend><div className="flex flex-wrap gap-2">{complicationOptions.map((option) => (<label key={option} className="inline-flex items-center gap-1 text-sm"><input type="checkbox" checked={input.priorComplications.includes(option)} onChange={() => toggleComplication(option)} />{option}</label>))}</div></fieldset>

          <button onClick={() => void computeRisk()} className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white">Compute Risk</button>
        </div>
      </Card>

      <Card title="Risk Results">
        {loading ? <LoadingState label="Menghitung prediksi..." /> : null}
        {error ? <ErrorState message={error} onRetry={() => void computeRisk()} /> : null}
        {!loading && !error && !result ? <EmptyState message="Belum ada output prediksi." actionLabel="Hitung Risiko" onAction={() => void computeRisk()} /> : null}
        {result ? (
          <div className="space-y-2 text-sm">
            <p><strong>Risk score:</strong> {result.score}/100</p>
            <p><strong>Kategori:</strong> {result.category}</p>
            <p><strong>Alasan utama model:</strong> {result.reasons.join(', ')}</p>
            <p><strong>6–12 month complications probability:</strong> {result.complicationProbability ?? '-'}%</p>
            <p><strong>Hospitalization risk:</strong> {result.hospitalizationRisk ?? '-'}%</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
