import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { pageVariants } from '@/lib/animations';
import type { Category, SiteSettings } from '@/types/cms';

import Footer from '@/components/footer';
import { FounderMemberPopup } from '@/components/founder-member-popup';
import Header from '@/components/header';

interface SiteLayoutProps {
    children: ReactNode;
    settings?: SiteSettings;
    categories?: Category[];
    navigationMenus?: any;
    footerData?: any;
    cartItemCount?: number;
    showPopup?: boolean;
    popupData?: {
        title?: string;
        description?: string;
        buttonText?: string;
        buttonLink?: string;
        imageUrl?: string;
    };
}

export function SiteLayout({
    children,
    settings,
    categories,
    navigationMenus,
    footerData,
    cartItemCount = 0,
    showPopup = false,
    popupData,
}: SiteLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header
                navigationMenus={navigationMenus}
                cartItemCount={cartItemCount}
            />
            <motion.main
                className="flex-1"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
            >
                {children}
            </motion.main>
            <Footer footerData={footerData} />
            <Toaster richColors position="bottom-right" closeButton />
            {showPopup && <FounderMemberPopup {...popupData} />}
        </div>
    );
}
