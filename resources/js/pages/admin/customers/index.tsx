import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    DollarSign,
    Eye,
    Mail,
    Search,
    ShoppingCart,
    Trash2,
    TrendingUp,
    Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
import { toast } from 'sonner';

// Types
interface Customer {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    orders_count: number;
    orders_sum_total_amount: number | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    customers: {
        data: Customer[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        search?: string;
    };
    stats?: {
        total_customers: number;
        new_this_month: number;
        total_orders: number;
        avg_orders_per_customer: number;
    };
}

export default function CustomersIndex({
    customers,
    filters = {},
    stats,
}: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearch = () => {
        router.get(
            '/admin/customers',
            {
                search: searchQuery || undefined,
            },
            { preserveState: true },
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const openViewDialog = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsViewDialogOpen(true);
    };

    const openDeleteDialog = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedCustomer) return;

        setIsDeleting(true);

        try {
            const response = await fetch(
                `/api/admin/customers/${selectedCustomer.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                },
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete customer');
            }

            toast.success('Customer deleted successfully');
            setIsDeleteDialogOpen(false);
            router.reload();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to delete customer',
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Ensure customers.data exists
    const customersData = customers?.data || [];

    return (
        <AdminLayout>
            <Head title="Customers Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Customers
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your customer base and view their order
                            history.
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
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Customers
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats?.total_customers || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Registered users
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                New This Month
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats?.new_this_month || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                New registrations
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Orders
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats?.total_orders || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All time orders
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Avg Orders/Customer
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats?.avg_orders_per_customer || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Orders per customer
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div className="flex flex-1 items-center gap-2">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search customers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="pl-9"
                            />
                        </div>
                        <Button variant="secondary" onClick={handleSearch}>
                            Search
                        </Button>
                    </div>
                </motion.div>

                {/* Customers Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>All Customers</CardTitle>
                            <CardDescription>
                                {customers.total} total customers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="-mx-4 overflow-x-auto md:mx-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Customer</TableHead>
                                            <TableHead className="hidden sm:table-cell">
                                                Email
                                            </TableHead>
                                            <TableHead className="hidden lg:table-cell">
                                                Orders
                                            </TableHead>
                                            <TableHead className="hidden md:table-cell">
                                                Total Spent
                                            </TableHead>
                                            <TableHead className="hidden lg:table-cell">
                                                Joined
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customersData.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    className="py-8 text-center text-muted-foreground"
                                                >
                                                    No customers found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            customersData.map(
                                                (customer, index) => (
                                                    <motion.tr
                                                        key={customer.id}
                                                        initial={{
                                                            opacity: 0,
                                                            x: -20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.2,
                                                            delay: index * 0.05,
                                                        }}
                                                        className="border-b transition-colors hover:bg-muted/50"
                                                    >
                                                        <TableCell>
                                                            <div className="flex items-center gap-2 sm:gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback className="text-xs">
                                                                        {getInitials(
                                                                            customer.name,
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {
                                                                            customer.name
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground sm:hidden">
                                                                        {
                                                                            customer.email
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="hidden h-4 w-4 text-muted-foreground md:block" />
                                                                <span className="text-sm">
                                                                    {
                                                                        customer.email
                                                                    }
                                                                </span>
                                                                {customer.email_verified_at && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="hidden text-xs lg:inline-flex"
                                                                    >
                                                                        Verified
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden lg:table-cell">
                                                            <Badge variant="outline">
                                                                {
                                                                    customer.orders_count
                                                                }{' '}
                                                                orders
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            <span className="font-medium">
                                                                {formatCurrency(
                                                                    customer.orders_sum_total_amount ||
                                                                        0,
                                                                )}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="hidden lg:table-cell">
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Calendar className="h-4 w-4" />
                                                                {formatDate(
                                                                    customer.created_at,
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-1 sm:gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 sm:h-9 sm:w-9"
                                                                    onClick={() =>
                                                                        openViewDialog(
                                                                            customer,
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-destructive hover:text-destructive sm:h-9 sm:w-9"
                                                                    onClick={() =>
                                                                        openDeleteDialog(
                                                                            customer,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        customer.orders_count >
                                                                        0
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </motion.tr>
                                                ),
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {customers.last_page > 1 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Page {customers.current_page} of{' '}
                                        {customers.last_page}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    '/admin/customers',
                                                    {
                                                        ...filters,
                                                        page:
                                                            customers.current_page -
                                                            1,
                                                    },
                                                    { preserveState: true },
                                                )
                                            }
                                            disabled={
                                                customers.current_page === 1
                                            }
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    '/admin/customers',
                                                    {
                                                        ...filters,
                                                        page:
                                                            customers.current_page +
                                                            1,
                                                    },
                                                    { preserveState: true },
                                                )
                                            }
                                            disabled={
                                                customers.current_page ===
                                                customers.last_page
                                            }
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

            {/* View Customer Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Customer Details</DialogTitle>
                        <DialogDescription>
                            View customer information and order history.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCustomer && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">
                                        {getInitials(selectedCustomer.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {selectedCustomer.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedCustomer.email}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Orders
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {selectedCustomer.orders_count}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Spent
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {formatCurrency(
                                            selectedCustomer.orders_sum_total_amount ||
                                                0,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Customer Since
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {formatDate(
                                            selectedCustomer.created_at,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Email Status
                                    </p>
                                    <Badge
                                        variant={
                                            selectedCustomer.email_verified_at
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {selectedCustomer.email_verified_at
                                            ? 'Verified'
                                            : 'Unverified'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this customer? This
                            action cannot be undone.
                            {selectedCustomer &&
                                selectedCustomer.orders_count > 0 && (
                                    <span className="mt-2 block font-medium text-destructive">
                                        This customer has{' '}
                                        {selectedCustomer.orders_count} orders
                                        and cannot be deleted.
                                    </span>
                                )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={
                                isDeleting ||
                                (selectedCustomer?.orders_count || 0) > 0
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
