import React, { useState, useCallback } from 'react';
import { TeacherFormData, TeacherFormErrors, CLASS_OPTIONS } from '../types';
import { Input, TextArea, CheckboxGroup } from './ui';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mgokvayk";

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
};

const TeacherApplicationForm: React.FC = () => {
    const [teacherData, setTeacherData] = useState<TeacherFormData>(INITIAL_TEACHER_DATA);
    const [teacherErrors, setTeacherErrors] = useState<TeacherFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'error'>('idle');

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
            const { botField, sendCopy, ...rest } = teacherData;
            const subject = `New Teacher Application: ${teacherData.fullName}`;

            // Formspree with file upload requires FormData object instead of JSON
            const formData = new FormData();
            Object.keys(rest).forEach(key => {
                const value = rest[key as keyof typeof rest];
                if (Array.isArray(value)) {
                    formData.append(key, value.join(', '));
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            formData.append('phone', normalizedPhone);
            formData.append('subject', subject);
            formData.append('_subject', subject);
            formData.append('_replyto', teacherData.email);
            formData.append('submission_type', 'Teacher');
            formData.append('timestamp', new Date().toISOString());

            if (teacherData.cvFile) {
                formData.append('cvFile', teacherData.cvFile);
            }

            // 1. Try to Save to Firestore (Best Effort)
            try {
                await addDoc(collection(db, "teacher_applications"), {
                    ...rest,
                    phone: normalizedPhone,
                    instruments: teacherData.instruments,
                    email: teacherData.email,
                    hasCv: !!teacherData.cvFile,
                    status: 'new',
                    submittedAt: new Date()
                });
            } catch (firestoreError) {
                console.error("Firestore write failed (non-fatal):", firestoreError);
            }

            // 2. Send to Formspree
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                    // Content-Type header must NOT be set when sending FormData, browser sets it with boundary
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            window.location.href = "/thanks.html";

        } catch (error) {
            console.error("Submission error", error);
            setSubmitStatus('error');
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 shadow-xl shadow-slate-200 dark:shadow-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 sm:p-16 space-y-14 relative transition-colors duration-300"
            noValidate
        >
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

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Upload CV / Resume (Optional)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                <label htmlFor="cv-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                                    <span>Upload a file</span>
                                    <input id="cv-upload" name="cvFile" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" disabled={isSubmitting} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-slate-500">PDF, DOC up to 5MB</p>
                            {teacherData.cvFile && (
                                <p className="text-sm text-green-600 font-medium mt-2">
                                    Selected: {teacherData.cvFile.name}
                                </p>
                            )}
                            {teacherErrors.cvFile && (
                                <p className="text-sm text-red-600 font-medium mt-2">
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
            </div>

            <div className="pt-8">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-full shadow-lg shadow-brand-500/20 text-lg font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/50 transition-all transform active:scale-[0.99] ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-0.5'
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Submit Application'
                    )}
                </button>
                {submitStatus === 'error' && (
                    <p className="mt-6 text-center text-red-600 dark:text-red-400">
                        Something went wrong. Please try again or contact support.
                    </p>
                )}
            </div>
        </form>
    );
};

export default TeacherApplicationForm;
