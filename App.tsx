import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RegistrationForm from './components/RegistrationForm';
import ClassGrid from './components/ClassGrid';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { ThemeProvider } from './components/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 transition-colors duration-300">
        <Navbar />
        
        <main className="flex-grow">
          <Hero />
          
          {/* Our Programs Section */}
          <ClassGrid />

          {/* Registration Section */}
          <div className="bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800 transition-colors duration-300">
             <RegistrationForm />
          </div>

          {/* Contact Form Section */}
          <ContactForm />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;