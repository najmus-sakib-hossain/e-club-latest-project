import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { SiteLayout } from '@/components/site';
import type { Category, SiteSettings } from '@/types/cms';

interface PageContentSection {
    id?: number;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    image: string | null;
    items: Record<string, unknown>[] | null;
}

interface TermsProps {
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

export default function Terms({
    settings,
    categories,
    page,
    content,
}: TermsProps) {
    const siteName = settings?.general?.site_name || 'E-Club Store';
    const contactEmail = settings?.contact?.email || 'legal@e-clubstore.com';

    // Get content from database or use defaults
    const heroTitle = content?.hero?.title || 'Terms & Conditions';
    const lastUpdated = content?.hero?.subtitle || 'December 1, 2025';
    const termsContent = content?.content?.content || null;

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={page?.meta_title || 'Terms & Conditions'}>
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
                            Terms & Conditions
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
                    <p className="text-muted-foreground">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="prose prose-lg mx-auto max-w-4xl">
                        {termsContent ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: termsContent.replace(
                                        /\n/g,
                                        '<br />',
                                    ),
                                }}
                            />
                        ) : (
                            <>
                                <p className="lead">
                                    Welcome to {siteName}. By accessing and
                                    using our website, you agree to be bound by
                                    these Terms and Conditions. Please read them
                                    carefully before making any purchases.
                                </p>

                                <h2>1. Acceptance of Terms</h2>
                                <p>
                                    By accessing this website, you confirm that
                                    you are at least 18 years old and have the
                                    legal capacity to enter into binding
                                    contracts. If you do not agree with any part
                                    of these terms, you must not use our
                                    website.
                                </p>

                                <h2>2. Products and Pricing</h2>
                                <h3>Product Information</h3>
                                <ul>
                                    <li>
                                        We strive to provide accurate product
                                        descriptions and images
                                    </li>
                                    <li>
                                        Colors may vary slightly due to monitor
                                        settings
                                    </li>
                                    <li>
                                        Dimensions are approximate and may have
                                        minor variations
                                    </li>
                                    <li>
                                        We reserve the right to modify product
                                        specifications without notice
                                    </li>
                                </ul>

                                <h3>Pricing</h3>
                                <ul>
                                    <li>
                                        All prices are in Bangladeshi Taka (BDT)
                                        and include VAT
                                    </li>
                                    <li>
                                        Prices are subject to change without
                                        notice
                                    </li>
                                    <li>
                                        Promotional prices are valid for the
                                        specified period only
                                    </li>
                                    <li>
                                        We reserve the right to correct pricing
                                        errors
                                    </li>
                                </ul>

                                <h2>3. Orders and Payment</h2>
                                <h3>Placing Orders</h3>
                                <ul>
                                    <li>
                                        Orders are subject to acceptance and
                                        availability
                                    </li>
                                    <li>
                                        We may refuse or cancel orders at our
                                        discretion
                                    </li>
                                    <li>
                                        Order confirmation does not guarantee
                                        product availability
                                    </li>
                                    <li>
                                        You must provide accurate delivery and
                                        contact information
                                    </li>
                                </ul>

                                <h3>Payment Terms</h3>
                                <ul>
                                    <li>
                                        Payment must be made in full at the time
                                        of order
                                    </li>
                                    <li>
                                        We accept cash on delivery, bKash,
                                        Nagad, and major credit cards
                                    </li>
                                    <li>
                                        Payment information is processed
                                        securely through trusted providers
                                    </li>
                                    <li>
                                        We are not liable for third-party
                                        payment processing issues
                                    </li>
                                </ul>

                                <h2>4. Delivery</h2>
                                <ul>
                                    <li>
                                        Delivery times are estimates and not
                                        guaranteed
                                    </li>
                                    <li>
                                        Delays may occur due to circumstances
                                        beyond our control
                                    </li>
                                    <li>
                                        Risk of loss passes to you upon delivery
                                    </li>
                                    <li>
                                        You must inspect products upon delivery
                                        and report any issues immediately
                                    </li>
                                    <li>
                                        Failed delivery attempts may result in
                                        additional charges
                                    </li>
                                </ul>

                                <h2>5. Returns and Refunds</h2>
                                <p>
                                    Our return policy is governed by our
                                    separate Returns & Exchanges Policy. Key
                                    points include:
                                </p>
                                <ul>
                                    <li>
                                        7-day return window for items in
                                        original condition
                                    </li>
                                    <li>
                                        Manufacturing defects reported within 30
                                        days qualify for refund
                                    </li>
                                    <li>
                                        Custom-made and personalized items
                                        cannot be returned
                                    </li>
                                    <li>
                                        Refunds are processed within 7 business
                                        days of approval
                                    </li>
                                </ul>
                                <p>
                                    Please refer to our{' '}
                                    <Link
                                        href="/returns"
                                        className="text-primary"
                                    >
                                        Returns & Exchanges
                                    </Link>{' '}
                                    page for complete details.
                                </p>

                                <h2>6. Warranty</h2>
                                <ul>
                                    <li>
                                        All products come with a 2-year warranty
                                        against manufacturing defects
                                    </li>
                                    <li>
                                        Warranty does not cover damage from
                                        misuse, accidents, or wear
                                    </li>
                                    <li>
                                        Warranty claims must include proof of
                                        purchase
                                    </li>
                                    <li>
                                        We may repair or replace defective
                                        products at our discretion
                                    </li>
                                </ul>
                                <p>
                                    See our{' '}
                                    <Link
                                        href="/warranty"
                                        className="text-primary"
                                    >
                                        Warranty Information
                                    </Link>{' '}
                                    page for complete details.
                                </p>

                                <h2>7. Intellectual Property</h2>
                                <ul>
                                    <li>
                                        All content on this website is owned by{' '}
                                        {siteName}
                                    </li>
                                    <li>
                                        You may not reproduce, distribute, or
                                        modify our content without permission
                                    </li>
                                    <li>
                                        Our trademarks and logos may not be used
                                        without authorization
                                    </li>
                                    <li>
                                        Product designs are protected by
                                        intellectual property laws
                                    </li>
                                </ul>

                                <h2>8. User Accounts</h2>
                                <ul>
                                    <li>
                                        You are responsible for maintaining
                                        account security
                                    </li>
                                    <li>
                                        You must provide accurate and current
                                        information
                                    </li>
                                    <li>
                                        You must not share your account
                                        credentials
                                    </li>
                                    <li>
                                        We may suspend or terminate accounts for
                                        violations
                                    </li>
                                </ul>

                                <h2>9. Limitation of Liability</h2>
                                <p>To the maximum extent permitted by law:</p>
                                <ul>
                                    <li>
                                        We are not liable for indirect,
                                        incidental, or consequential damages
                                    </li>
                                    <li>
                                        Our total liability is limited to the
                                        amount paid for the product
                                    </li>
                                    <li>
                                        We are not liable for third-party
                                        actions or services
                                    </li>
                                    <li>
                                        We are not liable for force majeure
                                        events
                                    </li>
                                </ul>

                                <h2>10. Dispute Resolution</h2>
                                <p>
                                    Any disputes arising from these terms or
                                    your use of our services shall be resolved
                                    through:
                                </p>
                                <ol>
                                    <li>
                                        Good faith negotiation between the
                                        parties
                                    </li>
                                    <li>Mediation if negotiation fails</li>
                                    <li>
                                        Binding arbitration in accordance with
                                        Bangladesh law
                                    </li>
                                </ol>
                                <p>
                                    These terms are governed by the laws of
                                    Bangladesh. Any legal proceedings shall be
                                    conducted in the courts of Dhaka.
                                </p>

                                <h2>11. Changes to Terms</h2>
                                <p>
                                    We reserve the right to modify these terms
                                    at any time. Changes will be effective
                                    immediately upon posting. Your continued use
                                    of the website constitutes acceptance of the
                                    modified terms.
                                </p>

                                <h2>12. Contact Information</h2>
                                <p>
                                    For questions about these Terms and
                                    Conditions, please contact us:
                                </p>
                                <ul>
                                    <li>
                                        Email:{' '}
                                        <a href={`mailto:${contactEmail}`}>
                                            {contactEmail}
                                        </a>
                                    </li>
                                    <li>
                                        Phone:{' '}
                                        {settings?.contact?.phone ||
                                            '+880 1234-567890'}
                                    </li>
                                    <li>
                                        Address:{' '}
                                        {settings?.contact?.address ||
                                            'Dhaka, Bangladesh'}
                                    </li>
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
