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
    <section ref={containerRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-pattern transition-colors duration-300">
      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-100 dark:bg-brand-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 dark:opacity-20 animate-pulse transition-colors duration-300"></div>
      <div className="absolute top-40 left-0 -ml-20 w-72 h-72 bg-accent-100 dark:bg-accent-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 dark:opacity-20 transition-colors duration-300"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div 
          className={`inline-flex flex-col sm:flex-row items-center py-2 px-4 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-700 dark:text-brand-300 text-sm font-semibold mb-6 border border-brand-100 dark:border-slate-700 shadow-sm transition-colors ${baseTransition} ${isVisible ? visibleState : hiddenState}`}
          style={{ transitionDelay: '100ms' }}
        >
          <span>Admissions Open for 2025</span>
          <span className="hidden sm:inline mx-2 text-brand-300 dark:text-slate-600">|</span>
          <span className="text-accent-500 dark:text-accent-400">Note: Space is limited, first-come, first-serve</span>
        </div>
        <h1 
          className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-6 ${baseTransition} ${isVisible ? visibleState : hiddenState}`}
          style={{ transitionDelay: '200ms' }}
        >
          Cultivating Excellence <br className="hidden sm:block" />
          in <span className="text-brand-600 dark:text-brand-400">Music</span> & <span className="text-accent-500">Culture</span>
        </h1>
        <p 
          className={`mt-4 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed ${baseTransition} ${isVisible ? visibleState : hiddenState}`}
          style={{ transitionDelay: '300ms' }}
        >
          Join Johannesburg's premier intermediate-to-advanced cultural school. 
          We provide structured education in classical instruments, percussion, and dance to shape the next generation of artists.
        </p>
        <div 
          className={`flex flex-col sm:flex-row justify-center gap-4 ${baseTransition} ${isVisible ? visibleState : hiddenState}`}
          style={{ transitionDelay: '400ms' }}
        >
          <a
            href="#register"
            className="px-8 py-4 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all transform hover:-translate-y-1 focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Register Now
          </a>
          <a
            href="#classes"
            className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
          >
            View Classes
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;