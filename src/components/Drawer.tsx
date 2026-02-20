import type { ReactNode } from 'react';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Drawer({ open, onClose, title, children }: DrawerProps) {
  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`}>
      <div onClick={onClose} className={`absolute inset-0 bg-slate-900/30 transition ${open ? 'opacity-100' : 'opacity-0'}`} />
      <aside className={`absolute right-0 top-0 h-full w-full max-w-md transform bg-white p-5 shadow-xl transition dark:bg-slate-900 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm text-slate-500">Close</button>
        </div>
        {children}
      </aside>
    </div>
  );
}
