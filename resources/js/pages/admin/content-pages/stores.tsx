import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Plus,
    Save,
    Search,
    Pencil,
    Trash2,
    MapPin,
    Phone,
    Mail,
    Clock,
    Star,
    X,
    GripVertical,
} from 'lucide-react';

import AdminPageLayout from '@/layouts/admin-page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
interface StoreLocation {
    id: number;
    name: string;
    type: string;
    address: string;
    phone: string | null;
    email: string | null;
    hours: string | null;
    features: string[] | null;
    is_open: boolean;
    rating: number;
    map_url: string | null;
    city: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface PageContentRecord {
    id: number;
    page_slug: string;
    section_key: string;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    image: string | null;
    items: Record<string, unknown>[] | null;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    stores: StoreLocation[];
    content: Record<string, PageContentRecord>;
}

// Store Types
const storeTypes = [
    'Flagship Store',
    'Premium Store',
    'Standard Store',
    'Outlet Store',
    'Regional Store',
    'Express Store',
];

// Cities
const cities = [
    'Dhaka',
    'Chittagong',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barisal',
    'Rangpur',
    'Mymensingh',
];

// Common Features
const commonFeatures = [
    'Free Parking',
    'Design Consultation',
    'Delivery Service',
    'Financing Available',
    'VIP Lounge',
    'Interior Design Service',
    'Home Trial',
    'Premium Collections',
    'Exchange Policy',
    'Assembly Service',
    'Clearance Items',
    'Budget-Friendly',
    'Quick Delivery',
];

const defaultStoreServices = [
    { icon: 'check', title: 'Quality Guarantee', description: 'Inspect e-club quality in person before you buy' },
    { icon: 'users', title: 'Expert Staff', description: 'Get personalized recommendations from our team' },
    { icon: 'grid', title: 'Room Displays', description: 'See how e-club looks in real room settings' },
    { icon: 'dollar', title: 'Easy Financing', description: 'Flexible EMI options available at our stores' },
];

// Form Schema
const storeSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    type: z.string().min(1, 'Store type is required'),
    address: z.string().min(1, 'Address is required'),
    phone: z.string().max(50).nullable().optional(),
    email: z.string().email('Invalid email').max(255).nullable().optional().or(z.literal('')),
    hours: z.string().max(255).nullable().optional(),
    features: z.array(z.string()).optional(),
    is_open: z.boolean(),
    rating: z.number().min(0).max(5),
    map_url: z.string().url('Invalid URL').max(500).nullable().optional().or(z.literal('')),
    city: z.string().min(1, 'City is required'),
    is_active: z.boolean(),
    sort_order: z.number().min(0),
});

type StoreFormValues = z.infer<typeof storeSchema>;

