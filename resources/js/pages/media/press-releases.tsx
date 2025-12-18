import { Head, Link } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PressRelease {
    id: number;
    title: string;
    content: string;
    published_at: string;
    image?: string;
}

export default function PressReleases({ pressReleases }: { pressReleases: PressRelease[] }) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <SiteLayout>
            <Head title="Press Releases" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Press Releases
                        </h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Official announcements and media coverage of the E-Club
                        </p>
                    </div>
                </div>
            </section>

            {/* Press Releases List */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {pressReleases.length > 0 ? (
                            pressReleases.map((release) => (
                                <div
                                    key={release.id}
                                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(release.published_at)}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {release.title}
                                            </h3>
                                            <p className="text-gray-700 mb-4 line-clamp-3">
                                                {release.content}
                                            </p>
                                            <Button asChild variant="link" className="p-0">
                                                <Link href={`/media/${release.id}`}>
                                                    Read Full Release <ArrowRight className="w-4 h-4 ml-1" />
                                                </Link>
                                            </Button>
                                        </div>
                                        {release.image && (
                                            <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                                <img
                                                    src={release.image}
                                                    alt={release.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <p className="text-gray-500 text-lg">
                                    No press releases available at the moment.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
