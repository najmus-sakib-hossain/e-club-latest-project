import { Head, Link } from '@inertiajs/react';
import {
    Armchair,
    BedDouble,
    ChevronRight,
    Droplets,
    Layers,
    LucideIcon,
    Sofa,
    Sparkles,
    Sun,
    TreePine,
    UtensilsCrossed,
    Wind,
} from 'lucide-react';

import { SiteLayout } from '@/components/site';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Category, SiteSettings } from '@/types/cms';

interface PageContentSection {
    id?: number;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    image: string | null;
    items: Record<string, unknown>[] | null;
}

interface CareTip {
    title: string;
    description: string;
}

interface CareCategory {
    id: string;
    icon?: string;
    title: string;
    description: string;
    tips: CareTip[];
}

interface GeneralTip {
    icon?: string;
    title: string;
    tip: string;
}

interface CareProps {
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

// Icon mapping helper
const iconMap: Record<string, LucideIcon> = {
    'tree-pine': TreePine,
    sofa: Sofa,
    armchair: Armchair,
    layers: Layers,
    'bed-double': BedDouble,
    'utensils-crossed': UtensilsCrossed,
    sun: Sun,
    droplets: Droplets,
    wind: Wind,
    sparkles: Sparkles,
};

const getIcon = (iconName?: string): LucideIcon => {
    return iconMap[iconName || ''] || Sparkles;
};

// Default care categories
const defaultCareCategories: CareCategory[] = [
    {
        id: 'wood',
        icon: 'tree-pine',
        title: 'Wood E-Club',
        description: 'Care tips for wooden tables, chairs, cabinets, and more',
        tips: [
            {
                title: 'Regular Dusting',
                description:
                    'Dust weekly with a soft, lint-free cloth. Avoid feather dusters as they can scratch the surface.',
            },
            {
                title: 'Cleaning',
                description:
                    'Use a slightly damp cloth with mild soap. Wipe dry immediately to prevent water damage.',
            },
            {
                title: 'Polishing',
                description:
                    'Apply e-club polish or wax every 3-6 months. Use products specifically designed for wood.',
            },
            {
                title: 'Avoid Direct Sunlight',
                description:
                    'Position away from windows or use curtains to prevent fading and drying out.',
            },
            {
                title: 'Use Coasters',
                description:
                    'Always use coasters, placemats, and trivets to protect from heat and moisture rings.',
            },
            {
                title: 'Humidity Control',
                description:
                    'Maintain 40-45% humidity to prevent cracking or warping. Use humidifiers in dry seasons.',
            },
        ],
    },
    {
        id: 'upholstery',
        icon: 'sofa',
        title: 'Upholstered E-Club',
        description: 'Maintain sofas, chairs, and fabric-covered pieces',
        tips: [
            {
                title: 'Vacuum Regularly',
                description:
                    'Vacuum weekly using upholstery attachment to remove dust, crumbs, and pet hair.',
            },
            {
                title: 'Rotate Cushions',
                description:
                    'Flip and rotate cushions monthly for even wear and to maintain shape.',
            },
            {
                title: 'Spot Cleaning',
                description:
                    'Blot spills immediately with clean cloth. Never rub as it can spread the stain.',
            },
            {
                title: 'Professional Cleaning',
                description:
                    'Have upholstery professionally cleaned every 12-18 months for deep cleaning.',
            },
            {
                title: 'Keep Away from Heat',
                description:
                    'Position away from radiators, fireplaces, and direct sunlight to prevent fading.',
            },
            {
                title: 'Use Fabric Protector',
                description:
                    'Apply fabric protector spray to guard against stains and spills.',
            },
        ],
    },
    {
        id: 'leather',
        icon: 'armchair',
        title: 'Leather E-Club',
        description: 'Special care for leather sofas and chairs',
        tips: [
            {
                title: 'Dust Regularly',
                description:
                    'Wipe with dry microfiber cloth weekly to remove dust and prevent buildup.',
            },
            {
                title: 'Condition Leather',
                description:
                    'Apply leather conditioner every 6-12 months to keep it supple and prevent cracking.',
            },
            {
                title: 'Clean Spills Quickly',
                description:
                    'Blot spills immediately with absorbent cloth. Let air dry naturally.',
            },
            {
                title: 'Avoid Sharp Objects',
                description:
                    'Keep pets and sharp objects away to prevent scratches and tears.',
            },
            {
                title: 'No Direct Sunlight',
                description:
                    'Leather can fade and dry out in sunlight. Use window treatments to protect.',
            },
            {
                title: 'Use Proper Products',
                description:
                    'Never use harsh chemicals, detergents, or all-purpose cleaners on leather.',
            },
        ],
    },
    {
        id: 'laminate',
        icon: 'layers',
        title: 'Laminate & Veneer',
        description: 'Care for laminated and veneered surfaces',
        tips: [
            {
                title: 'Daily Cleaning',
                description:
                    'Wipe with soft damp cloth. Dry immediately to prevent water damage to edges.',
            },
            {
                title: 'Avoid Abrasives',
                description:
                    'Never use abrasive cleaners, scrub pads, or steel wool that can scratch the surface.',
            },
            {
                title: 'Heat Protection',
                description:
                    'Always use trivets and heat pads. Hot items can damage laminate permanently.',
            },
            {
                title: 'Edge Care',
                description:
                    'Pay special attention to edges where water can seep in and cause peeling.',
            },
            {
                title: 'Mild Cleaning Solution',
                description:
                    'Use mild dish soap diluted in water for stubborn marks. Avoid excess moisture.',
            },
            {
                title: 'No Harsh Chemicals',
                description:
                    'Avoid bleach, ammonia, and strong solvents that can discolor or damage the surface.',
            },
        ],
    },
    {
        id: 'mattress',
        icon: 'bed-double',
        title: 'Mattresses',
        description: 'Extend the life of your mattress',
        tips: [
            {
                title: 'Use Mattress Protector',
                description:
                    'Always use a waterproof mattress protector to guard against spills and stains.',
            },
            {
                title: 'Rotate Regularly',
                description:
                    'Rotate head to foot every 3 months to ensure even wear.',
            },
            {
                title: 'Air Out',
                description:
                    'Remove bedding and air out the mattress monthly to reduce moisture buildup.',
            },
            {
                title: 'Vacuum Surface',
                description:
                    'Vacuum the mattress surface every few months to remove dust mites and allergens.',
            },
            {
                title: 'Proper Support',
                description:
                    'Ensure your bed frame provides adequate support to prevent sagging.',
            },
            {
                title: 'Avoid Jumping',
                description:
                    'Do not jump or stand on the mattress to prevent damage to internal springs.',
            },
        ],
    },
    {
        id: 'dining',
        icon: 'utensils-crossed',
        title: 'Dining E-Club',
        description: 'Keep your dining sets looking new',
        tips: [
            {
                title: 'Wipe After Use',
                description:
                    'Clean dining tables after each meal to prevent food stains from setting.',
            },
            {
                title: 'Use Tablecloths',
                description:
                    'Protect surfaces with tablecloths or placemats during meals.',
            },
            {
                title: 'Chair Pads',
                description:
                    'Use felt pads under chair legs to prevent scratches on floors and chairs.',
            },
            {
                title: 'Tighten Hardware',
                description:
                    'Check and tighten screws and bolts on chairs regularly for safety.',
            },
            {
                title: 'Avoid Sliding',
                description:
                    'Lift chairs instead of dragging to prevent damage to legs and floor.',
            },
            {
                title: 'Glass Care',
                description:
                    'Clean glass tabletops with glass cleaner. Avoid placing heavy items directly.',
            },
        ],
    },
];

const defaultGeneralTips: GeneralTip[] = [
    {
        icon: 'sun',
        title: 'Sunlight',
        tip: 'Keep e-club away from direct sunlight to prevent fading and drying.',
    },
    {
        icon: 'droplets',
        title: 'Moisture',
        tip: 'Wipe up spills immediately and avoid placing wet items on e-club.',
    },
    {
        icon: 'wind',
        title: 'Air Circulation',
        tip: 'Ensure good air circulation to prevent mold and musty odors.',
    },
    {
        icon: 'sparkles',
        title: 'Regular Cleaning',
        tip: 'Establish a regular cleaning routine to prevent buildup of dirt and dust.',
    },
];

// Default dos
const defaultDos = [
    { text: 'Dust e-club regularly with soft cloth' },
    { text: 'Use coasters and placemats' },
    { text: 'Clean spills immediately' },
    { text: 'Use proper cleaning products' },
    { text: 'Maintain consistent humidity levels' },
    { text: 'Lift e-club when moving' },
    { text: "Follow manufacturer's care instructions" },
    { text: 'Schedule regular professional cleaning' },
];

// Default don'ts
const defaultDonts = [
    { text: 'Place in direct sunlight' },
    { text: 'Use abrasive cleaners or scrubbers' },
    { text: 'Put hot items directly on surfaces' },
    { text: 'Use harsh chemicals or bleach' },
    { text: 'Drag e-club across floors' },
    { text: 'Expose to extreme temperatures' },
    { text: 'Over-wet wood or upholstery' },
    { text: 'Ignore small repairs' },
];

interface DoItem {
    text: string;
}

export default function Care({
    settings,
    categories,
    page,
    content,
}: CareProps) {
    // Get content from database or use defaults
    const heroTitle = content?.hero?.title || 'Care & Maintenance Guide';
    const heroSubtitle =
        content?.hero?.subtitle ||
        'Proper care extends the life and beauty of your e-club. Follow our expert tips to keep your e-club looking its best for years to come.';

    const careCategories =
        (content?.care_categories?.items as CareCategory[]) ||
        defaultCareCategories;
    const generalTips =
        (content?.general_tips?.items as GeneralTip[]) || defaultGeneralTips;
    const dos = (content?.dos?.items as DoItem[]) || defaultDos;
    const donts = (content?.donts?.items as DoItem[]) || defaultDonts;
    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={page?.meta_title || 'Care & Maintenance'}>
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
                            Care & Maintenance
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
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        {heroSubtitle}
                    </p>
                </div>
            </div>

            {/* General Tips */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-2xl font-bold">
                        {content?.general_tips?.title || 'General Care Tips'}
                    </h2>
                    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-4">
                        {generalTips.map((tip, index) => {
                            const IconComponent = getIcon(tip.icon);
                            return (
                                <Card key={index} className="text-center">
                                    <CardContent className="pt-6">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                            <IconComponent className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 font-semibold">
                                            {tip.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {tip.tip}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Category-specific Care */}
            <div className="bg-muted py-12">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-2xl font-bold">
                        {content?.care_categories?.title ||
                            'Care by E-Club Type'}
                    </h2>
                    <Tabs
                        defaultValue={careCategories[0]?.id || 'wood'}
                        className="mx-auto max-w-4xl"
                    >
                        <TabsList className="mb-8 flex flex-wrap justify-center gap-2 bg-transparent">
                            {careCategories.map((category) => {
                                const IconComponent = getIcon(category.icon);
                                return (
                                    <TabsTrigger
                                        key={category.id}
                                        value={category.id}
                                        className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        <IconComponent className="mr-2 h-4 w-4" />
                                        {category.title}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        {careCategories.map((category) => {
                            const IconComponent = getIcon(category.icon);
                            return (
                                <TabsContent
                                    key={category.id}
                                    value={category.id}
                                >
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                                    <IconComponent className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle>
                                                        {category.title}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {category.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {category.tips.map(
                                                    (tip, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex gap-3"
                                                        >
                                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                <h4 className="mb-1 text-sm font-semibold">
                                                                    {tip.title}
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {
                                                                        tip.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </div>
            </div>

            {/* Do's and Don'ts */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-2xl font-bold">
                        Quick Do's and Don'ts
                    </h2>
                    <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
                        {/* Do's */}
                        <Card className="border-primary/30">
                            <CardHeader className="bg-primary/10">
                                <CardTitle className="text-primary">
                                    ✓ {content?.dos?.title || "Do's"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <ul className="space-y-3 text-sm">
                                    {dos.map((item, index) => (
                                        <li key={index}>✓ {item.text}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Don'ts */}
                        <Card className="border-destructive/30">
                            <CardHeader className="bg-destructive/10">
                                <CardTitle className="text-destructive">
                                    ✗ {content?.donts?.title || "Don'ts"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <ul className="space-y-3 text-sm">
                                    {donts.map((item, index) => (
                                        <li key={index}>✗ {item.text}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-foreground py-12 text-background">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-2xl font-bold">
                        Need Professional Help?
                    </h2>
                    <p className="mx-auto mb-6 max-w-xl text-background/80">
                        Our team offers professional e-club care and repair
                        services. Contact us to schedule a service.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </SiteLayout>
    );
}
