import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Settings,
    Store,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    DollarSign,
    Truck,
    Palette,
} from 'lucide-react';

import AdminPageLayout from '@/layouts/admin-page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Types
interface SiteSettings {
    // General
    site_name: string;
    site_tagline: string;
    site_description: string;
    site_logo: string | null;
    site_favicon: string | null;

    // Contact
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    contact_hours: string;

    // Social
    social_facebook: string | null;
    social_instagram: string | null;
    social_twitter: string | null;
    social_linkedin: string | null;
    social_youtube: string | null;

    // Store
    currency: string;
    currency_symbol: string;
    tax_rate: number;
    free_shipping_threshold: number;
    shipping_cost: number;

    // Appearance
    primary_color: string;
    secondary_color: string;

    // Features
    show_newsletter: boolean;
    show_reviews: boolean;
    maintenance_mode: boolean;
}

interface Props {
    settings: SiteSettings;
}

// Form Schema
const generalSchema = z.object({
    site_name: z.string().min(1, 'Site name is required'),
    site_tagline: z.string().optional(),
    site_description: z.string().optional(),
    site_logo: z.any().optional(),
    site_favicon: z.any().optional(),
});

const contactSchema = z.object({
    contact_email: z.string().email('Invalid email address'),
    contact_phone: z.string().optional(),
    contact_address: z.string().optional(),
    contact_hours: z.string().optional(),
});

const socialSchema = z.object({
    social_facebook: z.string().url().optional().or(z.literal('')),
    social_instagram: z.string().url().optional().or(z.literal('')),
    social_twitter: z.string().url().optional().or(z.literal('')),
    social_linkedin: z.string().url().optional().or(z.literal('')),
    social_youtube: z.string().url().optional().or(z.literal('')),
});

const storeSchema = z.object({
    currency: z.string().min(1),
    currency_symbol: z.string().min(1),
    tax_rate: z.coerce.number().min(0).max(100),
    free_shipping_threshold: z.coerce.number().min(0),
    shipping_cost: z.coerce.number().min(0),
});

const featuresSchema = z.object({
    show_newsletter: z.boolean(),
    show_reviews: z.boolean(),
    maintenance_mode: z.boolean(),
});

