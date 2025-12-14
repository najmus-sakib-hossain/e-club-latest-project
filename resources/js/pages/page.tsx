import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { SiteLayout } from '@/components/site';
import type { Category, SiteSettings } from '@/types/cms';

interface PageContent {
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_title?: string;
    meta_description?: string;
}

interface PageProps {
    page: PageContent;
    settings?: SiteSettings;
    categories?: Category[];
}

export default function Page({ page, settings, categories }: PageProps) {
    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={page.meta_title || page.title}>
                {page.meta_description && (
                    <meta name="description" content={page.meta_description} />
                )}
            </Head>

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">{page.title}</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-primary/10 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold">{page.title}</h1>
                </div>
            </div>

            {/* Page Content */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div 
                        className="prose prose-lg max-w-4xl mx-auto"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </div>
        </SiteLayout>
    );
}
