'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';

export const description = 'An interactive area chart';

const chartData = [
    { date: '2024-04-01', orders: 22, products: 15 },
    { date: '2024-04-02', orders: 10, products: 18 },
    { date: '2024-04-03', orders: 17, products: 12 },
    { date: '2024-04-04', orders: 24, products: 26 },
    { date: '2024-04-05', orders: 37, products: 29 },
    { date: '2024-04-06', orders: 30, products: 34 },
    { date: '2024-04-07', orders: 25, products: 18 },
    { date: '2024-04-08', orders: 41, products: 32 },
    { date: '2024-04-09', orders: 6, products: 11 },
    { date: '2024-04-10', orders: 26, products: 19 },
    { date: '2024-04-11', orders: 33, products: 35 },
    { date: '2024-04-12', orders: 29, products: 21 },
    { date: '2024-04-13', orders: 34, products: 38 },
    { date: '2024-04-14', orders: 14, products: 22 },
    { date: '2024-04-15', orders: 12, products: 17 },
    { date: '2024-04-16', orders: 14, products: 19 },
    { date: '2024-04-17', orders: 45, products: 36 },
    { date: '2024-04-18', orders: 36, products: 41 },
    { date: '2024-04-19', orders: 24, products: 18 },
    { date: '2024-04-20', orders: 9, products: 15 },
    { date: '2024-04-21', orders: 14, products: 20 },
    { date: '2024-04-22', orders: 22, products: 17 },
    { date: '2024-04-23', orders: 14, products: 23 },
    { date: '2024-04-24', orders: 39, products: 29 },
    { date: '2024-04-25', orders: 22, products: 25 },
    { date: '2024-04-26', orders: 8, products: 13 },
    { date: '2024-04-27', orders: 38, products: 42 },
    { date: '2024-04-28', orders: 12, products: 18 },
    { date: '2024-04-29', orders: 32, products: 24 },
    { date: '2024-04-30', orders: 45, products: 38 },
    { date: '2024-05-01', orders: 17, products: 22 },
    { date: '2024-05-02', orders: 29, products: 31 },
    { date: '2024-05-03', orders: 25, products: 19 },
    { date: '2024-05-04', orders: 39, products: 42 },
    { date: '2024-05-05', orders: 48, products: 39 },
    { date: '2024-05-06', orders: 50, products: 52 },
    { date: '2024-05-07', orders: 39, products: 30 },
    { date: '2024-05-08', orders: 15, products: 21 },
    { date: '2024-05-09', orders: 23, products: 18 },
    { date: '2024-05-10', orders: 29, products: 33 },
    { date: '2024-05-11', orders: 34, products: 27 },
    { date: '2024-05-12', orders: 20, products: 24 },
    { date: '2024-05-13', orders: 20, products: 16 },
    { date: '2024-05-14', orders: 45, products: 49 },
    { date: '2024-05-15', orders: 47, products: 38 },
    { date: '2024-05-16', orders: 34, products: 40 },
    { date: '2024-05-17', orders: 50, products: 42 },
    { date: '2024-05-18', orders: 32, products: 35 },
    { date: '2024-05-19', orders: 24, products: 18 },
    { date: '2024-05-20', orders: 18, products: 23 },
    { date: '2024-05-21', orders: 8, products: 14 },
    { date: '2024-05-22', orders: 8, products: 12 },
    { date: '2024-05-23', orders: 25, products: 29 },
    { date: '2024-05-24', orders: 29, products: 22 },
    { date: '2024-05-25', orders: 20, products: 25 },
    { date: '2024-05-26', orders: 21, products: 17 },
    { date: '2024-05-27', orders: 42, products: 46 },
    { date: '2024-05-28', orders: 23, products: 19 },
    { date: '2024-05-29', orders: 8, products: 13 },
    { date: '2024-05-30', orders: 34, products: 28 },
    { date: '2024-05-31', orders: 18, products: 23 },
    { date: '2024-06-01', orders: 18, products: 20 },
    { date: '2024-06-02', orders: 47, products: 41 },
    { date: '2024-06-03', orders: 10, products: 16 },
    { date: '2024-06-04', orders: 44, products: 38 },
    { date: '2024-06-05', orders: 9, products: 14 },
    { date: '2024-06-06', orders: 29, products: 25 },
    { date: '2024-06-07', orders: 32, products: 37 },
    { date: '2024-06-08', orders: 39, products: 32 },
    { date: '2024-06-09', orders: 44, products: 48 },
    { date: '2024-06-10', orders: 16, products: 20 },
    { date: '2024-06-11', orders: 9, products: 15 },
    { date: '2024-06-12', orders: 49, products: 42 },
    { date: '2024-06-13', orders: 8, products: 13 },
    { date: '2024-06-14', orders: 43, products: 38 },
    { date: '2024-06-15', orders: 31, products: 35 },
    { date: '2024-06-16', orders: 37, products: 31 },
    { date: '2024-06-17', orders: 48, products: 52 },
    { date: '2024-06-18', orders: 11, products: 17 },
    { date: '2024-06-19', orders: 34, products: 29 },
    { date: '2024-06-20', orders: 41, products: 45 },
    { date: '2024-06-21', orders: 17, products: 21 },
    { date: '2024-06-22', orders: 32, products: 27 },
    { date: '2024-06-23', orders: 48, products: 53 },
    { date: '2024-06-24', orders: 13, products: 18 },
    { date: '2024-06-25', orders: 14, products: 19 },
    { date: '2024-06-26', orders: 43, products: 38 },
    { date: '2024-06-27', orders: 45, products: 49 },
    { date: '2024-06-28', orders: 15, products: 20 },
    { date: '2024-06-29', orders: 10, products: 16 },
    { date: '2024-06-30', orders: 45, products: 40 },
];

const chartConfig = {
    orders: {
        label: 'Orders',
        color: 'hsl(var(--chart-1))',
    },
    products: {
        label: 'Products',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState('90d');

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange('7d');
        }
    }, [isMobile]);

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date('2024-06-30');
        let daysToSubtract = 90;
        if (timeRange === '30d') {
            daysToSubtract = 30;
        } else if (timeRange === '7d') {
            daysToSubtract = 7;
        }
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Total Orders and Products</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Total for the last 3 months
                    </span>
                    <span className="@[540px]/card:hidden">Last 3 months</span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="90d">
                            Last 3 months
                        </ToggleGroupItem>
                        <ToggleGroupItem value="30d">
                            Last 30 days
                        </ToggleGroupItem>
                        <ToggleGroupItem value="7d">
                            Last 7 days
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient
                                id="fillProducts"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-products)"
                                    stopOpacity={1.0}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-products)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillOrders"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-orders)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-orders)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value,
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="products"
                            type="natural"
                            fill="url(#fillProducts)"
                            stroke="var(--color-products)"
                            stackId="a"
                        />
                        <Area
                            dataKey="orders"
                            type="natural"
                            fill="url(#fillOrders)"
                            stroke="var(--color-orders)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
