import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Clock, Calendar, MapPin, Phone, Video } from 'lucide-react';

import { SiteLayout } from '@/components/site';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Category, SiteSettings } from '@/types/cms';

interface ScheduleItem {
    day: string;
    hours: string;
    isOpen: boolean;
}

interface AvailabilityProps {
    settings?: SiteSettings;
    categories?: Category[];
    schedule?: ScheduleItem[];
}

const meetingTypes = [
    {
        icon: MapPin,
        title: 'Showroom Visit',
        description: 'Visit our showroom to see our furniture collection in person. Our experts will guide you through our products.',
        duration: '30-60 minutes',
        availability: 'During business hours',
    },
    {
        icon: Video,
        title: 'Video Consultation',
        description: 'Can\'t visit us? Schedule a video call with our furniture consultants from the comfort of your home.',
        duration: '20-30 minutes',
        availability: '10 AM - 6 PM',
    },
    {
        icon: Phone,
        title: 'Phone Consultation',
        description: 'Quick questions? Request a phone callback and our team will assist you within a few hours.',
        duration: '10-15 minutes',
        availability: '10 AM - 7 PM',
    },
];

// Default schedule if none from database
const defaultSchedule: ScheduleItem[] = [
    { day: 'Saturday', hours: '10:00 AM - 8:00 PM', isOpen: true },
    { day: 'Sunday', hours: '10:00 AM - 8:00 PM', isOpen: true },
    { day: 'Monday', hours: '10:00 AM - 8:00 PM', isOpen: true },
    { day: 'Tuesday', hours: '10:00 AM - 8:00 PM', isOpen: true },
    { day: 'Wednesday', hours: '10:00 AM - 8:00 PM', isOpen: true },
    { day: 'Thursday', hours: '10:00 AM - 8:00 PM', isOpen: true },
    { day: 'Friday', hours: 'Closed', isOpen: false },
];

export default function Availability({ settings, categories, schedule }: AvailabilityProps) {
    const weeklySchedule = schedule && schedule.length > 0 ? schedule : defaultSchedule;
    
    const today = new Date().getDay();
    const daysMap: { [key: number]: string } = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
    };
    const todayName = daysMap[today];

    const currentSchedule = weeklySchedule.find(s => s.day === todayName);

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="Check Availability" />

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/meeting/schedule" className="hover:text-primary">Meeting</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-gray-900 font-medium">Check Availability</span>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="bg-primary/10 py-12">
                <div className="container mx-auto px-4 text-center">
                    <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">Check Our Availability</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        See our working hours and available meeting slots. Plan your visit or consultation with us.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Current Status */}
                <Card className="max-w-2xl mx-auto mb-8">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">Today's Status</h3>
                                <p className="text-gray-600">{todayName}</p>
                            </div>
                            <div className="text-right">
                                {currentSchedule?.isOpen ? (
                                    <>
                                        <Badge className="bg-green-500">Open</Badge>
                                        <p className="text-sm text-gray-600 mt-1">{currentSchedule.hours}</p>
                                    </>
                                ) : (
                                    <Badge variant="destructive">Closed</Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Weekly Schedule */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Weekly Schedule
                            </CardTitle>
                            <CardDescription>Our regular business hours</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {weeklySchedule.map((schedule) => (
                                    <div
                                        key={schedule.day}
                                        className={`flex items-center justify-between p-3 rounded-lg ${
                                            schedule.day === todayName ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50'
                                        }`}
                                    >
                                        <span className={`font-medium ${schedule.day === todayName ? 'text-primary' : ''}`}>
                                            {schedule.day}
                                            {schedule.day === todayName && (
                                                <span className="text-xs ml-2">(Today)</span>
                                            )}
                                        </span>
                                        <span className={schedule.isOpen ? 'text-gray-600' : 'text-red-500'}>
                                            {schedule.hours}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Meeting Types */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Meeting Options</CardTitle>
                            <CardDescription>Choose how you'd like to connect with us</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {meetingTypes.map((type, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                            <type.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{type.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {type.duration}
                                                </span>
                                                <span>{type.availability}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <h3 className="text-xl font-bold mb-4">Ready to Schedule?</h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/meeting/schedule">
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule a Meeting
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/meeting/callback">
                                <Phone className="h-4 w-4 mr-2" />
                                Request Callback
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Holiday Notice */}
                <Card className="max-w-2xl mx-auto mt-8 bg-amber-50 border-amber-200">
                    <CardContent className="pt-6">
                        <h4 className="font-semibold text-amber-800 mb-2">Holiday Schedule</h4>
                        <p className="text-sm text-amber-700">
                            Please note that we may have modified hours during public holidays. 
                            For the most up-to-date information, please contact us or check our social media pages.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </SiteLayout>
    );
}
