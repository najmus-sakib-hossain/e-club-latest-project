import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Upload } from 'lucide-react';
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

interface Project {
    id: number;
    title: string;
    slug: string;
    short_description: string | null;
    description: string;
    image: string | null;
    category: string | null;
    status: string;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    project_lead: string | null;
    contact_email: string | null;
    website_url: string | null;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface ProjectsProps {
    projects: Project[];
}

const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    short_description: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    category: z.string().optional(),
    status: z.enum(['ongoing', 'completed', 'planned']),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    location: z.string().optional(),
    project_lead: z.string().optional(),
    contact_email: z.string().email().optional().or(z.literal('')),
    website_url: z.string().url().optional().or(z.literal('')),
    is_featured: z.boolean().optional(),
    is_active: z.boolean().optional(),
    sort_order: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectsManagement({ projects }: ProjectsProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            short_description: '',
            description: '',
            category: '',
            status: 'ongoing',
            start_date: '',
            end_date: '',
            location: '',
            project_lead: '',
            contact_email: '',
            website_url: '',
            is_featured: false,
            is_active: true,
            sort_order: '0',
        },
    });

    const handleCreate = () => {
        setSelectedProject(null);
        setImageFile(null);
        form.reset();
        setIsCreateOpen(true);
    };

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
        setImageFile(null);
        form.reset({
            title: project.title,
            short_description: project.short_description || '',
            description: project.description,
            category: project.category || '',
            status: project.status as any,
            start_date: project.start_date || '',
            end_date: project.end_date || '',
            location: project.location || '',
            project_lead: project.project_lead || '',
            contact_email: project.contact_email || '',
            website_url: project.website_url || '',
            is_featured: project.is_featured,
            is_active: project.is_active,
            sort_order: project.sort_order.toString(),
        });
        setIsEditOpen(true);
    };

    const handleDelete = (project: Project) => {
        setSelectedProject(project);
        setIsDeleteOpen(true);
    };

    const onSubmit = (data: ProjectFormData) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('short_description', data.short_description || '');
        formData.append('description', data.description);
        formData.append('category', data.category || '');
        formData.append('status', data.status);
        formData.append('start_date', data.start_date || '');
        formData.append('end_date', data.end_date || '');
        formData.append('location', data.location || '');
        formData.append('project_lead', data.project_lead || '');
        formData.append('contact_email', data.contact_email || '');
        formData.append('website_url', data.website_url || '');
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('sort_order', data.sort_order || '0');

        if (imageFile) {
            formData.append('image', imageFile);
        }

        if (selectedProject) {
            formData.append('_method', 'PUT');
            router.post(`/admin/projects/${selectedProject.id}`, formData, {
                onSuccess: () => {
                    toast.success('Project updated successfully');
                    setIsEditOpen(false);
                    form.reset();
                },
                onError: () => {
                    toast.error('Failed to update project');
                },
            });
        } else {
            router.post('/admin/projects', formData, {
                onSuccess: () => {
                    toast.success('Project created successfully');
                    setIsCreateOpen(false);
                    form.reset();
                },
                onError: () => {
                    toast.error('Failed to create project');
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!selectedProject) return;

        router.delete(`/admin/projects/${selectedProject.id}`, {
            onSuccess: () => {
                toast.success('Project deleted successfully');
                setIsDeleteOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete project');
            },
        });
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            ongoing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            planned: 'bg-yellow-100 text-yellow-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const ProjectFormFields = () => (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                    id="title"
                    {...form.register('title')}
                    placeholder="Enter project title"
                />
                {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        {...form.register('category')}
                        placeholder="e.g., Social Enterprise"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                        value={form.watch('status')}
                        onValueChange={(value) => form.setValue('status', value as any)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                    id="short_description"
                    {...form.register('short_description')}
                    placeholder="Brief description"
                    rows={2}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                    id="description"
                    {...form.register('description')}
                    placeholder="Detailed project description"
                    rows={4}
                />
                {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                        id="start_date"
                        type="date"
                        {...form.register('start_date')}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                        id="end_date"
                        type="date"
                        {...form.register('end_date')}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        {...form.register('location')}
                        placeholder="Project location"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="project_lead">Project Lead</Label>
                    <Input
                        id="project_lead"
                        {...form.register('project_lead')}
                        placeholder="Name of project lead"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                        id="contact_email"
                        type="email"
                        {...form.register('contact_email')}
                        placeholder="email@example.com"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                        id="website_url"
                        {...form.register('website_url')}
                        placeholder="https://example.com"
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="image">Project Image</Label>
                <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {selectedProject?.image && !imageFile && (
                    <img
                        src={`/storage/${selectedProject.image}`}
                        alt="Current"
                        className="mt-2 h-20 w-20 rounded object-cover"
                    />
                )}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="is_featured"
                        {...form.register('is_featured')}
                        className="rounded"
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        {...form.register('is_active')}
                        className="rounded"
                    />
                    <Label htmlFor="is_active">Active</Label>
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
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Projects Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
                        <p className="mt-1 text-gray-500">
                            Manage E-Club projects and initiatives
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                    </Button>
                </div>

                <div className="rounded-lg border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-500">
                                        No projects found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">
                                            {project.title}
                                        </TableCell>
                                        <TableCell>{project.category || '-'}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusBadge(project.status)}>
                                                {project.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {project.start_date || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {project.is_active ? (
                                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(project)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(project)}
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
                        <DialogTitle>Add New Project</DialogTitle>
                        <DialogDescription>
                            Create a new project. Fill in all required fields.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <ProjectFormFields />
                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Create Project</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>
                            Update the project information below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <ProjectFormFields />
                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Update Project</Button>
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
                            This will permanently delete "{selectedProject?.title}".
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
