import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg text-emerald-700 dark:text-emerald-400">
          <BrandLogo size="sm" />
        </Link>
        <div className="hidden gap-5 text-sm text-slate-600 md:flex dark:text-slate-300">
          <a href="#features">Features</a>
          <a href="#impact">Impact</a>
          <a href="#steps">How it works</a>
        </div>
        <Link to="/dashboard" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          Open Demo
        </Link>
      </nav>
    </header>
  );
}
