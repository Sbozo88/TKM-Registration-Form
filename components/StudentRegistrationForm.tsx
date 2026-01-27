import React, { useState, useCallback } from 'react';
import { FormData, FormErrors, CLASS_OPTIONS } from '../types';
import { Input, Select, TextArea, RadioGroup, DateSelect } from './ui';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mgokvayk";

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
  emergencyContactName: '',
  emergencyContactPhone: '',
  medicalInfo: '',
};

const StudentRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'error'>('idle');

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

  const formatPhoneNumber = (value: string) => {
    // Remove non-numeric characters
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'phone' || name === 'emergencyContactPhone') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
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
      case 'emergencyContactName':
        return typeof value === 'string' && value.trim().length > 0;
      case 'studentDob':
        if (!value) return false;
        const age = calculateAge(value);
        return age >= 6 && age <= 12;
      case 'skillLevel':
      case 'classes':
        return !!value;
      case 'phone':
      case 'emergencyContactPhone':
        // Allow spaces, dashes, and parentheses
        return /^(\+27|0)\d{9}$/.test((value || '').replace(/[\s\-\(\)]/g, ''));
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
      newErrors.phone = "Invalid SA phone (e.g. 082 123 4567)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!checkStudentFieldValidity('email', formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!checkStudentFieldValidity('emergencyContactName', formData.emergencyContactName)) newErrors.emergencyContactName = "Emergency contact name is required";

    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = "Contact number is required";
    } else if (!checkStudentFieldValidity('emergencyContactPhone', formData.emergencyContactPhone)) {
      newErrors.emergencyContactPhone = "Invalid SA phone";
    }

    if (!formData.consent) newErrors.consent = "You must consent to continue";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.botField) return; // Honeypot
    if (!validateStudent()) return;

    setIsSubmitting(true);

    try {
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      const normalizedPhone = cleanPhone.startsWith('0') ? `+27${cleanPhone.substring(1)}` : cleanPhone;
      const { botField, sendCopy, ...rest } = formData;
      const subject = `New Student Registration: ${formData.studentName}`;

      const payload = {
        ...rest,
        phone: normalizedPhone,
        sendCopy,
        subject,
        _subject: subject,
        _replyto: formData.email,
        submission_type: 'Student',
        timestamp: new Date().toISOString()
      };

      // 1. Try to Save to Firestore (Best Effort)
      try {
        await addDoc(collection(db, "registrations"), {
          ...rest,
          phone: normalizedPhone,
          email: formData.email,
          status: 'new',
          submittedAt: new Date()
        });
      } catch (firestoreError) {
        console.error("Firestore write failed (non-fatal):", firestoreError);
      }

      // 2. Send to Formspree (CRITICAL)
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
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
        <label>Don’t fill this out if you’re human: <input name="botField" value={formData.botField} onChange={handleStudentChange} autoComplete="off" /></label>
      </div>

      <div className="space-y-8">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-4">Student Information</h3>
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
          <DateSelect
            label="Student Date of Birth"
            name="studentDob"
            value={formData.studentDob}
            onChange={handleStudentChange}
            error={errors.studentDob}
            isValid={checkStudentFieldValidity('studentDob', formData.studentDob)}
            helperText="Must be between 6 and 12 years old"
            required
            minYear={2010}
            maxYear={2023}
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
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-4">Class Preferences</h3>
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
        <div className="bg-brand-50 dark:bg-slate-800 border border-brand-100 dark:border-slate-700 rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
          <div>
            <h4 className="text-brand-900 dark:text-brand-300 font-semibold mb-1">Standard Schedule</h4>
            <p className="text-brand-700 dark:text-slate-400 text-sm">All classes are scheduled for fixed weekly slots.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-brand-600 dark:text-brand-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-slate-800 dark:text-slate-200">Saturday</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-brand-600 dark:text-brand-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-slate-800 dark:text-slate-200">8:30 – 10:30</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-4">Address & Contact Details</h3>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <Input
            label="Emergency Contact Name"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleStudentChange}
            error={errors.emergencyContactName}
            isValid={checkStudentFieldValidity('emergencyContactName', formData.emergencyContactName)}
            required
            disabled={isSubmitting}
          />
          <Input
            label="Emergency Contact Number"
            name="emergencyContactPhone"
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={handleStudentChange}
            placeholder="082 123 4567"
            error={errors.emergencyContactPhone}
            isValid={checkStudentFieldValidity('emergencyContactPhone', formData.emergencyContactPhone)}
            required
            disabled={isSubmitting}
          />
        </div>
        <TextArea
          label="Medical Conditions / Allergies (Optional)"
          name="medicalInfo"
          value={formData.medicalInfo}
          onChange={handleStudentChange}
          rows={2}
          placeholder="Any important medical details we should know about..."
          disabled={isSubmitting}
        />
      </div>

      <div className="pt-8 border-t border-slate-100 dark:border-slate-700 space-y-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="sendCopy"
              name="sendCopy"
              type="checkbox"
              checked={formData.sendCopy}
              onChange={handleStudentChange}
              disabled={isSubmitting}
              className="focus:ring-brand-500 h-5 w-5 text-brand-600 border-gray-300 dark:border-slate-600 rounded cursor-pointer disabled:opacity-50 dark:bg-slate-800"
            />
          </div>
          <div className="ml-4 text-sm">
            <label htmlFor="sendCopy" className={`font-medium text-slate-700 dark:text-slate-300 cursor-pointer ${isSubmitting ? 'opacity-50' : ''}`}>
              Send me a copy of my registration
            </label>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={formData.consent}
              onChange={handleStudentChange}
              disabled={isSubmitting}
              className="focus:ring-brand-500 h-5 w-5 text-brand-600 border-gray-300 dark:border-slate-600 rounded cursor-pointer disabled:opacity-50 dark:bg-slate-800"
            />
          </div>
          <div className="ml-4 text-sm">
            <label htmlFor="consent" className={`font-medium text-slate-700 dark:text-slate-300 cursor-pointer ${isSubmitting ? 'opacity-50' : ''}`}>
              I consent to the processing of personal information.
            </label>
            {errors.consent && <p className="mt-2 text-red-600 dark:text-red-400 font-medium text-xs">{errors.consent}</p>}
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
            'Submit Registration'
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

export default StudentRegistrationForm;
