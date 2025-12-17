import {
    MemberTypeChart,
    TopProjectsChart,
    UserGrowthChart,
} from '@/components/dashboard/charts';
import { MembersTable } from '@/components/dashboard/members-table';
import { DashboardStats } from '@/components/dashboard/stats-cards';
import { AdminLayout } from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';

// Interfaces can be kept if we plan to use real data later,
// otherwise we can simplify. keeping them for now but unused.
interface Stats {
    heroSlides: number;
    categories: number;
    products: number;
    orders: number;
    featureCards: number;
    trustedCompanies: number;
    totalRevenue: number;
    pendingOrders: number;
}

interface SalesData {
    date: string;
    sales: number;
    orders: number;
}

interface Props {
    stats?: Stats;
    salesData?: SalesData[];
    monthlySales?: SalesData[];
    // Add other props as optional if needed
}

export default function Dashboard({ stats }: Props) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold tracking-tight">
                        Total Users
                    </h2>
                    <DashboardStats />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <UserGrowthChart />
                    <TopProjectsChart />
                    <MemberTypeChart />
                </div>

                <MembersTable />
            </div>
        </AdminLayout>
    );
}
