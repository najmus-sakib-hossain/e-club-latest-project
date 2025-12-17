import { AppSidebar } from '@/components/app-sidebar';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

import data from './data.json';

// Storage key for sidebar collapsed state (must match app-sidebar.tsx)
const SIDEBAR_COLLAPSED_KEY = 'admin_sidebar_collapsed';

// Helper to get initial sidebar state
function getInitialSidebarState(): boolean {
    if (typeof window === 'undefined') return true;

    // First check sessionStorage (takes priority for admin)
    const sessionValue = sessionStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (sessionValue === 'true') return false;

    // Fall back to cookie
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('sidebar_state='))
        ?.split('=')[1];

    if (cookieValue !== undefined) {
        return cookieValue === 'true';
    }

    return true; // default open
}

export default function AdminDashboard() {
    // Initialize sidebar state from storage to prevent flash
    const [defaultOpen] = useState(getInitialSidebarState);

    return (
        <>
            <Head title="Admin Dashboard - E-Club Store" />
            <SidebarProvider
                defaultOpen={defaultOpen}
                style={
                    {
                        '--sidebar-width': 'calc(var(--spacing) * 72)',
                        '--header-height': 'calc(var(--spacing) * 12)',
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <SectionCards />
                                <div className="px-4 lg:px-6">
                                    <ChartAreaInteractive />
                                </div>
                                <DataTable data={data} />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
