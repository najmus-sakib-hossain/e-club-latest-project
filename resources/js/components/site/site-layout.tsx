import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { pageVariants } from '@/lib/animations';
import type { Category, SiteSettings } from '@/types/cms';

import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

interface SiteLayoutProps {
    children: ReactNode;
    settings?: SiteSettings;
    categories?: Category[];
}

export function SiteLayout({ children, settings, categories }: SiteLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader settings={settings} categories={categories} />
            <motion.main
                className="flex-1"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
            >
                {children}
            </motion.main>
            <SiteFooter settings={settings} />
            <Toaster richColors position="bottom-right" closeButton />
        </div>
    );
}
