import { ArrowRight, Brain, CalendarClock, Leaf } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MarketingLayout from '../layouts/MarketingLayout';
import { useAppContext } from '../lib/app-context';

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAppContext();
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo ?? '/dashboard';

  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-4 py-16">
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

      <section id="features" className="mx-auto grid max-w-6xl gap-4 px-4 pb-14 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><Brain className="mb-2" />AI Risk Engine</div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><CalendarClock className="mb-2" />Smart Follow-Up Optimizer</div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><Leaf className="mb-2" />Green Monitoring</div>
      </section>
    </MarketingLayout>
  );
}
