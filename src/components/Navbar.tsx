import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Practice', path: '/practice' },
    { label: 'Analysis', path: '/analysis' },
    { label: 'Reports', path: '/report' },
    { label: 'History', path: '/history' },
    { label: 'How It Works', path: '/how-it-works' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E2DA] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Single text element brand wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E65A3C] flex items-center justify-center text-white font-serif font-bold text-lg shadow-xs group-hover:bg-[#D44D30] transition-colors">
              Q
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#1C1917]">
              Interview<span className="text-[#E65A3C]">IQ</span>
            </span>
          </Link>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive(link.path)
                    ? 'text-[#1C1917] font-semibold'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E65A3C] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Zone 3: Primary action */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/practice">
              <Button size="sm" variant="primary" icon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                Start Interview
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/practice">
              <Button size="sm" variant="primary">
                Practice
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#57534E] hover:text-[#1C1917] hover:bg-[#EFECE6] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7E2DA] bg-[#FAF8F5] px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-white text-[#E65A3C] font-semibold shadow-xs border border-[#E7E2DA]'
                  : 'text-[#57534E] hover:bg-[#F0ECE4] hover:text-[#1C1917]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link to="/practice" onClick={() => setMobileMenuOpen(false)}>
              <Button size="md" variant="primary" className="w-full">
                Start Interview
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
