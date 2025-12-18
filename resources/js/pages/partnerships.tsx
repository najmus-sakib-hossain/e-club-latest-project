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
import { Building2, Globe, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations';

interface Partnership {
    id: number;
    partner_name: string;
    slug: string;
    logo: string | null;
    type: 'corporate' | 'academic' | 'government' | 'ngo';
    industry: string | null;
    website: string | null;
    status: 'active' | 'inactive' | 'expired';
    description: string | null;
}

interface PartnershipsPageProps {
    partnerships: Partnership[];
    footer: any;
    navigation: any;
    socialLinks: any;
}

export default function PartnershipsPage({ partnerships, footer, navigation, socialLinks }: PartnershipsPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('active');

    // Filter partnerships
    const filteredPartnerships = partnerships.filter(partnership => {
        const matchesSearch = partnership.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partnership.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partnership.industry?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || partnership.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || partnership.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'corporate':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'academic':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'government':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'ngo':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'expired':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <SiteLayout navigationMenus={navigation} footerData={footer}>
            <Head title="Our Partnerships" />

            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={pageVariants}
                className="min-h-screen"
            >
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-purple-600 to-purple-500 text-white py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <Building2 className="h-16 w-16 mx-auto mb-6" />
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partnerships</h1>
                            <p className="text-lg text-white/90">
                                Collaborating with leading organizations to create greater impact and opportunities
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
                                    placeholder="Search partnerships..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Type Filter */}
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="corporate">Corporate</SelectItem>
                                    <SelectItem value="academic">Academic</SelectItem>
                                    <SelectItem value="government">Government</SelectItem>
                                    <SelectItem value="ngo">NGO</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Active Filters */}
                        {(searchTerm || typeFilter !== 'all' || statusFilter !== 'active') && (
                            <div className="flex items-center gap-2 mt-4">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Showing {filteredPartnerships.length} of {partnerships.length} partnerships
                                </span>
                                {(typeFilter !== 'all' || statusFilter !== 'active' || searchTerm) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setTypeFilter('all');
                                            setStatusFilter('active');
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Partnerships Grid */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        {filteredPartnerships.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="max-w-md mx-auto">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        <Search className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No partnerships found</h3>
                                    <p className="text-gray-600 mb-6">
                                        {searchTerm
                                            ? "Try adjusting your search or filters"
                                            : "Check back soon for new partnerships"}
                                    </p>
                                    {(searchTerm || typeFilter !== 'all' || statusFilter !== 'active') && (
                                        <Button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setTypeFilter('all');
                                                setStatusFilter('active');
                                            }}
                                        >
                                            Clear filters
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredPartnerships.map((partnership) => (
                                    <motion.div
                                        key={partnership.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <a
                                            href={`/partnerships/${partnership.slug}`}
                                            className="block group bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center"
                                        >
                                            {/* Partner Logo */}
                                            <div className="relative h-32 mb-4 flex items-center justify-center">
                                                {partnership.logo ? (
                                                    <img
                                                        src={`/storage/${partnership.logo}`}
                                                        alt={partnership.partner_name}
                                                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                                                        <Building2 className="h-16 w-16 text-primary/40" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Partner Info */}
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                                {partnership.partner_name}
                                            </h3>

                                            <div className="flex flex-wrap justify-center gap-2 mb-3">
                                                <Badge className={getTypeBadgeColor(partnership.type)}>
                                                    {partnership.type}
                                                </Badge>
                                                <Badge className={getStatusColor(partnership.status)}>
                                                    {partnership.status}
                                                </Badge>
                                            </div>

                                            {partnership.industry && (
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {partnership.industry}
                                                </p>
                                            )}

                                            {partnership.description && (
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                                    {partnership.description}
                                                </p>
                                            )}

                                            {partnership.website && (
                                                <div className="flex items-center justify-center gap-2 text-sm text-primary">
                                                    <Globe className="h-4 w-4" />
                                                    <span className="font-medium group-hover:underline">Visit Website</span>
                                                </div>
                                            )}
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
                            <h2 className="text-3xl font-bold mb-4">Interested in Partnership?</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                We're always looking for meaningful partnerships that align with our mission and values. Let's collaborate!
                            </p>
                            <Button asChild size="lg">
                                <a href="/contact">Get in Touch</a>
                            </Button>
                        </div>
                    </div>
                </section>
            </motion.div>
        </SiteLayout>
    );
}
