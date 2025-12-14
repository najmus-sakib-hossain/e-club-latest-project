import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Plus,
    Pencil,
    Trash2,
} from 'lucide-react';
import {
    Truck,
    ShieldCheck,
    RefreshCw,
    Headphones,
    Star,
    Leaf,
    Award,
    Clock,
    Gift,
    Heart,
    Zap,
    Package
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

// Types
interface FeatureCard {
    id: number;
    icon: string;
    title: string;
    description: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    features: FeatureCard[];
}

// Available icons mapping - matches the frontend feature-cards.tsx
const iconOptions = [
    { value: 'truck', label: 'Truck (Free Shipping)', Icon: Truck },
    { value: 'shield-check', label: 'Shield Check (Quality)', Icon: ShieldCheck },
    { value: 'refresh-cw', label: 'Refresh (Easy Returns)', Icon: RefreshCw },
    { value: 'headphones', label: 'Headphones (24/7 Support)', Icon: Headphones },
    { value: 'star', label: 'Star (Quality)', Icon: Star },
    { value: 'leaf', label: 'Leaf (Eco)', Icon: Leaf },
    { value: 'award', label: 'Award (Premium)', Icon: Award },
    { value: 'clock', label: 'Clock (Fast)', Icon: Clock },
    { value: 'gift', label: 'Gift (Free)', Icon: Gift },
    { value: 'heart', label: 'Heart (Love)', Icon: Heart },
    { value: 'zap', label: 'Zap (Fast)', Icon: Zap },
    { value: 'package', label: 'Package (Delivery)', Icon: Package },
];

const getIconComponent = (iconName: string) => {
    const found = iconOptions.find(opt => opt.value === iconName);
    return found ? found.Icon : Star;
};

// Form Schema
const featureSchema = z.object({
    icon: z.string().min(1, 'Icon is required'),
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().min(1, 'Description is required').max(255),
    is_active: z.boolean(),
    sort_order: z.coerce.number().min(0),
});

type FeatureFormValues = z.infer<typeof featureSchema>;

export default function FeaturesIndex({ features }: Props) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<FeatureCard | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FeatureFormValues>({
        resolver: zodResolver(featureSchema),
        defaultValues: {
            icon: '',
            title: '',
            description: '',
            is_active: true,
            sort_order: 0,
        },
    });

    const openAddDialog = () => {
        form.reset({
            icon: 'truck',
            title: '',
            description: '',
            is_active: true,
            sort_order: features.length,
        });
        setIsAddDialogOpen(true);
    };

    const openEditDialog = (feature: FeatureCard) => {
        setSelectedFeature(feature);
        form.reset({
            icon: feature.icon,
            title: feature.title,
            description: feature.description,
            is_active: feature.is_active,
            sort_order: feature.sort_order,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (feature: FeatureCard) => {
        setSelectedFeature(feature);
        setIsDeleteDialogOpen(true);
    };

    const handleCreate = (values: FeatureFormValues) => {
        setIsSubmitting(true);

        router.post('/admin/features', values, {
            onSuccess: () => {
                toast.success('Feature card created successfully');
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

    const handleUpdate = (values: FeatureFormValues) => {
        if (!selectedFeature) return;
        setIsSubmitting(true);

        router.put(`/admin/features/${selectedFeature.id}`, values, {
            onSuccess: () => {
                toast.success('Feature card updated successfully');
                setIsEditDialogOpen(false);
                setSelectedFeature(null);
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
        if (!selectedFeature) return;
        setIsSubmitting(true);

        router.delete(`/admin/features/${selectedFeature.id}`, {
            onSuccess: () => {
                toast.success('Feature card deleted successfully');
                setIsDeleteDialogOpen(false);
                setSelectedFeature(null);
            },
            onError: () => {
                toast.error('Failed to delete feature card');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const activeFeatures = features.filter(f => f.is_active).length;

    return (
        <AdminPageLayout>
            <Head title="Feature Cards Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Feature Cards</h1>
                        <p className="text-muted-foreground">
                            Manage the feature highlights displayed on your homepage.
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Feature
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
                            <CardTitle className="text-sm font-medium">Total Features</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{features.length}</div>
                            <p className="text-xs text-muted-foreground">
                                All feature cards
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Features</CardTitle>
                            <Badge variant="default" className="text-xs">Active</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeFeatures}</div>
                            <p className="text-xs text-muted-foreground">
                                Visible on homepage
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>All Feature Cards</CardTitle>
                            <CardDescription>
                                Feature highlights that appear on your homepage to build trust with customers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {features.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Star className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>No feature cards yet. Create your first feature!</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {features
                                        .sort((a, b) => a.sort_order - b.sort_order)
                                        .map((feature, index) => {
                                            const IconComponent = getIconComponent(feature.icon);
                                            return (
                                                <motion.div
                                                    key={feature.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                                    className="group relative rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
                                                >
                                                    {/* Status Badge */}
                                                    <div className="absolute top-2 right-2">
                                                        <Badge variant={feature.is_active ? 'default' : 'secondary'} className="text-xs">
                                                            {feature.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </div>

                                                    {/* Icon */}
                                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                                        <IconComponent className="h-6 w-6 text-primary" />
                                                    </div>

                                                    {/* Content */}
                                                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {feature.description}
                                                    </p>

                                                    {/* Order */}
                                                    <p className="text-xs text-muted-foreground mt-3">
                                                        Order: {feature.sort_order}
                                                    </p>

                                                    {/* Actions */}
                                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => openEditDialog(feature)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => openDeleteDialog(feature)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Preview Section */}
                {features.filter(f => f.is_active).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Homepage Preview</CardTitle>
                                <CardDescription>
                                    This is how your feature cards will appear on the homepage.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/30 rounded-lg p-8">
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        {features
                                            .filter(f => f.is_active)
                                            .sort((a, b) => a.sort_order - b.sort_order)
                                            .map((feature) => {
                                                const IconComponent = getIconComponent(feature.icon);
                                                return (
                                                    <div
                                                        key={feature.id}
                                                        className="flex flex-col items-center text-center p-4"
                                                    >
                                                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                                            <IconComponent className="h-7 w-7 text-primary" />
                                                        </div>
                                                        <h4 className="font-semibold">{feature.title}</h4>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {feature.description}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

            {/* Add Feature Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Feature</DialogTitle>
                        <DialogDescription>
                            Create a new feature card for your homepage.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an icon" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {iconOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            <option.Icon className="h-4 w-4" />
                                                            {option.label}
                                                        </div>
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
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Free Shipping" {...field} />
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
                                                placeholder="e.g., Free shipping on orders over $500"
                                                {...field}
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
                                    {isSubmitting ? 'Creating...' : 'Create Feature'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit Feature Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Feature</DialogTitle>
                        <DialogDescription>
                            Update the feature card details.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an icon" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {iconOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            <option.Icon className="h-4 w-4" />
                                                            {option.label}
                                                        </div>
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
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Free Shipping" {...field} />
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
                                                placeholder="e.g., Free shipping on orders over $500"
                                                {...field}
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
                        <AlertDialogTitle>Delete Feature Card</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{selectedFeature?.title}"? This action cannot be undone.
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
