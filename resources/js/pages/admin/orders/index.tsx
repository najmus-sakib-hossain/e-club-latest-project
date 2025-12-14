import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    Search,
    Eye,
    X,
    Package,
    Truck,
    Check,
    Clock,
    DollarSign,
    ShoppingCart,
    User,
} from 'lucide-react';

import AdminPageLayout from '@/layouts/admin-page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
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
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        search?: string;
        status?: string;
        payment_status?: string;
    };
    stats?: {
        total_orders: number;
        pending_orders: number;
        total_revenue: number;
        avg_order_value: number;
    };
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const paymentStatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="h-3 w-3" />,
    processing: <Package className="h-3 w-3" />,
    shipped: <Truck className="h-3 w-3" />,
    delivered: <Check className="h-3 w-3" />,
    cancelled: <X className="h-3 w-3" />,
};

export default function OrdersIndex({ orders, filters = {}, stats }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [paymentFilter, setPaymentFilter] = useState(filters.payment_status || 'all');
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSearch = () => {
        router.get('/admin/orders', {
            search: searchQuery || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            payment_status: paymentFilter !== 'all' ? paymentFilter : undefined,
        }, { preserveState: true });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setPaymentFilter('all');
        router.get('/admin/orders');
    };

    const openViewDialog = (order: Order) => {
        setSelectedOrder(order);
        setIsViewDialogOpen(true);
    };

    const openStatusDialog = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setIsStatusDialogOpen(true);
    };

    const handleUpdateStatus = () => {
        if (!selectedOrder || !newStatus) return;
        setIsSubmitting(true);

        router.put(`/admin/orders/${selectedOrder.id}/status`, {
            status: newStatus,
        }, {
            onSuccess: () => {
                toast.success('Order status updated successfully');
                setIsStatusDialogOpen(false);
                setSelectedOrder(null);
            },
            onError: () => {
                toast.error('Failed to update order status');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/orders', {
            page,
            search: searchQuery || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            payment_status: paymentFilter !== 'all' ? paymentFilter : undefined,
        }, { preserveState: true });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AdminPageLayout>
            <Head title="Orders Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                        <p className="text-muted-foreground">
                            View and manage customer orders and shipments.
                        </p>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="grid gap-4 md:grid-cols-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_orders || orders.total}</div>
                            <p className="text-xs text-muted-foreground">All time orders</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.pending_orders || 0}</div>
                            <p className="text-xs text-muted-foreground">Awaiting processing</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue || 0)}</div>
                            <p className="text-xs text-muted-foreground">From all orders</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats?.avg_order_value || 0)}</div>
                            <p className="text-xs text-muted-foreground">Per order</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                            <CardDescription>Search and filter orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by order number, customer..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="Order Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="Payment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Payments</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleSearch}>Search</Button>
                                <Button variant="outline" onClick={handleClearFilters}>
                                    <X className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>All Orders</CardTitle>
                            <CardDescription>
                                A list of all orders placed in your store.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto -mx-4 md:mx-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead className="hidden lg:table-cell">Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="hidden sm:table-cell">Payment</TableHead>
                                            <TableHead className="hidden md:table-cell">Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                    No orders found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            orders.data.map((order, index) => (
                                                <motion.tr
                                                    key={order.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                                    className="border-b transition-colors hover:bg-muted/50"
                                                >
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">#{order.order_number}</span>
                                                            <span className="text-xs text-muted-foreground md:hidden">{formatDate(order.created_at)}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="hidden sm:flex h-8 w-8 rounded-full bg-muted items-center justify-center">
                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">{order.customer_name}</p>
                                                                <p className="text-xs text-muted-foreground hidden sm:block">{order.customer_email}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden lg:table-cell">
                                                        <Badge variant="secondary">
                                                            {order.items?.length || 0} items
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {formatCurrency(order.total_amount)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <button
                                                            onClick={() => openStatusDialog(order)}
                                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${statusColors[order.status]}`}
                                                        >
                                                            {statusIcons[order.status]}
                                                            <span className="hidden sm:inline">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                                        </button>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.payment_status]}`}>
                                                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                                        {formatDate(order.created_at)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 sm:h-9 sm:w-9"
                                                            onClick={() => openViewDialog(order)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </motion.tr>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {orders.last_page > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {((orders.current_page - 1) * orders.per_page) + 1} to{' '}
                                        {Math.min(orders.current_page * orders.per_page, orders.total)} of{' '}
                                        {orders.total} orders
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(orders.current_page - 1)}
                                            disabled={orders.current_page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(orders.current_page + 1)}
                                            disabled={orders.current_page === orders.last_page}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* View Order Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            Order #{selectedOrder?.order_number}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Order Status */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                                        {statusIcons[selectedOrder.status]}
                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${paymentStatusColors[selectedOrder.payment_status]}`}>
                                        Payment: {selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1)}
                                    </span>
                                </div>
                                <Button size="sm" onClick={() => {
                                    setIsViewDialogOpen(false);
                                    openStatusDialog(selectedOrder);
                                }}>
                                    Update Status
                                </Button>
                            </div>

                            <Separator />

                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Customer Information</h3>
                                    <div className="space-y-1 text-sm">
                                        <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customer_name}</p>
                                        <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customer_email}</p>
                                        {selectedOrder.customer_phone && (
                                            <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customer_phone}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                                        {selectedOrder.shipping_address}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold mb-3">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item) => {
                                        const itemImage = getImageUrl(item.image);
                                        const lineTotal = item.price * item.quantity;
                                        return (
                                            <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                                {itemImage ? (
                                                    <img
                                                        src={itemImage}
                                                        alt={item.name}
                                                        className="h-16 w-16 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                                                        <Package className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatCurrency(item.price)} × {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-medium">{formatCurrency(lineTotal)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <Separator />

                            {/* Order Summary */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                </div>
                                {selectedOrder.discount_amount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Discount</span>
                                        <span className="text-green-600">-{formatCurrency(selectedOrder.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{formatCurrency(selectedOrder.shipping_amount)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>{formatCurrency(selectedOrder.total_amount)}</span>
                                </div>
                            </div>

                            {selectedOrder.notes && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold mb-2">Order Notes</h3>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                                    </div>
                                </>
                            )}

                            <div className="text-xs text-muted-foreground">
                                Order placed on {formatDate(selectedOrder.created_at)}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                        <DialogDescription>
                            Change the status for order #{selectedOrder?.order_number}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Pending
                                    </div>
                                </SelectItem>
                                <SelectItem value="processing">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Processing
                                    </div>
                                </SelectItem>
                                <SelectItem value="shipped">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-4 w-4" />
                                        Shipped
                                    </div>
                                </SelectItem>
                                <SelectItem value="delivered">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4" />
                                        Delivered
                                    </div>
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    <div className="flex items-center gap-2">
                                        <X className="h-4 w-4" />
                                        Cancelled
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStatus} disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update Status'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminPageLayout>
    );
}
