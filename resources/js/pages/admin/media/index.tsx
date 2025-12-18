import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { Calendar, FileText, Image as ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';

interface MediaPost {
    id: number;
    title: string;
    content: string;
    excerpt: string | null;
    media_type: 'notice' | 'press_release' | 'album' | 'newsletter' | 'blog';
    author: string | null;
    published_at: string;
    image: string | null;
    pdf_file: string | null;
    gallery: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface MediaPostsProps {
    mediaPosts: MediaPost[];
}

const mediaTypes = [
    { value: 'notice', label: 'Notice' },
    { value: 'press_release', label: 'Press Release' },
    { value: 'album', label: 'Photo Album' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'blog', label: 'Blog Post' },
];

const mediaSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    excerpt: z.string().optional().nullable().or(z.literal('')),
    media_type: z.enum(['notice', 'press_release', 'album', 'newsletter', 'blog']),
    author: z.string().optional().nullable().or(z.literal('')),
    published_at: z.string().min(1, 'Published date is required'),
    sort_order: z.string().optional(),
    image: z.any().optional(),
    pdf_file: z.any().optional(),
    gallery: z.any().optional(),
});

type MediaFormData = z.infer<typeof mediaSchema>;

export default function MediaManagement({ mediaPosts }: MediaPostsProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaPost | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);

    const form = useForm<MediaFormData>({
        resolver: zodResolver(mediaSchema),
        defaultValues: {
            title: '',
            content: '',
            excerpt: '',
            media_type: 'notice',
            author: '',
            published_at: new Date().toISOString().split('T')[0],
            sort_order: '0',
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPdfPreview(file.name);
        }
    };

    const handleCreate = () => {
        setSelectedMedia(null);
        setImagePreview(null);
        setPdfPreview(null);
        form.reset({
            title: '',
            content: '',
            excerpt: '',
            media_type: 'notice',
            author: '',
            published_at: new Date().toISOString().split('T')[0],
            sort_order: '0',
        });
        setIsCreateOpen(true);
    };

    const handleEdit = (media: MediaPost) => {
        setSelectedMedia(media);
        setImagePreview(media.image ? `/storage/${media.image}` : null);
        setPdfPreview(media.pdf_file || null);
        form.reset({
            title: media.title,
            content: media.content,
            excerpt: media.excerpt || '',
            media_type: media.media_type,
            author: media.author || '',
            published_at: media.published_at.split('T')[0],
            sort_order: media.sort_order.toString(),
        });
        setIsEditOpen(true);
    };

    const handleDelete = (media: MediaPost) => {
        setSelectedMedia(media);
        setIsDeleteOpen(true);
    };

    const onSubmit = (data: MediaFormData) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('excerpt', data.excerpt || '');
        formData.append('media_type', data.media_type);
        formData.append('author', data.author || '');
        formData.append('published_at', data.published_at);
        formData.append('sort_order', data.sort_order || '0');

        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }

        if (data.pdf_file && data.pdf_file[0]) {
            formData.append('pdf_file', data.pdf_file[0]);
        }

        if (data.gallery && data.gallery.length > 0) {
            Array.from(data.gallery).forEach((file: any) => {
                formData.append('gallery[]', file);
            });
        }

        if (selectedMedia) {
            formData.append('_method', 'PUT');
            router.post(`/admin/media/${selectedMedia.id}`, formData, {
                onSuccess: () => {
                    toast.success('Media post updated successfully');
                    setIsEditOpen(false);
                    form.reset();
                },
                onError: () => {
                    toast.error('Failed to update media post');
                },
            });
        } else {
            router.post('/admin/media', formData, {
                onSuccess: () => {
                    toast.success('Media post created successfully');
                    setIsCreateOpen(false);
                    form.reset();
                },
                onError: () => {
                    toast.error('Failed to create media post');
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!selectedMedia) return;

        router.delete(`/admin/media/${selectedMedia.id}`, {
            onSuccess: () => {
                toast.success('Media post deleted successfully');
                setIsDeleteOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete media post');
            },
        });
    };

    const getMediaTypeBadge = (type: string) => {
        const colors = {
            notice: 'bg-blue-100 text-blue-800',
            press_release: 'bg-green-100 text-green-800',
            album: 'bg-purple-100 text-purple-800',
            newsletter: 'bg-orange-100 text-orange-800',
            blog: 'bg-pink-100 text-pink-800',
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getMediaTypeLabel = (type: string) => {
        const labels = {
            notice: 'Notice',
            press_release: 'Press Release',
            album: 'Photo Album',
            newsletter: 'Newsletter',
            blog: 'Blog Post',
        };
        return labels[type as keyof typeof labels] || type;
    };

    const MediaFormFields = ({ isEditing = false }: { isEditing?: boolean }) => {
        const mediaType = form.watch('media_type');

        return (
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        {...form.register('title')}
                        placeholder="Enter media title"
                    />
                    {form.formState.errors.title && (
                        <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="media_type">Media Type *</Label>
                    <Select
                        value={form.watch('media_type')}
                        onValueChange={(value) => form.setValue('media_type', value as any)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                        </SelectTrigger>
                        <SelectContent>
                            {mediaTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.media_type && (
                        <p className="text-sm text-red-500">{form.formState.errors.media_type.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                        id="content"
                        {...form.register('content')}
                        placeholder="Enter media content"
                        rows={5}
                    />
                    {form.formState.errors.content && (
                        <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                        id="excerpt"
                        {...form.register('excerpt')}
                        placeholder="Enter short excerpt"
                        rows={2}
                    />
                </div>

                {(mediaType === 'blog' || mediaType === 'press_release') && (
                    <div className="grid gap-2">
                        <Label htmlFor="author">Author</Label>
                        <Input
                            id="author"
                            {...form.register('author')}
                            placeholder="Enter author name"
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="published_at">Published Date *</Label>
                        <Input
                            id="published_at"
                            type="date"
                            {...form.register('published_at')}
                        />
                        {form.formState.errors.published_at && (
                            <p className="text-sm text-red-500">{form.formState.errors.published_at.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sort_order">Sort Order</Label>
                        <Input
                            id="sort_order"
                            type="number"
                            {...form.register('sort_order')}
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="image">
                        {mediaType === 'album' ? 'Album Cover Image' : 'Featured Image'}
                    </Label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        {...form.register('image')}
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 h-32 w-32 rounded-lg object-cover"
                        />
                    )}
                </div>

                {mediaType === 'newsletter' && (
                    <div className="grid gap-2">
                        <Label htmlFor="pdf_file">PDF File</Label>
                        <Input
                            id="pdf_file"
                            type="file"
                            accept="application/pdf"
                            {...form.register('pdf_file')}
                            onChange={handlePdfChange}
                        />
                        {pdfPreview && (
                            <div className="mt-2 flex items-center gap-2 rounded-lg bg-gray-100 p-2">
                                <FileText className="h-5 w-5 text-red-500" />
                                <span className="text-sm">{pdfPreview}</span>
                            </div>
                        )}
                    </div>
                )}

                {mediaType === 'album' && (
                    <div className="grid gap-2">
                        <Label htmlFor="gallery">Gallery Images (Multiple)</Label>
                        <Input
                            id="gallery"
                            type="file"
                            accept="image/*"
                            multiple
                            {...form.register('gallery')}
                        />
                        <p className="text-xs text-gray-500">
                            You can select multiple images for the album gallery
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title="Media Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Media Management</h1>
                        <p className="mt-1 text-gray-500">
                            Manage notices, press releases, photo albums, newsletters, and blog posts
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Media Post
                    </Button>
                </div>

                <div className="rounded-lg border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Media Type</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Published Date</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mediaPosts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-500">
                                        No media posts found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                mediaPosts.map((media) => (
                                    <TableRow key={media.id}>
                                        <TableCell>
                                            {media.image ? (
                                                <img
                                                    src={`/storage/${media.image}`}
                                                    alt={media.title}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {media.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getMediaTypeBadge(media.media_type)}>
                                                {getMediaTypeLabel(media.media_type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {media.author || (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(media.published_at).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>{media.sort_order}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(media)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(media)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add New Media Post</DialogTitle>
                        <DialogDescription>
                            Create a new media post. Fill in all required fields.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <MediaFormFields />
                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Create Media Post</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Media Post</DialogTitle>
                        <DialogDescription>
                            Update the media post information below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <MediaFormFields isEditing />
                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Update Media Post</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{selectedMedia?.title}".
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
