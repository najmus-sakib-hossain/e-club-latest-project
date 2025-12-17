export type FormData = {
    membershipType: string;
    companyName: string;
    repEmail: string;
    repMobile: string;
    password: string;
    confirmPassword: string;
    termsAgreed: boolean;
    otp: string[];
    companyLogo: File | null;
    coverColor: string;
    establishmentDate: string;
    companyEmail: string;
    companyContactMobile: string;
    companyWhatsapp: string;
    companyWebsite: string;
    sameAsHead: boolean;
    repName: string;
    repDesignation: string;
    repGender: string;
    repDob: string;
    repPersonalEmail: string;
    repPersonalMobile: string;
    repPersonalWebsite: string;
    repMaritalStatus: string;
    businessSegment: string;
    productCategory: string;
    exportEnabled: string; // "yes" | "no"
    paymentMethod: string; // "card" | "bank" | "mfs" | "cash"
};

export const initialFormData: FormData = {
    membershipType: '',
    companyName: '',
    repEmail: '',
    repMobile: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
    otp: ['', '', '', '', '', ''],
    companyLogo: null,
    coverColor: 'blue',
    establishmentDate: '',
    companyEmail: '',
    companyContactMobile: '',
    companyWhatsapp: '',
    companyWebsite: '',
    sameAsHead: false,
    repName: '',
    repDesignation: '',
    repGender: 'male',
    repDob: '',
    repPersonalEmail: '',
    repPersonalMobile: '',
    repPersonalWebsite: '',
    repMaritalStatus: '',
    businessSegment: 'trading',
    productCategory: '',
    exportEnabled: 'no',
    paymentMethod: 'card',
};
