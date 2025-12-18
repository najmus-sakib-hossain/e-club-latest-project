import { Head, Link } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Calendar, User, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaPost {
    id: number;
    title: string;
    content: string;
    media_type: 'notice' | 'press_release' | 'album' | 'newsletter' | 'blog';
    published_at: string;
    author?: string;
    image?: string;
    gallery?: string[];
    pdf_file?: string;
}

export default function MediaDetail({ post }: { post: MediaPost }) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getMediaTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            notice: 'Notice',
            press_release: 'Press Release',
            album: 'Photo Album',
            newsletter: 'Newsletter',
            blog: 'Blog Post',
        };
        return labels[type] || type;
    };

    const getBackLink = (type: string) => {
        const links: Record<string, string> = {
            notice: '/media/notices',
            press_release: '/media/press-releases',
            album: '/media/albums',
            newsletter: '/media/newsletters',
            blog: '/media/blog',
        };
        return links[type] || '/media/notices';
    };

    return (
        <SiteLayout>
            <Head title={post.title} />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-12">
                <div className="container mx-auto px-4">
                    <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-white/20 mb-4">
                        <Link href={getBackLink(post.media_type)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to {getMediaTypeLabel(post.media_type)}s
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {post.image && (
                            <div className="aspect-video overflow-hidden rounded-lg mb-8">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                                {getMediaTypeLabel(post.media_type)}
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {post.title}
                            </h1>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(post.published_at)}</span>
                                </div>
                                {post.author && (
                                    <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>{post.author}</span>
                                    </div>
                                )}
                            </div>

                            <div className="prose max-w-none mb-8">
                                <p className="text-gray-700 text-lg whitespace-pre-wrap leading-relaxed">
                                    {post.content}
                                </p>
                            </div>

                            {post.pdf_file && (
                                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                    <h3 className="text-lg font-semibold mb-3">Download PDF</h3>
                                    <Button asChild>
                                        <a href={post.pdf_file} target="_blank" rel="noopener noreferrer">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download {getMediaTypeLabel(post.media_type)}
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Gallery */}
                        {post.gallery && post.gallery.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-3xl font-bold mb-6">Photo Gallery</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {post.gallery.map((image, index) => (
                                        <div key={index} className="aspect-square overflow-hidden rounded-lg">
                                            <img
                                                src={image}
                                                alt={`${post.title} - Photo ${index + 1}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
