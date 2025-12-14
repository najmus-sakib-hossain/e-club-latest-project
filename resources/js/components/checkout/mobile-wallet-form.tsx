import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Lock, CheckCircle2, AlertCircle, ArrowRight, RefreshCcw } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import {
    usePaymentStore,
    validateBDPhoneNumber,
    type PaymentMethod,
    type MobileWalletDetails,
} from '@/stores/payment-store';

// Validation schema for phone number
const phoneSchema = z.object({
    phoneNumber: z.string()
        .min(11, 'Phone number must be at least 11 digits')
        .max(14, 'Phone number is too long')
        .refine((val) => validateBDPhoneNumber(val), {
            message: 'Please enter a valid Bangladesh phone number',
        }),
});

// Validation schema for PIN
const pinSchema = z.object({
    pin: z.string()
        .length(6, 'PIN must be exactly 6 digits')
        .regex(/^\d+$/, 'PIN must only contain numbers'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type PinFormData = z.infer<typeof pinSchema>;

interface MobileWalletFormProps {
    walletType: 'bkash' | 'nagad' | 'rocket';
    onSubmit: (data: MobileWalletDetails) => void;
    isProcessing?: boolean;
    amount: number;
}

// Wallet configuration
const walletConfig: Record<'bkash' | 'nagad' | 'rocket', {
    name: string;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    logo: string;
    merchantNumber: string;
}> = {
    bkash: {
        name: 'bKash',
        color: '#E2136E',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-200',
        textColor: 'text-pink-600',
        logo: 'https://logo.clearbit.com/bkash.com?size=80',
        merchantNumber: '01XXXXXXXXX',
    },
    nagad: {
        name: 'Nagad',
        color: '#F6921E',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-600',
        logo: 'https://logo.clearbit.com/nagad.com.bd?size=80',
        merchantNumber: '01XXXXXXXXX',
    },
    rocket: {
        name: 'Rocket',
        color: '#8B2D88',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-600',
        logo: 'https://logo.clearbit.com/dutchbanglabank.com?size=80',
        merchantNumber: '01XXXXXXXXX',
    },
};

export function MobileWalletForm({ 
    walletType, 
    onSubmit, 
    isProcessing = false,
    amount,
}: MobileWalletFormProps) {
    const { mobileWalletDetails, setMobileWalletDetails, paymentStep, setPaymentStep } = usePaymentStore();
    const [otpSent, setOtpSent] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [localStep, setLocalStep] = useState<'phone' | 'otp' | 'pin'>('phone');
    const [otp, setOtp] = useState('');

    const config = walletConfig[walletType];

    // Phone form
    const phoneForm = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            phoneNumber: mobileWalletDetails.phoneNumber,
        },
        mode: 'onChange',
    });

    // PIN form
    const pinForm = useForm<PinFormData>({
        resolver: zodResolver(pinSchema),
        defaultValues: {
            pin: '',
        },
        mode: 'onChange',
    });

    // OTP Timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handlePhoneSubmit = (data: PhoneFormData) => {
        setMobileWalletDetails({ phoneNumber: data.phoneNumber });
        // Simulate sending OTP
        setOtpSent(true);
        setOtpTimer(120); // 2 minutes
        setLocalStep('otp');
    };

    const handleOtpSubmit = () => {
        if (otp.length === 6) {
            // OTP verified, now ask for PIN
            setLocalStep('pin');
        }
    };

    const handlePinSubmit = (data: PinFormData) => {
        const walletData: MobileWalletDetails = {
            phoneNumber: mobileWalletDetails.phoneNumber,
            pin: data.pin,
            transactionId: `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        };
        setMobileWalletDetails(walletData);
        onSubmit(walletData);
    };

    const handleResendOTP = () => {
        setOtpTimer(120);
        setOtp('');
    };

    const handleBack = () => {
        if (localStep === 'otp') {
            setLocalStep('phone');
            setOtpSent(false);
            setOtp('');
        } else if (localStep === 'pin') {
            setLocalStep('otp');
        }
    };

    return (
        <Card className={`w-full border-2 ${config.borderColor}`}>
            <CardHeader className={`${config.bgColor} rounded-t-lg`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src={config.logo} 
                            alt={config.name}
                            className="h-12 w-12 rounded-lg object-contain bg-white p-1"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <div>
                            <CardTitle className={config.textColor}>Pay with {config.name}</CardTitle>
                            <CardDescription>Secure mobile payment</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Lock className={`h-4 w-4 ${config.textColor}`} />
                        <span className={`text-xs font-medium ${config.textColor}`}>Secure</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {/* Payment Amount Display */}
                <div className={`mb-6 rounded-lg ${config.bgColor} p-4 text-center`}>
                    <p className="text-sm text-muted-foreground">Amount to Pay</p>
                    <p className={`text-3xl font-bold ${config.textColor}`}>{formatPrice(amount)}</p>
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Phone Number */}
                    {localStep === 'phone' && (
                        <motion.div
                            key="phone"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">{config.name} Account Number *</Label>
                                    <div className="relative">
                                        <Input
                                            id="phoneNumber"
                                            placeholder="01XXXXXXXXX"
                                            {...phoneForm.register('phoneNumber')}
                                            className="pl-10"
                                            maxLength={14}
                                        />
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        {phoneForm.formState.isValid && (
                                            <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                                        )}
                                    </div>
                                    {phoneForm.formState.errors.phoneNumber && (
                                        <p className="text-sm text-red-500">
                                            {phoneForm.formState.errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>

                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>How it works</AlertTitle>
                                    <AlertDescription>
                                        <ol className="mt-2 list-decimal pl-4 text-sm space-y-1">
                                            <li>Enter your {config.name} account number</li>
                                            <li>You will receive an OTP on your phone</li>
                                            <li>Enter the OTP and your {config.name} PIN to confirm</li>
                                        </ol>
                                    </AlertDescription>
                                </Alert>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={!phoneForm.formState.isValid}
                                    style={{ backgroundColor: config.color }}
                                >
                                    Continue
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </motion.div>
                    )}

                    {/* Step 2: OTP Verification */}
                    {localStep === 'otp' && (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    We've sent an OTP to <strong>{mobileWalletDetails.phoneNumber}</strong>
                                </p>
                            </div>

                            <div className="flex flex-col items-center space-y-4">
                                <Label>Enter 6-digit OTP</Label>
                                <InputOTP
                                    value={otp}
                                    onChange={setOtp}
                                    maxLength={6}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>

                                <div className="flex items-center gap-2 text-sm">
                                    {otpTimer > 0 ? (
                                        <span className="text-muted-foreground">
                                            Resend OTP in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                                        </span>
                                    ) : (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={handleResendOTP}
                                            className={config.textColor}
                                        >
                                            <RefreshCcw className="mr-2 h-4 w-4" />
                                            Resend OTP
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    disabled={otp.length !== 6}
                                    onClick={handleOtpSubmit}
                                    style={{ backgroundColor: config.color }}
                                >
                                    Verify OTP
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: PIN Entry */}
                    {localStep === 'pin' && (
                        <motion.div
                            key="pin"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <form onSubmit={pinForm.handleSubmit(handlePinSubmit)} className="space-y-4">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Enter your {config.name} PIN to confirm payment
                                    </p>
                                </div>

                                <div className="flex flex-col items-center space-y-4">
                                    <Label>Enter {config.name} PIN</Label>
                                    <Controller
                                        name="pin"
                                        control={pinForm.control}
                                        render={({ field }) => (
                                            <InputOTP
                                                value={field.value}
                                                onChange={field.onChange}
                                                maxLength={6}
                                                type="password"
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        )}
                                    />
                                    {pinForm.formState.errors.pin && (
                                        <p className="text-sm text-red-500">
                                            {pinForm.formState.errors.pin.message}
                                        </p>
                                    )}
                                </div>

                                <Alert className="border-yellow-200 bg-yellow-50">
                                    <Lock className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription className="text-yellow-800">
                                        Your PIN is encrypted and never stored. This is a secure payment.
                                    </AlertDescription>
                                </Alert>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleBack}
                                        disabled={isProcessing}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={!pinForm.formState.isValid || isProcessing}
                                        style={{ backgroundColor: config.color }}
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center gap-2">
                                                <motion.div
                                                    className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                />
                                                Processing...
                                            </span>
                                        ) : (
                                            <>
                                                Pay {formatPrice(amount)}
                                                <CheckCircle2 className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
