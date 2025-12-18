import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { router } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

interface Partnership {
    id: number;
    partner_name: string;
    logo: string | null;
    type: string;
    industry: string | null;
    website: string | null;
    contact_person: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    partnership_start_date: string | null;
    partnership_end_date: string | null;
    status: 'active' | 'inactive' | 'expired';
    description: string | null;
    benefits: string[] | null;
    joint_projects: string[] | null;
    created_at: string;
    updated_at: string;
}

interface PartnershipsPageProps {
    partnerships: Partnership[];
}

// Form validation schema
const partnershipSchema = z.object({
    partner_name: z.string().min(1, 'Partner name is required').max(255),
    logo: z.instanceof(File).optional().nullable(),
    type: z.enum(['corporate', 'academic', 'government', 'ngo'], { message: 'Type is required' }),
    industry: z.string().max(100).optional().nullable(),
    website: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
    contact_person: z.string().max(255).optional().nullable(),
    contact_email: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
    contact_phone: z.string().max(20).optional().nullable(),
    partnership_start_date: z.string().optional().nullable(),
    partnership_end_date: z.string().optional().nullable(),
    status: z.enum(['active', 'inactive', 'expired'], { message: 'Status is required' }).default('active'),
    description: z.string().optional().nullable(),
    benefits: z.string().optional().nullable(),
    joint_projects: z.string().optional().nullable(),
});

type PartnershipFormData = z.infer<typeof partnershipSchema>;

