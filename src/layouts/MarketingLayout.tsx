import type { ReactNode } from 'react';
import Navbar from '../components/Navbar';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-800 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
