import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface AdminInputProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
    label: string;
    description?: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    disabled?: boolean;
    className?: string;
}

/**
 * AdminInput - Reusable input component for admin panel forms
 *
 * Features:
 * - Displays current value from seeded data
 * - Updates database on form submission
 * - Integrated with react-hook-form
 * - Shows validation errors
 * - Supports all standard input types
 *
 * @example
 * ```tsx
 * <AdminInput
 *   control={form.control}
 *   name="title"
 *   label="Title"
 *   placeholder="Enter title"
 *   description="This will be displayed as the main heading"
 * />
 * ```
 */
export function AdminInput<TFieldValues extends FieldValues = FieldValues>({
    control,
    name,
    label,
    description,
    placeholder,
    type = 'text',
    disabled = false,
    className,
}: AdminInputProps<TFieldValues>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type={type}
                            placeholder={placeholder}
                            disabled={disabled}
                            value={field.value ?? ''}
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
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
