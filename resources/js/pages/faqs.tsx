import { Head, Link } from '@inertiajs/react';
import {
    ChevronRight,
    CreditCard,
    HelpCircle,
    Info,
    Package,
    RefreshCw,
    Shield,
    Truck,
    Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { SiteLayout } from '@/components/site';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Category, SiteSettings } from '@/types/cms';

interface FaqItem {
    id: number;
    faq_category_id: number;
    question: string;
    answer: string;
    is_active: boolean;
    sort_order: number;
}

interface FaqCategoryItem {
    id: number;
    name: string;
    icon: string | null;
    page_slug: string;
    is_active: boolean;
    sort_order: number;
    active_faqs: FaqItem[];
}

interface PageContentSection {
    id: number;
    page_slug: string;
    section_key: string;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    image: string | null;
    items: Array<Record<string, string>> | null;
    is_active: boolean;
    sort_order: number;
}

interface FAQsProps {
    settings?: SiteSettings;
    categories?: Category[];
    page?: {
        id: number;
        title: string;
        content: string;
        meta_title?: string;
        meta_description?: string;
    };
    faqCategories?: FaqCategoryItem[];
    pageContent?: Record<string, PageContentSection>;
}

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Package: Package,
    Truck: Truck,
    CreditCard: CreditCard,
    Shield: Shield,
    RefreshCw: RefreshCw,
    Wrench: Wrench,
    HelpCircle: HelpCircle,
    Info: Info,
};

export default function FAQs({
    settings,
    categories,
    page,
    faqCategories = [],
    pageContent = {},
}: FAQsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Get dynamic content with fallbacks
    const heroTitle = pageContent.hero?.title || 'Frequently Asked Questions';
    const heroSubtitle =
        pageContent.hero?.subtitle ||
        'Find answers to common questions about our products, services, and policies.';
    const ctaTitle = pageContent.cta?.title || 'Still Have Questions?';
    const ctaSubtitle =
        pageContent.cta?.subtitle ||
        "Can't find what you're looking for? Our customer support team is here to help.";

    // Get icon component from icon name
    const getIcon = (iconName: string | null) => {
        if (!iconName) return HelpCircle;
        return iconMap[iconName] || HelpCircle;
    };

    // Filter FAQs based on search query
    const filteredCategories = useMemo(() => {
        return faqCategories
            .map((category) => ({
                ...category,
                filteredFaqs: category.active_faqs.filter(
                    (faq) =>
                        faq.question
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        faq.answer
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                ),
            }))
            .filter((category) => category.filteredFaqs.length > 0);
    }, [faqCategories, searchQuery]);

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={page?.meta_title || 'FAQs'}>
                {page?.meta_description && (
                    <meta name="description" content={page.meta_description} />
                )}
            </Head>

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-foreground">
                            FAQs
                        </span>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="bg-primary/10 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="mb-4 text-3xl font-bold lg:text-4xl">
                        {heroTitle}
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
                        {heroSubtitle}
                    </p>
                    {/* Search */}
                    <div className="relative mx-auto max-w-md">
                        <Input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                        <HelpCircle className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" />
                    </div>
                </div>
            </div>

            {/* Category Quick Links */}
            {!searchQuery && faqCategories.length > 0 && (
                <div className="border-b py-8">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                            {faqCategories.map((category) => {
                                const IconComponent = getIcon(category.icon);
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setActiveCategory(
                                                String(category.id),
                                            );
                                            document
                                                .getElementById(
                                                    `faq-${category.id}`,
                                                )
                                                ?.scrollIntoView({
                                                    behavior: 'smooth',
                                                });
                                        }}
                                        className={`rounded-lg p-4 text-center transition-colors ${
                                            activeCategory ===
                                            String(category.id)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'
                                        }`}
                                    >
                                        <IconComponent className="mx-auto mb-2 h-6 w-6" />
                                        <span className="text-sm font-medium">
                                            {category.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* FAQ Content */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    {faqCategories.length === 0 ? (
                        <div className="py-12 text-center">
                            <HelpCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground/60" />
                            <h3 className="mb-2 text-lg font-medium text-foreground">
                                No FAQs available
                            </h3>
                            <p className="text-muted-foreground">
                                Check back later for frequently asked questions.
                            </p>
                        </div>
                    ) : searchQuery && filteredCategories.length === 0 ? (
                        <div className="py-12 text-center">
                            <HelpCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground/60" />
                            <h3 className="mb-2 text-lg font-medium text-foreground">
                                No results found
                            </h3>
                            <p className="text-muted-foreground">
                                Try searching with different keywords or browse
                                our FAQ categories.
                            </p>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-4xl space-y-8">
                            {(searchQuery
                                ? filteredCategories
                                : faqCategories
                            ).map((category) => {
                                const IconComponent = getIcon(category.icon);
                                const faqs: FaqItem[] =
                                    (
                                        category as FaqCategoryItem & {
                                            filteredFaqs?: FaqItem[];
                                        }
                                    ).filteredFaqs || category.active_faqs;
                                return (
                                    <Card
                                        key={category.id}
                                        id={`faq-${category.id}`}
                                    >
                                        <CardHeader className="bg-muted">
                                            <CardTitle className="flex items-center gap-3">
                                                <IconComponent className="h-5 w-5 text-primary" />
                                                {category.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <Accordion
                                                type="single"
                                                collapsible
                                            >
                                                {faqs.map((faq, index) => (
                                                    <AccordionItem
                                                        key={faq.id || index}
                                                        value={`${category.id}-${faq.id || index}`}
                                                    >
                                                        <AccordionTrigger className="text-left">
                                                            {faq.question}
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-muted-foreground">
                                                            {faq.answer}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-foreground py-12 text-background">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-2xl font-bold">{ctaTitle}</h2>
                    <p className="mx-auto mb-6 max-w-xl text-background/80">
                        {ctaSubtitle}
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Contact Us
                        </Link>
                        <Link
                            href="/help"
                            className="inline-flex items-center justify-center rounded-lg border border-background px-8 py-3 transition-colors hover:bg-background hover:text-foreground"
                        >
                            Help Center
                        </Link>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
