import { Head, useForm } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function RequestEvent() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        event_type: '',
        event_title: '',
        description: '',
        preferred_date: '',
        expected_attendees: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/events/request', {
            onSuccess: () => {
                toast.success('Event request submitted successfully!');
                reset();
            },
            onError: () => {
                toast.error('Failed to submit event request. Please try again.');
            },
        });
    };

    return (
        <SiteLayout>
            <Head title="Request for Event" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Request for Event
                        </h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Join or suggest! Shape E-Club events together
                        </p>
                    </div>
                </div>
            </section>

            {/* Request Form */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            required
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="event_type">Event Type *</Label>
                                        <Input
                                            id="event_type"
                                            value={data.event_type}
                                            onChange={(e) => setData('event_type', e.target.value)}
                                            placeholder="e.g., Workshop, Seminar, Networking"
                                            required
                                        />
                                        {errors.event_type && (
                                            <p className="text-sm text-red-500 mt-1">{errors.event_type}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="event_title">Proposed Event Title *</Label>
                                    <Input
                                        id="event_title"
                                        value={data.event_title}
                                        onChange={(e) => setData('event_title', e.target.value)}
                                        required
                                    />
                                    {errors.event_title && (
                                        <p className="text-sm text-red-500 mt-1">{errors.event_title}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">Event Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={6}
                                        placeholder="Please provide details about the proposed event..."
                                        required
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="preferred_date">Preferred Date</Label>
                                        <Input
                                            id="preferred_date"
                                            type="date"
                                            value={data.preferred_date}
                                            onChange={(e) => setData('preferred_date', e.target.value)}
                                        />
                                        {errors.preferred_date && (
                                            <p className="text-sm text-red-500 mt-1">{errors.preferred_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="expected_attendees">Expected Attendees</Label>
                                        <Input
                                            id="expected_attendees"
                                            type="number"
                                            value={data.expected_attendees}
                                            onChange={(e) => setData('expected_attendees', e.target.value)}
                                            placeholder="Approximate number"
                                        />
                                        {errors.expected_attendees && (
                                            <p className="text-sm text-red-500 mt-1">{errors.expected_attendees}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing} className="flex-1">
                                        {processing ? 'Submitting...' : 'Submit Request'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => reset()}
                                        disabled={processing}
                                    >
                                        Reset Form
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 bg-blue-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-2">What happens next?</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">1.</span>
                                    <span>Our team will review your event request within 3-5 business days.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">2.</span>
                                    <span>We'll contact you via email to discuss the details and feasibility.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">3.</span>
                                    <span>If approved, we'll work together to plan and execute the event.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
