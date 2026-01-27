import React, { useState } from 'react';

interface AdminLoginProps {
    onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple client-side check. In a real app, use Firebase Auth.
        // Password is "admin123" for this demo
        if (password === 'admin123') {
            onLogin();
        } else {
            setError(true);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-sm mx-auto text-center border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Admin Access</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError(false);
                    }}
                    placeholder="Enter Admin Password"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
                {error && <p className="text-red-600 text-sm">Incorrect password</p>}
                <button
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
