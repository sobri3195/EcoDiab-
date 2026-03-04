import { BarChart3 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { workspaceModules } from '../lib/module-catalog';
import BrandLogo from './BrandLogo';

type SidebarProps = {
  role: 'Clinician' | 'Admin';
  className?: string;
  onNavigate?: () => void;
};

const navGroups = ['Core workflow', 'Sustainability', 'Extension modules'] as const;

export default function Sidebar({ role, className = '', onNavigate }: SidebarProps) {
  return (
    <aside className={`w-full border-r border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:w-72 ${className}`}>
      <div className="mb-4">
        <BrandLogo size="sm" />
      </div>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Navigation</h2>
      <div className="space-y-4">
        {navGroups.map((group) => (
          <section key={group}>
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{group}</p>
            <div className="space-y-1">
              {workspaceModules.filter((item) => item.group === group).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  title={item.description}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800'}`
                  }
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </NavLink>
              ))}
            </div>
          </section>
        ))}
      </div>
      {role === 'Admin' ? (
        <button disabled className="mt-5 flex w-full cursor-not-allowed items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <BarChart3 className="h-4 w-4" /> Admin Panel (mock)
        </button>
      ) : null}
    </aside>
  );
}
