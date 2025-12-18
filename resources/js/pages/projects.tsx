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
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations';

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string;
    category: string;
    status: 'ongoing' | 'completed' | 'planned';
    image: string | null;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    coordinator: string | null;
    participants_count: number | null;
    impact_summary: string | null;
}

interface ProjectsPageProps {
    projects: Project[];
    footer: any;
    navigation: any;
    socialLinks: any;
}

export default function ProjectsPage({ projects, footer, navigation, socialLinks }: ProjectsPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // Get unique categories
    const categories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));

    // Filter projects
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'ongoing':
                return 'default'; // Blue
            case 'completed':
                return 'secondary'; // Green
            case 'planned':
                return 'outline'; // Yellow
            default:
                return 'secondary';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ongoing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'planned':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <SiteLayout navigationMenus={navigation} footerData={footer}>
            <Head title="Our Projects" />

            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={pageVariants}
                className="min-h-screen"
            >
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Projects</h1>
                            <p className="text-lg text-white/90">
                                Explore our initiatives and projects that drive positive change in our community
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
                                    placeholder="Search projects..."
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
                                    <SelectItem value="ongoing">Ongoing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="planned">Planned</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Category Filter */}
                            {categories.length > 0 && (
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-full md:w-[180px]">
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(category => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        {/* Active Filters */}
                        {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
                            <div className="flex items-center gap-2 mt-4">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Showing {filteredProjects.length} of {projects.length} projects
                                </span>
                                {(statusFilter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setStatusFilter('all');
                                            setCategoryFilter('all');
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        {filteredProjects.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="max-w-md mx-auto">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        <Search className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                                    <p className="text-gray-600 mb-6">
                                        {searchTerm
                                            ? "Try adjusting your search or filters"
                                            : "Check back soon for new projects"}
                                    </p>
                                    {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
                                        <Button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setStatusFilter('all');
                                                setCategoryFilter('all');
                                            }}
                                        >
                                            Clear filters
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProjects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <a
                                            href={`/projects/${project.slug}`}
                                            className="block group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            {/* Project Image */}
                                            <div className="relative h-48 bg-gray-200 overflow-hidden">
                                                {project.image ? (
                                                    <img
                                                        src={`/storage/${project.image}`}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                                                        <Users className="h-16 w-16 text-primary/40" />
                                                    </div>
                                                )}
                                                {/* Status Badge */}
                                                <div className="absolute top-3 right-3">
                                                    <Badge className={getStatusColor(project.status)}>
                                                        {project.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Project Content */}
                                            <div className="p-6">
                                                {project.category && (
                                                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                                                        {project.category}
                                                    </div>
                                                )}
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                                    {project.description}
                                                </p>

                                                {/* Project Meta */}
                                                <div className="space-y-2 text-sm text-gray-500">
                                                    {project.start_date && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>
                                                                {new Date(project.start_date).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                                {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}`}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {project.location && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{project.location}</span>
                                                        </div>
                                                    )}
                                                    {project.participants_count && (
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>{project.participants_count} participants</span>
                                                        </div>
                                                    )}
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
                <section className="py-16 bg-primary text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Want to Get Involved?</h2>
                        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                            Join us in our mission to create positive change in our community. There are many ways to participate!
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" variant="secondary">
                                <a href="/join">Become a Member</a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                                <a href="/contact">Contact Us</a>
                            </Button>
                        </div>
                    </div>
                </section>
            </motion.div>
        </SiteLayout>
    );
}
