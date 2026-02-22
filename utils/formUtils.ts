/**
 * Calculates age based on a date of birth string
 * @param dob Date of birth string (ISO format preferred)
 * @returns number
 */
export const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

/**
 * Formats a raw phone string into (XXX) XXX-XXXX format
 */
export const formatPhoneNumber = (value: string): string => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

/**
 * Validates South African phone numbers or generic 10-digit numbers
 */
export const isValidPhoneNumber = (value: string): boolean => {
    const cleaned = (value || '').replace(/[\s\-\(\)]/g, '');
    // Supports 0XXXXXXXXX (10 digits starting with 0) or +27XXXXXXXXX
    return /^(\+27|0)\d{9}$/.test(cleaned);
};

/**
 * Validates email address format
 */
export const isValidEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
};
