import { CheckCheck, Clock3, Search, Siren, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import Card from '../components/Card';
import { useToast } from '../components/Toast';
import { useAlertCenter } from '../lib/alert-center-context';
import type { Alert } from '../lib/mock';

type StatusFilter = 'all' | 'open' | 'resolved';
type SeverityFilter = 'all' | 'High' | 'Moderate' | 'Low';

const severityClass: Record<Alert['severity'], string> = {
  Low: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200',
  Moderate: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-200',
  High: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/40 dark:text-rose-200',
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));

export default function SmartAlertCenterPage() {
  const { alerts, resolveAlert, resolveAllVisible } = useAlertCenter();
  const { pushToast } = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('open');
  const [severity, setSeverity] = useState<SeverityFilter>('all');
  const [busyIds, setBusyIds] = useState<string[]>([]);

  const filteredAlerts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return alerts
      .filter((alert) => {
        if (status === 'open' && alert.resolved) return false;
        if (status === 'resolved' && !alert.resolved) return false;
        if (severity !== 'all' && alert.severity !== severity) return false;
        if (!normalizedQuery) return true;
        return [alert.patient, alert.title, alert.action, alert.category].join(' ').toLowerCase().includes(normalizedQuery);
      })
      .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
  }, [alerts, query, severity, status]);

  const handleResolve = async (id: string) => {
    setBusyIds((current) => [...current, id]);
    try {
      await resolveAlert(id);
      pushToast('Alert berhasil ditandai sebagai resolved.');
    } catch {
      pushToast('Gagal memperbarui alert. Coba lagi.');
    } finally {
      setBusyIds((current) => current.filter((busyId) => busyId !== id));
    }
  };

  const handleResolveVisible = async () => {
    const openVisibleIds = filteredAlerts.filter((alert) => !alert.resolved).map((alert) => alert.id);
    if (openVisibleIds.length === 0) return;
    setBusyIds((current) => [...current, ...openVisibleIds]);
    try {
      await resolveAllVisible(openVisibleIds);
      pushToast(`${openVisibleIds.length} alert ditandai resolved.`);
    } catch {
      pushToast('Gagal menandai seluruh alert.');
    } finally {
      setBusyIds((current) => current.filter((id) => !openVisibleIds.includes(id)));
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Smart Alert Center" tone="primary">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">Monitor alert klinis dengan filter cepat, pencarian, dan tindakan instan.</p>
          <button
            onClick={() => void handleResolveVisible()}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={filteredAlerts.every((alert) => alert.resolved)}
          >
            <CheckCheck className="h-4 w-4" /> Resolve visible
          </button>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari pasien, kategori, atau tindakan..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-1 dark:border-slate-700">
            {(['all', 'open', 'resolved'] as StatusFilter[]).map((value) => (
              <button
                key={value}
                onClick={() => setStatus(value)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${status === value ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-200'}`}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-1 dark:border-slate-700">
            {(['all', 'High', 'Moderate', 'Low'] as SeverityFilter[]).map((value) => (
              <button
                key={value}
                onClick={() => setSeverity(value)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold ${severity === value ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-200'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700">Tidak ada alert yang cocok dengan filter saat ini.</p> : null}
        {filteredAlerts.map((alert) => {
          const busy = busyIds.includes(alert.id);
          return (
            <article key={alert.id} className={`rounded-xl border p-4 transition ${alert.resolved ? 'border-slate-200 bg-slate-50/80 opacity-80 dark:border-slate-700 dark:bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${severityClass[alert.severity]}`}>{alert.severity}</span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{alert.category}</span>
                    <span className="text-xs text-slate-500">{formatDate(alert.createdAt)}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{alert.title}</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{alert.patient} • {alert.action}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                    <UserPlus className="h-4 w-4" /> Assign
                  </button>
                  <button className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                    <Clock3 className="h-4 w-4" /> Snooze
                  </button>
                  <button
                    onClick={() => void handleResolve(alert.id)}
                    disabled={alert.resolved || busy}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    <Siren className="h-4 w-4" /> {alert.resolved ? 'Resolved' : busy ? 'Saving...' : 'Mark resolved'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
