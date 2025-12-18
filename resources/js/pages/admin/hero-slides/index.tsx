import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import {
    ExternalLink,
    Eye,
    Image as ImageIcon,
    Pencil,
    Plus,
    Trash2,
    Upload,
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
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';
import { getImageUrl } from '@/lib/utils';
import { toast } from 'sonner';

// Types
interface HeroSlide {
    id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
    image: string;
    button_text: string | null;
    button_link: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    slides: HeroSlide[];
}

// Form Schema
const slideSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    subtitle: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    image: z.any().optional(),
    button_text: z.string().nullable().optional(),
    button_link: z.string().nullable().optional(),
    is_active: z.boolean(),
    sort_order: z.number().min(0),
});

type SlideFormValues = z.infer<typeof slideSchema>;

export default function HeroSlidesIndex({ slides }: Props) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<SlideFormValues>({
        resolver: zodResolver(slideSchema),
        defaultValues: {
            title: '',
            subtitle: '',
            description: '',
            button_text: '',
            button_link: '',
            is_active: true,
            sort_order: 0,
        },
    });

    const openAddDialog = () => {
        form.reset({
            title: '',
            subtitle: '',
            description: '',
            button_text: '',
            button_link: '',
            is_active: true,
            sort_order: slides.length,
        });
        setImagePreview(null);
        setIsAddDialogOpen(true);
    };

    const openEditDialog = (slide: HeroSlide) => {
        setSelectedSlide(slide);
        form.reset({
            title: slide.title,
            subtitle: slide.subtitle || '',
            description: slide.description || '',
            button_text: slide.button_text || '',
            button_link: slide.button_link || '',
            is_active: slide.is_active,
            sort_order: slide.sort_order,
        });
        setImagePreview(slide.image ? getImageUrl(slide.image) : null);
        setIsEditDialogOpen(true);
    };

    const openViewDialog = (slide: HeroSlide) => {
        setSelectedSlide(slide);
        setIsViewDialogOpen(true);
    };

    const openDeleteDialog = (slide: HeroSlide) => {
        setSelectedSlide(slide);
        setIsDeleteDialogOpen(true);
    };

    const handleCreate = (values: SlideFormValues) => {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', values.title);
        if (values.subtitle) formData.append('subtitle', values.subtitle);
        if (values.description)
            formData.append('description', values.description);
        if (values.button_text)
            formData.append('button_text', values.button_text);
        if (values.button_link)
            formData.append('button_link', values.button_link);
        formData.append('is_active', values.is_active ? '1' : '0');
        formData.append('sort_order', values.sort_order.toString());

        if (values.image instanceof File) {
            formData.append('image', values.image);
        }

        router.post('/admin/hero-slides', formData, {
            onSuccess: () => {
                toast.success('Hero slide created successfully');
                setIsAddDialogOpen(false);
                form.reset();
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error as string);
                });
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleUpdate = (values: SlideFormValues) => {
        if (!selectedSlide) return;
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', values.title);
        if (values.subtitle) formData.append('subtitle', values.subtitle);
        if (values.description)
            formData.append('description', values.description);
        if (values.button_text)
            formData.append('button_text', values.button_text);
        if (values.button_link)
            formData.append('button_link', values.button_link);
        formData.append('is_active', values.is_active ? '1' : '0');
        formData.append('sort_order', values.sort_order.toString());

        if (values.image instanceof File) {
            formData.append('image', values.image);
        }

        router.post(`/admin/hero-slides/${selectedSlide.id}`, formData, {
            onSuccess: () => {
                toast.success('Hero slide updated successfully');
                setIsEditDialogOpen(false);
                setSelectedSlide(null);
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error as string);
                });
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDelete = () => {
        if (!selectedSlide) return;
        setIsSubmitting(true);

        router.delete(`/admin/hero-slides/${selectedSlide.id}`, {
            onSuccess: () => {
                toast.success('Hero slide deleted successfully');
                setIsDeleteDialogOpen(false);
                setSelectedSlide(null);
            },
            onError: () => {
                toast.error('Failed to delete hero slide');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const activeSlides = slides.filter((s) => s.is_active).length;

    return (
        <AdminLayout>
            <Head title="Hero Slides Management" />

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
                            Hero Slides
                        </h1>
                        <p className="text-muted-foreground">
                            Manage the hero banner slides on your homepage.
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Slide
                    </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid gap-4 md:grid-cols-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Slides
                            </CardTitle>
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {slides.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All hero slides
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Slides
                            </CardTitle>
                            <Badge variant="default" className="text-xs">
                                Active
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activeSlides}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Visible on homepage
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Slides Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>All Slides</CardTitle>
                            <CardDescription>
                                Manage your hero carousel slides. Lower order
                                numbers appear first.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {slides.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">
                                    <ImageIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>
                                        No hero slides yet. Create your first
                                        slide!
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {slides
                                        .sort(
                                            (a, b) =>
                                                a.sort_order - b.sort_order,
                                        )
                                        .map((slide, index) => (
                                            <motion.div
                                                key={slide.id}
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                transition={{
                                                    duration: 0.2,
                                                    delay: index * 0.05,
                                                }}
                                                className="group relative overflow-hidden rounded-lg border bg-card"
                                            >
                                                {/* Image */}
                                                <div className="relative aspect-video">
                                                    <img
                                                        src={
                                                            getImageUrl(
                                                                slide.image,
                                                            ) || ''
                                                        }
                                                        alt={slide.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                                    {/* Order Badge */}
                                                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-xs font-medium text-white">
                                                        #{index + 1}
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="absolute right-2 bottom-14">
                                                        <Badge
                                                            variant={
                                                                slide.is_active
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {slide.is_active
                                                                ? 'Active'
                                                                : 'Inactive'}
                                                        </Badge>
                                                    </div>

                                                    {/* Title Overlay */}
                                                    <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
                                                        <h3 className="line-clamp-1 font-semibold">
                                                            {slide.title}
                                                        </h3>
                                                        {slide.subtitle && (
                                                            <p className="line-clamp-1 text-sm opacity-80">
                                                                {slide.subtitle}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="absolute top-2 right-2 flex items-center gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant="secondary"
                                                            className="h-7 w-7"
                                                            onClick={() =>
                                                                openViewDialog(
                                                                    slide,
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="secondary"
                                                            className="h-7 w-7"
                                                            onClick={() =>
                                                                openEditDialog(
                                                                    slide,
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="h-7 w-7"
                                                            onClick={() =>
                                                                openDeleteDialog(
                                                                    slide,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Button Info */}
                                                {slide.button_text && (
                                                    <div className="border-t bg-muted/50 p-3">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">
                                                                {
                                                                    slide.button_text
                                                                }
                                                            </span>
                                                            {slide.button_link && (
                                                                <span className="flex-1 truncate text-muted-foreground">
                                                                    →{' '}
                                                                    {
                                                                        slide.button_link
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Add Slide Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Hero Slide</DialogTitle>
                        <DialogDescription>
                            Create a new slide for your homepage hero banner.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleCreate)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Summer Collection"
                                                {...field}
                                            />
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
                                            <Input
                                                placeholder="e.g., Up to 50% Off"
                                                {...field}
                                                value={field.value || ''}
                                            />
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
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief description for the slide..."
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({
                                    field: { onChange, value, ...field },
                                }) => (
                                    <FormItem>
                                        <FormLabel>Image *</FormLabel>
                                        <FormControl>
                                            <div className="space-y-3">
                                                {imagePreview && (
                                                    <div className="relative h-32 w-full overflow-hidden rounded-lg border">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagePreview(
                                                                    null,
                                                                );
                                                                onChange(
                                                                    undefined,
                                                                );
                                                                if (
                                                                    fileInputRef.current
                                                                )
                                                                    fileInputRef.current.value =
                                                                        '';
                                                            }}
                                                            className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file =
                                                                e.target
                                                                    .files?.[0];
                                                            if (file) {
                                                                onChange(file);
                                                                setImagePreview(
                                                                    URL.createObjectURL(
                                                                        file,
                                                                    ),
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                        className="gap-2"
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        {imagePreview
                                                            ? 'Change Image'
                                                            : 'Upload Image'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Recommended: 1920x800 pixels
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="button_text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Text</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Shop Now"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="button_link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Link</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="/products"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    {...field}
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
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                value={
                                                    field.value
                                                        ? 'active'
                                                        : 'inactive'
                                                }
                                                onValueChange={(val) =>
                                                    field.onChange(
                                                        val === 'active',
                                                    )
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem value="inactive">
                                                        Inactive
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Creating...'
                                        : 'Create Slide'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit Slide Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Hero Slide</DialogTitle>
                        <DialogDescription>
                            Update the slide details.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleUpdate)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Summer Collection"
                                                {...field}
                                            />
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
                                            <Input
                                                placeholder="e.g., Up to 50% Off"
                                                {...field}
                                                value={field.value || ''}
                                            />
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
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief description for the slide..."
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({
                                    field: { onChange, value, ...field },
                                }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <div className="space-y-3">
                                                {imagePreview && (
                                                    <div className="relative h-32 w-full overflow-hidden rounded-lg border">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagePreview(
                                                                    null,
                                                                );
                                                                onChange(
                                                                    undefined,
                                                                );
                                                                if (
                                                                    fileInputRef.current
                                                                )
                                                                    fileInputRef.current.value =
                                                                        '';
                                                            }}
                                                            className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file =
                                                                e.target
                                                                    .files?.[0];
                                                            if (file) {
                                                                onChange(file);
                                                                setImagePreview(
                                                                    URL.createObjectURL(
                                                                        file,
                                                                    ),
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                        className="gap-2"
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        {imagePreview
                                                            ? 'Change Image'
                                                            : 'Upload Image'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Leave empty to keep current image
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="button_text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Text</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Shop Now"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="button_link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Link</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="/products"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    {...field}
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
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                value={
                                                    field.value
                                                        ? 'active'
                                                        : 'inactive'
                                                }
                                                onValueChange={(val) =>
                                                    field.onChange(
                                                        val === 'active',
                                                    )
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem value="inactive">
                                                        Inactive
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Saving...'
                                        : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* View Slide Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Slide Preview</DialogTitle>
                    </DialogHeader>
                    {selectedSlide && (
                        <div className="space-y-4">
                            <div className="relative aspect-video overflow-hidden rounded-lg">
                                <img
                                    src={getImageUrl(selectedSlide.image) || ''}
                                    alt={selectedSlide.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                                    <h2 className="text-2xl font-bold">
                                        {selectedSlide.title}
                                    </h2>
                                    {selectedSlide.subtitle && (
                                        <p className="mt-1 text-lg opacity-90">
                                            {selectedSlide.subtitle}
                                        </p>
                                    )}
                                    {selectedSlide.description && (
                                        <p className="mt-2 opacity-80">
                                            {selectedSlide.description}
                                        </p>
                                    )}
                                    {selectedSlide.button_text && (
                                        <Button className="mt-4" size="lg">
                                            {selectedSlide.button_text}
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">
                                        Status
                                    </p>
                                    <Badge
                                        variant={
                                            selectedSlide.is_active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {selectedSlide.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">
                                        Sort Order
                                    </p>
                                    <p className="font-medium">
                                        {selectedSlide.sort_order}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">
                                        Created
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            selectedSlide.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsViewDialogOpen(false)}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                setIsViewDialogOpen(false);
                                if (selectedSlide)
                                    openEditDialog(selectedSlide);
                            }}
                        >
                            Edit Slide
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Hero Slide</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the slide "
                            {selectedSlide?.title}"? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
