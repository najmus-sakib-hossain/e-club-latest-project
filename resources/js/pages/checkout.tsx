import { Head, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CreditCard, Wallet, Truck, CheckCircle2, ShoppingBag, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';

import { SiteLayout } from '@/components/site/site-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { PhoneInput } from '@/components/ui/phone-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCartStore, selectTotalPrice } from '@/stores/cart-store';
import { usePaymentStore, type CardDetails, type MobileWalletDetails } from '@/stores/payment-store';
import { CreditCardForm } from '@/components/checkout/credit-card-form';
import { MobileWalletForm } from '@/components/checkout/mobile-wallet-form';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import type { Category, SiteSettings } from '@/types/cms';

interface CheckoutPageProps {
    settings?: SiteSettings;
    categories?: Category[];
}

const checkoutSchema = z.object({
    customer_name: z.string().min(2, 'Name must be at least 2 characters'),
    customer_email: z.string().email('Please enter a valid email'),
    customer_phone: z.string().min(10, 'Please enter a valid phone number'),
    shipping_address: z.string().min(10, 'Please enter a complete address'),
    payment_method: z.enum(['bkash', 'nagad', 'rocket', 'card', 'cod']),
    notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Payment method options with card support
const paymentMethods = [
    {
        id: 'bkash',
        name: 'bKash',
        logo: '/company/bkash.png',
        color: 'bg-muted border-border hover:border-primary/60',
        activeColor: 'border-primary bg-primary/10',
        description: 'Pay with bKash mobile wallet',
    },
    {
        id: 'nagad',
        name: 'Nagad',
        logo: '/company/nagad.png',
        color: 'bg-muted border-border hover:border-primary/60',
        activeColor: 'border-primary bg-primary/10',
        description: 'Pay with Nagad mobile wallet',
    },
    {
        id: 'rocket',
        name: 'Rocket',
        logo: '/company/rocket.png',
        color: 'bg-muted border-border hover:border-primary/60',
        activeColor: 'border-primary bg-primary/10',
        description: 'Pay with Rocket mobile wallet',
    },
    {
        id: 'card',
        name: 'Credit/Debit Card',
        logo: null,
        icon: CreditCard,
        color: 'bg-muted border-border hover:border-primary/60',
        activeColor: 'border-primary bg-primary/10',
        description: 'Pay with Visa, Mastercard, or Amex',
    },
    {
        id: 'cod',
        name: 'Cash on Delivery',
        logo: null,
        icon: Truck,
        color: 'bg-muted border-border hover:border-foreground/30',
        activeColor: 'border-foreground bg-muted',
        description: 'Pay when you receive your order',
    },
] as const;

type PaymentMethodId = typeof paymentMethods[number]['id'];

export default function CheckoutPage({ settings, categories }: CheckoutPageProps) {
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const totalPrice = useCartStore(selectTotalPrice);
    const { resetPayment } = usePaymentStore();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'processing'>('details');
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);

    // Get dynamic content from settings
    const pageTitle = settings?.checkout?.checkout_page_title || 'Checkout';
    const shippingTitle = settings?.checkout?.checkout_shipping_title || 'Shipping Information';
    const paymentTitle = settings?.checkout?.checkout_payment_title || 'Payment Method';
    const orderSummaryTitle = settings?.checkout?.checkout_order_summary_title || 'Order Summary';
    const placeOrderButton = settings?.checkout?.checkout_place_order_button || 'Place Order';

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
        setValue,
        watch,
        getValues,
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            shipping_address: '',
            payment_method: 'bkash',
            notes: '',
        },
        mode: 'onChange',
    });

    const paymentMethod = watch('payment_method');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Handle form submission for customer details
    const handleDetailsSubmit = async (data: CheckoutFormData) => {
        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        
        // For COD, process order directly
        if (data.payment_method === 'cod') {
            await processOrder(data, null);
        } else {
            // For other methods, move to payment step
            setCheckoutStep('payment');
        }
    };

    // Handle credit card payment
    const handleCardPayment = async (cardDetails: CardDetails) => {
        setIsSubmitting(true);
        setCheckoutStep('processing');
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate transaction ID
            const txnId = `CARD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            setTransactionId(txnId);
            setPaymentCompleted(true);
            
            // Process the order
            await processOrder(getValues(), txnId);
        } catch {
            toast.error('Payment failed. Please try again.');
            setCheckoutStep('payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle mobile wallet payment
    const handleMobileWalletPayment = async (walletDetails: MobileWalletDetails) => {
        setIsSubmitting(true);
        setCheckoutStep('processing');
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (walletDetails.transactionId) {
                setTransactionId(walletDetails.transactionId);
                setPaymentCompleted(true);
                
                // Process the order
                await processOrder(getValues(), walletDetails.transactionId);
            }
        } catch {
            toast.error('Payment failed. Please try again.');
            setCheckoutStep('payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Process order with payment details
    const processOrder = async (data: CheckoutFormData, txnId: string | null) => {
        setIsSubmitting(true);

        try {
            const orderData = {
                ...data,
                transaction_id: txnId,
                items: items.map((item) => ({
                    product_id: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name,
                    image: item.image,
                })),
                subtotal: totalPrice,
                shipping_amount: 0,
                total_amount: totalPrice,
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success('Order placed successfully!');
                clearCart();
                resetPayment();
                router.visit(`/order-confirmation/${result.order_number}`);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to place order');
                setCheckoutStep('details');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
            setCheckoutStep('details');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle back from payment step
    const handleBackToDetails = () => {
        setCheckoutStep('details');
        setPaymentCompleted(false);
        setTransactionId(null);
    };

    if (items.length === 0) {
        return (
            <SiteLayout settings={settings} categories={categories}>
                <Head title={pageTitle} />
                <div className="container mx-auto px-4 py-16">
                    <motion.div
                        className="flex flex-col items-center justify-center py-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h2 className="mb-2 text-2xl font-semibold">Your cart is empty</h2>
                        <p className="mb-8 text-muted-foreground">
                            Add some items to your cart before checking out.
                        </p>
                        <Button asChild>
                            <Link href="/">Continue Shopping</Link>
                        </Button>
                    </motion.div>
                </div>
            </SiteLayout>
        );
    }

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={pageTitle} />

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {/* Header with Progress Steps */}
                    <motion.div variants={fadeInUp} className="mb-8">
                        {checkoutStep === 'payment' ? (
                            <Button variant="ghost" onClick={handleBackToDetails} className="mb-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Details
                            </Button>
                        ) : (
                            <Button variant="ghost" asChild className="mb-4">
                                <Link href="/cart">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Cart
                                </Link>
                            </Button>
                        )}
                        <h1 className="text-3xl font-bold">{pageTitle}</h1>
                        
                        {/* Progress Steps */}
                        <div className="mt-6 flex items-center justify-center gap-4">
                            <div className={`flex items-center gap-2 ${checkoutStep === 'details' ? 'text-primary' : 'text-muted-foreground'}`}>
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${checkoutStep === 'details' ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'}`}>
                                    {checkoutStep !== 'details' ? <CheckCircle2 className="h-5 w-5" /> : '1'}
                                </div>
                                <span className="text-sm font-medium">Details</span>
                            </div>
                            <div className="h-px w-12 bg-muted" />
                            <div className={`flex items-center gap-2 ${checkoutStep === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${checkoutStep === 'payment' ? 'bg-primary text-primary-foreground' : checkoutStep === 'processing' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    {checkoutStep === 'processing' ? <CheckCircle2 className="h-5 w-5" /> : '2'}
                                </div>
                                <span className="text-sm font-medium">Payment</span>
                            </div>
                            <div className="h-px w-12 bg-muted" />
                            <div className={`flex items-center gap-2 ${checkoutStep === 'processing' ? 'text-primary' : 'text-muted-foreground'}`}>
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${checkoutStep === 'processing' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    3
                                </div>
                                <span className="text-sm font-medium">Confirm</span>
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {/* Step 1: Customer Details */}
                        {checkoutStep === 'details' && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <form onSubmit={handleSubmit(handleDetailsSubmit)}>
                                    <div className="grid gap-8 lg:grid-cols-3">
                                        {/* Customer Information */}
                                        <div className="lg:col-span-2 space-y-6">
                                            {/* Personal Details */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Personal Details</CardTitle>
                                                    <CardDescription>Enter your contact information</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="customer_name">Full Name *</Label>
                                                            <Input
                                                                id="customer_name"
                                                                {...register('customer_name')}
                                                                placeholder="Enter your full name"
                                                            />
                                                            {errors.customer_name && (
                                                                <p className="text-sm text-destructive">{errors.customer_name.message}</p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="customer_email">Email Address *</Label>
                                                            <Input
                                                                id="customer_email"
                                                                type="email"
                                                                {...register('customer_email')}
                                                                placeholder="your@email.com"
                                                            />
                                                            {errors.customer_email && (
                                                                <p className="text-sm text-destructive">{errors.customer_email.message}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="customer_phone">Phone Number *</Label>
                                                        <Controller
                                                            name="customer_phone"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <PhoneInput
                                                                    id="customer_phone"
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                    defaultCountry="BD"
                                                                    placeholder="Enter phone number"
                                                                />
                                                            )}
                                                        />
                                                        {errors.customer_phone && (
                                                            <p className="text-sm text-destructive">{errors.customer_phone.message}</p>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Shipping Address */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>{shippingTitle}</CardTitle>
                                                    <CardDescription>Where should we deliver your order?</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="shipping_address">Full Address *</Label>
                                                        <Textarea
                                                            id="shipping_address"
                                                            {...register('shipping_address')}
                                                            placeholder="House/Flat no, Road, Area, City, District"
                                                            rows={3}
                                                        />
                                                        {errors.shipping_address && (
                                                            <p className="text-sm text-destructive">{errors.shipping_address.message}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="notes">Order Notes (Optional)</Label>
                                                        <Textarea
                                                            id="notes"
                                                            {...register('notes')}
                                                            placeholder="Any special instructions for delivery..."
                                                            rows={2}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Payment Method */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>{paymentTitle}</CardTitle>
                                                    <CardDescription>Select how you want to pay</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <RadioGroup
                                                        value={paymentMethod}
                                                        onValueChange={(value) => setValue('payment_method', value as PaymentMethodId)}
                                                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                                                    >
                                                        {paymentMethods.map((method) => (
                                                            <div key={method.id}>
                                                                <RadioGroupItem
                                                                    value={method.id}
                                                                    id={method.id}
                                                                    className="peer sr-only"
                                                                />
                                                                <Label
                                                                    htmlFor={method.id}
                                                                    className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                                                                        paymentMethod === method.id
                                                                            ? method.activeColor
                                                                            : method.color
                                                                    }`}
                                                                >
                                                                    {method.logo ? (
                                                                        <img
                                                                            src={method.logo}
                                                                            alt={method.name}
                                                                            className="h-10 w-10 object-contain"
                                                                            onError={(e) => {
                                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                            }}
                                                                        />
                                                                    ) : 'icon' in method && method.icon ? (
                                                                        <method.icon className="h-10 w-10 text-muted-foreground" />
                                                                    ) : (
                                                                        <Wallet className="h-10 w-10 text-muted-foreground" />
                                                                    )}
                                                                    <div className="text-center">
                                                                        <p className="font-medium">{method.name}</p>
                                                                        <p className="text-xs text-muted-foreground">{method.description}</p>
                                                                    </div>
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                    {errors.payment_method && (
                                                        <p className="mt-2 text-sm text-destructive">{errors.payment_method.message}</p>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Order Summary */}
                                        <div>
                                            <Card className="sticky top-24">
                                                <CardHeader>
                                                    <CardTitle>{orderSummaryTitle}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {/* Items */}
                                                    <div className="max-h-64 space-y-3 overflow-y-auto">
                                                        {items.map((item) => (
                                                            <div key={item.productId} className="flex gap-3">
                                                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                                                    {item.image ? (
                                                                        <img
                                                                            src={item.image.startsWith('http') ? item.image : `/storage/${item.image}`}
                                                                            alt={item.name}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                                            No image
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                                                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                                </div>
                                                                <p className="text-sm font-medium">
                                                                    {formatPrice(item.price * item.quantity)}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <Separator />

                                                    {/* Totals */}
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span>Subtotal</span>
                                                            <span>{formatPrice(totalPrice)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Shipping</span>
                                                            <span className="text-primary">Free</span>
                                                        </div>
                                                        <Separator />
                                                        <div className="flex justify-between text-lg font-semibold">
                                                            <span>Total</span>
                                                            <span>{formatPrice(totalPrice)}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button
                                                        type="submit"
                                                        className="w-full"
                                                        size="lg"
                                                        disabled={isSubmitting || !isValid}
                                                    >
                                                        {isSubmitting ? 'Processing...' : paymentMethod === 'cod' ? placeOrderButton : 'Continue to Payment'}
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 2: Payment Processing */}
                        {checkoutStep === 'payment' && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid gap-8 lg:grid-cols-3">
                                    <div className="lg:col-span-2">
                                        {/* Credit Card Form */}
                                        {paymentMethod === 'card' && (
                                            <CreditCardForm
                                                onSubmit={handleCardPayment}
                                                isProcessing={isSubmitting}
                                            />
                                        )}

                                        {/* Mobile Wallet Forms */}
                                        {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
                                            <MobileWalletForm
                                                walletType={paymentMethod}
                                                onSubmit={handleMobileWalletPayment}
                                                isProcessing={isSubmitting}
                                                amount={totalPrice}
                                            />
                                        )}
                                    </div>

                                    {/* Order Summary (Payment Step) */}
                                    <div>
                                        <Card className="sticky top-24">
                                            <CardHeader>
                                                <CardTitle>Order Summary</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Items ({items.length})</span>
                                                        <span>{formatPrice(totalPrice)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Shipping</span>
                                                        <span className="text-primary">Free</span>
                                                    </div>
                                                    <Separator />
                                                    <div className="flex justify-between text-lg font-semibold">
                                                        <span>Total</span>
                                                        <span>{formatPrice(totalPrice)}</span>
                                                    </div>
                                                </div>

                                                <Separator />

                                                {/* Customer Info Summary */}
                                                <div className="space-y-2 text-sm">
                                                    <p className="font-medium">Shipping to:</p>
                                                    <p className="text-muted-foreground">{getValues('customer_name')}</p>
                                                    <p className="text-muted-foreground">{getValues('shipping_address')}</p>
                                                    <p className="text-muted-foreground">{getValues('customer_phone')}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Processing */}
                        {checkoutStep === 'processing' && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                {!paymentCompleted ? (
                                    <>
                                        <motion.div
                                            className="mb-6 h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        />
                                        <h2 className="mb-2 text-2xl font-semibold">Processing Payment</h2>
                                        <p className="text-muted-foreground">
                                            Please wait while we process your payment...
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', duration: 0.5 }}
                                        >
                                            <CheckCircle2 className="mb-6 h-16 w-16 text-primary" />
                                        </motion.div>
                                        <h2 className="mb-2 text-2xl font-semibold">Payment Successful!</h2>
                                        <p className="text-muted-foreground">
                                            {transactionId && `Transaction ID: ${transactionId}`}
                                        </p>
                                        <p className="mt-4 text-muted-foreground">
                                            Creating your order...
                                        </p>
                                    </>
                                )}

                                <Alert className="mt-8 max-w-md">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Please do not close this page or refresh your browser.
                                    </AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </SiteLayout>
    );
}
