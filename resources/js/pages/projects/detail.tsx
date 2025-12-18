import React from 'react';
import { Head } from '@inertiajs/react';
import { SiteLayout } from '@/components/site/site-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Mail, ArrowLeft } from 'lucide-react';
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
    coordinator_email: string | null;
    participants_count: number | null;
    budget: string | null;
    impact_summary: string | null;
    objectives: string[] | null;
    outcomes: string[] | null;
}

interface ProjectDetailProps {
    project: Project;
    relatedProjects: Project[];
    footer: any;
    navigation: any;
    socialLinks: any;
}

export default function ProjectDetail({ project, relatedProjects, footer, navigation, socialLinks }: ProjectDetailProps) {
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
            <Head title={project.title} />

            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={pageVariants}
                className="min-h-screen"
            >
                {/* Back Button */}
                <section className="bg-gray-50 border-b">
                    <div className="container mx-auto px-4 py-4">
                        <Button asChild variant="ghost" size="sm">
                            <a href="/projects">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Projects
                            </a>
                        </Button>
                    </div>
                </section>

                {/* Hero Section with Image */}
                <section className="relative">
                    {project.image ? (
                        <div className="relative h-96 bg-gray-900">
                            <img
                                src={`/storage/${project.image}`}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 text-white py-12">
                                <div className="container mx-auto px-4">
                                    <div className="max-w-4xl">
                                        {project.category && (
                                            <div className="text-sm font-semibold uppercase tracking-wider mb-2 text-white/90">
                                                {project.category}
                                            </div>
                                        )}
                                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
                                        <Badge className={getStatusColor(project.status)}>
                                            {project.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
                            <div className="container mx-auto px-4">
                                <div className="max-w-4xl">
                                    {project.category && (
                                        <div className="text-sm font-semibold uppercase tracking-wider mb-2 text-white/90">
                                            {project.category}
                                        </div>
                                    )}
                                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
                                    <Badge className={getStatusColor(project.status)}>
                                        {project.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Main Content */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Description */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">About This Project</h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {project.description}
                                    </p>
                                </div>

                                {/* Objectives */}
                                {project.objectives && project.objectives.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4">Objectives</h2>
                                        <ul className="space-y-3">
                                            {project.objectives.map((objective, index) => (
                                                <li key={index} className="flex gap-3">
                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                                                        {index + 1}
                                                    </div>
                                                    <p className="text-gray-700 flex-1">{objective}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Outcomes */}
                                {project.outcomes && project.outcomes.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4">Expected Outcomes</h2>
                                        <ul className="space-y-3">
                                            {project.outcomes.map((outcome, index) => (
                                                <li key={index} className="flex gap-3">
                                                    <div className="flex-shrink-0 text-primary">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-700 flex-1">{outcome}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Impact Summary */}
                                {project.impact_summary && (
                                    <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                                        <h3 className="text-xl font-bold mb-3 text-primary">Impact Summary</h3>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {project.impact_summary}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Project Details Card */}
                                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
                                    <h3 className="font-bold text-lg">Project Details</h3>

                                    {project.start_date && (
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Timeline</p>
                                                <p className="text-gray-900">
                                                    {new Date(project.start_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                    {project.end_date && (
                                                        <> - {new Date(project.end_date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}</>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {project.location && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Location</p>
                                                <p className="text-gray-900">{project.location}</p>
                                            </div>
                                        </div>
                                    )}

                                    {project.participants_count && (
                                        <div className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Participants</p>
                                                <p className="text-gray-900">{project.participants_count} members</p>
                                            </div>
                                        </div>
                                    )}

                                    {project.coordinator && (
                                        <div className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Coordinator</p>
                                                <p className="text-gray-900">{project.coordinator}</p>
                                                {project.coordinator_email && (
                                                    <a
                                                        href={`mailto:${project.coordinator_email}`}
                                                        className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                                                    >
                                                        <Mail className="h-3 w-3" />
                                                        Contact
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {project.budget && (
                                        <div className="pt-4 border-t">
                                            <p className="text-sm font-medium text-gray-600 mb-1">Budget</p>
                                            <p className="text-xl font-bold text-primary">{project.budget}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Get Involved Card */}
                                <div className="bg-primary text-white rounded-lg p-6 space-y-4">
                                    <h3 className="font-bold text-lg">Get Involved</h3>
                                    <p className="text-sm text-white/90">
                                        Interested in participating in this project? Contact us to learn more!
                                    </p>
                                    <Button asChild variant="secondary" className="w-full">
                                        <a href="/contact">Contact Us</a>
                                    </Button>
                                </div>

                                {/* Related Projects */}
                                {relatedProjects.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-sm border p-6">
                                        <h3 className="font-bold text-lg mb-4">Related Projects</h3>
                                        <div className="space-y-3">
                                            {relatedProjects.map((related) => (
                                                <a
                                                    key={related.id}
                                                    href={`/projects/${related.slug}`}
                                                    className="block group"
                                                >
                                                    <p className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                                        {related.title}
                                                    </p>
                                                    <Badge className={`${getStatusColor(related.status)} mt-1`} variant="outline">
                                                        {related.status}
                                                    </Badge>
                                                </a>
                                            ))}
                                        </div>
                                        <Button asChild variant="outline" className="w-full mt-4">
                                            <a href="/projects">View All Projects</a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </motion.div>
        </SiteLayout>
    );
}
