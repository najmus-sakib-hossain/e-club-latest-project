import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Import types from the central types file
import type {
    HeroSlide,
    Category,
    Product,
    FeatureCard,
    TrustedCompany,
    SiteSettings,
    FeaturedProduct,
} from '@/types/cms';

// Re-export types for convenience
export type { HeroSlide, Category, Product, FeatureCard, TrustedCompany, SiteSettings, FeaturedProduct };

interface CMSState {
    // Data
    heroSlides: HeroSlide[];
    categories: Category[];
    products: Product[];
    featureCards: FeatureCard[];
    trustedCompanies: TrustedCompany[];
    siteSettings: SiteSettings | null;
    featuredProduct: FeaturedProduct | null;

    // Loading states
    isLoading: boolean;
    
    // Invalidation trigger - increment to trigger refetch
    invalidationTrigger: number;

    // Actions
    setHeroSlides: (slides: HeroSlide[]) => void;
    setCategories: (categories: Category[]) => void;
    setProducts: (products: Product[]) => void;
    setFeatureCards: (cards: FeatureCard[]) => void;
    setTrustedCompanies: (companies: TrustedCompany[]) => void;
    setSiteSettings: (settings: SiteSettings) => void;
    setFeaturedProduct: (featured: FeaturedProduct | null) => void;
    setLoading: (loading: boolean) => void;
    
    // Trigger refetch across all queries
    invalidateAll: () => void;
}

export const useCMSStore = create<CMSState>()(
    devtools(
        (set) => ({
            // Initial data
            heroSlides: [],
            categories: [],
            products: [],
            featureCards: [],
            trustedCompanies: [],
            siteSettings: null,
            featuredProduct: null,
            isLoading: false,
            invalidationTrigger: 0,

            // Actions
            setHeroSlides: (slides) => set({ heroSlides: slides }),
            setCategories: (categories) => set({ categories }),
            setProducts: (products) => set({ products }),
            setFeatureCards: (cards) => set({ featureCards: cards }),
            setTrustedCompanies: (companies) => set({ trustedCompanies: companies }),
            setSiteSettings: (settings) => set({ siteSettings: settings }),
            setFeaturedProduct: (featured) => set({ featuredProduct: featured }),
            setLoading: (loading) => set({ isLoading: loading }),
            
            invalidateAll: () => set((state) => ({ 
                invalidationTrigger: state.invalidationTrigger + 1 
            })),
        }),
        { name: 'cms-store' }
    )
);

// Selectors for better performance
export const selectHeroSlides = (state: CMSState) => state.heroSlides;
export const selectCategories = (state: CMSState) => state.categories;
export const selectProducts = (state: CMSState) => state.products;
export const selectNewArrivals = (state: CMSState) => 
    state.products.filter((p) => p.is_new_arrival && p.is_active);
export const selectFeaturedProducts = (state: CMSState) => 
    state.products.filter((p) => p.is_featured && p.is_active);
export const selectFeatureCards = (state: CMSState) => state.featureCards;
export const selectTrustedCompanies = (state: CMSState) => state.trustedCompanies;
export const selectSiteSettings = (state: CMSState) => state.siteSettings;
export const selectFeaturedProduct = (state: CMSState) => state.featuredProduct;
