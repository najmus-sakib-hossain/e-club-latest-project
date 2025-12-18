import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import {
    Clock,
    GripVertical,
    Headset,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState, type ReactNode } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';
import { toast } from 'sonner';

// Types
interface PageContentRecord {
    id: number;
    page_slug: string;
    section_key: string;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    image: string | null;
    items: Record<string, unknown>[] | null;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    content: Record<string, PageContentRecord>;
}

// Icon options for contact cards
const iconOptions = [
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'location', label: 'Location', icon: MapPin },
    { value: 'clock', label: 'Hours', icon: Clock },
    { value: 'chat', label: 'Chat', icon: MessageSquare },
    { value: 'support', label: 'Support', icon: Headset },
];

// Form Schema
const contactFormSchema = z.object({
    page_title: z.string().min(1, 'Title is required').max(255),
    page_subtitle: z.string().optional(),
    form_title: z.string().optional(),
    form_subtitle: z.string().optional(),
    hours_weekday: z.string().optional(),
    hours_weekend: z.string().optional(),
    map_embed: z.string().optional(),
    contact_cards: z
        .array(
            z.object({
                icon: z.string().optional(),
                title: z.string().min(1, 'Title is required'),
                details: z.array(z.string()).optional(),
            }),
        )
        .optional(),
    cta_title: z.string().optional(),
    cta_subtitle: z.string().optional(),
    cta_call_label: z.string().optional(),
    cta_email_label: z.string().optional(),
    cta_phone: z.string().optional(),
    cta_email: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage({ content }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 100, tolerance: 8 },
        }),
        useSensor(KeyboardSensor),
    );

    const defaultMapEmbed = useMemo(
        () =>
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2674437095374!2d90.37399311498239!3d23.746499784589654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf4de7a6cd05%3A0x6e7a2d17e7e4d823!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1638000000000!5m2!1sen!2sbd',
        [],
    );

    // Parse hours from content
    let parsedHours = { weekday: '', weekend: '' };
    try {
        if (content.hours?.content) {
            parsedHours = JSON.parse(content.hours.content);
        }
    } catch {
        // ignore parse errors
    }

    let parsedCta = { call_label: '', email_label: '', phone: '', email: '' };
    try {
        if (content.cta?.content) {
            parsedCta = JSON.parse(content.cta.content);
        }
    } catch {
        // ignore parse errors
    }

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            page_title: content.hero?.title || 'Get in Touch',
            page_subtitle:
                content.hero?.subtitle ||
                "Have questions about our e-club? Need help with your order? We're here to help! Reach out to us through any of the channels below.",
            form_title: content.form?.title || 'Send us a Message',
            form_subtitle:
                content.form?.subtitle ||
                "Fill out the form below and we'll get back to you as soon as possible.",
            hours_weekday: parsedHours.weekday || 'Mon-Fri: 9:00 AM - 6:00 PM',
            hours_weekend: parsedHours.weekend || 'Sat-Sun: 10:00 AM - 4:00 PM',
            map_embed: content.map?.content || defaultMapEmbed,
            contact_cards: (content.cards
                ?.items as ContactFormValues['contact_cards']) || [
                {
                    icon: 'phone',
                    title: 'Phone',
                    details: ['+880 1XXX-XXXXXX', '+880 1YYY-YYYYYY'],
                },
                {
                    icon: 'email',
                    title: 'Email',
                    details: ['info@e-club.com', 'support@e-club.com'],
                },
                {
                    icon: 'location',
                    title: 'Location',
                    details: ['123 Main Street', 'Dhaka 1000, Bangladesh'],
                },
            ],
            cta_title: content.cta?.title || 'Need Immediate Help?',
            cta_subtitle:
                content.cta?.subtitle ||
                'Our customer support team is available to assist you.',
            cta_call_label: parsedCta.call_label || 'Call Now',
            cta_email_label: parsedCta.email_label || 'Email Us',
            cta_phone: parsedCta.phone || '+8801XXXXXXXXX',
            cta_email: parsedCta.email || 'info@fitmentcraft.com',
        },
    });

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: 'contact_cards',
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = fields.findIndex((item) => item.id === active.id);
        const newIndex = fields.findIndex((item) => item.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
            move(oldIndex, newIndex);
        }
    };

    const SortableCard = ({
        id,
        children,
    }: {
        id: string;
        children: ReactNode;
    }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id });
        const style = {
            transform: CSS.Translate.toString(transform),
            transition,
            opacity: isDragging ? 0.95 : 1,
        };

        return (
            <motion.div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="space-y-4 rounded-lg border bg-card p-4"
            >
                {children}
            </motion.div>
        );
    };

    const handleSave = (data: ContactFormValues) => {
        setIsSubmitting(true);
        router.post('/admin/content-pages/contact', data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Contact page saved successfully');
            },
            onError: () => {
                toast.error('Failed to save contact page');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Contact Page - Admin" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">
                        Contact Page
                    </h1>
                    <p className="text-muted-foreground">
                        Manage the contact page content and settings
                    </p>
                </motion.div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)}>
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="space-y-6"
                        >
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="hero">
                                    Hero Section
                                </TabsTrigger>
                                <TabsTrigger value="form">
                                    Contact Form
                                </TabsTrigger>
                                <TabsTrigger value="cards">
                                    Contact Cards
                                </TabsTrigger>
                                <TabsTrigger value="hours">
                                    Hours & Map
                                </TabsTrigger>
                                <TabsTrigger value="cta">
                                    Quick Contact CTA
                                </TabsTrigger>
                            </TabsList>

                            {/* Hero Section */}
                            <TabsContent value="hero">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Hero Section</CardTitle>
                                        <CardDescription>
                                            The main heading and introduction
                                            for the contact page
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="page_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Page Title
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Contact Us"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="page_subtitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Page Subtitle
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Have questions? We're here to help..."
                                                            rows={3}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Hero Section
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Contact Form Settings */}
                            <TabsContent value="form">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Contact Form Settings
                                        </CardTitle>
                                        <CardDescription>
                                            Configure the contact form section
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="form_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Form Title
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Send us a Message"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="form_subtitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Form Subtitle
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Fill out the form below and we'll get back to you..."
                                                            rows={2}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Form Settings
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Contact Cards */}
                            <TabsContent value="cards">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>
                                                    Contact Cards
                                                </CardTitle>
                                                <CardDescription>
                                                    Add contact methods like
                                                    phone, email, address
                                                </CardDescription>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    append({
                                                        icon: 'phone',
                                                        title: '',
                                                        details: [''],
                                                    })
                                                }
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Card
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {fields.length === 0 && (
                                            <div className="rounded-lg border-2 border-dashed py-8 text-center">
                                                <p className="mb-2 text-muted-foreground">
                                                    No contact cards yet
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        append({
                                                            icon: 'phone',
                                                            title: '',
                                                            details: [''],
                                                        })
                                                    }
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add First Card
                                                </Button>
                                            </div>
                                        )}

                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <SortableContext
                                                items={fields.map(
                                                    (item) => item.id,
                                                )}
                                                strategy={
                                                    verticalListSortingStrategy
                                                }
                                            >
                                                {fields.map((field, index) => (
                                                    <SortableCard
                                                        key={field.id}
                                                        id={field.id}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
                                                                <span className="font-medium">
                                                                    Contact Card{' '}
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    remove(
                                                                        index,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name={`contact_cards.${index}.icon`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Icon
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Select
                                                                                value={
                                                                                    field.value ||
                                                                                    'phone'
                                                                                }
                                                                                onValueChange={
                                                                                    field.onChange
                                                                                }
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Choose an icon" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {iconOptions.map(
                                                                                        (
                                                                                            option,
                                                                                        ) => {
                                                                                            const IconComp =
                                                                                                option.icon;
                                                                                            return (
                                                                                                <SelectItem
                                                                                                    key={
                                                                                                        option.value
                                                                                                    }
                                                                                                    value={
                                                                                                        option.value
                                                                                                    }
                                                                                                >
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <IconComp className="h-4 w-4" />
                                                                                                        <span>
                                                                                                            {
                                                                                                                option.label
                                                                                                            }
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </SelectItem>
                                                                                            );
                                                                                        },
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name={`contact_cards.${index}.title`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Title
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                placeholder="Phone"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name={`contact_cards.${index}.details`}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Details
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Textarea
                                                                            placeholder="Enter details (one per line)"
                                                                            rows={
                                                                                3
                                                                            }
                                                                            value={(
                                                                                field.value ||
                                                                                []
                                                                            ).join(
                                                                                '\n',
                                                                            )}
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                field.onChange(
                                                                                    e.target.value.split(
                                                                                        '\n',
                                                                                    ),
                                                                                )
                                                                            }
                                                                        />
                                                                    </FormControl>
                                                                    <FormDescription>
                                                                        Enter
                                                                        each
                                                                        detail
                                                                        on a new
                                                                        line
                                                                    </FormDescription>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </SortableCard>
                                                ))}
                                            </SortableContext>
                                        </DndContext>

                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Contact Cards
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Hours & Map */}
                            <TabsContent value="hours">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5" />
                                            Business Hours
                                        </CardTitle>
                                        <CardDescription>
                                            Set your business operating hours
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="hours_weekday"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Weekday Hours
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="hours_weekend"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Weekend Hours
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Sat-Sun: 10:00 AM - 4:00 PM"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="mt-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Map
                                        </CardTitle>
                                        <CardDescription>
                                            Embed a Google Map of your location
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="map_embed"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Google Maps Embed URL
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="https://www.google.com/maps/embed?pb=..."
                                                            rows={3}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Go to Google Maps, click
                                                        Share → Embed a map, and
                                                        paste the src URL here
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {form.watch('map_embed') && (
                                            <div className="aspect-video overflow-hidden rounded-lg border">
                                                <iframe
                                                    src={form.watch(
                                                        'map_embed',
                                                    )}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0 }}
                                                    allowFullScreen
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                />
                                            </div>
                                        )}
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Hours & Map
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* CTA Section */}
                            <TabsContent value="cta">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Contact CTA</CardTitle>
                                        <CardDescription>
                                            Control the call-to-action block
                                            shown beside the map
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="cta_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        CTA Title
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Need Immediate Help?"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="cta_subtitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        CTA Subtitle
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Our customer support team is available to assist you."
                                                            rows={2}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="cta_call_label"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Call Button Label
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Call Now"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="cta_phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Phone Number
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="+8801XXXXXXXXX"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="cta_email_label"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Email Button Label
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Email Us"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="cta_email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Email Address
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="info@e-club.com"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                Save CTA Section
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </form>
                </Form>
            </div>
        </AdminLayout>
    );
}
