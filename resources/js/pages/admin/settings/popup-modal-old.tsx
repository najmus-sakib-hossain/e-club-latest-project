import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { AdminInput, AdminImage } from '@/components/admin';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';

interface PopupModalSetting {
    id?: number;
    title: string;
    description: string;
    button_text: string;
    button_link: string;
    image_url: string | null;
    is_active: boolean;
}

interface Props {
    setting: PopupModalSetting;
}

const formSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional(),
    button_text: z.string().min(1, 'Button text is required').max(100),
    button_link: z.string().min(1, 'Button link is required').max(255),
    image_url: z.string().optional().nullable(),
    is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PopupModalSettings({ setting }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: setting.title || 'Become a Founder Member',
            description:
                setting.description ||
                'Join our exclusive club and unlock a world of opportunities! Get personalized support, access to exclusive resources, and connect with like-minded professionals. Become a Founder Member today!',
            button_text: setting.button_text || 'Join Now',
            button_link: setting.button_link || '/join',
            image_url: setting.image_url || null,
            is_active: setting.is_active ?? true,
        },
    });

    const onSubmit = (values: FormValues) => {
        setIsSubmitting(true);

        router.post('/admin/settings/popup-modal', values as any, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Popup modal settings saved successfully!');
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
                toast.error('Failed to save settings. Please try again.');
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Popup Modal Settings" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Popup Modal Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Configure the popup modal that appears on the homepage
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Modal Configuration</CardTitle>
                        <CardDescription>
                            Customize the content and appearance of the homepage
                            popup modal
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {/* Active Status */}
                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Show Popup Modal
                                                </FormLabel>
                                                <FormDescription>
                                                    Display the popup modal on
                                                    the homepage
                                                </FormDescription>
                                            </div>
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

                                {/* Title */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Become a Founder Member"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Join our exclusive club..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Button Text */}
                                <FormField
                                    control={form.control}
                                    name="button_text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Text</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Join Now"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Button Link */}
                                <FormField
                                    control={form.control}
                                    name="button_link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Link</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="/join"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                URL where the button should link
                                                to
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Image Upload */}
                                <FormField
                                    control={form.control}
                                    name="image_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Popup Image</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {imagePreview ? (
                                                        <div className="relative">
                                                            <img
                                                                src={
                                                                    imagePreview
                                                                }
                                                                alt="Popup preview"
                                                                className="h-64 w-full rounded-lg object-cover"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute top-2 right-2"
                                                                onClick={
                                                                    handleRemoveImage
                                                                }
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12">
                                                            <div className="text-center">
                                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                                <p className="mt-2 text-sm text-gray-600">
                                                                    Click to
                                                                    upload popup
                                                                    image
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <Input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleImageUpload
                                                        }
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Upload an image to display on
                                                the left side of the popup modal
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Buttons */}
                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => form.reset()}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
