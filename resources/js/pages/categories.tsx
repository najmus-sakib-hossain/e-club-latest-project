import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { SiteLayout } from '@/components/site';
import { Card, CardContent } from '@/components/ui/card';
import type { Category, SiteSettings } from '@/types/cms';

interface CategoriesProps {
    settings?: SiteSettings;
    categories?: Category[];
    allCategories: Category[];
}

export default function Categories({
    settings,
    categories,
    allCategories,
}: CategoriesProps) {
    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="Categories" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-foreground">
                            Categories
                        </span>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="bg-primary/10 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="mb-4 text-3xl font-bold lg:text-4xl">
                        Browse Categories
                    </h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Explore our wide range of e-club categories to find the
                        perfect pieces for your home or office.
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    {allCategories.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-muted-foreground">
                                No categories found.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                            {allCategories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.slug}`}
                                    className="group"
                                >
                                    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                                        <div className="relative aspect-square overflow-hidden bg-muted">
                                            {category.image ? (
                                                <img
                                                    src={
                                                        category.image.startsWith(
                                                            'http',
                                                        )
                                                            ? category.image
                                                            : `/storage/${category.image}`
                                                    }
                                                    alt={category.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                                    <span className="text-sm text-muted-foreground">
                                                        No image
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                <span className="font-medium text-primary-foreground">
                                                    View Products
                                                </span>
                                            </div>
                                        </div>
                                        <CardContent className="p-4 text-center">
                                            <h3 className="mb-1 text-lg font-semibold transition-colors group-hover:text-primary">
                                                {category.name}
                                            </h3>
                                            {category.description && (
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {category.description}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}
