import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import SiteAuthLayout from '@/layouts/auth/site-auth-layout';
import type { Category, SiteSettings } from '@/types/cms';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
    settings?: SiteSettings;
    categories?: Category[];
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
    settings,
    categories,
}: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post('/login', {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <SiteAuthLayout
            title="Welcome Back"
            description="Sign in to your account to continue shopping"
            settings={settings}
            categories={categories}
        >
            <Head title="Sign In" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                className="pr-9"
                                placeholder="you@example.com"
                            />
                            <Mail className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <InputError message={form.errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            {/* {canResetPassword && (
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </Link>
                            )} */}
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                className="pr-9"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <InputError message={form.errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            checked={form.data.remember}
                            onCheckedChange={(checked) =>
                                form.setData('remember', checked as boolean)
                            }
                            tabIndex={3}
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        tabIndex={4}
                        disabled={form.processing}
                    >
                        {form.processing && <Spinner />}
                        Sign In
                    </Button>
                </div>
            </form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {canRegister && (
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-primary hover:underline"
                        tabIndex={6}
                    >
                        Create one
                    </Link>
                </div>
            )}
        </SiteAuthLayout>
    );
}
