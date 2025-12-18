import { Head } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Mail, Linkedin, Phone } from 'lucide-react';

interface CommitteeMember {
    id: number;
    name: string;
    role: string;
    designation: string;
    description: string;
    image: string;
    email?: string;
    phone?: string;
    linkedin?: string;
}

interface AlumniPageProps {
    members: CommitteeMember[];
    year: string;
}

export default function Alumni202223({ members, year }: AlumniPageProps) {
    return (
        <SiteLayout>
            <Head title={`EC Alumni ${year} - Committee`} />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            EC Alumni {year}
                        </h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Former members of the E-Club's governing body
                        </p>
                    </div>
                </div>
            </section>

            {/* Members Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-primary font-semibold mb-1">
                                        {member.role}
                                    </p>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {member.designation}
                                    </p>

                                    {/* Contact Links */}
                                    <div className="flex items-center gap-3 mt-4">
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
                        ))}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
