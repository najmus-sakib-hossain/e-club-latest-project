import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import {
    Clock,
    Copyright,
    Eye,
    Facebook,
    Image,
    Instagram,
    LayoutGrid,
    Link,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Plus,
    Store,
    Trash2,
    Twitter,
    Upload,
    Youtube,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AdminPageLayout from '@/layouts/admin-page-layout';
import { toast } from 'sonner';

interface PaymentMethod {
    id?: string;
    name: string;
    logo: string;
    file?: File | null;
}

interface SiteSettings {
    site_name?: string;
    site_logo?: string;
    site_tagline?: string;
    site_description?: string;
    footer_about?: string;
    footer_text?: string;
    footer_copyright?: string;
    // New copyright section settings
    footer_copyright_left_text?: string;
    footer_copyright_left_link_text?: string;
    footer_copyright_left_link_url?: string;
    footer_copyright_right_text?: string;
    footer_copyright_right_link_text?: string;
    footer_copyright_right_link_url?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    contact_hours?: string;
    phone?: string;
    email?: string;
    address?: string;
    social_facebook?: string;
    social_instagram?: string;
    social_twitter?: string;
    social_linkedin?: string;
    social_youtube?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    // Section titles
    footer_follow_us_title?: string;
    footer_quick_links_title?: string;
    footer_customer_service_title?: string;
    footer_information_title?: string;
    footer_payment_title?: string;
    footer_payment_methods?: PaymentMethod[] | string;
    // Visibility toggles
    footer_show_quick_links?: boolean;
    footer_show_customer_service?: boolean;
    footer_show_information?: boolean;
    footer_show_payment_methods?: boolean;
    footer_show_social_links?: boolean;
    // Quick Links labels
    footer_link_home?: string;
    footer_link_products?: string;
    footer_link_categories?: string;
    footer_link_about?: string;
    footer_link_contact?: string;
    footer_link_help?: string;
    // Quick Links URLs
    footer_link_home_url?: string;
    footer_link_products_url?: string;
    footer_link_categories_url?: string;
    footer_link_about_url?: string;
    footer_link_contact_url?: string;
    footer_link_help_url?: string;
    // Customer Service labels
    footer_link_account?: string;
    footer_link_order_tracking?: string;
    footer_link_wishlist?: string;
    footer_link_shipping?: string;
    footer_link_returns?: string;
    footer_link_faqs?: string;
    // Customer Service URLs
    footer_link_account_url?: string;
    footer_link_order_tracking_url?: string;
    footer_link_wishlist_url?: string;
    footer_link_shipping_url?: string;
    footer_link_returns_url?: string;
    footer_link_faqs_url?: string;
    // Information labels
    footer_link_privacy?: string;
    footer_link_terms?: string;
    footer_link_warranty?: string;
    footer_link_care?: string;
    footer_link_stores?: string;
    // Information URLs
    footer_link_privacy_url?: string;
    footer_link_terms_url?: string;
    footer_link_warranty_url?: string;
    footer_link_care_url?: string;
    footer_link_stores_url?: string;
}

interface Props {
    settings: SiteSettings;
}

const footerSchema = z.object({
    // Company Info
    site_name: z.string().min(1, 'Site name is required'),
    site_tagline: z.string().optional(),
    site_description: z.string().optional(),
    footer_about: z.string().optional(),
    footer_text: z.string().optional(),
    footer_copyright: z.string().optional(),
    // Copyright section settings
    footer_copyright_left_text: z.string().optional(),
    footer_copyright_left_link_text: z.string().optional(),
    footer_copyright_left_link_url: z.string().optional(),
    footer_copyright_right_text: z.string().optional(),
    footer_copyright_right_link_text: z.string().optional(),
    footer_copyright_right_link_url: z.string().optional(),
    // Contact Info
    contact_email: z.string().email().optional().or(z.literal('')),
    contact_phone: z.string().optional(),
    contact_address: z.string().optional(),
    contact_hours: z.string().optional(),
    // Social Links
    social_facebook: z.string().url().optional().or(z.literal('')),
    social_instagram: z.string().url().optional().or(z.literal('')),
    social_twitter: z.string().url().optional().or(z.literal('')),
    social_linkedin: z.string().url().optional().or(z.literal('')),
    social_youtube: z.string().url().optional().or(z.literal('')),
    // Section Titles
    footer_follow_us_title: z.string().optional(),
    footer_quick_links_title: z.string().optional(),
    footer_customer_service_title: z.string().optional(),
    footer_information_title: z.string().optional(),
    footer_payment_title: z.string().optional(),
    // Visibility Toggles
    footer_show_quick_links: z.boolean().optional(),
    footer_show_customer_service: z.boolean().optional(),
    footer_show_information: z.boolean().optional(),
    footer_show_payment_methods: z.boolean().optional(),
    footer_show_social_links: z.boolean().optional(),
    // Quick Links Labels
    footer_link_home: z.string().optional(),
    footer_link_products: z.string().optional(),
    footer_link_categories: z.string().optional(),
    footer_link_about: z.string().optional(),
    footer_link_contact: z.string().optional(),
    footer_link_help: z.string().optional(),
    // Quick Links URLs
    footer_link_home_url: z.string().optional(),
    footer_link_products_url: z.string().optional(),
    footer_link_categories_url: z.string().optional(),
    footer_link_about_url: z.string().optional(),
    footer_link_contact_url: z.string().optional(),
    footer_link_help_url: z.string().optional(),
    // Customer Service Labels
    footer_link_account: z.string().optional(),
    footer_link_order_tracking: z.string().optional(),
    footer_link_wishlist: z.string().optional(),
    footer_link_shipping: z.string().optional(),
    footer_link_returns: z.string().optional(),
    footer_link_faqs: z.string().optional(),
    // Customer Service URLs
    footer_link_account_url: z.string().optional(),
    footer_link_order_tracking_url: z.string().optional(),
    footer_link_wishlist_url: z.string().optional(),
    footer_link_shipping_url: z.string().optional(),
    footer_link_returns_url: z.string().optional(),
    footer_link_faqs_url: z.string().optional(),
    // Information Labels
    footer_link_privacy: z.string().optional(),
    footer_link_terms: z.string().optional(),
    footer_link_warranty: z.string().optional(),
    footer_link_care: z.string().optional(),
    footer_link_stores: z.string().optional(),
    // Information URLs
    footer_link_privacy_url: z.string().optional(),
    footer_link_terms_url: z.string().optional(),
    footer_link_warranty_url: z.string().optional(),
    footer_link_care_url: z.string().optional(),
    footer_link_stores_url: z.string().optional(),
});

type FooterFormValues = z.infer<typeof footerSchema>;

export default function FooterSettings({ settings }: Props) {
    const [logoPreview, setLogoPreview] = useState<string | null>(
        settings.site_logo ? `/storage/${settings.site_logo}` : '/logo.png',
    );
    const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const defaultPaymentMethods: PaymentMethod[] = [
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

    const parsePaymentMethods = (
        value: PaymentMethod[] | string | undefined | null,
    ): PaymentMethod[] => {
        if (Array.isArray(value)) {
            const parsed = value
                .map((item, index) => {
                    if (!item || typeof item !== 'object') return null;
                    const fallback = defaultPaymentMethods[index];
                    const name = item.name || fallback?.name || '';
                    const logo = normalizeLogo(
                        item.logo || fallback?.logo || '',
                    );
                    if (!name || !logo) return null;
                    return {
                        id: item.id || fallback?.id || `payment-${index}`,
                        name,
                        logo,
                        file: null,
                    };
                })
                .filter(Boolean) as PaymentMethod[];

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

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
        parsePaymentMethods(settings.footer_payment_methods),
    );

    const toBool = (value: unknown, defaultValue = true) => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') return value === '1';
        return defaultValue;
    };

    useEffect(() => {
        setLogoPreview(
            settings.site_logo ? `/storage/${settings.site_logo}` : '/logo.png',
        );
    }, [settings.site_logo]);

    useEffect(() => {
        setPaymentMethods(parsePaymentMethods(settings.footer_payment_methods));
    }, [settings.footer_payment_methods]);

    const form = useForm<FooterFormValues>({
        resolver: zodResolver(footerSchema),
        defaultValues: {
            // Company Info
            site_name: settings.site_name || 'E-Club Store',
            site_tagline:
                settings.site_tagline || 'Quality E-Club for Modern Living',
            footer_about:
                settings.footer_about ||
                'Premium quality e-club for your home and office. We bring comfort and style to your living spaces.',
            footer_text:
                settings.footer_text ||
                'Your trusted source for quality e-club. We offer a wide range of modern and classic e-club for every room in your home.',
            footer_copyright:
                settings.footer_copyright ||
                `© ${new Date().getFullYear()} ${settings.site_name || 'E-Club Store'}. All rights reserved.`,
            // Copyright section settings
            footer_copyright_left_text:
                settings.footer_copyright_left_text ||
                '© 2025 Nex Real Estate. All rights reserved.',
            footer_copyright_left_link_text:
                settings.footer_copyright_left_link_text || 'Nex Real Estate',
            footer_copyright_left_link_url:
                settings.footer_copyright_left_link_url ||
                'https://realstate.nexgroup.biz',
            footer_copyright_right_text:
                settings.footer_copyright_right_text ||
                'Developed and maintained by',
            footer_copyright_right_link_text:
                settings.footer_copyright_right_link_text || 'Alphainno',
            footer_copyright_right_link_url:
                settings.footer_copyright_right_link_url ||
                'https://alphainno.com',
            // Contact Info
            contact_email:
                settings.contact_email ||
                settings.email ||
                'info@e-clubstore.com',
            contact_phone:
                settings.contact_phone || settings.phone || '+880 1234-567890',
            contact_address:
                settings.contact_address ||
                settings.address ||
                'Dhaka, Bangladesh',
            contact_hours:
                settings.contact_hours || 'Sat - Thu: 10:00 AM - 8:00 PM',
            // Social Links
            social_facebook:
                settings.social_facebook || settings.facebook || '',
            social_instagram:
                settings.social_instagram || settings.instagram || '',
            social_twitter: settings.social_twitter || settings.twitter || '',
            social_linkedin:
                settings.social_linkedin || settings.linkedin || '',
            social_youtube: settings.social_youtube || settings.youtube || '',
            // Section Titles
            footer_follow_us_title:
                settings.footer_follow_us_title || 'Follow Us',
            footer_quick_links_title:
                settings.footer_quick_links_title || 'Quick Links',
            footer_customer_service_title:
                settings.footer_customer_service_title || 'Customer Service',
            footer_information_title:
                settings.footer_information_title || 'Information',
            footer_payment_title:
                settings.footer_payment_title || 'Secure Payment Methods',
            // Quick Links Labels
            footer_link_home: settings.footer_link_home || 'Home',
            footer_link_products:
                settings.footer_link_products || 'All Products',
            footer_link_categories:
                settings.footer_link_categories || 'Categories',
            footer_link_about: settings.footer_link_about || 'About Us',
            footer_link_contact: settings.footer_link_contact || 'Contact Us',
            footer_link_help: settings.footer_link_help || 'Help Center',
            // Customer Service Labels
            footer_link_account: settings.footer_link_account || 'My Account',
            footer_link_order_tracking:
                settings.footer_link_order_tracking || 'Order Tracking',
            footer_link_wishlist: settings.footer_link_wishlist || 'Wishlist',
            footer_link_shipping:
                settings.footer_link_shipping || 'Shipping Policy',
            footer_link_returns:
                settings.footer_link_returns || 'Returns & Exchanges',
            footer_link_faqs: settings.footer_link_faqs || 'FAQs',
            // Information Labels
            footer_link_privacy:
                settings.footer_link_privacy || 'Privacy Policy',
            footer_link_terms:
                settings.footer_link_terms || 'Terms & Conditions',
            footer_link_warranty:
                settings.footer_link_warranty || 'Warranty Information',
            footer_link_care: settings.footer_link_care || 'Care & Maintenance',
            footer_link_stores: settings.footer_link_stores || 'Store Locator',
            // Site Description
            site_description:
                settings.site_description ||
                'Premium quality e-club for your home and office.',
            // Visibility Toggles
            footer_show_quick_links: toBool(settings.footer_show_quick_links),
            footer_show_customer_service: toBool(
                settings.footer_show_customer_service,
            ),
            footer_show_information: toBool(settings.footer_show_information),
            footer_show_payment_methods: toBool(
                settings.footer_show_payment_methods,
            ),
            footer_show_social_links: toBool(settings.footer_show_social_links),
            // Quick Links URLs
            footer_link_home_url: settings.footer_link_home_url || '/',
            footer_link_products_url:
                settings.footer_link_products_url || '/products',
            footer_link_categories_url:
                settings.footer_link_categories_url || '/categories',
            footer_link_about_url: settings.footer_link_about_url || '/about',
            footer_link_contact_url:
                settings.footer_link_contact_url || '/contact',
            footer_link_help_url: settings.footer_link_help_url || '/help',
            // Customer Service URLs
            footer_link_account_url:
                settings.footer_link_account_url || '/account',
            footer_link_order_tracking_url:
                settings.footer_link_order_tracking_url || '/account/orders',
            footer_link_wishlist_url:
                settings.footer_link_wishlist_url || '/account/wishlist',
            footer_link_shipping_url:
                settings.footer_link_shipping_url || '/shipping',
            footer_link_returns_url:
                settings.footer_link_returns_url || '/returns',
            footer_link_faqs_url: settings.footer_link_faqs_url || '/faqs',
            // Information URLs
            footer_link_privacy_url:
                settings.footer_link_privacy_url || '/privacy',
            footer_link_terms_url: settings.footer_link_terms_url || '/terms',
            footer_link_warranty_url:
                settings.footer_link_warranty_url || '/warranty',
            footer_link_care_url: settings.footer_link_care_url || '/care',
            footer_link_stores_url:
                settings.footer_link_stores_url || '/stores',
        },
    });

    const onSubmit = (values: FooterFormValues) => {
        const formData = new FormData();
        formData.append('section', 'footer');

        Object.entries(values).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        if (selectedLogo) {
            formData.append('site_logo', selectedLogo);
        }

        const methodsForSave = paymentMethods.map(({ file, ...rest }) => rest);
        formData.append(
            'footer_payment_methods',
            JSON.stringify(methodsForSave),
        );

        paymentMethods.forEach((method, index) => {
            if (method.file instanceof File) {
                formData.append(
                    `footer_payment_methods_file_${index}`,
                    method.file,
                );
            }
        });

        router.post('/admin/settings', formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Footer settings saved successfully');
                setSelectedLogo(null);
            },
            onError: () => {
                toast.error('Failed to save footer settings');
            },
        });
    };

    const handlePaymentMethodChange = (
        index: number,
        field: 'name' | 'logo',
        value: string,
    ) => {
        setPaymentMethods((prev) =>
            prev.map((method, i) =>
                i === index ? { ...method, [field]: value } : method,
            ),
        );
    };

    const handlePaymentFileChange = (index: number, file?: File) => {
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setPaymentMethods((prev) =>
            prev.map((method, i) =>
                i === index ? { ...method, file, logo: preview } : method,
            ),
        );
    };

    const addPaymentMethod = () => {
        setPaymentMethods((prev) => [
            ...prev,
            {
                id: `payment-${prev.length}`,
                name: 'New Method',
                logo: '',
                file: null,
            },
        ]);
    };

    const removePaymentMethod = (index: number) => {
        setPaymentMethods((prev) => prev.filter((_, i) => i !== index));
    };

    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AdminPageLayout>
            <Head title="Footer Settings" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">
                        Footer Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Customize your website footer content, links, contact
                        info, and social media
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="space-y-6"
                >
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <Tabs defaultValue="company" className="space-y-6">
                                <TabsList className="flex h-auto flex-wrap gap-1">
                                    <TabsTrigger value="company">
                                        Company Info
                                    </TabsTrigger>
                                    <TabsTrigger value="contact">
                                        Contact
                                    </TabsTrigger>
                                    <TabsTrigger value="social">
                                        Social Media
                                    </TabsTrigger>
                                    <TabsTrigger value="sections">
                                        Section Titles
                                    </TabsTrigger>
                                    <TabsTrigger value="visibility">
                                        Visibility
                                    </TabsTrigger>
                                    <TabsTrigger value="payments">
                                        Payment Methods
                                    </TabsTrigger>
                                    <TabsTrigger value="quick-links">
                                        Quick Links
                                    </TabsTrigger>
                                    <TabsTrigger value="customer-service">
                                        Customer Service
                                    </TabsTrigger>
                                    <TabsTrigger value="information">
                                        Information
                                    </TabsTrigger>
                                </TabsList>

                                {/* Company Information Tab */}
                                <TabsContent value="company">
                                    <div className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Store className="h-5 w-5" />
                                                    Company Information
                                                </CardTitle>
                                                <CardDescription>
                                                    Your store name and
                                                    description shown in the
                                                    footer
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="site_name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Store Name
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Your E-Club Store"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="site_tagline"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Tagline
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Quality E-Club for Modern Living"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                A short tagline
                                                                describing your
                                                                business
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="footer_about"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                About Us
                                                                (Footer)
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="We provide premium quality e-club with exceptional craftsmanship..."
                                                                    rows={4}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                A brief
                                                                description
                                                                about your
                                                                company shown in
                                                                the footer
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Separator />

                                                {/* Copyright Section - Left Side */}
                                                <div className="space-y-4">
                                                    <h4 className="flex items-center gap-2 font-medium">
                                                        <Copyright className="h-4 w-4" />
                                                        Footer Copyright Section
                                                        (Left)
                                                    </h4>
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_copyright_left_text"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Copyright
                                                                    Text (Left
                                                                    Side)
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="© 2025 Nex Real Estate. All rights reserved."
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    The
                                                                    copyright
                                                                    notice
                                                                    displayed on
                                                                    the left
                                                                    side of the
                                                                    footer
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name="footer_copyright_left_link_text"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Link
                                                                        Text
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Nex Real Estate"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormDescription>
                                                                        Text
                                                                        that
                                                                        will be
                                                                        linked
                                                                        (must
                                                                        appear
                                                                        in
                                                                        copyright
                                                                        text)
                                                                    </FormDescription>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name="footer_copyright_left_link_url"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Link URL
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <Link className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                                            <Input
                                                                                className="pl-9"
                                                                                placeholder="https://realstate.nexgroup.biz"
                                                                                {...field}
                                                                            />
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                <Separator />

                                                {/* Copyright Section - Right Side */}
                                                <div className="space-y-4">
                                                    <h4 className="flex items-center gap-2 font-medium">
                                                        <Copyright className="h-4 w-4" />
                                                        Footer Copyright Section
                                                        (Right)
                                                    </h4>
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_copyright_right_text"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Developer
                                                                    Attribution
                                                                    Text
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Developed and maintained by"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    Text shown
                                                                    before the
                                                                    developer
                                                                    link on the
                                                                    right side
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name="footer_copyright_right_link_text"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Developer
                                                                        Name
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Alphainno"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name="footer_copyright_right_link_url"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Developer
                                                                        URL
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <Link className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                                            <Input
                                                                                className="pl-9"
                                                                                placeholder="https://alphainno.com"
                                                                                {...field}
                                                                            />
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Upload className="h-5 w-5" />
                                                    Logo
                                                </CardTitle>
                                                <CardDescription>
                                                    Upload or replace the footer
                                                    logo
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded border bg-muted/50">
                                                        {logoPreview ? (
                                                            <img
                                                                src={
                                                                    logoPreview
                                                                }
                                                                alt="Logo preview"
                                                                className="h-full w-full object-contain"
                                                            />
                                                        ) : (
                                                            <Image className="h-6 w-6 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <input
                                                            ref={logoInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={
                                                                handleLogoChange
                                                            }
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                logoInputRef.current?.click()
                                                            }
                                                        >
                                                            <Upload className="mr-2 h-4 w-4" />
                                                            Upload Logo
                                                        </Button>
                                                        <p className="text-xs text-muted-foreground">
                                                            PNG or JPG, max 2MB
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                {/* Contact Information Tab */}
                                <TabsContent value="contact">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Phone className="h-5 w-5" />
                                                Contact Information
                                            </CardTitle>
                                            <CardDescription>
                                                Your business contact details
                                                displayed in the footer
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="contact_phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Phone Number
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                                    <Input
                                                                        className="pl-9"
                                                                        placeholder="+880 1XXX-XXXXXX"
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="contact_email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Email Address
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                                    <Input
                                                                        className="pl-9"
                                                                        placeholder="info@e-club.com"
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="contact_address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Business Address
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <MapPin className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                                                                <Textarea
                                                                    className="pl-9"
                                                                    placeholder="123 E-Club Street, Dhaka, Bangladesh"
                                                                    rows={2}
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="contact_hours"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Business Hours
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Clock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                                <Input
                                                                    className="pl-9"
                                                                    placeholder="Sat - Thu: 10:00 AM - 8:00 PM"
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Social Media Tab */}
                                <TabsContent value="social">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Facebook className="h-5 w-5" />
                                                Social Media Links
                                            </CardTitle>
                                            <CardDescription>
                                                Add your social media profile
                                                links to display in the footer
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="social_facebook"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Facebook
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Facebook className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                                    <Input
                                                                        className="pl-9"
                                                                        placeholder="https://facebook.com/yourpage"
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="social_instagram"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Instagram
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Instagram className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                                    <Input
                                                                        className="pl-9"
                                                                        placeholder="https://instagram.com/yourpage"
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="social_twitter"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Twitter / X
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Twitter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                                    <Input
                                                                        className="pl-9"
                                                                        placeholder="https://twitter.com/yourpage"
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="social_linkedin"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                LinkedIn
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Linkedin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                                    <Input
                                                                        className="pl-9"
                                                                        placeholder="https://linkedin.com/company/yourcompany"
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="social_youtube"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                YouTube
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Youtube className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                                    <Input
                                                                        className="pl-9"
                                                                        placeholder="https://youtube.com/@yourchannel"
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Section Titles Tab */}
                                <TabsContent value="sections">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <LayoutGrid className="h-5 w-5" />
                                                Footer Section Titles
                                            </CardTitle>
                                            <CardDescription>
                                                Customize the heading titles for
                                                each section in the footer
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="footer_follow_us_title"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Follow Us
                                                                Section Title
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Follow Us"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="footer_quick_links_title"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Quick Links
                                                                Section Title
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Quick Links"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="footer_customer_service_title"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Customer Service
                                                                Section Title
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Customer Service"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="footer_information_title"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Information
                                                                Section Title
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Information"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="footer_payment_title"
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>
                                                                Payment Methods
                                                                Section Title
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Secure Payment Methods"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Visibility Tab */}
                                <TabsContent value="visibility">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Eye className="h-5 w-5" />
                                                Footer Section Visibility
                                            </CardTitle>
                                            <CardDescription>
                                                Control which sections are
                                                visible in the footer
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="footer_show_quick_links"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">
                                                                Quick Links
                                                                Section
                                                            </FormLabel>
                                                            <FormDescription>
                                                                Show the Quick
                                                                Links section
                                                                with Home,
                                                                Products,
                                                                Categories, etc.
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="footer_show_customer_service"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">
                                                                Customer Service
                                                                Section
                                                            </FormLabel>
                                                            <FormDescription>
                                                                Show the
                                                                Customer Service
                                                                section with
                                                                Account, Orders,
                                                                Wishlist, etc.
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="footer_show_information"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">
                                                                Information
                                                                Section
                                                            </FormLabel>
                                                            <FormDescription>
                                                                Show the
                                                                Information
                                                                section with
                                                                Privacy, Terms,
                                                                Warranty, etc.
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="footer_show_payment_methods"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">
                                                                Payment Methods
                                                                Section
                                                            </FormLabel>
                                                            <FormDescription>
                                                                Show the payment
                                                                method icons
                                                                (Visa,
                                                                Mastercard,
                                                                bKash, etc.)
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="footer_show_social_links"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">
                                                                Social Media
                                                                Links
                                                            </FormLabel>
                                                            <FormDescription>
                                                                Show social
                                                                media icons
                                                                (Facebook,
                                                                Instagram,
                                                                LinkedIn,
                                                                YouTube)
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Payment Methods Tab */}
                                <TabsContent value="payments">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Link className="h-5 w-5" />
                                                Payment Methods
                                            </CardTitle>
                                            <CardDescription>
                                                Control the payment logos shown
                                                in the footer (title is
                                                configured under Section Titles)
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm text-muted-foreground">
                                                Add or update payment gateways.
                                                Provide a short name and an
                                                image URL; the preview updates
                                                instantly.
                                            </p>

                                            <div className="space-y-4">
                                                {paymentMethods.map(
                                                    (method, index) => (
                                                        <div
                                                            key={
                                                                method.id ||
                                                                `method-${index}`
                                                            }
                                                            className="space-y-3 rounded-lg border p-4"
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <h4 className="font-medium">
                                                                    Method{' '}
                                                                    {index + 1}
                                                                </h4>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removePaymentMethod(
                                                                            index,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        paymentMethods.length <=
                                                                        1
                                                                    }
                                                                >
                                                                    <Trash2 className="mr-1 h-4 w-4" />{' '}
                                                                    Remove
                                                                </Button>
                                                            </div>

                                                            <div className="grid gap-4 md:grid-cols-2">
                                                                <div>
                                                                    <FormLabel>
                                                                        Name
                                                                    </FormLabel>
                                                                    <Input
                                                                        value={
                                                                            method.name
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            handlePaymentMethodChange(
                                                                                index,
                                                                                'name',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="VISA"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <FormLabel>
                                                                        Logo URL
                                                                    </FormLabel>
                                                                    <div className="flex flex-col gap-2">
                                                                        <Input
                                                                            value={
                                                                                method.logo
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                handlePaymentMethodChange(
                                                                                    index,
                                                                                    'logo',
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            placeholder="/company/visa.png"
                                                                        />
                                                                        <div className="flex items-center gap-2">
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                className="hidden"
                                                                                id={`payment-logo-${index}`}
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    handlePaymentFileChange(
                                                                                        index,
                                                                                        e
                                                                                            .target
                                                                                            .files?.[0],
                                                                                    )
                                                                                }
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() =>
                                                                                    document
                                                                                        .getElementById(
                                                                                            `payment-logo-${index}`,
                                                                                        )
                                                                                        ?.click()
                                                                                }
                                                                            >
                                                                                <Upload className="mr-2 h-4 w-4" />{' '}
                                                                                Upload
                                                                                Image
                                                                            </Button>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                Upload
                                                                                to
                                                                                replace
                                                                                or
                                                                                set
                                                                                logo
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-12 w-20 items-center justify-center overflow-hidden rounded border bg-muted/50">
                                                                    {method.logo ? (
                                                                        <img
                                                                            src={
                                                                                method.logo
                                                                            }
                                                                            alt={
                                                                                method.name
                                                                            }
                                                                            className="h-full w-full object-contain"
                                                                            onError={(
                                                                                e,
                                                                            ) => {
                                                                                e.currentTarget.style.display =
                                                                                    'none';
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <Image className="h-5 w-5 text-muted-foreground" />
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Recommended
                                                                    size: 64x32
                                                                    px,
                                                                    transparent
                                                                    PNG for best
                                                                    results
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={addPaymentMethod}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />{' '}
                                                    Add Payment Method
                                                </Button>
                                                <p className="text-xs text-muted-foreground">
                                                    These appear above the
                                                    bottom footer text
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Quick Links Tab */}
                                <TabsContent value="quick-links">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Link className="h-5 w-5" />
                                                Quick Links
                                            </CardTitle>
                                            <CardDescription>
                                                Customize the text labels and
                                                URLs for quick navigation links
                                                in the footer
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Home Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Home Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_home"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Home"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_home_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Products Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Products Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_products"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="All Products"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_products_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/products"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Categories Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Categories Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_categories"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Categories"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_categories_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/categories"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* About Us Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    About Us Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_about"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="About Us"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_about_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/about"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Contact Us Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Contact Us Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_contact"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Contact Us"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_contact_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/contact"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Help Center Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Help Center Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_help"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Help Center"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_help_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/help"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Customer Service Tab */}
                                <TabsContent value="customer-service">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Link className="h-5 w-5" />
                                                Customer Service Links
                                            </CardTitle>
                                            <CardDescription>
                                                Customize the text labels and
                                                URLs for customer service links
                                                in the footer
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* My Account Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    My Account Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_account"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="My Account"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_account_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/account"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Order Tracking Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Order Tracking Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_order_tracking"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Order Tracking"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_order_tracking_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/account/orders"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Wishlist Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Wishlist Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_wishlist"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Wishlist"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_wishlist_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/account/wishlist"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Shipping Policy Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Shipping Policy Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_shipping"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Shipping Policy"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_shipping_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/shipping"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Returns & Exchanges Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Returns & Exchanges Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_returns"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Returns & Exchanges"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_returns_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/returns"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* FAQs Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    FAQs Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_faqs"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="FAQs"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_faqs_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/faqs"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Information Tab */}
                                <TabsContent value="information">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Link className="h-5 w-5" />
                                                Information Links
                                            </CardTitle>
                                            <CardDescription>
                                                Customize the text labels and
                                                URLs for information/policy
                                                links in the footer
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Privacy Policy Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Privacy Policy Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_privacy"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Privacy Policy"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_privacy_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/privacy"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Terms & Conditions Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Terms & Conditions Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_terms"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Terms & Conditions"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_terms_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/terms"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Warranty Information Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Warranty Information Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_warranty"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Warranty Information"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_warranty_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/warranty"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Care & Maintenance Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Care & Maintenance Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_care"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Care & Maintenance"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_care_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/care"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Store Locator Link */}
                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h4 className="font-medium">
                                                    Store Locator Link
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_stores"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Store Locator"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="footer_link_stores_url"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="/stores"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            <Separator />

                            <div className="flex justify-end">
                                <Button type="submit" size="lg">
                                    Save Footer Settings
                                </Button>
                            </div>
                        </form>
                    </Form>
                </motion.div>
            </div>
        </AdminPageLayout>
    );
}
