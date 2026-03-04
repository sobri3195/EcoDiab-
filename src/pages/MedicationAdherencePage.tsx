import { useMemo, useState } from 'react';
import Card from '../components/Card';

const adherenceData = [
  { name: 'Metformin', schedule: '2x/hari', adherence: 92 },
  { name: 'Insulin basal', schedule: '1x/hari', adherence: 81 },
  { name: 'Vitamin D', schedule: '1x/hari', adherence: 74 },
];

export default function MedicationAdherencePage() {
  const [threshold, setThreshold] = useState(85);
  const riskyMeds = useMemo(() => adherenceData.filter((item) => item.adherence < threshold), [threshold]);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-orange-50 p-6">
        <h2 className="text-2xl font-bold text-slate-900">Medication Adherence</h2>
        <p className="mt-2 text-sm text-slate-600">Pantau kepatuhan minum obat, identifikasi pasien berisiko, dan aktifkan reminder lebih cepat.</p>
      </section>

      <Card title="Target kepatuhan minimum">
        <input type="range" min={70} max={95} value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} className="w-full" />
        <p className="mt-2 text-sm text-slate-600">Ambang saat ini: <span className="font-semibold">{threshold}%</span></p>
      </Card>

      <Card title="Obat dengan risiko non-adherence">
        {riskyMeds.length === 0 ? <p className="text-sm text-emerald-700">Semua regimen di atas target.</p> : (
          <ul className="space-y-2 text-sm">
            {riskyMeds.map((med) => (
              <li key={med.name} className="rounded-lg border border-slate-200 px-3 py-2">
                <p className="font-semibold text-slate-800">{med.name} · {med.schedule}</p>
                <p className="text-rose-700">Adherence {med.adherence}%</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
