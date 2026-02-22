
export interface ClassItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export type SkillLevel = 'Beginner' | 'Intermediate';

// Shared Parent/Guardian Information
export interface ParentInfo {
  parentName: string;
  email: string;
  phone: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  referral: string;
}

// Individual Student Information
export interface StudentInfo {
  studentName: string;
  studentDob: string; // string YYYY-MM-DD
  skillLevel: SkillLevel | '';
  priorExperience: string;
  classes: string;
  medicalInfo: string;
}

// Complete Form Structure (Logic-only, not flattened)
export interface RegistrationFormData {
  parent: ParentInfo;
  students: StudentInfo[];
  common: {
    consent: boolean;
    sendCopy: boolean;
    botField?: string;
  };
}

// Legacy flat interface for backward compatibility if needed, 
// though we will be moving away from this.
export interface FormData extends ParentInfo, StudentInfo {
  consent: boolean;
  botField?: string;
  sendCopy: boolean;
}

export interface TeacherFormData {
  fullName: string;
  email: string;
  phone: string;
  instruments: string[];
  qualifications: string;
  experience: string;
  botField?: string;
  sendCopy: boolean;
  cvFile?: File | null;
  consent: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  botField?: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
  parentName?: string;
  studentName?: string;
  studentDob?: string;
  skillLevel?: string;
  classes?: string;
  address?: string;
  phone?: string;
  email?: string;
  consent?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  // Contact form specific errors
  name?: string;
  subject?: string;
  message?: string;
}

export interface TeacherFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  instruments?: string;
  qualifications?: string;
  experience?: string;
  cvFile?: string;
  consent?: string;
}

export const CLASS_OPTIONS = [
  "Violin", "Viola", "Cello", "Flute", "Clarinet",
  "Trumpet", "Recorder", "Marimba", "Percussion", "Dance"
];