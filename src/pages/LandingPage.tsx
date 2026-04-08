import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  BriefcaseMedical,
  Building2,
  Cloud,
  Gauge,
  GraduationCap,
  HeartPulse,
  Hospital,
  Languages,
  Layers,
  Link2,
  MonitorSmartphone,
  ShieldAlert,
  Smartphone,
  Stethoscope,
  Users,
  Watch,
  WifiOff,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingLayout from '../layouts/MarketingLayout';

const aiFeatures = [
  { title: 'Complication Radar Engine', type: 'Predictive AI', description: 'Flags rising multi-organ risk from labs, vitals, symptoms, and adherence drift before crisis.' },
  { title: 'AI Glycemia Forecast', type: 'Predictive AI', description: 'Projects short and medium-term glucose trajectories to support proactive intervention plans.' },
  { title: 'Deterioration & Readmission Sentinel', type: 'Predictive AI', description: 'Monitors post-visit instability and predicts avoidable readmissions for targeted outreach.' },
  { title: 'Insulin Titration Copilot', type: 'Therapeutic / Curative Support AI', description: 'Suggests evidence-aligned dose adjustments for clinician review based on trends and patient profile.' },
  { title: 'Smart Foot Ulcer Vision', type: 'Therapeutic / Curative Support AI', description: 'Assists triage and severity scoring from wound images to accelerate treatment escalation.' },
  { title: 'Retinopathy Screening AI', type: 'Therapeutic / Curative Support AI', description: 'Supports early retinal risk detection and referral prioritization in resource-limited settings.' },
  { title: 'Personal Health Digital Twin', type: 'Prognostic AI', description: 'Simulates likely outcomes under different therapy, behavior, and follow-up scenarios.' },
  { title: 'Time-to-Complication Prognosis Mapper', type: 'Prognostic AI', description: 'Estimates likely timeline to key complications to personalize preventive intensity.' },
  { title: 'Grounded Multilingual Diabetes Coach', type: 'Educative AI', description: 'Delivers guideline-grounded education in local language with literacy-aware explanations.' },
  { title: 'Adaptive Behavior-Change & Microlearning Engine', type: 'Educative AI', description: 'Personalizes nudges, reminders, and micro-lessons by context, readiness, and engagement pattern.' },
] as const;

const journeyStages = [
  {
    name: 'Risk Capture',
    actor: 'Community clinic + patient app',
    detail: 'Offline-lite intake, baseline labs, social risk context, and device sync establish longitudinal risk profile.',
  },
  {
    name: 'AI Stratification',
    actor: 'Care coordinator + AI engine',
    detail: 'Complication radar and glycemia forecasts triage patients into dynamic care pathways and urgency tiers.',
  },
  {
    name: 'Therapy Orchestration',
    actor: 'Clinician dashboard',
    detail: 'Titration copilot and alerts suggest intervention plans while preserving physician authority and auditability.',
  },
  {
    name: 'Continuous Recovery Loop',
    actor: 'Patient + caregiver + payer',
    detail: 'Education coach, adherence monitoring, and utilization insights sustain outcomes and reduce preventable cost.',
  },
] as const;

const counters = [
  { label: 'Projected avoidable readmission reduction', value: 38, suffix: '%' },
  { label: 'Faster high-risk identification', value: 2.4, suffix: 'x' },
  { label: 'Increase in protocol adherence visibility', value: 89, suffix: '%' },
];

