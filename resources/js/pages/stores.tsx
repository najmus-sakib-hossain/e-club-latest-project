import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle,
    ChevronRight,
    Clock,
    MapPin,
    Navigation,
    Phone,
    Star,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { SiteLayout } from '@/components/site';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Category, SiteSettings } from '@/types/cms';

interface StoreLocation {
    id: number;
    name: string;
    type: string;
    address: string;
    phone: string | null;
    email: string | null;
    hours: string | null;
    features: string[] | null;
    is_open: boolean;
    rating: number | null;
    map_url: string | null;
    city: string | null;
    is_active: boolean;
    sort_order: number;
}

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

interface StoresProps {
    settings?: SiteSettings;
    categories?: Category[];
    page?: {
        id: number;
        title: string;
        content: string;
        meta_title?: string;
        meta_description?: string;
    };
    storeLocations?: StoreLocation[];
    pageContent?: Record<string, PageContentSection>;
}

// Default store services for fallback
const defaultStoreServices = [
    {
        icon: 'check',
        title: 'Quality Guarantee',
        description: 'Inspect e-club quality in person before you buy',
    },
    {
        icon: 'users',
        title: 'Expert Staff',
        description: 'Get personalized recommendations from our team',
    },
    {
        icon: 'grid',
        title: 'Room Displays',
        description: 'See how e-club looks in real room settings',
    },
    {
        icon: 'dollar',
        title: 'Easy Financing',
        description: 'Flexible EMI options available at our stores',
    },
];

export default function Stores({
    settings,
    categories,
    page,
    storeLocations = [],
    pageContent = {},
}: StoresProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('All');

    // Get dynamic content with fallbacks
    const heroTitle = pageContent.hero?.title || 'Find a Store Near You';
    const heroSubtitle =
        pageContent.hero?.subtitle ||
        'Visit one of our showrooms to experience our e-club in person. Our expert staff is ready to help you find the perfect pieces.';
    const locationsSectionTitle =
        pageContent.locations_section?.title || 'All Locations';
    const storeServicesTitle =
        pageContent.store_services?.title || 'What to Expect at Our Stores';
    const storeServices =
        (pageContent.store_services?.items as typeof defaultStoreServices) ||
        defaultStoreServices;
    const ctaTitle = pageContent.cta?.title || "Can't Visit a Store?";
    const ctaSubtitle =
        pageContent.cta?.subtitle ||
        'Shop our entire collection online with nationwide delivery, or schedule a video consultation with our design experts.';

    // Get unique cities from store locations
    const cities = useMemo(() => {
        const uniqueCities = new Set<string>();
        uniqueCities.add('All');
        storeLocations.forEach((store) => {
            if (store.city) {
                uniqueCities.add(store.city);
            }
        });
        return Array.from(uniqueCities);
    }, [storeLocations]);

    const filteredStores = storeLocations.filter((store) => {
        const matchesSearch =
            store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.address.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCity =
            selectedCity === 'All' ||
            store.city?.toLowerCase() === selectedCity.toLowerCase() ||
            store.address.toLowerCase().includes(selectedCity.toLowerCase());

        return matchesSearch && matchesCity;
    });

    // Get icon component for store services
    const getServiceIcon = (iconName: string) => {
        switch (iconName?.toLowerCase()) {
            case 'check':
                return (
                    <svg
                        className="h-7 w-7 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
            case 'users':
                return (
                    <svg
                        className="h-7 w-7 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                );
            case 'grid':
                return (
                    <svg
                        className="h-7 w-7 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                        />
                    </svg>
                );
            case 'dollar':
                return (
                    <svg
                        className="h-7 w-7 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
            default:
                return <CheckCircle className="h-7 w-7 text-primary" />;
        }
    };

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={page?.meta_title || 'Store Locator'}>
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
                            Store Locator
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
                    <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
                        {heroSubtitle}
                    </p>

                    {/* Search and Filter */}
                    <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Search by store name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                            <MapPin className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" />
                        </div>
                        <div className="flex gap-2">
                            {cities.map((city) => (
                                <Button
                                    key={city}
                                    variant={
                                        selectedCity === city
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setSelectedCity(city)}
                                    className={
                                        selectedCity === city
                                            ? 'bg-primary text-primary-foreground'
                                            : ''
                                    }
                                >
                                    {city}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stores Grid */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    {filteredStores.length === 0 ? (
                        <div className="py-12 text-center">
                            <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mb-2 text-lg font-medium text-foreground">
                                No stores found
                            </h3>
                            <p className="text-muted-foreground">
                                Try a different search or browse all locations.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredStores.map((store) => (
                                <Card
                                    key={store.id}
                                    className={
                                        !store.is_open ? 'opacity-75' : ''
                                    }
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {store.name}
                                                </CardTitle>
                                                <CardDescription className="mt-1 flex items-center gap-2">
                                                    <Badge
                                                        variant={
                                                            store.type ===
                                                            'Flagship Store'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {store.type}
                                                    </Badge>
                                                    {!store.is_open && (
                                                        <Badge variant="destructive">
                                                            Temporarily Closed
                                                        </Badge>
                                                    )}
                                                </CardDescription>
                                            </div>
                                            {store.rating && (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
                                                    <span className="font-medium">
                                                        {store.rating}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2 text-sm">
                                            <p className="flex items-start gap-2">
                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70" />
                                                <span>{store.address}</span>
                                            </p>
                                            {store.phone && (
                                                <p className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground/70" />
                                                    <span>{store.phone}</span>
                                                </p>
                                            )}
                                            {store.hours && (
                                                <p className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground/70" />
                                                    <span>{store.hours}</span>
                                                </p>
                                            )}
                                        </div>

                                        {store.features &&
                                            store.features.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {store.features.map(
                                                        (feature, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {feature}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                        <div className="flex gap-2 pt-2">
                                            {store.map_url && (
                                                <a
                                                    href={store.map_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                                >
                                                    <Navigation className="h-4 w-4" />
                                                    Get Directions
                                                </a>
                                            )}
                                            {store.phone && (
                                                <a
                                                    href={`tel:${store.phone.replace(/\s/g, '')}`}
                                                    className="inline-flex items-center justify-center rounded-lg border px-4 py-2 transition-colors hover:bg-muted"
                                                >
                                                    <Phone className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Map Section Placeholder */}
            <div className="bg-muted py-12">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-2xl font-bold">
                        {locationsSectionTitle}
                    </h2>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2674437095374!2d90.37399311498239!3d23.746499784589654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf4de7a6cd05%3A0x6e7a2d17e7e4d823!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1638000000000!5m2!1sen!2sbd"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Our Location"
                        className="max-w-9xl mx-auto min-h-[750px] rounded-md"
                    />
                </div>
            </div>

            {/* Store Services */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-2xl font-bold">
                        {storeServicesTitle}
                    </h2>
                    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-4">
                        {storeServices.map((service, index) => (
                            <div key={index} className="text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                    {getServiceIcon(service.icon)}
                                </div>
                                <h3 className="mb-2 font-semibold">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-foreground py-12 text-background">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-2xl font-bold">{ctaTitle}</h2>
                    <p className="mx-auto mb-6 max-w-xl text-background/80">
                        {ctaSubtitle}
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Shop Online
                        </Link>
                        <Link
                            href="/meeting/schedule"
                            className="inline-flex items-center justify-center rounded-lg border border-background px-8 py-3 transition-colors hover:bg-background hover:text-foreground"
                        >
                            Schedule Consultation
                        </Link>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
