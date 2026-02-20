import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'EN' | 'ID';
export type Role = 'Clinician' | 'Admin';

type AppContextValue = {
  lang: Lang;
  role: Role;
  darkMode: boolean;
  setLang: (lang: Lang) => void;
  setRole: (role: Role) => void;
  toggleDarkMode: () => void;
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ecodiab-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const value = useMemo(
    () => ({ lang, role, darkMode, setLang, setRole, toggleDarkMode: () => setDarkMode((prev) => !prev) }),
    [lang, role, darkMode]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
}
