import { Head, Link } from '@inertiajs/react';
import {
    Award,
    Building,
    ChevronRight,
    Globe,
    Heart,
    Leaf,
    Shield,
    Sparkles,
    Star,
    Target,
    ThumbsUp,
    Truck,
    Users,
} from 'lucide-react';

import { SiteLayout } from '@/components/site';
import { Card, CardContent } from '@/components/ui/card';
import type { Category, SiteSettings } from '@/types/cms';

interface TeamMemberItem {
    id: number;
    name: string;
    role: string;
    image: string | null;
    bio: string | null;
    social_links: Record<string, string> | null;
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

interface AboutProps {
    settings?: SiteSettings;
    categories?: Category[];
    teamMembers?: TeamMemberItem[];
    pageContent?: Record<string, PageContentSection>;
}

// Default features for fallback
const defaultFeatures = [
    {
        icon: 'building',
        title: 'Own Manufacturing',
        description:
            'In-house production facility ensuring complete quality control.',
    },
    {
        icon: 'truck',
        title: 'Nationwide Delivery',
        description: 'We deliver to all 64 districts of Bangladesh.',
    },
    {
        icon: 'shield',
        title: '2 Year Warranty',
        description: 'All products come with comprehensive warranty coverage.',
    },
    {
        icon: 'thumbsup',
        title: 'Easy Returns',
        description: '7-day hassle-free return policy for your peace of mind.',
    },
];

// Values configuration
const defaultValues = [
    {
        icon: Award,
        title: 'Quality First',
        description:
            'We never compromise on quality. Every piece of e-club goes through rigorous quality checks.',
    },
    {
        icon: Users,
        title: 'Customer Centric',
        description:
            'Our customers are at the heart of everything we do. Your satisfaction is our top priority.',
    },
    {
        icon: Target,
        title: 'Innovation',
        description:
            'We continuously innovate our designs and processes to bring you the best e-club solutions.',
    },
    {
        icon: Heart,
        title: 'Sustainability',
        description:
            'We are committed to sustainable practices and environmentally responsible manufacturing.',
    },
];

export default function About({
    settings,
    categories,
    teamMembers = [],
    pageContent = {},
}: AboutProps) {
    // Get dynamic content from settings
    const siteName = settings?.general?.site_name || 'E-Club';
    const heroTitle =
        pageContent.hero?.title ||
        settings?.about?.about_hero_title ||
        'Crafting Quality E-Club Since 2014';
    const heroDescription =
        pageContent.hero?.content ||
        settings?.about?.about_hero_description ||
        `${siteName} is Bangladesh's leading e-club brand, dedicated to creating beautiful, functional, and affordable e-club for homes and offices. Our journey began with a simple mission: to bring world-class e-club design to every Bangladeshi home.`;
    const storyTitle =
        pageContent.story?.title ||
        settings?.about?.about_story_title ||
        'Our Story';
    const storyContent =
        pageContent.story?.content ||
        'Founded in 2014, E-Club started as a small e-club workshop in Dhaka with a dream to revolutionize the e-club industry in Bangladesh.\nWhat began as a team of 5 passionate craftsmen has now grown into a company of over 200 dedicated professionals, including designers, engineers, craftsmen, and customer service experts.\nOver the years, we have served more than 50,000 happy customers, delivering over 100,000 pieces of e-club across all 64 districts of Bangladesh. Our commitment to quality, innovation, and customer satisfaction has made us a household name.\nToday, we operate from our state-of-the-art 50,000 sq. ft. manufacturing facility, equipped with modern machinery and a team of skilled artisans who bring our designs to life.';
    const storyImage = pageContent.story?.image || null;
    const valuesTitle =
        pageContent.values?.title ||
        settings?.about?.about_values_title ||
        'Our Values';
    const valuesSubtitle =
        pageContent.values?.subtitle ||
        settings?.about?.about_values_subtitle ||
        'These core values guide everything we do and help us deliver the best to our customers.';
    const teamTitle =
        pageContent.team?.title ||
        settings?.about?.about_team_title ||
        'Meet Our Team';
    const teamSubtitle =
        pageContent.team?.subtitle ||
        settings?.about?.about_team_subtitle ||
        `The passionate people behind ${siteName}.`;

    // Dynamic stats
    const dynamicStats = [
        {
            label: 'Years of Experience',
            value: settings?.about?.about_stats_years || '10+',
        },
        {
            label: 'Happy Customers',
            value: settings?.about?.about_stats_customers || '50,000+',
        },
        {
            label: 'Products Delivered',
            value: settings?.about?.about_stats_products || '100,000+',
        },
        {
            label: 'Cities Covered',
            value: settings?.about?.about_stats_cities || '64',
        },
    ];
    const stats =
        (pageContent.stats?.items as typeof dynamicStats) || dynamicStats;

    // Get dynamic content from pageContent with fallbacks
    const features =
        (pageContent.features?.items as typeof defaultFeatures) ||
        defaultFeatures;
    const valueItems =
        (pageContent.values?.items as Array<{
            icon: string;
            title: string;
            description: string;
        }>) || defaultValues;
    const ctaTitle = pageContent.cta?.title || 'Ready to Transform Your Space?';
    const ctaSubtitle =
        pageContent.cta?.subtitle ||
        'Browse our collection and find the perfect e-club for your home or office.';

    // Get feature icon component
    const getFeatureIcon = (iconName: string) => {
        if (!iconName || typeof iconName !== 'string') return Building;
        switch (iconName.toLowerCase()) {
            case 'building':
                return Building;
            case 'truck':
                return Truck;
            case 'shield':
                return Shield;
            case 'thumbsup':
                return ThumbsUp;
            case 'award':
                return Award;
            case 'users':
                return Users;
            case 'target':
                return Target;
            case 'heart':
                return Heart;
            default:
                return Building;
        }
    };

    const getValueIcon = (iconName: string) => {
        if (!iconName || typeof iconName !== 'string') return Award;
        switch (iconName.toLowerCase()) {
            case 'leaf':
                return Leaf;
            case 'heart':
                return Heart;
            case 'sparkles':
                return Sparkles;
            case 'shield':
                return Shield;
            case 'users':
                return Users;
            case 'star':
                return Star;
            case 'globe':
                return Globe;
            case 'award':
                return Award;
            default:
                return Award;
        }
    };

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="About Us" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-foreground">
                            About Us
                        </span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-foreground to-foreground/90 py-20 text-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="mb-6 text-4xl font-bold lg:text-5xl">
                            {heroTitle}
                        </h1>
                        <p className="text-lg leading-relaxed text-background/80">
                            {heroDescription}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-primary py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div
                                key={`${stat.label}-${index}`}
                                className="text-center"
                            >
                                <div className="mb-2 text-4xl font-bold text-primary-foreground lg:text-5xl">
                                    {stat.value}
                                </div>
                                <div className="text-primary-foreground/80">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Story */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="mb-6 text-3xl font-bold">
                                {storyTitle}
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                {(
                                    storyContent?.split('\n').filter(Boolean) ||
                                    []
                                ).map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                                <img
                                    src={
                                        storyImage
                                            ? `/storage/${storyImage}`
                                            : '/images/factory.jpg'
                                    }
                                    alt="Our Factory"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600';
                                    }}
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 rounded-lg bg-primary p-6">
                                <div className="text-4xl font-bold text-primary-foreground">
                                    {stats[0]?.value || dynamicStats[0].value}
                                </div>
                                <div className="text-primary-foreground/80">
                                    Years of Excellence
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Values */}
            <div className="bg-muted py-16">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            {valuesTitle}
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            {valuesSubtitle}
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {valueItems.map((value, index) => {
                            const IconComponent =
                                typeof value.icon === 'function'
                                    ? value.icon
                                    : getValueIcon(value.icon);
                            return (
                                <Card
                                    key={`${value.title}-${index}`}
                                    className="text-center transition-shadow hover:shadow-lg"
                                >
                                    <CardContent className="pt-6">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                            <IconComponent className="h-7 w-7 text-primary" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold">
                                            {value.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Why Choose Us?
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            We're committed to providing the best e-club
                            shopping experience in Bangladesh.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => {
                            const IconComponent = getFeatureIcon(feature.icon);
                            return (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            {teamMembers.length > 0 && (
                <div className="bg-muted py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                {teamTitle}
                            </h2>
                            <p className="mx-auto max-w-2xl text-muted-foreground">
                                {teamSubtitle}
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {teamMembers.map((member) => (
                                <Card
                                    key={member.id}
                                    className="overflow-hidden"
                                >
                                    <div className="aspect-square bg-muted">
                                        <img
                                            src={
                                                member.image ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=FFE400&color=000`
                                            }
                                            alt={member.name}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=FFE400&color=000`;
                                            }}
                                        />
                                    </div>
                                    <CardContent className="pt-4 text-center">
                                        <h3 className="font-semibold">
                                            {member.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {member.role}
                                        </p>
                                        {member.bio && (
                                            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                                                {member.bio}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CTA */}
            <div className="bg-foreground py-16 text-background">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-3xl font-bold">{ctaTitle}</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-background/80">
                        {ctaSubtitle}
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-lg border border-background px-8 py-3 transition-colors hover:bg-background hover:text-foreground"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
