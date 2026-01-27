
export interface ClassItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export type SkillLevel = 'Beginner' | 'Intermediate';

export interface FormData {
  parentName: string;
  studentName: string;
  studentDob: string; // string YYYY-MM-DD
  skillLevel: SkillLevel | '';
  priorExperience: string;
  classes: string;
  address: string;
  phone: string;
  email: string;
  referral: string;
  consent: boolean;
  botField?: string;
  sendCopy: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalInfo: string;
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