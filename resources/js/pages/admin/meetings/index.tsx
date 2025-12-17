import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    CalendarDays,
    Check,
    Clock,
    Eye,
    Filter,
    MapPin,
    Phone,
    PhoneCall,
    RefreshCw,
    Search,
    Video,
    X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AdminPageLayout from '@/layouts/admin-page-layout';
import { toast } from 'sonner';

// Types
interface Meeting {
    id: number;
    name: string;
    email: string;
    phone: string;
    meeting_type: 'showroom' | 'video';
    purpose: string;
    notes: string | null;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    admin_notes: string | null;
    confirmed_at: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
    created_at: string;
    updated_at: string;
}

interface CallbackRequest {
    id: number;
    name: string;
    phone: string;
    preferred_time: string;
    reason: string;
    notes: string | null;
    status: 'pending' | 'called' | 'no_answer' | 'completed' | 'cancelled';
    admin_notes: string | null;
    called_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    meetings: Meeting[];
    callbacks: CallbackRequest[];
    stats: {
        total_meetings: number;
        pending_meetings: number;
        confirmed_meetings: number;
        today_meetings: number;
        total_callbacks: number;
        pending_callbacks: number;
    };
    filters: {
        status?: string;
        type?: string;
        from_date?: string;
        to_date?: string;
        search?: string;
    };
}

// Form Schemas
const meetingUpdateSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
    admin_notes: z.string().max(1000).nullable().optional(),
});

const callbackUpdateSchema = z.object({
    status: z.enum([
        'pending',
        'called',
        'no_answer',
        'completed',
        'cancelled',
    ]),
    admin_notes: z.string().max(1000).nullable().optional(),
});

type MeetingUpdateValues = z.infer<typeof meetingUpdateSchema>;
type CallbackUpdateValues = z.infer<typeof callbackUpdateSchema>;

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'confirmed':
            return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'completed':
            return 'bg-green-100 text-green-800 border-green-300';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-300';
        case 'called':
            return 'bg-purple-100 text-purple-800 border-purple-300';
        case 'no_answer':
            return 'bg-orange-100 text-orange-800 border-orange-300';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

const getMeetingTypeIcon = (type: string) => {
    return type === 'video' ? (
        <Video className="h-4 w-4" />
    ) : (
        <MapPin className="h-4 w-4" />
    );
};