export default function SettingsIndex({ settings }: Props) {
    const [activeTab, setActiveTab] = useState('general');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    const resolveImageUrl = (path: string | null | undefined, fallback: string) => {
        if (!path) return fallback;
        if (/^https?:\/\//i.test(path)) return path;
        if (path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    const logoDisplay = logoPreview ?? resolveImageUrl(settings.site_logo, '/logo.png');
    const faviconDisplay = faviconPreview ?? resolveImageUrl(settings.site_favicon, '/favicon-32x32.png');

    const generalForm = useForm({
        resolver: zodResolver(generalSchema),
        defaultValues: {
            site_name: settings.site_name || 'Luxe Furniture',
            site_tagline: settings.site_tagline || 'Premium Furniture for Modern Living',
            site_description: settings.site_description || 'Discover our curated collection of high-quality furniture for your home. From living room to bedroom, we have everything you need.',
        },
    });

    const contactForm = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            contact_email: settings.contact_email || 'info@luxefurniture.com',
            contact_phone: settings.contact_phone || '+1 (555) 123-4567',
            contact_address: settings.contact_address || '123 Design Avenue, Creative District, NY 10001',
            contact_hours: settings.contact_hours || 'Mon-Fri: 9:00 AM - 6:00 PM',
        },
    });

    const socialForm = useForm({
        resolver: zodResolver(socialSchema),
        defaultValues: {
            social_facebook: settings.social_facebook || 'https://facebook.com/luxefurniture',
            social_instagram: settings.social_instagram || 'https://instagram.com/luxefurniture',
            social_twitter: settings.social_twitter || 'https://twitter.com/luxefurniture',
            social_linkedin: settings.social_linkedin || 'https://linkedin.com/company/luxefurniture',
            social_youtube: settings.social_youtube || 'https://youtube.com/c/luxefurniture',
        },
    });

    const storeForm = useForm<{
        currency: string;
        currency_symbol: string;
        tax_rate: number;
        free_shipping_threshold: number;
        shipping_cost: number;
    }>({
        resolver: zodResolver(storeSchema) as any,
        defaultValues: {
            currency: settings.currency || 'USD',
            currency_symbol: settings.currency_symbol || '$',
            tax_rate: settings.tax_rate || 0,
            free_shipping_threshold: settings.free_shipping_threshold || 0,
            shipping_cost: settings.shipping_cost || 0,
        },
    });

    const featuresForm = useForm({
        resolver: zodResolver(featuresSchema),
        defaultValues: {
            show_newsletter: settings.show_newsletter ?? true,
            show_reviews: settings.show_reviews ?? true,
            maintenance_mode: settings.maintenance_mode ?? false,
        },
    });

    const handleSaveSettings = (section: string, values: Record<string, unknown>) => {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('section', section);

        Object.entries(values).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        router.post('/admin/settings', formData, {
            onSuccess: () => {
                toast.success('Settings saved successfully');
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error as string);
                });
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AdminPageLayout>
            <Head title="Site Settings" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your store settings and configuration.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="general" className="gap-2">
                                <Store className="h-4 w-4" />
                                <span className="hidden sm:inline">General</span>
                            </TabsTrigger>
                            <TabsTrigger value="contact" className="gap-2">
                                <Mail className="h-4 w-4" />
                                <span className="hidden sm:inline">Contact</span>
                            </TabsTrigger>
                            <TabsTrigger value="social" className="gap-2">
                                <Facebook className="h-4 w-4" />
                                <span className="hidden sm:inline">Social</span>
                            </TabsTrigger>
                            <TabsTrigger value="store" className="gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="hidden sm:inline">Store</span>
                            </TabsTrigger>
                            <TabsTrigger value="features" className="gap-2">
                                <Settings className="h-4 w-4" />
                                <span className="hidden sm:inline">Features</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* General Settings */}
                        <TabsContent value="general">
                            <Card>
                                <CardHeader>
                                    <CardTitle>General Settings</CardTitle>
                                    <CardDescription>
                                        Configure your store's basic information and branding.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...generalForm}>
                                        <form onSubmit={generalForm.handleSubmit((values) => handleSaveSettings('general', values))} className="space-y-6">
                                            <FormField
                                                control={generalForm.control}
                                                name="site_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Site Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="My Furniture Store" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            The name of your store displayed in the header and title.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={generalForm.control}
                                                name="site_tagline"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Tagline</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Premium Furniture for Modern Living" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            A short description that appears below your logo.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={generalForm.control}
                                                name="site_description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Site Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Describe your store for search engines..."
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Used for SEO meta description.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <FormField
                                                    control={generalForm.control}
                                                    name="site_logo"
                                                    render={({ field: { onChange, value, ...field } }) => (
                                                        <FormItem>
                                                            <FormLabel>Logo</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        onChange(file);
                                                                        if (file) {
                                                                            const reader = new FileReader();
                                                                            reader.onload = (e) => {
                                                                                setLogoPreview(e.target?.result as string);
                                                                            };
                                                                            reader.readAsDataURL(file);
                                                                        } else {
                                                                            setLogoPreview(null);
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            {logoDisplay && (
                                                                <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                                                                    <img
                                                                        src={logoDisplay}
                                                                        alt="Current logo"
                                                                        className="h-12 object-contain"
                                                                    />
                                                                    {logoPreview && <span className="text-xs text-muted-foreground ml-2">(New)</span>}
                                                                </div>
                                                            )}
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={generalForm.control}
                                                    name="site_favicon"
                                                    render={({ field: { onChange, value, ...field } }) => (
                                                        <FormItem>
                                                            <FormLabel>Favicon</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        onChange(file);
                                                                        if (file) {
                                                                            const reader = new FileReader();
                                                                            reader.onload = (e) => {
                                                                                setFaviconPreview(e.target?.result as string);
                                                                            };
                                                                            reader.readAsDataURL(file);
                                                                        } else {
                                                                            setFaviconPreview(null);
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            {faviconDisplay && (
                                                                <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                                                                    <img
                                                                        src={faviconDisplay}
                                                                        alt="Current favicon"
                                                                        className="h-8 object-contain"
                                                                    />
                                                                    {faviconPreview && <span className="text-xs text-muted-foreground ml-2">(New)</span>}
                                                                </div>
                                                            )}
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={isSubmitting}>
                                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Contact Settings */}
                        <TabsContent value="contact">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                    <CardDescription>
                                        Your store's contact details shown to customers.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...contactForm}>
                                        <form onSubmit={contactForm.handleSubmit((values) => handleSaveSettings('contact', values))} className="space-y-6">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <FormField
                                                    control={contactForm.control}
                                                    name="contact_email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                <Mail className="h-4 w-4" />
                                                                Email Address
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="email" placeholder="contact@store.com" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={contactForm.control}
                                                    name="contact_phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                <Phone className="h-4 w-4" />
                                                                Phone Number
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="+1 (555) 123-4567" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={contactForm.control}
                                                name="contact_address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            Address
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="123 Main Street, City, Country"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={contactForm.control}
                                                name="contact_hours"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Business Hours</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Mon-Fri: 9AM-6PM" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={isSubmitting}>
                                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Social Settings */}
                        <TabsContent value="social">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Social Media Links</CardTitle>
                                    <CardDescription>
                                        Connect your social media profiles.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...socialForm}>
                                        <form onSubmit={socialForm.handleSubmit((values) => handleSaveSettings('social', values))} className="space-y-6">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <FormField
                                                    control={socialForm.control}
                                                    name="social_facebook"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                <Facebook className="h-4 w-4" />
                                                                Facebook
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="https://facebook.com/..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={socialForm.control}
                                                    name="social_instagram"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                <Instagram className="h-4 w-4" />
                                                                Instagram
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="https://instagram.com/..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={socialForm.control}
                                                    name="social_twitter"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                <Twitter className="h-4 w-4" />
                                                                Twitter / X
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="https://twitter.com/..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={socialForm.control}
                                                    name="social_linkedin"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                <Linkedin className="h-4 w-4" />
                                                                LinkedIn
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="https://linkedin.com/..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={isSubmitting}>
                                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Store Settings */}
                        <TabsContent value="store">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Store Configuration</CardTitle>
                                    <CardDescription>
                                        Configure currency, tax, and shipping settings.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...storeForm}>
                                        <form onSubmit={storeForm.handleSubmit((values) => handleSaveSettings('store', values))} className="space-y-6">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <FormField
                                                    control={storeForm.control}
                                                    name="currency"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4" />
                                                                Currency Code
                                                            </FormLabel>
                                                            <Select value={field.value} onValueChange={field.onChange}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                                                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                                                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                                                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                                                                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={storeForm.control}
                                                    name="currency_symbol"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Currency Symbol</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="$" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <Separator />

                                            <FormField
                                                control={storeForm.control}
                                                name="tax_rate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Tax Rate (%)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" min="0" max="100" step="0.01" placeholder="0.00" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Applied to all orders (e.g., 8.25 for 8.25%)
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Separator />

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <FormField
                                                    control={storeForm.control}
                                                    name="shipping_cost"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                <Truck className="h-4 w-4" />
                                                                Standard Shipping Cost
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={storeForm.control}
                                                    name="free_shipping_threshold"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Free Shipping Threshold</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Minimum order for free shipping (0 to disable)
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={isSubmitting}>
                                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Features Settings */}
                        <TabsContent value="features">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Feature Toggles</CardTitle>
                                    <CardDescription>
                                        Enable or disable various store features.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...featuresForm}>
                                        <form onSubmit={featuresForm.handleSubmit((values) => handleSaveSettings('features', values))} className="space-y-6">
                                            <FormField
                                                control={featuresForm.control}
                                                name="show_newsletter"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">Newsletter Signup</FormLabel>
                                                            <FormDescription>
                                                                Show newsletter subscription form in the footer.
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={featuresForm.control}
                                                name="show_reviews"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">Product Reviews</FormLabel>
                                                            <FormDescription>
                                                                Allow customers to leave reviews on products.
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={featuresForm.control}
                                                name="maintenance_mode"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-destructive/50">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base text-destructive">
                                                                Maintenance Mode
                                                            </FormLabel>
                                                            <FormDescription>
                                                                Enable to show maintenance page to visitors. Only admins can access the site.
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={isSubmitting}>
                                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </AdminPageLayout>
    );
}
