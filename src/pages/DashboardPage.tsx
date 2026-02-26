import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/Card';
import { EmptyState, ErrorState } from '../components/PageState';
import Table from '../components/Table';
import { useToast } from '../components/Toast';
import { api, type DashboardPayload } from '../lib/api';
import { dictionary, useAppContext } from '../lib/app-context';
import { logError, logEvent } from '../lib/logger';
import { alerts as mockAlerts, dashboardMetrics, monthlyPaperReduction, monthlyVisitReduction, riskDistribution } from '../lib/mock';
import {
  matchWidgetsByRules,
  type ActionWidget,
  type DashboardWidget,
  type PatientProfile,
  type RiskLevel,
  widgetRegistry,
} from '../lib/dashboard-widgets';

const severityClass: Record<string, string> = {
  Low: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200',
  Moderate: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-200',
  High: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/40 dark:text-rose-200',
  Critical: 'bg-rose-100 text-rose-900 ring-rose-300 dark:bg-rose-900/40 dark:text-rose-100',
};

const riskOptions: RiskLevel[] = ['Low', 'Moderate', 'High', 'Critical'];
const profileOptions: PatientProfile[] = ['newly-diagnosed', 'adherence-challenge', 'telemedicine-ready', 'comorbidity-care'];

const profileLabel: Record<PatientProfile, string> = {
  'newly-diagnosed': 'Newly diagnosed',
  'adherence-challenge': 'Adherence challenge',
  'telemedicine-ready': 'Telemedicine ready',
  'comorbidity-care': 'Comorbidity care',
};

function WidgetSkeletonGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-4 h-8 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}

function WidgetContent({ widget }: { widget: DashboardWidget }) {
  if (widget.type === 'metric') {
    const trendColor = widget.trend === 'down' ? 'text-rose-600 dark:text-rose-300' : 'text-emerald-600 dark:text-emerald-300';
    return (
      <>
        <p className="text-sm text-slate-600 dark:text-slate-300">{widget.description}</p>
        <p className="mt-4 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{widget.metricLabel}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{widget.metricValue}</p>
        {widget.trend ? <p className={`mt-1 text-xs font-medium ${trendColor}`}>Trend: {widget.trend}</p> : null}
      </>
    );
  }

  if (widget.type === 'insight') {
    return (
      <>
        <p className="text-sm text-slate-600 dark:text-slate-300">{widget.description}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
          {widget.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </>
    );
  }

  const actionWidget = widget as ActionWidget;
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-300">{actionWidget.description}</p>
      <Link
        to={actionWidget.href}
        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-700"
      >
        {actionWidget.actionLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </>
  );
}

export default function DashboardPage() {
  const { lang } = useAppContext();
  const { pushToast } = useToast();
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile>('adherence-challenge');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('High');

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = await api.getDashboard();
      setDashboard(payload);
      logEvent('dashboard_loaded', { source: 'api' });
    } catch (err) {
      setError('Data dashboard tidak tersedia. Menampilkan data demo.');
      setDashboard({
        metrics: dashboardMetrics,
        riskDistribution,
        monthlyVisitReduction,
        monthlyPaperReduction,
        alerts: mockAlerts,
      });
      logError('dashboard_load', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const personalizedWidgets = useMemo(
    () => matchWidgetsByRules(widgetRegistry, { patientProfile, riskLevel }),
    [patientProfile, riskLevel]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/40 dark:to-cyan-950/30">
        <p className="text-sm text-slate-500 dark:text-slate-300">{dictionary[lang].welcome}. {dictionary[lang].demoLabel}</p>
        <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-tight text-slate-900 dark:text-white">Clinical insights and sustainability actions at a glance.</h2>
      </section>

      <Card title="Personalized dashboard widgets" tone="primary">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Patient profile
            <select
              value={patientProfile}
              onChange={(event) => setPatientProfile(event.target.value as PatientProfile)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              {profileOptions.map((profile) => (
                <option key={profile} value={profile}>{profileLabel[profile]}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Risk level
            <select
              value={riskLevel}
              onChange={(event) => setRiskLevel(event.target.value as RiskLevel)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              {riskOptions.map((risk) => (
                <option key={risk} value={risk}>{risk}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4">
          {loading ? <WidgetSkeletonGrid /> : null}
          {!loading && personalizedWidgets.length === 0 ? (
            <EmptyState message="Belum ada widget yang cocok untuk kombinasi profile + risk ini." />
          ) : null}
          {!loading && personalizedWidgets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {personalizedWidgets.map((widget) => (
                <Card key={widget.id} title={widget.title}>
                  <WidgetContent widget={widget} />
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </Card>

      {error ? <ErrorState message={error} onRetry={() => void loadDashboard()} /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Active patients" tone="primary"><p className="text-3xl font-bold text-slate-900 dark:text-white">{dashboard?.metrics.activePatients ?? '-'}</p></Card>
        <Card title="High-risk patients" tone="primary"><p className="text-3xl font-bold text-rose-600 dark:text-rose-300">{dashboard?.metrics.highRisk ?? '-'}</p></Card>
        <Card title="Telemedicine-eligible"><p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{dashboard?.metrics.telemedicineEligible ?? '-'}</p></Card>
        <Card title="Estimated CO2 saved (kg)"><p className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">{dashboard?.metrics.co2SavedKg ?? '-'}</p></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Risk distribution"><ResponsiveContainer width="100%" height={240}><BarChart data={dashboard?.riskDistribution ?? []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="tier" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></Card>
        <Card title="Visits reduced"><ResponsiveContainer width="100%" height={240}><LineChart data={dashboard?.monthlyVisitReduction ?? []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></Card>
        <Card title="Paper reduced"><ResponsiveContainer width="100%" height={240}><AreaChart data={dashboard?.monthlyPaperReduction ?? []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area type="monotone" dataKey="value" stroke="#059669" fill="#6ee7b7" /></AreaChart></ResponsiveContainer></Card>
      </div>

      <Card title="Recent alerts">
        {(dashboard?.alerts.length ?? 0) === 0 ? <EmptyState message="Belum ada alert klinis terbaru." /> : null}
        {(dashboard?.alerts.length ?? 0) > 0 ? (
          <Table headers={['Severity', 'Patient', 'Recommended action']}>
            {(dashboard?.alerts ?? []).map((alert) => (
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
        ) : null}
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Link to="/ai-risk" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-700" onClick={() => pushToast('Membuka modul AI Risk Stratification')}>
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
