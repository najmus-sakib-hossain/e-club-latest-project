import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head, router } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronRight,
    Eye,
    EyeOff,
    GripVertical,
    Menu,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Switch } from '@/components/ui/switch';
import AdminPageLayout from '@/layouts/admin-page-layout';
import { toast } from 'sonner';

interface NavigationItem {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    url: string | null;
    icon: string | null;
    type: 'main' | 'category' | 'subcategory' | 'item';
    location: string;
    is_active: boolean;
    open_in_new_tab: boolean;
    sort_order: number;
    children?: NavigationItem[];
}

interface Props {
    navigation: NavigationItem[];
}

interface FormData {
    [key: string]: any;
    parent_id: number | null;
    name: string;
    slug: string;
    url: string;
    icon: string;
    type: 'main' | 'category' | 'subcategory' | 'item';
    location: string;
    is_active: boolean;
    open_in_new_tab: boolean;
    sort_order: number;
}

const defaultFormData: FormData = {
    parent_id: null,
    name: '',
    slug: '',
    url: '',
    icon: '',
    type: 'main',
    location: 'primary',
    is_active: true,
    open_in_new_tab: false,
    sort_order: 0,
};

export default function NavigationSettings({ navigation }: Props) {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<NavigationItem | null>(
        null,
    );
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [navTree, setNavTree] = useState<NavigationItem[]>(navigation);
    const hasSeededRef = useRef(false);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 100, tolerance: 8 },
        }),
        useSensor(KeyboardSensor),
    );

    useEffect(() => {
        setNavTree(navigation);
    }, [navigation]);

    // Auto-seed default navigation when empty
    useEffect(() => {
        if (!hasSeededRef.current && navTree.length === 0) {
            hasSeededRef.current = true;
            seedDefaultNavigation();
        }
    }, [navTree]);

    const toggleExpand = (id: number) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };

    const expandAll = () => {
        const allIds = new Set<number>();
        const collectIds = (items: NavigationItem[]) => {
            items.forEach((item) => {
                if (item.children && item.children.length > 0) {
                    allIds.add(item.id);
                    collectIds(item.children);
                }
            });
        };
        collectIds(navTree);
        setExpandedItems(allIds);
    };

    const collapseAll = () => {
        setExpandedItems(new Set());
    };

    const openAddDialog = (
        parentId: number | null = null,
        type: FormData['type'] = 'main',
    ) => {
        setEditingItem(null);
        setFormData({
            ...defaultFormData,
            parent_id: parentId,
            type: type,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: NavigationItem) => {
        setEditingItem(item);
        setFormData({
            parent_id: item.parent_id,
            name: item.name,
            slug: item.slug || '',
            url: item.url || '',
            icon: item.icon || '',
            type: item.type,
            location: item.location,
            is_active: item.is_active,
            open_in_new_tab: item.open_in_new_tab,
            sort_order: item.sort_order,
        });
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (item: NavigationItem) => {
        setDeletingItem(item);
        setIsDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        setIsSubmitting(true);

        const url = editingItem
            ? `/admin/navigation/${editingItem.id}`
            : '/admin/navigation';

        const method = editingItem ? 'put' : 'post';

        router[method](url, formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    editingItem
                        ? 'Item updated successfully'
                        : 'Item created successfully',
                );
                setIsDialogOpen(false);
                setEditingItem(null);
                setFormData(defaultFormData);
            },
            onError: () => {
                toast.error('Failed to save item');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleDelete = () => {
        if (!deletingItem) return;

        router.delete(`/admin/navigation/${deletingItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Item deleted successfully');
                setIsDeleteDialogOpen(false);
                setDeletingItem(null);
            },
            onError: () => {
                toast.error('Failed to delete item');
            },
        });
    };

    const toggleActive = (item: NavigationItem) => {
        router.post(
            `/admin/navigation/${item.id}/toggle`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Item ${item.is_active ? 'deactivated' : 'activated'}`,
                    );
                },
                onError: () => {
                    toast.error('Failed to toggle status');
                },
            },
        );
    };

    const seedDefaultNavigation = () => {
        if (navTree.length > 0) {
            toast.error(
                'Navigation already has items. Please delete them first to seed defaults.',
            );
            return;
        }

        router.post(
            '/admin/navigation/bulk',
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Default navigation seeded successfully');
                },
                onError: () => {
                    toast.error('Failed to seed navigation');
                },
            },
        );
    };

    const persistOrder = (parentId: number | null, items: NavigationItem[]) => {
        router.post(
            '/admin/navigation/order',
            {
                items: items.map((item, index) => ({
                    id: item.id,
                    sort_order: index,
                    parent_id: parentId,
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Navigation order updated'),
                onError: () => toast.error('Failed to update navigation order'),
            },
        );
    };

    const updateTreeOrder = (
        items: NavigationItem[],
        parentId: number | null,
        reordered: NavigationItem[],
    ): NavigationItem[] => {
        if (parentId === null) {
            return reordered.map((item, index) => ({
                ...item,
                sort_order: index,
            }));
        }

        return items.map((item) => {
            if (item.id === parentId) {
                return {
                    ...item,
                    children: reordered.map((child, index) => ({
                        ...child,
                        sort_order: index,
                    })),
                };
            }

            if (item.children && item.children.length > 0) {
                return {
                    ...item,
                    children: updateTreeOrder(
                        item.children,
                        parentId,
                        reordered,
                    ),
                };
            }

            return item;
        });
    };

    const handleDragEnd =
        (parentId: number | null, items: NavigationItem[]) =>
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return;

            const reordered = arrayMove(items, oldIndex, newIndex);
            setNavTree((prev) => updateTreeOrder(prev, parentId, reordered));
            persistOrder(parentId, reordered);
        };

    const SortableNavItem = ({
        item,
        depth,
        children,
    }: {
        item: NavigationItem;
        depth: number;
        children?: React.ReactNode;
    }) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.has(item.id);
        const paddingLeft = depth * 24 + 16;
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({
            id: item.id,
        });
        const style = {
            transform: CSS.Translate.toString(transform),
            transition,
            opacity: isDragging ? 0.95 : 1,
        };

        return (
            <div ref={setNodeRef} style={style} className="bg-card">
                <div
                    className={`flex items-center gap-2 border-b px-4 py-2 hover:bg-muted/50 ${!item.is_active ? 'opacity-50' : ''}`}
                    style={{ paddingLeft: `${paddingLeft}px` }}
                >
                    <button
                        onClick={() => hasChildren && toggleExpand(item.id)}
                        className={`rounded p-1 hover:bg-muted ${hasChildren ? 'cursor-pointer' : 'cursor-default opacity-0'}`}
                        type="button"
                    >
                        {hasChildren &&
                            (isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            ))}
                    </button>

                    <span
                        className="text-muted-foreground"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className="h-5 w-5" />
                    </span>

                    <span className="flex-1 font-medium">{item.name}</span>

                    <Badge variant="outline" className="text-xs">
                        {item.type}
                    </Badge>

                    {item.url && (
                        <span className="max-w-[200px] truncate text-xs text-muted-foreground">
                            {item.url}
                        </span>
                    )}

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleActive(item)}
                            title={item.is_active ? 'Deactivate' : 'Activate'}
                        >
                            {item.is_active ? (
                                <Eye className="h-4 w-4" />
                            ) : (
                                <EyeOff className="h-4 w-4" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(item)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        {item.type === 'main' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                    openAddDialog(item.id, 'category')
                                }
                                title="Add Category"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        )}
                        {item.type === 'category' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openAddDialog(item.id, 'item')}
                                title="Add Item"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(item)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {hasChildren && isExpanded && children}
            </div>
        );
    };

    const renderNavigationList = (
        items: NavigationItem[],
        parentId: number | null = null,
        depth: number = 0,
    ) => {
        if (!items || items.length === 0) return null;

        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd(parentId, items)}
            >
                <SortableContext
                    items={items.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map((item) => (
                        <SortableNavItem
                            key={item.id}
                            item={item}
                            depth={depth}
                        >
                            {item.children && item.children.length > 0
                                ? renderNavigationList(
                                      item.children,
                                      item.id,
                                      depth + 1,
                                  )
                                : null}
                        </SortableNavItem>
                    ))}
                </SortableContext>
            </DndContext>
        );
    };

    return (
        <AdminPageLayout>
            <Head title="Navigation Menu" />

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
                            Navigation Menu
                        </h1>
                        <p className="text-muted-foreground">
                            Manage the main navigation structure (mega menu) for
                            your website header
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={expandAll}>
                            Expand All
                        </Button>
                        <Button variant="outline" onClick={collapseAll}>
                            Collapse All
                        </Button>
                        <Button onClick={() => openAddDialog(null, 'main')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Main Menu
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="space-y-6"
                >
                    {/* Info Alert */}
                    <Alert>
                        <Menu className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Structure:</strong> Main Menu → Categories →
                            Items. For example: "Tables & Desks" → "Family
                            Tables & Desks" → "Study Tables", "Dining Tables",
                            etc. Click the + button on a main menu to add
                            categories, or on a category to add items.
                        </AlertDescription>
                    </Alert>

                    {/* Navigation Tree */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Menu className="h-5 w-5" />
                                Navigation Structure
                            </CardTitle>
                            <CardDescription>
                                {navTree.length === 0
                                    ? 'No navigation items yet. Add your first main menu item or seed default navigation.'
                                    : `${navTree.length} main menu items`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {navTree.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Menu className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <h3 className="mb-2 text-lg font-medium">
                                        No Navigation Items
                                    </h3>
                                    <p className="mb-4 text-muted-foreground">
                                        Start by adding a main menu item or seed
                                        the default navigation structure.
                                    </p>
                                    <div className="flex items-center justify-center gap-4">
                                        <Button
                                            onClick={() =>
                                                openAddDialog(null, 'main')
                                            }
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Main Menu
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={seedDefaultNavigation}
                                        >
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Seed Default Navigation
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-t">
                                    {renderNavigationList(navTree)}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem
                                ? 'Edit Navigation Item'
                                : 'Add Navigation Item'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingItem
                                ? 'Update the navigation item details'
                                : `Add a new ${formData.type} item`}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="e.g., Tables & Desks"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        slug: e.target.value,
                                    })
                                }
                                placeholder="e.g., tables-desks (auto-generated if empty)"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                value={formData.url}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        url: e.target.value,
                                    })
                                }
                                placeholder="e.g., /products?category=study-tables"
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave empty to auto-generate based on slug:
                                /products?category={formData.slug || '{slug}'}
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value: FormData['type']) =>
                                    setFormData({ ...formData, type: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="main">
                                        Main Menu
                                    </SelectItem>
                                    <SelectItem value="category">
                                        Category
                                    </SelectItem>
                                    <SelectItem value="item">Item</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Active</Label>
                                <p className="text-xs text-muted-foreground">
                                    Show this item in the navigation
                                </p>
                            </div>
                            <Switch
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        is_active: checked,
                                    })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Open in New Tab</Label>
                                <p className="text-xs text-muted-foreground">
                                    Open link in a new browser tab
                                </p>
                            </div>
                            <Switch
                                checked={formData.open_in_new_tab}
                                onCheckedChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        open_in_new_tab: checked,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting
                                ? 'Saving...'
                                : editingItem
                                  ? 'Update'
                                  : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Navigation Item
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "
                            {deletingItem?.name}"?
                            {deletingItem?.children &&
                                deletingItem.children.length > 0 && (
                                    <span className="mt-2 block font-medium text-destructive">
                                        This will also delete all{' '}
                                        {deletingItem.children.length} child
                                        items!
                                    </span>
                                )}
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
