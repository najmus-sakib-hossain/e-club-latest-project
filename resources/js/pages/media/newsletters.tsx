import { Head } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Calendar, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Newsletter {
    id: number;
    title: string;
    content: string;
    published_at: string;
    pdf_file?: string;
    image?: string;
}

export default function Newsletters({ newsletters }: { newsletters: Newsletter[] }) {
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
            <Head title="Newsletter Archive" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Newsletter Archive
                        </h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Catch up on past E-Club news and insights
                        </p>
                    </div>
                </div>
            </section>

            {/* Newsletters Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {newsletters.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {newsletters.map((newsletter) => (
                                <div
                                    key={newsletter.id}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    {newsletter.image ? (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={newsletter.image}
                                                alt={newsletter.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                            <FileText className="w-20 h-20 text-white opacity-50" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(newsletter.published_at)}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {newsletter.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {newsletter.content}
                                        </p>
                                        {newsletter.pdf_file && (
                                            <Button asChild className="w-full">
                                                <a href={newsletter.pdf_file} target="_blank" rel="noopener noreferrer">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download PDF
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-500 text-lg">
                                No newsletters available at the moment.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </SiteLayout>
    );
}
