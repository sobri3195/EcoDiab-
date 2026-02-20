import { useState } from 'react';
import Card from '../components/Card';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import { useToast } from '../components/Toast';
import { api } from '../lib/api';
import { logError, logEvent } from '../lib/logger';

export default function DietaryAssistantPage() {
  const { pushToast } = useToast();
  const [form, setForm] = useState({ patientId: '', calories: 1600, sugar: 30, preference: 'standard', allergies: '' });
  const [result, setResult] = useState<{ summary: string; recommendations: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = await api.getDietaryRecommendation({ ...form, allergies: form.allergies.split(',').map((item) => item.trim()).filter(Boolean) });
      setResult(payload);
      pushToast('Rekomendasi diet berhasil dimuat.');
      logEvent('dietary_submit', { patientId: form.patientId });
    } catch (err) {
      setError('Gagal memuat rekomendasi menu.');
      logError('dietary_load', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Dietary Assistant Interaktif">
      <div className="grid gap-2 md:grid-cols-2">
        <input placeholder="Patient ID" value={form.patientId} onChange={(e) => setForm((prev) => ({ ...prev, patientId: e.target.value }))} className="rounded border px-3 py-2 dark:bg-slate-900" />
        <input type="number" placeholder="Kalori" value={form.calories} onChange={(e) => setForm((prev) => ({ ...prev, calories: Number(e.target.value) }))} className="rounded border px-3 py-2 dark:bg-slate-900" />
        <input type="number" placeholder="Gula (gram)" value={form.sugar} onChange={(e) => setForm((prev) => ({ ...prev, sugar: Number(e.target.value) }))} className="rounded border px-3 py-2 dark:bg-slate-900" />
        <select value={form.preference} onChange={(e) => setForm((prev) => ({ ...prev, preference: e.target.value }))} className="rounded border px-3 py-2 dark:bg-slate-900"><option value="standard">Standard</option><option value="vegan">Vegan</option><option value="low-carb">Low Carb</option></select>
        <input placeholder="Alergi (pisahkan koma)" value={form.allergies} onChange={(e) => setForm((prev) => ({ ...prev, allergies: e.target.value }))} className="rounded border px-3 py-2 dark:bg-slate-900 md:col-span-2" />
      </div>
      <button onClick={() => void fetchRecommendation()} className="mt-3 rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Ambil rekomendasi</button>

      <div className="mt-4">
        {loading ? <LoadingState label="Memuat rekomendasi..." /> : null}
        {error ? <ErrorState message={error} onRetry={() => void fetchRecommendation()} /> : null}
        {!loading && !error && !result ? <EmptyState message="Belum ada ringkasan diet." actionLabel="Mulai" onAction={() => void fetchRecommendation()} /> : null}
        {result ? (
          <div className="space-y-2 rounded border p-3 text-sm">
            <p><strong>Ringkasan harian:</strong> {result.summary}</p>
            <p className="font-semibold">Rekomendasi menu:</p>
            <ul className="list-disc pl-5">
              {result.recommendations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
