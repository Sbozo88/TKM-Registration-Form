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
  studentDob: string; // Changed from studentAge to studentDob (string YYYY-MM-DD)
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
}

export interface FormErrors {
  parentName?: string;
  studentName?: string;
  studentDob?: string; // Changed from studentAge
  skillLevel?: string;
  classes?: string;
  address?: string;
  phone?: string;
  email?: string;
  consent?: string;
}

export const CLASS_OPTIONS = [
  "Violin", "Viola", "Cello", "Flute", "Clarinet", 
  "Trumpet", "Recorder", "Marimba", "Percussion", "Dance"
];