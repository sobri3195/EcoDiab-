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
  TimerReset,
  Users,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MarketingLayout from '../layouts/MarketingLayout';
import { useAppContext } from '../lib/app-context';
import { useI18n } from '../lib/i18n';

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAppContext();
  const { t } = useI18n();

  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo ?? '/dashboard';

  const features = [
    { icon: Brain, title: t('landing.featureOneTitle'), description: t('landing.featureOneDescription') },
    { icon: CalendarClock, title: t('landing.featureTwoTitle'), description: t('landing.featureTwoDescription') },
    { icon: Leaf, title: t('landing.featureThreeTitle'), description: t('landing.featureThreeDescription') },
  ];

  const steps = [
    { icon: Stethoscope, title: t('landing.stepOneTitle'), description: t('landing.stepOneDescription') },
    { icon: Brain, title: t('landing.stepTwoTitle'), description: t('landing.stepTwoDescription') },
    { icon: Sprout, title: t('landing.stepThreeTitle'), description: t('landing.stepThreeDescription') },
  ];

  const highlights = [
    { icon: Users, label: t('landing.impactCardOne'), value: '120+' },
    { icon: TimerReset, label: t('landing.impactCardTwo'), value: '-42%' },
    { icon: HeartPulse, label: t('landing.impactCardThree'), value: '89%' },
  ];

  return (
    <MarketingLayout>
      <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl dark:bg-emerald-700/30" aria-hidden="true" />
        <div className="absolute -right-16 top-44 -z-10 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-700/30" aria-hidden="true" />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> {t('landing.badge')}
            </span>
            <h1 id="hero-title" className="mt-6 text-4xl font-bold leading-tight text-slate-900 md:text-6xl dark:text-slate-100">
              {t('landing.heroTitleStart')} <span className="text-emerald-700 dark:text-emerald-400">{t('landing.heroTitleStrongOne')}</span>
              {t('landing.heroTitleMiddle')} <span className="text-sky-700 dark:text-sky-400">{t('landing.heroTitleStrongTwo')}</span>
              {t('landing.heroTitleEnd')}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-700 dark:text-slate-200">{t('landing.heroDescription')}</p>

            <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Primary actions">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-700/30 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                >
                  {t('landing.ctaDashboard')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <button
                  onClick={() => {
                    login('demo-session-token');
                    navigate(redirectTo);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-700/30 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                >
                  {t('landing.ctaLogin')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-400 px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 dark:border-slate-500 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {t('landing.ctaExplore')}
              </a>
            </div>

            <ul className="mt-8 grid max-w-2xl gap-3 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2" role="list">
              {[t('landing.quickItemOne'), t('landing.quickItemTwo')].map((item) => (
                <li key={item} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-slate-300 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/80" aria-label={t('landing.quickAnalysisTitle')}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('landing.quickAnalysisTitle')}</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-emerald-100 p-4 dark:bg-emerald-900/25">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900 dark:text-emerald-200">{t('landing.efficiencyLabel')}</p>
                <p className="mt-1 text-3xl font-bold text-emerald-900 dark:text-emerald-200">+38%</p>
              </div>
              <div className="rounded-xl bg-sky-100 p-4 dark:bg-sky-900/25">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">{t('landing.detectionLabel')}</p>
                <p className="mt-1 text-3xl font-bold text-sky-900 dark:text-sky-200">2.4x</p>
              </div>
              <div className="rounded-xl bg-amber-100 p-4 dark:bg-amber-900/25">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">{t('landing.paperlessLabel')}</p>
                <p className="mt-1 text-3xl font-bold text-amber-900 dark:text-amber-200">~65%</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 pb-12" aria-labelledby="features-title">
        <h2 id="features-title" className="text-2xl font-bold md:text-3xl">{t('landing.featuresTitle')}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-xl border border-slate-300 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
              <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="impact" className="mx-auto max-w-6xl px-4 pb-10" aria-labelledby="impact-title">
        <h2 id="impact-title" className="text-2xl font-bold md:text-3xl">{t('landing.impactTitle')}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, label, value }) => (
            <article key={label} className="rounded-xl border border-slate-300 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10" aria-labelledby="ux-title">
        <div className="rounded-2xl border border-slate-300 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 id="ux-title" className="text-2xl font-bold md:text-3xl">{t('landing.uxTitle')}</h2>
          <p className="mt-3 text-slate-700 dark:text-slate-200">{t('landing.uxDescription')}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t('landing.uxVisual'), value: 'A+', icon: HeartPulse },
              { label: t('landing.uxDiscoverability'), value: '92%', icon: ArrowRight },
              { label: t('landing.uxTrust'), value: 'High', icon: ShieldCheck },
              { label: t('landing.uxSustainability'), value: 'Strong', icon: Leaf },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-slate-300 p-4 dark:border-slate-700">
                <Icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="steps" className="mx-auto max-w-6xl px-4 pb-10" aria-labelledby="steps-title">
        <h2 id="steps-title" className="text-2xl font-bold md:text-3xl">{t('landing.stepsTitle')}</h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, idx) => (
            <li key={title} className="list-none">
              <article className="relative rounded-xl border border-slate-300 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                <span className="absolute right-4 top-4 text-xs font-bold text-slate-600 dark:text-slate-300" aria-label={`Step ${idx + 1}`}>
                  0{idx + 1}
                </span>
                <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{description}</p>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12" aria-labelledby="final-cta-title">
        <div className="rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-700 to-teal-700 p-6 text-white shadow-lg md:flex md:items-center md:justify-between">
          <div>
            <h3 id="final-cta-title" className="text-2xl font-bold">{t('landing.finalCtaTitle')}</h3>
            <p className="mt-2 max-w-2xl text-emerald-100">{t('landing.finalCtaDescription')}</p>
          </div>
          <Link
            to="/dashboard"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-emerald-900 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700 md:mt-0"
          >
            {t('landing.finalCtaButton')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-300 bg-white/90 dark:border-slate-700 dark:bg-slate-950/80" role="contentinfo">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">EcoDiab</h4>
            <p className="mt-2 max-w-md text-sm text-slate-700 dark:text-slate-200">{t('landing.footerDescription')}</p>
          </div>
          <div>
            <h5 className="font-semibold text-slate-900 dark:text-slate-100">{t('landing.footerNav')}</h5>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li><a href="#features" className="rounded-sm hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">{t('nav.features')}</a></li>
              <li><a href="#impact" className="rounded-sm hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">{t('nav.impact')}</a></li>
              <li><a href="#steps" className="rounded-sm hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">{t('nav.steps')}</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-900 dark:text-slate-100">{t('landing.footerContact')}</h5>
            <address className="mt-3 space-y-2 text-sm not-italic text-slate-700 dark:text-slate-200">
              <p>Email: care@ecodiab.health</p>
              <p>Phone: +62 21 5550 1234</p>
              <p>Jakarta, Indonesia</p>
            </address>
          </div>
        </div>
        <div className="border-t border-slate-300 py-4 text-center text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300">
          © {new Date().getFullYear()} EcoDiab. {t('landing.footerTagline')}
        </div>
      </footer>
    </MarketingLayout>
  );
}
