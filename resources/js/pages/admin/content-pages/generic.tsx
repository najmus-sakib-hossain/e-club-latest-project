import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { FileText, GripVertical, Plus, Save, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';
import { toast } from 'sonner';

// Types
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

interface SectionConfig {
    label: string;
    fields: string[];
    itemFields?: string[];
    richText?: boolean;
}

interface PageConfig {
    title: string;
    description: string;
    sections: Record<string, SectionConfig>;
}

interface Props {
    pageSlug: string;
    pageConfig: PageConfig;
    content: Record<string, PageContentRecord>;
}

const defaultSectionContent: Record<
    string,
    Record<string, Partial<SectionFormValues>>
> = {
    privacy: {
        hero: {
            title: 'Privacy Policy',
            subtitle: 'December 1, 2025',
        },
        content: {
            content:
                'At E-Club Store, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.\n\n1. Information We Collect\nPersonal: name, email, phone, shipping address, payment info, account credentials, order history, support communications.\nAutomatic: IP, browser/device, pages visited, referrer, cookies and similar technologies.\n\n2. How We Use Your Information\nProcess orders, communicate updates, respond to support, send promos (with consent), improve services, prevent fraud, comply with law.\n\n3. Information Sharing\nWe do not sell your data. We may share with service providers, business partners (with consent), for legal requirements, or in business transfers.\n\n4. Cookies and Tracking\nWe use essential, analytics, marketing, and preference cookies. You can manage cookies in your browser; disabling may affect functionality.\n\n5. Data Security\nWe use SSL, secure payments, audits, access controls, and training. No method is 100% secure.\n\n6. Your Rights\nAccess, correct, delete data; opt out of marketing; withdraw consent. Contact privacy@e-clubstore.com.\n\n7. Third-Party Links\nWe are not responsible for third-party site practices.\n\n8. Children\nNot intended for children under 18.\n\n9. Changes\nUpdates will be posted with a revision date.\n\n10. Contact\nEmail: privacy@e-clubstore.com | Phone: +880 1234-567890 | Address: Dhaka, Bangladesh.',
        },
    },
    terms: {
        hero: {
            title: 'Terms & Conditions',
            subtitle: 'December 1, 2025',
        },
        content: {
            content:
                'Welcome to E-Club Store. By using our website, you agree to these Terms and Conditions.\n\n1. Acceptance\nYou confirm you are 18+ and can enter binding contracts.\n\n2. Products & Pricing\nAccurate descriptions and images; prices in BDT with VAT; subject to change; errors may be corrected.\n\n3. Orders & Payment\nOrders subject to acceptance/availability; provide accurate info; payment due at order via COD, bKash, Nagad, cards.\n\n4. Delivery\nTimes are estimates; delays possible; inspect on delivery; failed attempts may incur charges.\n\n5. Returns & Refunds\n7-day return window in original condition; defects within 30 days may be refunded; custom items non-returnable; refunds processed within 7 business days. See Returns & Exchanges.\n\n6. Warranty\n2-year warranty for manufacturing defects; excludes misuse/accidents/wear; proof of purchase required; repair/replace at our discretion.\n\n7. Intellectual Property\nAll content owned by E-Club Store; no reproduction without permission; trademarks protected.\n\n8. User Accounts\nMaintain security; provide accurate info; we may suspend for violations.\n\n9. Liability\nNo indirect/consequential damages; liability limited to amount paid; not liable for third parties or force majeure.\n\n10. Disputes\nGood faith negotiation, then mediation, then binding arbitration under Bangladesh law; venue Dhaka.\n\n11. Changes\nWe may modify terms; continued use means acceptance.\n\n12. Contact\nEmail: legal@e-clubstore.com | Phone: +880 1234-567890 | Address: Dhaka, Bangladesh.',
        },
    },
};

// Form Schema
const sectionSchema = z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    content: z.string().optional(),
    items: z.array(z.record(z.string(), z.string())).optional(),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

export default function GenericContentPage({
    pageSlug,
    pageConfig,
    content,
}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState(
        Object.keys(pageConfig.sections)[0] || 'hero',
    );

    // Reset active tab when page changes (when navigating between content pages)
    useEffect(() => {
        setActiveTab(Object.keys(pageConfig.sections)[0] || 'hero');
    }, [pageSlug, pageConfig.sections]);

    const handleSaveSection = (sectionKey: string, data: SectionFormValues) => {
        setIsSubmitting(true);
        router.post(
            `/admin/content-pages/${pageSlug}`,
            {
                sections: {
                    [sectionKey]: data,
                },
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Section saved successfully');
                },
                onError: () => {
                    toast.error('Failed to save section');
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    return (
        <AdminLayout>
            <Head title={`${pageConfig.title} - Admin`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">
                        {pageConfig.title}
                    </h1>
                    <p className="text-muted-foreground">
                        {pageConfig.description}
                    </p>
                </motion.div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="flex h-auto flex-wrap gap-1">
                        {Object.entries(pageConfig.sections).map(
                            ([key, section]) => (
                                <TabsTrigger key={key} value={key}>
                                    {section.label}
                                </TabsTrigger>
                            ),
                        )}
                    </TabsList>

                    {Object.entries(pageConfig.sections).map(
                        ([sectionKey, sectionConfig]) => (
                            <TabsContent key={sectionKey} value={sectionKey}>
                                <SectionEditor
                                    pageSlug={pageSlug}
                                    sectionKey={sectionKey}
                                    sectionConfig={sectionConfig}
                                    initialData={content[sectionKey] || null}
                                    onSave={(data) =>
                                        handleSaveSection(sectionKey, data)
                                    }
                                    isSubmitting={isSubmitting}
                                />
                            </TabsContent>
                        ),
                    )}
                </Tabs>
            </div>
        </AdminLayout>
    );
}

// Section Editor Component
interface SectionEditorProps {
    pageSlug: string;
    sectionKey: string;
    sectionConfig: SectionConfig;
    initialData: PageContentRecord | null;
    onSave: (data: SectionFormValues) => void;
    isSubmitting: boolean;
}

function SectionEditor({
    pageSlug,
    sectionKey,
    sectionConfig,
    initialData,
    onSave,
    isSubmitting,
}: SectionEditorProps) {
    const hasTitle = sectionConfig.fields.includes('title');
    const hasSubtitle = sectionConfig.fields.includes('subtitle');
    const hasContent = sectionConfig.fields.includes('content');
    const hasItems = sectionConfig.fields.includes('items');

    const form = useForm<SectionFormValues>({
        resolver: zodResolver(sectionSchema),
        defaultValues: {
            title:
                initialData?.title ||
                defaultSectionContent?.[pageSlug]?.[sectionKey]?.title ||
                '',
            subtitle:
                initialData?.subtitle ||
                defaultSectionContent?.[pageSlug]?.[sectionKey]?.subtitle ||
                '',
            content:
                initialData?.content ||
                defaultSectionContent?.[pageSlug]?.[sectionKey]?.content ||
                '',
            items: (initialData?.items as Record<string, string>[]) || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    const createEmptyItem = (): Record<string, string> => {
        if (!sectionConfig.itemFields) return {};
        const item: Record<string, string> = {};
        sectionConfig.itemFields.forEach((field) => {
            item[field] = '';
        });
        return item;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {sectionConfig.label}
                </CardTitle>
                <CardDescription>
                    Manage the {sectionConfig.label.toLowerCase()} content
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSave)}
                        className="space-y-6"
                    >
                        {hasTitle && (
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Section title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {hasSubtitle && (
                            <FormField
                                control={form.control}
                                name="subtitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Subtitle / Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief description..."
                                                rows={2}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {hasContent && (
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter content..."
                                                rows={
                                                    sectionConfig.richText
                                                        ? 15
                                                        : 5
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                        {/* <FormDescription>
                                            {sectionConfig.richText
                                                ? 'Enter the full content. Use line breaks for paragraphs.'
                                                : 'Enter section content'}
                                        </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {hasItems && sectionConfig.itemFields && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Items</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            append(createEmptyItem())
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Item
                                    </Button>
                                </div>

                                {fields.length === 0 && (
                                    <div className="rounded-lg border-2 border-dashed py-8 text-center">
                                        <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                        <p className="mb-2 text-muted-foreground">
                                            No items yet
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                append(createEmptyItem())
                                            }
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add First Item
                                        </Button>
                                    </div>
                                )}

                                {fields.map((field, index) => (
                                    <motion.div
                                        key={field.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 rounded-lg border p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
                                                <span className="text-sm font-medium">
                                                    Item {index + 1}
                                                </span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {sectionConfig.itemFields?.map(
                                                (itemField) => (
                                                    <FormField
                                                        key={itemField}
                                                        control={form.control}
                                                        name={`items.${index}.${itemField}`}
                                                        render={({
                                                            field: formField,
                                                        }) => (
                                                            <FormItem
                                                                className={
                                                                    [
                                                                        'description',
                                                                        'content',
                                                                        'tips',
                                                                        'coverage',
                                                                        'exclusions',
                                                                    ].includes(
                                                                        itemField,
                                                                    )
                                                                        ? 'sm:col-span-2'
                                                                        : ''
                                                                }
                                                            >
                                                                <FormLabel className="capitalize">
                                                                    {itemField.replace(
                                                                        /_/g,
                                                                        ' ',
                                                                    )}
                                                                </FormLabel>
                                                                <FormControl>
                                                                    {[
                                                                        'description',
                                                                        'content',
                                                                        'tips',
                                                                        'coverage',
                                                                        'exclusions',
                                                                        'areas',
                                                                    ].includes(
                                                                        itemField,
                                                                    ) ? (
                                                                        <Textarea
                                                                            placeholder={`Enter ${itemField.replace(/_/g, ' ')}...`}
                                                                            rows={
                                                                                3
                                                                            }
                                                                            value={
                                                                                (formField.value as string) ||
                                                                                ''
                                                                            }
                                                                            onChange={
                                                                                formField.onChange
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <Input
                                                                            placeholder={`Enter ${itemField.replace(/_/g, ' ')}...`}
                                                                            value={
                                                                                (formField.value as string) ||
                                                                                ''
                                                                            }
                                                                            onChange={
                                                                                formField.onChange
                                                                            }
                                                                        />
                                                                    )}
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* <Separator /> */}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                <Save className="mr-2 h-4 w-4" />
                                Save {sectionConfig.label}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
