import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { Check, Lock, Mail, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AdminLayout } from '@/layouts/admin-layout';
import type { SharedData } from '@/types';
import { toast } from 'sonner';

// Form Schema
const profileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    avatar: z.any().optional(),
});

const passwordSchema = z
    .object({
        current_password: z.string().min(1, 'Current password is required'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ['password_confirmation'],
    });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Account() {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    const [profileProcessing, setProfileProcessing] = useState(false);
    const [passwordProcessing, setPasswordProcessing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
        user?.avatar ? `/storage/${user.avatar}` : undefined,
    );

    const profileForm = useHookForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    const passwordForm = useHookForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: '',
            password: '',
            password_confirmation: '',
        },
    });

    const handleProfileSubmit = (values: ProfileFormValues) => {
        setProfileProcessing(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        if (values.avatar instanceof File) {
            formData.append('avatar', values.avatar);
        }
        formData.append('_method', 'PATCH');

        router.post('/admin/profile', formData, {
            onSuccess: () => {
                toast.success('Profile updated successfully');
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error as string);
                });
            },
            onFinish: () => setProfileProcessing(false),
        });
    };

    const handlePasswordSubmit = (values: PasswordFormValues) => {
        setPasswordProcessing(true);
        router.put('/admin/profile/password', values, {
            onSuccess: () => {
                toast.success('Password updated successfully');
                passwordForm.reset();
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error as string);
                });
            },
            onFinish: () => setPasswordProcessing(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Account Settings" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">
                        Account Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account information and password.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Profile Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Update your account's profile information
                                    and email address.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...profileForm}>
                                    <form
                                        onSubmit={profileForm.handleSubmit(
                                            handleProfileSubmit,
                                        )}
                                        className="space-y-6"
                                    >
                                        {/* Avatar */}
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage
                                                    className="object-contain"
                                                    src={avatarPreview}
                                                    alt={user?.name}
                                                />
                                                <AvatarFallback className="text-xl">
                                                    {user?.name
                                                        ?.split(' ')
                                                        .map((n) => n[0])
                                                        .join('')
                                                        .toUpperCase()
                                                        .slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <FormField
                                                control={profileForm.control}
                                                name="avatar"
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel>
                                                            Profile Photo
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const file =
                                                                        e.target
                                                                            .files?.[0];
                                                                    if (file) {
                                                                        profileForm.setValue(
                                                                            'avatar',
                                                                            file,
                                                                        );
                                                                        const reader =
                                                                            new FileReader();
                                                                        reader.onloadend =
                                                                            () => {
                                                                                setAvatarPreview(
                                                                                    reader.result as string,
                                                                                );
                                                                            };
                                                                        reader.readAsDataURL(
                                                                            file,
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Upload a new profile
                                                            photo.
                                                        </FormDescription>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Separator />

                                        <FormField
                                            control={profileForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Your name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={profileForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="your@email.com"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={profileProcessing}
                                            >
                                                {profileProcessing
                                                    ? 'Saving...'
                                                    : 'Save Changes'}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Update Password */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Update Password
                                </CardTitle>
                                <CardDescription>
                                    Ensure your account is using a long, random
                                    password to stay secure.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...passwordForm}>
                                    <form
                                        onSubmit={passwordForm.handleSubmit(
                                            handlePasswordSubmit,
                                        )}
                                        className="space-y-6"
                                    >
                                        <FormField
                                            control={passwordForm.control}
                                            name="current_password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Current Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={passwordForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        New Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={passwordForm.control}
                                            name="password_confirmation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Confirm Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={passwordProcessing}
                                            >
                                                {passwordProcessing
                                                    ? 'Updating...'
                                                    : 'Update Password'}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Account Verification Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Email Verification
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                {user?.email_verified_at ? (
                                    <>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                            <Check className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                Email Verified
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Your email address has been
                                                verified.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                                            <Mail className="h-5 w-5 text-yellow-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                Email Not Verified
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Please verify your email
                                                address.
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Resend Verification Email
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AdminLayout>
    );
}
