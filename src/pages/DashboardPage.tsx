import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/Card';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import Table from '../components/Table';
import { useToast } from '../components/Toast';
import { api, type DashboardPayload } from '../lib/api';
import { dictionary, useAppContext } from '../lib/app-context';
import { logError, logEvent } from '../lib/logger';

const severityClass: Record<string, string> = {
  Low: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-200',
  High: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/40 dark:text-rose-200',
};

export default function DashboardPage() {
  const { lang } = useAppContext();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/40 dark:to-cyan-950/30">
        <p className="text-sm text-slate-500 dark:text-slate-300">{dictionary[lang].welcome}. {dictionary[lang].demoLabel}</p>
        <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-tight text-slate-900 dark:text-white">Clinical insights and sustainability actions at a glance.</h2>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Active patients" tone="primary"><p className="text-3xl font-bold text-slate-900 dark:text-white">{dashboardMetrics.activePatients}</p></Card>
        <Card title="High-risk patients" tone="primary"><p className="text-3xl font-bold text-rose-600 dark:text-rose-300">{dashboardMetrics.highRisk}</p></Card>
        <Card title="Telemedicine-eligible"><p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{dashboardMetrics.telemedicineEligible}</p></Card>
        <Card title="Estimated CO2 saved (kg)"><p className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">{dashboardMetrics.co2SavedKg}</p></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Risk distribution"><ResponsiveContainer width="100%" height={240}><BarChart data={riskDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="tier" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></Card>
        <Card title="Visits reduced"><ResponsiveContainer width="100%" height={240}><LineChart data={monthlyVisitReduction}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></Card>
        <Card title="Paper reduced"><ResponsiveContainer width="100%" height={240}><AreaChart data={monthlyPaperReduction}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area type="monotone" dataKey="value" stroke="#059669" fill="#6ee7b7" /></AreaChart></ResponsiveContainer></Card>
      </div>

      <Card title="Recent alerts">
        <Table headers={['Severity', 'Patient', 'Recommended action']}>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td className="px-4 py-3 text-sm">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${severityClass[alert.severity] ?? 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
                  {alert.severity}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">{alert.patient}</td>
              <td className="px-4 py-3 text-sm">{alert.action}</td>
            </tr>
          ))}
        </Table>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Link to="/ai-risk" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-700">
          Run Risk Stratification <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/follow-up" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700">
          Optimize Follow-up <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/green" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-700">
          Generate Green Report <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
