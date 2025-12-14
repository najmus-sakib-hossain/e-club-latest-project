import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Truck, Clock, MapPin, Shield, Package, AlertCircle } from 'lucide-react';

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

interface ShippingMethod {
    icon?: string;
    title: string;
    description: string;
    time: string;
    price: string;
}

interface DeliveryZone {
    zone: string;
    standard: string;
    express: string;
    price: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface ShippingProps {
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

// Default shipping methods if not set in database
const defaultShippingMethods: ShippingMethod[] = [
    {
        icon: 'truck',
        title: 'Standard Delivery',
        description: 'Free for orders over ৳10,000',
        time: '5-7 business days',
        price: '৳500',
    },
    {
        icon: 'clock',
        title: 'Express Delivery',
        description: 'Priority handling and delivery',
        time: '2-3 business days',
        price: '৳1,000',
    },
    {
        icon: 'map-pin',
        title: 'Showroom Pickup',
        description: 'Pick up from our showroom',
        time: 'Same day',
        price: 'Free',
    },
];

// Default delivery zones if not set in database
const defaultDeliveryZones: DeliveryZone[] = [
    { zone: 'Dhaka City', standard: '3-5 days', express: '1-2 days', price: '৳300' },
    { zone: 'Dhaka Division', standard: '5-7 days', express: '2-3 days', price: '৳500' },
    { zone: 'Chittagong Division', standard: '5-7 days', express: '3-4 days', price: '৳700' },
    { zone: 'Other Divisions', standard: '7-10 days', express: '4-5 days', price: '৳800' },
];

// Default FAQs if not set in database
const defaultFaqs: FAQ[] = [
    {
        question: 'How do I track my order?',
        answer: 'Once your order is shipped, you will receive an email with a tracking number. You can use this number on our website or contact our customer service to track your delivery.',
    },
    {
        question: 'Do you deliver to all areas of Bangladesh?',
        answer: 'Yes, we deliver to all 64 districts of Bangladesh. Delivery times and charges may vary based on your location.',
    },
    {
        question: 'What if I am not home during delivery?',
        answer: 'Our delivery team will contact you before delivery. If you are not available, we can reschedule the delivery at no additional cost.',
    },
    {
        question: 'Is assembly included with delivery?',
        answer: 'Yes, free assembly is included with all furniture deliveries. Our trained technicians will assemble your furniture at your location.',
    },
    {
        question: 'What happens if my furniture is damaged during delivery?',
        answer: 'All deliveries are inspected before handover. If any damage is found, we will replace the item free of charge. Please report any issues within 24 hours of delivery.',
    },
];

// Helper function to get icon component
const getIcon = (iconName: string) => {
    const icons: Record<string, typeof Truck> = {
        truck: Truck,
        clock: Clock,
        'map-pin': MapPin,
    };
    return icons[iconName] || Truck;
};

export default function Shipping({ settings, categories, page, content }: ShippingProps) {
    // Get content from database or use defaults
    const heroTitle = content?.hero?.title || 'Shipping & Delivery';
    const heroSubtitle = content?.hero?.subtitle || 'We deliver to all 64 districts of Bangladesh. Learn about our shipping options, delivery times, and policies.';
    
    const shippingMethods = (content?.shipping_methods?.items as ShippingMethod[]) || defaultShippingMethods;
    const deliveryZones = (content?.zones?.items as DeliveryZone[]) || defaultDeliveryZones;
    const faqs = (content?.faqs?.items as FAQ[]) || defaultFaqs;

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={page?.meta_title || 'Shipping Policy'}>
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
                        <span className="text-foreground font-medium">Shipping Policy</span>
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

            {/* Shipping Methods */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        {content?.shipping_methods?.title || 'Shipping Methods'}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {shippingMethods.map((method, index) => {
                            const IconComponent = getIcon(method.icon || 'truck');
                            return (
                                <Card key={index} className="text-center">
                                    <CardHeader>
                                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <IconComponent className="h-7 w-7 text-primary" />
                                        </div>
                                        <CardTitle className="text-lg">{method.title}</CardTitle>
                                        <CardDescription>{method.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="text-muted-foreground">Delivery Time:</span>{' '}
                                                <span className="font-medium">{method.time}</span>
                                            </p>
                                            <p className="text-lg font-bold text-primary">{method.price}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Delivery Zones */}
            <div className="bg-muted py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        {content?.zones?.title || 'Delivery Zones & Times'}
                    </h2>
                    <div className="max-w-4xl mx-auto overflow-x-auto">
                        <table className="w-full bg-card rounded-lg overflow-hidden">
                            <thead className="bg-foreground text-background">
                                <tr>
                                    <th className="px-6 py-4 text-left">Zone</th>
                                    <th className="px-6 py-4 text-left">Standard Delivery</th>
                                    <th className="px-6 py-4 text-left">Express Delivery</th>
                                    <th className="px-6 py-4 text-left">Starting Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveryZones.map((zone, index) => (
                                    <tr key={index} className="border-b last:border-b-0">
                                        <td className="px-6 py-4 font-medium">{zone.zone}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{zone.standard}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{zone.express}</td>
                                        <td className="px-6 py-4 text-primary font-medium">{zone.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Shipping Features */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Free Assembly</h3>
                                <p className="text-sm text-muted-foreground">
                                    Professional assembly included with every furniture delivery.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center shrink-0">
                                <Shield className="h-6 w-6 text-chart-2" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Safe Packaging</h3>
                                <p className="text-sm text-muted-foreground">
                                    All items are carefully packed to prevent damage during transit.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-chart-4/15 rounded-lg flex items-center justify-center shrink-0">
                                <AlertCircle className="h-6 w-6 text-chart-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Damage Protection</h3>
                                <p className="text-sm text-muted-foreground">
                                    Free replacement if items are damaged during delivery.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQs */}
            {faqs.length > 0 && (
                <div className="bg-muted py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-8">
                            {content?.faqs?.title || 'Frequently Asked Questions'}
                        </h2>
                        <div className="max-w-3xl mx-auto">
                            <Accordion type="single" collapsible className="bg-card rounded-lg">
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
            <div className="py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Our customer service team is here to help with any shipping-related queries.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </SiteLayout>
    );
}
