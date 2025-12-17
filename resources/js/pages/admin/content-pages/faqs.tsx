import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronRight,
    CircleHelp,
    CreditCard,
    GripVertical,
    HelpCircle,
    Info,
    Package,
    Pencil,
    Plus,
    RefreshCw,
    Shield,
    Trash2,
    Truck,
    Wrench,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AdminPageLayout from '@/layouts/admin-page-layout';
import { toast } from 'sonner';

// Types
interface Faq {
    id: number;
    faq_category_id: number;
    question: string;
    answer: string;
    is_active: boolean;
    sort_order: number;
}

interface FaqCategory {
    id: number;
    name: string;
    icon: string | null;
    page_slug: string;
    is_active: boolean;
    sort_order: number;
    faqs: Faq[];
}

interface Props {
    categories: FaqCategory[];
}

// Icon options for FAQ categories (lucide icons)
const iconOptions = [
    { value: 'Package', label: 'Package', icon: Package },
    { value: 'Truck', label: 'Truck', icon: Truck },
    { value: 'CreditCard', label: 'Credit Card', icon: CreditCard },
    { value: 'Shield', label: 'Shield', icon: Shield },
    { value: 'RefreshCw', label: 'Returns', icon: RefreshCw },
    { value: 'Wrench', label: 'Wrench', icon: Wrench },
    { value: 'HelpCircle', label: 'Help', icon: HelpCircle },
    { value: 'Info', label: 'Info', icon: Info },
];

// Form Schemas
const categorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    icon: z.string().optional(),
    page_slug: z.string().min(1, 'Page is required'),
    is_active: z.boolean(),
    sort_order: z.number().min(0),
});

const faqSchema = z.object({
    faq_category_id: z.number().min(1, 'Category is required'),
    question: z.string().min(1, 'Question is required').max(500),
    answer: z.string().min(1, 'Answer is required'),
    is_active: z.boolean(),
    sort_order: z.number().min(0),
});

type CategoryFormValues = z.infer<typeof categorySchema>;
type FaqFormValues = z.infer<typeof faqSchema>;

