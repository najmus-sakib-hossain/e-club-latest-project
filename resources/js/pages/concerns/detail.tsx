import React from 'react';
import { Head } from '@inertiajs/react';
import { SiteLayout } from '@/components/site/site-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, Users, ArrowLeft, ExternalLink } from 'lucide-react';
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
    proposed_solution: string | null;
    current_status_update: string | null;
    related_links: string[] | null;
    affected_sectors: string[] | null;
}

interface ConcernDetailProps {
    concern: Concern;
    footer: any;
    navigation: any;
    socialLinks: any;
}

export default function ConcernDetail({ concern, footer, navigation, socialLinks }: ConcernDetailProps) {
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

    const getPriorityBorderColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'border-red-500';
            case 'high':
                return 'border-orange-500';
            case 'medium':
                return 'border-blue-500';
            default:
                return 'border-gray-300';
        }
    };

    return (
        <SiteLayout navigationMenus={navigation} footerData={footer}>
            <Head title={concern.title} />

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
                            <a href="/concerns">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Concerns
                            </a>
                        </Button>
                    </div>
                </section>

                {/* Hero Section */}
                <section className={`border-l-8 ${getPriorityBorderColor(concern.priority)} bg-white`}>
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-4xl">
                            {concern.category && (
                                <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                                    {concern.category}
                                </div>
                            )}
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">{concern.title}</h1>
                            <div className="flex flex-wrap gap-2">
                                <Badge className={getPriorityColor(concern.priority)}>
                                    {concern.priority} priority
                                </Badge>
                                <Badge className={getStatusColor(concern.status)}>
                                    {concern.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Description */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Concern Details</h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {concern.description}
                                    </p>
                                </div>

                                {/* Current Status Update */}
                                {concern.current_status_update && (
                                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
                                            <div>
                                                <h3 className="text-lg font-bold text-blue-900 mb-2">Current Status</h3>
                                                <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">
                                                    {concern.current_status_update}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Proposed Solution */}
                                {concern.proposed_solution && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4">Proposed Solution</h2>
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {concern.proposed_solution}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Affected Sectors */}
                                {concern.affected_sectors && concern.affected_sectors.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4">Affected Sectors</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {concern.affected_sectors.map((sector, index) => (
                                                <Badge key={index} variant="outline" className="text-sm">
                                                    {sector}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Related Links */}
                                {concern.related_links && concern.related_links.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4">Related Resources</h2>
                                        <div className="space-y-2">
                                            {concern.related_links.map((link, index) => (
                                                <a
                                                    key={index}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-primary hover:underline group"
                                                >
                                                    <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                                    <span>{link}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Report Similar Concern */}
                                <div className="bg-gray-50 border rounded-lg p-6">
                                    <h3 className="text-lg font-bold mb-2">Experiencing a Similar Issue?</h3>
                                    <p className="text-gray-700 mb-4">
                                        If you're facing a similar concern, please let us know. Your feedback helps us better understand and address these issues.
                                    </p>
                                    <Button asChild>
                                        <a href="/contact">Report a Concern</a>
                                    </Button>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Concern Info Card */}
                                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
                                    <h3 className="font-bold text-lg">Concern Information</h3>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Date Reported</p>
                                            <p className="text-gray-900">
                                                {new Date(concern.date_reported).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {concern.affected_members_count && (
                                        <div className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Members Affected</p>
                                                <p className="text-gray-900">{concern.affected_members_count} members</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Priority Level</span>
                                            <Badge className={getPriorityColor(concern.priority)}>
                                                {concern.priority}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Status</span>
                                            <Badge className={getStatusColor(concern.status)}>
                                                {concern.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Priority Explanation */}
                                <div className={`rounded-lg p-6 space-y-2 border-2 ${getPriorityBorderColor(concern.priority)}`}>
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5" />
                                        {concern.priority.charAt(0).toUpperCase() + concern.priority.slice(1)} Priority
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {concern.priority === 'critical' && "This concern requires immediate attention and action from the committee."}
                                        {concern.priority === 'high' && "This concern is of significant importance and will be addressed promptly."}
                                        {concern.priority === 'medium' && "This concern is being monitored and will be addressed in due course."}
                                        {concern.priority === 'low' && "This concern is noted and will be reviewed as resources allow."}
                                    </p>
                                </div>

                                {/* Help Card */}
                                <div className="bg-primary text-white rounded-lg p-6 space-y-4">
                                    <h3 className="font-bold text-lg">Need Assistance?</h3>
                                    <p className="text-sm text-white/90">
                                        If you have questions or need support regarding this concern, please contact us.
                                    </p>
                                    <Button asChild variant="secondary" className="w-full">
                                        <a href="/contact">Contact Support</a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </motion.div>
        </SiteLayout>
    );
}
