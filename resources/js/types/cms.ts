// CMS Types for E-Club Store
export interface HeroSlide {
    id: number;
    title: string;
    subtitle: string | null;
    button_text: string | null;
    button_link: string | null;
    image: string | null;
    background_color: string | null;
    text_color: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface NavigationMenu {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    icon: string | null;
    url: string | null;
    type: 'main' | 'category' | 'item';
    location: string;
    is_active: boolean;
    sort_order: number;
    children?: NavigationMenu[];
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
    parent_id: number | null;
    parent?: Category;
    is_active: boolean;
    order: number;
    collection_type: 'business' | 'family' | 'seating' | null;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    sale_price: number | null;
    images: string[];
    category_id: number | null;
    category?: Category;
    is_featured: boolean;
    is_new_arrival: boolean;
    is_best_seller: boolean;
    is_active: boolean;
    specifications: Record<string, string> | null;
    sku: string | null;
    stock_quantity: number;
    created_at: string;
    updated_at: string;
}

export interface FeatureCard {
    id: number;
    title: string;
    description: string | null;
    icon: string | null;
    link: string | null;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface TrustedCompany {
    id: number;
    name: string;
    logo: string | null;
    logo_url: string | null;
    website: string | null;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SiteSettings {
    general?: {
        site_name?: string;
        site_tagline?: string;
        site_description?: string;
        logo?: string;
        footer_logo?: string;
    };
    contact?: {
        contact_email?: string;
        contact_phone?: string;
        contact_address?: string;
        email?: string;
        phone?: string;
        address?: string;
        contact_page_title?: string;
        contact_page_subtitle?: string;
        contact_form_title?: string;
        contact_form_subtitle?: string;
        contact_hours_weekday?: string;
        contact_hours_weekend?: string;
        address_line2?: string;
        contact_address_line2?: string;
        phone_support?: string;
        contact_phone_support?: string;
        email_support?: string;
        contact_email_support?: string;
    };
    social?: {
        social_facebook?: string;
        social_instagram?: string;
        social_twitter?: string;
        social_linkedin?: string;
        social_youtube?: string;
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        youtube?: string;
    };
    header?: {
        header_announcement?: string;
        header_announcement_enabled?: string;
        header_phone?: string;
        header_email?: string;
        // Main header links
        header_about_visible?: string;
        header_about_text?: string;
        header_about_url?: string;
        header_contact_visible?: string;
        header_contact_text?: string;
        header_contact_url?: string;
        header_help_visible?: string;
        header_help_text?: string;
        header_help_url?: string;
        // Meeting request section
        header_meeting_visible?: string;
        header_meeting_text?: string;
        header_meeting_schedule_text?: string;
        header_meeting_schedule_url?: string;
        header_meeting_callback_text?: string;
        header_meeting_callback_url?: string;
        header_meeting_availability_text?: string;
        header_meeting_availability_url?: string;
        // Feature toggles
        header_wishlist_visible?: string;
        header_cart_visible?: string;
    };
    homepage?: {
        new_arrivals_title?: string;
        new_arrivals_subtitle?: string;
        collection_title?: string;
        collection_subtitle?: string;
        best_sellers_title?: string;
        best_sellers_subtitle?: string;
        featured_products_title?: string;
        featured_products_subtitle?: string;
        customer_reviews_title?: string;
        customer_reviews_subtitle?: string;
        customer_reviews_description?: string;
        trusted_companies_title?: string;
    };
    footer?: {
        footer_text?: string;
        text?: string;
        footer_about?: string;
        footer_copyright?: string;
        // Section titles (both formats for backward compatibility)
        follow_us_title?: string;
        quick_links_title?: string;
        customer_service_title?: string;
        information_title?: string;
        payment_title?: string;
        footer_follow_us_title?: string;
        footer_quick_links_title?: string;
        footer_customer_service_title?: string;
        footer_information_title?: string;
        footer_payment_title?: string;
        footer_payment_methods?: { name?: string; logo?: string }[];
        // Link labels (both formats for backward compatibility)
        link_home?: string;
        link_products?: string;
        link_categories?: string;
        link_about?: string;
        link_contact?: string;
        link_help?: string;
        link_account?: string;
        link_order_tracking?: string;
        link_wishlist?: string;
        link_shipping?: string;
        link_returns?: string;
        link_faqs?: string;
        link_privacy?: string;
        link_terms?: string;
        link_warranty?: string;
        link_care?: string;
        link_stores?: string;
        // New footer_link_* format
        footer_link_home?: string;
        footer_link_products?: string;
        footer_link_categories?: string;
        footer_link_about?: string;
        footer_link_contact?: string;
        footer_link_help?: string;
        footer_link_account?: string;
        footer_link_order_tracking?: string;
        footer_link_wishlist?: string;
        footer_link_shipping?: string;
        footer_link_returns?: string;
        footer_link_faqs?: string;
        footer_link_privacy?: string;
        footer_link_terms?: string;
        footer_link_warranty?: string;
        footer_link_care?: string;
        footer_link_stores?: string;
        // Link URLs
        footer_link_home_url?: string;
        footer_link_products_url?: string;
        footer_link_categories_url?: string;
        footer_link_about_url?: string;
        footer_link_contact_url?: string;
        footer_link_help_url?: string;
        footer_link_account_url?: string;
        footer_link_order_tracking_url?: string;
        footer_link_wishlist_url?: string;
        footer_link_shipping_url?: string;
        footer_link_returns_url?: string;
        footer_link_faqs_url?: string;
        footer_link_privacy_url?: string;
        footer_link_terms_url?: string;
        footer_link_warranty_url?: string;
        footer_link_care_url?: string;
        footer_link_stores_url?: string;
        // Visibility toggles
        footer_show_quick_links?: string;
        footer_show_customer_service?: string;
        footer_show_information?: string;
        footer_show_payment_methods?: string;
        footer_show_social_links?: string;
        copyright_text?: string;
    };
    newsletter?: {
        title?: string;
        subtitle?: string;
    };
    labels?: {
        badge_new?: string;
        badge_sale?: string;
        badge_best_seller?: string;
        badge_featured?: string;
        quick_add_button?: string;
        add_to_cart_button?: string;
        view_details_button?: string;
        shop_now_button?: string;
        no_image_placeholder?: string;
        dimensions_label?: string;
    };
    // Page-specific settings (prefixed with page name)
    about?: {
        about_hero_title?: string;
        about_hero_description?: string;
        about_story_title?: string;
        about_story_content?: string;
        about_values_title?: string;
        about_values_subtitle?: string;
        about_team_title?: string;
        about_team_subtitle?: string;
        about_stats_years?: string;
        about_stats_customers?: string;
        about_stats_products?: string;
        about_stats_cities?: string;
    };
    contact?: {
        contact_page_title?: string;
        contact_page_subtitle?: string;
        contact_form_title?: string;
        contact_form_subtitle?: string;
        contact_address_title?: string;
        contact_hours_title?: string;
        contact_hours_weekday?: string;
        contact_hours_weekend?: string;
        // Legacy fields from other contact group
        contact_email?: string;
        contact_phone?: string;
        contact_address?: string;
        email?: string;
        phone?: string;
        address?: string;
    };
    cart?: {
        cart_page_title?: string;
        cart_empty_title?: string;
        cart_empty_message?: string;
        cart_summary_title?: string;
        cart_checkout_button?: string;
        cart_continue_shopping?: string;
    };
    checkout?: {
        checkout_page_title?: string;
        checkout_shipping_title?: string;
        checkout_payment_title?: string;
        checkout_order_summary_title?: string;
        checkout_place_order_button?: string;
    };
    [key: string]: Record<string, string | undefined> | undefined;
}

export interface FeaturedProduct {
    id: number;
    product_id: number;
    product?: Product;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    badge_text: string | null;
    button_text: string | null;
    button_link: string | null;
    image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    notes: string | null;
    items?: OrderItem[];
    subtotal: number;
    discount_amount: number;
    shipping_amount: number;
    total_amount: number;
    payment_method: 'bkash' | 'nagad' | 'rocket' | 'cod';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    transaction_id: string | null;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product?: Product;
    name: string;
    price: number;
    image: string | null;
    quantity: number;
}

export interface CustomerReview {
    id: number;
    name: string;
    role: string | null;
    review: string;
    rating: number;
    image: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface HomeContent {
    heroSlides: HeroSlide[];
    featureCards: FeatureCard[];
    businessCollections: Category[];
    familyCollections: Category[];
    seatingCollections: Category[];
    newArrivals: Product[];
    featuredProducts: Product[];
    bestSellers: Product[];
    featuredProduct: FeaturedProduct | null;
    trustedCompanies: TrustedCompany[];
    customerReviews: CustomerReview[];
    siteSettings: SiteSettings;
}

// Cart Types
export interface CartItem {
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export interface GuestCheckout {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
}
