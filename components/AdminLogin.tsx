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
            onLogin(); // App.tsx listens to auth state, but this doesn't hurt.
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Try again later.');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-sm mx-auto text-center border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Admin Access</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                    }}
                    placeholder="Admin Email"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                    }}
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    required
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <a
                        href="/"
                        className="flex items-center justify-center w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-colors text-sm"
                    >
                        Back
                    </a>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {loading ? '...' : 'Login'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;
