import { Head } from '@inertiajs/react';
import {
    Calendar,
    Check,
    CreditCard,
    Download,
    Plus,
    Receipt,
    X,
} from 'lucide-react';
import { motion } from 'motion/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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

// Mock data for billing (in real app, this would come from backend)
const currentPlan = {
    name: 'Pro Plan',
    price: 29,
    currency: 'USD',
    billingPeriod: 'monthly',
    features: [
        'Unlimited products',
        'Advanced analytics',
        'Priority support',
        'Custom domain',
        'API access',
    ],
    nextBillingDate: '2025-01-15',
};

const paymentMethods = [
    {
        id: 1,
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expiryMonth: '12',
        expiryYear: '2027',
        isDefault: true,
    },
    {
        id: 2,
        type: 'card',
        brand: 'Mastercard',
        last4: '8888',
        expiryMonth: '08',
        expiryYear: '2026',
        isDefault: false,
    },
];

const invoices = [
    {
        id: 'INV-001',
        date: '2024-12-01',
        amount: 29.0,
        status: 'paid',
    },
    {
        id: 'INV-002',
        date: '2024-11-01',
        amount: 29.0,
        status: 'paid',
    },
    {
        id: 'INV-003',
        date: '2024-10-01',
        amount: 29.0,
        status: 'paid',
    },
    {
        id: 'INV-004',
        date: '2024-09-01',
        amount: 29.0,
        status: 'paid',
    },
];

export default function Billing() {
    return (
        <AdminLayout>
            <Head title="Billing" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">
                        Billing
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your subscription, payment methods, and billing
                        history.
                    </p>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Current Plan */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Receipt className="h-5 w-5" />
                                            Current Plan
                                        </CardTitle>
                                        <CardDescription>
                                            Your current subscription plan and
                                            features.
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant="default"
                                        className="bg-green-500"
                                    >
                                        Active
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold">
                                                {currentPlan.name}
                                            </h3>
                                            <p className="text-muted-foreground">
                                                Billed{' '}
                                                {currentPlan.billingPeriod}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-3xl font-bold">
                                                ${currentPlan.price}
                                            </span>
                                            <span className="text-muted-foreground">
                                                /month
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h4 className="mb-3 font-medium">
                                            Plan Features
                                        </h4>
                                        <ul className="grid gap-2 sm:grid-cols-2">
                                            {currentPlan.features.map(
                                                (feature, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <Check className="h-4 w-4 text-green-500" />
                                                        {feature}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            Next billing date:{' '}
                                            {new Date(
                                                currentPlan.nextBillingDate,
                                            ).toLocaleDateString()}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline">
                                                Change Plan
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Payment Methods */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Payment Methods
                                </CardTitle>
                                <CardDescription>
                                    Manage your payment methods.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100">
                                                    <span className="text-xs font-bold">
                                                        {method.brand}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        •••• {method.last4}
                                                        {method.isDefault && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="ml-2"
                                                            >
                                                                Default
                                                            </Badge>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Expires{' '}
                                                        {method.expiryMonth}/
                                                        {method.expiryYear}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                Edit
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        size="sm"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Payment Method
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Billing History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" />
                                Billing History
                            </CardTitle>
                            <CardDescription>
                                View and download your past invoices.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">
                                                {invoice.id}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    invoice.date,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                ${invoice.amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        invoice.status ===
                                                        'paid'
                                                            ? 'default'
                                                            : 'destructive'
                                                    }
                                                    className={
                                                        invoice.status ===
                                                        'paid'
                                                            ? 'bg-green-500'
                                                            : ''
                                                    }
                                                >
                                                    {invoice.status ===
                                                    'paid' ? (
                                                        <>
                                                            <Check className="mr-1 h-3 w-3" />{' '}
                                                            Paid
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="mr-1 h-3 w-3" />{' '}
                                                            Unpaid
                                                        </>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Download className="mr-1 h-4 w-4" />
                                                    Download
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AdminLayout>
    );
}
