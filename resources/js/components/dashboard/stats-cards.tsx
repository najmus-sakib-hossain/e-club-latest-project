import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    count: string;
    className?: string;
}

function StatsCard({ title, count, className }: StatsCardProps) {
    return (
        <Card className={cn("text-white border-0 shadow-md", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{count}</div>
            </CardContent>
        </Card>
    );
}

export function DashboardStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatsCard
                title="Governing Body"
                count="10,00,000"
                className="bg-gradient-to-r from-red-700 to-red-500"
            />
            <StatsCard
                title="Founding Member"
                count="2,00,000"
                className="bg-gradient-to-r from-green-800 to-green-600"
            />
            <StatsCard
                title="Corporate"
                count="10,000"
                className="bg-gradient-to-r from-blue-600 to-blue-400"
            />
            <StatsCard
                title="General Manager"
                count="5,000"
                className="bg-gradient-to-r from-purple-600 to-purple-400"
            />
            <StatsCard
                title="Associate"
                count="2,000"
                className="bg-gradient-to-r from-orange-600 to-orange-400"
            />
            <StatsCard
                title="Non-Dhaka Member"
                count="1,000"
                className="bg-gradient-to-r from-pink-600 to-pink-400"
            />
        </div>
    );
}
