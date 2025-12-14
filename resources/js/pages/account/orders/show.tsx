import { Head, Link, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    ArrowLeft,
    User,
    MapPin,
    CreditCard,
    Phone,
    Mail,
} from 'lucide-react';

import { SiteLayout } from '@/components/site';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Category, SiteSettings } from '@/types/cms';
import type { SharedData } from '@/types';

interface OrderItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
    product?: {
        slug: string;
        images: string[];
    };
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    notes: string | null;
    subtotal: number;
    discount_amount: number;
    shipping_amount: number;
    total_amount: number;
    payment_method: string;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    transaction_id: string | null;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

interface OrderDetailProps {
    settings?: SiteSettings;
    categories?: Category[];
    order: Order;
}

const statusColors: Record<string, string> = {
    pending: 'bg-muted text-muted-foreground border-border',
    processing: 'bg-primary/10 text-primary border-primary/30',
    shipped: 'bg-chart-1/10 text-chart-1 border-chart-1/30',
    delivered: 'bg-chart-2/10 text-chart-2 border-chart-2/30',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/30',
};

const paymentStatusColors: Record<string, string> = {
    pending: 'bg-muted text-muted-foreground',
    paid: 'bg-primary/10 text-primary',
    failed: 'bg-destructive/10 text-destructive',
    refunded: 'bg-muted text-muted-foreground',
};

const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function OrderDetail({ settings, categories, order }: OrderDetailProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    // If not logged in, show login prompt
    if (!user) {
        return (
            <SiteLayout settings={settings} categories={categories}>
                <Head title="Order Details" />

                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto text-center">
                        <User className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-4">Sign in to View Order</h1>
                        <p className="text-muted-foreground mb-8">
                            Please sign in to view your order details.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </div>
                </div>
            </SiteLayout>
        );
    }

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

    const getCurrentStepIndex = () => {
        if (order.status === 'cancelled') return -1;
        return statusSteps.findIndex((step) => step.key === order.status);
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={`Order #${order.order_number}`} />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/account" className="hover:text-primary">Account</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/account/orders" className="hover:text-primary">Orders</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">#{order.order_number}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
                            <Link href="/account/orders">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Orders
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
                        <p className="text-muted-foreground">
                            Placed on {formatDate(order.created_at)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badge className={statusColors[order.status]} variant="outline">
                            {order.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Badge className={paymentStatusColors[order.payment_status]}>
                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </Badge>
                    </div>
                </div>

                {/* Order Progress (only show if not cancelled) */}
                {order.status !== 'cancelled' && (
                    <Card className="mb-6">
                        <CardContent className="py-6">
                            <div className="relative">
                                <div className="flex justify-between">
                                    {statusSteps.map((step, index) => {
                                        const isCompleted = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;
                                        const StepIcon = step.icon;

                                        return (
                                            <div
                                                key={step.key}
                                                className={`flex flex-col items-center relative z-10 ${
                                                    index === 0 ? '' : 'flex-1'
                                                }`}
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        isCompleted
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted text-muted-foreground'
                                                    } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                                                >
                                                    <StepIcon className="h-5 w-5" />
                                                </div>
                                                <span
                                                    className={`mt-2 text-xs font-medium text-center ${
                                                        isCompleted ? 'text-foreground' : 'text-muted-foreground'
                                                    }`}
                                                >
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Progress Line */}
                                <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted -z-0">
                                    <div
                                        className="h-full bg-primary transition-all"
                                        style={{
                                            width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Cancelled Order Message */}
                {order.status === 'cancelled' && (
                    <Card className="mb-6 border-destructive/30 bg-destructive/10">
                        <CardContent className="py-6">
                            <div className="flex items-center gap-3 text-destructive">
                                <XCircle className="h-6 w-6" />
                                <div>
                                    <p className="font-semibold">Order Cancelled</p>
                                    <p className="text-sm">
                                        This order has been cancelled. If you have any questions, please contact support.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Items ({order.items.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 p-4 bg-muted rounded-lg"
                                        >
                                            <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                                                {item.product?.images?.[0] || item.image ? (
                                                    <img
                                                        src={item.product?.images?.[0] || `/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium truncate">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                                </p>
                                                {item.product?.slug && (
                                                    <Link
                                                        href={`/products/${item.product.slug}`}
                                                        className="text-sm text-primary hover:underline"
                                                    >
                                                        View Product
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-4" />

                                {/* Order Summary */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>{formatPrice(order.subtotal)}</span>
                                    </div>
                                    {order.discount_amount > 0 && (
                                        <div className="flex justify-between text-sm text-primary">
                                            <span>Discount</span>
                                            <span>-{formatPrice(order.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>
                                            {order.shipping_amount === 0
                                                ? 'Free'
                                                : formatPrice(order.shipping_amount)}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>{formatPrice(order.total_amount)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Info Sidebar */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium">{order.customer_name}</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                    {order.shipping_address}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{order.customer_email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{order.customer_phone}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Method</span>
                                    <span className="capitalize">{order.payment_method}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge className={paymentStatusColors[order.payment_status]}>
                                        {order.payment_status}
                                    </Badge>
                                </div>
                                {order.transaction_id && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Transaction ID</span>
                                        <span className="font-mono text-xs">{order.transaction_id}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {order.notes && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Order Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/contact">Need Help?</Link>
                            </Button>
                            <Button className="w-full" asChild>
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
