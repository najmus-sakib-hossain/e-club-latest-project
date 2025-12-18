import { Head, Link } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Calendar, MapPin, Clock, Users, ArrowLeft } from 'lucide-react';
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
    gallery?: string[];
    organizer?: string;
    speaker?: string;
    agenda?: string;
}

export default function EventDetail({ event }: { event: Event }) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const isPastEvent = new Date(event.event_date) < new Date();

    return (
        <SiteLayout>
            <Head title={event.title} />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-12">
                <div className="container mx-auto px-4">
                    <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-white/20 mb-4">
                        <Link href={isPastEvent ? '/events/past' : '/events/upcoming'}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to {isPastEvent ? 'Past' : 'Upcoming'} Events
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Event Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Featured Image */}
                        {(event.featured_image || event.image) && (
                            <div className="aspect-video overflow-hidden rounded-lg mb-8">
                                <img
                                    src={event.featured_image || event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Event Details */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                                {event.event_type}
                            </div>
                            
                            <h1 className="text-4xl font-bold text-gray-900 mb-6">
                                {event.title}
                            </h1>

                            {/* Event Meta */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pb-8 border-b">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-primary" />
                                    <div>
                                        <div className="text-sm text-gray-500">Date</div>
                                        <div className="font-semibold">{formatDate(event.event_date)}</div>
                                    </div>
                                </div>

                                {event.event_time && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-6 h-6 text-primary" />
                                        <div>
                                            <div className="text-sm text-gray-500">Time</div>
                                            <div className="font-semibold">{event.event_time}</div>
                                        </div>
                                    </div>
                                )}

                                {event.location && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-6 h-6 text-primary" />
                                        <div>
                                            <div className="text-sm text-gray-500">Location</div>
                                            <div className="font-semibold">{event.location}</div>
                                        </div>
                                    </div>
                                )}

                                {event.capacity && (
                                    <div className="flex items-center gap-3">
                                        <Users className="w-6 h-6 text-primary" />
                                        <div>
                                            <div className="text-sm text-gray-500">Capacity</div>
                                            <div className="font-semibold">{event.capacity} attendees</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="prose max-w-none mb-8">
                                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                            </div>

                            {/* Additional Info */}
                            {(event.organizer || event.speaker || event.agenda) && (
                                <div className="space-y-6 mb-8">
                                    {event.organizer && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Organizer</h3>
                                            <p className="text-gray-700">{event.organizer}</p>
                                        </div>
                                    )}
                                    {event.speaker && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Speaker</h3>
                                            <p className="text-gray-700">{event.speaker}</p>
                                        </div>
                                    )}
                                    {event.agenda && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Agenda</h3>
                                            <p className="text-gray-700 whitespace-pre-wrap">{event.agenda}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Registration Button */}
                            {!isPastEvent && event.registration_link && (
                                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
                                    <h3 className="text-xl font-bold mb-2">Ready to Join?</h3>
                                    <p className="mb-4 opacity-90">Register now to secure your spot at this event</p>
                                    <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                                        <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                                            Register Now
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Gallery */}
                        {isPastEvent && event.gallery && event.gallery.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-3xl font-bold mb-6">Event Gallery</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {event.gallery.map((image, index) => (
                                        <div key={index} className="aspect-square overflow-hidden rounded-lg">
                                            <img
                                                src={image}
                                                alt={`${event.title} - Photo ${index + 1}`}
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