export default function MeetingsIndex({
    meetings,
    callbacks,
    stats,
    filters,
}: Props) {
    const [activeTab, setActiveTab] = useState('calendar');
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(
        null,
    );
    const [selectedCallback, setSelectedCallback] =
        useState<CallbackRequest | null>(null);
    const [isViewMeetingOpen, setIsViewMeetingOpen] = useState(false);
    const [isEditMeetingOpen, setIsEditMeetingOpen] = useState(false);
    const [isViewCallbackOpen, setIsViewCallbackOpen] = useState(false);
    const [isEditCallbackOpen, setIsEditCallbackOpen] = useState(false);
    const [isDeleteMeetingOpen, setIsDeleteMeetingOpen] = useState(false);
    const [isDeleteCallbackOpen, setIsDeleteCallbackOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const calendarRef = useRef<FullCalendar>(null);

    const meetingForm = useForm<MeetingUpdateValues>({
        resolver: zodResolver(meetingUpdateSchema),
        defaultValues: {
            status: 'pending',
            admin_notes: '',
        },
    });

    const callbackForm = useForm<CallbackUpdateValues>({
        resolver: zodResolver(callbackUpdateSchema),
        defaultValues: {
            status: 'pending',
            admin_notes: '',
        },
    });

    // Transform meetings to calendar events
    const calendarEvents = meetings.map((meeting) => ({
        id: meeting.id.toString(),
        title: `${meeting.name} - ${meeting.meeting_type === 'video' ? 'Video Call' : 'Showroom Visit'}`,
        start: `${meeting.date}T${meeting.time.replace(' AM', ':00').replace(' PM', ':00').replace(':', ':')}`,
        backgroundColor: getCalendarEventColor(meeting.status),
        borderColor: getCalendarEventColor(meeting.status),
        extendedProps: {
            meeting,
        },
    }));

    function getCalendarEventColor(status: string) {
        switch (status) {
            case 'pending':
                return '#f59e0b';
            case 'confirmed':
                return '#3b82f6';
            case 'completed':
                return '#10b981';
            case 'cancelled':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    }

    const handleEventClick = (info: any) => {
        const meeting = info.event.extendedProps.meeting;
        setSelectedMeeting(meeting);
        setIsViewMeetingOpen(true);
    };

    const openEditMeeting = (meeting: Meeting) => {
        setSelectedMeeting(meeting);
        meetingForm.reset({
            status: meeting.status,
            admin_notes: meeting.admin_notes || '',
        });
        setIsEditMeetingOpen(true);
    };

    const openEditCallback = (callback: CallbackRequest) => {
        setSelectedCallback(callback);
        callbackForm.reset({
            status: callback.status,
            admin_notes: callback.admin_notes || '',
        });
        setIsEditCallbackOpen(true);
    };

    const handleUpdateMeeting = (values: MeetingUpdateValues) => {
        if (!selectedMeeting) return;
        setIsSubmitting(true);

        router.put(`/admin/meetings/${selectedMeeting.id}`, values, {
            onSuccess: () => {
                toast.success('Meeting updated successfully');
                setIsEditMeetingOpen(false);
                setSelectedMeeting(null);
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error as string);
                });
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleUpdateCallback = (values: CallbackUpdateValues) => {
        if (!selectedCallback) return;
        setIsSubmitting(true);

        router.put(`/admin/callbacks/${selectedCallback.id}`, values, {
            onSuccess: () => {
                toast.success('Callback request updated successfully');
                setIsEditCallbackOpen(false);
                setSelectedCallback(null);
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error as string);
                });
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDeleteMeeting = () => {
        if (!selectedMeeting) return;
        setIsSubmitting(true);

        router.delete(`/admin/meetings/${selectedMeeting.id}`, {
            onSuccess: () => {
                toast.success('Meeting deleted successfully');
                setIsDeleteMeetingOpen(false);
                setSelectedMeeting(null);
            },
            onError: () => {
                toast.error('Failed to delete meeting');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDeleteCallback = () => {
        if (!selectedCallback) return;
        setIsSubmitting(true);

        router.delete(`/admin/callbacks/${selectedCallback.id}`, {
            onSuccess: () => {
                toast.success('Callback request deleted successfully');
                setIsDeleteCallbackOpen(false);
                setSelectedCallback(null);
            },
            onError: () => {
                toast.error('Failed to delete callback request');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleSearch = () => {
        router.get(
            '/admin/meetings',
            {
                search: searchQuery,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            { preserveState: true },
        );
    };

    const filteredMeetings = meetings.filter((meeting) => {
        if (statusFilter !== 'all' && meeting.status !== statusFilter)
            return false;
        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            return (
                meeting.name.toLowerCase().includes(search) ||
                meeting.email.toLowerCase().includes(search) ||
                meeting.phone.includes(search)
            );
        }
        return true;
    });

    const filteredCallbacks = callbacks.filter((callback) => {
        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            return (
                callback.name.toLowerCase().includes(search) ||
                callback.phone.includes(search)
            );
        }
        return true;
    });

    return (
        <AdminPageLayout>
            <Head title="Meetings & Callbacks Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Meetings & Callbacks
                        </h1>
                        <p className="text-muted-foreground">
                            Manage scheduled meetings and callback requests.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/admin/meetings/settings')}
                    >
                        <Clock className="mr-2 h-4 w-4" />
                        Availability Settings
                    </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Meetings
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_meetings}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stats.today_meetings} scheduled today
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Meetings
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.pending_meetings}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting confirmation
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Confirmed Meetings
                            </CardTitle>
                            <Check className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.confirmed_meetings}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ready to proceed
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Callbacks
                            </CardTitle>
                            <PhoneCall className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.pending_callbacks}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Need to call back
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                >
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSearch()
                            }
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleSearch}>
                        <Filter className="mr-2 h-4 w-4" />
                        Apply
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => router.visit('/admin/meetings')}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="calendar">
                                <CalendarDays className="mr-2 h-4 w-4" />
                                Calendar
                            </TabsTrigger>
                            <TabsTrigger value="meetings">
                                <Calendar className="mr-2 h-4 w-4" />
                                Meetings ({meetings.length})
                            </TabsTrigger>
                            <TabsTrigger value="callbacks">
                                <PhoneCall className="mr-2 h-4 w-4" />
                                Callbacks ({callbacks.length})
                            </TabsTrigger>
                        </TabsList>

                        {/* Calendar View */}
                        <TabsContent value="calendar" className="mt-6">
                            <Card>
                                <CardContent className="p-4">
                                    <FullCalendar
                                        ref={calendarRef}
                                        plugins={[
                                            dayGridPlugin,
                                            timeGridPlugin,
                                            interactionPlugin,
                                        ]}
                                        initialView="dayGridMonth"
                                        headerToolbar={{
                                            left: 'prev,next today',
                                            center: 'title',
                                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                                        }}
                                        events={calendarEvents}
                                        eventClick={handleEventClick}
                                        height="auto"
                                        eventDisplay="block"
                                        dayMaxEvents={3}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Meetings List */}
                        <TabsContent value="meetings" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>All Meetings</CardTitle>
                                    <CardDescription>
                                        View and manage scheduled meetings.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {filteredMeetings.length === 0 ? (
                                        <div className="py-12 text-center text-muted-foreground">
                                            <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                            <p>No meetings found.</p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Customer
                                                    </TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>
                                                        Date & Time
                                                    </TableHead>
                                                    <TableHead>
                                                        Purpose
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredMeetings.map(
                                                    (meeting) => (
                                                        <TableRow
                                                            key={meeting.id}
                                                        >
                                                            <TableCell>
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {
                                                                            meeting.name
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {
                                                                            meeting.email
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {
                                                                            meeting.phone
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    {getMeetingTypeIcon(
                                                                        meeting.meeting_type,
                                                                    )}
                                                                    <span className="capitalize">
                                                                        {
                                                                            meeting.meeting_type
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {new Date(
                                                                            meeting.date,
                                                                        ).toLocaleDateString(
                                                                            'en-US',
                                                                            {
                                                                                weekday:
                                                                                    'short',
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                            },
                                                                        )}
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {
                                                                            meeting.time
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="line-clamp-1">
                                                                    {
                                                                        meeting.purpose
                                                                    }
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    className={getStatusColor(
                                                                        meeting.status,
                                                                    )}
                                                                >
                                                                    {
                                                                        meeting.status
                                                                    }
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        onClick={() => {
                                                                            setSelectedMeeting(
                                                                                meeting,
                                                                            );
                                                                            setIsViewMeetingOpen(
                                                                                true,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        onClick={() =>
                                                                            openEditMeeting(
                                                                                meeting,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Check className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="text-destructive"
                                                                        onClick={() => {
                                                                            setSelectedMeeting(
                                                                                meeting,
                                                                            );
                                                                            setIsDeleteMeetingOpen(
                                                                                true,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Callbacks List */}
                        <TabsContent value="callbacks" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Callback Requests</CardTitle>
                                    <CardDescription>
                                        Manage customer callback requests.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {filteredCallbacks.length === 0 ? (
                                        <div className="py-12 text-center text-muted-foreground">
                                            <PhoneCall className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                            <p>No callback requests found.</p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Customer
                                                    </TableHead>
                                                    <TableHead>Phone</TableHead>
                                                    <TableHead>
                                                        Preferred Time
                                                    </TableHead>
                                                    <TableHead>
                                                        Reason
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredCallbacks.map(
                                                    (callback) => (
                                                        <TableRow
                                                            key={callback.id}
                                                        >
                                                            <TableCell>
                                                                <div className="font-medium">
                                                                    {
                                                                        callback.name
                                                                    }
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <a
                                                                    href={`tel:${callback.phone}`}
                                                                    className="text-primary hover:underline"
                                                                >
                                                                    {
                                                                        callback.phone
                                                                    }
                                                                </a>
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    callback.preferred_time
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="line-clamp-1">
                                                                    {
                                                                        callback.reason
                                                                    }
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    className={getStatusColor(
                                                                        callback.status,
                                                                    )}
                                                                >
                                                                    {callback.status.replace(
                                                                        '_',
                                                                        ' ',
                                                                    )}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        onClick={() => {
                                                                            setSelectedCallback(
                                                                                callback,
                                                                            );
                                                                            setIsViewCallbackOpen(
                                                                                true,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        onClick={() =>
                                                                            openEditCallback(
                                                                                callback,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Phone className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="text-destructive"
                                                                        onClick={() => {
                                                                            setSelectedCallback(
                                                                                callback,
                                                                            );
                                                                            setIsDeleteCallbackOpen(
                                                                                true,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>

            {/* View Meeting Dialog */}
            <Dialog
                open={isViewMeetingOpen}
                onOpenChange={setIsViewMeetingOpen}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Meeting Details</DialogTitle>
                        <DialogDescription>
                            View meeting information and take actions.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMeeting && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Customer
                                    </label>
                                    <p className="font-medium">
                                        {selectedMeeting.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </label>
                                    <div>
                                        <Badge
                                            className={getStatusColor(
                                                selectedMeeting.status,
                                            )}
                                        >
                                            {selectedMeeting.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </label>
                                    <p>{selectedMeeting.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Phone
                                    </label>
                                    <p>{selectedMeeting.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Type
                                    </label>
                                    <p className="flex items-center gap-2 capitalize">
                                        {getMeetingTypeIcon(
                                            selectedMeeting.meeting_type,
                                        )}
                                        {selectedMeeting.meeting_type}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Date & Time
                                    </label>
                                    <p>
                                        {new Date(
                                            selectedMeeting.date,
                                        ).toLocaleDateString()}{' '}
                                        at {selectedMeeting.time}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Purpose
                                </label>
                                <p>{selectedMeeting.purpose}</p>
                            </div>
                            {selectedMeeting.notes && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Customer Notes
                                    </label>
                                    <p className="text-sm">
                                        {selectedMeeting.notes}
                                    </p>
                                </div>
                            )}
                            {selectedMeeting.admin_notes && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Admin Notes
                                    </label>
                                    <p className="text-sm">
                                        {selectedMeeting.admin_notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsViewMeetingOpen(false)}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                setIsViewMeetingOpen(false);
                                if (selectedMeeting)
                                    openEditMeeting(selectedMeeting);
                            }}
                        >
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Meeting Dialog */}
            <Dialog
                open={isEditMeetingOpen}
                onOpenChange={setIsEditMeetingOpen}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Meeting</DialogTitle>
                        <DialogDescription>
                            Change the meeting status and add notes.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...meetingForm}>
                        <form
                            onSubmit={meetingForm.handleSubmit(
                                handleUpdateMeeting,
                            )}
                            className="space-y-4"
                        >
                            <FormField
                                control={meetingForm.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="confirmed">
                                                    Confirmed
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Completed
                                                </SelectItem>
                                                <SelectItem value="cancelled">
                                                    Cancelled
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={meetingForm.control}
                                name="admin_notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admin Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Add internal notes about this meeting..."
                                                className="resize-none"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditMeetingOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Updating...'
                                        : 'Update Meeting'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* View Callback Dialog */}
            <Dialog
                open={isViewCallbackOpen}
                onOpenChange={setIsViewCallbackOpen}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Callback Request Details</DialogTitle>
                        <DialogDescription>
                            View callback request information.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCallback && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Customer
                                    </label>
                                    <p className="font-medium">
                                        {selectedCallback.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </label>
                                    <div>
                                        <Badge
                                            className={getStatusColor(
                                                selectedCallback.status,
                                            )}
                                        >
                                            {selectedCallback.status.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Phone
                                    </label>
                                    <a
                                        href={`tel:${selectedCallback.phone}`}
                                        className="text-primary hover:underline"
                                    >
                                        {selectedCallback.phone}
                                    </a>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Preferred Time
                                    </label>
                                    <p>{selectedCallback.preferred_time}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Reason
                                </label>
                                <p>{selectedCallback.reason}</p>
                            </div>
                            {selectedCallback.notes && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Customer Notes
                                    </label>
                                    <p className="text-sm">
                                        {selectedCallback.notes}
                                    </p>
                                </div>
                            )}
                            {selectedCallback.admin_notes && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Admin Notes
                                    </label>
                                    <p className="text-sm">
                                        {selectedCallback.admin_notes}
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Requested
                                </label>
                                <p className="text-sm">
                                    {new Date(
                                        selectedCallback.created_at,
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsViewCallbackOpen(false)}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                setIsViewCallbackOpen(false);
                                if (selectedCallback)
                                    openEditCallback(selectedCallback);
                            }}
                        >
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Callback Dialog */}
            <Dialog
                open={isEditCallbackOpen}
                onOpenChange={setIsEditCallbackOpen}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Callback Request</DialogTitle>
                        <DialogDescription>
                            Change the callback status and add notes.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...callbackForm}>
                        <form
                            onSubmit={callbackForm.handleSubmit(
                                handleUpdateCallback,
                            )}
                            className="space-y-4"
                        >
                            <FormField
                                control={callbackForm.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="called">
                                                    Called
                                                </SelectItem>
                                                <SelectItem value="no_answer">
                                                    No Answer
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Completed
                                                </SelectItem>
                                                <SelectItem value="cancelled">
                                                    Cancelled
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={callbackForm.control}
                                name="admin_notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admin Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Add internal notes about this callback..."
                                                className="resize-none"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditCallbackOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Updating...'
                                        : 'Update Callback'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Meeting Dialog */}
            <AlertDialog
                open={isDeleteMeetingOpen}
                onOpenChange={setIsDeleteMeetingOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this meeting with{' '}
                            {selectedMeeting?.name}? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteMeeting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Callback Dialog */}
            <AlertDialog
                open={isDeleteCallbackOpen}
                onOpenChange={setIsDeleteCallbackOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Callback Request
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this callback
                            request from {selectedCallback?.name}? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCallback}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminPageLayout>
    );
}
