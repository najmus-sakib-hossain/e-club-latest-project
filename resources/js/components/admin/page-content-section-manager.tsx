import { useState } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    Plus,
    Pencil,
    Trash2,
    GripVertical,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Types
export interface PageContentSection {
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

interface PageContentSectionManagerProps {
    pageSlug: string;
    sections: PageContentSection[];
}

// Section types
const sectionTypes = [
    { value: 'hero', label: 'Hero Section', description: 'Main page header with title and subtitle' },
    { value: 'content', label: 'Content Section', description: 'Text content with optional image' },
    { value: 'cta', label: 'Call to Action', description: 'Promotional section with action buttons' },
    { value: 'cards', label: 'Card Grid', description: 'Grid of items (features, services, etc.)' },
    { value: 'gallery', label: 'Image Gallery', description: 'Collection of images' },
    { value: 'testimonials', label: 'Testimonials', description: 'Customer reviews and feedback' },
    { value: 'custom', label: 'Custom Section', description: 'Flexible custom content' },
];

// Form schema
const sectionFormSchema = z.object({
    section_key: z.string().min(1, 'Section key is required'),
    section_type: z.string().min(1, 'Section type is required'),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    content: z.string().optional(),
    image: z.string().optional(),
    is_active: z.boolean(),
    sort_order: z.number().min(0),
});

type SectionFormValues = z.infer<typeof sectionFormSchema>;

export function PageContentSectionManager({ pageSlug, sections }: PageContentSectionManagerProps) {
    const [expandedSections, setExpandedSections] = useState<number[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<PageContentSection | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SectionFormValues>({
        resolver: zodResolver(sectionFormSchema),
        defaultValues: {
            section_key: '',
            section_type: 'content',
            title: '',
            subtitle: '',
            content: '',
            image: '',
            is_active: true,
            sort_order: 0,
        },
    });

    const toggleSection = (sectionId: number) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const openAddDialog = () => {
        setSelectedSection(null);
        form.reset({
            section_key: '',
            section_type: 'content',
            title: '',
            subtitle: '',
            content: '',
            image: '',
            is_active: true,
            sort_order: sections.length,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (section: PageContentSection) => {
        setSelectedSection(section);
        form.reset({
            section_key: section.section_key,
            section_type: section.section_key.split('_')[0] || 'content',
            title: section.title || '',
            subtitle: section.subtitle || '',
            content: section.content || '',
            image: section.image || '',
            is_active: section.is_active,
            sort_order: section.sort_order,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (data: SectionFormValues) => {
        setIsSubmitting(true);
        const url = selectedSection
            ? `/admin/content-pages/${pageSlug}/sections/${selectedSection.id}`
            : `/admin/content-pages/${pageSlug}/sections`;

        router.post(url, selectedSection ? { ...data, _method: 'PUT' } : data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(selectedSection ? 'Section updated' : 'Section created');
                setIsDialogOpen(false);
            },
            onError: () => {
                toast.error('Failed to save section');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDelete = () => {
        if (!selectedSection) return;

        setIsSubmitting(true);
        router.delete(`/admin/content-pages/${pageSlug}/sections/${selectedSection.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Section deleted');
                setIsDeleteDialogOpen(false);
                setSelectedSection(null);
            },
            onError: () => {
                toast.error('Failed to delete section');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const getSectionTypeLabel = (key: string) => {
        const type = sectionTypes.find(t => key.startsWith(t.value));
        return type?.label || 'Custom';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Page Content Sections</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage dynamic sections for this page
                    </p>
                </div>
                <Button onClick={openAddDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                </Button>
            </div>

            {sections.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">No content sections yet</p>
                        <Button onClick={openAddDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Section
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {sections.map((section) => (
                        <Card key={section.id}>
                            <Collapsible
                                open={expandedSections.includes(section.id)}
                                onOpenChange={() => toggleSection(section.id)}
                            >
                                <CardHeader className="py-4">
                                    <div className="flex items-center justify-between">
                                        <CollapsibleTrigger className="flex items-center gap-3 hover:opacity-80">
                                            {expandedSections.includes(section.id) ? (
                                                <ChevronDown className="h-5 w-5" />
                                            ) : (
                                                <ChevronRight className="h-5 w-5" />
                                            )}
                                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                            <div className="text-left">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    {section.title || section.section_key}
                                                    <Badge variant="outline" className="text-xs">
                                                        {getSectionTypeLabel(section.section_key)}
                                                    </Badge>
                                                </CardTitle>
                                                {section.subtitle && (
                                                    <CardDescription className="text-xs mt-1">
                                                        {section.subtitle}
                                                    </CardDescription>
                                                )}
                                            </div>
                                        </CollapsibleTrigger>
                                        <div className="flex items-center gap-2">
                                            {section.is_active ? (
                                                <Eye className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            )}
                                            <Badge variant="secondary">#{section.sort_order}</Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditDialog(section);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedSection(section);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CollapsibleContent>
                                    <CardContent className="pt-0 space-y-2 text-sm">
                                        {section.content && (
                                            <div>
                                                <span className="font-medium">Content:</span>
                                                <p className="text-muted-foreground line-clamp-3">
                                                    {section.content}
                                                </p>
                                            </div>
                                        )}
                                        {section.image && (
                                            <div>
                                                <span className="font-medium">Image:</span>
                                                <span className="text-muted-foreground ml-2">{section.image}</span>
                                            </div>
                                        )}
                                        {section.items && section.items.length > 0 && (
                                            <div>
                                                <span className="font-medium">Items:</span>
                                                <span className="text-muted-foreground ml-2">
                                                    {section.items.length} item(s)
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedSection ? 'Edit Section' : 'Add Section'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedSection
                                ? 'Update page content section'
                                : 'Add a new content section to the page'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="section_key"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Section Key</FormLabel>
                                            <FormControl>
                                                <Input placeholder="hero_main" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Unique identifier (e.g., hero_main, features_list)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="section_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Section Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {sectionTypes.map((type) => (
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
                            </div>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Section Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subtitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subtitle</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Optional subtitle or description" {...field} />
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
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Main content for this section..."
                                                rows={6}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="/images/section-image.jpg" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Path to image file (optional)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-1">
                                            <div className="space-y-0.5">
                                                <FormLabel>Active</FormLabel>
                                                <FormDescription className="text-xs">
                                                    Show this section on the page
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : selectedSection ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Section</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{selectedSection?.section_key}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
