"use client"

import { Eye, Filter, Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const members = [
    {
        id: "651535",
        name: "Olivia Rhye",
        userType: "Governing Body",
        company: "ABC LTD",
        email: "olivia@untitledui.com",
        paymentType: "Paid",
        amount: "10,00,000",
        status: "Pending",
    },
    {
        id: "651535",
        name: "Olivia Rhye",
        userType: "Corporate",
        company: "ABC LTD",
        email: "phoenix@untitledui.com",
        paymentType: "Paid",
        amount: "10,000",
        status: "Pending",
    },
    {
        id: "651535",
        name: "Olivia Rhye",
        userType: "Governing Body",
        company: "ABC LTD",
        email: "lana@untitledui.com",
        paymentType: "Paid",
        amount: "10,00,000",
        status: "Pending",
    },
]

export function MembersTable() {
    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">New members Request</h3>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400">
                        100 users
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search"
                            className="w-full pl-9 sm:w-[250px]"
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Sort By
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[50px]">
                                <Checkbox />
                            </TableHead>
                            <TableHead>Member ID</TableHead>
                            <TableHead>Member Name</TableHead>
                            <TableHead>User Type</TableHead>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Email address</TableHead>
                            <TableHead>Payment Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell className="font-medium text-muted-foreground">{member.id}</TableCell>
                                <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                                <TableCell className="text-muted-foreground">{member.userType}</TableCell>
                                <TableCell className="text-muted-foreground">{member.company}</TableCell>
                                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                                        {member.paymentType}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{member.amount}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                                        • {member.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
