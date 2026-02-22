import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { calculateAge, formatPhoneNumber, isValidPhoneNumber, isValidEmail } from '../utils/formUtils';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

const INITIAL_PARENT: ParentInfo = {
  parentName: '',
  email: '',
  phone: '',
  address: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  referral: '',
};

const INITIAL_STUDENT: StudentInfo = {
  studentName: '',
  studentDob: '',
  skillLevel: '',
  priorExperience: '',
  classes: '',
  medicalInfo: '',
};

const StudentRegistrationForm: React.FC = () => {
  const [parentInfo, setParentInfo] = useState<ParentInfo>(INITIAL_PARENT);
  const [students, setStudents] = useState<StudentInfo[]>([{ ...INITIAL_STUDENT }]);
  const [common, setCommon] = useState({ consent: false, sendCopy: false, botField: '' });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'error'>('idle');


  // --- Handlers ---

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone' || name === 'emergencyContactPhone') {
      const formatted = formatPhoneNumber(value);
      setParentInfo(prev => ({ ...prev, [name]: formatted }));
    } else {
      setParentInfo(prev => ({ ...prev, [name]: value }));
    }
    // Clear error
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleStudentChange = (index: number, field: keyof StudentInfo, value: any) => {
    setStudents(prev => {
      const newStudents = [...prev];
      newStudents[index] = { ...newStudents[index], [field]: value };
      return newStudents;
    });
    // Clear specific error potentially? (Complex with indexed errors, skipping for now)
  };

  const handleCommonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setCommon(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'consent') setErrors(prev => ({ ...prev, consent: undefined }));
  };

  const addStudent = () => {
    setStudents(prev => [...prev, { ...INITIAL_STUDENT }]);
  };

  const removeStudent = (index: number) => {
    if (students.length > 1) {
      setStudents(prev => prev.filter((_, i) => i !== index));
    }
  };

  // --- Validation ---

  const validateField = (name: string, value: any): boolean => {
    switch (name) {
      case 'parentName':
      case 'studentName':
      case 'address':
      case 'emergencyContactName':
        return typeof value === 'string' && value.trim().length > 0;
      case 'studentDob':
        if (!value) return false;
        const age = calculateAge(value);
        return age >= 5 && age <= 16; // Adjusted age range slightly or kept same
      case 'skillLevel':
      case 'classes':
        return !!value;
      case 'phone':
      case 'emergencyContactPhone':
        return isValidPhoneNumber(value);
      case 'email':
        return isValidEmail(value);
      case 'consent':
        return value === true;
      default:
        return true;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};
    let isValid = true;

    // Parent Validation
    if (!validateField('parentName', parentInfo.parentName)) newErrors.parentName = "Parent name is required";
    if (!validateField('email', parentInfo.email)) newErrors.email = "Valid email is required";
    if (!validateField('phone', parentInfo.phone)) newErrors.phone = "Valid phone is required";
    if (!validateField('address', parentInfo.address)) newErrors.address = "Address is required";
    if (!validateField('emergencyContactName', parentInfo.emergencyContactName)) newErrors.emergencyContactName = "required";
    if (!validateField('emergencyContactPhone', parentInfo.emergencyContactPhone)) newErrors.emergencyContactPhone = "required";

    // Student Validation
    students.forEach((student, index) => {
      if (!validateField('studentName', student.studentName)) newErrors[`studentName_${index}`] = "Required";

      if (!student.studentDob) {
        newErrors[`studentDob_${index}`] = "Required";
      } else {
        const age = calculateAge(student.studentDob);
        // Using generic check here, adjust strictness as needed
        if (age < 5 || age > 18) newErrors[`studentDob_${index}`] = `Age ${age}? (5-18)`;
      }

      if (!validateField('skillLevel', student.skillLevel)) newErrors[`skillLevel_${index}`] = "Required";
      if (!validateField('classes', student.classes)) newErrors[`classes_${index}`] = "Required";
    });

    if (!common.consent) newErrors.consent = "Consent required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }
    return isValid;
  };

  // --- Submit ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (common.botField) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();
      const submissionRef = `SUB-${Date.now()}`; // Unique ID for this batch

      // Prepare operations
      const promises = students.map(async (student) => {
        const cleanPhone = parentInfo.phone.replace(/[\s\-\(\)]/g, '');
        const normalizedPhone = cleanPhone.startsWith('0') ? `+27${cleanPhone.substring(1)}` : cleanPhone;

        const payload = {
          ...parentInfo,
          ...student, // Overwrites overlapping fields if any (unlikely)
          phone: normalizedPhone,
          consent: common.consent,
          submissionId: submissionRef,
          status: 'new',
          submittedAt: timestamp
        };

        // 1. Firestore
        await addDoc(collection(db, "registrations"), {
          ...payload,
          submittedAt: new Date() // Firestore Date object
        });

        // 2. Google Sheets
        await submitToGoogleSheets({
          ...payload,
          timestamp: timestamp,
          parentName: parentInfo.parentName // ensure explicit
        }, 'student');
      });

      // Execute all DB/Sheet writes
      await Promise.all(promises);

      // 3. Formspree (Single Email Summary)
      const emailPayload = {
        ...parentInfo,
        ...common,
        _subject: `New Registration: ${parentInfo.parentName} (${students.length} students)`,
        students_summary: students.map(s =>
          `${s.studentName} (${calculateAge(s.studentDob)}yrs) - ${s.classes} (${s.skillLevel})`
        ).join('\n'),
        full_student_data: JSON.stringify(students, null, 2),
        submission_type: 'Student Registration (Batch)',
        admin_dashboard_link: `${window.location.origin}/admin`,
        _message: "New registration received. Click the link below to view details and export to Excel in the Admin Dashboard."
      };

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(emailPayload),
      });

      if (!response.ok) throw new Error('Formspree failed');

      window.location.href = "/thanks.html";

    } catch (error) {
      console.error("Submission error", error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-12 space-y-10 relative" noValidate>

      {/* --- Parent Section --- */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 border-b pb-2">Parent / Guardian Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Parent Name" name="parentName" value={parentInfo.parentName} onChange={handleParentChange} error={errors.parentName} required disabled={isSubmitting} />
          <Input label="Email" name="email" type="email" value={parentInfo.email} onChange={handleParentChange} error={errors.email} required disabled={isSubmitting} />
          <Input label="Phone" name="phone" type="tel" value={parentInfo.phone} onChange={handleParentChange} error={errors.phone} required disabled={isSubmitting} placeholder="082 123 4567" />
          <Input label="Address" name="address" value={parentInfo.address} onChange={handleParentChange} error={errors.address} required disabled={isSubmitting} />
        </div>

        {/* Emergency Contact */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-4">
          <h4 className="font-semibold text-slate-700 dark:text-slate-300">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Name" name="emergencyContactName" value={parentInfo.emergencyContactName} onChange={handleParentChange} error={errors.emergencyContactName} required disabled={isSubmitting} />
            <Input label="Phone" name="emergencyContactPhone" type="tel" value={parentInfo.emergencyContactPhone} onChange={handleParentChange} error={errors.emergencyContactPhone} required disabled={isSubmitting} />
          </div>
        </div>

        <Input label="How did you hear about us?" name="referral" value={parentInfo.referral} onChange={handleParentChange} disabled={isSubmitting} />
      </div>

      {/* --- Student Section Loop --- */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 border-b pb-2 flex justify-between items-center">
          <span>Students</span>
          <span className="text-sm font-normal text-brand-600 bg-brand-50 px-3 py-1 rounded-full">{students.length} Registering</span>
        </h3>

        {students.map((student, index) => (
          <div key={index} className="relative p-6 border-l-4 border-brand-500 bg-slate-50 dark:bg-slate-800/20 rounded-r-xl space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">Student {index + 1}</h4>
              {students.length > 1 && (
                <button type="button" onClick={() => removeStudent(index)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Student Name"
                value={student.studentName}
                onChange={(e) => handleStudentChange(index, 'studentName', e.target.value)}
                error={errors[`studentName_${index}`]}
                required disabled={isSubmitting}
              />
              <DateSelect
                label="Date of Birth"
                name={`studentDob_${index}`}
                value={student.studentDob}
                onChange={(e) => handleStudentChange(index, 'studentDob', e.target.value)}
                error={errors[`studentDob_${index}`]}
                required disabled={isSubmitting}
                minYear={2005} maxYear={2023}
              />
              <Select
                label="Skill Level"
                value={student.skillLevel}
                onChange={(e) => handleStudentChange(index, 'skillLevel', e.target.value)}
                options={[{ value: 'Beginner', label: 'Beginner' }, { value: 'Intermediate', label: 'Intermediate' }]}
                error={errors[`skillLevel_${index}`]}
                required disabled={isSubmitting}
              />
            </div>

            {/* Classes Radio - Adapted for Index */}
            <div className={isSubmitting ? 'opacity-60' : ''}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preferred Class *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {CLASS_OPTIONS.map((option) => (
                  <label key={option} className={`cursor-pointer flex items-center justify-center p-3 rounded-lg border transition-all ${student.classes === option
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md transform scale-105'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-300 text-slate-600 dark:text-slate-400'
                    }`}>
                    <input
                      type="radio"
                      name={`class_group_${index}`} // Unique name per student
                      value={option}
                      checked={student.classes === option}
                      onChange={(e) => handleStudentChange(index, 'classes', e.target.value)}
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm font-medium text-center">{option}</span>
                  </label>
                ))}
              </div>
              {errors[`classes_${index}`] && <p className="mt-1 text-red-500 text-xs">{errors[`classes_${index}`]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextArea
                label="Prior Experience"
                value={student.priorExperience}
                onChange={(e) => handleStudentChange(index, 'priorExperience', e.target.value)}
                rows={2} placeholder="Optional" disabled={isSubmitting}
              />
              <TextArea
                label="Medical / Allergies"
                value={student.medicalInfo}
                onChange={(e) => handleStudentChange(index, 'medicalInfo', e.target.value)}
                rows={2} placeholder="Optional" disabled={isSubmitting}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addStudent}
          className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-brand-500 hover:text-brand-600 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Add Another Student
        </button>
      </div>

      {/* --- Common & Submit --- */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input type="checkbox" name="sendCopy" checked={common.sendCopy} onChange={handleCommonChange} className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300" />
          <span className="text-slate-700 dark:text-slate-300">Send me a copy</span>
        </label>

        <label className="flex items-start space-x-3 cursor-pointer">
          <input type="checkbox" name="consent" checked={common.consent} onChange={handleCommonChange} className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300 mt-1" />
          <div className="text-slate-700 dark:text-slate-300 text-sm">
            <span>I consent to the processing of personal information.</span>
            {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent}</p>}
          </div>
        </label>

        {/* Honeypot */}
        <div className="hidden"><input name="botField" value={common.botField} onChange={(e) => setCommon({ ...common, botField: e.target.value })} /></div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-full font-bold text-white text-lg shadow-lg transition-transform active:scale-95 ${isSubmitting ? 'bg-slate-400 cursor-wait' : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-1'
            }`}
        >
          {isSubmitting ? 'Processing...' : `Submit Registration (${students.length} Student${students.length > 1 ? 's' : ''})`}
        </button>
        {submitStatus === 'error' && <p className="text-red-500 text-center">Submission failed. Please try again.</p>}
      </div>
    </form>
  );
};

export default StudentRegistrationForm;
