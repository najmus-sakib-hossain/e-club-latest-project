import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { GripVertical, Pencil, Plus, Save, Trash2, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { Switch } from '@/components/ui/switch';
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

interface TeamMember {
    id: number;
    name: string;
    role: string;
    bio: string | null;
    image: string | null;
    social_links: Record<string, string> | null;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    content: Record<string, PageContentRecord>;
    teamMembers: TeamMember[];
}

// Form Schemas
const aboutFormSchema = z.object({
    hero_title: z.string().min(1, 'Title is required').max(255),
    hero_description: z.string().optional(),
    story_title: z.string().optional(),
    story_content: z.string().optional(),
    story_image: z.any().optional(),
    values_title: z.string().optional(),
    values_subtitle: z.string().optional(),
    values: z
        .array(
            z.object({
                icon: z.string().optional(),
                title: z.string().min(1, 'Title is required'),
                description: z.string().optional(),
            }),
        )
        .optional(),
    features: z
        .array(
            z.object({
                icon: z.string().optional(),
                title: z.string().min(1, 'Title is required'),
                description: z.string().optional(),
            }),
        )
        .optional(),
    stats: z
        .array(
            z.object({
                label: z.string().min(1, 'Label is required'),
                value: z.string().min(1, 'Value is required'),
            }),
        )
        .optional(),
    team_title: z.string().optional(),
    team_subtitle: z.string().optional(),
});

const teamMemberSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    role: z.string().min(1, 'Role is required').max(255),
    bio: z.string().optional(),
    image: z.any().optional(),
    social_links: z
        .object({
            facebook: z.string().url().optional().or(z.literal('')),
            linkedin: z.string().url().optional().or(z.literal('')),
            instagram: z.string().url().optional().or(z.literal('')),
        })
        .partial()
        .optional(),
    is_active: z.boolean(),
    sort_order: z.number(),
});

type AboutFormValues = z.infer<typeof aboutFormSchema>;
type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

// Icon options for values
const iconOptions = [
    { value: 'Leaf', label: '🌿 Sustainability' },
    { value: 'Heart', label: '❤️ Quality' },
    { value: 'Sparkles', label: '✨ Craftsmanship' },
    { value: 'Shield', label: '🛡️ Trust' },
    { value: 'Users', label: '👥 Community' },
    { value: 'Star', label: '⭐ Excellence' },
    { value: 'Globe', label: '🌍 Global' },
    { value: 'Award', label: '🏆 Award' },
];

const defaultFeatures = [
    {
        icon: 'building',
        title: 'Own Manufacturing',
        description:
            'In-house production facility ensuring complete quality control.',
    },
    {
        icon: 'truck',
        title: 'Nationwide Delivery',
        description: 'We deliver to all 64 districts of Bangladesh.',
    },
    {
        icon: 'shield',
        title: '2 Year Warranty',
        description: 'All products come with comprehensive warranty coverage.',
    },
    {
        icon: 'thumbsup',
        title: 'Easy Returns',
        description: '7-day hassle-free return policy for your peace of mind.',
    },
];

