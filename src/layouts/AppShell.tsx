import { Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAppContext } from '../lib/app-context';

export default function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, role, setRole, darkMode, toggleDarkMode, logout } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="md:flex">
        <Sidebar role={role} />
        <div className="flex-1">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">EcoDiab Workspace</h1>
            <div className="flex items-center gap-2">
              <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value as 'EN' | 'ID')} className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"><option value="EN">EN</option><option value="ID">ID</option></select>
              <select aria-label="Role" value={role} onChange={(e) => setRole(e.target.value as 'Clinician' | 'Admin')} className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"><option value="Clinician">Clinician</option><option value="Admin">Admin</option></select>
              <button onClick={toggleDarkMode} className="rounded-md border border-slate-300 p-2 dark:border-slate-700" aria-label="Toggle dark mode">{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
              <button onClick={() => { logout(); navigate('/'); }} className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white">Logout</button>
            </div>
          </header>
          <main className="p-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
