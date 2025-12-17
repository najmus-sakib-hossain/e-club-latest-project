import { motion, Variants } from 'framer-motion';
import {
    ArrowRight,
    ArrowUpRight,
    Facebook,
    Globe,
    Linkedin,
    MapPin,
    Phone,
    ScanLine,
    Youtube,
} from 'lucide-react';
import React from 'react';

// --- UTILITY FOR TAILWIND CLASS MERGING (Simulating clsx/tailwind-merge) ---
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

// --- MOCK SHADCN UI COMPONENTS (Replace with your actual imports) ---
// e.g. import { Button } from "@/components/ui/button"
const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: 'default' | 'outline' | 'ghost' | 'link';
        size?: 'default' | 'sm' | 'lg' | 'icon';
    }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
    };
    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
    };
    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                variants[variant as keyof typeof variants],
                sizes[size as keyof typeof sizes],
                className,
            )}
            {...props}
        />
    );
});
Button.displayName = 'Button';

const Separator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        orientation?: 'horizontal' | 'vertical';
    }
>(({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'shrink-0 bg-border opacity-20',
            orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
            className,
        )}
        {...props}
    />
));
Separator.displayName = 'Separator';

// --- MAIN FOOTER COMPONENT ---

interface FooterProps {
    footerData?: {
        sections?: any[];
        bangladeshAddresses?: any[];
        internationalAddresses?: any[];
        links?: any;
        socialLinks?: any[];
    };
}

