"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- User Growth Chart ---

const userGrowthData = [
    { month: "Jan", users: 600 },
    { month: "Feb", users: 650 },
    { month: "Mar", users: 620 },
    { month: "Apr", users: 640 },
    { month: "May", users: 680 },
    { month: "Jun", users: 710 },
    { month: "Jul", users: 650 },
    { month: "Aug", users: 720 },
    { month: "Sep", users: 760 },
    { month: "Oct", users: 720 },
    { month: "Nov", users: 750 },
    { month: "Dec", users: 820 },
]

const userGrowthConfig = {
    users: {
        label: "Users",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function UserGrowthChart() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal">Total Users Groth</CardTitle>
                <Select defaultValue="month">
                    <SelectTrigger className="w-[100px] h-8 text-xs">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <ChartContainer config={userGrowthConfig} className="h-[250px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={userGrowthData}
                        margin={{
                            left: -20,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={6}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Area
                            dataKey="users"
                            type="monotone"
                            fill="var(--color-users)"
                            fillOpacity={0.1}
                            stroke="var(--color-users)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

// --- Top Projects Chart ---

const projectData = [
    { project: "Proj. A", earned: 1000 },
    { project: "Proj. B", earned: 850 },
    { project: "Proj. C", earned: 650 },
    { project: "Proj. D", earned: 520 },
    { project: "Proj. E", earned: 350 },
]

const projectConfig = {
    earned: {
        label: "Earned",
        color: "hsl(173 58% 39%)", // Custom teal color
    },
} satisfies ChartConfig

export function TopProjectsChart() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal">Top Earned Project</CardTitle>
                <Select defaultValue="yearly">
                    <SelectTrigger className="w-[100px] h-8 text-xs">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <ChartContainer config={projectConfig} className="h-[250px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={projectData}
                        margin={{
                            left: -20,
                            right: 12,
                        }}
                        barSize={20}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="project"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={6}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'transparent' }}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="earned" fill="var(--color-earned)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

// --- Member Type Chart ---

const memberTypeData = [
    { type: "Gover. Body", count: 350, fill: "#064e3b" }, // dark green
    { type: "Founding", count: 250, fill: "#166534" },
    { type: "Corporate", count: 200, fill: "#15803d" },
    { type: "GM", count: 180, fill: "#22c55e" },
    { type: "Associate", count: 150, fill: "#86efac" },
    { type: "Non-Dhaka", count: 100, fill: "#bbf7d0" },
]

const memberTypeConfig = {
    count: {
        label: "Members",
    },
    "Gover. Body": { label: "Gover. Body", color: "#064e3b" },
    "Founding": { label: "Founding", color: "#166534" },
    "Corporate": { label: "Corporate", color: "#15803d" },
    "GM": { label: "GM", color: "#22c55e" },
    "Associate": { label: "Associate", color: "#86efac" },
    "Non-Dhaka": { label: "Non-Dhaka", color: "#bbf7d0" },
} satisfies ChartConfig

export function MemberTypeChart() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal">All Member Type</CardTitle>
                <Select defaultValue="yearly">
                    <SelectTrigger className="w-[100px] h-8 text-xs">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={memberTypeConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <Pie
                            data={memberTypeData}
                            dataKey="count"
                            nameKey="type"
                            innerRadius={60}
                            outerRadius={80}
                            strokeWidth={0}
                        />
                        <ChartLegend
                            content={<ChartLegendContent nameKey="type" />}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
