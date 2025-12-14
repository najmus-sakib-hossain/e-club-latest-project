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

export default function Categories({ settings, categories, allCategories }: CategoriesProps) {
    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="Categories" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">Categories</span>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="bg-primary/10 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">Browse Categories</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore our wide range of e-club categories to find the perfect pieces for your home or office.
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    {allCategories.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No categories found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {allCategories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.slug}`}
                                    className="group"
                                >
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="aspect-square bg-muted relative overflow-hidden">
                                            {category.image ? (
                                                <img
                                                    src={category.image.startsWith('http') ? category.image : `/storage/${category.image}`}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                                    <span className="text-muted-foreground text-sm">No image</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-primary-foreground font-medium">View Products</span>
                                            </div>
                                        </div>
                                        <CardContent className="p-4 text-center">
                                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                                {category.name}
                                            </h3>
                                            {category.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
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
