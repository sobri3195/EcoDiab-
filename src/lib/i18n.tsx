import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Locale = 'id' | 'en';

interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

const DEFAULT_LOCALE: Locale = 'id';
const SUPPORTED_LOCALES: Locale[] = ['id', 'en'];
const STORAGE_KEY = 'ecodiab.locale';

const translations: Record<Locale, TranslationDictionary> = {
  id: {
    common: {
      language: 'Bahasa',
      skipToContent: 'Lewati ke konten utama',
      appName: 'EcoDiab',
    },
    nav: {
      features: 'Fitur',
      impact: 'Dampak',
      steps: 'Cara Kerja',
      openDemo: 'Buka Demo',
      languageSwitcherLabel: 'Pilih bahasa',
      goToHomepage: 'Ke beranda EcoDiab',
    },
    landing: {
      badge: 'Platform untuk perawatan diabetes berkelanjutan',
      heroTitleStart: 'Perawatan Diabetes Lebih',
      heroTitleStrongOne: 'Cerdas',
      heroTitleMiddle: ',',
      heroTitleStrongTwo: 'Cepat',
      heroTitleEnd: ', dan Ramah Lingkungan.',
      heroDescription:
        'EcoDiab membantu fasilitas kesehatan melakukan stratifikasi risiko, optimalisasi jadwal kontrol, dan pemantauan dampak lingkungan dalam satu pengalaman digital yang intuitif.',
      ctaDashboard: 'Lanjut ke Dashboard',
      ctaLogin: 'Login & Buka Demo',
      ctaExplore: 'Eksplor Fitur',
      quickItemOne: 'Prioritas pasien berbasis data real-time',
      quickItemTwo: 'Desain antarmuka ringan dan mudah diakses',
      quickAnalysisTitle: 'Analisis cepat dampak EcoDiab',
      efficiencyLabel: 'Efisiensi Follow-up',
      detectionLabel: 'Deteksi Risiko Dini',
      paperlessLabel: 'Penghematan Kertas',
      featuresTitle: 'Fitur unggulan EcoDiab',
      featureOneTitle: 'AI Risk Engine',
      featureOneDescription:
        'Model prediktif untuk identifikasi dini pasien dengan risiko komplikasi tinggi, agar intervensi dilakukan lebih cepat.',
      featureTwoTitle: 'Smart Follow-Up Optimizer',
      featureTwoDescription:
        'Penjadwalan tindak lanjut otomatis berdasarkan tingkat risiko, kepatuhan, dan prioritas klinis.',
      featureThreeTitle: 'Green Monitoring',
      featureThreeDescription:
        'Pemantauan pengurangan jejak karbon layanan kesehatan melalui proses paperless dan kunjungan yang lebih efisien.',
      impactTitle: 'Dampak operasional yang terukur',
      impactCardOne: 'Tenaga kesehatan aktif',
      impactCardTwo: 'Waktu triase lebih cepat',
      impactCardThree: 'Kontrol pasien tepat waktu',
      uxTitle: 'UX terarah untuk keputusan klinis cepat',
      uxDescription:
        'Redesain menitikberatkan pada visual hierarchy yang kuat, CTA kontras tinggi, serta struktur informasi bertahap agar tenaga kesehatan dapat menemukan aksi penting dalam kurang dari 3 klik.',
      uxVisual: 'Visual Clarity',
      uxDiscoverability: 'Action Discoverability',
      uxTrust: 'Trust & Safety Cues',
      uxSustainability: 'Sustainability Signal',
      stepsTitle: 'Cara kerja',
      stepOneTitle: 'Input Data Klinis',
      stepOneDescription: 'Tim kesehatan memasukkan indikator penting pasien ke dalam dashboard terpadu.',
      stepTwoTitle: 'Analisis Risiko AI',
      stepTwoDescription: 'Sistem mengelompokkan pasien berdasarkan level risiko dan memberi rekomendasi tindak lanjut.',
      stepThreeTitle: 'Intervensi Tepat & Hijau',
      stepThreeDescription: 'Follow-up diprioritaskan untuk pasien kritis sambil mengurangi kunjungan dan dokumen yang tidak perlu.',
      finalCtaTitle: 'Siap optimalkan layanan diabetes Anda?',
      finalCtaDescription: 'Mulai dari dashboard demo untuk melihat bagaimana AI triase dan green monitoring bekerja secara nyata.',
      finalCtaButton: 'Coba Demo Sekarang',
      footerDescription:
        'Platform analitik klinis dan keberlanjutan untuk meningkatkan kualitas perawatan diabetes, sekaligus menurunkan dampak lingkungan layanan kesehatan.',
      footerNav: 'Navigasi',
      footerContact: 'Kontak',
      footerTagline: 'Perawatan lebih baik, layanan kesehatan lebih hijau.',
    },
  },
  en: {
    common: {
      language: 'Language',
      skipToContent: 'Skip to main content',
      appName: 'EcoDiab',
    },
    nav: {
      features: 'Features',
      impact: 'Impact',
      steps: 'How it works',
      openDemo: 'Open Demo',
      languageSwitcherLabel: 'Select language',
      goToHomepage: 'Go to EcoDiab homepage',
    },
    landing: {
      badge: 'Platform for sustainable diabetes care',
      heroTitleStart: 'Smarter Diabetes Care,',
      heroTitleStrongOne: 'Faster',
      heroTitleMiddle: ',',
      heroTitleStrongTwo: 'Safer',
      heroTitleEnd: ', and Sustainable.',
      heroDescription:
        'EcoDiab helps healthcare facilities with risk stratification, follow-up optimization, and environmental impact monitoring in one intuitive digital experience.',
      ctaDashboard: 'Go to Dashboard',
      ctaLogin: 'Login & Open Demo',
      ctaExplore: 'Explore Features',
      quickItemOne: 'Patient prioritization based on real-time data',
      quickItemTwo: 'Lightweight and accessible interface design',
      quickAnalysisTitle: 'Quick EcoDiab impact analysis',
      efficiencyLabel: 'Follow-up Efficiency',
      detectionLabel: 'Early Risk Detection',
      paperlessLabel: 'Paper Savings',
      featuresTitle: 'EcoDiab core capabilities',
      featureOneTitle: 'AI Risk Engine',
      featureOneDescription: 'Predictive models for early identification of high-complication-risk patients for faster intervention.',
      featureTwoTitle: 'Smart Follow-Up Optimizer',
      featureTwoDescription: 'Automated follow-up scheduling based on risk level, adherence, and clinical priority.',
      featureThreeTitle: 'Green Monitoring',
      featureThreeDescription: 'Healthcare carbon footprint monitoring through paperless workflows and more efficient visits.',
      impactTitle: 'Measurable operational impact',
      impactCardOne: 'Active healthcare staff',
      impactCardTwo: 'Faster triage time',
      impactCardThree: 'On-time patient control',
      uxTitle: 'UX tuned for faster clinical decisions',
      uxDescription:
        'The redesign emphasizes strong visual hierarchy, high-contrast CTAs, and progressive information structure so healthcare teams can find key actions in less than 3 clicks.',
      uxVisual: 'Visual Clarity',
      uxDiscoverability: 'Action Discoverability',
      uxTrust: 'Trust & Safety Cues',
      uxSustainability: 'Sustainability Signal',
      stepsTitle: 'How it works',
      stepOneTitle: 'Clinical Data Input',
      stepOneDescription: 'The care team enters key patient indicators into a unified dashboard.',
      stepTwoTitle: 'AI Risk Analysis',
      stepTwoDescription: 'The system groups patients by risk level and recommends follow-up actions.',
      stepThreeTitle: 'Targeted & Green Intervention',
      stepThreeDescription: 'Follow-up is prioritized for critical patients while reducing unnecessary visits and paperwork.',
      finalCtaTitle: 'Ready to optimize your diabetes care services?',
      finalCtaDescription: 'Start with the demo dashboard to see AI triage and green monitoring in action.',
      finalCtaButton: 'Try Demo Now',
      footerDescription:
        'A clinical analytics and sustainability platform to improve diabetes care quality while reducing environmental impact.',
      footerNav: 'Navigation',
      footerContact: 'Contact',
      footerTagline: 'Better care, greener healthcare.',
    },
  },
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && SUPPORTED_LOCALES.includes(stored)) {
    return stored;
  }

  const browserLocale = window.navigator.language.toLowerCase().startsWith('en') ? 'en' : DEFAULT_LOCALE;
  return browserLocale;
};

const resolveTranslation = (dictionary: TranslationDictionary, key: string): string | undefined => {
  const resolved = key.split('.').reduce<string | TranslationDictionary | undefined>((current, segment) => {
    if (typeof current === 'string' || current == null) {
      return undefined;
    }

    return current[segment];
  }, dictionary);

  return typeof resolved === 'string' ? resolved : undefined;
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale,
    t: (key: string) => {
      const requested = resolveTranslation(translations[locale], key);
      if (requested) {
        return requested;
      }

      const fallback = resolveTranslation(translations[DEFAULT_LOCALE], key);
      return fallback ?? key;
    },
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }

  return context;
};
