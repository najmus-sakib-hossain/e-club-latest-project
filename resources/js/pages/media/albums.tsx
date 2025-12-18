import { Head, Link } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Calendar, Image as ImageIcon } from 'lucide-react';

interface Album {
    id: number;
    title: string;
    content: string;
    published_at: string;
    gallery: string[];
    image?: string;
}

export default function Albums({ albums }: { albums: Album[] }) {
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
            <Head title="Photo Albums" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Photo Albums
                        </h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Immerse yourself in E-Club events and activities album
                        </p>
                    </div>
                </div>
            </section>

            {/* Albums Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {albums.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {albums.map((album) => (
                                <Link
                                    key={album.id}
                                    href={`/media/${album.id}`}
                                    className="group"
                                >
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                        <div className="aspect-video overflow-hidden relative">
                                            <img
                                                src={album.image || (album.gallery[0] || '/placeholder.jpg')}
                                                alt={album.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                                <ImageIcon className="w-4 h-4" />
                                                {album.gallery.length}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(album.published_at)}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                                {album.title}
                                            </h3>
                                            <p className="text-gray-600 line-clamp-2">
                                                {album.content}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-500 text-lg">
                                No photo albums available at the moment.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </SiteLayout>
    );
}
