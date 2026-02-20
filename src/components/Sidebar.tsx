import { Activity, BarChart3, CalendarCheck2, Leaf, Salad, ShieldAlert, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type SidebarProps = {
  role: 'Clinician' | 'Admin';
};

const navItems = [
  { to: '/dashboard', icon: Activity, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/ai-risk', icon: ShieldAlert, label: 'AI Risk' },
  { to: '/follow-up', icon: CalendarCheck2, label: 'Follow-up' },
  { to: '/green', icon: Leaf, label: 'Green' },
  { to: '/dietary-assistant', icon: Salad, label: 'Dietary Assistant' },
];

export default function Sidebar({ role }: SidebarProps) {
  return (
    <aside className="w-full border-r border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:w-64">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">Navigation</h2>
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`
            }
          >
            <item.icon className="h-4 w-4" /> {item.label}
          </NavLink>
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
