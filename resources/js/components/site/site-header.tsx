import { Link, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    Facebook,
    Heart,
    Instagram,
    Menu,
    Search,
    ShoppingCart,
    Twitter,
    User,
    X,
    LogIn,
    UserPlus,
    Settings,
    LogOut,
    CalendarCheck,
    Phone,
    Clock,
    Package,
    Youtube,
    Mail,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartSheet } from '@/components/site/cart-sheet';
import { SearchCommand } from '@/components/site/search-command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import type { Category, NavigationMenu, SiteSettings } from '@/types/cms';
import type { SharedData } from '@/types';

interface SiteHeaderProps {
    settings?: SiteSettings;
    categories?: Category[];
}

// Convert flat navigation tree to structured object for mega menu
function buildNavigationStructure(navigation: NavigationMenu[]): Record<string, Record<string, string[]>> {
    const structure: Record<string, Record<string, string[]>> = {};

    navigation.forEach(mainItem => {
        if (mainItem.type === 'main' && mainItem.children) {
            const categories: Record<string, string[]> = {};

            mainItem.children.forEach(categoryItem => {
                if (categoryItem.type === 'category' && categoryItem.children) {
                    categories[categoryItem.name] = categoryItem.children.map(item => item.name);
                }
            });

            structure[mainItem.name] = categories;
        }
    });

    return structure;
}

// Default navigation structure (fallback)
const defaultNavigationStructure: Record<string, Record<string, string[]>> = {
    'Tables & Desks': {
        'Family Tables & Desks': [
            'Study Tables',
            'Dining Tables',
            'Dressing Tables',
            'Computer Tables',
            'Gaming Tables',
            "Kid's Tables",
        ],
        'Business Tables & Desks': [
            'Executive Desks',
            'Workstations',
            'Conference Tables',
            'Reception Desks',
            'Speech Podium (Lectern)',
            'Class Room Tables',
            'Restaurant Tables',
        ],
        'Multipurpose Tables': [
            'Height Adjustable Tables',
            'Side Tables',
            'Center Tables',
            'Round Tables',
            'Portable Tables',
            'Standing Tables',
            'Overbed Tables',
            'L-Shape Tables',
            'Space Saving Tables',
        ],
        'Accessories & Components': [
            'Footrests',
            'Power Managements',
            'Monitor Arm',
            'Keyboard Trays',
            'CPU Stands',
            'Table Tops',
        ],
    },
    'Beds & Mattresses': {
        'Beds': [
            'King Size Beds',
            'Queen Size Beds',
            'Single Beds',
            'Bunk Beds',
            'Sofa Cum Beds',
        ],
        'Mattresses': [
            'Memory Foam',
            'Spring Mattress',
            'Orthopedic Mattress',
        ],
        'Bedroom E-Club': [
            'Wardrobes',
            'Nightstands',
            'Dressers',
        ],
    },
    'Chairs': {
        'Office Chairs': [
            'Executive Chairs',
            'Ergonomic Chairs',
            'Mesh Chairs',
            'Task Chairs',
            'Gaming Chairs',
        ],
        'Home Chairs': [
            'Dining Chairs',
            'Lounge Chairs',
            'Accent Chairs',
            'Rocking Chairs',
        ],
        'Seating': [
            'Bar Stools',
            'Counter Stools',
            'Ottomans',
            'Benches',
        ],
    },
    'Sofas': {
        'Living Room Sofas': [
            'Sectional Sofas',
            'L-Shaped Sofas',
            'Recliners',
            'Loveseats',
            'Sleeper Sofas',
        ],
        'Materials': [
            'Leather Sofas',
            'Fabric Sofas',
            'Velvet Sofas',
        ],
    },
    'Storage': {
        'Living Room Storage': [
            'TV Units',
            'Bookshelves',
            'Display Cabinets',
            'Shoe Racks',
        ],
        'Office Storage': [
            'Filing Cabinets',
            'Office Shelves',
            'Lockers',
        ],
        'Bedroom Storage': [
            'Wardrobes',
            'Chest of Drawers',
            'Closet Organizers',
        ],
    },
    'Series': {
        'Popular Series': [
            'Modern Collection',
            'Classic Collection',
            'Minimalist Series',
            'Industrial Series',
        ],
    },
    'Others': {
        'Accessories': [
            'Mirrors',
            'Rugs',
            'Lighting',
            'Decor',
        ],
        'Outdoor': [
            'Garden E-Club',
            'Patio Sets',
            'Outdoor Chairs',
        ],
    }
};

