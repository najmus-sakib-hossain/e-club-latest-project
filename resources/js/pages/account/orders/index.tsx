import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight, Package, Search, Filter, Eye, User } from 'lucide-react';
import { useState } from 'react';

import { SiteLayout } from '@/components/site';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Category, SiteSettings } from '@/types/cms';
import type { SharedData } from '@/types';

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
    total_amount: number;
    payment_method: string;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items?: OrderItem[];
    created_at: string;
}

interface OrdersPageProps {
    settings?: SiteSettings;
    categories?: Category[];
    orders?: Order[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-muted text-muted-foreground',
    processing: 'bg-primary/10 text-primary',
    shipped: 'bg-chart-1/10 text-chart-1',
    delivered: 'bg-chart-2/10 text-chart-2',
    cancelled: 'bg-destructive/10 text-destructive',
};

const paymentStatusColors: Record<string, string> = {
    pending: 'bg-muted text-muted-foreground',
    paid: 'bg-primary/10 text-primary',
    failed: 'bg-destructive/10 text-destructive',
    refunded: 'bg-muted text-muted-foreground',
};

export default function OrdersPage({ settings, categories, orders = [] }: OrdersPageProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // If not logged in, show login prompt
    if (!user) {
        return (
            <SiteLayout settings={settings} categories={categories}>
                <Head title="My Orders" />

                <div className="bg-muted py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-primary">Home</Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href="/account" className="hover:text-primary">Account</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-foreground font-medium">My Orders</span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto text-center">
                        <User className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-4">Sign in to View Orders</h1>
                        <p className="text-muted-foreground mb-8">
                            Please sign in to view your order history and track your deliveries.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button asChild size="lg">
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button variant="outline" asChild size="lg">
                                <Link href="/register">Create Account</Link>
                            </Button>
                        </div>
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
            month: 'short',
            day: 'numeric',
        });
    };

    // Filter orders
    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="My Orders" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/account" className="hover:text-primary">Account</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">My Orders</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold">My Orders</h1>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by order number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 w-full sm:w-64"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-40">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Orders</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <Card>
                        <CardContent className="py-16">
                            <div className="text-center">
                                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h2 className="text-xl font-semibold mb-2">No orders found</h2>
                                <p className="text-muted-foreground mb-6">
                                    {orders.length === 0
                                        ? "You haven't placed any orders yet."
                                        : 'No orders match your search criteria.'}
                                </p>
                                <Button asChild>
                                    <Link href="/products">Start Shopping</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <Card className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                #{order.order_number}
                                            </TableCell>
                                            <TableCell>{formatDate(order.created_at)}</TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[order.status]}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={paymentStatusColors[order.payment_status]}>
                                                    {order.payment_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatPrice(order.total_amount)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/account/orders/${order.id}`}>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {filteredOrders.map((order) => (
                                <Card key={order.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base">
                                                #{order.order_number}
                                            </CardTitle>
                                            <Badge className={statusColors[order.status]}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(order.created_at)}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total</p>
                                                <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                                            </div>
                                            <Badge className={paymentStatusColors[order.payment_status]}>
                                                {order.payment_status}
                                            </Badge>
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full" asChild>
                                            <Link href={`/account/orders/${order.id}`}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </SiteLayout>
    );
}
