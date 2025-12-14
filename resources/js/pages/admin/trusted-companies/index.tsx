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
    Building2,
    ExternalLink,
    Image as ImageIcon,
} from 'lucide-react';

import AdminPageLayout from '@/layouts/admin-page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

// Types
interface TrustedCompany {
    id: number;
    name: string;
    logo: string | null;
    logo_url: string | null;
    website: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    companies: TrustedCompany[];
}

// Helper to get the logo URL from a company
const getCompanyLogo = (company: TrustedCompany): string | null => {
    if (company.logo) {
        return `/storage/${company.logo}`;
    }
    if (company.logo_url) {
        return company.logo_url;
    }
    return null;
};

// Form Schema
const companySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    logo: z.any().optional(),
    website: z.string().url().nullable().optional().or(z.literal('')),
    is_active: z.boolean().default(true),
    sort_order: z.coerce.number().min(0).default(0),
});

type CompanyFormValues = {
    name: string;
    logo?: any;
    website?: string | null;
    is_active: boolean;
    sort_order: number;
};

export default function TrustedCompaniesIndex({ companies }: Props) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<TrustedCompany | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const addFileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema) as any,
        defaultValues: {
            name: '',
            website: '',
            is_active: true,
            sort_order: 0,
        },
    });

    const openAddDialog = () => {
        form.reset({
            name: '',
            website: '',
            is_active: true,
            sort_order: companies.length,
        });
        setImagePreview(null);
        setIsAddDialogOpen(true);
    };

    const openEditDialog = (company: TrustedCompany) => {
        setSelectedCompany(company);
        form.reset({
            name: company.name,
            website: company.website || '',
            is_active: company.is_active,
            sort_order: company.sort_order,
        });
        setEditImagePreview(null);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (company: TrustedCompany) => {
        setSelectedCompany(company);
        setIsDeleteDialogOpen(true);
    };

    const handleCreate = (values: CompanyFormValues) => {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', values.name);
        if (values.website) formData.append('website', values.website);
        formData.append('is_active', values.is_active ? '1' : '0');
        formData.append('sort_order', values.sort_order.toString());

        if (values.logo instanceof File) {
            formData.append('logo', values.logo);
        }

        router.post('/admin/trusted-companies', formData, {
            onSuccess: () => {
                toast.success('Company added successfully');
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

    const handleUpdate = (values: CompanyFormValues) => {
        if (!selectedCompany) return;
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', values.name);
        if (values.website) formData.append('website', values.website);
        formData.append('is_active', values.is_active ? '1' : '0');
        formData.append('sort_order', values.sort_order.toString());

        if (values.logo instanceof File) {
            formData.append('logo', values.logo);
        }

        router.post(`/admin/trusted-companies/${selectedCompany.id}`, formData, {
            onSuccess: () => {
                toast.success('Company updated successfully');
                setIsEditDialogOpen(false);
                setSelectedCompany(null);
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
        if (!selectedCompany) return;
        setIsSubmitting(true);

        router.delete(`/admin/trusted-companies/${selectedCompany.id}`, {
            onSuccess: () => {
                toast.success('Company removed successfully');
                setIsDeleteDialogOpen(false);
                setSelectedCompany(null);
            },
            onError: () => {
                toast.error('Failed to remove company');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const activeCompanies = companies.filter(c => c.is_active).length;

    return (
        <AdminPageLayout>
            <Head title="Trusted Companies Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Trusted Companies</h1>
                        <p className="text-muted-foreground">
                            Manage the partner logos displayed on your homepage.
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Company
                    </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid gap-4 md:grid-cols-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{companies.length}</div>
                            <p className="text-xs text-muted-foreground">
                                All trusted partners
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Logos</CardTitle>
                            <Badge variant="default" className="text-xs">Active</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeCompanies}</div>
                            <p className="text-xs text-muted-foreground">
                                Visible on homepage
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Companies Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>All Companies</CardTitle>
                            <CardDescription>
                                Partner and trusted company logos displayed on your store.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {companies.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Building2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>No companies added yet. Add your first partner!</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                                    {companies
                                        .sort((a, b) => a.sort_order - b.sort_order)
                                        .map((company, index) => (
                                            <motion.div
                                                key={company.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.2, delay: index * 0.03 }}
                                                className="group relative rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
                                            >
                                                {/* Status Badge */}
                                                <div className="absolute top-2 right-2 z-10">
                                                    <Badge variant={company.is_active ? 'default' : 'secondary'} className="text-xs">
                                                        {company.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>

                                                {/* Logo */}
                                                <div className="aspect-[3/2] relative rounded bg-muted/50 flex items-center justify-center overflow-hidden mb-3">
                                                    {getCompanyLogo(company) ? (
                                                        <img
                                                            src={getCompanyLogo(company)!}
                                                            alt={company.name}
                                                            className="max-h-full max-w-full object-contain p-2"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                                    )}
                                                </div>

                                                {/* Name */}
                                                <h3 className="font-medium text-sm truncate">{company.name}</h3>

                                                {/* Website Link */}
                                                {company.website && (
                                                    <a
                                                        href={company.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-1"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                        Website
                                                    </a>
                                                )}

                                                {/* Order */}
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Order: {company.sort_order}
                                                </p>

                                                {/* Actions */}
                                                <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        onClick={() => openEditDialog(company)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => openDeleteDialog(company)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Preview Section */}
                {companies.filter(c => c.is_active).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Homepage Preview</CardTitle>
                                <CardDescription>
                                    This is how your trusted companies section will appear.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/30 rounded-lg p-8">
                                    <p className="text-center text-sm text-muted-foreground mb-6">
                                        Trusted by leading brands
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center gap-8">
                                        {companies
                                            .filter(c => c.is_active)
                                            .sort((a, b) => a.sort_order - b.sort_order)
                                            .map((company) => (
                                                <div
                                                    key={company.id}
                                                    className="h-12 w-32 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
                                                >
                                                    {getCompanyLogo(company) ? (
                                                        <img
                                                            src={getCompanyLogo(company)!}
                                                            alt={company.name}
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    ) : (
                                                        <span className="font-semibold text-muted-foreground">
                                                            {company.name}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

            {/* Add Company Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Trusted Company</DialogTitle>
                        <DialogDescription>
                            Add a new company logo to your homepage.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Apple Inc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="logo"
                                render={({ field: { onChange, value, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Logo *</FormLabel>
                                        <FormControl>
                                            <Input
                                                ref={addFileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    onChange(file);
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            setImagePreview(e.target?.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setImagePreview(null);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        {imagePreview && (
                                            <div className="flex justify-center p-4 bg-muted/50 rounded-lg mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-h-20 object-contain"
                                                />
                                            </div>
                                        )}
                                        <FormDescription>
                                            Recommended: PNG with transparent background
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://example.com"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" placeholder="0" {...field} />
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
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Adding...' : 'Add Company'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit Company Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Company</DialogTitle>
                        <DialogDescription>
                            Update the company details.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                            {(editImagePreview || (selectedCompany && getCompanyLogo(selectedCompany))) && (
                                <div className="flex justify-center p-4 bg-muted/50 rounded-lg">
                                    <img
                                        src={editImagePreview || getCompanyLogo(selectedCompany)!}
                                        alt={selectedCompany?.name || 'Preview'}
                                        className="max-h-20 object-contain"
                                    />
                                </div>
                            )}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Apple Inc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="logo"
                                render={({ field: { onChange, value, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>New Logo</FormLabel>
                                        <FormControl>
                                            <Input
                                                ref={editFileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    onChange(file);
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            setEditImagePreview(e.target?.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setEditImagePreview(null);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Leave empty to keep current logo
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://example.com"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" placeholder="0" {...field} />
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
                            </div>
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Company</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove "{selectedCompany?.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Removing...' : 'Remove'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminPageLayout>
    );
}
