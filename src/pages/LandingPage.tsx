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
import BrandLogo from '../components/BrandLogo';
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
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-5">
          <BrandLogo size="lg" showText={false} />
        </div>
        <h1 className="text-4xl font-bold md:text-5xl">EcoDiab — Sustainable AI Diabetes Care</h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          Paperless ecosystem, early risk prediction, optimized follow-up, and low-carbon care for developing countries.
        </p>
        {isAuthenticated ? (
          <Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
            Lanjut ke Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            onClick={() => {
              login('demo-session-token');
              navigate(redirectTo);
            }}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Login & Open Demo <ArrowRight className="h-4 w-4" />
          </button>
        )}
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
