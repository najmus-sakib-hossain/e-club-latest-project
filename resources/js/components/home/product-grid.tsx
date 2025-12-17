import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import {
    Product as DialogProduct,
    ProductDetailDialog,
} from '@/components/site/product-detail-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    imageHoverVariants,
    staggerContainerVariants,
    staggerItemVariants,
} from '@/lib/animations';
import { getImageUrl } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import type { Product } from '@/types/cms';
import { toast } from 'sonner';

interface ProductGridProps {
    title: string;
    subtitle?: string;
    products: Product[];
}

export function ProductGrid({ title, subtitle, products }: ProductGridProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [selectedProduct, setSelectedProduct] =
        useState<DialogProduct | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    if (products.length === 0) return null;

    const getProductImage = (product: Product) => {
        if (!product.images || product.images.length === 0) return null;
        return getImageUrl(product.images[0]);
    };

    const getProductImages = (product: Product): string[] => {
        if (!product.images || product.images.length === 0) {
            return [
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
            ];
        }
        return product.images.map((img) => getImageUrl(img) || img);
    };

    const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        addItem({
            productId: product.id,
            name: product.name,
            price: product.sale_price ?? product.price,
            image: getProductImage(product) || '',
        });
        toast.success(`${product.name} added to cart!`);
    };

    const handleViewDetails = (product: Product, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setSelectedProduct({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            sale_price: product.sale_price,
            images: getProductImages(product),
            category: product.category
                ? {
                      id: product.category.id,
                      name: product.category.name,
                      slug: product.category.slug,
                  }
                : undefined,
            stock_quantity: product.stock_quantity,
            is_featured: product.is_featured,
            is_new: product.is_new_arrival,
        });
        setDialogOpen(true);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <section className="bg-muted py-12">
            <div className="container mx-auto px-4">
                <motion.div
                    className="mb-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        You Are in <span className="text-primary">{title}</span>
                        {subtitle && (
                            <span className="text-primary"> {subtitle}</span>
                        )}
                    </h2>
                </motion.div>

                <motion.div
                    className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                    variants={staggerContainerVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {products.map((product) => {
                        const isOnSale =
                            product.sale_price !== null &&
                            product.sale_price < product.price;
                        const displayPrice =
                            product.sale_price ?? product.price;

                        return (
                            <motion.div
                                key={product.id}
                                variants={staggerItemVariants}
                            >
                                <Card className="group h-full overflow-hidden rounded-xl border-0 bg-card py-0 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                                    <CardContent className="flex h-full flex-col p-0">
                                        {/* Image Container with Hover Effects */}
                                        <div className="relative overflow-hidden rounded-t-xl bg-muted">
                                            <Link
                                                href={`/products/${product.slug}`}
                                            >
                                                <motion.div
                                                    className="relative aspect-square overflow-hidden"
                                                    variants={
                                                        imageHoverVariants
                                                    }
                                                    initial="initial"
                                                    whileHover="hover"
                                                >
                                                    {getProductImage(
                                                        product,
                                                    ) ? (
                                                        <img
                                                            src={
                                                                getProductImage(
                                                                    product,
                                                                )!
                                                            }
                                                            alt={product.name}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                                                            <span className="text-sm text-muted-foreground">
                                                                No Image
                                                            </span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </Link>

                                            {/* Badges - Top Left */}
                                            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                                                {product.is_new_arrival && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="px-2 py-0.5 text-xs"
                                                    >
                                                        New
                                                    </Badge>
                                                )}
                                                {isOnSale && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="px-2 py-0.5 text-xs"
                                                    >
                                                        Sale
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Quick View Button - Top Right */}
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-card/90 text-muted-foreground opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-card hover:text-foreground"
                                                onClick={(e) =>
                                                    handleViewDetails(
                                                        product,
                                                        e,
                                                    )
                                                }
                                                title="Quick View"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            {/* Quick Add Button - Bottom */}
                                            <div className="absolute right-0 bottom-0 left-0 z-10 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                                                <Button
                                                    className="w-full rounded-lg bg-foreground py-2.5 text-sm font-semibold tracking-wide text-background uppercase shadow-lg hover:bg-foreground/90"
                                                    onClick={(e) =>
                                                        handleAddToCart(
                                                            product,
                                                            e,
                                                        )
                                                    }
                                                >
                                                    Quick Add
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col p-4">
                                            <Link
                                                href={`/products/${product.slug}`}
                                            >
                                                <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 transition-colors hover:text-primary">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <div className="mt-auto">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {formatPrice(
                                                            displayPrice,
                                                        )}
                                                    </span>
                                                    {isOnSale && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            {formatPrice(
                                                                product.price,
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Product Detail Dialog */}
            <ProductDetailDialog
                product={selectedProduct}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </section>
    );
}
