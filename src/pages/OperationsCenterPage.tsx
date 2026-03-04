import Card from '../components/Card';

const backlog = [
  'Automasi reminder follow-up via WhatsApp',
  'Penyesuaian jadwal klinik hybrid',
  'Optimasi distribusi edukator pasien',
  'Review SLA telemedicine > 95%',
];

export default function OperationsCenterPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 p-6">
        <h2 className="text-2xl font-bold text-slate-900">Operations Center</h2>
        <p className="mt-2 text-sm text-slate-600">Pusat kendali operasional untuk sinkronisasi tim klinik, alokasi resource, dan efisiensi layanan.</p>
      </section>
      <Card title="Prioritas sprint operasional">
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
          {backlog.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
