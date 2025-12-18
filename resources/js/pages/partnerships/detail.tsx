import React from 'react';
import { Head } from '@inertiajs/react';
import { SiteLayout } from '@/components/site/site-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Globe, Mail, Phone, Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';
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
    contact_person: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    partnership_start_date: string | null;
    partnership_end_date: string | null;
    status: 'active' | 'inactive' | 'expired';
    description: string | null;
    benefits: string[] | null;
    joint_projects: string[] | null;
}

interface PartnershipDetailProps {
    partnership: Partnership;
    footer: any;
    navigation: any;
    socialLinks: any;
}

export default function PartnershipDetail({ partnership, footer, navigation, socialLinks }: PartnershipDetailProps) {
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
            <Head title={partnership.partner_name} />

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
                            <a href="/partnerships">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Partnerships
                            </a>
                        </Button>
                    </div>
                </section>

                {/* Hero Section */}
                <section className="bg-gradient-to-r from-purple-600 to-purple-500 text-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Logo */}
                                <div className="flex-shrink-0">
                                    {partnership.logo ? (
                                        <div className="w-48 h-48 bg-white rounded-lg p-4 flex items-center justify-center">
                                            <img
                                                src={`/storage/${partnership.logo}`}
                                                alt={partnership.partner_name}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-48 h-48 bg-white/10 rounded-lg flex items-center justify-center">
                                            <Building2 className="h-24 w-24 text-white/40" />
                                        </div>
                                    )}
                                </div>

                                {/* Partner Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{partnership.partner_name}</h1>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                        <Badge className={getTypeBadgeColor(partnership.type)}>
                                            {partnership.type}
                                        </Badge>
                                        <Badge className={getStatusColor(partnership.status)}>
                                            {partnership.status}
                                        </Badge>
                                        {partnership.industry && (
                                            <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                                                {partnership.industry}
                                            </Badge>
                                        )}
                                    </div>
                                    {partnership.website && (
                                        <a
                                            href={partnership.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                                        >
                                            <Globe className="h-4 w-4" />
                                            <span>Visit Website</span>
                                        </a>
                                    )}
                                </div>
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
                                {partnership.description && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4">About Our Partnership</h2>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {partnership.description}
                                        </p>
                                    </div>
                                )}

                                {/* Benefits */}
                                {partnership.benefits && partnership.benefits.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4">Partnership Benefits</h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {partnership.benefits.map((benefit, index) => (
                                                <div key={index} className="flex gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                    <p className="text-gray-700">{benefit}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Joint Projects */}
                                {partnership.joint_projects && partnership.joint_projects.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4">Joint Projects & Initiatives</h2>
                                        <div className="space-y-3">
                                            {partnership.joint_projects.map((project, index) => (
                                                <div key={index} className="flex gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                                        {index + 1}
                                                    </div>
                                                    <p className="text-gray-700 flex-1">{project}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Partnership Impact */}
                                <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
                                    <h3 className="text-xl font-bold text-purple-900 mb-2">Partnership Impact</h3>
                                    <p className="text-purple-800">
                                        This partnership enhances our ability to serve our members and community through collaborative efforts, shared resources, and mutual support.
                                    </p>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Contact Information */}
                                {(partnership.contact_person || partnership.contact_email || partnership.contact_phone) && (
                                    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
                                        <h3 className="font-bold text-lg">Contact Information</h3>

                                        {partnership.contact_person && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-1">Contact Person</p>
                                                <p className="text-gray-900 font-medium">{partnership.contact_person}</p>
                                            </div>
                                        )}

                                        {partnership.contact_email && (
                                            <div className="flex items-start gap-3">
                                                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                                                    <a
                                                        href={`mailto:${partnership.contact_email}`}
                                                        className="text-primary hover:underline break-all"
                                                    >
                                                        {partnership.contact_email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {partnership.contact_phone && (
                                            <div className="flex items-start gap-3">
                                                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 mb-1">Phone</p>
                                                    <a
                                                        href={`tel:${partnership.contact_phone}`}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {partnership.contact_phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Partnership Timeline */}
                                {(partnership.partnership_start_date || partnership.partnership_end_date) && (
                                    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
                                        <h3 className="font-bold text-lg">Partnership Timeline</h3>

                                        {partnership.partnership_start_date && (
                                            <div className="flex items-start gap-3">
                                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Start Date</p>
                                                    <p className="text-gray-900">
                                                        {new Date(partnership.partnership_start_date).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {partnership.partnership_end_date && (
                                            <div className="flex items-start gap-3">
                                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">End Date</p>
                                                    <p className="text-gray-900">
                                                        {new Date(partnership.partnership_end_date).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600">Current Status</span>
                                                <Badge className={getStatusColor(partnership.status)}>
                                                    {partnership.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Partnership Type Info */}
                                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-3">
                                    <h3 className="font-bold text-lg">Partnership Type</h3>
                                    <div className="flex items-center gap-3">
                                        <div className={`px-4 py-2 rounded-lg ${getTypeBadgeColor(partnership.type)}`}>
                                            <p className="font-semibold capitalize">{partnership.type}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {partnership.type === 'corporate' && "A strategic business partnership focused on mutual growth and value creation."}
                                        {partnership.type === 'academic' && "An educational partnership for knowledge sharing and research collaboration."}
                                        {partnership.type === 'government' && "A partnership with government entities for policy and community development."}
                                        {partnership.type === 'ngo' && "A collaboration with non-profit organizations for social impact initiatives."}
                                    </p>
                                </div>

                                {/* Become a Partner CTA */}
                                <div className="bg-primary text-white rounded-lg p-6 space-y-4">
                                    <h3 className="font-bold text-lg">Interested in Partnership?</h3>
                                    <p className="text-sm text-white/90">
                                        We're always open to exploring new partnership opportunities. Get in touch to discuss collaboration.
                                    </p>
                                    <Button asChild variant="secondary" className="w-full">
                                        <a href="/contact">Contact Us</a>
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
