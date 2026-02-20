import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/Card';
import Table from '../components/Table';
import { alerts, dashboardMetrics, monthlyPaperReduction, monthlyVisitReduction, riskDistribution } from '../lib/mock';
import { dictionary, useAppContext } from '../lib/app-context';

export default function DashboardPage() {
  const { lang } = useAppContext();
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">{dictionary[lang].welcome}. {dictionary[lang].demoLabel}</p>
      <div className="grid gap-3 md:grid-cols-4">
        <Card title="Active patients"><p className="text-2xl font-bold">{dashboardMetrics.activePatients}</p></Card>
        <Card title="High-risk patients"><p className="text-2xl font-bold">{dashboardMetrics.highRisk}</p></Card>
        <Card title="Telemedicine-eligible"><p className="text-2xl font-bold">{dashboardMetrics.telemedicineEligible}</p></Card>
        <Card title="Estimated CO2 saved (kg)"><p className="text-2xl font-bold">{dashboardMetrics.co2SavedKg}</p></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Risk distribution"><ResponsiveContainer width="100%" height={220}><BarChart data={riskDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="tier" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#10b981" /></BarChart></ResponsiveContainer></Card>
        <Card title="Visits reduced"><ResponsiveContainer width="100%" height={220}><LineChart data={monthlyVisitReduction}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#2563eb" /></LineChart></ResponsiveContainer></Card>
        <Card title="Paper reduced"><ResponsiveContainer width="100%" height={220}><AreaChart data={monthlyPaperReduction}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area type="monotone" dataKey="value" stroke="#059669" fill="#6ee7b7" /></AreaChart></ResponsiveContainer></Card>
      </div>

      <Card title="Recent alerts">
        <Table headers={['Severity', 'Patient', 'Recommended action']}>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td className="px-4 py-3 text-sm">{alert.severity}</td>
              <td className="px-4 py-3 text-sm">{alert.patient}</td>
              <td className="px-4 py-3 text-sm">{alert.action}</td>
            </tr>
          ))}
        </Table>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link to="/ai-risk" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Run Risk Stratification</Link>
        <Link to="/follow-up" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Optimize Follow-up</Link>
        <Link to="/green" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">Generate Green Report</Link>
      </div>
    </div>
  );
}
