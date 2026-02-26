import { BellRing, Menu, Moon, Sun, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAppContext } from '../lib/app-context';
import { useAlertCenter } from '../lib/alert-center-context';

const pageLabel: Record<string, string> = {
  dashboard: 'Dashboard',
  patients: 'Patients',
  'ai-risk': 'AI Risk',
  'follow-up': 'Follow-up',
  green: 'Green Report',
  'dietary-assistant': 'Dietary Assistant',
  alerts: 'Smart Alerts',
  education: 'Patient Education',
  achievements: 'Achievements',
};

export default function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, role, setRole, darkMode, toggleDarkMode, highContrast, toggleHighContrast, textScale, setTextScale } = useAppContext();
  const { unresolvedCount } = useAlertCenter();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="md:flex">
        <Sidebar role={role} className="hidden md:block" />
        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 bg-slate-900/50 md:hidden" onClick={() => setMobileNavOpen(false)} aria-hidden="true">
            <div className="h-full max-w-xs" onClick={(event) => event.stopPropagation()}>
              <Sidebar role={role} className="h-full" onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        ) : null}
        <div className="flex-1">
          <header className="space-y-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileNavOpen((prev) => !prev)}
                  className="rounded-md border border-slate-300 p-2 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 md:hidden"
                  aria-label="Toggle navigation menu"
                >
                  {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
                <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 md:text-xl">EcoDiab Workspace</h1>
              </div>
              <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
                <select
                  aria-label="Language"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as 'EN' | 'ID')}
                  className="min-h-11 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 md:flex-none"
                >
                  <option value="EN">EN</option>
                  <option value="ID">ID</option>
                </select>
                <select
                  aria-label="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'Clinician' | 'Admin')}
                  className="min-h-11 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 md:flex-none"
                >
                  <option value="Clinician">Clinician</option>
                  <option value="Admin">Admin</option>
                </select>
                <select
                  aria-label="Text size"
                  value={textScale}
                  onChange={(e) => setTextScale(e.target.value as 'normal' | 'large')}
                  className="min-h-11 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 md:flex-none"
                >
                  <option value="normal">Text: Normal</option>
                  <option value="large">Text: Large</option>
                </select>
                <Link
                  to="/alerts"
                  className="relative inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <BellRing className="h-4 w-4" /> Alerts
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{unresolvedCount}</span>
                </Link>
                <button
                  onClick={toggleHighContrast}
                  className={`min-h-11 rounded-md border px-2 py-1 text-xs font-semibold transition-colors ${highContrast ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-200'}`}
                >
                  Contrast
                </button>
                <button onClick={toggleDarkMode} className="min-h-11 rounded-md border border-slate-300 p-2 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" aria-label="Toggle dark mode">
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Link to="/dashboard" className="hover:text-slate-700 dark:hover:text-slate-200">Home</Link>
              {pathParts.map((part, index) => (
                <span key={part + index} className="flex items-center gap-2">
                  <span>/</span>
                  <span className={index === pathParts.length - 1 ? 'font-semibold text-slate-700 dark:text-slate-200' : ''}>{pageLabel[part] ?? part}</span>
                </span>
              ))}
            </nav>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
