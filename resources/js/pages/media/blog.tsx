import { Head, Link } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogPost {
    id: number;
    title: string;
    content: string;
    published_at: string;
    author?: string;
    image?: string;
}

export default function Blog({ posts }: { posts: BlogPost[] }) {
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
            <Head title="Blog" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Blog
                        </h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Insights, stories, and updates from the E-Club community
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Posts */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    {post.image && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
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
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-700 mb-4 line-clamp-4">
                                            {post.content}
                                        </p>
                                        <Button asChild variant="link" className="p-0">
                                            <Link href={`/media/${post.id}`}>
                                                Read More <ArrowRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-500 text-lg">
                                No blog posts available at the moment.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </SiteLayout>
    );
}
