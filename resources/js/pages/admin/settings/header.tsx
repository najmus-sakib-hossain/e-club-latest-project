import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router } from '@inertiajs/react';
import {
    ExternalLink,
    Eye,
    Heart,
    Image,
    Link as LinkIcon,
    Menu,
    PanelTop,
    ShoppingCart,
    Upload,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Switch } from '@/components/ui/switch';
import { AdminLayout } from '@/layouts/admin-layout';
import { toast } from 'sonner';

interface SiteSettings {
    site_name?: string;
    site_logo?: string;
    header_announcement?: string;
    header_announcement_enabled?: boolean;
    header_phone?: string;
    header_email?: string;
    contact_phone?: string;
    contact_email?: string;
    // legacy social keys
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    social_facebook?: string;
    social_instagram?: string;
    social_twitter?: string;
    social_youtube?: string;
    // Main header links
    header_about_visible?: boolean;
    header_about_text?: string;
    header_about_url?: string;
    header_contact_visible?: boolean;
    header_contact_text?: string;
    header_contact_url?: string;
    header_help_visible?: boolean;
    header_help_text?: string;
    header_help_url?: string;
    // Meeting request section
    header_meeting_visible?: boolean;
    header_meeting_text?: string;
    header_meeting_schedule_text?: string;
    header_meeting_schedule_url?: string;
    header_meeting_callback_text?: string;
    header_meeting_callback_url?: string;
    header_meeting_availability_text?: string;
    header_meeting_availability_url?: string;
    // Feature toggles
    header_wishlist_visible?: boolean;
    header_cart_visible?: boolean;
}

interface Props {
    settings: SiteSettings;
}

const headerSchema = z.object({
    site_name: z.string().min(1, 'Site name is required'),
    header_announcement: z.string().optional(),
    header_announcement_enabled: z.boolean().optional(),
    header_phone: z.string().optional(),
    header_email: z
        .string()
        .email('Please enter a valid email')
        .optional()
        .or(z.literal('')),
    social_facebook: z
        .string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),
    social_instagram: z
        .string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),
    social_twitter: z
        .string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),
    social_youtube: z
        .string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),
    // Main header links
    header_about_visible: z.boolean().optional(),
    header_about_text: z.string().optional(),
    header_about_url: z.string().optional(),
    header_contact_visible: z.boolean().optional(),
    header_contact_text: z.string().optional(),
    header_contact_url: z.string().optional(),
    header_help_visible: z.boolean().optional(),
    header_help_text: z.string().optional(),
    header_help_url: z.string().optional(),
    // Meeting request section
    header_meeting_visible: z.boolean().optional(),
    header_meeting_text: z.string().optional(),
    header_meeting_schedule_text: z.string().optional(),
    header_meeting_schedule_url: z.string().optional(),
    header_meeting_callback_text: z.string().optional(),
    header_meeting_callback_url: z.string().optional(),
    header_meeting_availability_text: z.string().optional(),
    header_meeting_availability_url: z.string().optional(),
    // Feature toggles
    header_wishlist_visible: z.boolean().optional(),
    header_cart_visible: z.boolean().optional(),
});

type HeaderFormValues = z.infer<typeof headerSchema>;

