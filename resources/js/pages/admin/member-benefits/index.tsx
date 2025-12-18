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

interface MemberBenefit {
    id: number;
    category: string;
    title: string;
    description: string;
    icon: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface MemberBenefitsProps {
    memberBenefits: MemberBenefit[];
}

const benefitCategories = [
    { value: 'networking', label: 'Networking' },
    { value: 'business', label: 'Business Development' },
    { value: 'knowledge', label: 'Knowledge & Learning' },
    { value: 'advocacy', label: 'Advocacy & Support' },
    { value: 'recognition', label: 'Recognition & Awards' },
    { value: 'resources', label: 'Resources & Tools' },
    { value: 'events', label: 'Events & Programs' },
    { value: 'other', label: 'Other Benefits' },
];

const benefitSchema = z.object({
    category: z.string().min(1, 'Category is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    icon: z.string().optional().nullable().or(z.literal('')),
    sort_order: z.string().optional(),
});

type BenefitFormData = z.infer<typeof benefitSchema>;

export default function MemberBenefitsManagement({ memberBenefits }: MemberBenefitsProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedBenefit, setSelectedBenefit] = useState<MemberBenefit | null>(null);

    const form = useForm<BenefitFormData>({
        resolver: zodResolver(benefitSchema),
        defaultValues: {
            category: '',
            title: '',
            description: '',
            icon: '',
            sort_order: '0',
        },
    });

    const handleCreate = () => {
        setSelectedBenefit(null);
        form.reset({
            category: '',
            title: '',
            description: '',
            icon: '',
            sort_order: '0',
        });
        setIsCreateOpen(true);
    };

    const handleEdit = (benefit: MemberBenefit) => {
        setSelectedBenefit(benefit);
        form.reset({
            category: benefit.category,
            title: benefit.title,
            description: benefit.description,
            icon: benefit.icon || '',
            sort_order: benefit.sort_order.toString(),
        });
        setIsEditOpen(true);
    };

    const handleDelete = (benefit: MemberBenefit) => {
        setSelectedBenefit(benefit);
        setIsDeleteOpen(true);
    };

    const onSubmit = (data: BenefitFormData) => {
        const formData = new FormData();
        formData.append('category', data.category);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('icon', data.icon || '');
        formData.append('sort_order', data.sort_order || '0');

        if (selectedBenefit) {
            formData.append('_method', 'PUT');
            router.post(`/admin/member-benefits/${selectedBenefit.id}`, formData, {
                onSuccess: () => {
                    toast.success('Member benefit updated successfully');
                    setIsEditOpen(false);
                    form.reset();
                },
                onError: () => {
                    toast.error('Failed to update member benefit');
                },
            });
        } else {
            router.post('/admin/member-benefits', formData, {
                onSuccess: () => {
                    toast.success('Member benefit created successfully');
                    setIsCreateOpen(false);
                    form.reset();
                },
                onError: () => {
                    toast.error('Failed to create member benefit');
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!selectedBenefit) return;

        router.delete(`/admin/member-benefits/${selectedBenefit.id}`, {
            onSuccess: () => {
                toast.success('Member benefit deleted successfully');
                setIsDeleteOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete member benefit');
            },
        });
    };

    const getCategoryBadge = (category: string) => {
        const colors = {
            networking: 'bg-blue-100 text-blue-800',
            business: 'bg-green-100 text-green-800',
            knowledge: 'bg-purple-100 text-purple-800',
            advocacy: 'bg-orange-100 text-orange-800',
            recognition: 'bg-pink-100 text-pink-800',
            resources: 'bg-yellow-100 text-yellow-800',
            events: 'bg-indigo-100 text-indigo-800',
            other: 'bg-gray-100 text-gray-800',
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getCategoryLabel = (category: string) => {
        const found = benefitCategories.find((c) => c.value === category);
        return found ? found.label : category;
    };

    const BenefitFormFields = () => (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    {...form.register('title')}
                    placeholder="Enter benefit title"
                />
                {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                    value={form.watch('category')}
                    onValueChange={(value) => form.setValue('category', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {benefitCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {form.formState.errors.category && (
                    <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    {...form.register('description')}
                    placeholder="Enter benefit description"
                    rows={4}
                />
                {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="icon">Icon (Emoji or Text)</Label>
                    <Input
                        id="icon"
                        {...form.register('icon')}
                        placeholder="e.g., 🤝 or Icon name"
                        maxLength={50}
                    />
                    <p className="text-xs text-gray-500">
                        Enter an emoji or icon identifier
                    </p>
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
            <Head title="Member Benefits Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Member Benefits Management</h1>
                        <p className="mt-1 text-gray-500">
                            Manage the benefits and advantages offered to E-Club members
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Benefit
                    </Button>
                </div>

                <div className="rounded-lg border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Icon</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {memberBenefits.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-500">
                                        No member benefits found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                memberBenefits.map((benefit) => (
                                    <TableRow key={benefit.id}>
                                        <TableCell>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">
                                                {benefit.icon || '📋'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {benefit.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getCategoryBadge(benefit.category)}>
                                                {getCategoryLabel(benefit.category)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-md truncate text-sm text-gray-600">
                                                {benefit.description}
                                            </div>
                                        </TableCell>
                                        <TableCell>{benefit.sort_order}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(benefit)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(benefit)}
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Member Benefit</DialogTitle>
                        <DialogDescription>
                            Create a new member benefit. Fill in all required fields.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <BenefitFormFields />
                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Create Benefit</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Member Benefit</DialogTitle>
                        <DialogDescription>
                            Update the member benefit information below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <BenefitFormFields />
                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Update Benefit</Button>
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
                            This will permanently delete "{selectedBenefit?.title}".
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
