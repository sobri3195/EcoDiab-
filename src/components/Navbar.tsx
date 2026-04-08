import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3" aria-label="Primary navigation">
        <Link
          to="/"
          aria-label="Go to homepage"
          className="rounded-md text-lg text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        >
          <BrandLogo size="sm" />
        </Link>

        <ul className="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex" role="list">
          <li><a href="#problem" className="rounded-sm hover:text-teal-700">Problem</a></li>
          <li><a href="#solution" className="rounded-sm hover:text-teal-700">Solution</a></li>
          <li><a href="#ai-features" className="rounded-sm hover:text-teal-700">AI Features</a></li>
          <li><a href="#wins" className="rounded-sm hover:text-teal-700">Why EcoDiab AI Wins</a></li>
          <li><a href="#roadmap" className="rounded-sm hover:text-teal-700">Roadmap</a></li>
          <li><a href="#contact" className="rounded-sm hover:text-teal-700">Contact</a></li>
        </ul>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="#contact"
            className="rounded-lg bg-teal-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-800 sm:px-4 sm:text-sm"
          >
            Request Demo
          </a>
        </div>
      </nav>
    </header>
  );
}
