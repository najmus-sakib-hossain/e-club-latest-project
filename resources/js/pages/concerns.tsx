import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { SiteLayout } from '@/components/site/site-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Calendar, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations';

interface Concern {
    id: number;
    title: string;
    slug: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'active' | 'resolved' | 'ongoing';
    date_reported: string;
    affected_members_count: number | null;
}

interface ConcernsPageProps {
    concerns: Concern[];
    footer: any;
    navigation: any;
    socialLinks: any;
}

export default function ConcernsPage({ concerns, footer, navigation, socialLinks }: ConcernsPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

    // Filter concerns
    const filteredConcerns = concerns.filter(concern => {
        const matchesSearch = concern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            concern.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || concern.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || concern.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'medium':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'resolved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'ongoing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <SiteLayout navigationMenus={navigation} footerData={footer}>
            <Head title="Member Concerns" />

            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={pageVariants}
                className="min-h-screen"
            >
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <AlertCircle className="h-16 w-16 mx-auto mb-6" />
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Member Concerns</h1>
                            <p className="text-lg text-white/90">
                                Stay informed about issues affecting our community and our efforts to address them
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search concerns..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="ongoing">Ongoing</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Priority Filter */}
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Filter by priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Active Filters */}
                        {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
                            <div className="flex items-center gap-2 mt-4">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Showing {filteredConcerns.length} of {concerns.length} concerns
                                </span>
                                {(statusFilter !== 'all' || priorityFilter !== 'all' || searchTerm) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setStatusFilter('all');
                                            setPriorityFilter('all');
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Concerns List */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        {filteredConcerns.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="max-w-md mx-auto">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        <Search className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No concerns found</h3>
                                    <p className="text-gray-600 mb-6">
                                        {searchTerm
                                            ? "Try adjusting your search or filters"
                                            : "No concerns have been reported at this time"}
                                    </p>
                                    {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
                                        <Button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setStatusFilter('all');
                                                setPriorityFilter('all');
                                            }}
                                        >
                                            Clear filters
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-5xl mx-auto space-y-6">
                                {filteredConcerns.map((concern) => (
                                    <motion.div
                                        key={concern.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <a
                                            href={`/concerns/${concern.slug}`}
                                            className="block group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 hover:border-l-primary"
                                            style={{
                                                borderLeftColor: concern.priority === 'critical' ? '#ef4444' :
                                                    concern.priority === 'high' ? '#f97316' :
                                                        concern.priority === 'medium' ? '#3b82f6' : '#9ca3af'
                                            }}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <Badge className={getPriorityColor(concern.priority)}>
                                                            {concern.priority}
                                                        </Badge>
                                                        <Badge className={getStatusColor(concern.status)}>
                                                            {concern.status}
                                                        </Badge>
                                                        {concern.category && (
                                                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                                                {concern.category}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                                        {concern.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                        {concern.description}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>
                                                                Reported: {new Date(concern.date_reported).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                        {concern.affected_members_count && (
                                                            <div className="flex items-center gap-2">
                                                                <AlertCircle className="h-4 w-4" />
                                                                <span>{concern.affected_members_count} members affected</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="group-hover:bg-primary group-hover:text-white transition-colors"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold mb-4">Have a Concern to Report?</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                We take all member concerns seriously. If you're experiencing an issue, please reach out to us.
                            </p>
                            <Button asChild size="lg">
                                <a href="/contact">Contact Us</a>
                            </Button>
                        </div>
                    </div>
                </section>
            </motion.div>
        </SiteLayout>
    );
}
