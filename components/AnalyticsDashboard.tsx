import React, { useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { DocumentData } from 'firebase/firestore';

interface AnalyticsProps {
    students: DocumentData[];
    teachers: DocumentData[];
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ students, teachers }) => {

    // 1. Program Distribution (Pie Chart)
    const programData = useMemo(() => {
        const counts: { [key: string]: number } = {};
        students.forEach(s => {
            // 'classes' field holds the program name (e.g., "Violin")
            const program = s.classes || 'Unknown';
            counts[program] = (counts[program] || 0) + 1;
        });

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // Sort by popularity
    }, [students]);

    // 2. Registration Trends (Last 7 Days)
    const trendData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(dateStr => {
            const displayDate = new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });

            const count = students.filter(s => {
                if (!s.submittedAt) return false;
                // Handle both Firebase Timestamp and ISO strings
                const d = s.submittedAt.seconds
                    ? new Date(s.submittedAt.seconds * 1000)
                    : new Date(s.submittedAt);
                return d.toISOString().split('T')[0] === dateStr;
            }).length;

            return { date: displayDate, count };
        });
    }, [students]);

    return (
        <div className="space-y-6">

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/20 dark:border-white/5">
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Total Students</h3>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{students.length}</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/20 dark:border-white/5">
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Total Teachers</h3>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{teachers.length}</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/20 dark:border-white/5">
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">New This Week</h3>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                        {trendData.reduce((acc, curr) => acc + curr.count, 0)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Pie Chart: Program Popularity */}
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/20 dark:border-white/5 h-[400px] flex flex-col">
                    <h3 className="text-slate-800 dark:text-white text-lg font-bold mb-6">Program Popularity</h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={programData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {programData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart: Registration Trends */}
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/20 dark:border-white/5 h-[400px] flex flex-col">
                    <h3 className="text-slate-800 dark:text-white text-lg font-bold mb-6">Registrations (Last 7 Days)</h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsDashboard;
