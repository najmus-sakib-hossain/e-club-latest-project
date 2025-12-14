import * as React from "react"
import {
  Box,
  Building2,
  LayoutDashboard,
  MoreVertical,
  FileText as IconFile,
  HelpCircle,
  Home,
  Info,
  LayoutGrid,
  Mail,
  MapPin,
  MessageSquare,
  Package as IconPackage,
  Phone,
  CircleHelp,
  Settings,
  ShoppingCart,
  Star,
  Truck as IconTruck,
  Users,
  ChevronRight,
} from "lucide-react"
import { Link, usePage } from "@inertiajs/react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FileText, Menu, PanelBottom, Shield, Truck as TruckIcon, Package, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"

// Storage key for scroll position
const SIDEBAR_SCROLL_KEY = "admin_sidebar_scroll"

// Storage key for collapsed groups
const SIDEBAR_GROUPS_KEY = "admin_sidebar_groups"

// Storage key for last clicked item (when in collapsed mode)
const SIDEBAR_LAST_ITEM_KEY = "admin_sidebar_last_item"

// Storage key for sidebar collapsed state persistence
const SIDEBAR_COLLAPSED_KEY = "admin_sidebar_collapsed"

const data = {
  user: {
    name: "Admin",
    email: "e-club@gmail.com",
    avatar: "/logo.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: IconPackage,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: LayoutGrid,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: Users,
    },
    {
      title: "Contact Records",
      url: "/admin/contact-messages",
      icon: Mail,
    },
  ],
  navHomepage: [
    {
      title: "Hero Slides",
      icon: Home,
      url: "/admin/hero-slides",
    },
    {
      title: "Feature Cards",
      icon: Box,
      url: "/admin/features",
    },
    {
      title: "Featured Products",
      icon: Star,
      url: "/admin/featured-products",
    },
    {
      title: "Customer Reviews",
      icon: MessageSquare,
      url: "/admin/customer-reviews",
    },
    {
      title: "Trusted Companies",
      icon: IconTruck,
      url: "/admin/trusted-companies",
    },
  ],
  navContentPages: [
    {
      title: "About Page",
      icon: Info,
      url: "/admin/content-pages/about",
    },
    {
      title: "Contact Page",
      icon: Phone,
      url: "/admin/content-pages/contact",
    },
    {
      title: "Store Locations",
      icon: MapPin,
      url: "/admin/content-pages/stores",
    },
    {
      title: "FAQs",
      icon: CircleHelp,
      url: "/admin/content-pages/faqs",
    },
    {
      title: "Help Center",
      icon: HelpCircle,
      url: "/admin/content-pages/help",
    },
    {
      title: "Shipping Policy",
      icon: TruckIcon,
      url: "/admin/content-pages/shipping",
    },
    {
      title: "Returns Policy",
      icon: Package,
      url: "/admin/content-pages/returns",
    },
    {
      title: "Warranty Info",
      icon: Shield,
      url: "/admin/content-pages/warranty",
    },
    {
      title: "Care Guide",
      icon: Wrench,
      url: "/admin/content-pages/care",
    },
    {
      title: "Privacy Policy",
      icon: FileText,
      url: "/admin/content-pages/privacy",
    },
    {
      title: "Terms & Conditions",
      icon: FileText,
      url: "/admin/content-pages/terms",
    },
  ],
  navContent: [
    {
      title: "Content Pages",
      icon: IconFile,
      url: "/admin/pages",
    },
    {
      title: "Header Settings",
      url: "/admin/settings/header",
      icon: Menu,
    },
    {
      title: "Footer Settings",
      url: "/admin/settings/footer",
      icon: PanelBottom,
    },
  ],
  navSettings: [
    {
      title: "General Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
}

interface NavGroupProps {
  title: string
  items: {
    title: string
    url: string
    icon: React.ElementType
  }[]
  groupKey: string
  defaultOpen?: boolean
  maxVisibleInCollapsed?: number
}

function NavGroup({ title, items, groupKey, defaultOpen = true, maxVisibleInCollapsed = 3 }: NavGroupProps) {
  const { url: currentUrl } = usePage()
  const { state, setOpen } = useSidebar()
  const isCollapsed = state === "collapsed"

  // Get saved state from localStorage
  const [isOpen, setIsOpen] = React.useState(() => {
    if (typeof window === "undefined") return defaultOpen
    const saved = localStorage.getItem(SIDEBAR_GROUPS_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return parsed[groupKey] ?? defaultOpen
      } catch {
        return defaultOpen
      }
    }
    return defaultOpen
  })

  // Save state to localStorage when it changes
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem(SIDEBAR_GROUPS_KEY)
    let current: Record<string, boolean> = {}
    if (saved) {
      try {
        current = JSON.parse(saved)
      } catch {
        current = {}
      }
    }
    current[groupKey] = isOpen
    localStorage.setItem(SIDEBAR_GROUPS_KEY, JSON.stringify(current))
  }, [isOpen, groupKey])

  const isActive = (itemUrl: string) => {
    if (itemUrl === "/admin") {
      return currentUrl === "/admin"
    }
    return currentUrl.startsWith(itemUrl)
  }

  // Check if any item in this group is active
  const hasActiveItem = items.some(item => isActive(item.url))

  // In collapsed mode, show limited items + more button
  const visibleItems = items.slice(0, maxVisibleInCollapsed)
  const hiddenItems = items.slice(maxVisibleInCollapsed)
  const hasMoreItems = hiddenItems.length > 0

  // Track navigation from collapsed state and store last clicked item
  const handleCollapsedNavigation = (itemUrl: string, itemTitle: string) => {
    // Mark that sidebar should stay collapsed
    sessionStorage.setItem(SIDEBAR_COLLAPSED_KEY, "true")
    // Store last clicked item for scroll-to when expanded
    sessionStorage.setItem(SIDEBAR_LAST_ITEM_KEY, JSON.stringify({ groupKey, itemTitle }))
  }

  if (isCollapsed) {
    return (
      <SidebarGroup className="py-0.5">
        <SidebarMenu className="gap-0">
          {/* Show first few items with tooltips */}
          {visibleItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="justify-center"
                  >
                    <Link
                      href={item.url}
                      preserveScroll
                      preserveState
                      onClick={() => handleCollapsedNavigation(item.url, item.title)}
                    >
                      <item.icon className="shrink-0 size-4" />
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {item.title}
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          ))}

          {/* More items dropdown in collapsed mode */}
          {hasMoreItems && (
            <SidebarMenuItem>
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <SidebarMenuButton
                        className={cn(
                          "justify-center",
                          hasActiveItem && hiddenItems.some(i => isActive(i.url)) && "bg-sidebar-accent"
                        )}
                      >
                        <MoreVertical className="shrink-0 size-4" />
                      </SidebarMenuButton>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    More {title}
                  </TooltipContent>
                </Tooltip>
                <PopoverContent
                  side="right"
                  align="start"
                  sideOffset={10}
                  className="w-56 p-2"
                >
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                    {title}
                  </div>
                  <div className="flex flex-col gap-1">
                    {hiddenItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.url}
                        preserveScroll
                        preserveState
                        onClick={() => handleCollapsedNavigation(item.url, item.title)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive(item.url) && "bg-accent text-accent-foreground font-medium"
                        )}
                      >
                        <item.icon className="shrink-0 size-4" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
        <div className="flex justify-center py-1 mx-auto">
          <div className="h-[2px] w-8 bg-border" />
        </div>
      </SidebarGroup>
    )
  }

  // Expanded mode with collapsible groups
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarGroup className="border-b border-sidebar-border last:border-b-0">
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md transition-colors">
            <span className="flex-1">{title}</span>
            <ChevronRight className={cn(
              "size-4 transition-transform duration-200",
              isOpen && "rotate-90"
            )} />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                  >
                    <Link href={item.url} preserveScroll preserveState>
                      <item.icon className="shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

