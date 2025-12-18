import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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

interface Concern {
    id: number;
    title: string;
    slug: string;
    short_description: string | null;
    description: string;
    icon: string | null;
    category: string | null;
    status: string;
    priority: string;
    raised_date: string | null;
    contact_person: string | null;
    contact_email: string | null;
    proposed_solution: string | null;
    current_status_update: string | null;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface ConcernsProps {
    concerns: Concern[];
}

const concernSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    short_description: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    icon: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['active', 'resolved', 'ongoing']),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    raised_date: z.string().optional(),
    contact_person: z.string().optional(),
    contact_email: z.string().email().optional().or(z.literal('')),
    proposed_solution: z.string().optional(),
    current_status_update: z.string().optional(),
    is_featured: z.boolean().optional(),
    is_active: z.boolean().optional(),
    sort_order: z.string().optional(),
});

type ConcernFormData = z.infer<typeof concernSchema>;

export default function ConcernsManagement({ concerns }: ConcernsProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedConcern, setSelectedConcern] = useState<Concern | null>(null);

    const form = useForm<ConcernFormData>({
        resolver: zodResolver(concernSchema),
        defaultValues: {
            title: '',
            short_description: '',
            description: '',
            icon: '',
            category: '',
            status: 'active',
            priority: 'medium',
            raised_date: '',
            contact_person: '',
            contact_email: '',
            proposed_solution: '',
            current_status_update: '',
            is_featured: false,
            is_active: true,
            sort_order: '0',
        },
    });

    const handleCreate = () => {
        setSelectedConcern(null);
        form.reset();
        setIsCreateOpen(true);
    };

    const handleEdit = (concern: Concern) => {
        setSelectedConcern(concern);
        form.reset({
            title: concern.title,
            short_description: concern.short_description || '',
            description: concern.description,
            icon: concern.icon || '',
            category: concern.category || '',
            status: concern.status as any,
            priority: concern.priority as any,
            raised_date: concern.raised_date || '',
            contact_person: concern.contact_person || '',
            contact_email: concern.contact_email || '',
            proposed_solution: concern.proposed_solution || '',
            current_status_update: concern.current_status_update || '',
            is_featured: concern.is_featured,
            is_active: concern.is_active,
            sort_order: concern.sort_order.toString(),
        });
        setIsEditOpen(true);
    };

    const handleDelete = (concern: Concern) => {
        setSelectedConcern(concern);
        setIsDeleteOpen(true);
    };

    const onSubmit = (data: ConcernFormData) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : value.toString());
            }
        });

        if (selectedConcern) {
            formData.append('_method', 'PUT');
            router.post(`/admin/concerns/${selectedConcern.id}`, formData, {
                onSuccess: () => {
                    toast.success('Concern updated successfully');
                    setIsEditOpen(false);
                },
                onError: () => {
                    toast.error('Failed to update concern');
                },
            });
        } else {
            router.post('/admin/concerns', formData, {
                onSuccess: () => {
                    toast.success('Concern created successfully');
                    setIsCreateOpen(false);
                },
                onError: () => {
                    toast.error('Failed to create concern');
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!selectedConcern) return;

        router.delete(`/admin/concerns/${selectedConcern.id}`, {
            onSuccess: () => {
                toast.success('Concern deleted successfully');
                setIsDeleteOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete concern');
            },
        });
    };

    const getPriorityBadge = (priority: string) => {
        const colors = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-blue-100 text-blue-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800',
        };
        return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            active: 'bg-blue-100 text-blue-800',
            resolved: 'bg-green-100 text-green-800',
            ongoing: 'bg-yellow-100 text-yellow-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const ConcernFormFields = () => (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Concern Title *</Label>
                <Input id="title" {...form.register('title')} placeholder="Enter concern title" />
                {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                        value={form.watch('status')}
                        onValueChange={(value) => form.setValue('status', value as any)}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select
                        value={form.watch('priority')}
                        onValueChange={(value) => form.setValue('priority', value as any)}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" {...form.register('category')} placeholder="e.g., Policy" />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea id="short_description" {...form.register('short_description')} rows={2} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea id="description" {...form.register('description')} rows={4} />
                {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="proposed_solution">Proposed Solution</Label>
                    <Textarea id="proposed_solution" {...form.register('proposed_solution')} rows={3} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="current_status_update">Status Update</Label>
                    <Textarea id="current_status_update" {...form.register('current_status_update')} rows={3} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="raised_date">Raised Date</Label>
                    <Input id="raised_date" type="date" {...form.register('raised_date')} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input id="contact_person" {...form.register('contact_person')} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input id="contact_email" type="email" {...form.register('contact_email')} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="is_featured" {...form.register('is_featured')} className="rounded" />
                    <Label htmlFor="is_featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="is_active" {...form.register('is_active')} className="rounded" />
                    <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input id="sort_order" type="number" {...form.register('sort_order')} />
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Concerns Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Concerns Management</h1>
                        <p className="mt-1 text-gray-500">Manage E-Club concerns and advocacy issues</p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Concern
                    </Button>
                </div>

                <div className="rounded-lg border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Raised Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {concerns.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-500">
                                        No concerns found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                concerns.map((concern) => (
                                    <TableRow key={concern.id}>
                                        <TableCell className="font-medium">{concern.title}</TableCell>
                                        <TableCell>{concern.category || '-'}</TableCell>
                                        <TableCell>
                                            <Badge className={getPriorityBadge(concern.priority)}>
                                                {concern.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusBadge(concern.status)}>
                                                {concern.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{concern.raised_date || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(concern)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDelete(concern)}>
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

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add New Concern</DialogTitle>
                        <DialogDescription>Create a new concern. Fill in all required fields.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <ConcernFormFields />
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit">Create Concern</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Concern</DialogTitle>
                        <DialogDescription>Update the concern information below.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <ConcernFormFields />
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit">Update Concern</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{selectedConcern?.title}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
