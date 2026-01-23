import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-pattern">
      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute top-40 left-0 -ml-20 w-72 h-72 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div 
          className="inline-flex flex-col sm:flex-row items-center py-2 px-4 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-6 border border-brand-100 shadow-sm animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <span>Admissions Open for 2025</span>
          <span className="hidden sm:inline mx-2 text-brand-300">|</span>
          <span className="text-accent-500">Note: Space is limited, first-come, first-serve</span>
        </div>
        <h1 
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-6 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          Cultivating Excellence <br className="hidden sm:block" />
          in <span className="text-brand-600">Music</span> & <span className="text-accent-500">Culture</span>
        </h1>
        <p 
          className="mt-4 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          Join Johannesburg's premier intermediate-to-advanced cultural school. 
          We provide structured education in classical instruments, percussion, and dance to shape the next generation of artists.
        </p>
        <div 
          className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: '400ms' }}
        >
          <a
            href="#register"
            className="px-8 py-4 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all transform hover:-translate-y-1 focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Register Now
          </a>
          <a
            href="#classes"
            className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            View Classes
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;