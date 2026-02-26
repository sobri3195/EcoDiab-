import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { alerts as mockAlerts, type Alert } from './mock';

type AlertCenterContextValue = {
  alerts: Alert[];
  unresolvedCount: number;
  resolveAlert: (id: string) => Promise<void>;
  resolveAllVisible: (ids: string[]) => Promise<void>;
};

const AlertCenterContext = createContext<AlertCenterContextValue | null>(null);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function AlertCenterProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const resolveAlert = async (id: string) => {
    let previous: Alert[] = [];
    setAlerts((current) => {
      previous = current;
      return current.map((alert) => (alert.id === id ? { ...alert, resolved: true } : alert));
    });

    try {
      await wait(500);
    } catch (error) {
      setAlerts(previous);
      throw error;
    }
  };

  const resolveAllVisible = async (ids: string[]) => {
    if (ids.length === 0) return;
    let previous: Alert[] = [];
    setAlerts((current) => {
      previous = current;
      const resolvedIds = new Set(ids);
      return current.map((alert) => (resolvedIds.has(alert.id) ? { ...alert, resolved: true } : alert));
    });

    try {
      await wait(600);
    } catch (error) {
      setAlerts(previous);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      alerts,
      unresolvedCount: alerts.filter((alert) => !alert.resolved).length,
      resolveAlert,
      resolveAllVisible,
    }),
    [alerts]
  );

  return <AlertCenterContext.Provider value={value}>{children}</AlertCenterContext.Provider>;
}

export function useAlertCenter() {
  const context = useContext(AlertCenterContext);
  if (!context) throw new Error('useAlertCenter must be used within AlertCenterProvider');
  return context;
}
