import { CustomButton } from '@/components/ui/CustomButton';
import { NavigationMenu } from '@/types/cms';

export const SiteHeader = ({
    navigationMenus,
}: {
    navigationMenus: NavigationMenu[];
}) => (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="text-2xl font-black text-[#006838]">E-CLUB</div>
            <nav className="hidden space-x-6 text-sm font-medium text-gray-700 md:flex">
                {navigationMenus && navigationMenus.length > 0
                    ? navigationMenus.map((menu) => (
                          <a
                              key={menu.id}
                              href={menu.url || '#'}
                              className="transition-colors hover:text-[#e63946]"
                          >
                              {menu.name}
                          </a>
                      ))
                    : // Fallback
                      ['Home', 'About', 'Projects', 'Events', 'Contact'].map(
                          (item) => (
                              <a
                                  key={item}
                                  href="#"
                                  className="transition-colors hover:text-[#e63946]"
                              >
                                  {item}
                              </a>
                          ),
                      )}
            </nav>
            <div className="flex items-center gap-4">
                <a
                    href="/join"
                    className="hidden h-9 items-center justify-center rounded-md bg-[#e63946] px-4 text-sm font-medium text-white shadow-lg shadow-red-900/20 transition-transform duration-200 hover:bg-[#d62839] active:scale-95 sm:inline-flex"
                >
                    Join Now
                </a>
                <CustomButton className="hidden h-9 px-4 text-sm sm:flex">
                    Member Login
                </CustomButton>
            </div>
        </div>
    </header>
);
