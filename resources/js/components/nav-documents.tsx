'use client';

import { Link } from '@inertiajs/react';
import {
    Folder,
    MoreHorizontal,
    Share2,
    Trash2,
    type LucideIcon as Icon,
} from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export function NavDocuments({
    items,
}: {
    items: {
        name: string;
        url: string;
        icon: Icon;
    }[];
}) {
    const { isMobile } = useSidebar();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction
                                    showOnHover
                                    className="rounded-sm data-[state=open]:bg-accent"
                                >
                                    <MoreHorizontal />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-24 rounded-lg"
                                side={isMobile ? 'bottom' : 'right'}
                                align={isMobile ? 'end' : 'start'}
                            >
                                <DropdownMenuItem asChild>
                                    <Link href={item.url}>
                                        <Folder />
                                        <span>Open</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Share2 />
                                    <span>Share</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive">
                                    <Trash2 />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
