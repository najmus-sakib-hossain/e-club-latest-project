import type { SiteSettings } from '@/types/cms';
import { Link } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Youtube,
} from 'lucide-react';

interface SiteFooterProps {
    settings?: SiteSettings;
}

export function SiteFooter({ settings }: SiteFooterProps) {
    const currentYear = new Date().getFullYear();

    // Helper to get setting values from nested structure
    const getSetting = (
        group: string,
        key: string,
        fallback: any = '',
    ): any => {
        const groupSettings = settings?.[group];
        if (groupSettings && typeof groupSettings === 'object') {
            return (groupSettings[key] as any) ?? fallback;
        }
        return fallback;
    };

    const defaultPaymentMethods = [
        { id: 'visa', name: 'VISA', logo: '/company/visa.png' },
        {
            id: 'mastercard',
            name: 'Mastercard',
            logo: '/company/mastercard.png',
        },
        { id: 'amex', name: 'American Express', logo: '/company/amex.png' },
        { id: 'bkash', name: 'bKash', logo: '/company/bkash.png' },
        { id: 'nagad', name: 'Nagad', logo: '/company/nagad.png' },
    ];

    const normalizeLogo = (logo: string) => {
        if (!logo) return '';
        if (logo.startsWith('http')) return logo;
        if (logo.startsWith('/')) return logo;
        return `/storage/${logo}`;
    };

    const parsePaymentMethods = (value: unknown) => {
        if (Array.isArray(value)) {
            const parsed = value
                .map((item, index) => {
                    if (!item || typeof item !== 'object') return null;
                    const method = item as {
                        id?: string;
                        name?: string;
                        logo?: string;
                    };
                    const fallback = defaultPaymentMethods[index];
                    const name = method.name || fallback?.name || '';
                    const logo = normalizeLogo(
                        method.logo || fallback?.logo || '',
                    );
                    if (!name || !logo) return null;
                    return {
                        id: method.id || fallback?.id || `payment-${index}`,
                        name,
                        logo,
                    };
                })
                .filter(Boolean) as {
                id: string;
                name: string;
                logo: string;
            }[];
            return parsed.length ? parsed : defaultPaymentMethods;
        }

        if (typeof value === 'string' && value.trim()) {
            try {
                const parsed = JSON.parse(value);
                return parsePaymentMethods(parsed);
            } catch (_) {
                return defaultPaymentMethods;
            }
        }

        return defaultPaymentMethods;
    };

    // Get values from settings
    const siteName = getSetting('general', 'site_name', 'E-Club Store');
    const siteLogo = getSetting('general', 'site_logo', '');
    const logoSrc = siteLogo ? `/storage/${siteLogo}` : '/logo.png';
    const siteDescription = getSetting(
        'general',
        'site_description',
        'Premium quality e-club for your home and office. We bring comfort and style to your living spaces.',
    );
    const contactPhone =
        getSetting('contact', 'contact_phone') ||
        getSetting('contact', 'phone', '+880 1234-567890');
    const contactEmail =
        getSetting('contact', 'contact_email') ||
        getSetting('contact', 'email', 'info@e-clubstore.com');
    const contactAddress =
        getSetting('contact', 'contact_address') ||
        getSetting('contact', 'address', 'Dhaka, Bangladesh');
    const socialFacebook =
        getSetting('social', 'social_facebook') ||
        getSetting('social', 'facebook');
    const socialInstagram =
        getSetting('social', 'social_instagram') ||
        getSetting('social', 'instagram');
    const socialLinkedin =
        getSetting('social', 'social_linkedin') ||
        getSetting('social', 'linkedin');
    const socialYoutube =
        getSetting('social', 'social_youtube') ||
        getSetting('social', 'youtube');
    // Footer copyright section settings
    const copyrightLeftText =
        getSetting('footer', 'footer_copyright_left_text') ||
        getSetting(
            'footer',
            'copyright_left_text',
            '© 2025 Nex Real Estate. All rights reserved.',
        );
    const copyrightLeftLinkText =
        getSetting('footer', 'footer_copyright_left_link_text') ||
        getSetting('footer', 'copyright_left_link_text', 'Nex Real Estate');
    const copyrightLeftLinkUrl =
        getSetting('footer', 'footer_copyright_left_link_url') ||
        getSetting(
            'footer',
            'copyright_left_link_url',
            'https://realstate.nexgroup.biz',
        );
    const copyrightRightText =
        getSetting('footer', 'footer_copyright_right_text') ||
        getSetting(
            'footer',
            'copyright_right_text',
            'Developed and maintained by',
        );
    const copyrightRightLinkText =
        getSetting('footer', 'footer_copyright_right_link_text') ||
        getSetting('footer', 'copyright_right_link_text', 'Alphainno');
    const copyrightRightLinkUrl =
        getSetting('footer', 'footer_copyright_right_link_url') ||
        getSetting(
            'footer',
            'copyright_right_link_url',
            'https://alphainno.com',
        );

    // Footer section titles from settings (keys match admin settings)
    const followUsTitle =
        getSetting('footer', 'footer_follow_us_title') ||
        getSetting('footer', 'follow_us_title', 'Follow Us');
    const quickLinksTitle =
        getSetting('footer', 'footer_quick_links_title') ||
        getSetting('footer', 'quick_links_title', 'Quick Links');
    const customerServiceTitle =
        getSetting('footer', 'footer_customer_service_title') ||
        getSetting('footer', 'customer_service_title', 'Customer Service');
    const informationTitle =
        getSetting('footer', 'footer_information_title') ||
        getSetting('footer', 'information_title', 'Information');
    const paymentTitle =
        getSetting('footer', 'footer_payment_title') ||
        getSetting('footer', 'payment_title', 'Secure Payment Methods');

    // Footer link labels from settings
    const linkHome =
        getSetting('footer', 'footer_link_home') ||
        getSetting('footer', 'link_home', 'Home');
    const linkProducts =
        getSetting('footer', 'footer_link_products') ||
        getSetting('footer', 'link_products', 'All Products');
    const linkCategories =
        getSetting('footer', 'footer_link_categories') ||
        getSetting('footer', 'link_categories', 'Categories');
    const linkAbout =
        getSetting('footer', 'footer_link_about') ||
        getSetting('footer', 'link_about', 'About Us');
    const linkContact =
        getSetting('footer', 'footer_link_contact') ||
        getSetting('footer', 'link_contact', 'Contact Us');
    const linkHelp =
        getSetting('footer', 'footer_link_help') ||
        getSetting('footer', 'link_help', 'Help Center');
    const linkAccount =
        getSetting('footer', 'footer_link_account') ||
        getSetting('footer', 'link_account', 'My Account');
    const linkOrderTracking =
        getSetting('footer', 'footer_link_order_tracking') ||
        getSetting('footer', 'link_order_tracking', 'Order Tracking');
    const linkWishlist =
        getSetting('footer', 'footer_link_wishlist') ||
        getSetting('footer', 'link_wishlist', 'Wishlist');
    const linkShipping =
        getSetting('footer', 'footer_link_shipping') ||
        getSetting('footer', 'link_shipping', 'Shipping Policy');
    const linkReturns =
        getSetting('footer', 'footer_link_returns') ||
        getSetting('footer', 'link_returns', 'Returns & Exchanges');
    const linkFaqs =
        getSetting('footer', 'footer_link_faqs') ||
        getSetting('footer', 'link_faqs', 'FAQs');
    const linkPrivacy =
        getSetting('footer', 'footer_link_privacy') ||
        getSetting('footer', 'link_privacy', 'Privacy Policy');
    const linkTerms =
        getSetting('footer', 'footer_link_terms') ||
        getSetting('footer', 'link_terms', 'Terms & Conditions');
    const linkWarranty =
        getSetting('footer', 'footer_link_warranty') ||
        getSetting('footer', 'link_warranty', 'Warranty Information');
    const linkCare =
        getSetting('footer', 'footer_link_care') ||
        getSetting('footer', 'link_care', 'Care & Maintenance');
    const linkStores =
        getSetting('footer', 'footer_link_stores') ||
        getSetting('footer', 'link_stores', 'Store Locator');

    // Link URLs from settings
    const linkHomeUrl = getSetting('footer', 'footer_link_home_url', '/');
    const linkProductsUrl = getSetting(
        'footer',
        'footer_link_products_url',
        '/products',
    );
    const linkCategoriesUrl = getSetting(
        'footer',
        'footer_link_categories_url',
        '/categories',
    );
    const linkAboutUrl = getSetting(
        'footer',
        'footer_link_about_url',
        '/about',
    );
    const linkContactUrl = getSetting(
        'footer',
        'footer_link_contact_url',
        '/contact',
    );
    const linkHelpUrl = getSetting('footer', 'footer_link_help_url', '/help');
    const linkAccountUrl = getSetting(
        'footer',
        'footer_link_account_url',
        '/account',
    );
    const linkOrderTrackingUrl = getSetting(
        'footer',
        'footer_link_order_tracking_url',
        '/account/orders',
    );
    const linkWishlistUrl = getSetting(
        'footer',
        'footer_link_wishlist_url',
        '/account/wishlist',
    );
    const linkShippingUrl = getSetting(
        'footer',
        'footer_link_shipping_url',
        '/shipping',
    );
    const linkReturnsUrl = getSetting(
        'footer',
        'footer_link_returns_url',
        '/returns',
    );
    const linkFaqsUrl = getSetting('footer', 'footer_link_faqs_url', '/faqs');
    const linkPrivacyUrl = getSetting(
        'footer',
        'footer_link_privacy_url',
        '/privacy',
    );
    const linkTermsUrl = getSetting(
        'footer',
        'footer_link_terms_url',
        '/terms',
    );
    const linkWarrantyUrl = getSetting(
        'footer',
        'footer_link_warranty_url',
        '/warranty',
    );
    const linkCareUrl = getSetting('footer', 'footer_link_care_url', '/care');
    const linkStoresUrl = getSetting(
        'footer',
        'footer_link_stores_url',
        '/stores',
    );

    // Visibility toggles
    const showQuickLinks =
        getSetting('footer', 'footer_show_quick_links', '1') !== '0';
    const showCustomerService =
        getSetting('footer', 'footer_show_customer_service', '1') !== '0';
    const showInformation =
        getSetting('footer', 'footer_show_information', '1') !== '0';
    const showPaymentMethods =
        getSetting('footer', 'footer_show_payment_methods', '1') !== '0';
    const showSocialLinks =
        getSetting('footer', 'footer_show_social_links', '1') !== '0';

    const paymentMethodsSetting = getSetting(
        'footer',
        'footer_payment_methods',
        defaultPaymentMethods,
    );
    const paymentMethods = parsePaymentMethods(paymentMethodsSetting);

    return (
        <footer className="border-t bg-background">
            {/* Main Footer Content */}
            <div className="bg-secondary py-12 text-secondary-foreground">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        {/* Company Info */}
                        <div>
                            <Link href="/" className="mb-4 inline-block">
                                <img
                                    src={logoSrc}
                                    alt={siteName}
                                    className="h-10"
                                />
                            </Link>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {siteDescription}
                            </p>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    {contactPhone}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    {contactEmail}
                                </p>
                                <p className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                                    <span>{contactAddress}</span>
                                </p>
                            </div>
                            {/* Social Links */}
                            {showSocialLinks && (
                                <div className="mt-4">
                                    <p className="mb-3 text-sm font-semibold text-secondary-foreground">
                                        {followUsTitle}
                                    </p>
                                    <div className="flex gap-3">
                                        {socialFacebook && (
                                            <a
                                                href={socialFacebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground transition-colors hover:text-primary"
                                            >
                                                <Facebook className="h-5 w-5" />
                                            </a>
                                        )}
                                        {socialInstagram && (
                                            <a
                                                href={socialInstagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground transition-colors hover:text-primary"
                                            >
                                                <Instagram className="h-5 w-5" />
                                            </a>
                                        )}
                                        {socialLinkedin && (
                                            <a
                                                href={socialLinkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground transition-colors hover:text-primary"
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        )}
                                        {socialYoutube && (
                                            <a
                                                href={socialYoutube}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground transition-colors hover:text-primary"
                                            >
                                                <Youtube className="h-5 w-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        {showQuickLinks && (
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    {quickLinksTitle}
                                </h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <Link
                                            href={linkHomeUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkHome}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkProductsUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkProducts}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkCategoriesUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkCategories}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkAboutUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkAbout}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkContactUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkContact}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkHelpUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkHelp}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Customer Service */}
                        {showCustomerService && (
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    {customerServiceTitle}
                                </h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <Link
                                            href={linkAccountUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkAccount}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkOrderTrackingUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkOrderTracking}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkWishlistUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkWishlist}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkShippingUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkShipping}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkReturnsUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkReturns}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkFaqsUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkFaqs}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Policies */}
                        {showInformation && (
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    {informationTitle}
                                </h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <Link
                                            href={linkPrivacyUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkPrivacy}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkTermsUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkTerms}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkWarrantyUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkWarranty}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkCareUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkCare}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={linkStoresUrl}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {linkStores}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            {showPaymentMethods && (
                <div className="bg-secondary py-6">
                    <div className="container mx-auto px-4">
                        <div className="mb-4 text-center">
                            <p className="mb-4 font-semibold text-secondary-foreground">
                                {paymentTitle}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className="flex h-10 w-14 items-center justify-center rounded bg-card p-2 text-card-foreground"
                                    title={method.name}
                                >
                                    <img
                                        src={method.logo}
                                        alt={method.name}
                                        className="max-h-6 max-w-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                'none';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Copyright */}
            <div className="border-t border-border bg-secondary py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground lg:flex-row">
                        {/* Left: Copyright with Nex Real Estate link */}
                        <p className="text-center lg:text-left">
                            {copyrightLeftText.includes(
                                copyrightLeftLinkText,
                            ) ? (
                                <>
                                    {
                                        copyrightLeftText.split(
                                            copyrightLeftLinkText,
                                        )[0]
                                    }
                                    <a
                                        href={copyrightLeftLinkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline underline-offset-2 transition-colors hover:text-primary"
                                    >
                                        {copyrightLeftLinkText}
                                    </a>
                                    {
                                        copyrightLeftText.split(
                                            copyrightLeftLinkText,
                                        )[1]
                                    }
                                </>
                            ) : (
                                copyrightLeftText
                            )}
                        </p>
                        {/* Right: Developed by Alphainno */}
                        <p className="text-center lg:text-right">
                            {copyrightRightText}{' '}
                            <a
                                href={copyrightRightLinkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-2 transition-colors hover:text-primary"
                            >
                                {copyrightRightLinkText}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
