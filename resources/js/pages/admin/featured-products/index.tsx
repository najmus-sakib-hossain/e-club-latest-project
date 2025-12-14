import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    Image as ImageIcon,
    Upload,
    X,
    Star,
    StarIcon,
} from 'lucide-react';

import AdminPageLayout from '@/layouts/admin-page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/utils';

// Types
interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    images: string[] | null;
}

interface FeaturedProduct {
    id: number;
    product_id: number;
    product: Product;
    title: string;
    subtitle: string | null;
    description: string | null;
    badge_text: string | null;
    button_text: string | null;
    button_link: string | null;
    image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    featuredProducts: FeaturedProduct[];
    products: Product[];
}

// Form Schema
const featuredProductSchema = z.object({
    product_id: z.number().min(1, 'Product is required'),
    title: z.string().min(1, 'Title is required').max(255),
    subtitle: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    badge_text: z.string().nullable().optional(),
    button_text: z.string().nullable().optional(),
    button_link: z.string().nullable().optional(),
    image: z.any().optional(),
    is_active: z.boolean(),
});

type FeaturedProductFormValues = z.infer<typeof featuredProductSchema>;

export default function FeaturedProductsIndex({ featuredProducts, products }: Props) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedFeatured, setSelectedFeatured] = useState<FeaturedProduct | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<FeaturedProductFormValues>({
        resolver: zodResolver(featuredProductSchema),
        defaultValues: {
            product_id: 0,
            title: '',
            subtitle: '',
            description: '',
            badge_text: '',
            button_text: 'Shop Now',
            button_link: '',
            is_active: true,
        },
    });

    const openAddDialog = () => {
        form.reset({
            product_id: 0,
            title: '',
            subtitle: '',
            description: '',
            badge_text: '',
            button_text: 'Shop Now',
            button_link: '',
            is_active: true,
        });
        setImagePreview(null);
        setIsAddDialogOpen(true);
    };

    const openEditDialog = (featured: FeaturedProduct) => {
        setSelectedFeatured(featured);
        form.reset({
            product_id: featured.product_id,
            title: featured.title,
            subtitle: featured.subtitle || '',
            description: featured.description || '',
            badge_text: featured.badge_text || '',
            button_text: featured.button_text || 'Shop Now',
            button_link: featured.button_link || '',
            is_active: featured.is_active,
        });
        setImagePreview(featured.image ? getImageUrl(featured.image) : null);
        setIsEditDialogOpen(true);
    };

    const openViewDialog = (featured: FeaturedProduct) => {
        setSelectedFeatured(featured);
        setIsViewDialogOpen(true);
    };

    const openDeleteDialog = (featured: FeaturedProduct) => {
        setSelectedFeatured(featured);
        setIsDeleteDialogOpen(true);
    };

    const handleCreate = (values: FeaturedProductFormValues) => {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('product_id', values.product_id.toString());
        formData.append('title', values.title);
        if (values.subtitle) formData.append('subtitle', values.subtitle);
        if (values.description) formData.append('description', values.description);
        if (values.badge_text) formData.append('badge_text', values.badge_text);
        if (values.button_text) formData.append('button_text', values.button_text);
        if (values.button_link) formData.append('button_link', values.button_link);
        formData.append('is_active', values.is_active ? '1' : '0');

        if (values.image instanceof File) {
            formData.append('image', values.image);
        }

        router.post('/admin/featured-products', formData, {
            onSuccess: () => {
                toast.success('Featured product created successfully');
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

    const handleUpdate = (values: FeaturedProductFormValues) => {
        if (!selectedFeatured) return;
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('product_id', values.product_id.toString());
        formData.append('title', values.title);
        if (values.subtitle) formData.append('subtitle', values.subtitle);
        if (values.description) formData.append('description', values.description);
        if (values.badge_text) formData.append('badge_text', values.badge_text);
        if (values.button_text) formData.append('button_text', values.button_text);
        if (values.button_link) formData.append('button_link', values.button_link);
        formData.append('is_active', values.is_active ? '1' : '0');

        if (values.image instanceof File) {
            formData.append('image', values.image);
        }

        router.post(`/admin/featured-products/${selectedFeatured.id}`, formData, {
            onSuccess: () => {
                toast.success('Featured product updated successfully');
                setIsEditDialogOpen(false);
                setSelectedFeatured(null);
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
        if (!selectedFeatured) return;
        setIsSubmitting(true);

        router.delete(`/admin/featured-products/${selectedFeatured.id}`, {
            onSuccess: () => {
                toast.success('Featured product deleted successfully');
                setIsDeleteDialogOpen(false);
                setSelectedFeatured(null);
            },
            onError: () => {
                toast.error('Failed to delete featured product');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    // Stats
    const totalFeatured = featuredProducts.length;
    const activeFeatured = featuredProducts.filter(f => f.is_active).length;

    return (
        <AdminPageLayout>
            <Head title="Featured Products Management" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Page Header */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Products</h1>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Manage featured product showcase on your homepage.
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="gap-2 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        Add Featured
                    </Button>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="grid gap-4 sm:grid-cols-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Featured</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalFeatured}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <StarIcon className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeFeatured}</div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Featured Products Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Featured Products</CardTitle>
                            <CardDescription>
                                Products highlighted on your homepage showcase.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {featuredProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Star className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                    <h3 className="text-lg font-semibold">No featured products</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Get started by adding your first featured product.
                                    </p>
                                    <Button onClick={openAddDialog} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Featured Product
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto -mx-4 md:mx-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-16">Image</TableHead>
                                                <TableHead>Title</TableHead>
                                                <TableHead className="hidden sm:table-cell">Product</TableHead>
                                                <TableHead className="hidden md:table-cell">Badge</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {featuredProducts.map((featured) => (
                                                <TableRow key={featured.id}>
                                                    <TableCell>
                                                        {featured.image ? (
                                                            <img
                                                                src={getImageUrl(featured.image) || ''}
                                                                alt={featured.title}
                                                                className="h-12 w-12 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{featured.title}</div>
                                                        <div className="text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                                                            {featured.subtitle}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        {featured.product?.name || 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {featured.badge_text ? (
                                                            <Badge variant="secondary">{featured.badge_text}</Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={featured.is_active ? 'default' : 'secondary'}>
                                                            {featured.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openViewDialog(featured)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEditDialog(featured)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openDeleteDialog(featured)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Add Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Featured Product</DialogTitle>
                        <DialogDescription>
                            Create a new featured product showcase.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="product_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product</FormLabel>
                                        <Select
                                            value={field.value?.toString() || ''}
                                            onValueChange={(val) => field.onChange(parseInt(val))}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a product" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={product.id.toString()}>
                                                        {product.name}
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
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Featured product title" {...field} />
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
                                                placeholder="Optional subtitle"
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
                                                placeholder="Product description for the showcase"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="badge_text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Badge Text</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Best Seller"
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
                                    name="button_text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Text</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Shop Now"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="button_link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Button Link</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="/products/product-slug"
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
                                render={({ field: { onChange } }) => (
                                    <FormItem>
                                        <FormLabel>Showcase Image</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col gap-4">
                                                {imagePreview && (
                                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-2 right-2"
                                                            onClick={() => {
                                                                setImagePreview(null);
                                                                onChange(undefined);
                                                                if (fileInputRef.current) {
                                                                    fileInputRef.current.value = '';
                                                                }
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                                <div className="flex gap-2">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        ref={fileInputRef}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                onChange(file);
                                                                setImagePreview(URL.createObjectURL(file));
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="gap-2"
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        {imagePreview ? 'Change Image' : 'Upload Image'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Recommended size: 1200x600 pixels
                                        </FormDescription>
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
                                            value={field.value ? 'active' : 'inactive'}
                                            onValueChange={(val) => field.onChange(val === 'active')}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                                    {isSubmitting ? 'Creating...' : 'Create Featured'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Featured Product</DialogTitle>
                        <DialogDescription>
                            Update the featured product showcase.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="product_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product</FormLabel>
                                        <Select
                                            value={field.value?.toString() || ''}
                                            onValueChange={(val) => field.onChange(parseInt(val))}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a product" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={product.id.toString()}>
                                                        {product.name}
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
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Featured product title" {...field} />
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
                                                placeholder="Optional subtitle"
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
                                                placeholder="Product description for the showcase"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="badge_text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Badge Text</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Best Seller"
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
                                    name="button_text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Text</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Shop Now"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="button_link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Button Link</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="/products/product-slug"
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
                                render={({ field: { onChange } }) => (
                                    <FormItem>
                                        <FormLabel>Showcase Image</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col gap-4">
                                                {imagePreview && (
                                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-2 right-2"
                                                            onClick={() => {
                                                                setImagePreview(null);
                                                                onChange(undefined);
                                                                if (fileInputRef.current) {
                                                                    fileInputRef.current.value = '';
                                                                }
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                                <div className="flex gap-2">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        ref={fileInputRef}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                onChange(file);
                                                                setImagePreview(URL.createObjectURL(file));
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="gap-2"
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        {imagePreview ? 'Change Image' : 'Upload Image'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Recommended size: 1200x600 pixels
                                        </FormDescription>
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
                                            value={field.value ? 'active' : 'inactive'}
                                            onValueChange={(val) => field.onChange(val === 'active')}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditDialogOpen(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedFeatured?.title}</DialogTitle>
                        <DialogDescription>
                            Featured product details
                        </DialogDescription>
                    </DialogHeader>
                    {selectedFeatured && (
                        <div className="space-y-4">
                            {selectedFeatured.image && (
                                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                                    <img
                                        src={getImageUrl(selectedFeatured.image) || ''}
                                        alt={selectedFeatured.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Product</p>
                                    <p className="font-medium">{selectedFeatured.product?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <Badge variant={selectedFeatured.is_active ? 'default' : 'secondary'}>
                                        {selectedFeatured.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                            {selectedFeatured.subtitle && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Subtitle</p>
                                    <p>{selectedFeatured.subtitle}</p>
                                </div>
                            )}
                            {selectedFeatured.description && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                                    <p>{selectedFeatured.description}</p>
                                </div>
                            )}
                            {selectedFeatured.badge_text && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Badge</p>
                                    <Badge variant="secondary">{selectedFeatured.badge_text}</Badge>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Button Text</p>
                                    <p>{selectedFeatured.button_text || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Button Link</p>
                                    <p className="truncate">{selectedFeatured.button_link || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Featured Product?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove "{selectedFeatured?.title}" from the featured products.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminPageLayout>
    );
}
