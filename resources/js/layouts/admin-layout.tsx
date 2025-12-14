import { Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    Calendar,
    ChevronDown,
    ChevronsRight,
    CreditCard,
    FileText,
    Headphones,
    LayoutDashboard,
    LogOut,
    Package,
    Settings,
    UserCog,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import type { SharedData } from '@/types';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

const menuItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin',
    },
    {
        title: 'Administration',
        icon: UserCog,
        items: [
            { title: 'Role Management', icon: ChevronsRight, href: '/admin/roles' },
            { title: 'Right Management', icon: ChevronsRight, href: '/admin/permissions' },
            { title: 'Member Management', icon: ChevronsRight, href: '/admin/members' },
        ],
    },
    {
        title: 'Event Management',
        icon: Calendar,
        href: '/admin/events',
    },
    {
        title: 'Projects Management',
        icon: Package,
        href: '/admin/projects',
    },
    {
        title: 'Blog Management',
        icon: FileText,
        href: '/admin/blogs',
    },
    {
        title: 'Payment Management',
        icon: CreditCard,
        href: '/admin/payments',
    },
    {
        title: 'Notice',
        icon: AlertCircle,
        href: '/admin/notices',
    },
    {
        title: 'Certificate Management',
        icon: Award,
        href: '/admin/certificates',
    },
    {
        title: 'Support',
        icon: Headphones,
        href: '/admin/support',
    },
    {
        title: 'Settings',
        icon: Settings,
        href: '/admin/settings',
    },
];

export function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const currentPath = window.location.pathname;

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="flex w-64 flex-col bg-foreground text-background">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-border px-6">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Package className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">Fitment CMS</span>
                    </Link>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4">
                    <nav className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <div key={item.title}>
                                {item.items ? (
                                    <Collapsible defaultOpen>
                                        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.title}</span>
                                            </div>
                                            <ChevronDown className="h-4 w-4" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="mt-1 space-y-1 pl-4">
                                            {item.items.map((subItem) => (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${currentPath === subItem.href
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                        }`}
                                                >
                                                    <subItem.icon className="h-4 w-4" />
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            ))}
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${currentPath === item.href
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </ScrollArea>

                {/* User */}
                <div className="border-t border-border p-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-background hover:bg-muted"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {auth.user?.name?.charAt(0) || 'A'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                    <p className="text-sm font-medium">{auth.user?.name || 'Admin'}</p>
                                    <p className="text-xs text-muted-foreground">{auth.user?.email}</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem asChild>
                                <Link href="/" className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    View Site
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/admin-logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-2 text-destructive"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center border-b bg-card px-6">
                    <h1 className="text-xl font-semibold text-foreground">{title || 'Dashboard'}</h1>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>

            <Toaster richColors position="bottom-right" closeButton />
        </div>
    );
}
