import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Clock,
    CreditCard,
    History,
    Mail,
    MapPin,
    Package,
    Phone,
    Receipt,
    Truck,
    User,
    X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AdminLayout } from '@/layouts/admin-layout';
import { getImageUrl } from '@/lib/utils';

// Types
interface OrderItem {
    id: number;
    product_id: number;
    name: string;
    image: string | null;
    quantity: number;
    price: number;
    product?: {
        id: number;
        name: string;
        images: string[];
    };
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    shipping_address: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: string | null;
    transaction_id: string | null;
    subtotal: number;
    discount_amount: number;
    shipping_amount: number;
    total_amount: number;
    notes: string | null;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

interface Props {
    order: Order;
}

// Status configurations
const orderStatuses = [
    {
        value: 'pending',
        label: 'Pending',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800',
    },
    {
        value: 'processing',
        label: 'Processing',
        icon: Package,
        color: 'bg-blue-100 text-blue-800',
    },
    {
        value: 'shipped',
        label: 'Shipped',
        icon: Truck,
        color: 'bg-purple-100 text-purple-800',
    },
    {
        value: 'delivered',
        label: 'Delivered',
        icon: Check,
        color: 'bg-green-100 text-green-800',
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
        icon: X,
        color: 'bg-red-100 text-red-800',
    },
];

const paymentStatuses = [
    {
        value: 'pending',
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800',
    },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
    {
        value: 'refunded',
        label: 'Refunded',
        color: 'bg-gray-100 text-gray-800',
    },
];

export default function OrderShow({ order }: Props) {
    const [isUpdating, setIsUpdating] = useState(false);

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

    const getStatusConfig = (status: string) => {
        return (
            orderStatuses.find((s) => s.value === status) || orderStatuses[0]
        );
    };

    const getPaymentStatusConfig = (status: string) => {
        return (
            paymentStatuses.find((s) => s.value === status) ||
            paymentStatuses[0]
        );
    };

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            router.put(
                `/admin/orders/${order.id}/status`,
                { status: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Order status updated successfully');
                    },
                    onError: () => {
                        toast.error('Failed to update order status');
                    },
                    onFinish: () => {
                        setIsUpdating(false);
                    },
                },
            );
        } catch {
            toast.error('An error occurred');
            setIsUpdating(false);
        }
    };

    const handlePaymentStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            router.put(
                `/admin/orders/${order.id}/payment-status`,
                { payment_status: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Payment status updated successfully');
                    },
                    onError: () => {
                        toast.error('Failed to update payment status');
                    },
                    onFinish: () => {
                        setIsUpdating(false);
                    },
                },
            );
        } catch {
            toast.error('An error occurred');
            setIsUpdating(false);
        }
    };

    const statusConfig = getStatusConfig(order.status);
    const paymentConfig = getPaymentStatusConfig(order.payment_status);
    const StatusIcon = statusConfig.icon;

    return (
        <AdminLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/orders">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Orders
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Order #{order.order_number}
                        </h1>
                        <p className="text-muted-foreground">
                            Placed on {formatDate(order.created_at)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={`${statusConfig.color} px-3 py-1`}>
                            <StatusIcon className="mr-1 h-4 w-4" />
                            {statusConfig.label}
                        </Badge>
                        <Badge className={`${paymentConfig.color} px-3 py-1`}>
                            {paymentConfig.label}
                        </Badge>
                    </div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Receipt className="h-5 w-5" />
                                        Order Items
                                    </CardTitle>
                                    <CardDescription>
                                        {order.items.length} item
                                        {order.items.length !== 1 ? 's' : ''} in
                                        this order
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead className="text-center">
                                                    Quantity
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Unit Price
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Total
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items.map((item) => {
                                                const imageUrl =
                                                    getImageUrl(item.image) ||
                                                    (item.product?.images?.[0]
                                                        ? getImageUrl(
                                                              item.product
                                                                  .images[0],
                                                          )
                                                        : null);

                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                                    {imageUrl ? (
                                                                        <img
                                                                            src={
                                                                                imageUrl
                                                                            }
                                                                            alt={
                                                                                item.name
                                                                            }
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-full w-full items-center justify-center">
                                                                            <Package className="h-5 w-5 text-gray-400" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        ID:{' '}
                                                                        {
                                                                            item.product_id
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {item.quantity}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {formatPrice(
                                                                item.price,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {formatPrice(
                                                                item.price *
                                                                    item.quantity,
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>

                                    {/* Order Totals */}
                                    <div className="mt-6 space-y-2 border-t pt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Subtotal
                                            </span>
                                            <span>
                                                {formatPrice(order.subtotal)}
                                            </span>
                                        </div>
                                        {order.discount_amount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Discount
                                                </span>
                                                <span className="text-green-600">
                                                    -
                                                    {formatPrice(
                                                        order.discount_amount,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Shipping
                                            </span>
                                            <span>
                                                {order.shipping_amount > 0
                                                    ? formatPrice(
                                                          order.shipping_amount,
                                                      )
                                                    : 'Free'}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span>
                                                {formatPrice(
                                                    order.total_amount,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Order Notes */}
                        {order.notes && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">
                                            {order.notes}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Management */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <History className="h-5 w-5" />
                                        Status Management
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Order Status
                                        </label>
                                        <Select
                                            value={order.status}
                                            onValueChange={handleStatusChange}
                                            disabled={isUpdating}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {orderStatuses.map((status) => (
                                                    <SelectItem
                                                        key={status.value}
                                                        value={status.value}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <status.icon className="h-4 w-4" />
                                                            {status.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Payment Status
                                        </label>
                                        <Select
                                            value={order.payment_status}
                                            onValueChange={
                                                handlePaymentStatusChange
                                            }
                                            disabled={isUpdating}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {paymentStatuses.map(
                                                    (status) => (
                                                        <SelectItem
                                                            key={status.value}
                                                            value={status.value}
                                                        >
                                                            {status.label}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Customer Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Customer Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {order.customer_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Customer
                                            </p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <a
                                                href={`mailto:${order.customer_email}`}
                                                className="text-sm hover:underline"
                                            >
                                                {order.customer_email}
                                            </a>
                                        </div>
                                        {order.customer_phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <a
                                                    href={`tel:${order.customer_phone}`}
                                                    className="text-sm hover:underline"
                                                >
                                                    {order.customer_phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Shipping Address */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Shipping Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm whitespace-pre-line text-muted-foreground">
                                        {order.shipping_address}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Payment Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Payment Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Method
                                        </span>
                                        <span className="text-sm font-medium capitalize">
                                            {order.payment_method || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Status
                                        </span>
                                        <Badge className={paymentConfig.color}>
                                            {paymentConfig.label}
                                        </Badge>
                                    </div>
                                    {order.transaction_id && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Transaction ID
                                            </span>
                                            <span className="font-mono text-sm">
                                                {order.transaction_id}
                                            </span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">
                                            Total Paid
                                        </span>
                                        <span className="text-sm font-bold">
                                            {formatPrice(order.total_amount)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
