import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { dietaryEmissionTrend, foodSubstitutions, greenMonthlySeries } from '../lib/mock';
import { queueReductionProxy } from '../lib/green';

function InfoTip({ text }: { text: string }) {
  return (
    <span
      className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700"
      title={text}
      aria-label={text}
    >
      i
    </span>
  );
}

export default function GreenPage() {
  const [open, setOpen] = useState(false);
  const [selectedSubstitutionId, setSelectedSubstitutionId] = useState(foodSubstitutions[0].id);
  const [weeklyFrequency, setWeeklyFrequency] = useState(4);

  const totals = useMemo(() => {
    const avoidedVisits = greenMonthlySeries.reduce((acc, item) => acc + item.avoidedVisits, 0);
    const co2 = greenMonthlySeries.reduce((acc, item) => acc + item.co2, 0);
    return { avoidedVisits, co2, forms: avoidedVisits * 6, queueReduction: queueReductionProxy(Math.round(avoidedVisits / 6)) };
  }, []);

  const latestDietScore = dietaryEmissionTrend[dietaryEmissionTrend.length - 1].score;
  const baselineDietScore = dietaryEmissionTrend[0].score;
  const scoreImprovement = baselineDietScore - latestDietScore;

  const selectedSubstitution = useMemo(
    () => foodSubstitutions.find((item) => item.id === selectedSubstitutionId) ?? foodSubstitutions[0],
    [selectedSubstitutionId],
  );

  const yearlySaving = useMemo(() => {
    const savedPerMeal = selectedSubstitution.currentKgCo2 - selectedSubstitution.alternativeKgCo2;
    return Math.max(0, savedPerMeal * weeklyFrequency * 52);
  }, [selectedSubstitution, weeklyFrequency]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Card title="Avoided in-person visits">
          <p className="text-2xl font-bold">{totals.avoidedVisits}</p>
        </Card>
        <Card title="CO2 estimate (kg)">
          <p className="text-2xl font-bold">{totals.co2}</p>
        </Card>
        <Card title="Paper forms eliminated">
          <p className="text-2xl font-bold">{totals.forms}</p>
        </Card>
        <Card title="Queue time reduction proxy">
          <p className="text-2xl font-bold">{totals.queueReduction}%</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Monthly CO2 saved">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={greenMonthlySeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value} kg CO2e`, 'Penghematan']} />
              <Line type="monotone" dataKey="co2" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Monthly visits avoided">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={greenMonthlySeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value} kunjungan`, 'Kunjungan tersubstitusi telemed']} />
              <Bar dataKey="avoidedVisits" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card
          title="Green Impact Score (Diet)"
          className="space-y-3"
        >
          <div className="flex items-start justify-between gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide">Skor saat ini</p>
              <p className="text-3xl font-bold">{latestDietScore}/100</p>
              <p className="mt-1 text-xs">Turun {scoreImprovement} poin dari baseline. Semakin rendah, emisi diet makin hemat.</p>
            </div>
            <InfoTip text="Green Impact Score menghitung estimasi emisi dari pola makan mingguan. Nilai lebih rendah berarti jejak karbon lebih ringan." />
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dietaryEmissionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[40, 80]} />
              <Tooltip
                formatter={(value: number) => [`${value} / 100`, 'Skor emisi diet']}
                labelFormatter={(label: string) => `${label}`}
              />
              <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-xs text-slate-500">
            Tip: fokus menukar sumber protein tinggi emisi 3-4 kali per minggu untuk menurunkan skor secara bertahap.
          </p>
        </Card>

        <Card title="Simulator substitusi makanan" className="space-y-3">
          <p className="text-sm text-slate-600">Pilih makanan yang sering dikonsumsi, lalu lihat potensi pengurangan emisinya.</p>

          <label className="block text-sm font-medium text-slate-700">
            Pilihan substitusi
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
              value={selectedSubstitution.id}
              onChange={(event) => setSelectedSubstitutionId(event.target.value)}
            >
              {foodSubstitutions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.current} → {item.alternative}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Frekuensi per minggu: <span className="font-bold">{weeklyFrequency}x</span>
            <input
              className="mt-2 w-full"
              type="range"
              min={1}
              max={14}
              value={weeklyFrequency}
              onChange={(event) => setWeeklyFrequency(Number(event.target.value))}
            />
          </label>

          <div className="space-y-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm">
            <p>
              <span className="font-semibold">Saat ini:</span> {selectedSubstitution.current} ({selectedSubstitution.currentKgCo2} kg CO2e/porsi)
            </p>
            <p>
              <span className="font-semibold">Alternatif:</span> {selectedSubstitution.alternative} ({selectedSubstitution.alternativeKgCo2} kg CO2e/porsi)
            </p>
            <p className="text-base font-bold text-emerald-700">
              Potensi hemat tahunan: {yearlySaving.toFixed(1)} kg CO2e
            </p>
            <p className="text-xs text-slate-600">Setara dengan mengurangi perjalanan motor sekitar {(yearlySaving * 4).toFixed(0)} km.</p>
          </div>

          <p className="flex items-center gap-2 text-xs text-slate-500">
            <InfoTip text="Ini adalah simulasi edukasi berbasis data rata-rata emisi pangan. Hasil nyata bisa berbeda tergantung porsi dan sumber bahan makanan." />
            Hover ikon info untuk lihat penjelasan sederhana.
          </p>
        </Card>
      </div>

      <button onClick={() => setOpen(true)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
        Generate Sustainability Report
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Printable Sustainability Report">
        <div className="printable-report space-y-2 text-sm">
          <h3 className="text-xl font-bold">EcoDiab Sustainability Snapshot</h3>
          <p>Period: Last 6 months</p>
          <p>Avoided in-person visits: {totals.avoidedVisits}</p>
          <p>Estimated CO2 reduction: {totals.co2} kg CO2e</p>
          <p>Paper forms eliminated: {totals.forms}</p>
          <p>Queue time reduction proxy: {totals.queueReduction}%</p>
          <p>Diet Green Impact Score: {latestDietScore}/100</p>
          <p className="text-xs text-slate-500">Demo only. Estimates derived from deterministic mock formulas.</p>
          <button onClick={() => window.print()} className="rounded bg-slate-800 px-3 py-2 text-white">
            Print
          </button>
        </div>
      </Modal>
    </div>
  );
}
