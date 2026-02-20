import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onApiError, type PatientPayload, type RiskPredictionResponse } from './api';

export type Lang = 'EN' | 'ID';
export type Role = 'Clinician' | 'Admin';

type Notification = { id: number; message: string; type: 'success' | 'error' | 'info' };

type AppContextValue = {
  lang: Lang;
  role: Role;
  darkMode: boolean;
  token: string | null;
  isAuthenticated: boolean;
  patients: PatientPayload[];
  latestRisk: RiskPredictionResponse | null;
  notifications: Notification[];
  setLang: (lang: Lang) => void;
  setRole: (role: Role) => void;
  toggleDarkMode: () => void;
  login: (token: string) => void;
  logout: (reason?: string) => void;
  setPatients: (patients: PatientPayload[]) => void;
  setLatestRisk: (risk: RiskPredictionResponse | null) => void;
  pushNotification: (message: string, type?: Notification['type']) => void;
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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ecodiab-token'));
  const [patients, setPatients] = useState<PatientPayload[]>([]);
  const [latestRisk, setLatestRisk] = useState<RiskPredictionResponse | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const pushNotification = (message: string, type: Notification['type'] = 'info') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications((prev) => prev.filter((item) => item.id !== id)), 3200);
  };

  const logout = (reason?: string) => {
    localStorage.removeItem('ecodiab-token');
    localStorage.removeItem('ecodiab-token-expiry');
    setToken(null);
    if (reason) { pushNotification(reason, 'error'); window.alert(reason); }
  };

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('ecodiab-token', newToken);
    localStorage.setItem('ecodiab-token-expiry', String(Date.now() + 1000 * 60 * 60));
    pushNotification('Berhasil login.', 'success');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ecodiab-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = Number(localStorage.getItem('ecodiab-token-expiry') ?? '0');
      if (token && expiry && Date.now() > expiry) {
        logout('Sesi Anda berakhir. Silakan login kembali.');
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const remove = onApiError((error) => {
      if (error.status === 401) logout('Token kadaluarsa. Anda telah logout otomatis.');
    });
    return remove;
  }, []);

  const value = useMemo(
    () => ({
      lang,
      role,
      darkMode,
      token,
      isAuthenticated: Boolean(token),
      patients,
      latestRisk,
      notifications,
      setLang,
      setRole,
      toggleDarkMode: () => setDarkMode((prev) => !prev),
      login,
      logout,
      setPatients,
      setLatestRisk,
      pushNotification,
    }),
    [lang, role, darkMode, token, patients, latestRisk, notifications]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
}
