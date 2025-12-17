import { SiteLayout } from '@/components/site';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Category, SiteSettings } from '@/types/cms';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface SiteAuthLayoutProps {
    title?: string;
    description?: string;
    settings?: SiteSettings;
    categories?: Category[];
}

export default function SiteAuthLayout({
    children,
    title,
    description,
    settings,
    categories,
}: PropsWithChildren<SiteAuthLayoutProps>) {
    return (
        <SiteLayout settings={settings} categories={categories}>
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <Card>
                        <CardHeader className="space-y-1 text-center">
                            <Link href="/" className="mb-4 flex justify-center">
                                <img
                                    src="/logo.png"
                                    alt="E-Club"
                                    className="h-12 w-auto"
                                />
                            </Link>
                            <CardTitle className="text-2xl font-bold">
                                {title}
                            </CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent>{children}</CardContent>
                    </Card>
                </div>
            </div>
        </SiteLayout>
    );
}
