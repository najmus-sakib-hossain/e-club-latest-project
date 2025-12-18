import AdminPageLayout from '@/layouts/admin-page-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const committeeSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    committee_type: z.string().min(1, 'Committee type is required'),
    role: z.string().min(1, 'Role is required'),
    designation: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    email: z.string().email().optional().nullable().or(z.literal('')),
    phone: z.string().optional().nullable(),
    linkedin: z.string().url().optional().nullable().or(z.literal('')),
    image: z.any().optional(),
    sort_order: z.number().min(0),
});

type CommitteeFormValues = z.infer<typeof committeeSchema>;

interface CommitteeMember {
    id: number;
    name: string;
    committee_type: string;
    role: string;
    designation: string | null;
    description: string | null;
    email: string | null;
    phone: string | null;
    linkedin: string | null;
    image: string | null;
    sort_order: number;
}

const committeeTypes = [
    { value: 'advisor', label: 'Advisor' },
    { value: 'governing_body', label: 'Governing Body' },
    { value: 'executive_body', label: 'Executive Body' },
    { value: 'founder', label: 'Founder' },
    { value: 'alumni', label: 'EC Alumni' },
    { value: 'forum', label: 'Forum' },
    { value: 'standing_committee', label: 'Standing Committee' },
    { value: 'project_director', label: 'Project Director' },
    { value: 'administrative', label: 'Administrative Team' },
];

export default function CommitteeManagement({ members }: { members: CommitteeMember[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<CommitteeFormValues>({
        resolver: zodResolver(committeeSchema),
        defaultValues: {
            name: '',
            committee_type: '',
            role: '',
            designation: '',
            description: '',
            email: '',
            phone: '',
            linkedin: '',
            sort_order: 0,
        },
    });

    const handleCreate = (values: CommitteeFormValues) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (key === 'image' && value instanceof FileList) {
                    formData.append(key, value[0]);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        router.post('/admin/committee', formData, {
            onSuccess: () => {
                toast.success('Committee member created successfully');
                setIsCreateOpen(false);
                form.reset();
                setImagePreview(null);
            },
            onError: () => {
                toast.error('Failed to create committee member');
            },
        });
    };

    const handleEdit = (member: CommitteeMember) => {
        setSelectedMember(member);
        form.reset({
            name: member.name,
            committee_type: member.committee_type,
            role: member.role,
            designation: member.designation || '',
            description: member.description || '',
            email: member.email || '',
            phone: member.phone || '',
            linkedin: member.linkedin || '',
            sort_order: member.sort_order,
        });
        setImagePreview(member.image);
        setIsEditOpen(true);
    };

    const handleUpdate = (values: CommitteeFormValues) => {
        if (!selectedMember) return;

        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (key === 'image' && value instanceof FileList) {
                    formData.append(key, value[0]);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        router.post(`/admin/committee/${selectedMember.id}`, formData, {
            onSuccess: () => {
                toast.success('Committee member updated successfully');
                setIsEditOpen(false);
                setSelectedMember(null);
                form.reset();
                setImagePreview(null);
            },
            onError: () => {
                toast.error('Failed to update committee member');
            },
        });
    };

    const handleDelete = () => {
        if (!selectedMember) return;

        router.delete(`/admin/committee/${selectedMember.id}`, {
            onSuccess: () => {
                toast.success('Committee member deleted successfully');
                setIsDeleteOpen(false);
                setSelectedMember(null);
            },
            onError: () => {
                toast.error('Failed to delete committee member');
            },
        });
    };

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

    return (
        <AdminPageLayout>
            <Head title="Committee Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Committee Management</h1>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Member
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Committee Type</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.length > 0 ? (
                                members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            {member.image && (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>
                                            {committeeTypes.find(t => t.value === member.committee_type)?.label}
                                        </TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell>{member.designation || '-'}</TableCell>
                                        <TableCell>{member.sort_order}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(member)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedMember(member);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">
                                        No committee members found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Create Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add Committee Member</DialogTitle>
                            <DialogDescription>Create a new committee member</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Name *</Label>
                                    <Input {...form.register('name')} />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="committee_type">Committee Type *</Label>
                                    <Select onValueChange={(value) => form.setValue('committee_type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {committeeTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.committee_type && (
                                        <p className="text-sm text-red-500">{form.formState.errors.committee_type.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="role">Role *</Label>
                                    <Input {...form.register('role')} />
                                    {form.formState.errors.role && (
                                        <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="designation">Designation</Label>
                                    <Input {...form.register('designation')} />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" {...form.register('email')} />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input {...form.register('phone')} />
                                </div>
                                <div>
                                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                                    <Input {...form.register('linkedin')} />
                                </div>
                                <div>
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input type="number" {...form.register('sort_order', { valueAsNumber: true })} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea {...form.register('description')} rows={3} />
                            </div>
                            <div>
                                <Label htmlFor="image">Image</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    {...form.register('image')}
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 rounded object-cover" />
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => {
                                    setIsCreateOpen(false);
                                    form.reset();
                                    setImagePreview(null);
                                }}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Committee Member</DialogTitle>
                            <DialogDescription>Update committee member information</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Name *</Label>
                                    <Input {...form.register('name')} />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="committee_type">Committee Type *</Label>
                                    <Select
                                        value={form.watch('committee_type')}
                                        onValueChange={(value) => form.setValue('committee_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {committeeTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.committee_type && (
                                        <p className="text-sm text-red-500">{form.formState.errors.committee_type.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="role">Role *</Label>
                                    <Input {...form.register('role')} />
                                    {form.formState.errors.role && (
                                        <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="designation">Designation</Label>
                                    <Input {...form.register('designation')} />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" {...form.register('email')} />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input {...form.register('phone')} />
                                </div>
                                <div>
                                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                                    <Input {...form.register('linkedin')} />
                                </div>
                                <div>
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input type="number" {...form.register('sort_order', { valueAsNumber: true })} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea {...form.register('description')} rows={3} />
                            </div>
                            <div>
                                <Label htmlFor="image">Image</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    {...form.register('image')}
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 rounded object-cover" />
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => {
                                    setIsEditOpen(false);
                                    setSelectedMember(null);
                                    form.reset();
                                    setImagePreview(null);
                                }}>
                                    Cancel
                                </Button>
                                <Button type="submit">Update</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Committee Member</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete {selectedMember?.name}? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {
                                setIsDeleteOpen(false);
                                setSelectedMember(null);
                            }}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
}
