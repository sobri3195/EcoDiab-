import type { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import { useI18n } from '../lib/i18n';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-emerald-800 px-3 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
      >
        {t('common.skipToContent')}
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>{children}</main>
    </div>
  );
}
