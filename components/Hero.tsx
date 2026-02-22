import React, { useState, useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Common transition classes
  const baseTransition = "transition-all duration-1000 ease-out transform";
  const hiddenState = "opacity-0 translate-y-12";
  const visibleState = "opacity-100 translate-y-0";

  return (
    <section ref={containerRef} className="relative pt-32 pb-24 lg:pt-56 lg:pb-40 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background Ornaments */}
      <div className="absolute inset-0 bg-pattern opacity-30 dark:opacity-20 pointer-events-none"></div>

      {/* Dynamic Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-200/40 dark:bg-brand-900/10 rounded-full filter blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-200/30 dark:bg-slate-900/20 rounded-full filter blur-[100px] pointer-events-none"></div>

      {/* Floating Musical Elements */}
      <div className="absolute top-1/4 right-10 lg:right-24 animate-float opacity-10 dark:opacity-20 hidden sm:block pointer-events-none" style={{ animationDelay: '0s' }}>
        <svg className="w-24 h-24 text-brand-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 left-10 lg:left-24 animate-float opacity-10 dark:opacity-20 hidden sm:block pointer-events-none" style={{ animationDelay: '2s' }}>
        <svg className="w-20 h-20 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" transform="rotate(15 12 12)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div
            className={`inline-flex items-center px-4 py-1.5 rounded-full glass-effect shadow-premium border-brand-100 dark:border-brand-900/30 mb-8 ${baseTransition} ${isVisible ? visibleState : hiddenState}`}
            style={{ transitionDelay: '100ms' }}
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-ping mr-3"></span>
            <span className="text-sm font-bold tracking-wide text-brand-700 dark:text-brand-300 uppercase">Admissions 2025 Now Open</span>
          </div>

          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8 ${baseTransition} ${isVisible ? visibleState : hiddenState}`}
            style={{ transitionDelay: '200ms' }}
          >
            Engineering the <br className="hidden md:block" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 premium-gradient bg-clip-text text-transparent px-2">Future of Music</span>
              <span className="absolute -bottom-2 sm:-bottom-4 left-0 w-full h-1 sm:h-2 bg-brand-500/20 dark:bg-brand-500/10 rounded-full"></span>
            </span>
          </h1>

          <p
            className={`mt-4 text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl font-medium leading-[1.6] mb-12 ${baseTransition} ${isVisible ? visibleState : hiddenState}`}
            style={{ transitionDelay: '300ms' }}
          >
            Elevate your craft at Johannesburg's premier institute for advanced music and culture.
            From classical foundations to contemporary mastery.
          </p>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto ${baseTransition} ${isVisible ? visibleState : hiddenState}`}
            style={{ transitionDelay: '400ms' }}
          >
            <a
              href="#register"
              className="group relative w-full sm:w-auto px-10 py-5 bg-brand-600 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-2xl shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center">
                Register Today
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            <a
              href="#classes"
              className="group w-full sm:w-auto px-10 py-5 glass-effect text-slate-900 dark:text-white font-bold text-lg rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-[0.98]"
            >
              Explore Programs
            </a>
          </div>

          {/* Social Proof / Stats */}
          <div
            className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 items-center border-t border-slate-100 dark:border-slate-800/50 pt-12 ${baseTransition} ${isVisible ? visibleState : hiddenState}`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900 dark:text-white">10+</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Instruments</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900 dark:text-white">500+</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Graduates</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900 dark:text-white">15+</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Expert Mentors</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900 dark:text-white">100%</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Focus</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;