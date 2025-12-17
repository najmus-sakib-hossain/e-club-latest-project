import { Button } from '@/components/ui/button';
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
import React from 'react';

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

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* 1. Logo Section */}
                <div className="mr-8 flex-shrink-0">
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
                                            {committeeItems.map((item) => (
                                                <ListItem
                                                    key={item.title}
                                                    title={item.title}
                                                    href="#"
                                                >
                                                    {item.description}
                                                </ListItem>
                                            ))}
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
                                                {alumniYears.map((year) => (
                                                    <Link
                                                        key={year}
                                                        href="#"
                                                        className="block text-sm font-medium text-gray-600 underline decoration-gray-300 hover:text-[#0e5843] hover:decoration-[#0e5843]"
                                                    >
                                                        {year}
                                                    </Link>
                                                ))}
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
                                        {membershipItems.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href="#"
                                            >
                                                {item.description}
                                            </ListItem>
                                        ))}
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
                                        {eventItems.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href="#"
                                            >
                                                {item.description}
                                            </ListItem>
                                        ))}
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
                                        {mediaItems.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href="#"
                                            >
                                                {item.description}
                                            </ListItem>
                                        ))}
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

                {/* 3. Action Buttons */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Member Login
                    </Button>
                    <Button className="bg-[#0e5843] text-white hover:bg-[#0b4635]">
                        Join As Member
                    </Button>
                </div>
            </div>
        </header>
    );
}