export default function FaqsPage({ categories }: Props) {
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);
    const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] =
        useState(false);
    const [isDeleteFaqDialogOpen, setIsDeleteFaqDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<FaqCategory | null>(null);
    const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categoryForm = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            icon: 'HelpCircle',
            page_slug: 'faqs',
            is_active: true,
            sort_order: 0,
        },
    });

    const faqForm = useForm<FaqFormValues>({
        resolver: zodResolver(faqSchema),
        defaultValues: {
            faq_category_id: 0,
            question: '',
            answer: '',
            is_active: true,
            sort_order: 0,
        },
    });

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        );
    };

    // Category handlers
    const openAddCategoryDialog = () => {
        setSelectedCategory(null);
        categoryForm.reset({
            name: '',
            icon: 'HelpCircle',
            page_slug: 'faqs',
            is_active: true,
            sort_order: categories.length,
        });
        setIsCategoryDialogOpen(true);
    };

    const openEditCategoryDialog = (category: FaqCategory) => {
        setSelectedCategory(category);
        categoryForm.reset({
            name: category.name,
            icon: category.icon || 'HelpCircle',
            page_slug: category.page_slug,
            is_active: category.is_active,
            sort_order: category.sort_order,
        });
        setIsCategoryDialogOpen(true);
    };

    const handleCategorySubmit = (data: CategoryFormValues) => {
        setIsSubmitting(true);
        const url = selectedCategory
            ? `/admin/content-pages/faqs/categories/${selectedCategory.id}`
            : '/admin/content-pages/faqs/categories';

        router.post(
            url,
            selectedCategory ? { ...data, _method: 'PUT' } : data,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        selectedCategory
                            ? 'Category updated'
                            : 'Category created',
                    );
                    setIsCategoryDialogOpen(false);
                },
                onError: () => {
                    toast.error('Failed to save category');
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const handleDeleteCategory = () => {
        if (!selectedCategory) return;

        setIsSubmitting(true);
        router.delete(
            `/admin/content-pages/faqs/categories/${selectedCategory.id}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Category deleted');
                    setIsDeleteCategoryDialogOpen(false);
                    setSelectedCategory(null);
                },
                onError: () => {
                    toast.error('Failed to delete category');
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    // FAQ handlers
    const openAddFaqDialog = (categoryId?: number) => {
        setSelectedFaq(null);
        const maxSortOrder = categoryId
            ? Math.max(
                  0,
                  ...(categories
                      .find((c) => c.id === categoryId)
                      ?.faqs.map((f) => f.sort_order) || [0]),
              )
            : 0;
        faqForm.reset({
            faq_category_id: categoryId || categories[0]?.id || 0,
            question: '',
            answer: '',
            is_active: true,
            sort_order: maxSortOrder + 1,
        });
        setIsFaqDialogOpen(true);
    };

    const openEditFaqDialog = (faq: Faq) => {
        setSelectedFaq(faq);
        faqForm.reset({
            faq_category_id: faq.faq_category_id,
            question: faq.question,
            answer: faq.answer,
            is_active: faq.is_active,
            sort_order: faq.sort_order,
        });
        setIsFaqDialogOpen(true);
    };

    const handleFaqSubmit = (data: FaqFormValues) => {
        setIsSubmitting(true);
        const url = selectedFaq
            ? `/admin/content-pages/faqs/${selectedFaq.id}`
            : '/admin/content-pages/faqs';

        router.post(url, selectedFaq ? { ...data, _method: 'PUT' } : data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(selectedFaq ? 'FAQ updated' : 'FAQ created');
                setIsFaqDialogOpen(false);
            },
            onError: () => {
                toast.error('Failed to save FAQ');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDeleteFaq = () => {
        if (!selectedFaq) return;

        setIsSubmitting(true);
        router.delete(`/admin/content-pages/faqs/${selectedFaq.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('FAQ deleted');
                setIsDeleteFaqDialogOpen(false);
                setSelectedFaq(null);
            },
            onError: () => {
                toast.error('Failed to delete FAQ');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const getIconComponent = (icon: string | null) => {
        const option = iconOptions.find((o) => o.value === icon);
        return option?.icon || HelpCircle;
    };

    return (
        <AdminPageLayout>
            <Head title="FAQs - Admin" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            FAQs Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage FAQ categories and questions
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={openAddCategoryDialog}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                        <Button onClick={() => openAddFaqDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add FAQ
                        </Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {categories.length} categories,{' '}
                            {categories.reduce(
                                (acc, c) => acc + c.faqs.length,
                                0,
                            )}{' '}
                            FAQs
                        </p>
                    </div>
                </div>

                {/* Categories and FAQs */}
                {categories.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CircleHelp className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="mb-4 text-muted-foreground">
                                No FAQ categories yet.
                            </p>
                            <Button onClick={openAddCategoryDialog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add First Category
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {categories.map((category) => (
                            <Card key={category.id}>
                                <Collapsible
                                    open={expandedCategories.includes(
                                        category.id,
                                    )}
                                    onOpenChange={() =>
                                        toggleCategory(category.id)
                                    }
                                >
                                    <CardHeader className="py-4">
                                        <div className="flex items-center justify-between">
                                            <CollapsibleTrigger className="flex items-center gap-3 hover:opacity-80">
                                                {expandedCategories.includes(
                                                    category.id,
                                                ) ? (
                                                    <ChevronDown className="h-5 w-5" />
                                                ) : (
                                                    <ChevronRight className="h-5 w-5" />
                                                )}
                                                {(() => {
                                                    const IconComp =
                                                        getIconComponent(
                                                            category.icon,
                                                        );
                                                    return (
                                                        <IconComp className="h-6 w-6 text-primary" />
                                                    );
                                                })()}
                                                <div className="text-left">
                                                    <CardTitle className="text-lg">
                                                        {category.name}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {category.faqs.length}{' '}
                                                        questions
                                                    </CardDescription>
                                                </div>
                                            </CollapsibleTrigger>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        category.is_active
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {category.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {category.page_slug}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openAddFaqDialog(
                                                            category.id,
                                                        );
                                                    }}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditCategoryDialog(
                                                            category,
                                                        );
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCategory(
                                                            category,
                                                        );
                                                        setIsDeleteCategoryDialogOpen(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CollapsibleContent>
                                        <CardContent className="pt-0">
                                            {category.faqs.length === 0 ? (
                                                <div className="py-8 text-center text-muted-foreground">
                                                    <p className="mb-2">
                                                        No FAQs in this category
                                                        yet.
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            openAddFaqDialog(
                                                                category.id,
                                                            )
                                                        }
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add FAQ
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {category.faqs.map(
                                                        (faq) => (
                                                            <div
                                                                key={faq.id}
                                                                className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
                                                            >
                                                                <GripVertical className="mt-0.5 h-5 w-5 cursor-grab text-muted-foreground" />
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-sm font-medium">
                                                                        {
                                                                            faq.question
                                                                        }
                                                                    </p>
                                                                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                                        {
                                                                            faq.answer
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    {!faq.is_active && (
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="text-xs"
                                                                        >
                                                                            Inactive
                                                                        </Badge>
                                                                    )}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() =>
                                                                            openEditFaqDialog(
                                                                                faq,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => {
                                                                            setSelectedFaq(
                                                                                faq,
                                                                            );
                                                                            setIsDeleteFaqDialogOpen(
                                                                                true,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </CollapsibleContent>
                                </Collapsible>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Category Dialog */}
            <Dialog
                open={isCategoryDialogOpen}
                onOpenChange={setIsCategoryDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCategory
                                ? 'Edit Category'
                                : 'Add Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedCategory
                                ? 'Update FAQ category details'
                                : 'Create a new FAQ category'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...categoryForm}>
                        <form
                            onSubmit={categoryForm.handleSubmit(
                                handleCategorySubmit,
                            )}
                            className="space-y-4"
                        >
                            <FormField
                                control={categoryForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Orders & Shipping"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={categoryForm.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select icon" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {iconOptions.map((option) => {
                                                    const IconComp =
                                                        option.icon;
                                                    return (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <IconComp className="h-4 w-4" />
                                                                <span>
                                                                    {
                                                                        option.label
                                                                    }
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={categoryForm.control}
                                name="page_slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Page</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select page" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="faqs">
                                                    FAQs Page
                                                </SelectItem>
                                                <SelectItem value="help">
                                                    Help Center
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={categoryForm.control}
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 0,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={categoryForm.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="mt-1 flex flex-row items-center justify-between rounded-lg border p-3">
                                            <FormLabel className="text-sm font-normal">
                                                Active
                                            </FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setIsCategoryDialogOpen(false)
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Saving...'
                                        : selectedCategory
                                          ? 'Update'
                                          : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* FAQ Dialog */}
            <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedFaq ? 'Edit FAQ' : 'Add FAQ'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedFaq
                                ? 'Update frequently asked question'
                                : 'Add a new frequently asked question'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...faqForm}>
                        <form
                            onSubmit={faqForm.handleSubmit(handleFaqSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={faqForm.control}
                                name="faq_category_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(parseInt(value))
                                            }
                                            value={String(field.value)}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => {
                                                    const IconComp =
                                                        getIconComponent(
                                                            category.icon,
                                                        );
                                                    return (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={String(
                                                                category.id,
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <IconComp className="h-4 w-4" />
                                                                <span>
                                                                    {
                                                                        category.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={faqForm.control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="How do I track my order?"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={faqForm.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Answer</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter the answer to this question..."
                                                {...field}
                                                rows={4}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={faqForm.control}
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 0,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={faqForm.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="mt-1 flex flex-row items-center justify-between rounded-lg border p-3">
                                            <FormLabel className="text-sm font-normal">
                                                Active
                                            </FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsFaqDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Saving...'
                                        : selectedFaq
                                          ? 'Update'
                                          : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Category Dialog */}
            <AlertDialog
                open={isDeleteCategoryDialogOpen}
                onOpenChange={setIsDeleteCategoryDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "
                            {selectedCategory?.name}"? This will also delete all{' '}
                            {selectedCategory?.faqs.length || 0} FAQs in this
                            category. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCategory}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete FAQ Dialog */}
            <AlertDialog
                open={isDeleteFaqDialogOpen}
                onOpenChange={setIsDeleteFaqDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this FAQ? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteFaq}
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
