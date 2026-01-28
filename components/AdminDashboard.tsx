import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import AnalyticsDashboard from './AnalyticsDashboard';

interface DashboardProps {
    onLogout: () => void;
}

// --- Icons ---
const Icons = {
    Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Academic: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
    Export: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
    FileExcel: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    FilePdf: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    FileDoc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    ChartPie: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>,
    Filter: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
};

// --- Helper Components ---

const StatCard = ({ title, value, subtext, colorClass, darkColorClass }: { title: string, value: number | string, subtext?: string, colorClass: string, darkColorClass: string }) => (
    <div className={`rounded-2xl p-6 shadow-sm transition-transform hover:scale-[1.02] ${colorClass} ${darkColorClass} text-white`}>
        <div className="flex flex-col h-full justify-between">
            <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">{title}</p>
                <h3 className="text-4xl font-bold mt-2">{value}</h3>
            </div>
            {subtext && <p className="text-xs font-medium opacity-70 mt-4">{subtext}</p>}
        </div>
    </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
            ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
    >
        <div className={`p-1 rounded-lg transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'}`}>
            <Icon />
        </div>
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const Avatar = ({ name, size = "md" }: { name: string, size?: "sm" | "md" }) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
    const colorIndex = name.length % colors.length;
    const dims = size === "md" ? "h-10 w-10 text-xs" : "h-8 w-8 text-[10px]";

    return (
        <div className={`${dims} flex-shrink-0 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-slate-800`}>
            {initials}
        </div>
    );
};

// --- Export Helpers ---

const exportToExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, `${filename}.xlsx`);
};

const exportToPDF = (data: any[], title: string, filename: string) => {
    const doc = new jsPDF();
    doc.text(title, 14, 22);

    // transform data for autoTable
    // We only take keys from the first item
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).filter(k => k !== 'id').map(key => key.toUpperCase());
    const rows = data.map(row => Object.keys(data[0]).filter(k => k !== 'id').map(key => String(row[key] || '')));

    autoTable(doc, {
        startY: 30,
        head: [headers],
        body: rows,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [14, 165, 233] },
    });

    doc.save(`${filename}.pdf`);
};

const exportToDoc = (data: any[], title: string, filename: string) => {
    const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const postHtml = "</body></html>";

    let html = `<h1>${title}</h1><table border='1' style='border-collapse:collapse;'><thead><tr>`;

    if (data.length > 0) {
        Object.keys(data[0]).forEach(key => {
            if (key !== 'id') html += `<th style='background-color:#0ea5e9; color:white; padding:5px;'>${key}</th>`;
        });
        html += "</tr></thead><tbody>";

        data.forEach(row => {
            html += "<tr>";
            Object.keys(data[0]).forEach(key => {
                if (key !== 'id') {
                    html += `<td style='padding:5px;'>${String(row[key] || '')}</td>`;
                }
            });
            html += "</tr>";
        });
        html += "</tbody></table>";
    }

    const blob = new Blob(['\ufeff', preHtml, html, postHtml], {
        type: 'application/msword'
    });
    saveAs(blob, `${filename}.doc`);
};

// --- Modal Component ---

