import React from 'react';
import { Input, TextArea } from './ui';

const ContactForm: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Copy & CTA */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Get in Touch</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Have questions about our curriculum, faculty, or the audition process? 
              Our administrative team is here to help you navigate your musical journey.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Us</h4>
                  <p className="text-slate-600 text-sm">info@tkmproject.org</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mr-4">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Location</h4>
                  <p className="text-slate-600 text-sm">Johannesburg, South Africa</p>
                </div>
              </div>
            </div>

            {/* Added CTA Button per request */}
            <div className="p-8 bg-brand-600 rounded-2xl shadow-xl shadow-brand-200 text-white relative overflow-hidden">
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
               {/* Decorative Element */}
               <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-500 rounded-full opacity-50 blur-2xl"></div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
            <form className="space-y-6">
              <Input id="contact-name" name="name" label="Your Name" placeholder="John Doe" required />
              <Input id="contact-email" name="email" label="Email Address" type="email" placeholder="john@example.com" required />
              <Input id="contact-subject" name="subject" label="Subject" placeholder="Inquiry about Violin classes" required />
              <TextArea id="contact-message" name="message" label="Message" rows={4} placeholder="How can we help you?" required />
              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactForm;