import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { Calendar, MapPin, Pencil, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';
import { getImageUrl } from '@/lib/utils';

interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    event_type: string;
    event_date: string;
    location: string;
    venue: string;
    image: string;
    gallery: string[] | null;
    registration_link?: string;
    is_featured: boolean;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

interface EventsIndexProps {
    events: Event[];
}

const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'conference', label: 'Conference' },
    { value: 'networking', label: 'Networking' },
    { value: 'training', label: 'Training' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'competition', label: 'Competition' },
    { value: 'social', label: 'Social Event' },
];

const eventSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().min(1, 'Description is required'),
    content: z.string().min(1, 'Content is required'),
    event_type: z.string().min(1, 'Event type is required'),
    event_date: z.string().min(1, 'Event date is required'),
    location: z.string().min(1, 'Location is required').max(255),
    venue: z.string().min(1, 'Venue is required').max(255),
    registration_link: z.string().url('Invalid URL').optional().nullable(),
    is_featured: z.boolean(),
    is_active: z.boolean(),
    order: z.number().int().min(0),
    image: z.any().optional(),
    gallery: z.any().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventsIndex({ events }: EventsIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [selectedGalleryImages, setSelectedGalleryImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: '',
            description: '',
            content: '',
            event_type: '',
            event_date: '',
            location: '',
            venue: '',
            registration_link: '',
            is_featured: false,
            is_active: true,
            order: 0,
        } as EventFormData,
    });

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || event.event_type === filterType;
        return matchesSearch && matchesType;
    });

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGallerySelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            setSelectedGalleryImages((prev) => [...prev, ...files]);
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setGalleryPreviews((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeGalleryImage = (index: number) => {
        setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
        setSelectedGalleryImages((prev) => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        form.reset({
            title: '',
            description: '',
            content: '',
            event_type: '',
            event_date: '',
            location: '',
            venue: '',
            registration_link: '',
            is_featured: false,
            is_active: true,
            order: 0,
        });
        setImagePreview(null);
        setSelectedImage(null);
        setGalleryPreviews([]);
        setSelectedGalleryImages([]);
    };

    const handleCreate = async (data: EventFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('content', data.content);
            formData.append('event_type', data.event_type);
            formData.append('event_date', data.event_date);
            formData.append('location', data.location);
            formData.append('venue', data.venue);
            if (data.registration_link) formData.append('registration_link', data.registration_link);
            formData.append('is_featured', data.is_featured ? '1' : '0');
            formData.append('is_active', data.is_active ? '1' : '0');
            formData.append('order', data.order.toString());
            if (selectedImage) formData.append('image', selectedImage);
            selectedGalleryImages.forEach((file, index) => {
                formData.append(`gallery[${index}]`, file);
            });

            router.post('/admin/events', formData, {
                onSuccess: () => {
                    toast.success('Event created successfully');
                    setIsCreateOpen(false);
                    resetForm();
                },
                onError: (errors) => {
                    Object.entries(errors).forEach(([, message]) => {
                        toast.error(message as string);
                    });
                },
                onFinish: () => setIsSubmitting(false),
            });
        } catch (error) {
            toast.error('Failed to create event');
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data: EventFormData) => {
        if (!selectedEvent) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('content', data.content);
            formData.append('event_type', data.event_type);
            formData.append('event_date', data.event_date);
            formData.append('location', data.location);
            formData.append('venue', data.venue);
            if (data.registration_link) formData.append('registration_link', data.registration_link);
            formData.append('is_featured', data.is_featured ? '1' : '0');
            formData.append('is_active', data.is_active ? '1' : '0');
            formData.append('order', data.order.toString());
            if (selectedImage) formData.append('image', selectedImage);
            selectedGalleryImages.forEach((file, index) => {
                formData.append(`gallery[${index}]`, file);
            });

            router.post(`/admin/events/${selectedEvent.id}`, formData, {
                onSuccess: () => {
                    toast.success('Event updated successfully');
                    setIsEditOpen(false);
                    resetForm();
                    setSelectedEvent(null);
                },
                onError: (errors) => {
                    Object.entries(errors).forEach(([, message]) => {
                        toast.error(message as string);
                    });
                },
                onFinish: () => setIsSubmitting(false),
            });
        } catch (error) {
            toast.error('Failed to update event');
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        if (!selectedEvent) return;
        setIsSubmitting(true);
        router.delete(`/admin/events/${selectedEvent.id}`, {
            onSuccess: () => {
                toast.success('Event deleted successfully');
                setIsDeleteOpen(false);
                setSelectedEvent(null);
            },
            onError: () => {
                toast.error('Failed to delete event');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const openEditDialog = (event: Event) => {
        setSelectedEvent(event);
        form.reset({
            title: event.title,
            description: event.description,
            content: event.content,
            event_type: event.event_type,
            event_date: event.event_date.split('T')[0],
            location: event.location,
            venue: event.venue,
            registration_link: event.registration_link || '',
            is_featured: event.is_featured,
            is_active: event.is_active,
            order: event.order,
        });
        setImagePreview(event.image ? getImageUrl(event.image) : null);
        if (event.gallery && event.gallery.length > 0) {
            setGalleryPreviews(event.gallery.map((img) => getImageUrl(img)));
        }
        setIsEditOpen(true);
    };

    const openDeleteDialog = (event: Event) => {
        setSelectedEvent(event);
        setIsDeleteOpen(true);
    };

    return (
        <AdminLayout>
            <Head title="Events Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
                        <p className="text-muted-foreground">Manage club events and activities</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title, location, or venue..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {eventTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Gallery</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Order</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEvents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center">
                                                No events found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={getImageUrl(event.image)}
                                                            alt={event.title}
                                                            className="h-10 w-10 rounded object-cover"
                                                        />
                                                        <div>
                                                            <div className="font-medium">{event.title}</div>
                                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                                {event.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {eventTypes.find((t) => t.value === event.event_type)
                                                            ?.label || event.event_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        {new Date(event.event_date).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <div className="text-sm">{event.location}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {event.venue}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {event.gallery && event.gallery.length > 0 && (
                                                        <Badge variant="secondary">
                                                            {event.gallery.length} photos
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Badge variant={event.is_active ? 'default' : 'secondary'}>
                                                            {event.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                        {event.is_featured && (
                                                            <Badge variant="outline">Featured</Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{event.order}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditDialog(event)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDeleteDialog(event)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Add Event</DialogTitle>
                        <DialogDescription>Create a new event for the club</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Event Image</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {imagePreview && (
                                                        <div className="relative w-full h-48">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute -top-2 -right-2 h-6 w-6"
                                                                onClick={() => {
                                                                    setImagePreview(null);
                                                                    setSelectedImage(null);
                                                                }}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        onChange={handleImageSelect}
                                                        className="hidden"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Choose Image
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gallery"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Gallery Images (Optional)</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {galleryPreviews.length > 0 && (
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {galleryPreviews.map((preview, index) => (
                                                                <div key={index} className="relative aspect-square">
                                                                    <img
                                                                        src={preview}
                                                                        alt={`Gallery ${index + 1}`}
                                                                        className="w-full h-full object-cover rounded-lg"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        className="absolute -top-2 -right-2 h-6 w-6"
                                                                        onClick={() => removeGalleryImage(index)}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        ref={galleryInputRef}
                                                        onChange={handleGallerySelect}
                                                        className="hidden"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => galleryInputRef.current?.click()}
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Add Gallery Images
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter event title" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description *</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Short description" rows={2} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Content *</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Detailed content" rows={4} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="event_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Event Type *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select event type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {eventTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="event_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Event Date *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="date" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., Dhaka" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="venue"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Venue *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., Conference Hall" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="registration_link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Registration Link</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ''}
                                                    placeholder="https://example.com/register"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="order"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sort Order</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="is_featured"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Featured</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="is_active"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Active</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsCreateOpen(false);
                                            resetForm();
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Create Event'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog - Similar structure */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>Update event information</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                                {/* Same form fields as Create Dialog */}
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Event Image</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {imagePreview && (
                                                        <div className="relative w-full h-48">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute -top-2 -right-2 h-6 w-6"
                                                                onClick={() => {
                                                                    setImagePreview(null);
                                                                    setSelectedImage(null);
                                                                }}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        onChange={handleImageSelect}
                                                        className="hidden"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Choose Image
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gallery"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Gallery Images (Optional)</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {galleryPreviews.length > 0 && (
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {galleryPreviews.map((preview, index) => (
                                                                <div key={index} className="relative aspect-square">
                                                                    <img
                                                                        src={preview}
                                                                        alt={`Gallery ${index + 1}`}
                                                                        className="w-full h-full object-cover rounded-lg"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        className="absolute -top-2 -right-2 h-6 w-6"
                                                                        onClick={() => removeGalleryImage(index)}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        ref={galleryInputRef}
                                                        onChange={handleGallerySelect}
                                                        className="hidden"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => galleryInputRef.current?.click()}
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Add Gallery Images
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter event title" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description *</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Short description" rows={2} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Content *</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Detailed content" rows={4} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="event_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Event Type *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select event type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {eventTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="event_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Event Date *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="date" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., Dhaka" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="venue"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Venue *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., Conference Hall" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="registration_link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Registration Link</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ''}
                                                    placeholder="https://example.com/register"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="order"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sort Order</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="is_featured"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Featured</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="is_active"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Active</FormLabel>
                                                </div>
                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditOpen(false);
                                            resetForm();
                                            setSelectedEvent(null);
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Updating...' : 'Update Event'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {selectedEvent?.title}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
