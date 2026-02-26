import { Award, CircleCheckBig, Gauge, RotateCcw, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAppContext } from '../lib/app-context';
import {
  buildAchievementSummary,
  createInitialProgress,
  loadEducationProgress,
  microLessons,
  saveEducationProgress,
} from '../lib/patient-education';
import { useMemo, useState } from 'react';

export default function PatientEducationAchievementsPage() {
  const { currentUserId } = useAppContext();
  const [progress, setProgress] = useState(() => loadEducationProgress(currentUserId));
  const summary = useMemo(() => buildAchievementSummary(progress), [progress]);

  const resetProgress = () => {
    const fresh = createInitialProgress();
    setProgress(fresh);
    saveEducationProgress(currentUserId, fresh);
  };

  return (
    <div className="space-y-4">
      <Card tone="primary">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Achievement Summary</p>
            <h2 className="text-xl font-bold">Ringkasan pencapaian edukasi pasien</h2>
          </div>
          <div className="flex gap-2">
            <Link to="/education" className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Kembali ke Lesson</Link>
            <button onClick={resetProgress} className="inline-flex items-center gap-1 rounded-lg border border-rose-400 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-900/20">
              <RotateCcw className="h-4 w-4" /> Reset Progress
            </button>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Lesson selesai', value: `${summary.completedLessons}/${microLessons.length}`, icon: CircleCheckBig },
          { label: 'Completion rate', value: `${summary.completionRate}%`, icon: Target },
          { label: 'Akurasi quiz', value: `${summary.accuracyRate}%`, icon: Gauge },
          { label: 'Total attempt', value: String(summary.totalAttempts), icon: Award },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-0">
            <div className="flex items-center gap-3 p-4">
              <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"><Icon className="h-4 w-4" /></span>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Badge yang sudah didapat">
        {summary.badges.length ? (
          <div className="flex flex-wrap gap-2">
            {summary.badges.map((badge) => (
              <span key={badge} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                {badge}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Belum ada badge. Selesaikan lesson pertama untuk membuka badge awal.</p>
        )}
      </Card>

      <Card title="Aktivitas terakhir">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Update terakhir: <span className="font-semibold">{new Date(progress.updatedAt).toLocaleString('id-ID')}</span>
        </p>
      </Card>
    </div>
  );
}
