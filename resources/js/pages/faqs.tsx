import { Head, Link } from '@inertiajs/react';
import { ChevronRight, HelpCircle, Package, Truck, CreditCard, Shield, RefreshCw, Wrench, Info } from 'lucide-react';
import { useState, useMemo, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from 'react';

import { SiteLayout } from '@/components/site';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
    'Package': Package,
    'Truck': Truck,
    'CreditCard': CreditCard,
    'Shield': Shield,
    'RefreshCw': RefreshCw,
    'Wrench': Wrench,
    'HelpCircle': HelpCircle,
    'Info': Info,
};

export default function FAQs({ settings, categories, page, faqCategories = [], pageContent = {} }: FAQsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Get dynamic content with fallbacks
    const heroTitle = pageContent.hero?.title || 'Frequently Asked Questions';
    const heroSubtitle = pageContent.hero?.subtitle || 'Find answers to common questions about our products, services, and policies.';
    const ctaTitle = pageContent.cta?.title || 'Still Have Questions?';
    const ctaSubtitle = pageContent.cta?.subtitle || 'Can\'t find what you\'re looking for? Our customer support team is here to help.';

    // Get icon component from icon name
    const getIcon = (iconName: string | null) => {
        if (!iconName) return HelpCircle;
        return iconMap[iconName] || HelpCircle;
    };

    // Filter FAQs based on search query
    const filteredCategories = useMemo(() => {
        return faqCategories.map(category => ({
            ...category,
            filteredFaqs: category.active_faqs.filter(
                faq =>
                    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        })).filter(category => category.filteredFaqs.length > 0);
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
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">FAQs</span>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="bg-primary/10 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">{heroTitle}</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                        {heroSubtitle}
                    </p>
                    {/* Search */}
                    <div className="max-w-md mx-auto relative">
                        <Input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                        <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                    </div>
                </div>
            </div>

            {/* Category Quick Links */}
            {!searchQuery && faqCategories.length > 0 && (
                <div className="py-8 border-b">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {faqCategories.map((category) => {
                                const IconComponent = getIcon(category.icon);
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setActiveCategory(String(category.id));
                                            document.getElementById(`faq-${category.id}`)?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className={`p-4 rounded-lg text-center transition-colors ${
                                            activeCategory === String(category.id)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'
                                        }`}
                                    >
                                        <IconComponent className="h-6 w-6 mx-auto mb-2" />
                                        <span className="text-sm font-medium">{category.name}</span>
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
                        <div className="text-center py-12">
                            <HelpCircle className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">No FAQs available</h3>
                            <p className="text-muted-foreground">
                                Check back later for frequently asked questions.
                            </p>
                        </div>
                    ) : searchQuery && filteredCategories.length === 0 ? (
                        <div className="text-center py-12">
                            <HelpCircle className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
                            <p className="text-muted-foreground">
                                Try searching with different keywords or browse our FAQ categories.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-8">
                            {(searchQuery ? filteredCategories : faqCategories).map((category) => {
                                const IconComponent = getIcon(category.icon);
                                const faqs: FaqItem[] = (category as FaqCategoryItem & { filteredFaqs?: FaqItem[] }).filteredFaqs || category.active_faqs;
                                return (
                                    <Card key={category.id} id={`faq-${category.id}`}>
                                        <CardHeader className="bg-muted">
                                            <CardTitle className="flex items-center gap-3">
                                                <IconComponent className="h-5 w-5 text-primary" />
                                                {category.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <Accordion type="single" collapsible>
                                                {faqs.map((faq, index) => (
                                                    <AccordionItem key={faq.id || index} value={`${category.id}-${faq.id || index}`}>
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
            <div className="bg-foreground text-background py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">{ctaTitle}</h2>
                    <p className="text-background/80 mb-6 max-w-xl mx-auto">
                        {ctaSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Contact Us
                        </Link>
                        <Link
                            href="/help"
                            className="inline-flex items-center justify-center px-8 py-3 border border-background rounded-lg hover:bg-background hover:text-foreground transition-colors"
                        >
                            Help Center
                        </Link>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