export default function AboutPage({ content, teamMembers }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTeamMember, setSelectedTeamMember] =
        useState<TeamMember | null>(null);
    const [activeTab, setActiveTab] = useState('hero');
    const [storyImagePreview, setStoryImagePreview] = useState<string | null>(
        content.story?.image ? `/storage/${content.story.image}` : null,
    );
    const [teamImagePreview, setTeamImagePreview] = useState<string | null>(
        null,
    );

    // Main about form
    const form = useForm<AboutFormValues>({
        resolver: zodResolver(aboutFormSchema),
        defaultValues: {
            hero_title: content.hero?.title || 'About Us',
            hero_description:
                content.hero?.content ||
                'Learn more about our story, values, and the team behind our success.',
            story_title: content.story?.title || 'Our Story',
            story_content:
                content.story?.content ||
                'Founded with a vision to deliver premium quality e-club, we have grown into a trusted name in the industry. Our commitment to craftsmanship and customer satisfaction drives everything we do.',
            story_image: undefined,
            values_title: content.values?.title || 'Our Values',
            values_subtitle:
                content.values?.subtitle ||
                'The principles that guide everything we do',
            values: (content.values?.items as AboutFormValues['values']) || [
                {
                    icon: 'Heart',
                    title: 'Quality First',
                    description:
                        'We never compromise on the quality of our products and services.',
                },
                {
                    icon: 'Sparkles',
                    title: 'Craftsmanship',
                    description:
                        'Every piece is crafted with attention to detail and care.',
                },
                {
                    icon: 'Shield',
                    title: 'Customer Trust',
                    description:
                        'Building lasting relationships through honesty and reliability.',
                },
            ],
            features:
                (content.features?.items as AboutFormValues['features']) ||
                defaultFeatures,
            stats: (content.stats?.items as AboutFormValues['stats']) || [
                { value: '10,000+', label: 'Happy Customers' },
                { value: '15+', label: 'Years Experience' },
                { value: '500+', label: 'Products' },
                { value: '50+', label: 'Team Members' },
            ],
            team_title: content.team?.title || 'Meet Our Team',
            team_subtitle:
                content.team?.subtitle ||
                'The talented people behind our success',
        },
    });

    // Team member form
    const teamForm = useForm<TeamMemberFormValues>({
        resolver: zodResolver(teamMemberSchema),
        defaultValues: {
            name: '',
            role: '',
            bio: '',
            image: undefined,
            social_links: {
                facebook: '',
                linkedin: '',
                instagram: '',
            },
            is_active: true,
            sort_order: 0,
        },
    });

    const {
        fields: valueFields,
        append: appendValue,
        remove: removeValue,
    } = useFieldArray({
        control: form.control,
        name: 'values',
    });

    const {
        fields: featureFields,
        append: appendFeature,
        remove: removeFeature,
    } = useFieldArray({
        control: form.control,
        name: 'features',
    });

    const {
        fields: statFields,
        append: appendStat,
        remove: removeStat,
    } = useFieldArray({
        control: form.control,
        name: 'stats',
    });

    const handleSave = (data: AboutFormValues) => {
        setIsSubmitting(true);
        router.post('/admin/content-pages/about', data, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toast.success('About page content saved');
            },
            onError: () => {
                toast.error('Failed to save');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const openAddTeamDialog = () => {
        setSelectedTeamMember(null);
        setTeamImagePreview(null);
        teamForm.reset({
            name: '',
            role: '',
            bio: '',
            image: undefined,
            social_links: {
                facebook: '',
                linkedin: '',
                instagram: '',
            },
            is_active: true,
            sort_order: teamMembers.length,
        });
        setIsTeamDialogOpen(true);
    };

    const openEditTeamDialog = (member: TeamMember) => {
        setSelectedTeamMember(member);
        setTeamImagePreview(member.image ? `/storage/${member.image}` : null);
        teamForm.reset({
            name: member.name,
            role: member.role,
            bio: member.bio || '',
            image: undefined,
            social_links: member.social_links || {
                facebook: '',
                linkedin: '',
                instagram: '',
            },
            is_active: member.is_active,
            sort_order: member.sort_order,
        });
        setIsTeamDialogOpen(true);
    };

    const handleTeamSubmit = (data: TeamMemberFormValues) => {
        setIsSubmitting(true);
        const url = selectedTeamMember
            ? `/admin/content-pages/about/team/${selectedTeamMember.id}`
            : '/admin/content-pages/about/team';

        const method = selectedTeamMember ? 'put' : 'post';

        const payload = {
            ...data,
            sort_order: Number(data.sort_order || 0),
        };

        router[method](url, payload, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toast.success(
                    selectedTeamMember
                        ? 'Team member updated'
                        : 'Team member added',
                );
                setIsTeamDialogOpen(false);
            },
            onError: () => {
                toast.error('Failed to save team member');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDeleteTeamMember = () => {
        if (!selectedTeamMember) return;

        setIsSubmitting(true);
        router.delete(
            `/admin/content-pages/about/team/${selectedTeamMember.id}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Team member deleted');
                    setIsDeleteDialogOpen(false);
                    setSelectedTeamMember(null);
                },
                onError: () => {
                    toast.error('Failed to delete team member');
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    return (
        <AdminLayout>
            <Head title="About Page - Admin" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">
                        About Page
                    </h1>
                    <p className="text-muted-foreground">
                        Manage the about page content, story, values, and team
                    </p>
                </motion.div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="hero">Hero & Story</TabsTrigger>
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                        <TabsTrigger value="values">Values</TabsTrigger>
                        <TabsTrigger value="team">Team</TabsTrigger>
                    </TabsList>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSave)}>
                            {/* Hero & Story Tab */}
                            <TabsContent value="hero">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Hero Section</CardTitle>
                                        <CardDescription>
                                            The main heading and introduction
                                            for the about page
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="hero_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Hero Title
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="About Us"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hero_description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Hero Description
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Brief introduction..."
                                                            rows={3}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="mt-6">
                                    <CardHeader>
                                        <CardTitle>Our Story</CardTitle>
                                        <CardDescription>
                                            Tell the story of your company
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="story_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Story Title
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Our Story"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="story_content"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Story Content
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Tell your company story..."
                                                            rows={8}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="story_image"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Story Image
                                                    </FormLabel>
                                                    <FormControl>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(
                                                                event,
                                                            ) => {
                                                                const file =
                                                                    event.target
                                                                        .files?.[0];
                                                                field.onChange(
                                                                    file,
                                                                );
                                                                if (file) {
                                                                    const reader =
                                                                        new FileReader();
                                                                    reader.onloadend =
                                                                        () =>
                                                                            setStoryImagePreview(
                                                                                reader.result as string,
                                                                            );
                                                                    reader.readAsDataURL(
                                                                        file,
                                                                    );
                                                                } else {
                                                                    setStoryImagePreview(
                                                                        content
                                                                            .story
                                                                            ?.image
                                                                            ? `/storage/${content.story.image}`
                                                                            : null,
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                    {storyImagePreview && (
                                                        <div className="mt-3">
                                                            <p className="mb-2 text-sm text-muted-foreground">
                                                                Preview
                                                            </p>
                                                            <div className="aspect-video overflow-hidden rounded-lg border">
                                                                <img
                                                                    src={
                                                                        storyImagePreview
                                                                    }
                                                                    alt="Story preview"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <div className="mt-6 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Hero & Story
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Stats Tab */}
                            <TabsContent value="stats">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>
                                                    Statistics
                                                </CardTitle>
                                                <CardDescription>
                                                    Key numbers that showcase
                                                    your achievements
                                                </CardDescription>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    appendStat({
                                                        label: '',
                                                        value: '',
                                                    })
                                                }
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Stat
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {statFields.length === 0 && (
                                            <div className="rounded-lg border-2 border-dashed py-8 text-center">
                                                <p className="mb-2 text-muted-foreground">
                                                    No stats yet
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        appendStat({
                                                            label: '',
                                                            value: '',
                                                        })
                                                    }
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add First Stat
                                                </Button>
                                            </div>
                                        )}

                                        {statFields.map((field, index) => (
                                            <motion.div
                                                key={field.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex items-start gap-4 rounded-lg border p-4"
                                            >
                                                <GripVertical className="mt-2 h-5 w-5 cursor-grab text-muted-foreground" />
                                                <div className="grid flex-1 grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`stats.${index}.value`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Value
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="1000+"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`stats.${index}.label`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Label
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Happy Customers"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="mt-8"
                                                    onClick={() =>
                                                        removeStat(index)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <div className="mt-6 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Stats
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Values Tab */}
                            <TabsContent value="values">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Values Section Header
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="values_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Section Title
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Our Values"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="values_subtitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Section Subtitle
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="What we believe in..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="mt-6">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>
                                                    Value Items
                                                </CardTitle>
                                                <CardDescription>
                                                    Add your company values
                                                </CardDescription>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    appendValue({
                                                        icon: 'Star',
                                                        title: '',
                                                        description: '',
                                                    })
                                                }
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Value
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {valueFields.length === 0 && (
                                            <div className="rounded-lg border-2 border-dashed py-8 text-center">
                                                <p className="mb-2 text-muted-foreground">
                                                    No values yet
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        appendValue({
                                                            icon: 'Star',
                                                            title: '',
                                                            description: '',
                                                        })
                                                    }
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add First Value
                                                </Button>
                                            </div>
                                        )}

                                        {valueFields.map((field, index) => (
                                            <motion.div
                                                key={field.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="space-y-4 rounded-lg border p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
                                                        <span className="font-medium">
                                                            Value {index + 1}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeValue(index)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`values.${index}.icon`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Icon
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <select
                                                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                                                        {...field}
                                                                    >
                                                                        {iconOptions.map(
                                                                            (
                                                                                option,
                                                                            ) => (
                                                                                <option
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
                                                                                </option>
                                                                            ),
                                                                        )}
                                                                    </select>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`values.${index}.title`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Title
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Quality First"
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
                                                    name={`values.${index}.description`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Description
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Describe this value..."
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card className="mt-6">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>
                                                    Feature Cards
                                                </CardTitle>
                                                <CardDescription>
                                                    These feed the "Why Choose
                                                    Us" section
                                                </CardDescription>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    appendFeature({
                                                        icon: 'building',
                                                        title: '',
                                                        description: '',
                                                    })
                                                }
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Feature
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {featureFields.length === 0 && (
                                            <div className="rounded-lg border-2 border-dashed py-8 text-center">
                                                <p className="mb-2 text-muted-foreground">
                                                    No features yet
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        appendFeature({
                                                            icon: 'building',
                                                            title: '',
                                                            description: '',
                                                        })
                                                    }
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add First Feature
                                                </Button>
                                            </div>
                                        )}

                                        {featureFields.map((field, index) => (
                                            <motion.div
                                                key={field.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="space-y-4 rounded-lg border p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
                                                        <span className="font-medium">
                                                            Feature {index + 1}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeFeature(index)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`features.${index}.icon`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Icon
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="building"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`features.${index}.title`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Title
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Own Manufacturing"
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
                                                    name={`features.${index}.description`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Description
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Describe this feature"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <div className="mt-6 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Values
                                    </Button>
                                </div>
                            </TabsContent>
                        </form>
                    </Form>

                    {/* Team Tab */}
                    <TabsContent value="team">
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Section Header</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(handleSave)}
                                        className="space-y-4"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="team_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Section Title
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Meet Our Team"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="team_subtitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Section Subtitle
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="The people behind our success..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Header
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Team Members</CardTitle>
                                        <CardDescription>
                                            {teamMembers.length} team members
                                        </CardDescription>
                                    </div>
                                    <Button onClick={openAddTeamDialog}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Member
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {teamMembers.length === 0 ? (
                                    <div className="rounded-lg border-2 border-dashed py-8 text-center">
                                        <User className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                                        <p className="mb-2 text-muted-foreground">
                                            No team members yet
                                        </p>
                                        <Button onClick={openAddTeamDialog}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add First Member
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {teamMembers.map((member) => (
                                            <Card
                                                key={member.id}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex aspect-square items-center justify-center bg-muted">
                                                    {member.image ? (
                                                        <img
                                                            src={`/storage/${member.image}`}
                                                            alt={member.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-16 w-16 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="font-semibold">
                                                        {member.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {member.role}
                                                    </p>
                                                    <div className="mt-3 flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                openEditTeamDialog(
                                                                    member,
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="mr-1 h-4 w-4" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedTeamMember(
                                                                    member,
                                                                );
                                                                setIsDeleteDialogOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="mr-1 h-4 w-4 text-destructive" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Team Member Dialog */}
            <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedTeamMember
                                ? 'Edit Team Member'
                                : 'Add Team Member'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedTeamMember
                                ? 'Update team member details'
                                : 'Add a new team member'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...teamForm}>
                        <form
                            onSubmit={teamForm.handleSubmit(handleTeamSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={teamForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={teamForm.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="CEO & Founder"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={teamForm.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief bio..."
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={teamForm.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile Image</FormLabel>
                                        <FormControl>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) => {
                                                    const file =
                                                        event.target.files?.[0];
                                                    field.onChange(file);
                                                    if (file) {
                                                        const reader =
                                                            new FileReader();
                                                        reader.onloadend = () =>
                                                            setTeamImagePreview(
                                                                reader.result as string,
                                                            );
                                                        reader.readAsDataURL(
                                                            file,
                                                        );
                                                    } else {
                                                        setTeamImagePreview(
                                                            selectedTeamMember?.image
                                                                ? `/storage/${selectedTeamMember.image}`
                                                                : null,
                                                        );
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        {teamImagePreview && (
                                            <div className="mt-3">
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    Preview
                                                </p>
                                                <div className="aspect-square overflow-hidden rounded-lg border">
                                                    <img
                                                        src={teamImagePreview}
                                                        alt="Team member preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={teamForm.control}
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Display Order</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={teamForm.control}
                                    name="social_links.facebook"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Facebook URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://facebook.com/username"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={teamForm.control}
                                    name="social_links.linkedin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LinkedIn URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://linkedin.com/in/username"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={teamForm.control}
                                    name="social_links.instagram"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Instagram URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://instagram.com/username"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={teamForm.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                        <FormLabel className="text-sm font-normal">
                                            Active
                                        </FormLabel>
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
                                    onClick={() => setIsTeamDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Saving...'
                                        : selectedTeamMember
                                          ? 'Update'
                                          : 'Add'}
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
                        <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "
                            {selectedTeamMember?.name}"? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteTeamMember}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
