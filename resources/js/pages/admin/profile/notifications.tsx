import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Bell,
    Globe,
    Mail,
    MessageSquare,
    Package,
    ShoppingCart,
    Smartphone,
    Star,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { AdminLayout } from '@/layouts/admin-layout';
import type { SharedData } from '@/types';
import { toast } from 'sonner';

// Types
interface NotificationSettings {
    email_orders: boolean;
    email_reviews: boolean;
    email_inventory: boolean;
    email_newsletter: boolean;
    push_orders: boolean;
    push_reviews: boolean;
    push_inventory: boolean;
    browser_enabled: boolean;
    sms_enabled: boolean;
}

interface Props {
    notifications?: NotificationSettings;
}

// Form Schema
const notificationsSchema = z.object({
    email_orders: z.boolean(),
    email_reviews: z.boolean(),
    email_inventory: z.boolean(),
    email_newsletter: z.boolean(),
    push_orders: z.boolean(),
    push_reviews: z.boolean(),
    push_inventory: z.boolean(),
    browser_enabled: z.boolean(),
    sms_enabled: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsSchema>;

export default function Notifications({ notifications }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [processing, setProcessing] = useState(false);

    // Default values
    const defaultNotifications: NotificationSettings = {
        email_orders: true,
        email_reviews: true,
        email_inventory: true,
        email_newsletter: false,
        push_orders: true,
        push_reviews: false,
        push_inventory: true,
        browser_enabled: true,
        sms_enabled: false,
        ...notifications,
    };

    const form = useHookForm<NotificationsFormValues>({
        resolver: zodResolver(notificationsSchema),
        defaultValues: defaultNotifications,
    });

    const handleSubmit = (values: NotificationsFormValues) => {
        setProcessing(true);
        router.post('/admin/profile/notifications', values, {
            onSuccess: () => {
                toast.success('Notification preferences saved successfully');
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error as string);
                });
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Notifications" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">
                        Notifications
                    </h1>
                    <p className="text-muted-foreground">
                        Manage how you receive notifications and alerts.
                    </p>
                </motion.div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        {/* Email Notifications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="h-5 w-5" />
                                        Email Notifications
                                    </CardTitle>
                                    <CardDescription>
                                        Choose which emails you'd like to
                                        receive.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email_orders"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <ShoppingCart className="h-4 w-4" />
                                                        Order Updates
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Receive emails when
                                                        orders are placed,
                                                        shipped, or delivered.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email_reviews"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Star className="h-4 w-4" />
                                                        New Reviews
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Get notified when
                                                        customers leave reviews.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email_inventory"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Package className="h-4 w-4" />
                                                        Inventory Alerts
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Receive alerts when
                                                        products are running
                                                        low.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email_newsletter"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <MessageSquare className="h-4 w-4" />
                                                        Newsletter
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Receive product updates
                                                        and marketing emails.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Push Notifications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        Push Notifications
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your push notification
                                        preferences.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="push_orders"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <ShoppingCart className="h-4 w-4" />
                                                        Order Updates
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Push notifications for
                                                        new orders.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="push_reviews"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Star className="h-4 w-4" />
                                                        New Reviews
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Push notifications for
                                                        new reviews.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="push_inventory"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Package className="h-4 w-4" />
                                                        Inventory Alerts
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Push notifications for
                                                        low inventory.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Other Notification Channels */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Smartphone className="h-5 w-5" />
                                        Other Channels
                                    </CardTitle>
                                    <CardDescription>
                                        Additional notification methods.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="browser_enabled"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4" />
                                                        Browser Notifications
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Receive notifications in
                                                        your browser when the
                                                        dashboard is open.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sms_enabled"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Smartphone className="h-4 w-4" />
                                                        SMS Notifications
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Receive critical alerts
                                                        via SMS (additional
                                                        charges may apply).
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Save Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="flex justify-end"
                        >
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Preferences'}
                            </Button>
                        </motion.div>
                    </form>
                </Form>
            </div>
        </AdminLayout>
    );
}
