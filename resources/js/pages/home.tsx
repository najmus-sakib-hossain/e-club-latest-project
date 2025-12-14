import { Head } from '@inertiajs/react';

import {
    CollectionGrid,
    CustomerReviews,
    FeatureCards,
    FeaturedProduct,
    HeroCarousel,
    ProductGrid,
    TrustedCompanies,
} from '@/components/home';
import { SiteLayout } from '@/components/site';
import { Skeleton } from '@/components/ui/skeleton';
import { useHomeContent } from '@/hooks/use-cms';

export default function Home() {
    const { data, isLoading, error } = useHomeContent();

    if (error) {
        return (
            <SiteLayout>
                <Head title="Home" />
                <div className="flex min-h-[50vh] items-center justify-center">
                    <p className="text-destructive">Failed to load content. Please try again.</p>
                </div>
            </SiteLayout>
        );
    }

    if (isLoading || !data) {
        return (
            <SiteLayout>
                <Head title="Home" />
                {/* Loading skeleton */}
                <div className="h-[500px] w-full animate-pulse bg-muted" />
                <div className="container mx-auto px-4 py-8">
                    <div className="grid gap-6 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-40" />
                        ))}
                    </div>
                </div>
            </SiteLayout>
        );
    }

    return (
        <SiteLayout settings={data.siteSettings} categories={[
            ...data.businessCollections,
            ...data.familyCollections,
            ...data.seatingCollections,
        ]}>
            <Head title="Home" />

            {/* Hero Carousel */}
            <HeroCarousel slides={data.heroSlides} />

            {/* Feature Cards */}
            <FeatureCards cards={data.featureCards} />

            {/* Business Furniture Collections */}
            <CollectionGrid
                title="Business Furniture Collections"
                categories={data.businessCollections}
                columns={3}
            />

            {/* Family Furniture Collections */}
            <CollectionGrid
                title="Family Furniture Collections"
                categories={data.familyCollections}
                columns={4}
            />

            {/* Chair & Seating */}
            <CollectionGrid
                title="Chair & Seating"
                categories={data.seatingCollections}
                columns={4}
            />

            {/* New Arrivals */}
            <ProductGrid
                title="new arrivals"
                subtitle="→"
                products={data.newArrivals}
            />

            {/* Featured Products */}
            <ProductGrid
                title="featured products"
                subtitle="→"
                products={data.featuredProducts}
            />

            {/* Best Sellers */}
            <ProductGrid
                title="best sellers"
                subtitle="→"
                products={data.bestSellers}
            />

            {/* Customer Reviews */}
            <CustomerReviews reviews={data.customerReviews} />

            {/* Featured Product */}
            {data.featuredProduct && (
                <FeaturedProduct featured={data.featuredProduct} />
            )}

            {/* Trusted Companies */}
            <TrustedCompanies companies={data.trustedCompanies} />
        </SiteLayout>
    );
}
