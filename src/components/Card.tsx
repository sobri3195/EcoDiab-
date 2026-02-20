import type { ReactNode } from 'react';

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  tone?: 'primary' | 'secondary';
};

export default function Card({ title, children, className = '', tone = 'secondary' }: CardProps) {
  const toneClass =
    tone === 'primary'
      ? 'border-emerald-100 shadow-md shadow-emerald-100/60 dark:border-emerald-900/60 dark:shadow-none'
      : 'border-slate-200 shadow-sm dark:border-slate-700';

  return (
    <div className={`rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${toneClass} ${className}`}>
      {title ? <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3> : null}
      {children}
    </div>
  );
}
