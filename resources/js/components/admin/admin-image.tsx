import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import {
    Control,
    FieldPath,
    FieldValues,
    UseFormSetValue,
} from 'react-hook-form';
import { toast } from 'sonner';

interface AdminImageProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
    setValue: UseFormSetValue<TFieldValues>;
    label: string;
    description?: string;
    currentImage?: string | null;
    uploadEndpoint?: string;
    disabled?: boolean;
    className?: string;
    maxSizeInMB?: number;
    acceptedFormats?: string[];
}

/**
 * AdminImage - Reusable image upload component for admin panel forms
 *
 * Features:
 * - Displays current image from seeded data with preview
 * - Uploads new image and updates database
 * - Image preview before upload
 * - Remove/clear functionality
 * - File validation (size and format)
 * - Progress indication during upload
 * - Integrated with react-hook-form
 *
 * @example
 * ```tsx
 * <AdminImage
 *   control={form.control}
 *   name="image_url"
 *   setValue={form.setValue}
 *   label="Featured Image"
 *   currentImage={setting.image_url}
 *   uploadEndpoint="/admin/settings/upload-image"
 *   description="Recommended size: 1200x630px (max 2MB)"
 *   maxSizeInMB={2}
 *   acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
 * />
 * ```
 */
export function AdminImage<TFieldValues extends FieldValues = FieldValues>({
    control,
    name,
    setValue,
    label,
    description,
    currentImage,
    uploadEndpoint,
    disabled = false,
    className,
    maxSizeInMB = 2,
    acceptedFormats = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
    ],
}: AdminImageProps<TFieldValues>) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const displayImage = preview || currentImage;
    const acceptString = acceptedFormats.join(',');

    const handleImageSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!acceptedFormats.includes(file.type)) {
            toast.error('Invalid file format', {
                description: `Please upload one of: ${acceptedFormats.map((f) => f.split('/')[1].toUpperCase()).join(', ')}`,
            });
            return;
        }

        // Validate file size
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            toast.error('File too large', {
                description: `Maximum file size is ${maxSizeInMB}MB`,
            });
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload if endpoint provided
        if (uploadEndpoint) {
            setIsUploading(true);
            try {
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch(uploadEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();

                if (data.image_url) {
                    setValue(name, data.image_url as any, {
                        shouldValidate: true,
                    });
                    toast.success('Image uploaded successfully');
                } else {
                    throw new Error('No image URL returned');
                }
            } catch (error) {
                console.error('Upload error:', error);
                toast.error('Failed to upload image', {
                    description: 'Please try again',
                });
                setPreview(null);
            } finally {
                setIsUploading(false);
            }
        } else {
            // If no upload endpoint, just set the file for form submission
            setValue(name, file as any, { shouldValidate: true });
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setValue(name, '' as any, { shouldValidate: true });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.success('Image removed');
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="space-y-4">
                            {/* Image Preview */}
                            {displayImage && (
                                <div className="group relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                                    <img
                                        src={displayImage}
                                        alt="Preview"
                                        className="h-64 w-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleButtonClick}
                                            disabled={disabled || isUploading}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Replace
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleRemove}
                                            disabled={disabled || isUploading}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Upload Area */}
                            {!displayImage && (
                                <div
                                    onClick={handleButtonClick}
                                    className="relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-gray-400 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none dark:border-gray-700 dark:hover:border-gray-600"
                                >
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                                        <span className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80">
                                            Upload a file
                                        </span>
                                        <span className="pl-1">
                                            or drag and drop
                                        </span>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600 dark:text-gray-500">
                                        {acceptedFormats
                                            .map((f) =>
                                                f.split('/')[1].toUpperCase(),
                                            )
                                            .join(', ')}{' '}
                                        up to {maxSizeInMB}MB
                                    </p>
                                </div>
                            )}

                            {/* Hidden Input */}
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept={acceptString}
                                onChange={handleImageSelect}
                                disabled={disabled || isUploading}
                                className="hidden"
                            />

                            {/* Upload Progress */}
                            {isUploading && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
                                    Uploading...
                                </div>
                            )}
                        </div>
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
