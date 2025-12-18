import { Head, Link } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Event {
    id: number;
    title: string;
    description: string;
    event_type: string;
    event_date: string;
    event_time?: string;
    location?: string;
    capacity?: number;
    registration_link?: string;
    image?: string;
    featured_image?: string;
}

export default function UpcomingEvents({ events }: { events: Event[] }) {
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
            <Head title="Upcoming Events" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Upcoming Events
                        </h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Discover inspiring workshops, networking events, and more
                        </p>
                    </div>
                </div>
            </section>

            {/* Events List */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    {(event.featured_image || event.image) && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={event.featured_image || event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                                            {event.event_type}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {event.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {event.description}
                                        </p>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Calendar className="w-5 h-5 text-primary" />
                                                <span>{formatDate(event.event_date)}</span>
                                            </div>
                                            {event.event_time && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Clock className="w-5 h-5 text-primary" />
                                                    <span>{event.event_time}</span>
                                                </div>
                                            )}
                                            {event.location && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
                                            {event.capacity && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Users className="w-5 h-5 text-primary" />
                                                    <span>Capacity: {event.capacity} attendees</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <Button asChild className="flex-1">
                                                <Link href={`/events/${event.id}`}>
                                                    View Details
                                                </Link>
                                            </Button>
                                            {event.registration_link && (
                                                <Button asChild variant="outline" className="flex-1">
                                                    <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                                                        Register Now
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-6">
                                No upcoming events at the moment. Check back soon!
                            </p>
                            <Button asChild>
                                <Link href="/events/request">Request an Event</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </SiteLayout>
    );
}
