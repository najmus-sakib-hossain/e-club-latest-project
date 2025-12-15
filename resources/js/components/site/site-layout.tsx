import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { pageVariants } from '@/lib/animations';
import type { Category, SiteSettings } from '@/types/cms';

import Header from '@/components/header';
import Footer from '@/components/footer';

interface SiteLayoutProps {
    children: ReactNode;
    settings?: SiteSettings;
    categories?: Category[];
    navigationMenus?: any;
    footerData?: any;
}

export function SiteLayout({ children, settings, categories, navigationMenus, footerData }: SiteLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header navigationMenus={navigationMenus} />
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
        </div>
    );
}
