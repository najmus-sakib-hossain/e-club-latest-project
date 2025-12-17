import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import {
    Check,
    Eye,
    Filter,
    Inbox,
    Mail,
    MailOpen,
    RefreshCw,
    Search,
    Send,
    Trash2,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AdminPageLayout from '@/layouts/admin-page-layout';
import { toast } from 'sonner';

// Types
interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: 'pending' | 'in_progress' | 'resolved';
    read_at: string | null;
    replied_at: string | null;
    reply_content: string | null;
    replied_by: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    messages: ContactMessage[];
    stats: {
        total: number;
        pending: number;
        in_progress: number;
        resolved: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
}

// Form Schema
const replySchema = z.object({
    reply_content: z
        .string()
        .min(10, 'Reply must be at least 10 characters')
        .max(5000),
});

type ReplyFormValues = z.infer<typeof replySchema>;

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'in_progress':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'resolved':
            return 'bg-green-100 text-green-800 border-green-300';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'pending':
            return <Mail className="h-4 w-4" />;
        case 'in_progress':
            return <MailOpen className="h-4 w-4" />;
        case 'resolved':
            return <Check className="h-4 w-4" />;
        default:
            return <Mail className="h-4 w-4" />;
    }
};

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
];

const statusLabel = (status: string) =>
    statusOptions.find((o) => o.value === status)?.label || status;

