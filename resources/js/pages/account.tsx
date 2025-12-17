import { Head, Link, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    Heart,
    LogOut,
    MapPin,
    Package,
    Settings,
    User,
} from 'lucide-react';

import { SiteLayout } from '@/components/site';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { SharedData } from '@/types';
import type { Category, SiteSettings } from '@/types/cms';

interface AccountProps {
    settings?: SiteSettings;
    categories?: Category[];
}

const accountLinks = [
    {
        icon: User,
        title: 'My Profile',
        description: 'View and update your profile',
        href: '/account/profile',
    },
    {
        icon: Package,
        title: 'My Orders',
        description: 'Track and manage your orders',
        href: '/account/orders',
    },
    {
        icon: Heart,
        title: 'Wishlist',
        description: 'View your saved items',
        href: '/account/wishlist',
    },
    {
        icon: MapPin,
        title: 'Addresses',
        description: 'Manage delivery addresses',
        href: '/account/addresses',
    },
    {
        icon: Settings,
        title: 'Account Settings',
        description: 'Update your profile and preferences',
        href: '/settings/profile',
    },
];

export default function Account({ settings, categories }: AccountProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    // If not logged in, show login prompt
    if (!user) {
        return (
            <SiteLayout settings={settings} categories={categories}>
                <Head title="My Account" />

                {/* Breadcrumb */}
                <div className="bg-muted py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-primary">
                                Home
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="font-medium text-foreground">
                                My Account
                            </span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-md text-center">
                        <User className="mx-auto mb-6 h-16 w-16 text-muted-foreground" />
                        <h1 className="mb-4 text-2xl font-bold">
                            Sign in to Your Account
                        </h1>
                        <p className="mb-8 text-muted-foreground">
                            Access your orders, wishlist, and manage your
                            account settings.
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

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="My Account" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-foreground">
                            My Account
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-4">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-6 flex flex-col items-center text-center">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage
                                            className="object-contain"
                                            src={user.avatar || '/logo.png'}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="text-2xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-lg font-semibold">
                                        {user.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                                <nav className="space-y-1">
                                    {accountLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        >
                                            <link.icon className="h-5 w-5" />
                                            <span>{link.title}</span>
                                        </Link>
                                    ))}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-destructive transition-colors hover:bg-destructive/10"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Sign Out</span>
                                    </Link>
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <h1 className="mb-6 text-2xl font-bold">My Account</h1>

                        {/* Quick Links */}
                        <div className="mb-8 grid gap-4 md:grid-cols-2">
                            {accountLinks.map((link) => (
                                <Card
                                    key={link.href}
                                    className="transition-shadow hover:shadow-lg"
                                >
                                    <Link href={link.href}>
                                        <CardHeader className="flex flex-row items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                                <link.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {link.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    {link.description}
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                    </Link>
                                </Card>
                            ))}
                        </div>

                        {/* Recent Orders */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Recent Orders</CardTitle>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/account/orders">
                                            View All
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="py-8 text-center text-muted-foreground">
                                    <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>No orders yet</p>
                                    <Button
                                        variant="link"
                                        asChild
                                        className="mt-2"
                                    >
                                        <Link href="/products">
                                            Start Shopping
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
