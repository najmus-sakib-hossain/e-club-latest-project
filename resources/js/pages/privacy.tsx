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

interface PrivacyProps {
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

export default function Privacy({ settings, categories, page, content }: PrivacyProps) {
    const siteName = settings?.general?.site_name || 'Furniture Store';
    const contactEmail = settings?.contact?.email || 'privacy@furniturestore.com';
    
    // Get content from database or use defaults
    const heroTitle = content?.hero?.title || 'Privacy Policy';
    const lastUpdated = content?.hero?.subtitle || 'December 1, 2025';
    const privacyContent = content?.content?.content || null;

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={page?.meta_title || 'Privacy Policy'}>
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
                        <span className="text-foreground font-medium">Privacy Policy</span>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="bg-primary/10 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">{heroTitle}</h1>
                    <p className="text-muted-foreground">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-lg">
                        {privacyContent ? (
                            <div dangerouslySetInnerHTML={{ __html: privacyContent.replace(/\n/g, '<br />') }} />
                        ) : (
                            <>
                                <p className="lead">
                                    At {siteName}, we are committed to protecting your privacy and ensuring the security 
                                    of your personal information. This Privacy Policy explains how we collect, use, disclose, 
                                    and safeguard your information when you visit our website or make a purchase.
                                </p>

                                <h2>1. Information We Collect</h2>
                                <h3>Personal Information</h3>
                                <p>We collect information that you voluntarily provide to us, including:</p>
                                <ul>
                                    <li>Name, email address, phone number, and shipping address</li>
                                    <li>Payment information (credit card numbers, billing address)</li>
                                    <li>Account credentials (username and password)</li>
                                    <li>Order history and preferences</li>
                                    <li>Communications with our customer service team</li>
                                </ul>

                                <h3>Automatically Collected Information</h3>
                                <p>When you visit our website, we automatically collect:</p>
                                <ul>
                                    <li>IP address and browser type</li>
                                    <li>Device information and operating system</li>
                                    <li>Pages visited and time spent on site</li>
                                    <li>Referring website or source</li>
                                    <li>Cookies and similar tracking technologies</li>
                                </ul>

                                <h2>2. How We Use Your Information</h2>
                                <p>We use the collected information to:</p>
                                <ul>
                                    <li>Process and fulfill your orders</li>
                                    <li>Send order confirmations and shipping updates</li>
                                    <li>Respond to customer service requests</li>
                                    <li>Send promotional emails (with your consent)</li>
                                    <li>Improve our website and services</li>
                                    <li>Prevent fraud and enhance security</li>
                                    <li>Comply with legal obligations</li>
                                </ul>

                                <h2>3. Information Sharing</h2>
                                <p>We do not sell your personal information. We may share your information with:</p>
                                <ul>
                                    <li><strong>Service Providers:</strong> Shipping companies, payment processors, and IT service providers</li>
                                    <li><strong>Business Partners:</strong> With your consent, for joint marketing initiatives</li>
                                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                    <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                                </ul>

                                <h2>4. Cookies and Tracking</h2>
                                <p>
                                    We use cookies and similar technologies to enhance your browsing experience, 
                                    analyze site traffic, and personalize content. You can control cookies through 
                                    your browser settings, but disabling them may affect site functionality.
                                </p>
                                <p>Types of cookies we use:</p>
                                <ul>
                                    <li><strong>Essential Cookies:</strong> Required for site functionality</li>
                                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                                    <li><strong>Marketing Cookies:</strong> Used for targeted advertising</li>
                                    <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
                                </ul>

                                <h2>5. Data Security</h2>
                                <p>
                                    We implement appropriate technical and organizational measures to protect your 
                                    personal information, including:
                                </p>
                                <ul>
                                    <li>SSL encryption for data transmission</li>
                                    <li>Secure payment processing through trusted providers</li>
                                    <li>Regular security audits and updates</li>
                                    <li>Access controls and employee training</li>
                                </ul>
                                <p>
                                    However, no method of transmission over the Internet is 100% secure, and we 
                                    cannot guarantee absolute security.
                                </p>

                                <h2>6. Your Rights</h2>
                                <p>You have the right to:</p>
                                <ul>
                                    <li>Access the personal information we hold about you</li>
                                    <li>Request correction of inaccurate information</li>
                                    <li>Request deletion of your personal information</li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Withdraw consent at any time</li>
                                </ul>
                                <p>
                                    To exercise these rights, please contact us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
                                </p>

                                <h2>7. Third-Party Links</h2>
                                <p>
                                    Our website may contain links to third-party websites. We are not responsible 
                                    for the privacy practices of these sites. We encourage you to read the privacy 
                                    policies of any third-party sites you visit.
                                </p>

                                <h2>8. Children's Privacy</h2>
                                <p>
                                    Our services are not intended for children under 18 years of age. We do not 
                                    knowingly collect personal information from children. If you believe we have 
                                    collected information from a child, please contact us immediately.
                                </p>

                                <h2>9. Changes to This Policy</h2>
                                <p>
                                    We may update this Privacy Policy from time to time. Changes will be posted 
                                    on this page with an updated revision date. We encourage you to review this 
                                    policy periodically.
                                </p>

                                <h2>10. Contact Us</h2>
                                <p>
                                    If you have questions about this Privacy Policy or our data practices, 
                                    please contact us at:
                                </p>
                                <ul>
                                    <li>Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
                                    <li>Phone: {settings?.contact?.phone || '+880 1234-567890'}</li>
                                    <li>Address: {settings?.contact?.address || 'Dhaka, Bangladesh'}</li>
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
