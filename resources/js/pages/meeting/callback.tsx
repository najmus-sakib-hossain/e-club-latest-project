import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronRight, Clock, Phone } from 'lucide-react';

import { SiteLayout } from '@/components/site';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Category, SiteSettings } from '@/types/cms';

interface CallbackProps {
    settings?: SiteSettings;
    categories?: Category[];
}

export default function Callback({ settings, categories }: CallbackProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        preferred_time: '',
        reason: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/meeting/callback', {
            onSuccess: () => reset(),
        });
    };

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="Request Callback" />

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link
                            href="/meeting/schedule"
                            className="hover:text-primary"
                        >
                            Meeting
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-gray-900">
                            Request Callback
                        </span>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="bg-primary/10 py-12">
                <div className="container mx-auto px-4 text-center">
                    <Phone className="mx-auto mb-4 h-12 w-12 text-primary" />
                    <h1 className="mb-4 text-3xl font-bold lg:text-4xl">
                        Request a Callback
                    </h1>
                    <p className="mx-auto max-w-2xl text-gray-600">
                        Can't call right now? Leave your number and we'll call
                        you back at your preferred time.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="mx-auto max-w-xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Contact Details</CardTitle>
                            <CardDescription>
                                Fill in your details and we'll get back to you
                                soon.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Your Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="John Doe"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">
                                        Phone Number *
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        placeholder="+880 1XXX-XXXXXX"
                                        required
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="preferred_time">
                                        Preferred Call Time *
                                    </Label>
                                    <Select
                                        value={data.preferred_time}
                                        onValueChange={(value) =>
                                            setData('preferred_time', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select preferred time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="morning">
                                                Morning (10 AM - 12 PM)
                                            </SelectItem>
                                            <SelectItem value="afternoon">
                                                Afternoon (12 PM - 4 PM)
                                            </SelectItem>
                                            <SelectItem value="evening">
                                                Evening (4 PM - 7 PM)
                                            </SelectItem>
                                            <SelectItem value="anytime">
                                                Anytime
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.preferred_time && (
                                        <p className="text-sm text-red-500">
                                            {errors.preferred_time}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reason">
                                        Reason for Callback *
                                    </Label>
                                    <Select
                                        value={data.reason}
                                        onValueChange={(value) =>
                                            setData('reason', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="product-inquiry">
                                                Product Inquiry
                                            </SelectItem>
                                            <SelectItem value="order-status">
                                                Order Status
                                            </SelectItem>
                                            <SelectItem value="pricing">
                                                Pricing Information
                                            </SelectItem>
                                            <SelectItem value="custom-order">
                                                Custom Order
                                            </SelectItem>
                                            <SelectItem value="complaint">
                                                Complaint
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.reason && (
                                        <p className="text-sm text-red-500">
                                            {errors.reason}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">
                                        Additional Message
                                    </Label>
                                    <Textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) =>
                                            setData('message', e.target.value)
                                        }
                                        placeholder="Any specific details you'd like to discuss?"
                                        rows={4}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    <Phone className="mr-2 h-4 w-4" />
                                    {processing
                                        ? 'Submitting...'
                                        : 'Request Callback'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="mt-6 bg-gray-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <Clock className="h-6 w-6 shrink-0 text-primary" />
                                <div>
                                    <h3 className="font-semibold">
                                        Response Time
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        We typically respond to callback
                                        requests within 2-4 hours during
                                        business hours (Saturday - Thursday, 10
                                        AM - 7 PM). Requests submitted outside
                                        business hours will be addressed on the
                                        next working day.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SiteLayout>
    );
}