const Footer = ({ footerData }: FooterProps) => {
    // Use default/fallback data if footerData is not provided
    const sections = footerData?.sections || [];
    const bangladeshAddresses = footerData?.bangladeshAddresses || [];
    const internationalAddresses = footerData?.internationalAddresses || [];
    const links = footerData?.links || {};
    const socialLinks = footerData?.socialLinks || [];
    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring' as const, stiffness: 100 },
        },
    };

    return (
        <footer className="overflow-hidden bg-[#0b3025] font-sans text-white">
            {/* Top Section: Main Info & Links */}
            <div className="container mx-auto px-4 py-12 lg:py-16">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2 }}
                    variants={containerVariants}
                    className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8"
                >
                    {/* Column 1: Brand & About */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-6 lg:col-span-4"
                    >
                        <div className="flex items-center space-x-2">
                            {/* Logo Placeholder */}
                            <div className="rounded-lg bg-white/10 p-2">
                                <span className="text-2xl font-bold tracking-tighter text-white">
                                    <span className="text-red-500">E</span>CLUB
                                </span>
                            </div>
                            <span className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
                                Entrepreneurs Club
                            </span>
                        </div>

                        <p className="max-w-sm text-sm leading-relaxed text-gray-300">
                            The Entrepreneurs Club of Bangladesh is a non-profit
                            organization based in Bangladesh that focuses on
                            supporting and promoting entrepreneurship in the
                            country. The club provides resources, networking
                            opportunities, and support to entrepreneurs.
                        </p>

                        <div className="space-y-2 text-sm text-gray-300">
                            <div>
                                <span className="mb-1 block font-semibold text-white">
                                    Office Time:
                                </span>
                                Sunday – Thursday 11am–5pm
                            </div>
                            <div>
                                <span className="font-semibold text-white">
                                    Email:{' '}
                                </span>
                                <a
                                    href="mailto:query.eclub@gmail.com"
                                    className="transition-colors hover:text-emerald-400"
                                >
                                    query.eclub@gmail.com
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Column 2: Community Links */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-6 lg:col-span-2"
                    >
                        <h3 className="text-lg font-semibold text-white">
                            Join Our Community
                        </h3>
                        <ul className="space-y-3">
                            {[
                                'Online Forums',
                                'Networking Groups',
                                'Volunteer Opportunities',
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="group flex items-center text-sm text-gray-300 transition-colors hover:text-emerald-400"
                                    >
                                        {item}
                                        <ArrowUpRight className="ml-1 h-3 w-3 translate-y-1 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Column 3: Blog Links */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-6 lg:col-span-2"
                    >
                        <h3 className="text-lg font-semibold text-white">
                            Blog
                        </h3>
                        <ul className="space-y-3">
                            {[
                                'Read Blogs',
                                'Latest Blogs',
                                'Guest Articles',
                                'Entrepreneurial Insights',
                                'Industry Trends',
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="group flex items-center text-sm text-gray-300 transition-colors hover:text-emerald-400"
                                    >
                                        {item}
                                        <ArrowUpRight className="ml-1 h-3 w-3 translate-y-1 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Column 4: Contact & QR */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-6 lg:col-span-4"
                    >
                        <h3 className="text-lg font-semibold text-white">
                            Contact Us
                        </h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Phone Numbers */}
                            <div className="space-y-3 text-sm text-gray-300">
                                <a
                                    href="tel:+8801792111113"
                                    className="flex items-center transition-colors hover:text-emerald-400"
                                >
                                    <Phone className="mr-2 h-4 w-4 text-emerald-500" />{' '}
                                    +880 1792 111 113
                                </a>
                                <a
                                    href="tel:+8801819800006"
                                    className="flex items-center transition-colors hover:text-emerald-400"
                                >
                                    <Phone className="mr-2 h-4 w-4 text-emerald-500" />{' '}
                                    +880 1819 800 006
                                </a>
                                <a
                                    href="tel:+8801740443638"
                                    className="flex items-center transition-colors hover:text-emerald-400"
                                >
                                    <Phone className="mr-2 h-4 w-4 text-emerald-500" />{' '}
                                    +880 1740 443 638
                                </a>

                                <div className="pt-2 text-xs text-gray-400">
                                    <p>Visit Time: 11am to 6pm</p>
                                    <p className="mt-1 opacity-70">
                                        Please call respective branch number
                                        before visiting offices.
                                    </p>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="flex flex-col items-center space-y-3 sm:items-end">
                                <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-white p-2">
                                    {/* Mock QR Code */}
                                    <div className="flex h-full w-full flex-wrap content-center justify-center gap-1 bg-gray-900">
                                        <div className="relative flex h-3/4 w-3/4 items-center justify-center border-4 border-black">
                                            <div className="h-1/2 w-1/2 bg-black"></div>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    className="w-28 border border-emerald-900/50 bg-[#0a1f26] text-xs font-medium text-emerald-400 shadow-lg hover:bg-[#143d35]"
                                >
                                    <ScanLine className="mr-2 h-3 w-3" /> Scan
                                    Me
                                </Button>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="pt-4">
                            <h4 className="mb-3 text-sm font-semibold">
                                Follow Us On
                            </h4>
                            <div className="flex space-x-3">
                                {[Facebook, Linkedin, Youtube].map(
                                    (Icon, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="rounded-full bg-white/10 p-2 transition-all duration-300 hover:scale-110 hover:bg-emerald-600"
                                        >
                                            <Icon className="h-5 w-5 text-white" />
                                        </a>
                                    ),
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <Separator className="container mx-auto bg-emerald-800/30" />

            {/* Middle Section: Bangladesh Addresses */}
            <div className="relative bg-[#0b3025]">
                <div className="container mx-auto px-4 py-12">
                    <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ amount: 0.5 }}
                        className="mb-8 flex items-center text-xl font-semibold"
                    >
                        <span className="mr-3 h-6 w-1 rounded-full bg-emerald-500"></span>
                        Bangladesh Collaboration Addresses
                    </motion.h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <AddressCard
                            title="Branch Office in Gulshan/Banani"
                            address="House-108, Road-12, Floor-3rd, Block-E, Gulshan, Banani, (Beside Prescription Point), Dhaka, Bangladesh"
                            phone="+880707-929811"
                        />
                        <AddressCard
                            title="Branch Office in Panthapath/Banglamotor"
                            address="50, Lake Circus, 5th Floor, Kalabagan, Dhaka, Dhaka Division, Bangladesh"
                            phone="+8801819-800006"
                        />
                        <AddressCard
                            title="Branch Office in Dhanmondi/Lalmatia"
                            address="275/D, Suite # C11, Lift Level-11, Rd 27, Dhaka 1207"
                            phone="+8801711-661665"
                        />
                        <AddressCard
                            title="Branch Office in Niketon/Badda"
                            address="H# 87-89, R# 4, Bl# B, 1st Floor, Niketon, Gulshan, Dhaka 1212, Bangladesh"
                            phone="+8801331-546622"
                        />
                        <AddressCard
                            title="Branch Office in Motijheel/Paltan"
                            address="Suite# F-11, Level# 11, TROPICANA TOWER, 45 Purana Paltan, Dhaka 1000"
                            phone="+8801988-121212"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Section: International Addresses */}
            <div className="border-t border-emerald-900/30 bg-[#09281f]">
                <div className="container mx-auto px-4 py-12">
                    <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ amount: 0.5 }}
                        className="mb-8 flex items-center text-xl font-semibold"
                    >
                        <span className="mr-3 h-6 w-1 rounded-full bg-teal-500"></span>
                        International Collaboration Addresses
                    </motion.h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            'Dubai',
                            'Malaysia',
                            'Canada',
                            'USA',
                            'Singapore',
                            'Thailand',
                        ].map((country) => (
                            <AddressCard
                                key={country}
                                title={country}
                                // Note: Using placeholder text as per the reference image design which reused the Gulshan address
                                address={`Collaboration Office in ${country}. Contact us for specific location details and appointments.`}
                                phone="+880707-929811"
                                icon={<Globe className="h-5 w-5 text-white" />}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="bg-[#b91c1c] py-4 text-white">
                <div className="container mx-auto flex flex-col items-center justify-between px-4 text-xs sm:flex-row sm:text-sm">
                    <p>© 2024. All Rights Reserved</p>
                    <div className="mt-2 flex items-center sm:mt-0">
                        <span className="mr-1 opacity-80">
                            Designed & Managed by
                        </span>
                        <a
                            href="#"
                            className="font-bold decoration-white/50 underline-offset-4 hover:underline"
                        >
                            Nexkraft
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// --- HELPER COMPONENTS ---

const AddressCard = ({
    title,
    address,
    phone,
    icon,
}: {
    title: string;
    address: string;
    phone: string;
    icon?: React.ReactNode;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: '-50px' }}
            whileHover={{ y: -5 }}
            transition={{
                type: 'spring' as const,
                stiffness: 300,
                damping: 20,
            }}
            className="group flex cursor-default items-start rounded-xl p-4 transition-colors hover:bg-white/5"
        >
            <div className="mr-4 flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#3f8f7f] shadow-lg transition-colors group-hover:bg-[#4fa794]">
                    {icon || <MapPin className="h-5 w-5 text-white" />}
                </div>
            </div>
            <div>
                <h4 className="mb-1 text-sm font-bold text-white transition-colors group-hover:text-emerald-300">
                    {title}
                </h4>
                <p className="mb-2 line-clamp-3 text-xs leading-relaxed text-gray-400">
                    {address}
                </p>
                <div className="flex items-center text-xs font-semibold text-emerald-400">
                    <span className="mr-1 font-normal text-gray-500">
                        Contact:
                    </span>{' '}
                    {phone}
                </div>
            </div>
        </motion.div>
    );
};

// --- APP WRAPPER FOR PREVIEW ---

export default function App() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-100 font-sans">
            {/* Fake Header/Body to push footer down */}
            <div className="container mx-auto flex-grow px-4 py-20 text-center">
                <h1 className="mb-4 text-4xl font-bold text-gray-800">
                    Scroll Down
                </h1>
                <p className="text-gray-600">
                    To see the animated footer implementation.
                </p>
                <ArrowRight className="mx-auto mt-8 h-6 w-6 rotate-90 animate-bounce text-gray-400" />
            </div>

            {/* The Footer */}
            <Footer />
        </div>
    );
}
