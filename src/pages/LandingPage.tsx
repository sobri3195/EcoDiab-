import { ArrowRight, Brain, CalendarClock, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingLayout from '../layouts/MarketingLayout';

export default function LandingPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-bold md:text-5xl">EcoDiab — Sustainable AI Diabetes Care</h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          Paperless ecosystem, early risk prediction, optimized follow-up, and low-carbon care for developing countries.
        </p>
        <Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
          Explore Demo <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section id="features" className="mx-auto grid max-w-6xl gap-4 px-4 pb-14 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><Brain className="mb-2" />AI Risk Engine</div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><CalendarClock className="mb-2" />Smart Follow-Up Optimizer</div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><Leaf className="mb-2" />Green Monitoring</div>
      </section>

      <section id="impact" className="bg-emerald-700 py-8 text-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 text-center md:grid-cols-4">
          <p>↓ unnecessary visits</p><p>↓ paper usage</p><p>↓ transport emissions</p><p>↑ early detection</p>
        </div>
      </section>

      <section id="steps" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-5 text-2xl font-semibold">How it works</h2>
        <ol className="grid gap-3 md:grid-cols-4">
          <li className="rounded-lg border p-4">1. Input routine patient metrics</li>
          <li className="rounded-lg border p-4">2. Run deterministic AI-risk simulation</li>
          <li className="rounded-lg border p-4">3. Optimize follow-up path</li>
          <li className="rounded-lg border p-4">4. Track sustainability impact</li>
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl font-semibold">Designed for developing countries</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Works without expensive wearables, supports EMR-light/manual input workflows, and focuses on practical interventions.
        </p>
      </section>

      <footer className="border-t border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700">Demo only, not medical advice.</footer>
    </MarketingLayout>
  );
}
