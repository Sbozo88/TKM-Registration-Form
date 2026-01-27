import React, { useState } from 'react';
import StudentRegistrationForm from './StudentRegistrationForm';
import TeacherApplicationForm from './TeacherApplicationForm';

const RegistrationForm: React.FC = () => {
  const [formType, setFormType] = useState<'student' | 'teacher'>('student');

  return (
    <section id="register" className="py-24 bg-slate-50 dark:bg-slate-950 scroll-mt-24 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Join TKMProject</h2>

          {/* Toggle Switch */}
          <div className="inline-flex bg-white dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm mb-6 transition-colors">
            <button
              onClick={() => setFormType('student')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${formType === 'student'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
            >
              Student Registration
            </button>
            <button
              onClick={() => setFormType('teacher')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${formType === 'teacher'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
            >
              Teacher Application
            </button>
          </div>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {formType === 'student'
              ? "Secure your spot for the upcoming term. Your information is kept strictly confidential."
              : "Passionate about music education? Apply to join our faculty of expert instructors."}
          </p>
        </div>

        {formType === 'student' ? <StudentRegistrationForm /> : <TeacherApplicationForm />}

      </div>
    </section>
  );
};

export default RegistrationForm;