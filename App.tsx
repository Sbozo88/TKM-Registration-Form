import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RegistrationForm from './components/RegistrationForm';
import ClassGrid from './components/ClassGrid';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { ThemeProvider } from './components/ThemeContext';
import { auth } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial path
    if (window.location.pathname === '/admin') {
      setIsAdminRoute(true);
    }

    // Handle back/forward navigation
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname === '/admin');
    };

    window.addEventListener('popstate', handlePopState);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdminLoggedIn(!!user);
      setIsLoading(false);
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAdminLoggedIn(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isAdminRoute) {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full"></div>
        </div>
      );
    }

    if (isAdminLoggedIn) {
      return (
        <ThemeProvider>
          <AdminDashboard onLogout={handleLogout} />
        </ThemeProvider>
      );
    }
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <AdminLogin onLogin={() => {/* State handled by onAuthStateChanged */ }} />
        </div>
      </ThemeProvider>
    );
  }

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