export default function PartnershipsPage({ partnerships }: PartnershipsPageProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const form = useForm<PartnershipFormData>({
        resolver: zodResolver(partnershipSchema),
        defaultValues: {
            partner_name: '',
            type: 'corporate',
            industry: '',
            website: '',
            contact_person: '',
            contact_email: '',
            contact_phone: '',
            partnership_start_date: '',
            partnership_end_date: '',
            status: 'active',
            description: '',
            benefits: '',
            joint_projects: '',
        },
    });

    const handleCreatePartnership = (data: PartnershipFormData) => {
        const formData = new FormData();
        formData.append('partner_name', data.partner_name);
        if (data.logo) {
            formData.append('logo', data.logo);
        }
        formData.append('type', data.type);
        if (data.industry) formData.append('industry', data.industry);
        if (data.website) formData.append('website', data.website);
        if (data.contact_person) formData.append('contact_person', data.contact_person);
        if (data.contact_email) formData.append('contact_email', data.contact_email);
        if (data.contact_phone) formData.append('contact_phone', data.contact_phone);
        if (data.partnership_start_date) formData.append('partnership_start_date', data.partnership_start_date);
        if (data.partnership_end_date) formData.append('partnership_end_date', data.partnership_end_date);
        formData.append('status', data.status);
        if (data.description) formData.append('description', data.description);
        if (data.benefits) formData.append('benefits', data.benefits);
        if (data.joint_projects) formData.append('joint_projects', data.joint_projects);

        router.post('/admin/partnerships', formData, {
            onSuccess: () => {
                toast.success('Partnership created successfully');
                setIsCreateDialogOpen(false);
                form.reset();
                setLogoPreview(null);
            },
            onError: (errors) => {
                console.error('Create errors:', errors);
                toast.error('Failed to create partnership');
            },
        });
    };

    const handleEditPartnership = (data: PartnershipFormData) => {
        if (!selectedPartnership) return;

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('partner_name', data.partner_name);
        if (data.logo) {
            formData.append('logo', data.logo);
        }
        formData.append('type', data.type);
        if (data.industry) formData.append('industry', data.industry);
        if (data.website) formData.append('website', data.website);
        if (data.contact_person) formData.append('contact_person', data.contact_person);
        if (data.contact_email) formData.append('contact_email', data.contact_email);
        if (data.contact_phone) formData.append('contact_phone', data.contact_phone);
        if (data.partnership_start_date) formData.append('partnership_start_date', data.partnership_start_date);
        if (data.partnership_end_date) formData.append('partnership_end_date', data.partnership_end_date);
        formData.append('status', data.status);
        if (data.description) formData.append('description', data.description);
        if (data.benefits) formData.append('benefits', data.benefits);
        if (data.joint_projects) formData.append('joint_projects', data.joint_projects);

        router.post(`/admin/partnerships/${selectedPartnership.id}`, formData, {
            onSuccess: () => {
                toast.success('Partnership updated successfully');
                setIsEditDialogOpen(false);
                setSelectedPartnership(null);
                form.reset();
                setLogoPreview(null);
            },
            onError: (errors) => {
                console.error('Update errors:', errors);
                toast.error('Failed to update partnership');
            },
        });
    };

    const handleDeletePartnership = () => {
        if (!selectedPartnership) return;

        router.delete(`/admin/partnerships/${selectedPartnership.id}`, {
            onSuccess: () => {
                toast.success('Partnership deleted successfully');
                setIsDeleteDialogOpen(false);
                setSelectedPartnership(null);
            },
            onError: () => {
                toast.error('Failed to delete partnership');
            },
        });
    };

    const openCreateDialog = () => {
        form.reset({
            partner_name: '',
            type: 'corporate',
            industry: '',
            website: '',
            contact_person: '',
            contact_email: '',
            contact_phone: '',
            partnership_start_date: '',
            partnership_end_date: '',
            status: 'active',
            description: '',
            benefits: '',
            joint_projects: '',
        });
        setLogoPreview(null);
        setIsCreateDialogOpen(true);
    };

    const openEditDialog = (partnership: Partnership) => {
        setSelectedPartnership(partnership);
        form.reset({
            partner_name: partnership.partner_name,
            type: partnership.type as 'corporate' | 'academic' | 'government' | 'ngo',
            industry: partnership.industry || '',
            website: partnership.website || '',
            contact_person: partnership.contact_person || '',
            contact_email: partnership.contact_email || '',
            contact_phone: partnership.contact_phone || '',
            partnership_start_date: partnership.partnership_start_date || '',
            partnership_end_date: partnership.partnership_end_date || '',
            status: partnership.status,
            description: partnership.description || '',
            benefits: partnership.benefits ? partnership.benefits.join('\n') : '',
            joint_projects: partnership.joint_projects ? partnership.joint_projects.join('\n') : '',
        });
        if (partnership.logo) {
            setLogoPreview(`/storage/${partnership.logo}`);
        }
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (partnership: Partnership) => {
        setSelectedPartnership(partnership);
        setIsDeleteDialogOpen(true);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        form.setValue('logo', null);
        setLogoPreview(null);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active':
                return 'default'; // Green
            case 'inactive':
                return 'secondary'; // Gray
            case 'expired':
                return 'destructive'; // Red
            default:
                return 'secondary';
        }
    };

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'corporate':
                return 'bg-blue-100 text-blue-800';
            case 'academic':
                return 'bg-purple-100 text-purple-800';
            case 'government':
                return 'bg-green-100 text-green-800';
            case 'ngo':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Partnerships</h1>
                        <p className="text-muted-foreground">
                            Manage partnership organizations and collaborations
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Partnership
                    </Button>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Logo</TableHead>
                                <TableHead>Partner Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Industry</TableHead>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {partnerships.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                                        No partnerships found. Create your first partnership to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                partnerships.map((partnership) => (
                                    <TableRow key={partnership.id}>
                                        <TableCell>
                                            {partnership.logo ? (
                                                <img
                                                    src={`/storage/${partnership.logo}`}
                                                    alt={partnership.partner_name}
                                                    className="w-12 h-12 object-contain rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                                    No Logo
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{partnership.partner_name}</TableCell>
                                        <TableCell>
                                            <Badge className={getTypeBadgeColor(partnership.type)}>
                                                {partnership.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{partnership.industry || '-'}</TableCell>
                                        <TableCell>{partnership.contact_person || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(partnership.status)}>
                                                {partnership.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {partnership.partnership_start_date
                                                ? new Date(partnership.partnership_start_date).toLocaleDateString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditDialog(partnership)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(partnership)}
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

                {/* Create Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Partnership</DialogTitle>
                            <DialogDescription>
                                Add a new partnership organization. Fill in all required fields.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleCreatePartnership)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="partner_name"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Partner Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter partner name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="corporate">Corporate</SelectItem>
                                                        <SelectItem value="academic">Academic</SelectItem>
                                                        <SelectItem value="government">Government</SelectItem>
                                                        <SelectItem value="ngo">NGO</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="industry"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Industry</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Technology, Finance" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Website</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="logo"
                                        render={({ field: { value, onChange, ...field } }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Logo</FormLabel>
                                                <FormControl>
                                                    <div className="space-y-2">
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleLogoChange}
                                                            {...field}
                                                        />
                                                        {logoPreview && (
                                                            <div className="relative inline-block">
                                                                <img
                                                                    src={logoPreview}
                                                                    alt="Logo preview"
                                                                    className="w-32 h-32 object-contain border rounded"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="absolute -top-2 -right-2"
                                                                    onClick={removeLogo}
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contact_person"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Person</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contact_email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="contact@example.com" type="email" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contact_phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Phone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+1234567890" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                        <SelectItem value="expired">Expired</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="partnership_start_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="partnership_end_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Brief description of the partnership..."
                                                        rows={3}
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
                                        name="benefits"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Benefits (one per line)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Access to resources&#10;Networking opportunities&#10;Joint programs"
                                                        rows={3}
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
                                        name="joint_projects"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Joint Projects (one per line)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Project A&#10;Project B&#10;Project C"
                                                        rows={3}
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsCreateDialogOpen(false);
                                            form.reset();
                                            setLogoPreview(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create Partnership</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Partnership</DialogTitle>
                            <DialogDescription>
                                Update partnership information. Modify any fields as needed.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleEditPartnership)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="partner_name"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Partner Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter partner name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="corporate">Corporate</SelectItem>
                                                        <SelectItem value="academic">Academic</SelectItem>
                                                        <SelectItem value="government">Government</SelectItem>
                                                        <SelectItem value="ngo">NGO</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="industry"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Industry</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Technology, Finance" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Website</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="logo"
                                        render={({ field: { value, onChange, ...field } }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Logo</FormLabel>
                                                <FormControl>
                                                    <div className="space-y-2">
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleLogoChange}
                                                            {...field}
                                                        />
                                                        {logoPreview && (
                                                            <div className="relative inline-block">
                                                                <img
                                                                    src={logoPreview}
                                                                    alt="Logo preview"
                                                                    className="w-32 h-32 object-contain border rounded"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="absolute -top-2 -right-2"
                                                                    onClick={removeLogo}
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contact_person"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Person</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contact_email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="contact@example.com" type="email" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contact_phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Phone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+1234567890" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                        <SelectItem value="expired">Expired</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="partnership_start_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="partnership_end_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Brief description of the partnership..."
                                                        rows={3}
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
                                        name="benefits"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Benefits (one per line)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Access to resources&#10;Networking opportunities&#10;Joint programs"
                                                        rows={3}
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
                                        name="joint_projects"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Joint Projects (one per line)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Project A&#10;Project B&#10;Project C"
                                                        rows={3}
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditDialogOpen(false);
                                            setSelectedPartnership(null);
                                            form.reset();
                                            setLogoPreview(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Update Partnership</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the partnership "{selectedPartnership?.partner_name}".
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setSelectedPartnership(null)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeletePartnership} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
