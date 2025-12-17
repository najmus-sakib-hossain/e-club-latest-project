import { NavigationMenu } from '@/types/cms';
import React from 'react';
import { SiteFooter } from './partials/SiteFooter';
import { SiteHeader } from './partials/SiteHeader';

export const SiteLayout = ({
    children,
    navigationMenus,
    footerData,
}: {
    children: React.ReactNode;
    navigationMenus?: NavigationMenu[];
    footerData?: any;
}) => (
    <div className="flex min-h-screen flex-col font-sans">
        {/* We would typically put the <Head title="Home" /> tag here, but since it's an external dependency, we omit it. */}
        <SiteHeader navigationMenus={navigationMenus || []} />
        <main className="flex-grow">{children}</main>
        <SiteFooter footerData={footerData || {}} />
    </div>
);
