import {
  ArrowRight,
  Brain,
  CalendarClock,
  CheckCircle2,
  HeartPulse,
  Leaf,
  ShieldCheck,
  Sprout,
  Stethoscope,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MarketingLayout from '../layouts/MarketingLayout';
import { useAppContext } from '../lib/app-context';

const features = [
  {
    icon: Brain,
    title: 'AI Risk Engine',
    description:
      'Model prediktif untuk identifikasi dini pasien dengan risiko komplikasi tinggi, agar intervensi dilakukan lebih cepat.',
  },
  {
    icon: CalendarClock,
    title: 'Smart Follow-Up Optimizer',
    description: 'Penjadwalan tindak lanjut otomatis berdasarkan tingkat risiko, kepatuhan, dan prioritas klinis.',
  },
  {
    icon: Leaf,
    title: 'Green Monitoring',
    description: 'Pemantauan pengurangan jejak karbon layanan kesehatan melalui proses paperless dan kunjungan yang lebih efisien.',
  },
];

const steps = [
  {
    icon: Stethoscope,
    title: 'Input Data Klinis',
    description: 'Tim kesehatan memasukkan indikator penting pasien ke dalam dashboard terpadu.',
  },
  {
    icon: Brain,
    title: 'Analisis Risiko AI',
    description: 'Sistem mengelompokkan pasien berdasarkan level risiko dan memberi rekomendasi tindak lanjut.',
  },
  {
    icon: Sprout,
    title: 'Intervensi Tepat & Hijau',
    description: 'Follow-up diprioritaskan untuk pasien kritis sambil mengurangi kunjungan dan dokumen yang tidak perlu.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAppContext();
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo ?? '/dashboard';

  return (
    <MarketingLayout>
      <section className="relative isolate overflow-hidden">
        <div className="absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl dark:bg-emerald-700/30" />
        <div className="absolute -right-16 top-44 -z-10 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-700/30" />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" /> Platform untuk perawatan diabetes berkelanjutan
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              Perawatan Diabetes Lebih <span className="text-emerald-600 dark:text-emerald-400">Cerdas</span>,{' '}
              <span className="text-sky-600 dark:text-sky-400">Cepat</span>, dan Ramah Lingkungan.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              EcoDiab membantu fasilitas kesehatan melakukan stratifikasi risiko, optimalisasi jadwal kontrol, dan pemantauan dampak
              lingkungan dalam satu pengalaman digital yang intuitif.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  Lanjut ke Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  onClick={() => {
                    login('demo-session-token');
                    navigate(redirectTo);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  Login & Open Demo <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Eksplor Fitur
              </a>
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <p className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Prioritas pasien berbasis data real-time
              </p>
              <p className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Desain antarmuka ringan dan mudah diakses
              </p>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
            <h2 className="text-lg font-semibold">Analisis cepat dampak EcoDiab</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Efisiensi Follow-up</p>
                <p className="mt-1 text-3xl font-bold text-emerald-700 dark:text-emerald-300">+38%</p>
              </div>
              <div className="rounded-xl bg-sky-50 p-4 dark:bg-sky-900/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Deteksi Risiko Dini</p>
                <p className="mt-1 text-3xl font-bold text-sky-700 dark:text-sky-300">2.4x</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Penghematan Kertas</p>
                <p className="mt-1 text-3xl font-bold text-amber-700 dark:text-amber-300">~65%</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Fitur utama</p>
            <h2 className="text-2xl font-bold md:text-3xl">Fondasi UI/UX yang fokus pada keputusan klinis</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <Icon className="mb-3 h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="impact" className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-bold md:text-3xl">Analisis detail dan mendalam terhadap pengalaman pengguna</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Redesain menitikberatkan pada visual hierarchy yang kuat, CTA kontras tinggi, serta struktur informasi bertahap agar tenaga
            kesehatan dapat menemukan aksi penting dalam <span className="font-semibold">kurang dari 3 klik</span>.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Visual Clarity', value: 'A+', icon: HeartPulse },
              { label: 'Action Discoverability', value: '92%', icon: ArrowRight },
              { label: 'Trust & Safety Cues', value: 'High', icon: ShieldCheck },
              { label: 'Sustainability Signal', value: 'Strong', icon: Leaf },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <Icon className="h-5 w-5 text-emerald-600" />
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="steps" className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <h2 className="text-2xl font-bold md:text-3xl">How it works</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, idx) => (
            <article key={title} className="relative rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <span className="absolute right-4 top-4 text-xs font-bold text-slate-400">0{idx + 1}</span>
              <Icon className="h-6 w-6 text-emerald-600" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
