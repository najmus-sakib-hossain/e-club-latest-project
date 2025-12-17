import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Calendar,
    Check,
    ChevronRight,
    Loader2,
    Mail,
    User,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import { SiteLayout } from '@/components/site';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { SharedData } from '@/types';
import type { Category, SiteSettings } from '@/types/cms';

interface ProfilePageProps {
    settings?: SiteSettings;
    categories?: Category[];
}

export default function ProfilePage({
    settings,
    categories,
}: ProfilePageProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleProfileUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        profileForm.put('/account/profile', {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Profile updated successfully!');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };

    const handlePasswordUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        passwordForm.put('/account/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setSuccessMessage('Password updated successfully!');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };

    if (!user) {
        return (
            <SiteLayout settings={settings} categories={categories}>
                <Head title="Profile" />
                <div className="container mx-auto px-4 py-16">
                    <Card>
                        <CardContent className="py-16">
                            <div className="text-center">
                                <User className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                                <h2 className="mb-2 text-xl font-semibold">
                                    Please log in to view your profile
                                </h2>
                                <p className="mb-6 text-muted-foreground">
                                    You need to be logged in to access your
                                    profile settings.
                                </p>
                                <Button asChild>
                                    <Link href="/login">Log In</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SiteLayout>
        );
    }

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="My Profile" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/account" className="hover:text-primary">
                            Account
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-foreground">
                            Profile
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-3xl">
                    <h1 className="mb-6 text-2xl font-bold">My Profile</h1>

                    {/* Success Message */}
                    {successMessage && (
                        <Alert className="mb-6 border-primary/30 bg-primary/10">
                            <Check className="h-4 w-4 text-primary" />
                            <AlertDescription className="text-primary">
                                {successMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Profile Overview Card */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center gap-6 sm:flex-row">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-semibold">
                                        {user.name}
                                    </h2>
                                    <p className="mt-1 flex items-center justify-center gap-2 text-muted-foreground sm:justify-start">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            Member since{' '}
                                            {formatDate(user.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Update Profile Form */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your account's profile information and
                                email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleProfileUpdate}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={profileForm.data.name}
                                        onChange={(e) =>
                                            profileForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Your name"
                                        className={
                                            profileForm.errors.name
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {profileForm.errors.name && (
                                        <p className="text-sm text-destructive">
                                            {profileForm.errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) =>
                                            profileForm.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="your@email.com"
                                        className={
                                            profileForm.errors.email
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {profileForm.errors.email && (
                                        <p className="text-sm text-destructive">
                                            {profileForm.errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={profileForm.processing}
                                    >
                                        {profileForm.processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Update Password Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Password</CardTitle>
                            <CardDescription>
                                Ensure your account is using a long, random
                                password to stay secure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handlePasswordUpdate}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="current_password">
                                        Current Password
                                    </Label>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={
                                            passwordForm.data.current_password
                                        }
                                        onChange={(e) =>
                                            passwordForm.setData(
                                                'current_password',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="••••••••"
                                        className={
                                            passwordForm.errors.current_password
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {passwordForm.errors.current_password && (
                                        <p className="text-sm text-destructive">
                                            {
                                                passwordForm.errors
                                                    .current_password
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        New Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={passwordForm.data.password}
                                        onChange={(e) =>
                                            passwordForm.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="••••••••"
                                        className={
                                            passwordForm.errors.password
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {passwordForm.errors.password && (
                                        <p className="text-sm text-destructive">
                                            {passwordForm.errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={
                                            passwordForm.data
                                                .password_confirmation
                                        }
                                        onChange={(e) =>
                                            passwordForm.setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                    >
                                        {passwordForm.processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Update Password
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Quick Links */}
                    <Separator className="my-8" />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Button
                            variant="outline"
                            className="h-auto justify-start py-4"
                            asChild
                        >
                            <Link href="/account/orders">
                                <div className="text-left">
                                    <div className="font-medium">My Orders</div>
                                    <div className="text-sm text-muted-foreground">
                                        View order history
                                    </div>
                                </div>
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto justify-start py-4"
                            asChild
                        >
                            <Link href="/account/wishlist">
                                <div className="text-left">
                                    <div className="font-medium">Wishlist</div>
                                    <div className="text-sm text-muted-foreground">
                                        View saved items
                                    </div>
                                </div>
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto justify-start py-4"
                            asChild
                        >
                            <Link href="/account/addresses">
                                <div className="text-left">
                                    <div className="font-medium">Addresses</div>
                                    <div className="text-sm text-muted-foreground">
                                        Manage addresses
                                    </div>
                                </div>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
