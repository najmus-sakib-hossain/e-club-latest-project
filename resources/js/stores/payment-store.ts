import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Payment method types
export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod';

// Card details interface
export interface CardDetails {
    cardNumber: string;
    cardHolderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}

// Mobile wallet details interface
export interface MobileWalletDetails {
    phoneNumber: string;
    pin?: string;
    transactionId?: string;
}

// Payment state interface
interface PaymentState {
    // Selected payment method
    selectedMethod: PaymentMethod;

    // Card payment details
    cardDetails: CardDetails;

    // Mobile wallet details
    mobileWalletDetails: MobileWalletDetails;

    // Payment processing state
    isProcessing: boolean;
    paymentStep: 'select' | 'details' | 'verify' | 'complete';
    transactionId: string | null;
    paymentError: string | null;

    // Actions
    setPaymentMethod: (method: PaymentMethod) => void;
    setCardDetails: (details: Partial<CardDetails>) => void;
    setMobileWalletDetails: (details: Partial<MobileWalletDetails>) => void;
    setProcessing: (isProcessing: boolean) => void;
    setPaymentStep: (
        step: 'select' | 'details' | 'verify' | 'complete',
    ) => void;
    setTransactionId: (id: string | null) => void;
    setPaymentError: (error: string | null) => void;
    resetPayment: () => void;
}

// Initial state
const initialCardDetails: CardDetails = {
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
};

const initialMobileWalletDetails: MobileWalletDetails = {
    phoneNumber: '',
    pin: '',
    transactionId: '',
};

export const usePaymentStore = create<PaymentState>()(
    devtools(
        (set) => ({
            selectedMethod: 'bkash',
            cardDetails: initialCardDetails,
            mobileWalletDetails: initialMobileWalletDetails,
            isProcessing: false,
            paymentStep: 'select',
            transactionId: null,
            paymentError: null,

            setPaymentMethod: (method) =>
                set({
                    selectedMethod: method,
                    paymentStep: 'select',
                    paymentError: null,
                }),

            setCardDetails: (details) =>
                set((state) => ({
                    cardDetails: { ...state.cardDetails, ...details },
                })),

            setMobileWalletDetails: (details) =>
                set((state) => ({
                    mobileWalletDetails: {
                        ...state.mobileWalletDetails,
                        ...details,
                    },
                })),

            setProcessing: (isProcessing) => set({ isProcessing }),

            setPaymentStep: (step) => set({ paymentStep: step }),

            setTransactionId: (id) => set({ transactionId: id }),

            setPaymentError: (error) => set({ paymentError: error }),

            resetPayment: () =>
                set({
                    selectedMethod: 'bkash',
                    cardDetails: initialCardDetails,
                    mobileWalletDetails: initialMobileWalletDetails,
                    isProcessing: false,
                    paymentStep: 'select',
                    transactionId: null,
                    paymentError: null,
                }),
        }),
        { name: 'payment-store' },
    ),
);

// Selectors
export const selectPaymentMethod = (state: PaymentState) =>
    state.selectedMethod;
export const selectCardDetails = (state: PaymentState) => state.cardDetails;
export const selectMobileWalletDetails = (state: PaymentState) =>
    state.mobileWalletDetails;
export const selectIsProcessing = (state: PaymentState) => state.isProcessing;
export const selectPaymentStep = (state: PaymentState) => state.paymentStep;
export const selectTransactionId = (state: PaymentState) => state.transactionId;
export const selectPaymentError = (state: PaymentState) => state.paymentError;

// Utility functions for card validation
export const validateCardNumber = (cardNumber: string): boolean => {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    // Check if it's a valid length (13-19 digits)
    if (!/^\d{13,19}$/.test(cleaned)) return false;

    // Luhn algorithm for card validation
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

export const getCardType = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';

    return 'unknown';
};

export const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19);
};

export const validateCVV = (cvv: string, cardType: string): boolean => {
    const length = cardType === 'amex' ? 4 : 3;
    return new RegExp(`^\\d{${length}}$`).test(cvv);
};

export const validateExpiry = (month: string, year: string): boolean => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
};

// Bangladesh phone number validation
export const validateBDPhoneNumber = (phone: string): boolean => {
    // Remove any non-digit characters except leading +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Valid formats: 01XXXXXXXXX, +8801XXXXXXXXX, 8801XXXXXXXXX
    const patterns = [
        /^01[3-9]\d{8}$/, // Local format: 01XXXXXXXXX
        /^\+8801[3-9]\d{8}$/, // International with +: +8801XXXXXXXXX
        /^8801[3-9]\d{8}$/, // International without +: 8801XXXXXXXXX
    ];

    return patterns.some((pattern) => pattern.test(cleaned));
};
