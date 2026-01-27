import React, { useState, useEffect, useRef } from 'react';
import { ClassItem } from '../types';

const classes: ClassItem[] = [
  { id: 'violin', name: 'Violin', description: 'Master bowing techniques and expressive dynamics.' },
  { id: 'viola', name: 'Viola', description: 'Explore the rich, deep tonal qualities of the viola.' },
  { id: 'cello', name: 'Cello', description: 'Develop strong resonance and foundational technique.' },
  { id: 'flute', name: 'Flute', description: 'Refine breath control and articulation.' },
  { id: 'clarinet', name: 'Clarinet', description: 'Focus on embouchure and finger dexterity.' },
  { id: 'trumpet', name: 'Trumpet', description: 'Build range, tone, and projection.' },
  { id: 'recorder', name: 'Recorder', description: 'Advanced ensemble work and breath control.' },
  { id: 'marimba', name: 'Marimba', description: 'Rhythmic precision and melodic percussion.' },
  { id: 'percussion', name: 'Percussion', description: 'Comprehensive training in rhythm and timing.' },
  { id: 'dance', name: 'Dance', description: 'Movement, discipline, and cultural expression.' },
];

const ClassIcon: React.FC<{ id: string, className?: string }> = ({ id, className = "w-6 h-6" }) => {
  switch (id) {
    case 'violin':
    case 'viola':
    case 'cello':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2c-2 0-3 1.5-3 3 0 1.5 1 2.5 1 3.5 0 1.5-2 2-2 4 0 3 2.5 5 4 5s4-2 4-5c0-2-2-2.5-2-4 0-1 1-2 1-3.5C15 3.5 14 2 12 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 17.5V7" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14h4" />
        </svg>
      );
    case 'flute':
      return (
         <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 4L4 20" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 7l-1 1" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-1 1" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 13l-1 1" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l-1 1" />
         </svg>
      );
    case 'clarinet':
    case 'recorder':
      return (
         <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 2h-4l-1 16 2 4 2-4-1-16z" />
           <circle cx="12" cy="6" r="0.8" fill="currentColor" stroke="none" />
           <circle cx="12" cy="10" r="0.8" fill="currentColor" stroke="none" />
           <circle cx="12" cy="14" r="0.8" fill="currentColor" stroke="none" />
         </svg>
      );
    case 'trumpet':
      return (
         <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 8h8l5-3v14l-5-3H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 8V6m0 2v2" />
         </svg>
      );
    case 'marimba':
      return (
         <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <rect x="2" y="6" width="20" height="12" rx="1" strokeWidth={1.5} />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18V6" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 18V6" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 18V6" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18V6" />
         </svg>
      );
    case 'percussion':
      return (
         <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <ellipse cx="12" cy="8" rx="8" ry="3" strokeWidth={1.5} />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8v8c0 1.66 3.58 3 8 3s8-1.34 8-3V8" />
         </svg>
      );
    case 'dance':
      return (
         <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 20a4 4 0 0 0 0-8c-1 0-3 1-4 3-1-2-3-3-4-3a4 4 0 0 0 0 8c1.5 0 3-1 4-2.5 1 1.5 2.5 2.5 4 2.5z" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12V5l4-3 4 3v7" />
         </svg>
      );
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
  }
}

const ClassGrid: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="classes" className="py-20 bg-white dark:bg-slate-900 scroll-mt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Programs</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            We offer specialized instruction for intermediate and advancing students. 
            Select learners may be referred to advanced conservatories upon graduation.
          </p>
        </div>
        
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((cls, index) => (
            <div 
              key={cls.id} 
              className={`bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-700 ease-out group flex flex-col transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <div className="h-10 w-10 bg-brand-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:bg-brand-600 dark:group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <ClassIcon id={cls.id} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{cls.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-grow">{cls.description}</p>
              <a 
                href="#register" 
                className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center"
              >
                Apply Now
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassGrid;