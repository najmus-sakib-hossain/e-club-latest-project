import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { useState } from 'react';

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

interface AdminPageLayoutProps {
    children: React.ReactNode;
}

export function AdminPageLayout({ children }: AdminPageLayoutProps) {
    // Initialize sidebar state from storage to prevent flash
    // Using useState with initializer function to ensure it only runs once on mount
    const [defaultOpen] = useState(getInitialSidebarState);

    return (
        <>
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
                    <div className="flex flex-1 flex-col overflow-auto">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
            <Toaster richColors position="bottom-right" closeButton />
        </>
    );
}

export default AdminPageLayout;
