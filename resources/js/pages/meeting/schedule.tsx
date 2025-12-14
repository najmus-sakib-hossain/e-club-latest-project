import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronRight, Calendar, Clock, MapPin, Video, User, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

import { SiteLayout } from '@/components/site';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Category, SiteSettings } from '@/types/cms';

interface ScheduleProps {
    settings?: SiteSettings;
    categories?: Category[];
}

const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
];

export default function Schedule({ settings, categories }: ScheduleProps) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        meeting_type: 'showroom',
        purpose: '',
        notes: '',
        date: '',
        time: '',
    });

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            setData('date', selectedDate.toISOString().split('T')[0]);
        }
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setData('time', time);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/meeting/schedule');
    };

    const isWeekend = (date: Date) => {
        const day = date.getDay();
        return day === 5; // Friday is closed
    };

    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="Schedule Meeting" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">Schedule Meeting</span>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="bg-primary/10 py-12">
                <div className="container mx-auto px-4 text-center">
                    <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">Schedule a Meeting</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Book a consultation with our e-club experts. Visit our showroom or schedule a video call.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                1
                            </div>
                            <span className="hidden sm:inline">Select Date & Time</span>
                        </div>
                        <div className="w-12 h-0.5 bg-border" />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                2
                            </div>
                            <span className="hidden sm:inline">Your Details</span>
                        </div>
                        <div className="w-12 h-0.5 bg-border" />
                        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                3
                            </div>
                            <span className="hidden sm:inline">Confirm</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Calendar */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Select Date</CardTitle>
                                    <CardDescription>Choose your preferred meeting date</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <CalendarComponent
                                        mode="single"
                                        selected={date}
                                        onSelect={handleDateSelect}
                                        disabled={(date) => isWeekend(date) || isPastDate(date)}
                                        className="rounded-md border"
                                    />
                                    <p className="text-sm text-muted-foreground mt-2">
                                        * We are closed on Fridays
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Time Slots */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Select Time</CardTitle>
                                    <CardDescription>
                                        {date ? `Available slots for ${date.toLocaleDateString()}` : 'Please select a date first'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {date ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {timeSlots.map((time) => (
                                                <Button
                                                    key={time}
                                                    type="button"
                                                    variant={selectedTime === time ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handleTimeSelect(time)}
                                                >
                                                    {time}
                                                </Button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p>Select a date to see available times</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="lg:col-span-2 flex justify-end">
                                <Button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    disabled={!date || !selectedTime}
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="max-w-2xl mx-auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Details</CardTitle>
                                    <CardDescription>Tell us about yourself and your meeting preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Meeting Type */}
                                    <div className="space-y-3">
                                        <Label>Meeting Type</Label>
                                        <RadioGroup
                                            value={data.meeting_type}
                                            onValueChange={(value) => setData('meeting_type', value)}
                                            className="grid grid-cols-2 gap-4"
                                        >
                                            <Label
                                                htmlFor="showroom"
                                                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${data.meeting_type === 'showroom' ? 'border-primary bg-primary/5' : ''
                                                    }`}
                                            >
                                                <RadioGroupItem value="showroom" id="showroom" />
                                                <MapPin className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="font-medium">Showroom Visit</p>
                                                    <p className="text-sm text-muted-foreground">Visit us in person</p>
                                                </div>
                                            </Label>
                                            <Label
                                                htmlFor="video"
                                                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${data.meeting_type === 'video' ? 'border-primary bg-primary/5' : ''
                                                    }`}
                                            >
                                                <RadioGroupItem value="video" id="video" />
                                                <Video className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="font-medium">Video Call</p>
                                                    <p className="text-sm text-muted-foreground">Meet online</p>
                                                </div>
                                            </Label>
                                        </RadioGroup>
                                    </div>

                                    {/* Personal Info */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+880 1XXX-XXXXXX"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="purpose">Purpose of Meeting *</Label>
                                        <Select
                                            value={data.purpose}
                                            onValueChange={(value) => setData('purpose', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select purpose" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="consultation">E-Club Consultation</SelectItem>
                                                <SelectItem value="custom">Custom Order Discussion</SelectItem>
                                                <SelectItem value="bulk">Bulk/Corporate Order</SelectItem>
                                                <SelectItem value="showroom">Showroom Tour</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Additional Notes</Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Any specific requirements or questions?"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                            Back
                                        </Button>
                                        <Button
                                            type="button"
                                            className="flex-1"
                                            onClick={() => setStep(3)}
                                            disabled={!data.name || !data.email || !data.phone || !data.purpose}
                                        >
                                            Continue
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="max-w-2xl mx-auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Confirm Your Meeting</CardTitle>
                                    <CardDescription>Please review your booking details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="bg-muted rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Date:</span>
                                            <span className="font-medium">{date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Time:</span>
                                            <span className="font-medium">{selectedTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Type:</span>
                                            <span className="font-medium capitalize">{data.meeting_type === 'showroom' ? 'Showroom Visit' : 'Video Call'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Purpose:</span>
                                            <span className="font-medium capitalize">{data.purpose.replace(/_/g, ' ')}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium">Contact Information</h4>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p className="flex items-center gap-2"><User className="h-4 w-4" /> {data.name}</p>
                                            <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {data.email}</p>
                                            <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {data.phone}</p>
                                        </div>
                                    </div>

                                    {data.notes && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Notes</h4>
                                            <p className="text-sm text-muted-foreground">{data.notes}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <Button type="button" variant="outline" onClick={() => setStep(2)}>
                                            Back
                                        </Button>
                                        <Button type="submit" className="flex-1" disabled={processing}>
                                            {processing ? 'Booking...' : 'Confirm Booking'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </form>
            </div>
        </SiteLayout>
    );
}
