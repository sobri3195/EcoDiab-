import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'EN' | 'ID';
export type Role = 'Clinician' | 'Admin';
export type TextScale = 'normal' | 'large';

type AppContextValue = {
  lang: Lang;
  role: Role;
  darkMode: boolean;
  highContrast: boolean;
  textScale: TextScale;
  setLang: (lang: Lang) => void;
  setRole: (role: Role) => void;
  setTextScale: (scale: TextScale) => void;
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const dictionary = {
  EN: {
    demoLabel: 'Demo only (deterministic mock data)',
    welcome: 'Welcome back',
  },
  ID: {
    demoLabel: 'Hanya demo (data mock deterministik)',
    welcome: 'Selamat datang kembali',
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('EN');
  const [role, setRole] = useState<Role>('Clinician');
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('ecodiab-theme') === 'dark');
  const [highContrast, setHighContrast] = useState<boolean>(() => localStorage.getItem('ecodiab-contrast') === 'high');
  const [textScale, setTextScale] = useState<TextScale>(() => (localStorage.getItem('ecodiab-text-scale') === 'large' ? 'large' : 'normal'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ecodiab-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('ecodiab-contrast', highContrast ? 'high' : 'normal');
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.dataset.textScale = textScale;
    localStorage.setItem('ecodiab-text-scale', textScale);
  }, [textScale]);

  const value = useMemo(
    () => ({
      lang,
      role,
      darkMode,
      highContrast,
      textScale,
      setLang,
      setRole,
      setTextScale,
      toggleDarkMode: () => setDarkMode((prev) => !prev),
      toggleHighContrast: () => setHighContrast((prev) => !prev),
    }),
    [lang, role, darkMode, highContrast, textScale]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
}
