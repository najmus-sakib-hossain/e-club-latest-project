import { Head } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mail, Linkedin, Phone } from 'lucide-react';
import { useState } from 'react';

interface Member {
    id: number;
    name: string;
    membership_type: string;
    company?: string;
    designation?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    image?: string;
}

export default function MemberDirectory({ members }: { members: Member[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.designation?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SiteLayout>
            <Head title="Member Directory" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Member Directory
                        </h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Connect and collaborate with fellow E-Club members
                        </p>
                    </div>
                </div>
            </section>

            {/* Search and Directory */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search members by name, company, or designation..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 py-6 text-lg"
                            />
                        </div>
                    </div>

                    {/* Members Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-100">
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-300">
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {member.name}
                                        </h3>
                                        <p className="text-primary font-semibold text-sm mb-1">
                                            {member.membership_type}
                                        </p>
                                        {member.designation && (
                                            <p className="text-gray-600 text-sm mb-1">
                                                {member.designation}
                                            </p>
                                        )}
                                        {member.company && (
                                            <p className="text-gray-500 text-sm mb-4">
                                                {member.company}
                                            </p>
                                        )}

                                        {/* Contact Links */}
                                        <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                            {member.email && (
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="text-gray-600 hover:text-primary transition-colors"
                                                    title="Email"
                                                >
                                                    <Mail className="w-5 h-5" />
                                                </a>
                                            )}
                                            {member.phone && (
                                                <a
                                                    href={`tel:${member.phone}`}
                                                    className="text-gray-600 hover:text-primary transition-colors"
                                                    title="Phone"
                                                >
                                                    <Phone className="w-5 h-5" />
                                                </a>
                                            )}
                                            {member.linkedin && (
                                                <a
                                                    href={member.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-600 hover:text-primary transition-colors"
                                                    title="LinkedIn"
                                                >
                                                    <Linkedin className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    No members found matching your search.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
