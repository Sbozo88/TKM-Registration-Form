import React, { useState } from 'react';

const AdmissionInfo: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-premium border border-white/20 dark:border-white/5 overflow-hidden mb-12 transition-all duration-300 transform hover:shadow-2xl hover:-translate-y-1">
            {/* Header / Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full relative flex items-center justify-between p-8 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-white/5 border-b border-white/10 dark:border-white/5 transition-all text-left overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-4 relative z-10 w-full">
                    <div className="w-12 h-12 rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/30 flex justify-center items-center text-white flex-shrink-0 animate-pulse">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">2026 Registration Brief</h3>
                        <p className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">Crucial Information & Fee Structure</p>
                    </div>
                </div>
                <div className="relative z-10 flex-shrink-0 ml-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 transition-transform duration-300">
                        <svg className={`w-6 h-6 transform transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180 text-brand-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2M" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </button>

            {/* Content */}
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-8 sm:p-12 space-y-12">

                    {/* Welcome */}
                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                        <p className="text-xl font-medium leading-relaxed">
                            Welcome to the <strong className="text-slate-900 dark:text-white font-black">Thabang Ka Mmino (TKM) Music & Cultural Project!</strong> We are excited to welcome your child to our programs. Below is a summary of our registration processes, fee structure, and operational schedule for the <strong className="text-brand-600 dark:text-brand-400">2026</strong> year.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Key Dates & Registration */}
                        <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-white/5 shadow-inner">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Key Dates & Docs</h4>
                            </div>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                                <li>
                                    <span className="font-bold text-slate-900 dark:text-white">Opening Date:</span> Officially opened on <strong className="text-amber-600 dark:text-amber-400">February 7, 2026</strong>.
                                </li>
                                <li>
                                    <span className="font-bold text-slate-900 dark:text-white">Required Docs:</span> You must submit the <strong>2026 Registration Contract Form</strong>, <strong>POPI Act Consent Form</strong>, and <strong>Indemnity Form</strong> for participation.
                                </li>
                                <li className="pl-4 border-l-2 border-amber-500/30 italic">
                                    Once registered, fees are non-refundable. Switching activities requires prior consultation with directors.
                                </li>
                            </ul>
                        </div>

                        {/* Fee Structure */}
                        <div className="bg-brand-600 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full filter blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/20 rounded-xl text-white backdrop-blur-md">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h4 className="font-black uppercase tracking-widest text-sm">2026 Fee Structure</h4>
                                </div>
                                <p className="text-sm font-medium opacity-90 mb-5">
                                    Annual fees must be paid in full by <strong className="font-black bg-white/20 px-2 py-0.5 rounded">31 March 2026</strong>.
                                </p>
                                <div className="space-y-4">
                                    <div className="bg-black/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                        <div className="flex justify-between items-end mb-1">
                                            <p className="font-bold text-sm">Instruments</p>
                                            <p className="font-black text-2xl">R450</p>
                                        </div>
                                        <p className="text-[10px] opacity-80 uppercase tracking-widest">(Violin, Flute, Marimba, etc. / R500 for 2 siblings)</p>
                                    </div>
                                    <div className="bg-black/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                        <div className="flex justify-between items-end mb-1">
                                            <p className="font-bold text-sm">Drumming & Dance</p>
                                            <p className="font-black text-2xl">R350</p>
                                        </div>
                                        <p className="text-[10px] opacity-80 uppercase tracking-widest">(Includes Art / R400 for 2 siblings)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule & Rules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Schedule & Attendance */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Schedule & Attendance
                            </h4>
                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                <li><strong>Times:</strong> Saturdays. Arrive by 08h15. Lessons 08h30 - 10h30.</li>
                                <li><strong>Collection:</strong> Pick up by 11h00. <span className="text-red-500 font-bold">Late pick-up fine: R50</span>.</li>
                                <li><strong>Absences:</strong> Notify teacher via SMS. Three consecutive unexcused absences result in dismissal.</li>
                                <li><strong>Dress Code:</strong> School uniform or school-identifying clothing is mandatory for safety.</li>
                            </ul>
                        </div>

                        {/* Banking Details */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                Banking Details
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                    <span className="text-slate-500">Bank</span> <span className="font-bold text-slate-900 dark:text-white">First National Bank</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                    <span className="text-slate-500">Account Name</span> <span className="font-bold text-slate-900 dark:text-white">Thabang Ka Mmino</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                    <span className="text-slate-500">Account Number</span> <span className="font-black tracking-widest text-brand-600 dark:text-brand-400">62054247426</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                    <span className="text-slate-500">Branch</span> <span className="font-bold text-slate-900 dark:text-white">Southdale</span>
                                </div>
                            </div>
                            <div className="mt-4 bg-brand-50 dark:bg-brand-500/10 p-3 rounded-xl border border-brand-100 dark:border-brand-500/20 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">Ref: Music (Name + Instrument)</p>
                            </div>
                        </div>
                    </div>

                    {/* Instrument Care & Footer */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 dark:bg-black p-8 rounded-3xl text-white border border-slate-800">
                        <div className="max-w-xl mb-6 md:mb-0">
                            <h4 className="font-black uppercase tracking-widest text-sm mb-3 text-amber-500">Instrument Care Alert</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Young children cannot carry violins/cellos unless accompanied by an adult. Parents are liable for repair costs if an instrument is damaged due to negligence.
                            </p>
                        </div>
                        <div className="text-right md:text-left flex flex-col gap-1 items-end md:items-start">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Leadership Team</p>
                            <p className="font-bold text-sm">Deputy Principal N. Bandarasi</p>
                            <p className="font-bold text-sm text-brand-400">Mr. Innocent Mokoena <span className="text-xs font-normal text-slate-400 ml-1">(Music Director)</span></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdmissionInfo;
