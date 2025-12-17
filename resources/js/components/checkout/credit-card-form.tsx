import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, CreditCard, Lock } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    CardDetails,
    formatCardNumber,
    getCardType,
    usePaymentStore,
    validateCardNumber,
    validateExpiry,
} from '@/stores/payment-store';

// Validation schema
const cardSchema = z
    .object({
        cardNumber: z
            .string()
            .min(13, 'Card number must be at least 13 digits')
            .max(19, 'Card number must be at most 19 digits')
            .refine((val) => validateCardNumber(val.replace(/\s/g, '')), {
                message: 'Invalid card number',
            }),
        cardHolderName: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name is too long'),
        expiryMonth: z
            .string()
            .min(1, 'Month is required')
            .max(2, 'Invalid month'),
        expiryYear: z
            .string()
            .min(2, 'Year is required')
            .max(2, 'Invalid year'),
        cvv: z
            .string()
            .min(3, 'CVV must be at least 3 digits')
            .max(4, 'CVV must be at most 4 digits')
            .regex(/^\d+$/, 'CVV must only contain numbers'),
    })
    .refine((data) => validateExpiry(data.expiryMonth, data.expiryYear), {
        message: 'Card has expired',
        path: ['expiryMonth'],
    });

type CardFormData = z.infer<typeof cardSchema>;

interface CreditCardFormProps {
    onSubmit: (data: CardDetails) => void;
    isProcessing?: boolean;
}