export function SiteHeader({ settings, categories = [] }: SiteHeaderProps) {
    const { auth, navigation, siteSettings: sharedSettings } = usePage<SharedData>().props;
    const user = auth?.user;
    const isAuthenticated = !!user;

    // Use provided settings or shared settings
    const effectiveSettings = settings || sharedSettings;

    // Build navigation structure from database or use default
    const navigationStructure = navigation && navigation.length > 0
        ? buildNavigationStructure(navigation)
        : defaultNavigationStructure;

    const navItems = Object.keys(navigationStructure);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [meetingMenuOpen, setMeetingMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [announcementVisible, setAnnouncementVisible] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const meetingMenuRef = useRef<HTMLDivElement>(null);

    const cartItems = useCartStore((state) => state.items);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistItems = useWishlistStore((state) => state.items);
    const wishlistCount = wishlistItems.length;

    // Helper to get setting values from nested structure
    const getSetting = (group: string, key: string, fallback: string = ''): string => {
        const groupSettings = effectiveSettings?.[group];
        if (groupSettings && typeof groupSettings === 'object') {
            return (groupSettings[key] as string) || fallback;
        }
        return fallback;
    };

    // Get values from settings
    const siteName = getSetting('general', 'site_name', 'E-Club');
    const siteLogo = getSetting('general', 'site_logo', '');
    const logoSrc = siteLogo ? `/storage/${siteLogo}` : '/logo.png';
    const headerPhone = getSetting('header', 'header_phone') || getSetting('contact', 'contact_phone') || getSetting('contact', 'phone', '');
    const headerEmail = getSetting('header', 'header_email') || getSetting('contact', 'contact_email') || getSetting('contact', 'email', '');
    const headerAnnouncement = getSetting('header', 'header_announcement', '');
    const headerAnnouncementEnabled = getSetting('header', 'header_announcement_enabled', '1') === '1';
    const socialFacebook = getSetting('social', 'social_facebook') || getSetting('social', 'facebook');
    const socialInstagram = getSetting('social', 'social_instagram') || getSetting('social', 'instagram');
    const socialTwitter = getSetting('social', 'social_twitter') || getSetting('social', 'twitter');
    const socialYoutube = getSetting('social', 'social_youtube') || getSetting('social', 'youtube');

    // Main header links settings
    const headerAboutVisible = getSetting('header', 'header_about_visible', '1') === '1';
    const headerAboutText = getSetting('header', 'header_about_text', 'About Us');
    const headerAboutUrl = getSetting('header', 'header_about_url', '/about');
    const headerContactVisible = getSetting('header', 'header_contact_visible', '1') === '1';
    const headerContactText = getSetting('header', 'header_contact_text', 'Contact Us');
    const headerContactUrl = getSetting('header', 'header_contact_url', '/contact');
    const headerHelpVisible = getSetting('header', 'header_help_visible', '1') === '1';
    const headerHelpText = getSetting('header', 'header_help_text', 'Help Center');
    const headerHelpUrl = getSetting('header', 'header_help_url', '/help');

    // Meeting request settings
    const headerMeetingVisible = getSetting('header', 'header_meeting_visible', '1') === '1';
    const headerMeetingText = getSetting('header', 'header_meeting_text', 'Meeting Request');
    const headerMeetingScheduleText = getSetting('header', 'header_meeting_schedule_text', 'Schedule Meeting');
    const headerMeetingScheduleUrl = getSetting('header', 'header_meeting_schedule_url', '/meeting/schedule');
    const headerMeetingCallbackText = getSetting('header', 'header_meeting_callback_text', 'Request Callback');
    const headerMeetingCallbackUrl = getSetting('header', 'header_meeting_callback_url', '/meeting/callback');
    const headerMeetingAvailabilityText = getSetting('header', 'header_meeting_availability_text', 'Check Availability');
    const headerMeetingAvailabilityUrl = getSetting('header', 'header_meeting_availability_url', '/meeting/availability');

    // Feature toggles
    const headerWishlistVisible = getSetting('header', 'header_wishlist_visible', '1') === '1';
    const headerCartVisible = getSetting('header', 'header_cart_visible', '1') === '1';

    const handleMouseEnter = (key: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setActiveDropdown(key);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150);
    };

    // Keyboard shortcut for search (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Announcement Bar */}
            {/* {headerAnnouncementEnabled && headerAnnouncement && announcementVisible && (
                <div className="bg-background text-foreground py-2 relative border-b">
                    <div className="container mx-auto px-4 lg:max-w-7xl">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 flex items-center justify-center gap-4 text-sm">
                                {(headerPhone || headerEmail) && (
                                    <div className="hidden md:flex items-center gap-4 absolute left-4">
                                        {headerPhone && (
                                            <a href={`tel:${headerPhone}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                                                <Phone className="h-3.5 w-3.5" />
                                                <span>{headerPhone}</span>
                                            </a>
                                        )}
                                        {headerEmail && (
                                            <a href={`mailto:${headerEmail}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                                                <Mail className="h-3.5 w-3.5" />
                                                <span>{headerEmail}</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                                <span className="text-center">{headerAnnouncement}</span>
                                {(socialFacebook || socialInstagram || socialTwitter || socialYoutube) && (
                                    <div className="hidden md:flex items-center gap-3 absolute right-12">
                                        {socialFacebook && (
                                            <a href={socialFacebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                                <Facebook className="h-4 w-4" />
                                            </a>
                                        )}
                                        {socialInstagram && (
                                            <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                                <Instagram className="h-4 w-4" />
                                            </a>
                                        )}
                                        {socialTwitter && (
                                            <a href={socialTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                                <Twitter className="h-4 w-4" />
                                            </a>
                                        )}
                                        {socialYoutube && (
                                            <a href={socialYoutube} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                                <Youtube className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setAnnouncementVisible(false)}
                                className="absolute right-4 text-foreground/60 hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Main Header - White background */}
            <div className="bg-background border-b">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-start lg:justify-between gap-4">
                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-full overflow-y-auto">
                                <div className="p-4">
                                    <Link href="/" className="flex items-center mb-6">
                                        {/* Logo */}
                                        <img src={logoSrc} alt={siteName} className="h-10" />
                                    </Link>
                                    <nav className="flex flex-col gap-2">
                                        <Link
                                            href="/products"
                                            className="text-base font-medium py-2 border-b"
                                        >
                                            All E-Club
                                        </Link>
                                        {navItems.map((item) => (
                                            <div key={item} className="border-b pb-2">
                                                <p className="font-medium py-2">{item}</p>
                                                <div className="pl-4 space-y-1">
                                                    {Object.entries(navigationStructure[item] || {}).map(([category, items]) => (
                                                        <div key={category} className="mb-2">
                                                            <p className="text-sm text-muted-foreground font-medium">{category}</p>
                                                            {items.slice(0, 3).map((subItem) => (
                                                                <Link
                                                                    key={subItem}
                                                                    href={`/products?category=${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                                                                    className="block text-sm py-1 text-muted-foreground hover:text-primary"
                                                                >
                                                                    {subItem}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <img src={logoSrc} alt={siteName} className="h-10" />
                        </Link>

                        <div className="flex-1 lg:hidden" />

                        {/* Search Bar - Desktop (opens command dialog) */}
                        <div className="hidden md:flex flex-1 max-w-md mx-4">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="relative w-full flex items-center h-10 rounded-md border border-input bg-background px-4 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <Search className="mr-2 h-4 w-4" />
                                <span className="flex-1 text-left">Search products...</span>
                                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </button>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1 md:gap-2">
                            {/* Mobile Search Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {/* About */}
                            {headerAboutVisible && (
                                <Link
                                    href={headerAboutUrl}
                                    className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary px-2"
                                >
                                    <span>{headerAboutText}</span>
                                </Link>
                            )}

                            {/* Contact Us */}
                            {headerContactVisible && (
                                <Link
                                    href={headerContactUrl}
                                    className="hidden lg:flex items-center text-sm text-muted-foreground hover:text-primary px-2"
                                >
                                    {headerContactText}
                                </Link>
                            )}

                            {/* Help Center */}
                            {headerHelpVisible && (
                                <Link
                                    href={headerHelpUrl}
                                    className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary px-2"
                                >
                                    <span>{headerHelpText}</span>
                                </Link>
                            )}

                            {/* Meeting Request with Dropdown */}
                            {/* {headerMeetingVisible && (
                                <div
                                    className="relative hidden lg:block"
                                    ref={meetingMenuRef}
                                    onMouseEnter={() => setMeetingMenuOpen(true)}
                                    onMouseLeave={() => setMeetingMenuOpen(false)}
                                >
                                    <button
                                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary px-2 py-2"
                                    >
                                        <CalendarCheck className="h-4 w-4" />
                                        <span>{headerMeetingText}</span>
                                        <ChevronDown className={`h-3 w-3 transition-transform ${meetingMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {meetingMenuOpen && (
                                        <div className="absolute right-0 top-full pt-2 z-50">
                                            <div className="bg-popover text-popover-foreground rounded-lg shadow-lg border border-border py-2 min-w-[200px]">
                                                <Link
                                                    href={headerMeetingScheduleUrl}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                                                >
                                                    <CalendarCheck className="h-4 w-4" />
                                                    {headerMeetingScheduleText}
                                                </Link>
                                                <Link
                                                    href={headerMeetingCallbackUrl}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                                                >
                                                    <Phone className="h-4 w-4" />
                                                    {headerMeetingCallbackText}
                                                </Link>
                                                <Link
                                                    href={headerMeetingAvailabilityUrl}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                                                >
                                                    <Clock className="h-4 w-4" />
                                                    {headerMeetingAvailabilityText}
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )} */}

                            {/* Wishlist */}
                            {headerWishlistVisible && (
                                <Link
                                    href="/account/wishlist"
                                    className="relative p-2 text-muted-foreground hover:text-primary hidden sm:block"
                                >
                                    <Heart className="h-5 w-5" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* Cart - Opens CartSheet */}
                            {headerCartVisible && (
                                <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                                    <button
                                        className="relative p-2"
                                        onClick={() => setIsCartOpen(true)}
                                    >
                                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                                        {totalItems > 0 && (
                                            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                                                {totalItems}
                                            </span>
                                        )}
                                    </button>
                                </CartSheet>
                            )}

                            {/* User Account with Avatar Dropdown - Now at the end */}
                            <div
                                className="relative"
                                ref={userMenuRef}
                                onMouseEnter={() => setUserMenuOpen(true)}
                                onMouseLeave={() => setUserMenuOpen(false)}
                            >
                                <button
                                    className="flex items-center p-1 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                                >
                                    {isAuthenticated ? (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user?.avatar} alt={user?.name} />
                                            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                                                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    )}
                                </button>

                                {/* User Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full pt-2 z-50">
                                        <div className="bg-popover text-popover-foreground rounded-lg shadow-lg border border-border py-2 min-w-[200px]">
                                            {isAuthenticated ? (
                                                <>
                                                    {/* User Info */}
                                                    <div className="px-4 py-2 border-b border-border">
                                                        <p className="font-medium text-foreground">{user?.name}</p>
                                                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                                                    </div>

                                                    <Link
                                                        href="/account/profile"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                                                    >
                                                        <User className="h-4 w-4" />
                                                        My Profile
                                                    </Link>
                                                    <Link
                                                        href="/account"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                        My Account
                                                    </Link>
                                                    <Link
                                                        href="/account/orders"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                                                    >
                                                        <Package className="h-4 w-4" />
                                                        My Orders
                                                    </Link>
                                                    <div className="border-t border-border my-1" />
                                                    <Link
                                                        href="/logout"
                                                        method="post"
                                                        as="button"
                                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Sign Out
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link
                                                        href="/login"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                                                    >
                                                        <LogIn className="h-4 w-4" />
                                                        Sign In
                                                    </Link>
                                                    <Link
                                                        href="/register"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                                                    >
                                                        <UserPlus className="h-4 w-4" />
                                                        Create Account
                                                    </Link>
                                                    <div className="border-t border-border my-1" />
                                                    <Link
                                                        href="/account"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                        My Account
                                                    </Link>
                                                    <Link
                                                        href="/account/orders"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                                                    >
                                                        <Package className="h-4 w-4" />
                                                        My Orders
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Navigation */}
            <nav className="bg-primary hidden lg:block relative">
                <div className="container mx-auto px-4">
                    <div className="flex items-center h-12">
                        {/* All E-Club */}
                        <Link
                            href="/products"
                            className="px-4 h-full flex items-center text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            All E-Club
                        </Link>

                        {/* Navigation Items with Dropdowns */}
                        {navItems.map((item) => (
                            <div
                                key={item}
                                className="relative h-full flex items-center"
                                onMouseEnter={() => handleMouseEnter(item)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    className={`px-4 h-12 flex items-center gap-1 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors ${activeDropdown === item ? 'bg-primary/90' : ''
                                        }`}
                                >
                                    {item}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Underline indicator */}
                                {activeDropdown === item && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mega Menu Dropdown */}
                {activeDropdown && navigationStructure[activeDropdown] && (
                    <div
                        ref={dropdownRef}
                        className="absolute left-0 right-0 bg-popover text-popover-foreground shadow-lg border-t border-border z-50"
                        onMouseEnter={() => {
                            if (timeoutRef.current) {
                                clearTimeout(timeoutRef.current);
                            }
                        }}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="container mx-auto px-4 py-8">
                            <div className="grid grid-cols-4 gap-8">
                                {Object.entries(navigationStructure[activeDropdown]).map(([category, items]) => (
                                    <div key={category}>
                                        <h3 className="font-semibold text-foreground mb-3 text-base">
                                            {category}
                                        </h3>
                                        <ul className="space-y-2">
                                            {items.map((subItem) => (
                                                <li key={subItem}>
                                                    <Link
                                                        href={`/products?category=${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                                                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                                                    >
                                                        {subItem}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Navigation Bar */}
            <nav className="bg-primary lg:hidden">
                <div className="container mx-auto px-4">
                    <div className="flex items-center h-10 overflow-x-auto scrollbar-hide gap-1">
                        <Link
                            href="/products"
                            className="px-3 h-full flex items-center text-xs font-medium text-primary-foreground whitespace-nowrap"
                        >
                            All
                        </Link>
                        {navItems.slice(0, 5).map((item) => (
                            <Link
                                key={item}
                                href={`/products?type=${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="px-3 h-full flex items-center text-xs font-medium text-primary-foreground whitespace-nowrap"
                            >
                                {item.split(' ')[0]}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Search Command Dialog */}
            <SearchCommand open={isSearchOpen} onOpenChange={setIsSearchOpen} />
        </header>
    );
}
