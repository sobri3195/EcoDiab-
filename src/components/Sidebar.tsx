import { Activity, BarChart3, CalendarCheck2, Leaf, Salad, ShieldAlert, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';

type SidebarProps = {
  role: 'Clinician' | 'Admin';
};

const navGroups = [
  {
    label: 'Core workflow',
    items: [
      { to: '/dashboard', icon: Activity, label: 'Dashboard' },
      { to: '/patients', icon: Users, label: 'Patients' },
      { to: '/ai-risk', icon: ShieldAlert, label: 'AI Risk' },
      { to: '/follow-up', icon: CalendarCheck2, label: 'Follow-up' },
    ],
  },
  {
    label: 'Sustainability',
    items: [
      { to: '/green', icon: Leaf, label: 'Green' },
      { to: '/dietary-assistant', icon: Salad, label: 'Dietary Assistant' },
    ],
  },
];

export default function Sidebar({ role }: SidebarProps) {
  return (
    <aside className="w-full border-r border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:w-72">
      <div className="mb-4">
        <BrandLogo size="sm" />
      </div>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Navigation</h2>
      <div className="space-y-4">
        {navGroups.map((group) => (
          <section key={group.label}>
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
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
