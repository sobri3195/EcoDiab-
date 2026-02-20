export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return <div className="animate-pulse rounded-lg border border-slate-200 bg-slate-100 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">{label}</div>;
}

export function EmptyState({ message, actionLabel, onAction }: { message: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-600">
      <p>{message}</p>
      {actionLabel && onAction ? <button onClick={onAction} className="mt-3 rounded bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">{actionLabel}</button> : null}
    </div>
  );
}

export function ErrorState({ message = 'Terjadi kesalahan.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 dark:border-rose-700 dark:bg-rose-900/20 dark:text-rose-200">
      <p>{message}</p>
      {onRetry ? <button onClick={onRetry} className="mt-3 rounded bg-rose-600 px-3 py-2 text-xs font-semibold text-white">Coba Lagi</button> : null}
    </div>
  );
}
