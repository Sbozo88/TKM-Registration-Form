import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand Info */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">
            <span className="text-brand-500">TKM</span>Project
          </h3>
          <p className="text-sm leading-relaxed max-w-xs mb-6">
            Empowering the next generation through disciplined musical education and cultural enrichment.
          </p>
          <div className="flex space-x-4">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-all cursor-pointer group">
              <span className="text-xs group-hover:scale-110 transition-transform">FB</span>
            </div>
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-all cursor-pointer group">
              <span className="text-xs group-hover:scale-110 transition-transform">IG</span>
            </div>
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-all cursor-pointer group">
              <span className="text-xs group-hover:scale-110 transition-transform">YT</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-3 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>818 Ndebele St, Moroka, Soweto, 1818</span>
            </li>
            <li className="flex items-start">
               <svg className="w-5 h-5 mr-3 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span>081 432 5083</span>
            </li>
            <li className="flex items-start">
               <svg className="w-5 h-5 mr-3 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <a href="mailto:innomok@outlook.com" className="hover:text-white">innomok@outlook.com</a>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
           <h4 className="text-white font-semibold mb-4">Quick Links</h4>
           <ul className="space-y-2 text-sm">
             <li><a href="#classes" className="hover:text-white">Our Programs</a></li>
             <li><a href="#register" className="hover:text-white">Register for 2025</a></li>
             <li><a href="#contact" className="hover:text-white">Send Inquiry</a></li>
             <li className="pt-4"><a href="#" className="hover:text-white opacity-60">Privacy Notice & POPIA</a></li>
           </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} TKMProject Music & Cultural School. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;