import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { greenMonthlySeries } from '../lib/mock';
import { queueReductionProxy } from '../lib/green';

export default function GreenPage() {
  const [open, setOpen] = useState(false);
  const totals = useMemo(() => {
    const avoidedVisits = greenMonthlySeries.reduce((acc, item) => acc + item.avoidedVisits, 0);
    const co2 = greenMonthlySeries.reduce((acc, item) => acc + item.co2, 0);
    return { avoidedVisits, co2, forms: avoidedVisits * 6, queueReduction: queueReductionProxy(Math.round(avoidedVisits / 6)) };
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Card title="Avoided in-person visits"><p className="text-2xl font-bold">{totals.avoidedVisits}</p></Card>
        <Card title="CO2 estimate (kg)"><p className="text-2xl font-bold">{totals.co2}</p></Card>
        <Card title="Paper forms eliminated"><p className="text-2xl font-bold">{totals.forms}</p></Card>
        <Card title="Queue time reduction proxy"><p className="text-2xl font-bold">{totals.queueReduction}%</p></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Monthly CO2 saved"><ResponsiveContainer width="100%" height={240}><LineChart data={greenMonthlySeries}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="co2" stroke="#10b981" /></LineChart></ResponsiveContainer></Card>
        <Card title="Monthly visits avoided"><ResponsiveContainer width="100%" height={240}><BarChart data={greenMonthlySeries}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="avoidedVisits" fill="#0ea5e9" /></BarChart></ResponsiveContainer></Card>
      </div>

      <button onClick={() => setOpen(true)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Generate Sustainability Report</button>

      <Modal open={open} onClose={() => setOpen(false)} title="Printable Sustainability Report">
        <div className="printable-report space-y-2 text-sm">
          <h3 className="text-xl font-bold">EcoDiab Sustainability Snapshot</h3>
          <p>Period: Last 6 months</p>
          <p>Avoided in-person visits: {totals.avoidedVisits}</p>
          <p>Estimated CO2 reduction: {totals.co2} kg CO2e</p>
          <p>Paper forms eliminated: {totals.forms}</p>
          <p>Queue time reduction proxy: {totals.queueReduction}%</p>
          <p className="text-xs text-slate-500">Demo only. Estimates derived from deterministic mock formulas.</p>
          <button onClick={() => window.print()} className="rounded bg-slate-800 px-3 py-2 text-white">Print</button>
        </div>
      </Modal>
    </div>
  );
}
