import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Save,
    Plus,
    Trash2,
    CircleHelp,
    GripVertical,
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Phone, Mail, MessageCircle, HelpCircle, Headphones } from 'lucide-react';

import AdminPageLayout from '@/layouts/admin-page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

// Icon options for quick links
const iconOptions = [
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'mail', label: 'Email', icon: Mail },
    { value: 'message', label: 'Live Chat', icon: MessageCircle },
    { value: 'help', label: 'Help', icon: HelpCircle },
    { value: 'support', label: 'Support', icon: Headphones },
    { value: 'question', label: 'Question', icon: CircleHelp },
];

// Form Schema
const helpFormSchema = z.object({
    hero_title: z.string().min(1, 'Title is required').max(255),
    hero_subtitle: z.string().optional(),
    search_placeholder: z.string().optional(),
    faq_section_title: z.string().optional(),
    cta_title: z.string().optional(),
    cta_subtitle: z.string().optional(),
    cta_button1_text: z.string().optional(),
    cta_button1_url: z.string().optional(),
    cta_button2_text: z.string().optional(),
    cta_button2_url: z.string().optional(),
    quick_links: z.array(z.object({
        icon: z.string().optional(),
        title: z.string().min(1, 'Title is required'),
        description: z.string().optional(),
        button_text: z.string().optional(),
    })).optional(),
});

type HelpFormValues = z.infer<typeof helpFormSchema>;

