import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, Upload, X, Mail, Linkedin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';
import { getImageUrl } from '@/lib/utils';

interface CommitteeMember {
    id: number;
    name: string;
    committee_type: string;
    role: string;
    designation: string;
    description: string;
    image: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface CommitteeMembersIndexProps {
    members: CommitteeMember[];
}

const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const committeeTypes = [
    { value: 'advisor', label: 'Advisor' },
    { value: 'governing_body', label: 'Governing Body' },
    { value: 'executive_body', label: 'Executive Body' },
    { value: 'founder', label: 'Founder' },
    { value: 'forum', label: 'Forum' },
    { value: 'standing_committee', label: 'Standing Committee' },
    { value: 'project_director', label: 'Project Director' },
    { value: 'administrative_team', label: 'Administrative Team' },
    { value: 'alumni', label: 'Alumni' },
];

const memberSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    committee_type: z.string().min(1, 'Committee type is required'),
    role: z.string().min(1, 'Role is required').max(255),
    designation: z.string().min(1, 'Designation is required').max(255),
    description: z.string().optional().nullable(),
    email: z.string().email('Invalid email').optional().nullable(),
    phone: z.string().optional().nullable(),
    linkedin: z.string().url('Invalid URL').optional().nullable(),
    is_active: z.boolean(),
    sort_order: z.number().int().min(0),
    image: z.any().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

export default function CommitteeMembersIndex({ members }: CommitteeMembersIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            name: '',
            committee_type: '',
            role: '',
            designation: '',
            description: '',
            email: '',
            phone: '',
            linkedin: '',
            is_active: true,
            sort_order: 0,
        } as MemberFormData,
    });

    const filteredMembers = members.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.designation.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || member.committee_type === filterType;
        return matchesSearch && matchesType;
    });

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        form.reset({
            name: '',
            committee_type: '',
            role: '',
            designation: '',
            description: '',
            email: '',
            phone: '',
            linkedin: '',
            is_active: true,
            sort_order: 0,
        });
        setImagePreview(null);
        setSelectedImage(null);
    };

    const handleCreate = async (data: MemberFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('committee_type', data.committee_type);
            formData.append('role', data.role);
            formData.append('designation', data.designation);
            if (data.description) formData.append('description', data.description);
            if (data.email) formData.append('email', data.email);
            if (data.phone) formData.append('phone', data.phone);
            if (data.linkedin) formData.append('linkedin', data.linkedin);
            formData.append('is_active', data.is_active ? '1' : '0');
            formData.append('sort_order', data.sort_order.toString());
            if (selectedImage) formData.append('image', selectedImage);

            router.post('/admin/committee-members', formData, {
                onSuccess: () => {
                    toast.success('Committee member created successfully');
                    setIsCreateOpen(false);
                    resetForm();
                },
                onError: (errors) => {
                    Object.entries(errors).forEach(([, message]) => {
                        toast.error(message as string);
                    });
                },
                onFinish: () => setIsSubmitting(false),
            });
        } catch (error) {
            toast.error('Failed to create committee member');
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data: MemberFormData) => {
        if (!selectedMember) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('name', data.name);
            formData.append('committee_type', data.committee_type);
            formData.append('role', data.role);
            formData.append('designation', data.designation);
            if (data.description) formData.append('description', data.description);
            if (data.email) formData.append('email', data.email);
            if (data.phone) formData.append('phone', data.phone);
            if (data.linkedin) formData.append('linkedin', data.linkedin);
            formData.append('is_active', data.is_active ? '1' : '0');
            formData.append('sort_order', data.sort_order.toString());
            if (selectedImage) formData.append('image', selectedImage);

            router.post(`/admin/committee-members/${selectedMember.id}`, formData, {
                onSuccess: () => {
                    toast.success('Committee member updated successfully');
                    setIsEditOpen(false);
                    resetForm();
                    setSelectedMember(null);
                },
                onError: (errors) => {
                    Object.entries(errors).forEach(([, message]) => {
                        toast.error(message as string);
                    });
                },
                onFinish: () => setIsSubmitting(false),
            });
        } catch (error) {
            toast.error('Failed to update committee member');
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        if (!selectedMember) return;
        setIsSubmitting(true);
        router.delete(`/admin/committee-members/${selectedMember.id}`, {
            onSuccess: () => {
                toast.success('Committee member deleted successfully');
                setIsDeleteOpen(false);
                setSelectedMember(null);
            },
            onError: () => {
                toast.error('Failed to delete committee member');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const openEditDialog = (member: CommitteeMember) => {
        setSelectedMember(member);
        form.reset({
            name: member.name,
            committee_type: member.committee_type,
            role: member.role,
            designation: member.designation,
            description: member.description || '',
            email: member.email || '',
            phone: member.phone || '',
            linkedin: member.linkedin || '',
            is_active: member.is_active,
            sort_order: member.sort_order,
        });
        setImagePreview(member.image ? getImageUrl(member.image) : null);
        setIsEditOpen(true);
    };

    const openDeleteDialog = (member: CommitteeMember) => {
        setSelectedMember(member);
        setIsDeleteOpen(true);
    };

    return (
        <AdminLayout>
            <Head title="Committee Members Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Committee Members</h1>
                        <p className="text-muted-foreground">
                            Manage committee members and their information
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Member
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, role, or designation..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {committeeTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Committee Type</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Designation</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Order</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center">
                                                No members found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredMembers.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={getImageUrl(member.image) || undefined}
                                                                alt={member.name}
                                                            />
                                                            <AvatarFallback>
                                                                {getInitials(member.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{member.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {committeeTypes.find(
                                                            (t) => t.value === member.committee_type,
                                                        )?.label || member.committee_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{member.role}</TableCell>
                                                <TableCell>{member.designation}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {member.email && (
                                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                        {member.phone && (
                                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                        {member.linkedin && (
                                                            <Linkedin className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={member.is_active ? 'default' : 'secondary'}
                                                    >
                                                        {member.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{member.sort_order}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditDialog(member)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDeleteDialog(member)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Add Committee Member</DialogTitle>
                        <DialogDescription>Create a new committee member profile</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Image</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {imagePreview && (
                                                        <div className="relative w-32 h-32">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute -top-2 -right-2 h-6 w-6"
                                                                onClick={() => {
                                                                    setImagePreview(null);
                                                                    setSelectedImage(null);
                                                                }}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        onChange={handleImageSelect}
                                                        className="hidden"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Choose Image
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter member name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="committee_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Committee Type *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select committee type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {committeeTypes.map((type) => (
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

                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., President, Vice President" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="designation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Designation *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., CEO at Company" />
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
                                                    {...field}
                                                    value={field.value || ''}
                                                    placeholder="Brief description"
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ''}
                                                        type="email"
                                                        placeholder="email@example.com"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ''}
                                                        placeholder="+880 1234567890"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="linkedin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LinkedIn URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ''}
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="sort_order"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sort Order</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Active Status</FormLabel>
                                                    <FormDescription>Make this member visible</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsCreateOpen(false);
                                            resetForm();
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Create Member'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog - Similar to Create */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Edit Committee Member</DialogTitle>
                        <DialogDescription>Update committee member information</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                                {/* Same form fields as Create Dialog */}
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Image</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {imagePreview && (
                                                        <div className="relative w-32 h-32">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute -top-2 -right-2 h-6 w-6"
                                                                onClick={() => {
                                                                    setImagePreview(null);
                                                                    setSelectedImage(null);
                                                                }}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        onChange={handleImageSelect}
                                                        className="hidden"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Choose Image
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter member name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="committee_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Committee Type *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select committee type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {committeeTypes.map((type) => (
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

                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., President, Vice President" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="designation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Designation *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., CEO at Company" />
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
                                                    {...field}
                                                    value={field.value || ''}
                                                    placeholder="Brief description"
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ''}
                                                        type="email"
                                                        placeholder="email@example.com"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ''}
                                                        placeholder="+880 1234567890"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="linkedin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LinkedIn URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ''}
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="sort_order"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sort Order</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Active Status</FormLabel>
                                                    <FormDescription>Make this member visible</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditOpen(false);
                                            resetForm();
                                            setSelectedMember(null);
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Updating...' : 'Update Member'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {selectedMember?.name}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
