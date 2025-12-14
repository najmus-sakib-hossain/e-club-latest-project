import { Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    Bell,
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
            <aside className="flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
                {/* Logo */}
                <div className="flex h-20 items-center justify-center border-b border-sidebar-border bg-sidebar">
                    <Link href="/admin">
                        <img
                            src="/logo.png"
                            alt="E-Club"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4">
                    <nav className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <div key={item.title}>
                                {item.items ? (
                                    <Collapsible defaultOpen>
                                        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
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
                                                        ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                                                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${currentPath === item.href
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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

                {/* Sidebar Footer removed (User moved to header) */}
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden bg-background">
                {/* Header */}
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6 shadow-sm">
                    {/* Left side empty or Breadcrumbs in future */}
                    <div />

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">Notifications</span>
                        </Button>

                        <div className="flex items-center gap-4 pl-4 border-l">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-3 pl-0 hover:bg-transparent"
                                    >
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-medium leading-none">{auth.user?.name || 'Admin'}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Administrator</p>
                                        </div>
                                        <Avatar className="h-9 w-9 border cursor-pointer">
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {auth.user?.name?.charAt(0) || 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-6 bg-[#F8F9FA]">
                    {children}
                </main>
            </div>

            <Toaster richColors position="bottom-right" closeButton />
        </div>
    );
}
