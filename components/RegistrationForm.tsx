import React, { useState, useCallback } from 'react';
import { FormData, FormErrors, CLASS_OPTIONS } from '../types';
import { Input, Select, TextArea, RadioGroup } from './ui';

/**
 * Google Sheets Integration Configuration
 * 
 * To enable logging submissions to a Google Sheet:
 * 1. Create a Google Sheet and go to Extensions > Apps Script.
 * 2. Implement a doPost(e) function to handle the JSON payload.
 *    - Parse JSON using JSON.parse(e.postData.contents).
 *    - Map fields (parentName, studentName, classes, etc.) to your sheet columns.
 * 3. Deploy as a Web App:
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 4. Paste the resulting Web App URL into the constant below.
 */
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

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);

  // Helper to calculate age from DOB string (YYYY-MM-DD)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  // Reusable validation logic
  const checkFieldValidity = useCallback((name: keyof FormData, value: any): boolean => {
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!checkFieldValidity('parentName', formData.parentName)) newErrors.parentName = "Parent name is required";
    if (!checkFieldValidity('studentName', formData.studentName)) newErrors.studentName = "Student name is required";
    
    if (!formData.studentDob) {
      newErrors.studentDob = "Date of Birth is required";
    } else {
      if (!checkFieldValidity('studentDob', formData.studentDob)) {
        const age = calculateAge(formData.studentDob);
        newErrors.studentDob = `Student must be between 6 and 12 years old (Current age: ${age})`;
      }
    }

    if (!checkFieldValidity('skillLevel', formData.skillLevel)) newErrors.skillLevel = "Please select a skill level";
    if (!checkFieldValidity('classes', formData.classes)) newErrors.classes = "Please select one class";
    if (!checkFieldValidity('address', formData.address)) newErrors.address = "Full address is required";
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!checkFieldValidity('phone', formData.phone)) {
      newErrors.phone = "Invalid SA phone format (e.g., 0821234567)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!checkFieldValidity('email', formData.email)) {
      newErrors.email = "Invalid email address";
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
    
    if (formData.botField) return; // Honeypot trap

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedPhone = formData.phone.startsWith('0') 
        ? `+27${formData.phone.substring(1)}` 
        : formData.phone;

      // Extract botField to exclude it, and sendCopy to explicitly include it
      const { botField, sendCopy, ...rest } = formData;

      const payload = {
        ...rest,
        phone: normalizedPhone,
        sendCopy, // Explicitly sending the flag
        // Netlify Forms uses this 'subject' field for the email subject line
        subject: `New Student Registration: ${formData.studentName}`,
        "form-name": "tkm-registration",
        "bot-field": botField,
        timestamp: new Date().toISOString()
      };

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

      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec") {
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
            <h2 className="text-3xl font-bold text-green-900 mb-6">Registration Received</h2>
            <p className="text-green-800 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Thank you for registering with TKM Music & Cultural School. We have received your details and will contact you within 2-3 business days to confirm placement.
            </p>
            <button 
                onClick={() => setSubmitStatus('idle')}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 shadow-sm transition-colors"
            >
                Register another student
            </button>
            </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-24 bg-slate-50 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Student Registration</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Secure your spot for the upcoming term. Your information is kept strictly confidential.
          </p>
        </div>

        <form 
            onSubmit={handleSubmit} 
            className="bg-white shadow-xl shadow-slate-200 border border-slate-100 rounded-2xl p-8 sm:p-16 space-y-14"
            data-netlify="true" 
            name="tkm-registration"
            noValidate
        >
          {/* Netlify Honeypot */}
          <div className="hidden">
            <label>Don’t fill this out if you’re human: <input name="botField" value={formData.botField} onChange={handleChange} autoComplete="off" /></label>
          </div>

          {/* Temporary Success Flash */}
          {showSuccessFlash && (
            <div className="rounded-xl bg-green-50 p-6 border border-green-200 animate-fade-in" role="status" aria-live="polite">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-medium text-green-800">Registration successful</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Finalizing your registration...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Student Info */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-4">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input 
                label="Parent / Guardian Name" 
                name="parentName" 
                value={formData.parentName} 
                onChange={handleChange} 
                error={errors.parentName}
                isValid={checkFieldValidity('parentName', formData.parentName)}
                required 
                disabled={isSubmitting}
              />
              <Input 
                label="Student Full Name" 
                name="studentName" 
                value={formData.studentName} 
                onChange={handleChange} 
                error={errors.studentName}
                isValid={checkFieldValidity('studentName', formData.studentName)}
                required 
                disabled={isSubmitting}
              />
              <Input 
                label="Student Date of Birth" 
                name="studentDob" 
                type="date" 
                value={formData.studentDob} 
                onChange={handleChange} 
                error={errors.studentDob}
                isValid={checkFieldValidity('studentDob', formData.studentDob)}
                helperText="Must be between 6 and 12 years old"
                required 
                disabled={isSubmitting}
              />
              <Select 
                label="Skill Level" 
                name="skillLevel" 
                value={formData.skillLevel} 
                onChange={handleChange} 
                options={[
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Intermediate', label: 'Intermediate' },
                ]}
                error={errors.skillLevel}
                isValid={checkFieldValidity('skillLevel', formData.skillLevel)}
                required
                disabled={isSubmitting}
              />
            </div>
            <TextArea 
              label="Prior Experience (Optional)" 
              name="priorExperience" 
              value={formData.priorExperience} 
              onChange={handleChange} 
              rows={3}
              placeholder="Briefly describe previous lessons or exams passed..."
              disabled={isSubmitting}
              isValid={checkFieldValidity('priorExperience', formData.priorExperience)}
            />
          </div>

          {/* Section 2: Class Preferences */}
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

            {/* Static Schedule Info */}
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

          {/* Section 3: Address & Contact */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-4">Address & Contact Details</h3>
            
            <TextArea 
                label="Full Residential Address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                error={errors.address}
                isValid={checkFieldValidity('address', formData.address)}
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
                onChange={handleChange} 
                placeholder="082 123 4567"
                helperText="South African format preferred"
                error={errors.phone}
                isValid={checkFieldValidity('phone', formData.phone)}
                required 
                disabled={isSubmitting}
              />
              <Input 
                label="Email Address" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange} 
                error={errors.email}
                isValid={checkFieldValidity('email', formData.email)}
                required 
                disabled={isSubmitting}
              />
              <Input 
                label="How did you hear about us?" 
                name="referral" 
                value={formData.referral} 
                onChange={handleChange} 
                className="md:col-span-2"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Section 4: Consent & Options */}
          <div className="pt-8 border-t border-slate-100 space-y-6">
            
            {/* Send Copy Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="sendCopy"
                  name="sendCopy"
                  type="checkbox"
                  checked={formData.sendCopy}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="focus:ring-brand-500 h-5 w-5 text-brand-600 border-gray-300 rounded cursor-pointer disabled:opacity-50"
                />
              </div>
              <div className="ml-4 text-sm">
                <label htmlFor="sendCopy" className={`font-medium text-slate-700 cursor-pointer ${isSubmitting ? 'opacity-50' : ''}`}>
                  Send me a copy of my submission
                </label>
                <p className={`text-slate-500 mt-2 leading-relaxed ${isSubmitting ? 'opacity-50' : ''}`}>
                  A confirmation email with your registration details will be sent to the address provided above.
                </p>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="focus:ring-brand-500 h-5 w-5 text-brand-600 border-gray-300 rounded cursor-pointer disabled:opacity-50"
                />
              </div>
              <div className="ml-4 text-sm">
                <label htmlFor="consent" className={`font-medium text-slate-700 cursor-pointer ${isSubmitting ? 'opacity-50' : ''}`}>
                  I consent to the processing of personal information.
                </label>
                <p className={`text-slate-500 mt-2 leading-relaxed ${isSubmitting ? 'opacity-50' : ''}`}>
                  By checking this box, you agree that TKMProject may collect, store, and use the personal information provided above for the purpose of student registration, administration, and necessary communication in accordance with the Protection of Personal Information Act (POPIA). Your data will be kept confidential and will not be shared with third parties without your consent.
                </p>
                {errors.consent && <p className="mt-2 text-red-600 font-medium text-xs">{errors.consent}</p>}
              </div>
            </div>
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
                'Submit Registration'
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