export function CreditCardForm({
    onSubmit,
    isProcessing = false,
}: CreditCardFormProps) {
    const { cardDetails, setCardDetails } = usePaymentStore();
    const [cardType, setCardType] = useState<string>('unknown');
    const [isFocused, setIsFocused] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<CardFormData>({
        resolver: zodResolver(cardSchema),
        defaultValues: {
            cardNumber: cardDetails.cardNumber,
            cardHolderName: cardDetails.cardHolderName,
            expiryMonth: cardDetails.expiryMonth,
            expiryYear: cardDetails.expiryYear,
            cvv: cardDetails.cvv,
        },
        mode: 'onChange',
    });

    const watchedCardNumber = watch('cardNumber');

    useEffect(() => {
        if (watchedCardNumber) {
            const type = getCardType(watchedCardNumber);
            setCardType(type);
        }
    }, [watchedCardNumber]);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        setValue('cardNumber', formatted, { shouldValidate: true });
        setCardDetails({ cardNumber: formatted });
    };

    const handleFormSubmit = (data: CardFormData) => {
        setCardDetails(data);
        onSubmit(data);
    };

    // Generate month and year options
    const months = Array.from({ length: 12 }, (_, i) => {
        const month = (i + 1).toString().padStart(2, '0');
        return { value: month, label: month };
    });

    const currentYear = new Date().getFullYear() % 100;
    const years = Array.from({ length: 10 }, (_, i) => {
        const year = (currentYear + i).toString().padStart(2, '0');
        return { value: year, label: `20${year}` };
    });

    // Card brand logos
    const cardLogos: Record<string, string> = {
        visa: 'https://logo.clearbit.com/visa.com?size=40',
        mastercard: 'https://logo.clearbit.com/mastercard.com?size=40',
        amex: 'https://logo.clearbit.com/americanexpress.com?size=40',
        discover: 'https://logo.clearbit.com/discover.com?size=40',
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Credit/Debit Card
                        </CardTitle>
                        <CardDescription>
                            Enter your card details securely
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium text-green-600">
                            Secure
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-4"
                >
                    {/* Card Preview */}
                    <motion.div
                        className="relative h-48 w-full rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-white shadow-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Card chip */}
                        <div className="absolute top-6 left-6 h-10 w-14 rounded bg-gradient-to-br from-yellow-300 to-yellow-500">
                            <div className="m-1 grid h-8 w-12 grid-cols-3 gap-px">
                                {[...Array(9)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="rounded-sm bg-yellow-600/40"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card type logo */}
                        <AnimatePresence mode="wait">
                            {cardType !== 'unknown' && cardLogos[cardType] && (
                                <motion.img
                                    key={cardType}
                                    src={cardLogos[cardType]}
                                    alt={cardType}
                                    className="absolute top-6 right-6 h-10 w-auto"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Card number */}
                        <div className="absolute right-6 bottom-20 left-6">
                            <p className="font-mono text-xl tracking-widest">
                                {watchedCardNumber || '•••• •••• •••• ••••'}
                            </p>
                        </div>

                        {/* Card holder and expiry */}
                        <div className="absolute right-6 bottom-6 left-6 flex justify-between">
                            <div>
                                <p className="text-xs text-gray-400 uppercase">
                                    Card Holder
                                </p>
                                <p className="font-medium tracking-wide uppercase">
                                    {watch('cardHolderName') || 'Your Name'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase">
                                    Expires
                                </p>
                                <p className="font-medium tracking-wide">
                                    {watch('expiryMonth') || 'MM'}/
                                    {watch('expiryYear') || 'YY'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card Number */}
                    <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <div className="relative">
                            <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                {...register('cardNumber')}
                                onChange={handleCardNumberChange}
                                onFocus={() => setIsFocused('cardNumber')}
                                onBlur={() => setIsFocused(null)}
                                maxLength={19}
                                className={`pl-10 font-mono ${isFocused === 'cardNumber' ? 'ring-2 ring-primary' : ''}`}
                            />
                            <CreditCard className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            {isValid && watchedCardNumber && (
                                <CheckCircle2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-green-500" />
                            )}
                        </div>
                        {errors.cardNumber && (
                            <p className="text-sm text-red-500">
                                {errors.cardNumber.message}
                            </p>
                        )}
                    </div>

                    {/* Card Holder Name */}
                    <div className="space-y-2">
                        <Label htmlFor="cardHolderName">
                            Card Holder Name *
                        </Label>
                        <Input
                            id="cardHolderName"
                            placeholder="John Doe"
                            {...register('cardHolderName')}
                            onChange={(e) => {
                                register('cardHolderName').onChange(e);
                                setCardDetails({
                                    cardHolderName: e.target.value,
                                });
                            }}
                            className="uppercase"
                        />
                        {errors.cardHolderName && (
                            <p className="text-sm text-red-500">
                                {errors.cardHolderName.message}
                            </p>
                        )}
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Expiry Month *</Label>
                            <Controller
                                name="expiryMonth"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setCardDetails({
                                                expiryMonth: value,
                                            });
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="MM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((month) => (
                                                <SelectItem
                                                    key={month.value}
                                                    value={month.value}
                                                >
                                                    {month.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Expiry Year *</Label>
                            <Controller
                                name="expiryYear"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setCardDetails({
                                                expiryYear: value,
                                            });
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="YY" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {years.map((year) => (
                                                <SelectItem
                                                    key={year.value}
                                                    value={year.value}
                                                >
                                                    {year.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <div className="relative">
                                <Input
                                    id="cvv"
                                    type="password"
                                    placeholder="•••"
                                    maxLength={4}
                                    {...register('cvv')}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(
                                            /\D/g,
                                            '',
                                        );
                                        setValue('cvv', value, {
                                            shouldValidate: true,
                                        });
                                        setCardDetails({ cvv: value });
                                    }}
                                    className="font-mono"
                                />
                                <Lock className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                    {(errors.expiryMonth || errors.expiryYear) && (
                        <p className="text-sm text-red-500">
                            {errors.expiryMonth?.message ||
                                errors.expiryYear?.message}
                        </p>
                    )}
                    {errors.cvv && (
                        <p className="text-sm text-red-500">
                            {errors.cvv.message}
                        </p>
                    )}

                    {/* Secure notice */}
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        <Lock className="h-4 w-4" />
                        <span>
                            Your payment information is encrypted and secure.
                        </span>
                    </div>

                    {/* Submit button */}
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isProcessing || !isValid}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <motion.div
                                    className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                />
                                Processing...
                            </span>
                        ) : (
                            'Confirm Payment'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