const DetailModal = ({ item, onClose }: { item: any, onClose: () => void }) => {
    if (!item) return null;

    const entries = Object.entries(item).filter(([key]) => !['id', 'submittedAt', 'cvUrl'].includes(key));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/50 dark:border-white/10 animate-fade-in-up">
                <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-white/5">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submission Details</h3>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors">
                        <Icons.Close />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {entries.map(([key, value]) => (
                            <div key={key} className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                <div className="text-sm font-medium text-slate-900 dark:text-white break-words p-3 rounded-lg bg-slate-50/50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                                    {String(value)}
                                </div>
                            </div>
                        ))}
                        {item.cvUrl && (
                            <div className="col-span-full space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">CV / Resume</label>
                                <div>
                                    <a href={item.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                                        <Icons.Download />
                                        <span>Download CV</span>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const AdminDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [registrations, setRegistrations] = useState<DocumentData[]>([]);
    const [teachers, setTeachers] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState<'overview' | 'students' | 'teachers' | 'analytics'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [programFilter, setProgramFilter] = useState('');
    const [selectedItem, setSelectedItem] = useState<DocumentData | null>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);

    useEffect(() => {
        const qStudents = query(collection(db, "registrations"), orderBy("submittedAt", "desc"));
        const unsubStudents = onSnapshot(qStudents, (snap) => setRegistrations(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

        const qTeachers = query(collection(db, "teacher_applications"), orderBy("submittedAt", "desc"));
        const unsubTeachers = onSnapshot(qTeachers, (snap) => {
            setTeachers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });

        return () => { unsubStudents(); unsubTeachers(); }
    }, []);

    const filteredData = useMemo(() => {
        let data = currentView === 'students' ? registrations : teachers;

        // Filter by Program (Students only)
        if (currentView === 'students' && programFilter) {
            data = data.filter(item => item.classes === programFilter);
        }

        if (!searchTerm) return data;
        const lower = searchTerm.toLowerCase();
        return data.filter(item => {
            const name = currentView === 'students' ? item.studentName : item.fullName;
            return (name?.toLowerCase().includes(lower) || item.email?.toLowerCase().includes(lower) || item.phone?.toLowerCase().includes(lower));
        });
    }, [currentView, registrations, teachers, searchTerm, programFilter]);

    const newToday = [...registrations, ...teachers].filter(r => {
        if (!r.submittedAt) return false;
        const d = r.submittedAt.seconds ? new Date(r.submittedAt.seconds * 1000) : new Date(r.submittedAt);
        return d.toDateString() === new Date().toDateString();
    }).length;

    const handleExport = (type: 'excel' | 'pdf' | 'doc' | 'classlist') => {
        const data = filteredData.map(({ id, ...rest }) => rest);
        const filename = `tkm_${currentView}_${new Date().toISOString().split('T')[0]}`;
        const title = `${currentView.charAt(0).toUpperCase() + currentView.slice(1)} Report`;

        if (type === 'excel') exportToExcel(data, filename);
        if (type === 'pdf') exportToPDF(data, title, filename);
        if (type === 'doc') exportToDoc(data, title, filename);
        if (type === 'classlist') {
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text(`${programFilter || 'All Students'} - Class List`, 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

            const headers = [['Student Name', 'Age', 'Parent Name', 'Contact', 'Email']];
            const rows = data.map(row => [
                row.studentName,
                row.studentDob ? new Date().getFullYear() - new Date(row.studentDob).getFullYear() : '',
                row.parentName,
                row.phone,
                row.email
            ]);

            autoTable(doc, {
                startY: 35,
                head: headers,
                body: rows,
                theme: 'striped',
                headStyles: { fillColor: [62, 59, 246] }, // Brand color
            });
            doc.save(`${filename}_classlist.pdf`);
        }

        setShowExportMenu(false);
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full"></div></div>;

    return (
        <div className="relative flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">

            {/* Ambient Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-brand-400/20 mix-blend-multiply filter blur-[100px] opacity-70 dark:bg-brand-900/20 dark:mix-blend-normal"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-violet-400/20 mix-blend-multiply filter blur-[100px] opacity-70 dark:bg-violet-900/20 dark:mix-blend-normal"></div>
                <div className="absolute top-[40%] left-[40%] w-[50vw] h-[50vw] rounded-full bg-sky-300/20 mix-blend-multiply filter blur-[100px] opacity-70 dark:bg-sky-900/20 dark:mix-blend-normal"></div>
            </div>

            {/* Sidebar with Glassmorphism */}
            <aside className="w-64 flex-shrink-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/50 dark:border-white/10 flex flex-col transition-colors z-20 shadow-xl">
                <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100/50 dark:border-white/5">
                    <img src="/tkm-logo.png" alt="TKM Logo" className="h-10 w-10 object-contain drop-shadow-md" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-violet-600 dark:from-sky-400 dark:to-violet-400">
                        TKMAdmin
                    </span>
                </div>

                <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto hidden-scrollbar">
                    <div className="px-4 text-xs font-bold text-slate-400/80 uppercase tracking-wider mb-2">Main</div>
                    <SidebarItem icon={Icons.Home} label="Overview" active={currentView === 'overview'} onClick={() => setCurrentView('overview')} />
                    <SidebarItem icon={Icons.ChartPie} label="Analytics" active={currentView === 'analytics'} onClick={() => setCurrentView('analytics')} />

                    <div className="px-4 text-xs font-bold text-slate-400/80 uppercase tracking-wider mb-2 mt-8">People</div>
                    <SidebarItem icon={Icons.Users} label="Students" active={currentView === 'students'} onClick={() => setCurrentView('students')} />
                    <SidebarItem icon={Icons.Academic} label="Teachers" active={currentView === 'teachers'} onClick={() => setCurrentView('teachers')} />
                </div>

                <div className="p-4 border-t border-slate-100/50 dark:border-white/5 bg-white/30 dark:bg-black/20 backdrop-blur-sm">
                    <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors">
                        <Icons.Logout />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                    <div className="mt-4 px-2 flex items-center">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="ml-3 text-xs font-medium text-slate-500 dark:text-slate-400">System Online</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                {/* Header with Glassmorphism */}
                <header className="h-20 flex-shrink-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-white/50 dark:border-white/10 flex items-center justify-between px-8 z-10 sticky top-0 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                            {currentView === 'overview' ? 'Dashboard Overview' : `${currentView.charAt(0).toUpperCase() + currentView.slice(1)} Management`}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Welcome back, Admin</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-500 to-violet-500 p-[2px] shadow-lg shadow-brand-500/30">
                            <div className="h-full w-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                                <span className="text-sm font-bold">A</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    {currentView === 'overview' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Total Students" value={registrations.length} colorClass="bg-gradient-to-br from-blue-500 to-indigo-600" darkColorClass="dark:from-blue-600 dark:to-indigo-700" subtext={`+${newToday} today`} />
                                <StatCard title="Total Teachers" value={teachers.length} colorClass="bg-gradient-to-br from-emerald-400 to-teal-600" darkColorClass="dark:from-emerald-500 dark:to-teal-700" />
                                <StatCard title="New Requests" value={newToday} colorClass="bg-gradient-to-br from-amber-400 to-orange-600" darkColorClass="dark:from-amber-500 dark:to-orange-700" />
                            </div>

                            {/* Recent Activity Section - Glass Effect */}
                            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-xl overflow-hidden">
                                <div className="px-8 py-6 border-b border-slate-200/50 dark:border-white/5 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h3>
                                    <span className="text-xs font-medium px-3 py-1 bg-white/50 dark:bg-white/10 rounded-full border border-white/20 text-slate-500 dark:text-slate-400">Live Feed</span>
                                </div>
                                <div className="divide-y divide-slate-100/50 dark:divide-white/5">
                                    {[...registrations, ...teachers]
                                        .sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0))
                                        .slice(0, 5)
                                        .map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="px-8 py-4 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                                onClick={() => setSelectedItem(item)}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <Avatar name={item.studentName || item.fullName} size="sm" />
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{item.studentName || item.fullName}</p>
                                                        <div className="flex items-center space-x-2 mt-0.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${item.studentName ? 'bg-brand-500' : 'bg-violet-500'}`}></span>
                                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                {item.studentName ? 'Student' : 'Teacher'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                        {item.submittedAt?.seconds ? new Date(item.submittedAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        {item.submittedAt?.seconds ? new Date(item.submittedAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'analytics' && (
                        <div className="animate-fade-in-up">
                            <AnalyticsDashboard students={registrations} teachers={teachers} />
                        </div>
                    )}

                    {(currentView === 'students' || currentView === 'teachers') && (
                        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-xl overflow-hidden animate-fade-in flex flex-col h-[calc(100vh-10rem)]">
                            {/* Toolbar (Search, Filter, Export) */}
                            <div className="p-6 border-b border-slate-200/50 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/20 dark:bg-black/10">

                                <div className="flex items-center space-x-3 w-full max-w-2xl">
                                    {/* Program Filter (Students Only) */}
                                    {currentView === 'students' && (
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                <Icons.Filter />
                                            </div>
                                            <select
                                                value={programFilter}
                                                onChange={(e) => setProgramFilter(e.target.value)}
                                                className="pl-10 pr-8 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-slate-900 dark:text-white appearance-none cursor-pointer backdrop-blur-sm transition-all text-sm font-medium"
                                            >
                                                <option value="">All Programs</option>
                                                <option value="Violin">Violin</option>
                                                <option value="Viola">Viola</option>
                                                <option value="Cello">Cello</option>
                                                <option value="Flute">Flute</option>
                                                <option value="Clarinet">Clarinet</option>
                                                <option value="Trumpet">Trumpet</option>
                                                <option value="Recorder">Recorder</option>
                                                <option value="Marimba">Marimba</option>
                                                <option value="Percussion">Percussion</option>
                                                <option value="Dance">Dance</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <Icons.Search />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder={`Search ${currentView}...`}
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-slate-900 dark:text-white placeholder-slate-400 transition-all backdrop-blur-sm"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowExportMenu(!showExportMenu)}
                                            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-all active:scale-95 font-medium text-sm"
                                        >
                                            <Icons.Export />
                                            <span>Export</span>
                                        </button>

                                        {showExportMenu && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-fade-in">
                                                <div className="p-1">
                                                    <button onClick={() => handleExport('excel')} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                        <Icons.FileExcel /> <span>Excel (.xlsx)</span>
                                                    </button>
                                                    <button onClick={() => handleExport('pdf')} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                        <Icons.FilePdf /> <span>PDF Report</span>
                                                    </button>
                                                    <button onClick={() => handleExport('doc')} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                        <Icons.FileDoc /> <span>Word (.doc)</span>
                                                    </button>
                                                </div>
                                                {currentView === 'students' && (
                                                    <div className="border-t border-slate-100 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-700/30">
                                                        <button onClick={() => handleExport('classlist')} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors font-medium">
                                                            <Icons.Users /> <span>Class List (PDF)</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-white/30 dark:bg-white/5 px-4 py-2 rounded-xl border border-white/20">
                                        {filteredData.length} records
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-auto flex-1 custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50/50 dark:bg-white/5 text-xs uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider sticky top-0 backdrop-blur-md z-10">
                                        <tr>
                                            <th className="px-8 py-5">Name</th>
                                            <th className="px-6 py-5">Contact</th>
                                            {currentView === 'students' ? (
                                                <>
                                                    <th className="px-6 py-5">Parent</th>
                                                    <th className="px-6 py-5">Classes</th>
                                                </>
                                            ) : (
                                                <th className="px-6 py-5">Instruments</th>
                                            )}
                                            <th className="px-8 py-5 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/50 dark:divide-white/5">
                                        {filteredData.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-150 cursor-pointer"
                                                onClick={() => setSelectedItem(row)}
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar name={currentView === 'students' ? row.studentName : row.fullName} />
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                                {currentView === 'students' ? row.studentName : row.fullName}
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{row.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300 font-mono">
                                                    {row.phone}
                                                </td>
                                                {currentView === 'students' ? (
                                                    <>
                                                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300 font-medium">{row.parentName}</td>
                                                        <td className="px-6 py-5">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-100/50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 border border-brand-200/50 dark:border-brand-500/30">
                                                                {row.classes}
                                                            </span>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-wrap gap-2">
                                                            {(Array.isArray(row.instruments) ? row.instruments : [row.instruments]).map((i: string, idx: number) => (
                                                                <span key={idx} className="text-xs px-2.5 py-1 bg-slate-200/50 dark:bg-white/10 rounded-lg text-slate-700 dark:text-slate-200 border border-slate-300/50 dark:border-white/10 font-medium">
                                                                    {i}
                                                                </span>
                                                            ))}
                                                            {row.hasCv && (
                                                                <div className="flex items-center space-x-1.5 text-xs px-2.5 py-1 bg-emerald-100/50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg border border-emerald-200/50 dark:border-emerald-500/30 font-bold">
                                                                    <Icons.Download /> <span>CV</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-8 py-5 text-right">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${row.status === 'new' ? 'bg-green-100/50 border-green-200/50 text-green-700 dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-400' : 'bg-slate-100/50 border-slate-200/50 text-slate-600 dark:bg-slate-700/50 dark:border-slate-600/50 dark:text-slate-300'}`}>
                                                        {row.status || 'Received'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredData.length === 0 && (
                                <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                                    No records found matching "{searchTerm}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Detail Modal */}
            <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
    );
};

export default AdminDashboard;
