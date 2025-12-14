import { Head } from '@inertiajs/react';
import AdminPageLayout from '@/layouts/admin-page-layout';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import dummyData from '../data.json';

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

interface OrdersByStatus {
    status: string;
    count: number;
    fill: string;
}

interface ProductsByCategory {
    category: string;
    products: number;
    fill: string;
}

interface RecentOrder {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    status: string;
    payment_status: string;
    items_count: number;
    created_at: string;
    created_at_diff: string;
}

interface RecentActivity {
    id: string;
    type: string;
    title: string;
    description: string;
    amount: number;
    status: string;
    created_at: string;
    time_ago: string;
}

interface TopProduct {
    id: number;
    name: string;
    image: string | null;
    price: number;
    sold: number;
    stock: number;
}

interface LowStockProduct {
    id: number;
    name: string;
    stock: number;
    image: string | null;
}

interface Props {
    stats: Stats;
    salesData: SalesData[];
    monthlySales: SalesData[];
    ordersByStatus: OrdersByStatus[];
    productsByCategory: ProductsByCategory[];
    recentOrders: RecentOrder[];
    recentActivities: RecentActivity[];
    topProducts: TopProduct[];
    lowStockProducts: LowStockProduct[];
}

export default function Dashboard({
    stats,
    salesData,
    monthlySales,
    ordersByStatus,
    productsByCategory,
    recentOrders,
    recentActivities,
    topProducts,
    lowStockProducts,
}: Props) {
    return (
        <AdminPageLayout>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col overflow-auto">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards stats={stats} />
                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive salesData={salesData} monthlySales={monthlySales} />
                        </div>
                        <DataTable data={dummyData} />
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
}
