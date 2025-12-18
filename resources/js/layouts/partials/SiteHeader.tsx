import Header from '@/components/header';
import { NavigationMenu } from '@/types/cms';

export const SiteHeader = ({
    navigationMenus,
    cartItemCount = 0,
}: {
    navigationMenus: NavigationMenu[];
    cartItemCount?: number;
}) => (
    <Header navigationMenus={navigationMenus} cartItemCount={cartItemCount} />
);
