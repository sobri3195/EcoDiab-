import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import BrandLogo from './BrandLogo';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-300 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-950/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3" aria-label="Primary navigation">
        <Link
          to="/"
          aria-label={t('nav.goToHomepage')}
          className="rounded-md text-lg text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:text-emerald-300"
        >
          <BrandLogo size="sm" />
        </Link>

        <ul className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex dark:text-slate-200" role="list">
          <li><a href="#features" className="rounded-sm hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">{t('nav.features')}</a></li>
          <li><a href="#impact" className="rounded-sm hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">{t('nav.impact')}</a></li>
          <li><a href="#steps" className="rounded-sm hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">{t('nav.steps')}</a></li>
        </ul>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            to="/dashboard"
            className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 sm:px-4 sm:text-sm"
          >
            {t('nav.openDemo')}
          </Link>
        </div>
      </nav>
    </header>
  );
}
