import { useMemo, useState } from 'react';
import Card from '../components/Card';

const queue = [
  { patient: 'Budi Santoso', readiness: 95, channel: 'Video call' },
  { patient: 'Maya Putri', readiness: 82, channel: 'Chat + photo' },
  { patient: 'Rahmat H', readiness: 70, channel: 'Video call' },
];

export default function TelemedicineHubPage() {
  const [showReadyOnly, setShowReadyOnly] = useState(false);
  const items = useMemo(() => (showReadyOnly ? queue.filter((item) => item.readiness >= 80) : queue), [showReadyOnly]);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
        <h2 className="text-2xl font-bold text-slate-900">Telemedicine Hub</h2>
        <p className="mt-2 text-sm text-slate-600">Antrian kunjungan remote, kesiapan perangkat pasien, dan channel komunikasi prioritas.</p>
      </section>
      <Card title="Filter antrian telemedicine">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showReadyOnly} onChange={(event) => setShowReadyOnly(event.target.checked)} />
          Tampilkan hanya pasien readiness ≥ 80
        </label>
      </Card>
      <Card title="Antrian hari ini">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.patient} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <p className="font-semibold text-slate-800">{item.patient}</p>
              <p className="text-slate-600">{item.channel} · readiness {item.readiness}%</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
