import { Head, Link } from '@inertiajs/react';
import { ChevronRight, HelpCircle, Search, ChevronDown, Phone, Mail, MessageCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import { SiteLayout } from '@/components/site';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
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

interface HelpProps {
    settings?: SiteSettings;
    categories?: Category[];
    faqCategories?: FaqCategoryItem[];
    pageContent?: Record<string, PageContentSection>;
}

// Default quick links for fallback
const defaultQuickLinks = [
    { icon: 'phone', title: 'Call Us', description: 'Speak directly with our team', button_text: 'Call Now' },
    { icon: 'mail', title: 'Email Support', description: 'We\'ll respond within 24 hours', button_text: 'Send Email' },
    { icon: 'message', title: 'Live Chat', description: 'Chat with us in real-time', button_text: 'Start Chat' },
];

export default function Help({ settings, categories, faqCategories = [], pageContent = {} }: HelpProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const parsedCtaContent = useMemo(() => {
        try {
            return pageContent.cta?.content ? JSON.parse(pageContent.cta.content as string) : null;
        } catch (err) {
            return null;
        }
    }, [pageContent.cta?.content]);

    // Get dynamic content with fallbacks
    const heroTitle = pageContent.hero?.title || 'How Can We Help?';
    const heroSubtitle = pageContent.hero?.subtitle || 'Find answers to commonly asked questions or contact our support team.';
    const searchPlaceholder = pageContent.search?.title || 'Search for answers...';
    const quickLinks = (pageContent.quick_links?.items as typeof defaultQuickLinks) || defaultQuickLinks;
    const faqSectionTitle = pageContent.faq_section?.title || 'Frequently Asked Questions';
    const ctaTitle = pageContent.cta?.title || 'Still Need Help?';
    const ctaSubtitle = pageContent.cta?.subtitle || 'Can\'t find what you\'re looking for? Our support team is here to help.';
    const ctaButton1Text = parsedCtaContent?.button1_text || 'Contact Us';
    const ctaButton1Url = parsedCtaContent?.button1_url || '/contact';
    const ctaButton2Text = parsedCtaContent?.button2_text || 'Schedule a Meeting';
    const ctaButton2Url = parsedCtaContent?.button2_url || '/meeting/schedule';

    const filteredFaqs = useMemo(() => {
        if (!searchQuery.trim()) {
            return faqCategories;
        }

        return faqCategories.map((category) => ({
            ...category,
            active_faqs: category.active_faqs.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        })).filter((category) => category.active_faqs.length > 0);
    }, [faqCategories, searchQuery]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const getQuickLinkIcon = (iconName: string) => {
        switch (iconName?.toLowerCase()) {
            case 'phone': return <Phone className="h-8 w-8 text-primary mx-auto mb-3" />;
            case 'mail': return <Mail className="h-8 w-8 text-primary mx-auto mb-3" />;
            case 'message': return <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />;
            default: return <HelpCircle className="h-8 w-8 text-primary mx-auto mb-3" />;
        }
    };

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="Help Center" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">Help Center</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
                <div className="container mx-auto px-4 text-center">
                    <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">{heroTitle}</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                        {heroSubtitle}
                    </p>
                    
                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-12 pr-4 py-6 text-lg"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Quick Links */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {quickLinks.map((link, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="pt-6 text-center">
                                {getQuickLinkIcon(link.icon)}
                                <h3 className="font-semibold mb-1">{link.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{link.description}</p>
                                {link.icon?.toLowerCase() === 'phone' && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={`tel:${settings?.contact?.phone || '+8801XXXXXXXXX'}`}>
                                            {link.button_text || settings?.contact?.phone || '+880 1XXX-XXXXXX'}
                                        </a>
                                    </Button>
                                )}
                                {link.icon?.toLowerCase() === 'mail' && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={`mailto:${settings?.contact?.email || 'support@fitmentcraft.com'}`}>
                                            {link.button_text || 'Send Email'}
                                        </a>
                                    </Button>
                                )}
                                {link.icon?.toLowerCase() === 'message' && (
                                    <Button variant="outline" size="sm">
                                        {link.button_text || 'Start Chat'}
                                    </Button>
                                )}
                                {!['phone', 'mail', 'message'].includes(link.icon?.toLowerCase() || '') && (
                                    <Button variant="outline" size="sm">
                                        {link.button_text || 'Learn More'}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* FAQ Categories */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        {faqSectionTitle}
                    </h2>

                    {faqCategories.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">No FAQs available yet.</p>
                        </div>
                    ) : filteredFaqs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">No results found for "{searchQuery}"</p>
                            <Button variant="link" onClick={() => handleSearch('')}>
                                Clear search
                            </Button>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-2 gap-8">
                            {filteredFaqs.map((category) => (
                                <Card key={category.id}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            {category.icon && <span className="text-2xl">{category.icon}</span>}
                                            {category.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Accordion type="single" collapsible className="w-full">
                                            {category.active_faqs.map((faq) => (
                                                <AccordionItem key={faq.id} value={`${category.id}-${faq.id}`}>
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
                            ))}
                        </div>
                    )}
                </div>

                {/* Still Need Help CTA */}
                <div className="mt-16 text-center bg-muted rounded-lg p-8">
                    <h3 className="text-xl font-bold mb-2">{ctaTitle}</h3>
                    <p className="text-muted-foreground mb-6">
                        {ctaSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                            <Link href={ctaButton1Url}>{ctaButton1Text}</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={ctaButton2Url}>{ctaButton2Text}</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
