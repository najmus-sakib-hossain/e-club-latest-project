import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
    HomeContent,
    HeroSlide,
    Category,
    Product,
    FeatureCard,
    TrustedCompany,
    FeaturedProduct,
    SiteSettings,
    CustomerReview,
} from '@/types/cms';

const API_BASE = '/api';

// Fetch functions
async function fetchHomeContent(): Promise<HomeContent> {
    const response = await fetch(`${API_BASE}/home-content`);
    if (!response.ok) throw new Error('Failed to fetch home content');
    return response.json();
}

async function fetchHeroSlides(): Promise<HeroSlide[]> {
    const response = await fetch(`${API_BASE}/hero-slides`);
    if (!response.ok) throw new Error('Failed to fetch hero slides');
    return response.json();
}

async function fetchCategories(type?: string): Promise<Category[]> {
    const url = type ? `${API_BASE}/categories/${type}` : `${API_BASE}/categories`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
}

async function fetchNewArrivals(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/new-arrivals`);
    if (!response.ok) throw new Error('Failed to fetch new arrivals');
    return response.json();
}

async function fetchFeaturedProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/featured-products`);
    if (!response.ok) throw new Error('Failed to fetch featured products');
    return response.json();
}

async function fetchBestSellers(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/best-sellers`);
    if (!response.ok) throw new Error('Failed to fetch best sellers');
    return response.json();
}

async function fetchFeaturedProduct(): Promise<FeaturedProduct | null> {
    const response = await fetch(`${API_BASE}/featured-product`);
    if (!response.ok) throw new Error('Failed to fetch featured product');
    return response.json();
}

async function fetchTrustedCompanies(): Promise<TrustedCompany[]> {
    const response = await fetch(`${API_BASE}/trusted-companies`);
    if (!response.ok) throw new Error('Failed to fetch trusted companies');
    return response.json();
}

async function fetchCustomerReviews(): Promise<CustomerReview[]> {
    const response = await fetch(`${API_BASE}/customer-reviews`);
    if (!response.ok) throw new Error('Failed to fetch customer reviews');
    return response.json();
}

async function fetchFeatureCards(): Promise<FeatureCard[]> {
    const response = await fetch(`${API_BASE}/feature-cards`);
    if (!response.ok) throw new Error('Failed to fetch feature cards');
    return response.json();
}

async function fetchSiteSettings(): Promise<SiteSettings> {
    const response = await fetch(`${API_BASE}/site-settings`);
    if (!response.ok) throw new Error('Failed to fetch site settings');
    return response.json();
}

// Query Keys
export const queryKeys = {
    homeContent: ['homeContent'] as const,
    heroSlides: ['heroSlides'] as const,
    categories: (type?: string) => ['categories', type] as const,
    newArrivals: ['newArrivals'] as const,
    featuredProducts: ['featuredProducts'] as const,
    bestSellers: ['bestSellers'] as const,
    featuredProduct: ['featuredProduct'] as const,
    trustedCompanies: ['trustedCompanies'] as const,
    customerReviews: ['customerReviews'] as const,
    featureCards: ['featureCards'] as const,
    siteSettings: ['siteSettings'] as const,
};

// Hooks
export function useHomeContent() {
    return useQuery({
        queryKey: queryKeys.homeContent,
        queryFn: fetchHomeContent,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useHeroSlides() {
    return useQuery({
        queryKey: queryKeys.heroSlides,
        queryFn: fetchHeroSlides,
        staleTime: 1000 * 60 * 5,
    });
}

export function useCategories(type?: string) {
    return useQuery({
        queryKey: queryKeys.categories(type),
        queryFn: () => fetchCategories(type),
        staleTime: 1000 * 60 * 5,
    });
}

export function useNewArrivals() {
    return useQuery({
        queryKey: queryKeys.newArrivals,
        queryFn: fetchNewArrivals,
        staleTime: 1000 * 60 * 5,
    });
}

export function useFeaturedProducts() {
    return useQuery({
        queryKey: queryKeys.featuredProducts,
        queryFn: fetchFeaturedProducts,
        staleTime: 1000 * 60 * 5,
    });
}

export function useBestSellers() {
    return useQuery({
        queryKey: queryKeys.bestSellers,
        queryFn: fetchBestSellers,
        staleTime: 1000 * 60 * 5,
    });
}

export function useFeaturedProduct() {
    return useQuery({
        queryKey: queryKeys.featuredProduct,
        queryFn: fetchFeaturedProduct,
        staleTime: 1000 * 60 * 5,
    });
}

export function useTrustedCompanies() {
    return useQuery({
        queryKey: queryKeys.trustedCompanies,
        queryFn: fetchTrustedCompanies,
        staleTime: 1000 * 60 * 5,
    });
}

export function useCustomerReviews() {
    return useQuery({
        queryKey: queryKeys.customerReviews,
        queryFn: fetchCustomerReviews,
        staleTime: 1000 * 60 * 5,
    });
}

export function useFeatureCards() {
    return useQuery({
        queryKey: queryKeys.featureCards,
        queryFn: fetchFeatureCards,
        staleTime: 1000 * 60 * 5,
    });
}

export function useSiteSettings() {
    return useQuery({
        queryKey: queryKeys.siteSettings,
        queryFn: fetchSiteSettings,
        staleTime: 1000 * 60 * 5,
    });
}

// Hook to invalidate all home content queries
export function useInvalidateHomeContent() {
    const queryClient = useQueryClient();
    
    return () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.homeContent });
        queryClient.invalidateQueries({ queryKey: queryKeys.heroSlides });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({ queryKey: queryKeys.newArrivals });
        queryClient.invalidateQueries({ queryKey: queryKeys.bestSellers });
        queryClient.invalidateQueries({ queryKey: queryKeys.featuredProduct });
        queryClient.invalidateQueries({ queryKey: queryKeys.trustedCompanies });
        queryClient.invalidateQueries({ queryKey: queryKeys.customerReviews });
        queryClient.invalidateQueries({ queryKey: queryKeys.featureCards });
        queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings });
    };
}