export default function HelpPage({ content }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 8 } }),
        useSensor(KeyboardSensor)
    );

    const parsedCtaContent = useMemo(() => {
        try {
            return content.cta?.content ? JSON.parse(content.cta.content) : null;
        } catch (err) {
            return null;
        }
    }, [content.cta?.content]);

    const defaultValues = useMemo<HelpFormValues>(() => ({
        hero_title: content.hero?.title || 'How Can We Help?',
        hero_subtitle: content.hero?.subtitle || 'Find answers to commonly asked questions or contact our support team.',
        search_placeholder: content.search?.title || 'Search for answers...',
        faq_section_title: content.faq_section?.title || 'Frequently Asked Questions',
        cta_title: content.cta?.title || 'Still Need Help?',
        cta_subtitle: content.cta?.subtitle || 'Can\'t find what you\'re looking for? Our support team is here to help.',
        cta_button1_text: parsedCtaContent?.button1_text || 'Contact Us',
        cta_button1_url: parsedCtaContent?.button1_url || '/contact',
        cta_button2_text: parsedCtaContent?.button2_text || 'Schedule a Meeting',
        cta_button2_url: parsedCtaContent?.button2_url || '/meeting/schedule',
        quick_links: (content.quick_links?.items as HelpFormValues['quick_links']) || [
            { icon: 'phone', title: 'Call Us', description: 'Speak directly with our team', button_text: 'Call Now' },
            { icon: 'mail', title: 'Email Support', description: 'We\'ll respond within 24 hours', button_text: 'Send Email' },
            { icon: 'message', title: 'Live Chat', description: 'Chat with us in real-time', button_text: 'Start Chat' },
        ],
    }), [content.hero?.title, content.hero?.subtitle, content.search?.title, content.faq_section?.title, content.cta?.title, content.cta?.subtitle, content.quick_links?.items, parsedCtaContent]);

    const form = useForm<HelpFormValues>({
        resolver: zodResolver(helpFormSchema),
        defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: 'quick_links',
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

    const SortableCard = ({ id, children }: { id: string; children: ReactNode }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
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
                className="p-4 border rounded-lg space-y-4 bg-card"
            >
                {children}
            </motion.div>
        );
    };

    const handleSave = (data: HelpFormValues) => {
        setIsSubmitting(true);

        const ctaContent = {
            button1_text: data.cta_button1_text,
            button1_url: data.cta_button1_url,
            button2_text: data.cta_button2_text,
            button2_url: data.cta_button2_url,
        };

        router.post('/admin/content-pages/help', {
            sections: {
                hero: {
                    title: data.hero_title,
                    subtitle: data.hero_subtitle,
                },
                search: {
                    title: data.search_placeholder,
                },
                quick_links: {
                    items: data.quick_links || [],
                },
                faq_section: {
                    title: data.faq_section_title,
                },
                cta: {
                    title: data.cta_title,
                    subtitle: data.cta_subtitle,
                    content: JSON.stringify(ctaContent),
                },
            },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Help Center page saved successfully');
            },
            onError: () => {
                toast.error('Failed to save Help Center page');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AdminPageLayout>
            <Head title="Help Center - Admin" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">Help Center Page</h1>
                    <p className="text-muted-foreground">
                        Manage the help center page content and quick links
                    </p>
                </motion.div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="hero">Hero Section</TabsTrigger>
                                <TabsTrigger value="search">Search Section</TabsTrigger>
                                <TabsTrigger value="quick-links">Quick Links</TabsTrigger>
                                <TabsTrigger value="faq">FAQ Section</TabsTrigger>
                                <TabsTrigger value="cta">CTA Section</TabsTrigger>
                            </TabsList>

                            {/* Hero Section */}
                            <TabsContent value="hero">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Hero Section</CardTitle>
                                        <CardDescription>
                                            The main heading and search area for the help center
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="hero_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Page Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="How Can We Help?" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hero_subtitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Page Subtitle</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Find answers to commonly asked questions or contact our support team."
                                                            rows={2}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="search_placeholder"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Search Placeholder Text</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Search for answers..." {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Placeholder text shown in the search box
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={isSubmitting}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Hero Section
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Search Section */}
                            <TabsContent value="search">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Search Section</CardTitle>
                                        <CardDescription>
                                            Configure the search input placeholder shown under the hero
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="search_placeholder"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Search Placeholder</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Search for answers..." {...field} />
                                                    </FormControl>
                                                    <FormDescription>Appears inside the help search box.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={isSubmitting}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Search Section
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Quick Links */}
                            <TabsContent value="quick-links">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Quick Links</CardTitle>
                                                <CardDescription>
                                                    Contact methods displayed prominently (phone, email, chat)
                                                </CardDescription>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => append({ icon: 'phone', title: '', description: '', button_text: '' })}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Quick Link
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {fields.length === 0 && (
                                            <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                                <p className="text-muted-foreground mb-2">No quick links yet</p>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => append({ icon: 'phone', title: '', description: '', button_text: '' })}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add First Quick Link
                                                </Button>
                                            </div>
                                        )}
                                        {fields.length > 0 && (
                                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                                <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                                                    <div className="space-y-4">
                                                        {fields.map((field, index) => (
                                                            <SortableCard key={field.id} id={field.id}>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                                                        <span className="font-medium">Quick Link {index + 1}</span>
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => remove(index)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                                    </Button>
                                                                </div>
                                                                <div className="grid gap-4 sm:grid-cols-2">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`quick_links.${index}.icon`}
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>Icon</FormLabel>
                                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                                    <FormControl>
                                                                                        <SelectTrigger>
                                                                                            <SelectValue placeholder="Select icon" />
                                                                                        </SelectTrigger>
                                                                                    </FormControl>
                                                                                    <SelectContent>
                                                                                        {iconOptions.map((option) => {
                                                                                            const IconComponent = option.icon;
                                                                                            return (
                                                                                                <SelectItem key={option.value} value={option.value}>
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <IconComponent className="h-4 w-4" />
                                                                                                        <span>{option.label}</span>
                                                                                                    </div>
                                                                                                </SelectItem>
                                                                                            );
                                                                                        })}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`quick_links.${index}.title`}
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>Title</FormLabel>
                                                                                <FormControl>
                                                                                    <Input placeholder="Call Us" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`quick_links.${index}.description`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Description</FormLabel>
                                                                            <FormControl>
                                                                                <Input placeholder="Speak directly with our team" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`quick_links.${index}.button_text`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Button Text</FormLabel>
                                                                            <FormControl>
                                                                                <Input placeholder="Call Now" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </SortableCard>
                                                        ))}
                                                    </div>
                                                </SortableContext>
                                            </DndContext>
                                        )}

                                        <div className="flex justify-end mt-4">
                                            <Button type="submit" disabled={isSubmitting}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Quick Links
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* FAQ Section */}
                            <TabsContent value="faq">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CircleHelp className="h-5 w-5" />
                                            FAQ Section
                                        </CardTitle>
                                        <CardDescription>
                                            Configure the FAQ section displayed on the help center
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="faq_section_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Section Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Frequently Asked Questions" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="rounded-lg border p-4 bg-muted/50">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                FAQs are managed separately. Visit the FAQs management page to add/edit questions.
                                            </p>
                                            <Button variant="outline" asChild>
                                                <a href="/admin/content-pages/faqs">
                                                    Manage FAQs
                                                </a>
                                            </Button>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={isSubmitting}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save FAQ Section
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* CTA Section */}
                            <TabsContent value="cta">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Call-to-Action Section</CardTitle>
                                        <CardDescription>
                                            The "Still Need Help?" section at the bottom of the page
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="cta_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CTA Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Still Need Help?" {...field} />
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
                                                    <FormLabel>CTA Subtitle</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Can't find what you're looking for? Our support team is here to help."
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
                                                name="cta_button1_text"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Button 1 Text</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Contact Us" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="cta_button1_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Button 1 URL</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="/contact" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="cta_button2_text"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Button 2 Text</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Schedule a Meeting" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="cta_button2_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Button 2 URL</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="/meeting/schedule" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={isSubmitting}>
                                                <Save className="h-4 w-4 mr-2" />
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
        </AdminPageLayout>
    );
}