export default function HeaderSettings({ settings }: Props) {
    const [logoPreview, setLogoPreview] = useState<string | null>(
        settings.site_logo ? `/storage/${settings.site_logo}` : '/logo.png',
    );
    const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    // Convert possible string/boolean/undefined to boolean
    const toBool = (value: unknown, defaultValue = true) => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') return value === '1';
        return defaultValue;
    };

    const form = useForm<HeaderFormValues>({
        resolver: zodResolver(headerSchema),
        defaultValues: {
            site_name: settings.site_name || 'E-Club Store',
            header_announcement: settings.header_announcement || '',
            header_announcement_enabled: toBool(
                settings.header_announcement_enabled,
            ),
            header_phone: settings.header_phone || settings.contact_phone || '',
            header_email: settings.header_email || settings.contact_email || '',
            social_facebook:
                settings.social_facebook || settings.facebook || '',
            social_instagram:
                settings.social_instagram || settings.instagram || '',
            social_twitter: settings.social_twitter || settings.twitter || '',
            social_youtube: settings.social_youtube || settings.youtube || '',
            // Main header links
            header_about_visible: toBool(settings.header_about_visible),
            header_about_text: settings.header_about_text || 'About Us',
            header_about_url: settings.header_about_url || '/about',
            header_contact_visible: toBool(settings.header_contact_visible),
            header_contact_text: settings.header_contact_text || 'Contact Us',
            header_contact_url: settings.header_contact_url || '/contact',
            header_help_visible: toBool(settings.header_help_visible),
            header_help_text: settings.header_help_text || 'Help Center',
            header_help_url: settings.header_help_url || '/help',
            // Meeting request section
            header_meeting_visible: toBool(settings.header_meeting_visible),
            header_meeting_text:
                settings.header_meeting_text || 'Meeting Request',
            header_meeting_schedule_text:
                settings.header_meeting_schedule_text || 'Schedule Meeting',
            header_meeting_schedule_url:
                settings.header_meeting_schedule_url || '/meeting/schedule',
            header_meeting_callback_text:
                settings.header_meeting_callback_text || 'Request Callback',
            header_meeting_callback_url:
                settings.header_meeting_callback_url || '/meeting/callback',
            header_meeting_availability_text:
                settings.header_meeting_availability_text ||
                'Check Availability',
            header_meeting_availability_url:
                settings.header_meeting_availability_url ||
                '/meeting/availability',
            // Feature toggles
            header_wishlist_visible: toBool(settings.header_wishlist_visible),
            header_cart_visible: toBool(settings.header_cart_visible),
        },
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Section-specific save handlers
    const saveSection = (sectionName: string, fields: string[]) => {
        const values = form.getValues();
        const formData = new FormData();
        formData.append('section', 'header');

        fields.forEach((field) => {
            const value = values[field as keyof HeaderFormValues];
            if (typeof value === 'boolean') {
                formData.append(field, value ? '1' : '0');
            } else if (value !== null && value !== undefined) {
                formData.append(field, String(value));
            }
        });

        // Add logo file if selected and this is the branding section
        if (sectionName === 'branding' && selectedLogo) {
            formData.append('site_logo', selectedLogo);
        }

        router.post('/admin/settings', formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success(`${sectionName} saved successfully`);
                if (sectionName === 'branding') {
                    setSelectedLogo(null);
                }
            },
            onError: () => {
                toast.error(`Failed to save ${sectionName}`);
            },
        });
    };

    const saveBranding = () => {
        saveSection('Site Branding', ['site_name']);
    };

    const saveAnnouncement = () => {
        saveSection('Announcement Bar', [
            'header_announcement',
            'header_announcement_enabled',
        ]);
    };

    const saveContactInfo = () => {
        saveSection('Contact Information', ['header_phone', 'header_email']);
    };

    const saveSocialLinks = () => {
        saveSection('Social Links', [
            'social_facebook',
            'social_instagram',
            'social_twitter',
            'social_youtube',
        ]);
    };

    const saveMainLinks = () => {
        saveSection('Main Header Links', [
            'header_about_visible',
            'header_about_text',
            'header_about_url',
            'header_contact_visible',
            'header_contact_text',
            'header_contact_url',
            'header_help_visible',
            'header_help_text',
            'header_help_url',
        ]);
    };

    const saveMeetingRequest = () => {
        saveSection('Meeting Request', [
            'header_meeting_visible',
            'header_meeting_text',
            'header_meeting_schedule_text',
            'header_meeting_schedule_url',
            'header_meeting_callback_text',
            'header_meeting_callback_url',
            'header_meeting_availability_text',
            'header_meeting_availability_url',
        ]);
    };

    const saveFeatureToggles = () => {
        saveSection('Feature Toggles', [
            'header_wishlist_visible',
            'header_cart_visible',
        ]);
    };

    const onSubmit = (values: HeaderFormValues) => {
        const formData = new FormData();
        formData.append('section', 'header');

        Object.entries(values).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        // Add logo file if selected
        if (selectedLogo) {
            formData.append('site_logo', selectedLogo);
        }

        router.post('/admin/settings', formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Header settings saved successfully');
                setSelectedLogo(null);
            },
            onError: () => {
                toast.error('Failed to save header settings');
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Header Settings" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">
                        Header Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Customize your website header, announcement bar, and top
                        navigation
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="space-y-6"
                >
                    {/* Navigation Menu Management Link */}
                    <Alert className="border-primary/20 bg-primary/5">
                        <AlertDescription className="flex items-center justify-start gap-4">
                            <Menu className="h-4 w-4" />
                            <span className="flex-1">
                                To manage the navigation menu items (dropdown
                                menus, categories, subcategories), visit the
                                Navigation Menu settings.
                            </span>
                            <Link href="/admin/settings/navigation">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-4"
                                >
                                    <Menu className="mr-2 h-4 w-4" />
                                    Manage Navigation
                                    <ExternalLink className="ml-2 h-3 w-3" />
                                </Button>
                            </Link>
                        </AlertDescription>
                    </Alert>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Site Branding */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PanelTop className="h-5 w-5" />
                                        Site Branding
                                    </CardTitle>
                                    <CardDescription>
                                        Configure your site name and logo that
                                        appears in the header
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="site_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Site Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., E-Club BD, Home Decor Store"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    This name is used as
                                                    fallback text when logo is
                                                    not available
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Logo Upload */}
                                    <div className="space-y-3">
                                        <FormLabel>Site Logo</FormLabel>
                                        <div className="flex items-start gap-6">
                                            {/* Logo Preview */}
                                            <div className="flex-shrink-0">
                                                <div className="flex h-20 w-40 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/30">
                                                    {logoPreview ? (
                                                        <img
                                                            src={logoPreview}
                                                            alt="Site Logo"
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    ) : (
                                                        <div className="text-center text-muted-foreground">
                                                            <Image className="mx-auto mb-1 h-8 w-8" />
                                                            <span className="text-xs">
                                                                No logo
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Upload Button */}
                                            <div className="flex-1">
                                                <input
                                                    ref={logoInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                    className="hidden"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        logoInputRef.current?.click()
                                                    }
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    {logoPreview
                                                        ? 'Change Logo'
                                                        : 'Upload Logo'}
                                                </Button>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    Recommended: PNG or SVG,
                                                    transparent background, max
                                                    2MB. Optimal size: 200x50
                                                    pixels
                                                </p>
                                                {selectedLogo && (
                                                    <p className="mt-1 text-sm text-primary">
                                                        ✓ New logo selected:{' '}
                                                        {selectedLogo.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end border-t pt-4">
                                        <Button
                                            type="button"
                                            onClick={saveBranding}
                                        >
                                            Save Site Branding
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Announcement Bar */}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        Announcement Bar
                                    </CardTitle>
                                    <CardDescription>
                                        Display important messages or promotions at the top of your site
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="header_announcement_enabled"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Enable Announcement Bar
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Show the announcement bar on your website
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
                                        control={form.control}
                                        name="header_announcement"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Announcement Text</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="e.g., 🎉 Free shipping on orders over ৳5,000! Shop Now"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Use emojis to make your announcement stand out. This appears in the top bar.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <div className="flex justify-end pt-4 border-t mt-4">
                                        <Button type="button" onClick={saveAnnouncement}>
                                            Save Announcement Bar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card> */}

                            {/* Contact Information */}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Phone className="h-5 w-5" />
                                        Header Contact Info
                                    </CardTitle>
                                    <CardDescription>
                                        Display contact information in the header announcement bar (shown on desktop only)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="header_phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                            <Input
                                                                className="pl-9"
                                                                placeholder="e.g., +880 1700-000000"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Displayed in the top bar with a phone icon
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="header_email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                            <Input
                                                                className="pl-9"
                                                                placeholder="e.g., info@yourstore.com"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Displayed in the top bar with a mail icon
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card> */}

                            {/* Social Links */}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Facebook className="h-5 w-5" />
                                        Social Media Links
                                    </CardTitle>
                                    <CardDescription>
                                        Add your social media profile links to show in the header announcement bar
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="social_facebook"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Facebook</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Facebook className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                            <Input
                                                                className="pl-9"
                                                                placeholder="e.g., https://facebook.com/yourpage"
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
                                                    <FormLabel>Instagram</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                            <Input
                                                                className="pl-9"
                                                                placeholder="e.g., https://instagram.com/yourpage"
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
                                                    <FormLabel>Twitter / X</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Twitter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                            <Input
                                                                className="pl-9"
                                                                placeholder="e.g., https://twitter.com/yourhandle"
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
                                                    <FormLabel>YouTube</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Youtube className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                            <Input
                                                                className="pl-9"
                                                                placeholder="e.g., https://youtube.com/@yourchannel"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    
                                    <div className="flex justify-end pt-4 border-t mt-4">
                                        <Button type="button" onClick={saveSocialLinks}>
                                            Save Social Links
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card> */}

                            {/* Main Header Links */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <LinkIcon className="h-5 w-5" />
                                        Main Header Links
                                    </CardTitle>
                                    <CardDescription>
                                        Customize the main navigation links that
                                        appear in the header
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* About Us Link */}
                                    <div className="space-y-4 rounded-lg border p-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">
                                                About Us Link
                                            </h4>
                                            <FormField
                                                control={form.control}
                                                name="header_about_visible"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="flex items-center gap-2">
                                                                <Switch
                                                                    checked={
                                                                        field.value
                                                                    }
                                                                    onCheckedChange={
                                                                        field.onChange
                                                                    }
                                                                />
                                                                <span className="text-sm text-muted-foreground">
                                                                    {field.value
                                                                        ? 'Visible'
                                                                        : 'Hidden'}
                                                                </span>
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="header_about_text"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Link Text
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
                                                name="header_about_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Link URL
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
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">
                                                Contact Us Link
                                            </h4>
                                            <FormField
                                                control={form.control}
                                                name="header_contact_visible"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="flex items-center gap-2">
                                                                <Switch
                                                                    checked={
                                                                        field.value
                                                                    }
                                                                    onCheckedChange={
                                                                        field.onChange
                                                                    }
                                                                />
                                                                <span className="text-sm text-muted-foreground">
                                                                    {field.value
                                                                        ? 'Visible'
                                                                        : 'Hidden'}
                                                                </span>
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="header_contact_text"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Link Text
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
                                                name="header_contact_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Link URL
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
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">
                                                Help Center Link
                                            </h4>
                                            <FormField
                                                control={form.control}
                                                name="header_help_visible"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="flex items-center gap-2">
                                                                <Switch
                                                                    checked={
                                                                        field.value
                                                                    }
                                                                    onCheckedChange={
                                                                        field.onChange
                                                                    }
                                                                />
                                                                <span className="text-sm text-muted-foreground">
                                                                    {field.value
                                                                        ? 'Visible'
                                                                        : 'Hidden'}
                                                                </span>
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="header_help_text"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Link Text
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
                                                name="header_help_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Link URL
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

                                    <div className="mt-4 flex justify-end border-t pt-4">
                                        <Button
                                            type="button"
                                            onClick={saveMainLinks}
                                        >
                                            Save Main Header Links
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Meeting Request Section */}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Meeting Request Section
                                    </CardTitle>
                                    <CardDescription>
                                        Configure the meeting request dropdown and its options
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="header_meeting_visible"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Enable Meeting Request
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Show the meeting request dropdown in the header
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
                                        control={form.control}
                                        name="header_meeting_text"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dropdown Button Text</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Meeting Request" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    The text shown on the dropdown button
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4">
                                        <h4 className="font-medium text-sm">Dropdown Options</h4>

                                        <div className="grid gap-4 md:grid-cols-2 rounded-lg border p-4">
                                            <FormField
                                                control={form.control}
                                                name="header_meeting_schedule_text"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Schedule Meeting Text</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Schedule Meeting" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="header_meeting_schedule_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Schedule Meeting URL</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="/meeting/schedule" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 rounded-lg border p-4">
                                            <FormField
                                                control={form.control}
                                                name="header_meeting_callback_text"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Request Callback Text</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Request Callback" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="header_meeting_callback_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Request Callback URL</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="/meeting/callback" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 rounded-lg border p-4">
                                            <FormField
                                                control={form.control}
                                                name="header_meeting_availability_text"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Check Availability Text</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Check Availability" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="header_meeting_availability_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Check Availability URL</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="/meeting/availability" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end pt-4 border-t mt-4">
                                        <Button type="button" onClick={saveMeetingRequest}>
                                            Save Meeting Request Settings
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card> */}

                            {/* Feature Toggles */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        Feature Toggles
                                    </CardTitle>
                                    <CardDescription>
                                        Control which features are visible in
                                        the header
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="header_wishlist_visible"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="flex items-center gap-2 text-base">
                                                        <Heart className="h-4 w-4" />
                                                        Show Wishlist
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Display the wishlist
                                                        icon in the header
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
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
                                        name="header_cart_visible"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="flex items-center gap-2 text-base">
                                                        <ShoppingCart className="h-4 w-4" />
                                                        Show Shopping Cart
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Display the shopping
                                                        cart icon in the header
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="mt-4 flex justify-end border-t pt-4">
                                        <Button
                                            type="button"
                                            onClick={saveFeatureToggles}
                                        >
                                            Save Feature Toggles
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* <Separator />

                            <div className="flex justify-end gap-4">
                                <Link href="/admin/settings/navigation">
                                    <Button type="button" variant="outline">
                                        <Menu className="mr-2 h-4 w-4" />
                                        Manage Navigation Menu
                                    </Button>
                                </Link>
                                <Button type="submit" size="lg">
                                    Save Header Settings
                                </Button>
                            </div> */}
                        </form>
                    </Form>
                </motion.div>
            </div>
        </AdminLayout>
    );
}
