import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { CheckCircle, Package } from 'lucide-react';

import { SiteLayout } from '@/components/site/site-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { slideUpVariants, staggerContainerVariants } from '@/lib/animations';
import { getImageUrl } from '@/lib/utils';

// Define local type for Order
interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    notes: string | null;
    items?: OrderItem[];
    subtotal: number;
    discount_amount: number;
    shipping_amount: number;
    total_amount: number;
    payment_method: 'bkash' | 'nagad' | 'rocket' | 'cod';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    transaction_id: string | null;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    updated_at: string;
}

interface OrderConfirmationProps {
    order: Order;
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <SiteLayout>
            <Head title="Order Confirmation" />

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    variants={staggerContainerVariants}
                    initial="initial"
                    animate="animate"
                    className="mx-auto max-w-2xl"
                >
                    {/* Success Message */}
                    <motion.div
                        className="mb-8 text-center"
                        variants={slideUpVariants}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
                        >
                            <CheckCircle className="h-12 w-12 text-primary" />
                        </motion.div>
                        <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
                        <p className="text-muted-foreground">
                            Thank you for your order. We've received your order and will begin processing it soon.
                        </p>
                    </motion.div>

                    {/* Order Details Card */}
                    <motion.div variants={slideUpVariants}>
                        <Card className="py-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order #{order.order_number}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Placed on {formatDate(order.created_at)}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Order Status */}
                                <div className="rounded-lg bg-primary/10 p-4">
                                    <p className="text-sm font-medium text-primary">
                                        Order Status: <span className="capitalize">{order.status}</span>
                                    </p>
                                    <p className="mt-1 text-sm text-primary">
                                        Payment: <span className="capitalize">{order.payment_status}</span> via{' '}
                                        <span className="capitalize">{order.payment_method}</span>
                                    </p>
                                </div>

                                <Separator />

                                {/* Customer Info */}
                                <div>
                                    <h3 className="mb-2 font-semibold">Delivery Information</h3>
                                    <p className="text-foreground">{order.customer_name}</p>
                                    <p className="text-muted-foreground">{order.customer_email}</p>
                                    <p className="text-muted-foreground">{order.customer_phone}</p>
                                    <p className="mt-2 text-muted-foreground">{order.shipping_address}</p>
                                </div>

                                <Separator />

                                {/* Order Items */}
                                <div>
                                    <h3 className="mb-3 font-semibold">Order Items</h3>
                                    <div className="space-y-3">
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {item.image && (
                                                        <img
                                                            src={getImageUrl(item.image) || ''}
                                                            alt={item.name}
                                                            className="h-12 w-12 rounded object-cover"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {formatPrice(item.price)} × {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-medium">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Order Total */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(order.subtotal)}</span>
                                    </div>
                                    {order.discount_amount > 0 && (
                                        <div className="flex justify-between text-primary">
                                            <span>Discount</span>
                                            <span>-{formatPrice(order.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>
                                            {order.shipping_amount > 0 ? formatPrice(order.shipping_amount) : 'Free'}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>{formatPrice(order.total_amount)}</span>
                                    </div>
                                </div>

                                {order.notes && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="mb-2 font-semibold">Order Notes</h3>
                                            <p className="text-muted-foreground">{order.notes}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center"
                        variants={slideUpVariants}
                    >
                        <Button asChild>
                            <Link href="/">Continue Shopping</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </SiteLayout>
    );
}
