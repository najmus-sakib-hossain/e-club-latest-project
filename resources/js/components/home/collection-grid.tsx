import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';

import { Card, CardContent } from '@/components/ui/card';
import {
    imageHoverVariants,
    staggerContainerVariants,
    staggerItemVariants,
} from '@/lib/animations';
import { getImageUrl } from '@/lib/utils';
import type { Category } from '@/types/cms';

interface CollectionGridProps {
    title: string;
    categories: Category[];
    columns?: 2 | 3 | 4;
}

export function CollectionGrid({
    title,
    categories,
    columns = 3,
}: CollectionGridProps) {
    if (categories.length === 0) return null;

    const gridCols = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    };

    // Generate a gradient based on the category name for placeholder using design tokens
    const getPlaceholderGradient = (name: string) => {
        const gradients = [
            'from-primary/10 to-primary/20',
            'from-accent/20 to-accent/40',
            'from-secondary/20 to-secondary/40',
            'from-muted to-muted/70',
            'from-chart-1/25 to-chart-2/20',
            'from-chart-3/25 to-chart-4/20',
        ];
        const index = name.charCodeAt(0) % gradients.length;
        return gradients[index];
    };

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <motion.h2
                    className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {title}
                </motion.h2>
                <motion.div
                    className={`grid gap-6 ${gridCols[columns]}`}
                    variants={staggerContainerVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            variants={staggerItemVariants}
                        >
                            <Link
                                href={`/products?category=${encodeURIComponent(category.slug)}`}
                            >
                                <Card className="group overflow-hidden py-0">
                                    <CardContent className="p-0">
                                        <motion.div
                                            className="aspect-[4/3] overflow-hidden"
                                            variants={imageHoverVariants}
                                            initial="initial"
                                            whileHover="hover"
                                        >
                                            {getImageUrl(category.image) ? (
                                                <img
                                                    src={
                                                        getImageUrl(
                                                            category.image,
                                                        )!
                                                    }
                                                    alt={category.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div
                                                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${getPlaceholderGradient(category.name)}`}
                                                >
                                                    <span className="text-2xl font-bold text-muted-foreground/50">
                                                        {category.name.charAt(
                                                            0,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>
                                        <div className="p-4 text-center">
                                            <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                                                {category.name}
                                            </h3>
                                            {category.description && (
                                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                    {category.description}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