const contentSchema = z.object({
    hero_title: z.string().min(1, 'Title is required'),
    hero_subtitle: z.string().optional(),
    locations_section_title: z.string().optional(),
    store_services: z.array(z.object({
        icon: z.string().optional(),
        title: z.string().min(1, 'Title is required'),
        description: z.string().optional(),
    })).optional(),
    cta_title: z.string().optional(),
    cta_subtitle: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

export default function StoresPage({ stores, content }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [cityFilter, setCityFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [customFeature, setCustomFeature] = useState('');
    const [activeTab, setActiveTab] = useState('locations');

    const form = useForm<StoreFormValues>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: '',
            type: 'Standard Store',
            address: '',
            phone: '',
            email: '',
            hours: 'Sat-Thu: 10AM - 8PM, Friday: Closed',
            features: [],
            is_open: true,
            rating: 4.5,
            map_url: '',
            city: 'Dhaka',
            is_active: true,
            sort_order: 0,
        },
    });

    const contentForm = useForm<ContentFormValues>({
        resolver: zodResolver(contentSchema),
        defaultValues: {
            hero_title: content.hero?.title || 'Find a Store Near You',
            hero_subtitle: content.hero?.subtitle || 'Visit one of our showrooms to experience our e-club in person. Our expert staff is ready to help you find the perfect pieces.',
            locations_section_title: content.locations_section?.title || 'All Locations',
            store_services: (content.store_services?.items as ContentFormValues['store_services']) || defaultStoreServices,
            cta_title: content.cta?.title || "Can't Visit a Store?",
            cta_subtitle: content.cta?.subtitle || 'Shop our entire collection online with nationwide delivery, or schedule a video consultation with our design experts.',
        },
    });

    const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
        control: contentForm.control,
        name: 'store_services',
    });

    // Filter stores
    const filteredStores = stores.filter((store) => {
        const matchesSearch =
            store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.city.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCity = cityFilter === 'all' || store.city === cityFilter;

        return matchesSearch && matchesCity;
    });

    const openAddDialog = () => {
        setSelectedStore(null);
        setSelectedFeatures([]);
        form.reset({
            name: '',
            type: 'Standard Store',
            address: '',
            phone: '',
            email: '',
            hours: 'Sat-Thu: 10AM - 8PM, Friday: Closed',
            features: [],
            is_open: true,
            rating: 4.5,
            map_url: '',
            city: 'Dhaka',
            is_active: true,
            sort_order: stores.length,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (store: StoreLocation) => {
        setSelectedStore(store);
        setSelectedFeatures(store.features || []);
        form.reset({
            name: store.name,
            type: store.type,
            address: store.address,
            phone: store.phone || '',
            email: store.email || '',
            hours: store.hours || '',
            features: store.features || [],
            is_open: store.is_open,
            rating: store.rating,
            map_url: store.map_url || '',
            city: store.city,
            is_active: store.is_active,
            sort_order: store.sort_order,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (data: StoreFormValues) => {
        setIsSubmitting(true);

        const formData = {
            ...data,
            features: selectedFeatures,
            email: data.email || null,
            map_url: data.map_url || null,
        };

        const url = selectedStore
            ? `/admin/content-pages/stores/${selectedStore.id}`
            : '/admin/content-pages/stores';

        router.post(url, selectedStore ? { ...formData, _method: 'PUT' } : formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(selectedStore ? 'Store updated successfully' : 'Store added successfully');
                setIsDialogOpen(false);
            },
            onError: (errors) => {
                toast.error('Failed to save store');
                console.error(errors);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleContentSubmit = (data: ContentFormValues) => {
        setIsSubmitting(true);
        router.post('/admin/content-pages/stores/content', data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Store page content saved');
                contentForm.reset(data);
            },
            onError: () => {
                toast.error('Failed to save store page content');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDelete = () => {
        if (!selectedStore) return;

        setIsSubmitting(true);
        router.delete(`/admin/content-pages/stores/${selectedStore.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Store deleted successfully');
                setIsDeleteDialogOpen(false);
                setSelectedStore(null);
            },
            onError: () => {
                toast.error('Failed to delete store');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const toggleFeature = (feature: string) => {
        setSelectedFeatures((prev) =>
            prev.includes(feature)
                ? prev.filter((f) => f !== feature)
                : [...prev, feature]
        );
    };

    const addCustomFeature = () => {
        if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
            setSelectedFeatures([...selectedFeatures, customFeature.trim()]);
            setCustomFeature('');
        }
    };

    return (
        <AdminPageLayout>
            <Head title="Store Locations - Admin" />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="w-fit">
                    <TabsTrigger value="locations">Locations</TabsTrigger>
                    <TabsTrigger value="content">Page Content</TabsTrigger>
                </TabsList>

                <TabsContent value="locations" className="space-y-6">
                    <div className="flex flex-1 flex-col gap-6 p-6">
                        {/* Page Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="text-3xl font-bold tracking-tight">Store Locations</h1>
                            <p className="text-muted-foreground">
                                Manage store locations shown on the Store Locator page
                            </p>
                        </motion.div>

                        {/* Filters */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search stores..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <Select value={cityFilter} onValueChange={setCityFilter}>
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Filter by city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Cities</SelectItem>
                                            {cities.map((city) => (
                                                <SelectItem key={city} value={city}>{city}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={openAddDialog}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Store
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stores Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Store Locations ({filteredStores.length})
                                </CardTitle>
                                <CardDescription>
                                    Manage store locations and their details
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Store</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>City</TableHead>
                                            <TableHead>Rating</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStores.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                    No stores found. Add your first store location.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredStores.map((store) => (
                                                <TableRow key={store.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{store.name}</p>
                                                            <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                                                                {store.address}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{store.type}</Badge>
                                                    </TableCell>
                                                    <TableCell>{store.city}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                            <span>{store.rating}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <Badge variant={store.is_active ? 'default' : 'secondary'}>
                                                                {store.is_active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                            {store.is_open ? (
                                                                <span className="text-xs text-green-600">Open</span>
                                                            ) : (
                                                                <span className="text-xs text-red-600">Closed</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEditDialog(store)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setSelectedStore(store);
                                                                    setIsDeleteDialogOpen(true);
                                                                }}
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
                            </CardContent>
                        </Card>
                    </div>

                </TabsContent>

                <TabsContent value="content">
                    <div className="flex flex-1 flex-col gap-6 p-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Store Page Content</CardTitle>
                                <CardDescription>Edit hero, services, and CTA shown on the public Store Locator page.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...contentForm}>
                                    <form onSubmit={contentForm.handleSubmit(handleContentSubmit)} className="space-y-6">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={contentForm.control}
                                                name="hero_title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Hero Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Find a Store Near You" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={contentForm.control}
                                                name="hero_subtitle"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Hero Subtitle</FormLabel>
                                                        <FormControl>
                                                            <Textarea rows={3} placeholder="Visit one of our showrooms..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={contentForm.control}
                                            name="locations_section_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Locations Section Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="All Locations" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <FormLabel>Store Services</FormLabel>
                                                    <FormDescription>These cards appear under "What to Expect at Our Stores"</FormDescription>
                                                </div>
                                                <Button type="button" variant="outline" onClick={() => appendService({ icon: 'check', title: '', description: '' })}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Service
                                                </Button>
                                            </div>

                                            {serviceFields.length === 0 && (
                                                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                                    <p className="text-muted-foreground mb-2">No services yet</p>
                                                    <Button type="button" variant="outline" onClick={() => appendService({ icon: 'check', title: '', description: '' })}>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add First Service
                                                    </Button>
                                                </div>
                                            )}

                                            {serviceFields.map((field: any, index: number) => (
                                                <motion.div
                                                    key={field.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="p-4 border rounded-lg space-y-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                            <span className="font-medium">Service {index + 1}</span>
                                                        </div>
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeService(index)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <FormField
                                                            control={contentForm.control}
                                                            name={`store_services.${index}.icon`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Icon</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="check" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={contentForm.control}
                                                            name={`store_services.${index}.title`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Title</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Quality Guarantee" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <FormField
                                                        control={contentForm.control}
                                                        name={`store_services.${index}.description`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Description</FormLabel>
                                                                <FormControl>
                                                                    <Textarea rows={3} placeholder="Describe this service" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={contentForm.control}
                                                name="cta_title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>CTA Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Can't Visit a Store?" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={contentForm.control}
                                                name="cta_subtitle"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>CTA Subtitle</FormLabel>
                                                        <FormControl>
                                                            <Textarea rows={3} placeholder="Shop our entire collection online..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={isSubmitting}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Page Content
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedStore ? 'Edit Store' : 'Add Store'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedStore
                                ? 'Update store location details'
                                : 'Add a new store location'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Store Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Dhanmondi Showroom" {...field} />
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
                                            <FormLabel>Store Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {storeTypes.map((type) => (
                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid gap-4 sm:grid-cols-2">




                                    <TabsContent value="content">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Store Page Content</CardTitle>
                                                <CardDescription>Edit hero, services, and CTA shown on the public Store Locator page.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Form {...contentForm}>
                                                    <form onSubmit={contentForm.handleSubmit(handleContentSubmit)} className="space-y-6">
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <FormField
                                                                control={contentForm.control}
                                                                name="hero_title"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Hero Title</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="Find a Store Near You" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={contentForm.control}
                                                                name="hero_subtitle"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Hero Subtitle</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea rows={3} placeholder="Visit one of our showrooms..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <FormField
                                                            control={contentForm.control}
                                                            name="locations_section_title"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Locations Section Title</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="All Locations" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <FormLabel>Store Services</FormLabel>
                                                                    <FormDescription>These cards appear under "What to Expect at Our Stores"</FormDescription>
                                                                </div>
                                                                <Button type="button" variant="outline" onClick={() => appendService({ icon: 'check', title: '', description: '' })}>
                                                                    <Plus className="h-4 w-4 mr-2" />
                                                                    Add Service
                                                                </Button>
                                                            </div>

                                                            {serviceFields.length === 0 && (
                                                                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                                                    <p className="text-muted-foreground mb-2">No services yet</p>
                                                                    <Button type="button" variant="outline" onClick={() => appendService({ icon: 'check', title: '', description: '' })}>
                                                                        <Plus className="h-4 w-4 mr-2" />
                                                                        Add First Service
                                                                    </Button>
                                                                </div>
                                                            )}

                                                            {serviceFields.map((field, index) => (
                                                                <motion.div
                                                                    key={field.id}
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    className="p-4 border rounded-lg space-y-4"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                                            <span className="font-medium">Service {index + 1}</span>
                                                                        </div>
                                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeService(index)}>
                                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                                        </Button>
                                                                    </div>
                                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                                        <FormField
                                                                            control={contentForm.control}
                                                                            name={`store_services.${index}.icon`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Icon</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input placeholder="check" {...field} />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={contentForm.control}
                                                                            name={`store_services.${index}.title`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Title</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input placeholder="Quality Guarantee" {...field} />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <FormField
                                                                        control={contentForm.control}
                                                                        name={`store_services.${index}.description`}
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>Description</FormLabel>
                                                                                <FormControl>
                                                                                    <Textarea rows={3} placeholder="Describe this service" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </motion.div>
                                                            ))}
                                                        </div>

                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <FormField
                                                                control={contentForm.control}
                                                                name="cta_title"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>CTA Title</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="Can't Visit a Store?" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={contentForm.control}
                                                                name="cta_subtitle"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>CTA Subtitle</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea rows={3} placeholder="Shop our entire collection online..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <div className="flex justify-end">
                                                            <Button type="submit" disabled={isSubmitting}>
                                                                <Save className="h-4 w-4 mr-2" />
                                                                Save Page Content
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <Input placeholder="Add custom feature" value={customFeature} onChange={(e) => setCustomFeature(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addCustomFeature();
                                            }
                                        }}
                                    />
                                    <Button type="button" variant="outline" onClick={addCustomFeature}>
                                        Add
                                    </Button>
                                </div>
                                {selectedFeatures.filter(f => !commonFeatures.includes(f)).length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedFeatures
                                            .filter(f => !commonFeatures.includes(f))
                                            .map((feature) => (
                                                <Badge key={feature} variant="default" className="gap-1">
                                                    {feature}
                                                    <X
                                                        className="h-3 w-3 cursor-pointer"
                                                        onClick={() => toggleFeature(feature)}
                                                    />
                                                </Badge>
                                            ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rating (0-5)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min={0}
                                                    max={5}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                                                    min={0}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="is_open"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                            <div className="space-y-0.5">
                                                <FormLabel>Currently Open</FormLabel>
                                                <FormDescription>
                                                    Is the store currently open for business?
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
                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                            <div className="space-y-0.5">
                                                <FormLabel>Active</FormLabel>
                                                <FormDescription>
                                                    Show this store on the website?
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
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : selectedStore ? 'Update Store' : 'Add Store'}
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
                        <AlertDialogTitle>Delete Store</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{selectedStore?.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminPageLayout>
    );
}
