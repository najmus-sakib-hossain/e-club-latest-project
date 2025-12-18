import { Head, Link } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notice {
    id: number;
    title: string;
    content: string;
    published_at: string;
    image?: string;
}

export default function Notices({ notices }: { notices: Notice[] }) {
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
            <Head title="Notice and Updates" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Notice and Updates
                        </h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Stay informed on E-Club happenings and industry news
                        </p>
                    </div>
                </div>
            </section>

            {/* Notices List */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {notices.length > 0 ? (
                            notices.map((notice) => (
                                <div
                                    key={notice.id}
                                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(notice.published_at)}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {notice.title}
                                            </h3>
                                            <p className="text-gray-700 mb-4 line-clamp-3">
                                                {notice.content}
                                            </p>
                                            <Button asChild variant="link" className="p-0">
                                                <Link href={`/media/${notice.id}`}>
                                                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                                                </Link>
                                            </Button>
                                        </div>
                                        {notice.image && (
                                            <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                                <img
                                                    src={notice.image}
                                                    alt={notice.title}
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
                                    No notices available at the moment.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