export default function LandingPage() {
  const [activeJourney, setActiveJourney] = useState(0);
  const [counterValues, setCounterValues] = useState([0, 0, 0]);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const impact = document.getElementById('impact-counters');
    if (!impact) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const startedAt = performance.now();
        const duration = 1400;

        const animate = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          setCounterValues(counters.map((item) => Number((item.value * progress).toFixed(1))));
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(impact);
    return () => observer.disconnect();
  }, []);

  const navItems = useMemo(
    () => [
      ['home', 'Home'],
      ['problem', 'Problem'],
      ['solution', 'Solution'],
      ['ai-features', 'AI Features'],
      ['wins', 'Why EcoDiab AI Wins'],
      ['business-model', 'Business Model'],
      ['go-to-market', 'Go-to-Market'],
      ['roadmap', 'Roadmap'],
      ['team', 'Team'],
      ['contact', 'Contact'],
    ],
    [],
  );

  return (
    <MarketingLayout>
      <section id="home" className="mx-auto max-w-6xl px-4 pb-14 pt-14 reveal-on-scroll" aria-labelledby="hero-title">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-900">
              <ShieldAlert className="h-3.5 w-3.5" /> Chronic Care Intelligence Platform
            </p>
            <h1 id="hero-title" className="mt-5 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              AI for Predictive, Continuous, and Equitable Diabetes Care
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-700">
              EcoDiab AI is an intelligent care orchestration layer for chronic disease management in low-resource and semi-connected settings—built for interoperable, offline-lite operations across web, mobile, desktop, and smartwatch.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-teal-800">Request Demo</a>
              <a href="#business-model" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">View Pilot Model</a>
              <a href="#ai-features" className="rounded-xl border border-teal-300 bg-teal-50 px-5 py-3 text-sm font-semibold text-teal-900 transition hover:bg-teal-100">See AI Features</a>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Connected Care Ecosystem</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {[
                ['Website Portal', MonitorSmartphone],
                ['Mobile Companion', Smartphone],
                ['Desktop Command Center', Building2],
                ['Smartwatch Signals', Watch],
              ].map(([label, Icon]) => (
                <div key={label as string} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <Icon className="h-5 w-5 text-teal-700" />
                  <p className="mt-2 font-medium text-slate-800">{label as string}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600">Interoperable with EMR, lab, pharmacy, and claims pathways with sync recovery for low-connectivity environments.</p>
          </aside>
        </div>
        <div className="mt-8 hidden flex-wrap gap-3 md:flex">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-teal-400 hover:text-teal-800">{label}</a>
          ))}
        </div>
      </section>

      <section id="problem" className="mx-auto max-w-6xl px-4 py-10 reveal-on-scroll">
        <h2 className="text-3xl font-bold text-slate-900">Problem</h2>
        <p className="mt-3 max-w-4xl text-slate-700">Current diabetes workflows in many hospitals and public systems remain episodic, fragmented, and reactive—especially where staff, specialist access, and internet reliability are constrained.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {['Manual triage delays risk response', 'Siloed telemedicine misses longitudinal context', 'Standalone devices and fragmented EMR limit continuity'].map((item) => (
            <article key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <ShieldAlert className="h-5 w-5 text-rose-700" />
              <p className="mt-3 text-sm font-medium text-slate-800">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="solution" className="mx-auto max-w-6xl px-4 py-10 reveal-on-scroll">
        <h2 className="text-3xl font-bold text-slate-900">Solution</h2>
        <p className="mt-3 max-w-4xl text-slate-700">EcoDiab AI orchestrates predictive, therapeutic decision support, prognostic planning, and educative engagement as a single care intelligence layer aligned to real clinical governance.</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Before vs After Care Model</h3>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                <p className="font-semibold text-rose-900">Before</p>
                <ul className="mt-2 space-y-1 text-rose-900/90">
                  <li>• Late complication detection</li>
                  <li>• Visit-by-visit decision making</li>
                  <li>• Low visibility on adherence</li>
                </ul>
              </div>
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-3">
                <p className="font-semibold text-teal-900">After</p>
                <ul className="mt-2 space-y-1 text-teal-900/90">
                  <li>• Proactive risk escalation</li>
                  <li>• Continuous AI-supported care</li>
                  <li>• Shared data for clinicians and payers</li>
                </ul>
              </div>
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Interoperability + Offline-Lite Architecture</h3>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ['HL7/FHIR bridge', Link2],
                ['Edge cache + sync queue', WifiOff],
                ['Cloud policy engine', Cloud],
                ['Role-based dashboard APIs', Layers],
              ].map(([label, Icon]) => (
                <div key={label as string} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <Icon className="h-4 w-4 text-teal-700" />
                  <p className="mt-2 font-medium text-slate-700">{label as string}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="ai-features" className="mx-auto max-w-6xl px-4 py-10 reveal-on-scroll">
        <h2 className="text-3xl font-bold text-slate-900">10 Advanced AI Features</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aiFeatures.map((feature) => (
            <article key={feature.title} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <Brain className="h-5 w-5 text-teal-700" />
              <p className="mt-3 inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{feature.type}</p>
              <h3 className="mt-3 font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="wins" className="mx-auto max-w-6xl px-4 py-10 reveal-on-scroll">
        <h2 className="text-3xl font-bold text-slate-900">Why EcoDiab AI Wins</h2>
        <div id="impact-counters" className="mt-5 grid gap-4 md:grid-cols-3">
          {counters.map((counter, idx) => (
            <article key={counter.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Gauge className="h-5 w-5 text-teal-700" />
              <p className="mt-3 text-sm text-slate-700">{counter.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{counterValues[idx]}{counter.suffix}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Capability</th>
                <th className="px-4 py-3 font-semibold">Manual Workflow</th>
                <th className="px-4 py-3 font-semibold">Generic Telemedicine</th>
                <th className="px-4 py-3 font-semibold">Standalone Device</th>
                <th className="px-4 py-3 font-semibold">Fragmented EMR</th>
                <th className="px-4 py-3 font-semibold text-teal-800">EcoDiab AI</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Predictive risk layer', 'Low', 'Partial', 'None', 'Low', 'Advanced'],
                ['Therapy decision support', 'Manual', 'Basic', 'None', 'Limited', 'Clinician copilots'],
                ['Offline-lite resilience', 'N/A', 'Low', 'Low', 'Low', 'Purpose-built'],
                ['Cross-role orchestration', 'Low', 'Medium', 'Low', 'Medium', 'High'],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-slate-200">
                  {row.map((cell, i) => (
                    <td key={cell} className={`px-4 py-3 ${i === row.length - 1 ? 'font-semibold text-teal-800' : 'text-slate-700'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="business-model" className="mx-auto max-w-6xl px-4 py-10 reveal-on-scroll">
        <h2 className="text-3xl font-bold text-slate-900">Business Model</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ['Hospitals & clinics', 'Subscription per site + active patient tiering', Hospital],
            ['Government / payer systems', 'Population contract + outcome-linked module pricing', BriefcaseMedical],
            ['Clinician network add-ons', 'Premium decision-support and quality reporting tools', Stethoscope],
          ].map(([title, copy, Icon]) => (
            <article key={title as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-teal-700" />
              <h3 className="mt-3 font-semibold text-slate-900">{title as string}</h3>
              <p className="mt-2 text-sm text-slate-700">{copy as string}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="go-to-market" className="mx-auto max-w-6xl px-4 py-10 reveal-on-scroll">
        <h2 className="text-3xl font-bold text-slate-900">Go-to-Market</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Role-Based Value Proposition</h3>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ['Clinicians', 'Faster risk triage and safer titration suggestions', Stethoscope],
                ['Hospitals', 'Reduced avoidable admissions and stronger protocol visibility', Building2],
                ['Patients', 'Personalized coaching and continuity beyond visits', HeartPulse],
                ['Payers', 'Population-level stratification and cost-control analytics', BarChart3],
              ].map(([role, text, Icon]) => (
                <div key={role as string} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <Icon className="h-4 w-4 text-teal-700" />
                  <p className="mt-2 font-semibold text-slate-900">{role as string}</p>
                  <p className="text-slate-700">{text as string}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Interactive Patient Care Journey</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {journeyStages.map((stage, idx) => (
                <button
                  key={stage.name}
                  onClick={() => setActiveJourney(idx)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${activeJourney === idx ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 text-slate-700 hover:border-teal-300'}`}
                >
                  {stage.name}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm">
              <p className="font-semibold text-teal-900">{journeyStages[activeJourney].actor}</p>
              <p className="mt-2 text-teal-900/90">{journeyStages[activeJourney].detail}</p>
            </div>
          </article>
        </div>
      </section>

      <section id="roadmap" className="mx-auto max-w-6xl px-4 py-10 reveal-on-scroll">
        <h2 className="text-3xl font-bold text-slate-900">12-Month Roadmap</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            ['Q1', 'Pilot onboarding in flagship hospital clusters; baseline data harmonization.'],
            ['Q2', 'Deploy predictive radar and glycemia forecast with clinician feedback loop.'],
            ['Q3', 'Launch therapeutic copilots, payer dashboards, and multilingual coach expansion.'],
            ['Q4', 'Scale to multi-site network with outcomes study and procurement readiness pack.'],
          ].map(([quarter, detail]) => (
            <li key={quarter as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">{quarter as string}</p>
              <p className="mt-3 text-sm text-slate-700">{detail as string}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="team" className="mx-auto max-w-6xl px-4 py-10 reveal-on-scroll">
        <h2 className="text-3xl font-bold text-slate-900">Team</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ['Clinical AI Lead', 'Endocrinology + model governance', Activity],
            ['Health Systems Lead', 'Hospital operations + interoperability', Users],
            ['Product & Implementation Lead', 'Low-resource deployment + behavior design', GraduationCap],
          ].map(([title, subtitle, Icon]) => (
            <article key={title as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-teal-700" />
              <h3 className="mt-3 font-semibold text-slate-900">{title as string}</h3>
              <p className="mt-2 text-sm text-slate-700">{subtitle as string}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 pb-16 pt-10 reveal-on-scroll">
        <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-700 to-cyan-700 p-7 text-white shadow-md">
          <h2 className="text-3xl font-bold">Contact / Demo Request</h2>
          <p className="mt-3 max-w-3xl text-teal-50">Position EcoDiab AI as your chronic care orchestration backbone for hospitals, government programs, clinician teams, and community pathways.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="mailto:demo@ecodiab.ai" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-teal-900">Request Demo</a>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-white/70 px-5 py-3 text-sm font-semibold text-white">Open Pilot Workspace <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
            {[
              ['Hospitals & Clinics', Hospital],
              ['Government / Payers', BriefcaseMedical],
              ['Patients & Caregivers', Languages],
            ].map(([label, Icon]) => (
              <div key={label as string} className="rounded-xl bg-white/10 p-3">
                <Icon className="h-4 w-4" />
                <p className="mt-2">{label as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .reveal-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity .5s ease, transform .5s ease; }
        .reveal-on-scroll.visible { opacity: 1; transform: translateY(0); }
      `}</style>
    </MarketingLayout>
  );
}
