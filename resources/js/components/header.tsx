import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Search, ShoppingCart, User } from 'lucide-react';
import React, { useState } from 'react';

// --- Data for Dropdowns ---

const committeeItems = [
    {
        title: 'Advisors',
        description:
            'Industry veterans offering strategic guidance to the E-Club.',
    },
    {
        title: 'Governing Body',
        description:
            'The leadership team setting the direction for the E-Club.',
    },
    {
        title: 'Executive Body',
        description: 'Overseeing the day-to-day operations of the E-Club.',
    },
    {
        title: 'Founders',
        description: 'The individuals who established the E-Club.',
    },
    {
        title: 'Forums',
        description:
            'Platforms for members to connect and discuss various topics.',
    },
    {
        title: 'Standing Committee',
        description: 'A permanent committee with ongoing responsibilities.',
    },
    {
        title: 'Project Directors',
        description: 'Members leading specific E-Club projects.',
    },
    {
        title: 'Administrative Team',
        description:
            'The Team managing daily tasks to ensure smooth operations.',
    },
];

const alumniYears = ['EC 2023-24', 'EC 2022-23', 'EC 2021-22', 'EC 2020-21'];

const membershipItems = [
    {
        title: 'Benefits of Membership',
        description:
            'Discover the exclusive advantages of being an E-Club member.',
    },
    {
        title: 'Renew Membership',
        description:
            'Continue your E-Club journey and access ongoing benefits.',
    },
    {
        title: 'Member Directory',
        description: 'Connect and collaborate with fellow E-Club members.',
    },
];

const eventItems = [
    {
        title: 'Upcoming Events',
        description:
            'Discover inspiring workshops, networking events, and more.',
    },
    {
        title: 'Past Events',
        description: 'Relive the highlights and access past event resources.',
    },
    {
        title: 'Request for Event',
        description: 'Join or suggest! Shape E-Club events together.',
    },
];

const mediaItems = [
    {
        title: 'Notice and Updates',
        description: 'Stay informed on E-Club happenings and industry news.',
    },
    {
        title: 'Press Releases',
        description: 'Official announcements and media coverage of the E-Club.',
    },
    {
        title: 'Album',
        description: 'Immerse yourself in E-Club events and activities album',
    },
    {
        title: 'Newsletter Archive',
        description: 'Catch up on past E-Club news and insights.',
    },
    {
        title: 'Blog',
        description: 'Catch up on past E-Club news and insights.',
    },
];

// --- Helper Components ---

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className,
                    )}
                    {...props}
                >
                    <div className="text-sm leading-none font-semibold underline decoration-transparent underline-offset-4 transition-all hover:decoration-current">
                        {title}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';

// --- Main Header Component ---

interface HeaderProps {
    navigationMenus?: any;
    cartItemCount?: number;
}

