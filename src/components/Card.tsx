import type { ReactNode } from 'react';

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`}>
      {title ? <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3> : null}
      {children}
    </div>
  );
}
