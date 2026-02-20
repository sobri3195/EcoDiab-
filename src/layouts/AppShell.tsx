import { Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAppContext } from '../lib/app-context';

const pageLabel: Record<string, string> = {
  dashboard: 'Dashboard',
  patients: 'Patients',
  'ai-risk': 'AI Risk',
  'follow-up': 'Follow-up',
  green: 'Green Report',
  'dietary-assistant': 'Dietary Assistant',
};

export default function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, role, setRole, darkMode, toggleDarkMode, highContrast, toggleHighContrast, textScale, setTextScale } = useAppContext();
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="md:flex">
        <Sidebar role={role} />
        <div className="flex-1">
          <header className="space-y-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">EcoDiab Workspace</h1>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Language"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as 'EN' | 'ID')}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="EN">EN</option>
                  <option value="ID">ID</option>
                </select>
                <select
                  aria-label="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'Clinician' | 'Admin')}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Clinician">Clinician</option>
                  <option value="Admin">Admin</option>
                </select>
                <select
                  aria-label="Text size"
                  value={textScale}
                  onChange={(e) => setTextScale(e.target.value as 'normal' | 'large')}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="normal">Text: Normal</option>
                  <option value="large">Text: Large</option>
                </select>
                <button
                  onClick={toggleHighContrast}
                  className={`rounded-md border px-2 py-1 text-xs font-semibold transition-colors ${highContrast ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-200'}`}
                >
                  Contrast
                </button>
                <button onClick={toggleDarkMode} className="rounded-md border border-slate-300 p-2 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" aria-label="Toggle dark mode">
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
