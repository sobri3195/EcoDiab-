import { useState } from 'react';
import Card from '../components/Card';

const activities = ['Kelas edukasi nutrisi', 'Kelompok jalan pagi', 'Webinar manajemen gula darah', 'Sesi pendamping caregiver'];

export default function CommunitySupportPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (activity: string) => {
    setSelected((prev) => (prev.includes(activity) ? prev.filter((item) => item !== activity) : [...prev, activity]));
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-lime-50 p-6">
        <h2 className="text-2xl font-bold text-slate-900">Community Support</h2>
        <p className="mt-2 text-sm text-slate-600">Aktifkan dukungan komunitas untuk menjaga konsistensi pola hidup sehat pasien diabetes.</p>
      </section>
      <Card title="Program komunitas minggu ini">
        <div className="grid gap-2 md:grid-cols-2">
          {activities.map((activity) => (
            <button key={activity} onClick={() => toggle(activity)} className={`rounded-lg border px-3 py-2 text-left text-sm ${selected.includes(activity) ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-700'}`}>
              {activity}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600">Dipilih: {selected.length} kegiatan</p>
      </Card>
    </div>
  );
}
