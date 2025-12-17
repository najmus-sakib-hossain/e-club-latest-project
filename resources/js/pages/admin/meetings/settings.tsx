import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Pencil, Plus, Trash2 } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminPageLayout from '@/layouts/admin-page-layout';
import { toast } from 'sonner';

// Types
interface MeetingSlot {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    slots: MeetingSlot[];
}

const days = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
];

const getDayName = (dayOfWeek: number) => {
    return (
        days.find((d) => d.value === dayOfWeek.toString())?.label || 'Unknown'
    );
};

// Form Schema
const slotSchema = z.object({
    day_of_week: z.coerce.number().min(0).max(6),
    start_time: z
        .string()
        .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    end_time: z
        .string()
        .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    is_active: z.boolean().default(true),
});

type SlotFormValues = z.infer<typeof slotSchema>;

export default function MeetingSettings({ slots }: Props) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<MeetingSlot | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SlotFormValues>({
        resolver: zodResolver(slotSchema) as any,
        defaultValues: {
            day_of_week: 1,
            start_time: '09:00',
            end_time: '17:00',
            is_active: true,
        },
    });

    const openAddDialog = () => {
        form.reset({
            day_of_week: 1,
            start_time: '09:00',
            end_time: '17:00',
            is_active: true,
        });
        setIsAddDialogOpen(true);
    };

    const openEditDialog = (slot: MeetingSlot) => {
        setSelectedSlot(slot);
        form.reset({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time.substring(0, 5),
            end_time: slot.end_time.substring(0, 5),
            is_active: slot.is_active,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (slot: MeetingSlot) => {
        setSelectedSlot(slot);
        setIsDeleteDialogOpen(true);
    };

    const handleCreate = (values: SlotFormValues) => {
        setIsSubmitting(true);

        router.post('/admin/meetings/slots', values, {
            onSuccess: () => {
                toast.success('Meeting slot added successfully');
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

    const handleUpdate = (values: SlotFormValues) => {
        if (!selectedSlot) return;
        setIsSubmitting(true);

        router.put(`/admin/meetings/slots/${selectedSlot.id}`, values, {
            onSuccess: () => {
                toast.success('Meeting slot updated successfully');
                setIsEditDialogOpen(false);
                setSelectedSlot(null);
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
        if (!selectedSlot) return;
        setIsSubmitting(true);

        router.delete(`/admin/meetings/slots/${selectedSlot.id}`, {
            onSuccess: () => {
                toast.success('Meeting slot deleted successfully');
                setIsDeleteDialogOpen(false);
                setSelectedSlot(null);
            },
            onError: () => {
                toast.error('Failed to delete meeting slot');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    // Group slots by day
    const slotsByDay = slots.reduce(
        (acc, slot) => {
            const day = slot.day_of_week;
            if (!acc[day]) acc[day] = [];
            acc[day].push(slot);
            return acc;
        },
        {} as Record<number, MeetingSlot[]>,
    );

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    return (
        <AdminPageLayout>
            <Head title="Meeting Availability Settings" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit('/admin/meetings')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Availability Settings
                            </h1>
                            <p className="text-muted-foreground">
                                Configure meeting time slots for each day of the
                                week.
                            </p>
                        </div>
                    </div>
                    <Button onClick={openAddDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Time Slot
                    </Button>
                </motion.div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Clock className="mt-0.5 h-5 w-5 text-blue-600" />
                                <div>
                                    <h3 className="font-medium text-blue-900">
                                        How Availability Works
                                    </h3>
                                    <p className="mt-1 text-sm text-blue-700">
                                        Time slots define when customers can
                                        book meetings. The system will generate
                                        30-minute appointment slots within each
                                        time range. For example, a slot from
                                        9:00 AM to 12:00 PM will offer
                                        appointments at 9:00, 9:30, 10:00,
                                        10:30, 11:00, and 11:30 AM.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Weekly Schedule */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Schedule</CardTitle>
                            <CardDescription>
                                View and manage your availability for each day
                                of the week.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {days.map((day) => {
                                    const daySlots =
                                        slotsByDay[parseInt(day.value)] || [];
                                    return (
                                        <div
                                            key={day.value}
                                            className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 font-medium">
                                                    {day.label}
                                                </div>
                                                {daySlots.length === 0 ? (
                                                    <span className="text-sm text-muted-foreground">
                                                        No slots configured
                                                    </span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {daySlots.map(
                                                            (slot) => (
                                                                <Badge
                                                                    key={
                                                                        slot.id
                                                                    }
                                                                    variant={
                                                                        slot.is_active
                                                                            ? 'default'
                                                                            : 'secondary'
                                                                    }
                                                                    className="cursor-pointer"
                                                                    onClick={() =>
                                                                        openEditDialog(
                                                                            slot,
                                                                        )
                                                                    }
                                                                >
                                                                    {formatTime(
                                                                        slot.start_time,
                                                                    )}{' '}
                                                                    -{' '}
                                                                    {formatTime(
                                                                        slot.end_time,
                                                                    )}
                                                                    {!slot.is_active &&
                                                                        ' (Inactive)'}
                                                                </Badge>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* All Slots Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>All Time Slots</CardTitle>
                            <CardDescription>
                                Manage individual time slots.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {slots.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">
                                    <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>No time slots configured yet.</p>
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={openAddDialog}
                                    >
                                        Add Your First Slot
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Day</TableHead>
                                            <TableHead>Start Time</TableHead>
                                            <TableHead>End Time</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {slots
                                            .sort(
                                                (a, b) =>
                                                    a.day_of_week -
                                                        b.day_of_week ||
                                                    a.start_time.localeCompare(
                                                        b.start_time,
                                                    ),
                                            )
                                            .map((slot) => (
                                                <TableRow key={slot.id}>
                                                    <TableCell className="font-medium">
                                                        {getDayName(
                                                            slot.day_of_week,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(
                                                            slot.start_time,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(
                                                            slot.end_time,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                slot.is_active
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {slot.is_active
                                                                ? 'Active'
                                                                : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    openEditDialog(
                                                                        slot,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="text-destructive"
                                                                onClick={() =>
                                                                    openDeleteDialog(
                                                                        slot,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Add Slot Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Time Slot</DialogTitle>
                        <DialogDescription>
                            Configure a new availability time slot.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleCreate as any)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="day_of_week"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Day of Week</FormLabel>
                                        <Select
                                            value={(
                                                field.value ?? 1
                                            ).toString()}
                                            onValueChange={(val) =>
                                                field.onChange(parseInt(val))
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a day" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {days.map((day) => (
                                                    <SelectItem
                                                        key={day.value}
                                                        value={day.value}
                                                    >
                                                        {day.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="start_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="time"
                                                    placeholder="09:00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="time"
                                                    placeholder="17:00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Active</FormLabel>
                                            <FormDescription>
                                                Enable this time slot for
                                                bookings
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
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Adding...' : 'Add Slot'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit Slot Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Time Slot</DialogTitle>
                        <DialogDescription>
                            Update the time slot settings.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleUpdate as any)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="day_of_week"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Day of Week</FormLabel>
                                        <Select
                                            value={(
                                                field.value ?? 1
                                            ).toString()}
                                            onValueChange={(val) =>
                                                field.onChange(parseInt(val))
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a day" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {days.map((day) => (
                                                    <SelectItem
                                                        key={day.value}
                                                        value={day.value}
                                                    >
                                                        {day.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="start_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="time"
                                                    placeholder="09:00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="time"
                                                    placeholder="17:00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Active</FormLabel>
                                            <FormDescription>
                                                Enable this time slot for
                                                bookings
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
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Saving...'
                                        : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Time Slot</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this time slot? This
                            action cannot be undone.
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
