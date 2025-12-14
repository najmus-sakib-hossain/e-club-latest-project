import { Head, Link } from '@inertiajs/react';
import { ChevronRight, RefreshCw, Package, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

import { SiteLayout } from '@/components/site';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Category, SiteSettings } from '@/types/cms';

interface PageContentSection {
    id?: number;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    image: string | null;
    items: Record<string, unknown>[] | null;
}

interface ReturnStep {
    step?: number;
    title: string;
    description: string;
}

interface EligibilityItem {
    text: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface ReturnsProps {
    settings?: SiteSettings;
    categories?: Category[];
    page?: {
        id: number;
        title: string;
        content: string;
        meta_title?: string;
        meta_description?: string;
    };
    content?: Record<string, PageContentSection>;
}

// Default return steps
const defaultReturnSteps: ReturnStep[] = [
    {
        step: 1,
        title: 'Initiate Return',
        description: 'Contact our customer service or log into your account to initiate a return request.',
    },
    {
        step: 2,
        title: 'Get Approval',
        description: 'Our team will review your request and approve it within 24 hours.',
    },
    {
        step: 3,
        title: 'Schedule Pickup',
        description: 'Once approved, we will schedule a pickup from your location.',
    },
    {
        step: 4,
        title: 'Quality Check',
        description: 'Item will be inspected at our facility to ensure it meets return criteria.',
    },
    {
        step: 5,
        title: 'Refund/Exchange',
        description: 'Refund processed within 7 business days or exchange shipped immediately.',
    },
];

const defaultEligibleItems: EligibilityItem[] = [
    { text: 'Items in original, unused condition' },
    { text: 'Items with all original tags and packaging' },
    { text: 'Items returned within 7 days of delivery' },
    { text: 'Manufacturing defects found within 30 days' },
    { text: 'Damaged items reported within 24 hours of delivery' },
];

const defaultNonEligibleItems: EligibilityItem[] = [
    { text: 'Custom-made or personalized furniture' },
    { text: 'Items with signs of use, damage, or wear' },
    { text: 'Items without original packaging or tags' },
    { text: 'Items returned after 7 days without valid reason' },
    { text: 'Clearance or final sale items' },
    { text: 'Items damaged by customer misuse' },
];

const defaultFaqs: FAQ[] = [
    {
        question: 'How long do I have to return an item?',
        answer: 'You have 7 days from the date of delivery to initiate a return request. For manufacturing defects, you have 30 days.',
    },
    {
        question: 'Is return shipping free?',
        answer: 'Yes, return shipping is free for defective items or items damaged during delivery. For change-of-mind returns, a pickup fee of ৳500 applies.',
    },
    {
        question: 'How will I receive my refund?',
        answer: 'Refunds are processed to your original payment method within 7 business days after the returned item passes quality inspection.',
    },
    {
        question: 'Can I exchange for a different product?',
        answer: 'Yes, you can exchange for a different product of equal or greater value. If the new product costs more, you can pay the difference.',
    },
    {
        question: 'What if I received a damaged item?',
        answer: 'Please report any damage within 24 hours of delivery with photos. We will arrange a free pickup and send a replacement immediately.',
    },
    {
        question: 'Can I return items bought on sale?',
        answer: 'Items purchased on regular sale can be returned. However, clearance items marked as "Final Sale" cannot be returned.',
    },
];

export default function Returns({ settings, categories, page, content }: ReturnsProps) {
    // Get content from database or use defaults
    const heroTitle = content?.hero?.title || 'Returns & Exchanges';
    const heroSubtitle = content?.hero?.subtitle || "We want you to be completely satisfied with your purchase. If you're not happy, we offer hassle-free returns and exchanges.";
    
    const returnSteps = (content?.return_steps?.items as ReturnStep[]) || defaultReturnSteps;
    const eligibleItems = (content?.eligible?.items as EligibilityItem[]) || defaultEligibleItems;
    const nonEligibleItems = (content?.not_eligible?.items as EligibilityItem[]) || defaultNonEligibleItems;
    const faqs = (content?.faqs?.items as FAQ[]) || defaultFaqs;
    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={page?.meta_title || 'Returns & Exchanges'}>
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
                        <span className="text-foreground font-medium">Returns & Exchanges</span>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="bg-primary/10 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">{heroTitle}</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {heroSubtitle}
                    </p>
                </div>
            </div>

            {/* Return Highlights */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Clock className="h-7 w-7 text-primary" />
                                </div>
                                <CardTitle className="text-lg">7-Day Returns</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Return items within 7 days of delivery for a full refund.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <RefreshCw className="h-7 w-7 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Easy Exchange</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Exchange for a different size, color, or product.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Package className="h-7 w-7 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Free Pickup</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Free pickup for defective or damaged items.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Return Process */}
            <div className="bg-muted py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        {content?.return_steps?.title || 'How to Return an Item'}
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />
                            
                            <div className="space-y-8">
                                {returnSteps.map((step, index) => (
                                    <div
                                        key={step.step || index}
                                        className={`relative flex items-center gap-8 ${
                                            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                    >
                                        <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                            <div className="bg-card p-6 rounded-lg shadow-sm">
                                                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                                                <p className="text-muted-foreground text-sm">{step.description}</p>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-lg font-bold text-primary-foreground shrink-0 z-10">
                                            {step.step || index + 1}
                                        </div>
                                        <div className="flex-1 hidden md:block" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Eligibility */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-8">Return Eligibility</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Eligible */}
                        <Card className="border-primary/30">
                            <CardHeader className="bg-primary/10">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-lg text-primary">
                                        {content?.eligible?.title || 'Eligible for Return'}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <ul className="space-y-3">
                                    {eligibleItems.map((item, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                            <span>{typeof item === 'string' ? item : item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Not Eligible */}
                        <Card className="border-destructive/30">
                            <CardHeader className="bg-destructive/10">
                                <div className="flex items-center gap-3">
                                    <XCircle className="h-6 w-6 text-destructive" />
                                    <CardTitle className="text-lg text-destructive">
                                        {content?.not_eligible?.title || 'Not Eligible'}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <ul className="space-y-3">
                                    {nonEligibleItems.map((item, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                            <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                            <span>{typeof item === 'string' ? item : item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Important Notice */}
            <div className="bg-chart-4/15 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto flex items-start gap-4">
                        <AlertTriangle className="h-6 w-6 text-chart-4 shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-chart-4 mb-2">Important Notice</h3>
                            <p className="text-chart-4 text-sm">
                                Please ensure items are returned in their original packaging with all accessories, 
                                tags, and documentation. Items that don't meet our return criteria may be rejected 
                                or subject to a restocking fee. For large furniture items, please contact us before 
                                attempting to move or return the item to avoid damage.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQs */}
            {faqs.length > 0 && (
                <div className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-8">
                            {content?.faqs?.title || 'Frequently Asked Questions'}
                        </h2>
                        <div className="max-w-3xl mx-auto">
                            <Accordion type="single" collapsible className="bg-card rounded-lg border">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="px-6 text-left">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact CTA */}
            <div className="bg-foreground text-background py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Need Help with a Return?</h2>
                    <p className="text-background/80 mb-6 max-w-xl mx-auto">
                        Our customer service team is ready to assist you with returns and exchanges.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </SiteLayout>
    );
}
