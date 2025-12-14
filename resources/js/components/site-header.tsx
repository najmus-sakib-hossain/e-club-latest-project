import { usePage } from "@inertiajs/react"
import { useState, useEffect } from "react"
import {
  LayoutDashboard as IconDashboard,
  Package as IconPackage,
  LayoutGrid as IconLayoutGrid,
  ShoppingCart as IconShoppingCart,
  Users as IconUsers,
  Home as IconHome,
  Box as IconBox,
  Truck as IconTruck,
  Settings as IconSettings,
  Star as IconStar,
  MessageSquare as IconMessage,
  Info as IconInfoCircle,
  Phone as IconPhone,
  MapPin as IconMapPin,
  CircleHelp as IconQuestionMark,
  HelpCircle as IconHelp,
  FileText as IconFile,
} from "lucide-react"
import { FileText, Menu, PanelBottom, Shield, Truck as TruckIcon, Package, Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Route to title and icon mapping - matches app-sidebar.tsx navigation
const routeConfig: Record<string, { title: string; icon: React.ComponentType<{ className?: string }> }> = {
  // Main Navigation
  "/admin": { title: "Dashboard", icon: IconDashboard },
  "/admin/products": { title: "Products", icon: IconPackage },
  "/admin/categories": { title: "Categories", icon: IconLayoutGrid },
  "/admin/orders": { title: "Orders", icon: IconShoppingCart },
  "/admin/customers": { title: "Customers", icon: IconUsers },

  // Homepage Content
  "/admin/hero-slides": { title: "Hero Slides", icon: IconHome },
  "/admin/features": { title: "Feature Cards", icon: IconBox },
  "/admin/featured-products": { title: "Featured Products", icon: IconStar },
  "/admin/customer-reviews": { title: "Customer Reviews", icon: IconMessage },
  "/admin/trusted-companies": { title: "Trusted Companies", icon: IconTruck },

  // Content Pages
  "/admin/content-pages/about": { title: "About Page", icon: IconInfoCircle },
  "/admin/content-pages/contact": { title: "Contact Page", icon: IconPhone },
  "/admin/content-pages/stores": { title: "Store Locations", icon: IconMapPin },
  "/admin/content-pages/faqs": { title: "FAQs", icon: IconQuestionMark },
  "/admin/content-pages/help": { title: "Help Center", icon: IconHelp },
  "/admin/content-pages/shipping": { title: "Shipping Policy", icon: TruckIcon },
  "/admin/content-pages/returns": { title: "Returns Policy", icon: Package },
  "/admin/content-pages/warranty": { title: "Warranty Info", icon: Shield },
  "/admin/content-pages/care": { title: "Care Guide", icon: Wrench },
  "/admin/content-pages/privacy": { title: "Privacy Policy", icon: FileText },
  "/admin/content-pages/terms": { title: "Terms & Conditions", icon: FileText },

  // Site Settings
  "/admin/pages": { title: "Content Pages", icon: IconFile },
  "/admin/settings/header": { title: "Header Settings", icon: Menu },
  "/admin/settings/footer": { title: "Footer Settings", icon: PanelBottom },
  "/admin/settings": { title: "General Settings", icon: IconSettings },

  // Profile Pages
  "/admin/profile/account": { title: "Account", icon: IconUsers },
  "/admin/profile/notifications": { title: "Notifications", icon: IconMessage },
}

function getPageInfo(url: string): { title: string; icon: React.ComponentType<{ className?: string }> } {
  // Check for exact match first
  if (routeConfig[url]) {
    return routeConfig[url]
  }

  // Check for partial matches (e.g., /admin/products/1 should match /admin/products)
  for (const [route, config] of Object.entries(routeConfig)) {
    if (url.startsWith(route) && route !== "/admin") {
      return config
    }
  }

  return { title: "Dashboard", icon: IconDashboard }
}

export function SiteHeader() {
  const { url } = usePage()
  const pageInfo = getPageInfo(url)
  const Icon = pageInfo.icon
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-40 flex shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ease-linear ${isScrolled ? 'h-14' : 'h-12'}`}>
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <Icon className="size-4" />
                {pageInfo.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" asChild size="sm" className="hidden sm:flex">
            <a
              href="/"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              View Store
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
