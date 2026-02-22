import React, { useState, useCallback } from 'react';
import { submitToGoogleSheets } from '../services/googleSheets';
import { TeacherFormData, TeacherFormErrors, CLASS_OPTIONS } from '../types';
import { Input, TextArea, CheckboxGroup } from './ui';
import { db, storage } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

const INITIAL_TEACHER_DATA: TeacherFormData = {
    fullName: '',
    email: '',
    phone: '',
    instruments: [],
    qualifications: '',
    experience: '',
    botField: '',
    sendCopy: false,
    cvFile: null,
    consent: false,
};

const TeacherApplicationForm: React.FC = () => {
    const [teacherData, setTeacherData] = useState<TeacherFormData>(INITIAL_TEACHER_DATA);
    const [teacherErrors, setTeacherErrors] = useState<TeacherFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // ... (rest of the component)

    // ... inside render ...
    {
        submitStatus === 'error' && (
            <div className="mt-6 text-center">
                <p className="text-red-600 dark:text-red-400 font-medium">submission failed</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{errorMessage}</p>
            </div>
        )
    }

    const formatPhoneNumber = (value: string) => {
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setTeacherData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'phone') {
            const formatted = formatPhoneNumber(value);
            setTeacherData(prev => ({ ...prev, [name]: formatted }));
        } else {
            setTeacherData(prev => ({ ...prev, [name]: value }));
        }
        if (teacherErrors[name as keyof TeacherFormErrors]) {
            setTeacherErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleInstrumentsChange = (selected: string[]) => {
        setTeacherData(prev => ({ ...prev, instruments: selected }));
        if (teacherErrors.instruments) {
            setTeacherErrors(prev => ({ ...prev, instruments: undefined }));
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setTeacherErrors(prev => ({ ...prev, cvFile: "File size must be under 5MB" }));
                return;
            }
            setTeacherData(prev => ({ ...prev, cvFile: file }));
            setTeacherErrors(prev => ({ ...prev, cvFile: undefined }));
        }
    };

    const checkTeacherFieldValidity = useCallback((name: keyof TeacherFormData, value: any): boolean => {
        switch (name) {
            case 'fullName':
            case 'qualifications':
            case 'experience':
                return typeof value === 'string' && value.trim().length > 0;
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
            case 'phone':
                // Allow spaces, dashes, and parentheses
                return /^(\+27|0)\d{9}$/.test((value || '').replace(/[\s\-\(\)]/g, ''));
            case 'instruments':
                return Array.isArray(value) && value.length > 0;
            default:
                return false;
        }
    }, []);

    const validateTeacher = (): boolean => {
        const newErrors: TeacherFormErrors = {};
        let isValid = true;

        if (!checkTeacherFieldValidity('fullName', teacherData.fullName)) newErrors.fullName = "Full Name is required";
        if (!checkTeacherFieldValidity('email', teacherData.email)) newErrors.email = "Invalid email address";

        if (!teacherData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!checkTeacherFieldValidity('phone', teacherData.phone)) {
            newErrors.phone = "Invalid SA phone (e.g. 082 123 4567)";
        }

        if (!checkTeacherFieldValidity('instruments', teacherData.instruments)) newErrors.instruments = "Select at least one instrument";
        if (!checkTeacherFieldValidity('qualifications', teacherData.qualifications)) newErrors.qualifications = "Qualifications are required";
        if (!checkTeacherFieldValidity('experience', teacherData.experience)) newErrors.experience = "Experience details are required";

        if (!teacherData.consent) newErrors.consent = "You must consent to continue";

        // Optional CV check - force if desired, or keep optional
        // if (!teacherData.cvFile) newErrors.cvFile = "Please upload your CV";

        if (Object.keys(newErrors).length > 0) {
            setTeacherErrors(newErrors);
            isValid = false;
        }
        return isValid;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Honeypot
        if (teacherData.botField) return;
        if (!validateTeacher()) return;

        setIsSubmitting(true);

        try {
            const cleanPhone = teacherData.phone.replace(/[\s\-\(\)]/g, '');
            const normalizedPhone = cleanPhone.startsWith('0') ? `+27${cleanPhone.substring(1)}` : cleanPhone;
            const { botField, sendCopy, cvFile, ...rest } = teacherData;
            const subject = `New Teacher Application: ${teacherData.fullName}`;

            let cvDownloadUrl = '';

            // 1. Upload CV to Firebase Storage (if exists)
            if (teacherData.cvFile) {
                try {
                    const storageRef = ref(storage, `cvs/${Date.now()}_${teacherData.cvFile.name}`);
                    const snapshot = await uploadBytes(storageRef, teacherData.cvFile);
                    cvDownloadUrl = await getDownloadURL(snapshot.ref);
                } catch (storageError) {
                    console.error("CV Upload failed:", storageError);
                    // Decide if we should blocking or continue without CV. 
                    // Let's block because if they uploaded a CV they expect it to be sent.
                    throw new Error("Failed to upload CV. Please try again.");
                }
            }

            // 2. Prepare Formspree Payload (Send URL, not file)
            // Formspree (Free) doesn't allow files, but allows JSON/Text
            const payload = {
                ...rest,
                phone: normalizedPhone,
                instruments: teacherData.instruments.join(', '),
                subject: subject,
                _subject: subject,
                _replyto: teacherData.email,
                submission_type: 'Teacher',
                timestamp: new Date().toISOString(),
                cv_link: cvDownloadUrl || 'No CV uploaded',
                admin_dashboard_link: `${window.location.origin}/admin`,
                _message: "New teacher application. Click the link below to view details in the Admin Dashboard."
            };

            // 3. Try to Save to Firestore (Best Effort)
            try {
                await addDoc(collection(db, "teacher_applications"), {
                    ...rest,
                    phone: normalizedPhone,
                    instruments: teacherData.instruments,
                    email: teacherData.email,
                    hasCv: !!teacherData.cvFile,
                    cvUrl: cvDownloadUrl,
                    status: 'new',
                    submittedAt: new Date()
                });
            } catch (firestoreError) {
                console.error("Firestore write failed (non-fatal):", firestoreError);
            }

            // 4. Submit to Google Sheets (Backup)
            try {
                await submitToGoogleSheets({
                    ...rest,
                    phone: normalizedPhone,
                    instruments: teacherData.instruments.join(', '),
                    cvUrl: cvDownloadUrl || 'No CV',
                    timestamp: new Date().toISOString()
                }, 'teacher');
            } catch (sheetError) {
                console.error("Google Sheets backup failed (non-fatal):", sheetError);
            }

            // 5. Send to Formspree (as JSON now!)
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Form submission failed');
            }

            window.location.href = "/thanks.html";

        } catch (error: any) {
            console.error("Submission error", error);
            setSubmitStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please check your connection and file size.');
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="glass-effect shadow-premium border-white/20 dark:border-slate-800/30 rounded-3xl p-8 sm:p-12 lg:p-16 space-y-12 relative overflow-hidden"
            noValidate
        >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-brand-600 to-accent-500"></div>
            <div className="hidden">
                <label>Don’t fill this out if you’re human: <input name="botField" value={teacherData.botField} onChange={handleTeacherChange} autoComplete="off" /></label>
            </div>

            <div className="space-y-8">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input
                        label="Full Name"
                        name="fullName"
                        value={teacherData.fullName}
                        onChange={handleTeacherChange}
                        error={teacherErrors.fullName}
                        isValid={checkTeacherFieldValidity('fullName', teacherData.fullName)}
                        required
                        disabled={isSubmitting}
                    />
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={teacherData.email}
                        onChange={handleTeacherChange}
                        error={teacherErrors.email}
                        isValid={checkTeacherFieldValidity('email', teacherData.email)}
                        required
                        disabled={isSubmitting}
                    />
                    <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={teacherData.phone}
                        onChange={handleTeacherChange}
                        error={teacherErrors.phone}
                        isValid={checkTeacherFieldValidity('phone', teacherData.phone)}
                        placeholder="082 123 4567"
                        required
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="space-y-8">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-4">Expertise</h3>
                <div className={isSubmitting ? 'opacity-60 pointer-events-none' : ''}>
                    <CheckboxGroup
                        id="instruments-group"
                        label="Which instruments can you teach?"
                        options={CLASS_OPTIONS}
                        selected={teacherData.instruments}
                        onChange={handleInstrumentsChange}
                        error={teacherErrors.instruments}
                        required
                    />
                </div>
                <TextArea
                    label="Qualifications & Certifications"
                    name="qualifications"
                    value={teacherData.qualifications}
                    onChange={handleTeacherChange}
                    error={teacherErrors.qualifications}
                    isValid={checkTeacherFieldValidity('qualifications', teacherData.qualifications)}
                    required
                    rows={4}
                    placeholder="List your degrees, diplomas, or relevant music certifications..."
                    disabled={isSubmitting}
                />
                <TextArea
                    label="Teaching Experience"
                    name="experience"
                    value={teacherData.experience}
                    onChange={handleTeacherChange}
                    error={teacherErrors.experience}
                    isValid={checkTeacherFieldValidity('experience', teacherData.experience)}
                    required
                    rows={4}
                    placeholder="Briefly describe your teaching background..."
                    disabled={isSubmitting}
                />

                <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                        Professional CV / Portfolio (Optional)
                    </label>
                    <div className={`group relative transition-all duration-300 rounded-2xl border-2 border-dashed ${teacherData.cvFile ? 'border-green-500/50 bg-green-50/30 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50'}`}>
                        <div className="px-6 py-10 text-center">
                            <div className={`mx-auto h-16 w-16 mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${teacherData.cvFile ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-brand-500 group-hover:scale-110'}`}>
                                {teacherData.cvFile ? (
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                )}
                            </div>

                            <div className="flex flex-col items-center">
                                <label htmlFor="cv-upload" className="relative cursor-pointer focus-within:outline-none">
                                    <span className="text-lg font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors">
                                        {teacherData.cvFile ? 'Change file' : 'Upload your CV'}
                                    </span>
                                    <input id="cv-upload" name="cvFile" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" disabled={isSubmitting} />
                                </label>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PDF or Word (max. 5MB)</p>
                            </div>

                            {teacherData.cvFile && (
                                <div className="mt-4 flex items-center justify-center space-x-2 animate-fade-in">
                                    <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700">
                                        {teacherData.cvFile.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setTeacherData(prev => ({ ...prev, cvFile: null }))}
                                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {teacherErrors.cvFile && (
                                <p className="text-sm text-red-600 font-bold mt-3 animate-shake">
                                    {teacherErrors.cvFile}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-700 space-y-6">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="sendCopy"
                            name="sendCopy"
                            type="checkbox"
                            checked={teacherData.sendCopy}
                            onChange={handleTeacherChange}
                            disabled={isSubmitting}
                            className="focus:ring-brand-500 h-5 w-5 text-brand-600 border-gray-300 dark:border-slate-600 rounded cursor-pointer disabled:opacity-50 dark:bg-slate-800"
                        />
                    </div>
                    <div className="ml-4 text-sm">
                        <label htmlFor="sendCopy" className={`font-medium text-slate-700 dark:text-slate-300 cursor-pointer ${isSubmitting ? 'opacity-50' : ''}`}>
                            Send me a copy of my application
                        </label>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="consent"
                            name="consent"
                            type="checkbox"
                            checked={teacherData.consent}
                            onChange={handleTeacherChange}
                            disabled={isSubmitting}
                            className="focus:ring-brand-500 h-5 w-5 text-brand-600 border-gray-300 dark:border-slate-600 rounded cursor-pointer disabled:opacity-50 dark:bg-slate-800"
                        />
                    </div>
                    <div className="ml-4 text-sm">
                        <label htmlFor="consent" className={`font-medium text-slate-700 dark:text-slate-300 cursor-pointer ${isSubmitting ? 'opacity-50' : ''}`}>
                            I consent to the processing of personal information.
                        </label>
                        {teacherErrors.consent && <p className="mt-2 text-red-600 dark:text-red-400 font-medium text-xs">{teacherErrors.consent}</p>}
                    </div>
                </div>
            </div>

            <div className="pt-8">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative w-full flex justify-center py-5 px-8 border border-transparent rounded-2xl shadow-2xl shadow-brand-600/20 text-xl font-black text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/50 transition-all transform active:scale-[0.98] overflow-hidden ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1'
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center">
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="tracking-wide">Processing Application...</span>
                            </>
                        ) : (
                            <>
                                <span className="tracking-wide">Submit Application</span>
                                <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </span>
                </button>
                {submitStatus === 'error' && (
                    <div className="mt-6 text-center">
                        <p className="text-red-600 dark:text-red-400 font-medium">Something went wrong.</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{errorMessage}</p>
                    </div>
                )}
            </div>
        </form>
    );
};

export default TeacherApplicationForm;
