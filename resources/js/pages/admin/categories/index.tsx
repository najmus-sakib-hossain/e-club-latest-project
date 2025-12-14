import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Eye,
    FolderOpen,
    Package,
    X,
    Upload,
    Image,
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
interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    is_active: boolean;
    sort_order: number;
    products_count?: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        search?: string;
        status?: string;
    };
}

// Form Schema
const categorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
    description: z.string().nullable().optional(),
    image: z.any().optional(),
    is_active: z.boolean(),
    sort_order: z.coerce.number().min(0),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesIndex({ categories, filters = {} }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const addFileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            description: '',
            is_active: true,
            sort_order: 0,
        },
    });

    const handleSearch = () => {
        router.get('/admin/categories', {
            search: searchQuery || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
        }, { preserveState: true });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        router.get('/admin/categories');
    };

    const openAddDialog = () => {
        form.reset({
            name: '',
            description: '',
            is_active: true,
            sort_order: 0,
        });
        setImagePreview(null);
        setIsAddDialogOpen(true);
    };

    const openEditDialog = (category: Category) => {
        setSelectedCategory(category);
        form.reset({
            name: category.name,
            description: category.description || '',
            is_active: category.is_active,
            sort_order: category.sort_order,
        });
        setImagePreview(category.image ? getImageUrl(category.image) : null);
        setIsEditDialogOpen(true);
    };

    const openViewDialog = (category: Category) => {
        setSelectedCategory(category);
        setIsViewDialogOpen(true);
    };

    const openDeleteDialog = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    };

    const handleCreate = (values: CategoryFormValues) => {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', values.name);
        if (values.description) formData.append('description', values.description);
        formData.append('is_active', values.is_active ? '1' : '0');
        formData.append('sort_order', values.sort_order.toString());

        if (values.image instanceof File) {
            formData.append('image', values.image);
        }

        router.post('/admin/categories', formData, {
            onSuccess: () => {
                toast.success('Category created successfully');
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

    const handleUpdate = (values: CategoryFormValues) => {
        if (!selectedCategory) return;
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', values.name);
        if (values.description) formData.append('description', values.description);
        formData.append('is_active', values.is_active ? '1' : '0');
        formData.append('sort_order', values.sort_order.toString());

        if (values.image instanceof File) {
            formData.append('image', values.image);
        }

        router.post(`/admin/categories/${selectedCategory.id}`, formData, {
            onSuccess: () => {
                toast.success('Category updated successfully');
                setIsEditDialogOpen(false);
                setSelectedCategory(null);
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
        if (!selectedCategory) return;
        setIsSubmitting(true);

        router.delete(`/admin/categories/${selectedCategory.id}`, {
            onSuccess: () => {
                toast.success('Category deleted successfully');
                setIsDeleteDialogOpen(false);
                setSelectedCategory(null);
            },
            onError: () => {
                toast.error('Failed to delete category. It may have associated products.');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/categories', {
            page,
            search: searchQuery || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
        }, { preserveState: true });
    };

    // Stats
    const totalCategories = categories.total;
    const activeCategories = categories.data.filter(c => c.is_active).length;
    const totalProducts = categories.data.reduce((acc, c) => acc + (c.products_count || 0), 0);

    return (
        <AdminPageLayout>
            <Head title="Categories Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground">
                            Manage your furniture categories and organize your products.
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="grid gap-4 md:grid-cols-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalCategories}</div>
                            <p className="text-xs text-muted-foreground">
                                All category listings
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
                            <Badge variant="default" className="text-xs">Active</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeCategories}</div>
                            <p className="text-xs text-muted-foreground">
                                Visible on the store
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProducts}</div>
                            <p className="text-xs text-muted-foreground">
                                Across all categories
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                            <CardDescription>Search and filter categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search categories..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleSearch}>Search</Button>
                                <Button variant="outline" onClick={handleClearFilters}>
                                    <X className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Categories Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>All Categories</CardTitle>
                            <CardDescription>
                                A list of all categories in your store.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto -mx-4 md:mx-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Image</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="hidden md:table-cell">Slug</TableHead>
                                            <TableHead className="hidden sm:table-cell">Products</TableHead>
                                            <TableHead className="hidden lg:table-cell">Order</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                    No categories found. Create your first category!
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            categories.data.map((category, index) => (
                                                <motion.tr
                                                    key={category.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                                    className="border-b transition-colors hover:bg-muted/50"
                                                >
                                                    <TableCell>
                                                        {category.image ? (
                                                            <img
                                                                src={getImageUrl(category.image) || ''}
                                                                alt={category.name}
                                                                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-muted flex items-center justify-center">
                                                                <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{category.name}</span>
                                                            <span className="text-xs text-muted-foreground md:hidden">{category.slug}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell text-muted-foreground">{category.slug}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <Badge variant="secondary">
                                                            {category.products_count || 0} products
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden lg:table-cell">{category.sort_order}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                                                            {category.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1 sm:gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 sm:h-9 sm:w-9"
                                                                onClick={() => openViewDialog(category)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 sm:h-9 sm:w-9"
                                                                onClick={() => openEditDialog(category)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive"
                                                                onClick={() => openDeleteDialog(category)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </motion.tr>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {categories.last_page > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {((categories.current_page - 1) * categories.per_page) + 1} to{' '}
                                        {Math.min(categories.current_page * categories.per_page, categories.total)} of{' '}
                                        {categories.total} categories
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(categories.current_page - 1)}
                                            disabled={categories.current_page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(categories.current_page + 1)}
                                            disabled={categories.current_page === categories.last_page}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Add Category Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>
                            Create a new category to organize your products.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Living Room" {...field} />
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
                                                placeholder="Describe this category..."
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
                                render={({ field: { onChange, value, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <div className="space-y-3">
                                                {imagePreview && (
                                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagePreview(null);
                                                                onChange(undefined);
                                                                if (addFileInputRef.current) addFileInputRef.current.value = '';
                                                            }}
                                                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        ref={addFileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
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
                                                        onClick={() => addFileInputRef.current?.click()}
                                                        className="gap-2"
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        {imagePreview ? 'Change Image' : 'Upload Image'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Upload a category image (optional)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                        <FormDescription>
                                            Lower numbers appear first
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
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Category'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update the category details.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Living Room" {...field} />
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
                                                placeholder="Describe this category..."
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
                                render={({ field: { onChange, value, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <div className="space-y-3">
                                                {imagePreview && (
                                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagePreview(null);
                                                                onChange(undefined);
                                                                if (editFileInputRef.current) editFileInputRef.current.value = '';
                                                            }}
                                                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        ref={editFileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
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
                                                        onClick={() => editFileInputRef.current?.click()}
                                                        className="gap-2"
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        {imagePreview ? 'Change Image' : 'Upload Image'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Upload a new image to replace the current one
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* View Category Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Category Details</DialogTitle>
                    </DialogHeader>
                    {selectedCategory && (
                        <div className="space-y-4">
                            {selectedCategory.image && (
                                <img
                                    src={getImageUrl(selectedCategory.image) || ''}
                                    alt={selectedCategory.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">{selectedCategory.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Slug</p>
                                    <p className="font-medium">{selectedCategory.slug}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Products</p>
                                    <p className="font-medium">{selectedCategory.products_count || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Sort Order</p>
                                    <p className="font-medium">{selectedCategory.sort_order}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={selectedCategory.is_active ? 'default' : 'secondary'}>
                                        {selectedCategory.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p className="font-medium">
                                        {new Date(selectedCategory.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {selectedCategory.description && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Description</p>
                                    <p className="mt-1">{selectedCategory.description}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                        <Button onClick={() => {
                            setIsViewDialogOpen(false);
                            if (selectedCategory) openEditDialog(selectedCategory);
                        }}>
                            Edit Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
                            {(selectedCategory?.products_count ?? 0) > 0 && (
                                <span className="block mt-2 text-destructive">
                                    Warning: This category has {selectedCategory?.products_count} products associated with it.
                                </span>
                            )}
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
        </AdminPageLayout>
    );
}
