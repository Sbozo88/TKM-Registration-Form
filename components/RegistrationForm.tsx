import React, { useState, useCallback } from 'react';
import { FormData, FormErrors, TeacherFormData, TeacherFormErrors, CLASS_OPTIONS } from '../types';
import { Input, Select, TextArea, RadioGroup, CheckboxGroup } from './ui';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";

const INITIAL_DATA: FormData = {
  parentName: '',
  studentName: '',
  studentDob: '',
  skillLevel: '',
  priorExperience: '',
  classes: '',
  address: '',
  phone: '',
  email: '',
  referral: '',
  consent: false,
  botField: '',
  sendCopy: false,
};

const INITIAL_TEACHER_DATA: TeacherFormData = {
  fullName: '',
  email: '',
  phone: '',
  instruments: [],
  qualifications: '',
  experience: '',
  botField: '',
  sendCopy: false,
};

const RegistrationForm: React.FC = () => {
  const [formType, setFormType] = useState<'student' | 'teacher'>('student');
  
  // Student State
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Teacher State
  const [teacherData, setTeacherData] = useState<TeacherFormData>(INITIAL_TEACHER_DATA);
  const [teacherErrors, setTeacherErrors] = useState<TeacherFormErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);

  // --- STUDENT LOGIC ---

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClassChange = (selected: string) => {
    setFormData(prev => ({ ...prev, classes: selected }));
    if (errors.classes) {
      setErrors(prev => ({ ...prev, classes: undefined }));
    }
  };

  const checkStudentFieldValidity = useCallback((name: keyof FormData, value: any): boolean => {
    switch (name) {
      case 'parentName':
      case 'studentName':
      case 'address':
        return typeof value === 'string' && value.trim().length > 0;
      case 'studentDob':
        if (!value) return false;
        const age = calculateAge(value);
        return age >= 6 && age <= 12;
      case 'skillLevel':
      case 'classes':
        return !!value;
      case 'phone':
        return /^(\+27|0)[0-9]{9}$/.test((value || '').replace(/\s/g, ''));
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
      case 'consent':
        return value === true;
      case 'priorExperience':
        return typeof value === 'string' && value.trim().length > 0;
      default:
        return false;
    }
  }, []);

  const validateStudent = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!checkStudentFieldValidity('parentName', formData.parentName)) newErrors.parentName = "Parent name is required";
    if (!checkStudentFieldValidity('studentName', formData.studentName)) newErrors.studentName = "Student name is required";
    
    if (!formData.studentDob) {
      newErrors.studentDob = "Date of Birth is required";
    } else {
      if (!checkStudentFieldValidity('studentDob', formData.studentDob)) {
        const age = calculateAge(formData.studentDob);
        newErrors.studentDob = `Student must be between 6 and 12 years old (Current age: ${age})`;
      }
    }

    if (!checkStudentFieldValidity('skillLevel', formData.skillLevel)) newErrors.skillLevel = "Please select a skill level";
    if (!checkStudentFieldValidity('classes', formData.classes)) newErrors.classes = "Please select one class";
    if (!checkStudentFieldValidity('address', formData.address)) newErrors.address = "Full address is required";
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!checkStudentFieldValidity('phone', formData.phone)) {
      newErrors.phone = "Invalid SA phone format (e.g., 0821234567)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!checkStudentFieldValidity('email', formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.consent) newErrors.consent = "You must consent to continue";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }
    return isValid;
  };

  // --- TEACHER LOGIC ---

  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setTeacherData(prev => ({ ...prev, [name]: checked }));
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

  const checkTeacherFieldValidity = useCallback((name: keyof TeacherFormData, value: any): boolean => {
      switch (name) {
          case 'fullName':
          case 'qualifications':
          case 'experience':
              return typeof value === 'string' && value.trim().length > 0;
          case 'email':
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
          case 'phone':
              return /^(\+27|0)[0-9]{9}$/.test((value || '').replace(/\s/g, ''));
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
      if (!checkTeacherFieldValidity('phone', teacherData.phone)) newErrors.phone = "Invalid phone number";
      if (!checkTeacherFieldValidity('instruments', teacherData.instruments)) newErrors.instruments = "Select at least one instrument";
      if (!checkTeacherFieldValidity('qualifications', teacherData.qualifications)) newErrors.qualifications = "Qualifications are required";
      if (!checkTeacherFieldValidity('experience', teacherData.experience)) newErrors.experience = "Experience details are required";

      if (Object.keys(newErrors).length > 0) {
          setTeacherErrors(newErrors);
          isValid = false;
      }
      return isValid;
  }

  // --- SUBMISSION ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot
    if (formType === 'student' && formData.botField) return;
    if (formType === 'teacher' && teacherData.botField) return;

    if (formType === 'student' && !validateStudent()) return;
    if (formType === 'teacher' && !validateTeacher()) return;

    setIsSubmitting(true);

    try {
      let payload: any = {};
      let formName = "";

      if (formType === 'student') {
        const normalizedPhone = formData.phone.startsWith('0') ? `+27${formData.phone.substring(1)}` : formData.phone;
        const { botField, sendCopy, ...rest } = formData;
        formName = "tkm-registration";
        payload = {
            ...rest,
            phone: normalizedPhone,
            sendCopy,
            subject: `New Student Registration: ${formData.studentName}`,
            "form-name": formName,
            "bot-field": botField,
            timestamp: new Date().toISOString()
        };
      } else {
        const normalizedPhone = teacherData.phone.startsWith('0') ? `+27${teacherData.phone.substring(1)}` : teacherData.phone;
        const { botField, sendCopy, ...rest } = teacherData;
        formName = "tkm-teacher-application";
        payload = {
            ...rest,
            phone: normalizedPhone,
            instruments: teacherData.instruments.join(', '), // Join array for Netlify plain text
            sendCopy,
            subject: `New Teacher Application: ${teacherData.fullName}`,
            "form-name": formName,
            "bot-field": botField,
            timestamp: new Date().toISOString()
        };
      }

      const encode = (data: any) => {
        return Object.keys(data)
          .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
          .join("&");
      };

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(payload),
      });

      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.includes("script.google.com")) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setShowSuccessFlash(true);
      const registerSection = document.getElementById('register');
      if (registerSection) {
        registerSection.scrollIntoView({ behavior: 'smooth' });
      }

      setTimeout(() => {
        setSubmitStatus('success');
        setFormData(INITIAL_DATA);
        setTeacherData(INITIAL_TEACHER_DATA);
        setShowSuccessFlash(false);
        setIsSubmitting(false);
      }, 2000);

    } catch (error) {
      console.error("Submission error", error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <section id="register" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 sm:p-16 animate-fade-in shadow-sm">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-8">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-900 mb-6">Application Received</h2>
            <p className="text-green-800 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Thank you for applying to TKM Music & Cultural School. We have received your details and will contact you within 2-3 business days.
            </p>
            <button 
                onClick={() => setSubmitStatus('idle')}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 shadow-sm transition-colors"
            >
                Submit another application
            </button>
            </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-24 bg-slate-50 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Join TKMProject</h2>
          
          {/* Toggle Switch */}
          <div className="inline-flex bg-white p-1 rounded-full border border-slate-200 shadow-sm mb-6">
              <button
                  onClick={() => setFormType('student')}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                      formType === 'student' 
                      ? 'bg-brand-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                  Student Registration
              </button>
              <button
                  onClick={() => setFormType('teacher')}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                      formType === 'teacher' 
                      ? 'bg-brand-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                  Teacher Application
              </button>
          </div>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {formType === 'student' 
                ? "Secure your spot for the upcoming term. Your information is kept strictly confidential."
                : "Passionate about music education? Apply to join our faculty of expert instructors."}
          </p>
        </div>

        <form 
            onSubmit={handleSubmit} 
            className="bg-white shadow-xl shadow-slate-200 border border-slate-100 rounded-2xl p-8 sm:p-16 space-y-14 relative"
            data-netlify="true" 
            name={formType === 'student' ? "tkm-registration" : "tkm-teacher-application"}
            noValidate
        >
          {/* Success Flash Overlay */}
          {showSuccessFlash && (
            <div className="absolute top-0 left-0 w-full p-4 z-10">
                <div className="rounded-xl bg-green-50 p-6 border border-green-200 animate-fade-in shadow-lg" role="status" aria-live="polite">
                <div className="flex">
                    <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    </div>
                    <div className="ml-4">
                    <h3 className="text-base font-medium text-green-800">Submission successful</h3>
                    <div className="mt-2 text-sm text-green-700">
                        <p>Finalizing your application...</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
          )}

          {formType === 'student' ? (
              // --- STUDENT FORM CONTENT ---
              <>
                <div className="hidden">
                    <label>Don’t fill this out if you’re human: <input name="botField" value={formData.botField} onChange={handleStudentChange} autoComplete="off" /></label>
                </div>
                
                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-4">Student Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input 
                        label="Parent / Guardian Name" 
                        name="parentName" 
                        value={formData.parentName} 
                        onChange={handleStudentChange} 
                        error={errors.parentName}
                        isValid={checkStudentFieldValidity('parentName', formData.parentName)}
                        required 
                        disabled={isSubmitting}
                    />
                    <Input 
                        label="Student Full Name" 
                        name="studentName" 
                        value={formData.studentName} 
                        onChange={handleStudentChange} 
                        error={errors.studentName}
                        isValid={checkStudentFieldValidity('studentName', formData.studentName)}
                        required 
                        disabled={isSubmitting}
                    />
                    <Input 
                        label="Student Date of Birth" 
                        name="studentDob" 
                        type="date" 
                        value={formData.studentDob} 
                        onChange={handleStudentChange} 
                        error={errors.studentDob}
                        isValid={checkStudentFieldValidity('studentDob', formData.studentDob)}
                        helperText="Must be between 6 and 12 years old"
                        required 
                        disabled={isSubmitting}
                    />
                    <Select 
                        label="Skill Level" 
                        name="skillLevel" 
                        value={formData.skillLevel} 
                        onChange={handleStudentChange} 
                        options={[
                        { value: 'Beginner', label: 'Beginner' },
                        { value: 'Intermediate', label: 'Intermediate' },
                        ]}
                        error={errors.skillLevel}
                        isValid={checkStudentFieldValidity('skillLevel', formData.skillLevel)}
                        required
                        disabled={isSubmitting}
                    />
                    </div>
                    <TextArea 
                    label="Prior Experience (Optional)" 
                    name="priorExperience" 
                    value={formData.priorExperience} 
                    onChange={handleStudentChange} 
                    rows={3}
                    placeholder="Briefly describe previous lessons or exams passed..."
                    disabled={isSubmitting}
                    isValid={checkStudentFieldValidity('priorExperience', formData.priorExperience)}
                    />
                </div>

                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-4">Class Preferences</h3>
                    <div className={isSubmitting ? 'opacity-60 pointer-events-none' : ''}>
                        <RadioGroup 
                            id="classes-group"
                            label="Preferred Class"
                            options={CLASS_OPTIONS}
                            selected={formData.classes}
                            onChange={handleClassChange}
                            error={errors.classes}
                            required
                        />
                    </div>
                    <div className="bg-brand-50 border border-brand-100 rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h4 className="text-brand-900 font-semibold mb-1">Standard Schedule</h4>
                        <p className="text-brand-700 text-sm">All classes are scheduled for fixed weekly slots.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-brand-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium text-slate-800">Saturday</span>
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-brand-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium text-slate-800">8:30 – 10:30</span>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-4">Address & Contact Details</h3>
                    <TextArea 
                        label="Full Residential Address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleStudentChange} 
                        error={errors.address}
                        isValid={checkStudentFieldValidity('address', formData.address)}
                        required 
                        rows={3}
                        placeholder="Street address, suburb, city, postal code"
                        disabled={isSubmitting}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input 
                        label="Phone Number" 
                        name="phone" 
                        type="tel"
                        value={formData.phone} 
                        onChange={handleStudentChange} 
                        placeholder="082 123 4567"
                        helperText="South African format preferred"
                        error={errors.phone}
                        isValid={checkStudentFieldValidity('phone', formData.phone)}
                        required 
                        disabled={isSubmitting}
                    />
                    <Input 
                        label="Email Address" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleStudentChange} 
                        error={errors.email}
                        isValid={checkStudentFieldValidity('email', formData.email)}
                        required 
                        disabled={isSubmitting}
                    />
                    <Input 
                        label="How did you hear about us?" 
                        name="referral" 
                        value={formData.referral} 
                        onChange={handleStudentChange} 
                        className="md:col-span-2"
                        disabled={isSubmitting}
                    />
                    </div>
                </div>
              </>
          ) : (
              // --- TEACHER FORM CONTENT ---
              <>
                 <div className="hidden">
                    <label>Don’t fill this out if you’re human: <input name="botField" value={teacherData.botField} onChange={handleTeacherChange} autoComplete="off" /></label>
                </div>

                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-4">Personal Details</h3>
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
                    <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-4">Expertise</h3>
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
                </div>
              </>
          )}

          {/* Section 4: Shared Consent & Submit */}
          <div className="pt-8 border-t border-slate-100 space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="sendCopy"
                  name="sendCopy"
                  type="checkbox"
                  checked={formType === 'student' ? formData.sendCopy : teacherData.sendCopy}
                  onChange={formType === 'student' ? handleStudentChange : handleTeacherChange}
                  disabled={isSubmitting}
                  className="focus:ring-brand-500 h-5 w-5 text-brand-600 border-gray-300 rounded cursor-pointer disabled:opacity-50"
                />
              </div>
              <div className="ml-4 text-sm">
                <label htmlFor="sendCopy" className={`font-medium text-slate-700 cursor-pointer ${isSubmitting ? 'opacity-50' : ''}`}>
                  Send me a copy of my {formType === 'student' ? 'registration' : 'application'}
                </label>
              </div>
            </div>

            {formType === 'student' && (
                 <div className="flex items-start">
                 <div className="flex items-center h-5">
                   <input
                     id="consent"
                     name="consent"
                     type="checkbox"
                     checked={formData.consent}
                     onChange={handleStudentChange}
                     disabled={isSubmitting}
                     className="focus:ring-brand-500 h-5 w-5 text-brand-600 border-gray-300 rounded cursor-pointer disabled:opacity-50"
                   />
                 </div>
                 <div className="ml-4 text-sm">
                   <label htmlFor="consent" className={`font-medium text-slate-700 cursor-pointer ${isSubmitting ? 'opacity-50' : ''}`}>
                     I consent to the processing of personal information.
                   </label>
                   {errors.consent && <p className="mt-2 text-red-600 font-medium text-xs">{errors.consent}</p>}
                 </div>
               </div>
            )}
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-full shadow-lg shadow-brand-500/20 text-lg font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/50 transition-all transform active:scale-[0.99] ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  {showSuccessFlash ? (
                    <svg className="w-5 h-5 mr-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {showSuccessFlash ? 'Success!' : 'Processing...'}
                </span>
              ) : (
                formType === 'student' ? 'Submit Registration' : 'Submit Application'
              )}
            </button>
            {submitStatus === 'error' && (
              <p className="mt-6 text-center text-red-600">
                Something went wrong. Please try again or contact support.
              </p>
            )}
          </div>

        </form>
      </div>
    </section>
  );
};

export default RegistrationForm;