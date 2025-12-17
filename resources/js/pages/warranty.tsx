import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle,
    ChevronRight,
    FileText,
    Mail,
    Phone,
    Shield,
    XCircle,
} from 'lucide-react';

import { SiteLayout } from '@/components/site';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Category, SiteSettings } from '@/types/cms';

interface PageContentSection {
    id?: number;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    image: string | null;
    items: Record<string, unknown>[] | null;
}

interface WarrantyTier {
    title: string;
    duration: string;
    description: string;
    color?: string;
    iconColor?: string;
}

interface CoveredItem {
    text: string;
}

interface ClaimStep {
    step: number;
    title: string;
    description: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface WarrantyProps {
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

// Default warranty tiers
const defaultWarrantyTiers: WarrantyTier[] = [
    {
        title: 'Standard Warranty',
        duration: '2 Years',
        description: 'Included with all e-club purchases',
        color: 'bg-chart-2/10 border-chart-2/30',
        iconColor: 'text-chart-2',
    },
    {
        title: 'Premium Warranty',
        duration: '5 Years',
        description: 'For premium and signature collections',
        color: 'bg-chart-3/10 border-chart-3/30',
        iconColor: 'text-chart-3',
    },
    {
        title: 'Lifetime Frame Warranty',
        duration: 'Lifetime',
        description: 'On solid wood frames for select sofas',
        color: 'bg-primary/10 border-primary/30',
        iconColor: 'text-primary',
    },
];

const defaultCoveredItems: CoveredItem[] = [
    { text: 'Manufacturing defects in materials or workmanship' },
    { text: 'Structural failures under normal use' },
    { text: 'Hardware malfunctions (hinges, handles, locks)' },
    { text: 'Frame breakage or warping' },
    { text: 'Drawer mechanism failures' },
    { text: 'Reclining mechanism defects' },
    { text: 'Spring failures in mattresses and cushions' },
    { text: 'Peeling or bubbling of laminate surfaces' },
];

const defaultNotCoveredItems: CoveredItem[] = [
    { text: 'Normal wear and tear' },
    { text: 'Damage caused by misuse, abuse, or accidents' },
    { text: 'Damage from exposure to extreme temperatures or humidity' },
    { text: 'Stains, scratches, or cosmetic damage' },
    { text: 'Fading due to sunlight exposure' },
    { text: 'Damage from improper cleaning or chemicals' },
    { text: 'Damage during customer-arranged transportation' },
    { text: 'Products modified or repaired by unauthorized parties' },
    { text: 'Commercial or rental use of residential products' },
];

const defaultClaimSteps: ClaimStep[] = [
    {
        step: 1,
        title: 'Gather Information',
        description:
            'Collect your order number, purchase date, and photos of the defect.',
    },
    {
        step: 2,
        title: 'Contact Us',
        description:
            'Reach out via phone, email, or through your online account.',
    },
    {
        step: 3,
        title: 'Submit Claim',
        description:
            'Provide details and photos for our warranty team to review.',
    },
    {
        step: 4,
        title: 'Assessment',
        description:
            'Our team will review your claim within 3-5 business days.',
    },
    {
        step: 5,
        title: 'Resolution',
        description:
            'We will repair, replace, or refund based on the assessment.',
    },
];

const defaultFaqs: FAQ[] = [
    {
        question: 'When does my warranty start?',
        answer: 'Your warranty begins on the date of delivery to your address, not the date of purchase.',
    },
    {
        question: 'Is the warranty transferable?',
        answer: 'No, our warranty is valid only for the original purchaser and is not transferable to subsequent owners.',
    },
    {
        question: 'Do I need to register my product for warranty?',
        answer: 'Registration is not required but recommended. Registered products receive faster warranty service and exclusive offers.',
    },
    {
        question: 'What proof do I need for a warranty claim?',
        answer: 'You will need your order confirmation email or receipt showing the purchase date and product details.',
    },
    {
        question: 'Will I get a replacement or repair?',
        answer: 'We will first attempt to repair the product. If repair is not possible, we will provide a replacement or refund at our discretion.',
    },
    {
        question: 'Is there any cost for warranty service?',
        answer: 'Warranty repairs and replacements are free. However, if the issue is not covered by warranty, service charges may apply.',
    },
];

export default function Warranty({
    settings,
    categories,
    page,
    content,
}: WarrantyProps) {
    // Get content from database or use defaults
    const heroTitle = content?.hero?.title || 'Warranty Information';
    const heroSubtitle =
        content?.hero?.subtitle ||
        'We stand behind the quality of our e-club. Learn about our comprehensive warranty coverage and how to make a claim.';

    const warrantyTiers =
        (content?.warranty_tiers?.items as WarrantyTier[]) ||
        defaultWarrantyTiers;
    const coveredItems =
        (content?.covered?.items as CoveredItem[]) || defaultCoveredItems;
    const notCoveredItems =
        (content?.not_covered?.items as CoveredItem[]) ||
        defaultNotCoveredItems;
    const claimSteps =
        (content?.claim_process?.items as ClaimStep[]) || defaultClaimSteps;
    const faqs = (content?.faqs?.items as FAQ[]) || defaultFaqs;

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={page?.meta_title || 'Warranty Information'}>
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
                            Warranty Information
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
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        {heroSubtitle}
                    </p>
                </div>
            </div>

            {/* Warranty Tiers */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-2xl font-bold">
                        {content?.warranty_tiers?.title ||
                            'Our Warranty Coverage'}
                    </h2>
                    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
                        {warrantyTiers.map((tier, index) => (
                            <Card
                                key={index}
                                className={`${tier.color || 'border-accent/40 bg-accent/20'} border-2`}
                            >
                                <CardHeader className="text-center">
                                    <div
                                        className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm`}
                                    >
                                        <Shield
                                            className={`h-7 w-7 ${tier.iconColor || 'text-accent-foreground'}`}
                                        />
                                    </div>
                                    <CardTitle className="text-lg">
                                        {tier.title}
                                    </CardTitle>
                                    <CardDescription className="text-2xl font-bold text-foreground">
                                        {tier.duration}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                        {tier.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* What's Covered */}
            <div className="bg-muted py-12">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-2xl font-bold">
                        What's Covered
                    </h2>
                    <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
                        {/* Covered */}
                        <Card className="border-primary/30">
                            <CardHeader className="bg-primary/10">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-lg text-primary">
                                        {content?.covered?.title ||
                                            'Covered by Warranty'}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <ul className="space-y-3">
                                    {coveredItems.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2 text-sm"
                                        >
                                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                            <span>
                                                {typeof item === 'string'
                                                    ? item
                                                    : item.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Not Covered */}
                        <Card className="border-destructive/30">
                            <CardHeader className="bg-destructive/10">
                                <div className="flex items-center gap-3">
                                    <XCircle className="h-6 w-6 text-destructive" />
                                    <CardTitle className="text-lg text-destructive">
                                        {content?.not_covered?.title ||
                                            'Not Covered'}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <ul className="space-y-3">
                                    {notCoveredItems.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2 text-sm"
                                        >
                                            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                                            <span>
                                                {typeof item === 'string'
                                                    ? item
                                                    : item.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* How to Claim */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-2xl font-bold">
                        {content?.claim_process?.title ||
                            'How to Make a Warranty Claim'}
                    </h2>
                    <div className="mx-auto max-w-4xl">
                        <div className="grid gap-4 md:grid-cols-5">
                            {claimSteps.map((step, index) => (
                                <div
                                    key={step.step || index}
                                    className="relative text-center"
                                >
                                    {/* Connector line */}
                                    {index < claimSteps.length - 1 && (
                                        <div className="absolute top-6 left-1/2 hidden h-0.5 w-full bg-border md:block" />
                                    )}
                                    <div className="relative z-10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                                        {step.step || index + 1}
                                    </div>
                                    <h3 className="mb-1 text-sm font-semibold">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact for Claims */}
            <div className="bg-foreground py-12 text-background">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-2xl font-bold">
                        Contact Our Warranty Team
                    </h2>
                    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                                <Phone className="h-7 w-7 text-primary-foreground" />
                            </div>
                            <h3 className="mb-2 font-semibold">Call Us</h3>
                            <p className="text-sm text-background/80">
                                {settings?.contact?.phone || '+880 1234-567890'}
                            </p>
                            <p className="mt-1 text-xs text-background/70">
                                Sat-Thu, 10AM - 6PM
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                                <Mail className="h-7 w-7 text-primary-foreground" />
                            </div>
                            <h3 className="mb-2 font-semibold">Email Us</h3>
                            <p className="text-sm text-background/80">
                                warranty@
                                {settings?.general?.site_name
                                    ?.toLowerCase()
                                    .replace(/\s+/g, '') || 'e-club'}
                                .com
                            </p>
                            <p className="mt-1 text-xs text-background/70">
                                Response within 24 hours
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                                <FileText className="h-7 w-7 text-primary-foreground" />
                            </div>
                            <h3 className="mb-2 font-semibold">Online Form</h3>
                            <p className="text-sm text-background/80">
                                Submit claim through your account
                            </p>
                            <p className="mt-1 text-xs text-background/70">
                                Track claim status online
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQs */}
            {faqs.length > 0 && (
                <div className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-8 text-center text-2xl font-bold">
                            {content?.faqs?.title ||
                                'Frequently Asked Questions'}
                        </h2>
                        <div className="mx-auto max-w-3xl">
                            <Accordion
                                type="single"
                                collapsible
                                className="rounded-lg border bg-card"
                            >
                                {faqs.map((faq, index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`item-${index}`}
                                    >
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

            {/* Download Warranty Card */}
            <div className="bg-muted py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-2xl font-bold">
                        Register Your Product
                    </h2>
                    <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
                        Register your purchase to receive faster warranty
                        service and exclusive benefits.
                    </p>
                    <Link
                        href="/account"
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Register Product
                    </Link>
                </div>
            </div>
        </SiteLayout>
    );
}
