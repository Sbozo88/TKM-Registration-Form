import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface AdminLoginProps {
    onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin();
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential') {
                setError('Authentication failed. Check your security credentials.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Security lockout active. Please try again later.');
            } else {
                setError('Access denied. Unusual activity detected.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
            {/* Cinematic Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-600/20 rounded-full filter blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full filter blur-[100px]"></div>
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-600 shadow-2xl shadow-brand-600/40 mb-8 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                        <span className="text-white text-4xl font-black">T</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Command Center</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Restricted Personnel Only</p>
                </div>

                <div className="glass-effect shadow-premium border-white/10 rounded-[2.5rem] p-10 sm:p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-600 to-indigo-600"></div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity (Email)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                placeholder="name@tkmproject.com"
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-white/5 text-white placeholder-slate-600 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key (Password)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-white/5 text-white placeholder-slate-600 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-shake">
                                <p className="text-red-400 text-xs font-black uppercase tracking-widest text-center">{error}</p>
                            </div>
                        )}

                        <div className="pt-4 space-y-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-5 px-8 border border-transparent rounded-[1.25rem] shadow-2xl shadow-brand-600/20 text-sm font-black uppercase tracking-[0.2em] text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/50 transition-all transform active:scale-[0.98] overflow-hidden ${loading ? 'opacity-75 cursor-wait' : 'hover:-translate-y-1'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative flex items-center">
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            Authorize Access
                                            <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                            </button>

                            <a
                                href="/"
                                className="w-full flex items-center justify-center px-4 py-4 text-slate-500 hover:text-white transition-colors font-bold uppercase tracking-[0.2em] text-[10px]"
                            >
                                Return to Terminal
                            </a>
                        </div>
                    </form>
                </div>

                <p className="text-center mt-12 text-slate-600 font-bold uppercase tracking-[0.3em] text-[8px]">
                    Protected by AES-256 Military Grade Encryption
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