export default function Header({
    navigationMenus,
    cartItemCount = 0,
}: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality
        console.log('Searching for:', searchQuery);
        // You can navigate to search results page here
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
                {/* 1. Logo Section */}
                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center gap-2">
                        {/* Replace with your actual Image/SVG */}
                        <div className="flex flex-col">
                            <span className="text-3xl leading-none font-bold text-[#0e5843]">
                                E<span className="text-red-600">C</span>LUB
                            </span>
                            <span className="text-[0.6rem] tracking-wider text-gray-600 uppercase">
                                Entrepreneurs Club
                            </span>
                        </div>
                    </Link>
                </div>

                {/* 2. Navigation Menu */}
                <div className="hidden flex-grow justify-center lg:flex">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="/home"
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        Home
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {/* Committee Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    Committee
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="flex w-[800px] gap-0 p-0">
                                        {/* Left Grid */}
                                        <ul className="grid w-[75%] grid-cols-4 gap-4 p-6">
                                            <ListItem
                                                title="Advisors"
                                                href="/committee/advisors"
                                            >
                                                Industry veterans offering strategic guidance to the E-Club.
                                            </ListItem>
                                            <ListItem
                                                title="Governing Body"
                                                href="/committee/governing-body"
                                            >
                                                The leadership team setting the direction for the E-Club.
                                            </ListItem>
                                            <ListItem
                                                title="Executive Body"
                                                href="/committee/executive-body"
                                            >
                                                Overseeing the day-to-day operations of the E-Club.
                                            </ListItem>
                                            <ListItem
                                                title="Founders"
                                                href="/committee/founders"
                                            >
                                                The individuals who established the E-Club.
                                            </ListItem>
                                            <ListItem
                                                title="Forums"
                                                href="/committee/forums"
                                            >
                                                Platforms for members to connect and discuss various topics.
                                            </ListItem>
                                            <ListItem
                                                title="Standing Committee"
                                                href="/committee/standing-committee"
                                            >
                                                A permanent committee with ongoing responsibilities.
                                            </ListItem>
                                            <ListItem
                                                title="Project Directors"
                                                href="/committee/project-directors"
                                            >
                                                Members leading specific E-Club projects.
                                            </ListItem>
                                            <ListItem
                                                title="Administrative Team"
                                                href="/committee/administrative-team"
                                            >
                                                The Team managing daily tasks to ensure smooth operations.
                                            </ListItem>
                                        </ul>
                                        {/* Right Sidebar (Alumni) */}
                                        <div className="flex w-[25%] flex-col border-l bg-gray-50 p-6">
                                            <h4 className="mb-2 text-sm font-semibold">
                                                EC Alumni
                                            </h4>
                                            <p className="mb-4 text-xs text-muted-foreground">
                                                Former members of the E-Club's
                                                governing body.
                                            </p>
                                            <div className="space-y-3">
                                                <Link
                                                    href="/committee/alumni/2023-24"
                                                    className="block text-sm font-medium text-gray-600 underline decoration-gray-300 hover:text-[#0e5843] hover:decoration-[#0e5843]"
                                                >
                                                    EC 2023-24
                                                </Link>
                                                <Link
                                                    href="/committee/alumni/2022-23"
                                                    className="block text-sm font-medium text-gray-600 underline decoration-gray-300 hover:text-[#0e5843] hover:decoration-[#0e5843]"
                                                >
                                                    EC 2022-23
                                                </Link>
                                                <Link
                                                    href="/committee/alumni/2021-22"
                                                    className="block text-sm font-medium text-gray-600 underline decoration-gray-300 hover:text-[#0e5843] hover:decoration-[#0e5843]"
                                                >
                                                    EC 2021-22
                                                </Link>
                                                <Link
                                                    href="/committee/alumni/2020-21"
                                                    className="block text-sm font-medium text-gray-600 underline decoration-gray-300 hover:text-[#0e5843] hover:decoration-[#0e5843]"
                                                >
                                                    EC 2020-21
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Membership Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    Membership
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[600px] grid-cols-3 gap-3 p-6">
                                        <ListItem
                                            title="Benefits of Membership"
                                            href="/membership/benefits"
                                        >
                                            Discover the exclusive advantages of being an E-Club member.
                                        </ListItem>
                                        <ListItem
                                            title="Renew Membership"
                                            href="/membership/renew"
                                        >
                                            Continue your E-Club journey and access ongoing benefits.
                                        </ListItem>
                                        <ListItem
                                            title="Member Directory"
                                            href="/membership/directory"
                                        >
                                            Connect and collaborate with fellow E-Club members.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Events Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    Events
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[600px] grid-cols-3 gap-3 p-6">
                                        <ListItem
                                            title="Upcoming Events"
                                            href="/events/upcoming"
                                        >
                                            Discover inspiring workshops, networking events, and more.
                                        </ListItem>
                                        <ListItem
                                            title="Past Events"
                                            href="/events/past"
                                        >
                                            Relive the highlights and access past event resources.
                                        </ListItem>
                                        <ListItem
                                            title="Request for Event"
                                            href="/events/request"
                                        >
                                            Join or suggest! Shape E-Club events together.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="/projects"
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        Projects
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="/concerns"
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        Concerns
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="/partnerships"
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        Partnerships
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {/* Media Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    Media
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[800px] grid-cols-5 gap-3 p-6">
                                        <ListItem
                                            title="Notice and Updates"
                                            href="/media/notices"
                                        >
                                            Stay informed on E-Club happenings and industry news.
                                        </ListItem>
                                        <ListItem
                                            title="Press Releases"
                                            href="/media/press-releases"
                                        >
                                            Official announcements and media coverage of the E-Club.
                                        </ListItem>
                                        <ListItem
                                            title="Album"
                                            href="/media/albums"
                                        >
                                            Immerse yourself in E-Club events and activities album
                                        </ListItem>
                                        <ListItem
                                            title="Newsletter Archive"
                                            href="/media/newsletters"
                                        >
                                            Catch up on past E-Club news and insights.
                                        </ListItem>
                                        <ListItem
                                            title="Blog"
                                            href="/media/blog"
                                        >
                                            Catch up on past E-Club news and insights.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="/shop"
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        Shop
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="/contact"
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        Contact Us
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* 3. Action Section - Search, Cart, User */}
                <div className="flex items-center gap-3">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:block">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-48 pl-9 lg:w-64"
                            />
                        </div>
                    </form>

                    {/* Cart Icon with Badge */}
                    <Link
                        href="/cart"
                        className="relative rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                        <ShoppingCart className="h-5 w-5 text-gray-600" />
                        {cartItemCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-[10px] text-white">
                                {cartItemCount > 9 ? '9+' : cartItemCount}
                            </Badge>
                        )}
                        <span className="sr-only">Shopping Cart</span>
                    </Link>

                    {/* User Icon/Profile */}
                    <Link
                        href="/profile"
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                        <User className="h-5 w-5 text-gray-600" />
                        <span className="sr-only">User Profile</span>
                    </Link>

                    {/* Action Buttons */}
                    <div className="hidden items-center gap-2 lg:flex">
                        <Button
                            asChild
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <Link href="/member-login">Member Login</Link>
                        </Button>
                        <Button
                            asChild
                            className="bg-[#0e5843] text-white hover:bg-[#0b4635]"
                        >
                            <Link href="/join">Join As Member</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
