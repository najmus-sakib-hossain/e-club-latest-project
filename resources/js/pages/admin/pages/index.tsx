import { useState } from 'react';
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
    FileText,
    ExternalLink,
    X,
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Types
interface Page {
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_title: string | null;
    meta_description: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    pages: Page[];
}

// Form Schema
const pageSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
    slug: z.string().min(1, 'Slug is required').max(255, 'Slug must be less than 255 characters')
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    content: z.string().min(1, 'Content is required'),
    meta_title: z.string().max(255).nullable().optional(),
    meta_description: z.string().max(500).nullable().optional(),
    is_active: z.boolean(),
    sort_order: z.number().min(0),
});

type PageFormValues = z.infer<typeof pageSchema>;

// Helper to generate slug from title
const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

export default function PagesIndex({ pages }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<PageFormValues>({
        resolver: zodResolver(pageSchema),
        defaultValues: {
            title: '',
            slug: '',
            content: '',
            meta_title: '',
            meta_description: '',
            is_active: true,
            sort_order: 0,
        },
    });

    // Watch title to auto-generate slug
    const watchTitle = form.watch('title');

    const handleTitleChange = (title: string) => {
        form.setValue('title', title);
        // Only auto-generate slug if it's empty or matches the previous auto-generated value
        const currentSlug = form.getValues('slug');
        if (!currentSlug || currentSlug === generateSlug(form.getValues('title').slice(0, -1))) {
            form.setValue('slug', generateSlug(title));
        }
    };

    // Filter pages
    const filteredPages = pages.filter((page) => {
        const matchesSearch =
            page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            page.slug.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && page.is_active) ||
            (statusFilter === 'inactive' && !page.is_active);

        return matchesSearch && matchesStatus;
    });

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
    };

    const openAddDialog = () => {
        form.reset({
            title: '',
            slug: '',
            content: '',
            meta_title: '',
            meta_description: '',
            is_active: true,
            sort_order: 0,
        });
        setIsAddDialogOpen(true);
    };

    const openEditDialog = (page: Page) => {
        setSelectedPage(page);
        form.reset({
            title: page.title,
            slug: page.slug,
            content: page.content,
            meta_title: page.meta_title || '',
            meta_description: page.meta_description || '',
            is_active: page.is_active,
            sort_order: page.sort_order,
        });
        setIsEditDialogOpen(true);
    };

    const openViewDialog = (page: Page) => {
        setSelectedPage(page);
        setIsViewDialogOpen(true);
    };

    const openDeleteDialog = (page: Page) => {
        setSelectedPage(page);
        setIsDeleteDialogOpen(true);
    };

    const handleCreate = (values: PageFormValues) => {
        setIsSubmitting(true);

        router.post('/admin/pages', values, {
            onSuccess: () => {
                toast.success('Page created successfully');
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

    const handleUpdate = (values: PageFormValues) => {
        if (!selectedPage) return;
        setIsSubmitting(true);

        router.put(`/admin/pages/${selectedPage.id}`, values, {
            onSuccess: () => {
                toast.success('Page updated successfully');
                setIsEditDialogOpen(false);
                setSelectedPage(null);
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
        if (!selectedPage) return;
        setIsSubmitting(true);

        router.delete(`/admin/pages/${selectedPage.id}`, {
            onSuccess: () => {
                toast.success('Page deleted successfully');
                setIsDeleteDialogOpen(false);
                setSelectedPage(null);
            },
            onError: () => {
                toast.error('Failed to delete page');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    // Stats
    const totalPages = pages.length;
    const activePages = pages.filter((p) => p.is_active).length;
    const inactivePages = pages.filter((p) => !p.is_active).length;

    return (
        <AdminPageLayout>
            <Head title="Pages Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
                        <p className="text-muted-foreground">
                            Manage your website's static content pages.
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Page
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
                            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPages}</div>
                            <p className="text-xs text-muted-foreground">All content pages</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Pages</CardTitle>
                            <Badge variant="default" className="text-xs">Active</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activePages}</div>
                            <p className="text-xs text-muted-foreground">Visible on the website</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive Pages</CardTitle>
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{inactivePages}</div>
                            <p className="text-xs text-muted-foreground">Hidden from visitors</p>
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
                            <CardDescription>Search and filter pages</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search pages..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
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
                                <Button variant="outline" onClick={handleClearFilters}>
                                    <X className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pages Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>All Pages</CardTitle>
                            <CardDescription>A list of all content pages on your website.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredPages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                    <h3 className="text-lg font-medium">No pages found</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {searchQuery || statusFilter !== 'all'
                                            ? 'Try adjusting your filters'
                                            : 'Get started by creating a new page'}
                                    </p>
                                    {!searchQuery && statusFilter === 'all' && (
                                        <Button onClick={openAddDialog} className="mt-4 gap-2">
                                            <Plus className="h-4 w-4" />
                                            Add Page
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto -mx-4 md:mx-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Title</TableHead>
                                                <TableHead className="hidden md:table-cell">Slug</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden sm:table-cell">Order</TableHead>
                                                <TableHead className="hidden lg:table-cell">Updated</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPages.map((page) => (
                                                <TableRow key={page.id}>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{page.title}</span>
                                                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded md:hidden">
                                                                /{page.slug}
                                                            </code>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <code className="text-xs bg-muted px-2 py-1 rounded">
                                                            /{page.slug}
                                                        </code>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={page.is_active ? 'default' : 'secondary'}
                                                        >
                                                            {page.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">{page.sort_order}</TableCell>
                                                    <TableCell className="hidden lg:table-cell">
                                                        {new Date(page.updated_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 sm:h-9 sm:w-9"
                                                                onClick={() => openViewDialog(page)}
                                                                title="View"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <a
                                                                href={`/${page.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="hidden sm:block"
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 sm:h-9 sm:w-9"
                                                                    title="View on site"
                                                                >
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </Button>
                                                            </a>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 sm:h-9 sm:w-9"
                                                                onClick={() => openEditDialog(page)}
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive"
                                                                onClick={() => openDeleteDialog(page)}
                                                                title="Delete"
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

            {/* Add Page Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Page</DialogTitle>
                        <DialogDescription>
                            Create a new content page for your website.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Shipping Policy"
                                                {...field}
                                                onChange={(e) => handleTitleChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., shipping-policy" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            URL-friendly version of the title. Will be used as: /{field.value}
                                        </FormDescription>
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
                                                placeholder="Enter page content (HTML supported)..."
                                                className="min-h-[200px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            You can use HTML tags for formatting.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="meta_title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Title (SEO)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="SEO title"
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
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="meta_description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meta Description (SEO)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief description for search engines..."
                                                className="min-h-[80px]"
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
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Active</FormLabel>
                                            <FormDescription>
                                                Make this page visible on the website.
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
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Page'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit Page Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Page</DialogTitle>
                        <DialogDescription>
                            Update the content page details.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Shipping Policy" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., shipping-policy" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            URL-friendly version of the title. Will be used as: /{field.value}
                                        </FormDescription>
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
                                                placeholder="Enter page content (HTML supported)..."
                                                className="min-h-[200px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            You can use HTML tags for formatting.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="meta_title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Title (SEO)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="SEO title"
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
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="meta_description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meta Description (SEO)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief description for search engines..."
                                                className="min-h-[80px]"
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
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Active</FormLabel>
                                            <FormDescription>
                                                Make this page visible on the website.
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
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditDialogOpen(false)}
                                >
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

            {/* View Page Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedPage?.title}</DialogTitle>
                        <DialogDescription>
                            /{selectedPage?.slug}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPage && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Badge variant={selectedPage.is_active ? 'default' : 'secondary'}>
                                    {selectedPage.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    Sort Order: {selectedPage.sort_order}
                                </span>
                            </div>

                            {selectedPage.meta_title && (
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Meta Title</h4>
                                    <p className="text-sm text-muted-foreground">{selectedPage.meta_title}</p>
                                </div>
                            )}

                            {selectedPage.meta_description && (
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Meta Description</h4>
                                    <p className="text-sm text-muted-foreground">{selectedPage.meta_description}</p>
                                </div>
                            )}

                            <div>
                                <h4 className="text-sm font-medium mb-1">Content</h4>
                                <div
                                    className="prose prose-sm max-w-none p-4 bg-muted rounded-lg"
                                    dangerouslySetInnerHTML={{ __html: selectedPage.content }}
                                />
                            </div>

                            <div className="text-xs text-muted-foreground">
                                Last updated: {new Date(selectedPage.updated_at).toLocaleString()}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                        <Button onClick={() => {
                            setIsViewDialogOpen(false);
                            if (selectedPage) openEditDialog(selectedPage);
                        }}>
                            Edit Page
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Page</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{selectedPage?.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminPageLayout>
    );
}