export default function ContactMessagesIndex({
    messages,
    stats,
    filters,
}: Props) {
    const [selectedMessage, setSelectedMessage] =
        useState<ContactMessage | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const replyForm = useForm<ReplyFormValues>({
        resolver: zodResolver(replySchema),
        defaultValues: {
            reply_content: '',
        },
    });

    const openViewMessage = (message: ContactMessage) => {
        setSelectedMessage(message);
        setIsViewOpen(true);
    };

    const openReplyDialog = (message: ContactMessage) => {
        setSelectedMessage(message);
        replyForm.reset({ reply_content: '' });
        setIsReplyOpen(true);
    };

    const handleSendReply = (values: ReplyFormValues) => {
        if (!selectedMessage) return;
        setIsSubmitting(true);

        router.post(
            `/admin/contact-messages/${selectedMessage.id}/reply`,
            values,
            {
                onSuccess: () => {
                    toast.success('Reply sent successfully');
                    setIsReplyOpen(false);
                    setSelectedMessage(null);
                    replyForm.reset();
                },
                onError: (errors) => {
                    Object.values(errors).forEach((error) => {
                        toast.error(error as string);
                    });
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const handleMarkResolved = (message: ContactMessage) => {
        handleStatusChange(message.id, 'resolved');
    };

    const handleStatusChange = (
        messageId: number,
        status: ContactMessage['status'],
    ) => {
        router.put(
            `/admin/contact-messages/${messageId}`,
            { status },
            {
                onSuccess: () => {
                    toast.success(`Status updated to ${statusLabel(status)}`);
                },
                onError: () => {
                    toast.error('Failed to update status');
                },
            },
        );
    };

    const handleDelete = () => {
        if (!selectedMessage) return;
        setIsSubmitting(true);

        router.delete(`/admin/contact-messages/${selectedMessage.id}`, {
            onSuccess: () => {
                toast.success('Message deleted successfully');
                setIsDeleteOpen(false);
                setSelectedMessage(null);
            },
            onError: () => {
                toast.error('Failed to delete message');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleSearch = () => {
        router.get(
            '/admin/contact-messages',
            {
                search: searchQuery,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            { preserveState: true },
        );
    };

    const filteredMessages = messages.filter((message) => {
        if (statusFilter !== 'all' && message.status !== statusFilter)
            return false;
        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            return (
                message.name.toLowerCase().includes(search) ||
                message.email.toLowerCase().includes(search) ||
                message.subject.toLowerCase().includes(search)
            );
        }
        return true;
    });

    return (
        <AdminPageLayout>
            <Head title="Contact Messages" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Contact Messages
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and respond to customer inquiries.
                        </p>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Messages
                            </CardTitle>
                            <Inbox className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All time messages
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                            <Mail className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.pending}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting review
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                In Progress
                            </CardTitle>
                            <MailOpen className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.in_progress}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Being handled
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Resolved
                            </CardTitle>
                            <Check className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.resolved}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Closed cases
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                >
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or subject..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSearch()
                            }
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">
                                In Progress
                            </SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleSearch}>
                        <Filter className="mr-2 h-4 w-4" />
                        Apply
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => router.visit('/admin/contact-messages')}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </motion.div>

                {/* Messages Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>All Messages</CardTitle>
                            <CardDescription>
                                View and respond to customer contact form
                                submissions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredMessages.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">
                                    <Inbox className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>No messages found.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12"></TableHead>
                                            <TableHead>From</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Received</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMessages.map((message) => (
                                            <TableRow
                                                key={message.id}
                                                className={
                                                    message.status === 'pending'
                                                        ? 'bg-blue-50/50'
                                                        : ''
                                                }
                                            >
                                                <TableCell>
                                                    {getStatusIcon(
                                                        message.status,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div
                                                            className={`font-medium ${message.status === 'pending' ? 'font-bold' : ''}`}
                                                        >
                                                            {message.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {message.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div
                                                        className={
                                                            message.status ===
                                                            'pending'
                                                                ? 'font-semibold'
                                                                : ''
                                                        }
                                                    >
                                                        {message.subject}
                                                    </div>
                                                    <div className="line-clamp-1 text-sm text-muted-foreground">
                                                        {message.message}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {new Date(
                                                            message.created_at,
                                                        ).toLocaleDateString(
                                                            'en-US',
                                                            {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            message.created_at,
                                                        ).toLocaleTimeString(
                                                            'en-US',
                                                            {
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                            },
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={getStatusColor(
                                                            message.status,
                                                        )}
                                                    >
                                                        {statusLabel(
                                                            message.status,
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                openViewMessage(
                                                                    message,
                                                                )
                                                            }
                                                            title="View message"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Select
                                                            value={
                                                                message.status
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                handleStatusChange(
                                                                    message.id,
                                                                    value as ContactMessage['status'],
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="w-[140px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {statusOptions.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            value={
                                                                                option.value
                                                                            }
                                                                        >
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        {message.status !==
                                                            'resolved' && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    handleMarkResolved(
                                                                        message,
                                                                    )
                                                                }
                                                                title="Mark as resolved"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-destructive"
                                                            onClick={() => {
                                                                setSelectedMessage(
                                                                    message,
                                                                );
                                                                setIsDeleteOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            title="Delete"
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

            {/* View Message Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedMessage?.subject}</DialogTitle>
                        <DialogDescription>
                            Message from {selectedMessage?.name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMessage && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <label className="font-medium text-muted-foreground">
                                        From
                                    </label>
                                    <p className="font-medium">
                                        {selectedMessage.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="font-medium text-muted-foreground">
                                        Status
                                    </label>
                                    <div>
                                        <Badge
                                            className={getStatusColor(
                                                selectedMessage.status,
                                            )}
                                        >
                                            {statusLabel(
                                                selectedMessage.status,
                                            )}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="font-medium text-muted-foreground">
                                        Email
                                    </label>
                                    <p>
                                        <a
                                            href={`mailto:${selectedMessage.email}`}
                                            className="text-primary hover:underline"
                                        >
                                            {selectedMessage.email}
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <label className="font-medium text-muted-foreground">
                                        Phone
                                    </label>
                                    <p>
                                        {selectedMessage.phone ||
                                            'Not provided'}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <label className="font-medium text-muted-foreground">
                                        Received
                                    </label>
                                    <p>
                                        {new Date(
                                            selectedMessage.created_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Message
                                </label>
                                <div className="mt-2 rounded-lg bg-muted/50 p-4 whitespace-pre-wrap">
                                    {selectedMessage.message}
                                </div>
                            </div>

                            {selectedMessage.reply_content && (
                                <div className="border-t pt-4">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Reply{' '}
                                        {selectedMessage.replied_by &&
                                            `by ${selectedMessage.replied_by}`}
                                    </label>
                                    <p className="mb-2 text-xs text-muted-foreground">
                                        Sent on{' '}
                                        {selectedMessage.replied_at &&
                                            new Date(
                                                selectedMessage.replied_at,
                                            ).toLocaleString()}
                                    </p>
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 whitespace-pre-wrap">
                                        {selectedMessage.reply_content}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsViewOpen(false)}
                        >
                            Close
                        </Button>
                        {selectedMessage &&
                            selectedMessage.status !== 'resolved' && (
                                <Button
                                    onClick={() => {
                                        setIsViewOpen(false);
                                        openReplyDialog(selectedMessage);
                                    }}
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Reply
                                </Button>
                            )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reply Dialog */}
            <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Reply to {selectedMessage?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Send a response to: {selectedMessage?.email}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMessage && (
                        <div className="space-y-4">
                            <div className="rounded-lg bg-muted/50 p-4">
                                <p className="mb-2 text-sm font-medium text-muted-foreground">
                                    Original Message:
                                </p>
                                <p className="text-sm font-medium">
                                    {selectedMessage.subject}
                                </p>
                                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            <Form {...replyForm}>
                                <form
                                    onSubmit={replyForm.handleSubmit(
                                        handleSendReply,
                                    )}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={replyForm.control}
                                        name="reply_content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Your Reply
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Type your response here..."
                                                        className="min-h-[200px] resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setIsReplyOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                'Sending...'
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Send Reply
                                                </>
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Message</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this message from{' '}
                            {selectedMessage?.name}? This action cannot be
                            undone.
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
