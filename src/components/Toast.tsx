import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type ToastItem = { id: number; message: string };

type ToastContextValue = { pushToast: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const pushToast = (message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((prev) => [...prev, { id, message }]);
    setTimeout(() => setItems((prev) => prev.filter((item) => item.id !== id)), 2800);
  };

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800 shadow dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-100">
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
