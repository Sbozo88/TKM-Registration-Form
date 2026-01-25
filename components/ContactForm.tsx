import React, { useState, useCallback } from 'react';
import { Input, TextArea } from './ui';
import { ContactFormData, FormErrors } from '../types';

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mgokvayk";

const INITIAL_DATA: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  botField: '',
};

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const checkFieldValidity = useCallback((name: keyof ContactFormData, value: string): boolean => {
      switch (name) {
          case 'name':
          case 'subject':
          case 'message':
              return value.trim().length > 0;
          case 'email':
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          default:
              return false;
      }
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!checkFieldValidity('name', formData.name)) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!checkFieldValidity('email', formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!checkFieldValidity('subject', formData.subject)) newErrors.subject = "Subject is required";
    if (!checkFieldValidity('message', formData.message)) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.botField) return; // Honeypot
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Destructure to separate the internal botField from the payload
      const { botField, ...rest } = formData;

      const payload = {
        ...rest,
        _subject: `New Contact Inquiry: ${formData.subject}`, // Formspree specific
        timestamp: new Date().toISOString()
      };

      // 1. Formspree Submission
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      setSubmitStatus('success');
      setFormData(INITIAL_DATA);
    } catch (error) {
      console.error("Submission error", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-slate-900 scroll-mt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Copy & CTA */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Have questions about our curriculum, faculty, or the audition process? 
              Our administrative team is here to help you navigate your musical journey.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors">
                <div className="w-12 h-12 bg-brand-100 dark:bg-slate-700 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Email Us</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">innomok@outlook.com</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors">
                <div className="w-12 h-12 bg-brand-100 dark:bg-slate-700 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mr-4">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Location</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">818 Ndebele St, Moroka, Soweto, 1818</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-brand-600 dark:bg-brand-700 rounded-2xl shadow-xl shadow-brand-200 dark:shadow-none text-white relative overflow-hidden transition-colors">
               <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Ready to join us?</h3>
                <p className="text-brand-100 mb-6 text-sm">Don't miss the 2025 intake. Spaces are filling up quickly.</p>
                <a 
                  href="#register" 
                  className="inline-block px-6 py-3 bg-white text-brand-600 font-bold rounded-full hover:bg-brand-50 transition-colors shadow-md"
                >
                  Start Registration
                </a>
               </div>
               <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-500 rounded-full opacity-50 blur-2xl"></div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative transition-colors">
             {/* Netlify Honeypot Field */}
             <div className="hidden">
               <label>Don’t fill this out if you’re human: <input name="botField" value={formData.botField} onChange={handleChange} autoComplete="off" /></label>
             </div>

            {submitStatus === 'success' ? (
               <div className="text-center py-10 animate-fade-in">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                    <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-8">We'll get back to you as soon as possible.</p>
                  <button 
                    onClick={() => setSubmitStatus('idle')}
                    className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 dark:hover:text-brand-300 underline"
                  >
                    Send another message
                  </button>
               </div>
            ) : (
              <form 
                name="tkm-contact"
                onSubmit={handleSubmit} 
                className="space-y-6"
                noValidate
              >
                <Input 
                  id="contact-name" 
                  name="name" 
                  label="Your Name" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  isValid={checkFieldValidity('name', formData.name)}
                  required 
                  disabled={isSubmitting}
                />
                <Input 
                  id="contact-email" 
                  name="email" 
                  label="Email Address" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  isValid={checkFieldValidity('email', formData.email)}
                  required 
                  disabled={isSubmitting}
                />
                <Input 
                  id="contact-subject" 
                  name="subject" 
                  label="Subject" 
                  placeholder="Inquiry about Violin classes" 
                  value={formData.subject}
                  onChange={handleChange}
                  error={errors.subject}
                  isValid={checkFieldValidity('subject', formData.subject)}
                  required 
                  disabled={isSubmitting}
                />
                <TextArea 
                  id="contact-message" 
                  name="message" 
                  label="Message" 
                  rows={4} 
                  placeholder="How can we help you?" 
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  isValid={checkFieldValidity('message', formData.message)}
                  required 
                  disabled={isSubmitting}
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-slate-900 dark:bg-slate-950 dark:border dark:border-slate-700 text-white font-bold rounded-full hover:bg-slate-800 dark:hover:bg-slate-900 transition-all shadow-lg flex justify-center items-center ${
                    isSubmitting ? 'opacity-75 cursor-wait' : 'hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
                {submitStatus === 'error' && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center mt-4">
                    Failed to send message. Please try again or email us directly.
                  </p>
                )}
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactForm;