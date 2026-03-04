import Card from '../components/Card';

const trendSignals = [
  { metric: 'HbA1c', value: '8.1%', signal: 'Perlu intensifikasi diet' },
  { metric: 'eGFR', value: '61', signal: 'Pantau fungsi ginjal per 3 bulan' },
  { metric: 'LDL', value: '132 mg/dL', signal: 'Pertimbangkan evaluasi terapi lipid' },
];

export default function LabInsightsPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 p-6">
        <h2 className="text-2xl font-bold text-slate-900">Lab Insights</h2>
        <p className="mt-2 text-sm text-slate-600">Deteksi dini dari tren pemeriksaan laboratorium dengan insight klinis yang lebih mudah ditindaklanjuti.</p>
      </section>
      <Card title="Highlight sinyal klinis">
        <ul className="space-y-2 text-sm">
          {trendSignals.map((signal) => (
            <li key={signal.metric} className="rounded-lg border border-slate-200 px-3 py-2">
              <p className="font-semibold text-slate-800">{signal.metric}: {signal.value}</p>
              <p className="text-slate-600">{signal.signal}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