// Simple nav group for items that don't need collapsing (like Settings at the bottom)
function SimpleNavGroup({ title, items }: { title: string; items: typeof data.navMain }) {
  const { url: currentUrl } = usePage()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  // Track navigation from collapsed state
  const handleCollapsedNavigation = (itemTitle: string) => {
    if (isCollapsed) {
      sessionStorage.setItem(SIDEBAR_COLLAPSED_KEY, "true")
      sessionStorage.setItem(SIDEBAR_LAST_ITEM_KEY, JSON.stringify({ groupKey: "settings", itemTitle }))
    }
  }

  const isActive = (itemUrl: string) => {
    if (itemUrl === "/admin") {
      return currentUrl === "/admin"
    }
    return currentUrl.startsWith(itemUrl)
  }

  if (isCollapsed) {
    return (
      <SidebarGroup className="border-t border-sidebar-border/30 pt-1">
        <SidebarMenu className="gap-0.5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="justify-center"
                  >
                    <Link
                      href={item.url}
                      preserveScroll
                      preserveState
                      onClick={() => handleCollapsedNavigation(item.title)}
                    >
                      <item.icon className="shrink-0 size-4" />
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {item.title}
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup className="border-t border-sidebar-border/30 pt-2">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
                <Link href={item.url} preserveScroll preserveState onClick={() => handleCollapsedNavigation(item.title)}>
                  <item.icon className="shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { props: pageProps } = usePage()
  const siteLogo = (pageProps as { siteLogo?: string }).siteLogo
  const siteName = (pageProps as { siteName?: string }).siteName || 'E-Club'
  const logoSrc = siteLogo ? `/storage/${siteLogo}` : '/logo.png'
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { state, setOpen } = useSidebar()
  const prevState = React.useRef(state)

  // Restore scroll position on mount
  React.useEffect(() => {
    const savedScroll = sessionStorage.getItem(SIDEBAR_SCROLL_KEY)
    if (savedScroll && scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = parseInt(savedScroll, 10)
      }
    }
  }, [])

  // When sidebar expands, scroll to last clicked item and clear collapsed flag
  React.useEffect(() => {
    const wasCollapsed = prevState.current === "collapsed"
    const isNowExpanded = state === "expanded"

    if (wasCollapsed && isNowExpanded) {
      // Clear the collapsed flag since user manually expanded
      sessionStorage.removeItem(SIDEBAR_COLLAPSED_KEY)

      // Scroll to last clicked item after a small delay for animation
      const lastItem = sessionStorage.getItem(SIDEBAR_LAST_ITEM_KEY)
      if (lastItem && scrollRef.current) {
        try {
          const { groupKey, itemTitle } = JSON.parse(lastItem)
          // Wait for sidebar expansion animation
          setTimeout(() => {
            const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]')
            if (viewport) {
              // Find the active menu item or the item by title
              const activeItem = viewport.querySelector('[data-active="true"]') as HTMLElement
              if (activeItem) {
                const itemRect = activeItem.getBoundingClientRect()
                const viewportRect = viewport.getBoundingClientRect()
                const scrollTop = viewport.scrollTop + (itemRect.top - viewportRect.top) - (viewportRect.height / 3)
                viewport.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' })
              }
            }
            // Clear the last item after scrolling
            sessionStorage.removeItem(SIDEBAR_LAST_ITEM_KEY)
          }, 300)
        } catch {
          sessionStorage.removeItem(SIDEBAR_LAST_ITEM_KEY)
        }
      }
    }

    prevState.current = state
  }, [state])

  // Save scroll position before navigation
  const handleScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(viewport.scrollTop))
      }
    }
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border group-data-[collapsible=icon]:border-b-[0.5px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-[100px]"
              asChild
              size="lg"
              tooltip={`${siteName} Admin`}
            >
              <Link href="/admin" preserveScroll preserveState>
                <div className="flex aspect-square h-full w-full items-center justify-center shrink-0">
                  <img src={logoSrc} alt={siteName} className="size-48 object-contain" />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-0 overflow-hidden">
        <ScrollArea
          ref={scrollRef}
          className="h-full [&>[data-radix-scroll-area-viewport]]:h-full p-0"
          onScrollCapture={handleScroll}
        >
          <div className="flex flex-col min-h-full">
            {/* Main Navigation */}
            <NavGroup
              title="Navigation"
              items={data.navMain}
              groupKey="navMain"
              maxVisibleInCollapsed={5}
            />

            {/* Homepage Content */}
            <NavGroup
              title="Homepage"
              items={data.navHomepage}
              groupKey="navHomepage"
              maxVisibleInCollapsed={3}
            />

            {/* Content Pages - has many items */}
            <NavGroup
              title="Content Pages"
              items={data.navContentPages}
              groupKey="navContentPages"
              maxVisibleInCollapsed={2}
            />

            {/* Site Settings */}
            <NavGroup
              title="Site Settings"
              items={data.navContent}
              groupKey="navContent"
              maxVisibleInCollapsed={3}
            />

            {/* Settings - at bottom, auto margin-top */}
            <div className="mt-auto">
              <SimpleNavGroup title="Settings" items={data.navSettings} />
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:border-t-0 border-t border-sidebar-border">
        <div className="hidden group-data-[collapsible=icon]:flex justify-center py-1">
          <div className="h-[2px] w-8 bg-border" />
        </div>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
