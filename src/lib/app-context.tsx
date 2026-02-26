import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { PatientPayload, RiskPredictionResponse } from './api';

export type Lang = 'EN' | 'ID';
export type Role = 'Clinician' | 'Admin';
export type TextScale = 'normal' | 'large';

type AppContextValue = {
  lang: Lang;
  role: Role;
  darkMode: boolean;
  highContrast: boolean;
  textScale: TextScale;
  isAuthenticated: boolean;
  patients: PatientPayload[];
  latestRisk: RiskPredictionResponse | null;
  setLang: (lang: Lang) => void;
  setRole: (role: Role) => void;
  setTextScale: (scale: TextScale) => void;
  setPatients: (patients: PatientPayload[]) => void;
  setLatestRisk: (risk: RiskPredictionResponse | null) => void;
  login: (token: string) => void;
  logout: () => void;
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const dictionary = {
  EN: {
    demoLabel: 'Live data mode',
    welcome: 'Welcome back',
  },
  ID: {
    demoLabel: 'Mode data realtime',
    welcome: 'Selamat datang kembali',
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('EN');
  const [role, setRole] = useState<Role>('Clinician');
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('ecodiab-theme') === 'dark');
  const [highContrast, setHighContrast] = useState<boolean>(() => localStorage.getItem('ecodiab-contrast') === 'high');
  const [textScale, setTextScale] = useState<TextScale>(() => (localStorage.getItem('ecodiab-text-scale') === 'large' ? 'large' : 'normal'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(localStorage.getItem('ecodiab-token')));
  const [patients, setPatients] = useState<PatientPayload[]>([]);
  const [latestRisk, setLatestRisk] = useState<RiskPredictionResponse | null>(null);

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
      isAuthenticated,
      patients,
      latestRisk,
      setLang,
      setRole,
      setTextScale,
      setPatients,
      setLatestRisk,
      login: (token: string) => {
        localStorage.setItem('ecodiab-token', token);
        setIsAuthenticated(true);
      },
      logout: () => {
        localStorage.removeItem('ecodiab-token');
        setIsAuthenticated(false);
      },
      toggleDarkMode: () => setDarkMode((prev) => !prev),
      toggleHighContrast: () => setHighContrast((prev) => !prev),
    }),
    [lang, role, darkMode, highContrast, textScale, isAuthenticated, patients, latestRisk]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
}
