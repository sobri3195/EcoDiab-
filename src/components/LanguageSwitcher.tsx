import { useI18n, type Locale } from '../lib/i18n';

const locales: Locale[] = ['id', 'en'];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200" htmlFor="language-switcher">
      <span>{t('common.language')}</span>
      <select
        id="language-switcher"
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        aria-label={t('nav.languageSwitcherLabel')}
        className="rounded-md border border-slate-400 bg-white px-2 py-1 text-xs font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100"
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
