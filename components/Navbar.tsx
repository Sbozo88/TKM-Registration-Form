import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Programs', href: '#classes' },
    { name: 'Contact', href: '#contact' },
    { name: 'Admin', href: '/admin' },
    { name: 'Register', href: '#register', isCta: true },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 shadow-glass py-2'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            {/* Logo Text */}
            <a href="#" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">TKM<span className="text-brand-600">Project</span></span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold leading-none mt-1">Music Excellence</span>
              </div>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-1 items-center bg-slate-100/50 dark:bg-slate-800/30 p-1 rounded-full backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${link.isCta
                  ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-brand-600/20 active:scale-95'
                  : 'text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-white dark:hover:bg-slate-800 shadow-none hover:shadow-sm'
                  }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center ml-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-all border border-transparent hover:border-brand-200 dark:hover:border-brand-800"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button & Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-2xl transition-all duration-500 ease-in-out origin-top ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
          }`}
      >
        <div className="px-6 py-8 space-y-3 flex flex-col">
          {navLinks.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              onClick={handleLinkClick}
              style={{ transitionDelay: `${idx * 50}ms` }}
              className={`px-4 py-4 rounded-2xl text-lg font-bold transition-all duration-300 ${link.isCta
                ? 'bg-brand-600 text-white text-center mt-4 shadow-lg shadow-brand-600/20'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-brand-600 dark:hover:text-brand-400'
                } ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;