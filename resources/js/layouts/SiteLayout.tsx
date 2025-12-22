import { FounderMemberPopup } from '@/components/founder-member-popup';
import { Toaster } from '@/components/ui/sonner';
import { NavigationMenu } from '@/types/cms';
import React from 'react';
import { SiteFooter } from './partials/SiteFooter';
import { SiteHeader } from './partials/SiteHeader';

export const SiteLayout = ({
    children,
    navigationMenus,
    footerData,
    cartItemCount = 0,
    showPopup = false,
    popupData,
}: {
    children: React.ReactNode;
    navigationMenus?: NavigationMenu[];
    footerData?: any;
    cartItemCount?: number;
    showPopup?: boolean;
    popupData?: {
        title?: string;
        description?: string;
        buttonText?: string;
        buttonLink?: string;
        imageUrl?: string | null;
    };
}) => (
    <div className="flex min-h-screen flex-col font-sans">
        {/* We would typically put the <Head title="Home" /> tag here, but since it's an external dependency, we omit it. */}
        <SiteHeader
            navigationMenus={navigationMenus || []}
            cartItemCount={cartItemCount}
        />
        <main className="flex-grow">{children}</main>
        <SiteFooter footerData={footerData || {}} />
        <Toaster richColors position="bottom-right" closeButton />
        {/* {showPopup && popupData && <FounderMemberPopup {...popupData} />} */}
    </div>
);
