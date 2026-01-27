import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';

interface DashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [registrations, setRegistrations] = useState<DocumentData[]>([]);
    const [teachers, setTeachers] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');

    useEffect(() => {
        // Real-time listener for Students
        const qStudents = query(collection(db, "registrations"), orderBy("submittedAt", "desc"));
        const unsubscribeStudents = onSnapshot(qStudents,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRegistrations(data);
            },
            (error) => {
                console.error("Error fetching students:", error);
                // Don't block loading on error, just show empty
            }
        );

        // Real-time listener for Teachers
        const qTeachers = query(collection(db, "teacher_applications"), orderBy("submittedAt", "desc"));
        const unsubscribeTeachers = onSnapshot(qTeachers,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTeachers(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching teachers:", error);
                setLoading(false); // Ensure we stop loading even on error
            }
        );

        return () => {
            unsubscribeStudents();
            unsubscribeTeachers();
        }
    }, []);

    if (loading) {
        return <div className="text-center py-20 text-slate-500">Loading dashboard data...</div>;
    }

    return (
        <section className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                    <button onClick={onLogout} className="text-sm text-red-600 hover:text-red-700 font-medium">
                        Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`py-2 px-4 font-medium border-b-2 transition-colors ${activeTab === 'students' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Students ({registrations.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={`py-2 px-4 font-medium border-b-2 transition-colors ${activeTab === 'teachers' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Teachers ({teachers.length})
                    </button>
                </div>

                {/* Table View */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                                    {activeTab === 'students' ? (
                                        <>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Parent</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Class</th>
                                        </>
                                    ) : (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Instruments</th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                                {(activeTab === 'students' ? registrations : teachers).map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            {row.submittedAt?.seconds ? new Date(row.submittedAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                {activeTab === 'students' ? row.studentName : row.fullName}
                                            </div>
                                            <div className="text-xs text-slate-500 truncate max-w-[150px]">
                                                {row.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            {row.phone}
                                        </td>
                                        {activeTab === 'students' ? (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                                                    {row.parentName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600 dark:text-brand-400 font-medium">
                                                    {row.classes}
                                                </td>
                                            </>
                                        ) : (
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">
                                                {Array.isArray(row.instruments) ? row.instruments.join(', ') : row.instruments}
                                                {row.hasCv && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">CV</span>}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {row.status || 'New'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(activeTab === 'students' ? registrations : teachers).length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            No {activeTab} found yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;
