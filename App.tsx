import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RegistrationForm from './components/RegistrationForm';
import ClassGrid from './components/ClassGrid';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Our Programs Section */}
        <ClassGrid />

        {/* Registration Section */}
        <div className="bg-slate-50 border-y border-slate-100">
           <RegistrationForm />
        </div>

        {/* Contact Form Section */}
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}

export default App;