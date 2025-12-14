import { Head, useForm } from '@inertiajs/react';
import { ChevronRight, Mail, MapPin, Phone, Clock, Send, MessageCircle, Headphones } from 'lucide-react';
import { Link } from '@inertiajs/react';

import { SiteLayout } from '@/components/site';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PhoneInput } from '@/components/ui/phone-input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Category, SiteSettings } from '@/types/cms';

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

interface ContactProps {
    settings?: SiteSettings;
    categories?: Category[];
    pageContent?: Record<string, PageContentSection>;
}

export default function Contact({ settings, categories, pageContent = {} }: ContactProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    // Get dynamic content from settings
    const pageTitle = pageContent.hero?.title || settings?.contact?.contact_page_title || 'Get in Touch';
    const pageSubtitle = pageContent.hero?.subtitle || settings?.contact?.contact_page_subtitle ||
        "Have questions about our e-club? Need help with your order? We're here to help! Reach out to us through any of the channels below.";
    const formTitle = pageContent.form?.title || settings?.contact?.contact_form_title || 'Send us a Message';
    const formSubtitle = pageContent.form?.subtitle || settings?.contact?.contact_form_subtitle ||
        "Fill out the form below and we'll get back to you as soon as possible.";
    const hoursParsed = (() => {
        try {
            return pageContent.hours?.content ? JSON.parse(pageContent.hours.content) : null;
        } catch {
            return null;
        }
    })();
    const hoursWeekday = hoursParsed?.weekday || settings?.contact?.contact_hours_weekday || 'Saturday - Thursday: 10AM - 8PM';
    const hoursWeekend = hoursParsed?.weekend || settings?.contact?.contact_hours_weekend || 'Friday: Closed';
    const contactCards = (pageContent.cards?.items as Array<{ icon?: string; title?: string; details?: string[] }>) || [];
    const mapEmbed = pageContent.map?.content || '';
    const ctaParsed = (() => {
        try {
            return pageContent.cta?.content ? JSON.parse(pageContent.cta.content) : {};
        } catch {
            return {} as Record<string, string>;
        }
    })();
    const ctaTitle = pageContent.cta?.title || 'Need Immediate Help?';
    const ctaSubtitle = pageContent.cta?.subtitle || 'Our customer support team is available to assist you.';
    const ctaCallLabel = (ctaParsed as any).call_label || 'Call Now';
    const ctaEmailLabel = (ctaParsed as any).email_label || 'Email Us';
    const ctaPhone = (ctaParsed as any).phone || settings?.contact?.phone || settings?.contact?.contact_phone || '+8801XXXXXXXXX';
    const ctaEmail = (ctaParsed as any).email || settings?.contact?.email || settings?.contact?.contact_email || 'info@fitmentcraft.com';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => reset(),
        });
    };

    const fallbackCards = [
        {
            icon: MapPin,
            title: 'Visit Us',
            details: [
                settings?.contact?.address || settings?.contact?.contact_address || 'House #12, Road #5, Dhanmondi',
                settings?.contact?.address_line2 || settings?.contact?.contact_address_line2 || '',
            ].filter(Boolean),
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: [
                settings?.contact?.phone || settings?.contact?.contact_phone || '+880 1XXX-XXXXXX',
                settings?.contact?.phone_support || settings?.contact?.contact_phone_support || '',
            ].filter(Boolean),
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: [
                settings?.contact?.email || settings?.contact?.contact_email || 'info@example.com',
                settings?.contact?.email_support || settings?.contact?.contact_email_support || '',
            ].filter(Boolean),
        },
        {
            icon: Clock,
            title: 'Working Hours',
            details: [
                hoursWeekday,
                hoursWeekend,
            ],
        },
    ];

    const contactInfo = contactCards.length
        ? contactCards.map((card) => ({
            icon: (() => {
                const key = (card.icon || '').toLowerCase();
                switch (key) {
                    case 'phone':
                        return Phone;
                    case 'email':
                    case 'mail':
                        return Mail;
                    case 'clock':
                        return Clock;
                    case 'location':
                    case 'map':
                    case 'address':
                        return MapPin;
                    case 'chat':
                        return MessageCircle;
                    case 'support':
                        return Headphones;
                    default:
                        return MapPin;
                }
            })(),
            title: card.title || 'Contact',
            details: (card.details || []).filter(Boolean),
        }))
        : fallbackCards;

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="Contact Us" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">Contact Us</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-primary/10 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">{pageTitle}</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {pageSubtitle}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Contact Info Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {contactInfo.map((info, index) => (
                        <Card key={index} className="text-center">
                            <CardContent className="pt-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <info.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">{info.title}</h3>
                                {info.details.map((detail, i) => (
                                    <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <Card className="h-max">
                        <CardHeader>
                            <CardTitle>{formTitle}</CardTitle>
                            <CardDescription>
                                {formSubtitle}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-2">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Your Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="John Doe"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="john@example.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <PhoneInput
                                            id="phone"
                                            value={data.phone}
                                            onChange={(value) => setData('phone', value || '')}
                                            defaultCountry="BD"
                                            placeholder="Enter phone number"
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-destructive">{errors.phone}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Select
                                            value={data.subject}
                                            onValueChange={(value) => setData('subject', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="general">General Inquiry</SelectItem>
                                                <SelectItem value="order">Order Related</SelectItem>
                                                <SelectItem value="product">Product Information</SelectItem>
                                                <SelectItem value="support">Technical Support</SelectItem>
                                                <SelectItem value="feedback">Feedback</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.subject && (
                                            <p className="text-sm text-destructive">{errors.subject}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Your Message *</Label>
                                    <Textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="How can we help you?"
                                        rows={5}
                                        required
                                    />
                                    {errors.message && (
                                        <p className="text-sm text-destructive">{errors.message}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    <Send className="h-4 w-4 mr-2" />
                                    {processing ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Map */}
                    <div className="space-y-6">
                        <Card className="overflow-hidden p-0 pt-6">
                            <CardHeader>
                                <CardTitle>Our Location</CardTitle>
                                <CardDescription>
                                    Visit our showroom to see our e-club collection in person.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="aspect-video bg-muted">
                                    <iframe
                                        src={mapEmbed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2674437095374!2d90.37399311498239!3d23.746499784589654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf4de7a6cd05%3A0x6e7a2d17e7e4d823!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1638000000000!5m2!1sen!2sbd'}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Our Location"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Contact */}
                        <Card className="bg-primary text-primary-foreground">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold text-lg mb-2">{ctaTitle}</h3>
                                <p className="text-sm opacity-90 mb-4">
                                    {ctaSubtitle}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button variant="secondary" className="flex-1" asChild>
                                        <a href={`tel:${ctaPhone}`}>
                                            <Phone className="h-4 w-4 mr-2" />
                                            {ctaCallLabel}
                                        </a>
                                    </Button>
                                    <Button variant="secondary" className="flex-1" asChild>
                                        <a href={`mailto:${ctaEmail}`}>
                                            <Mail className="h-4 w-4 mr-2" />
                                            {ctaEmailLabel}
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
