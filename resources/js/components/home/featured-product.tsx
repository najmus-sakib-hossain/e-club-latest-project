import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { slideInLeftVariants, slideInRightVariants } from '@/lib/animations';
import { useCartStore } from '@/stores/cart-store';
import type { FeaturedProduct as FeaturedProductType, SiteSettings } from '@/types/cms';

interface FeaturedProductProps {
    featured: FeaturedProductType;
    settings?: SiteSettings;
}

export function FeaturedProduct({ featured, settings }: FeaturedProductProps) {
    const addItem = useCartStore((state) => state.addItem);

    // Get dynamic labels from settings
    const labels = {
        noImage: settings?.labels?.no_image_text || 'No Image',
        addToCart: settings?.labels?.add_to_cart_text || 'Add to Cart',
    };

    if (!featured.product) return null;

    const { product } = featured;

    const getProductImage = () => {
        // Prefer featured image, then product images
        if (featured.image) {
            return featured.image.startsWith('http') ? featured.image : `/storage/${featured.image}`;
        }
        if (product.images && product.images.length > 0) {
            const img = product.images[0];
            return img.startsWith('http') ? img : `/storage/${img}`;
        }
        return null;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.sale_price ?? product.price,
            image: getProductImage() || '',
        });
    };

    const productImage = getProductImage();

    return (
        <section className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
                <div className="grid items-center gap-8 md:grid-cols-2">
                    {/* Product Image */}
                    <motion.div
                        className="relative"
                        variants={slideInLeftVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {productImage ? (
                            <img
                                src={productImage}
                                alt={product.name}
                                className="w-full rounded-lg shadow-lg"
                            />
                        ) : (
                            <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                                <span className="text-gray-400">{labels.noImage}</span>
                            </div>
                        )}
                        {featured.badge_text && (
                            <span className="absolute left-4 top-4 rounded bg-red-500 px-3 py-1 text-sm font-medium text-white">
                                {featured.badge_text}
                            </span>
                        )}
                    </motion.div>

                    {/* Product Details */}
                    <motion.div
                        variants={slideInRightVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {featured.subtitle && (
                            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-gray-900">
                                {featured.subtitle}
                            </span>
                        )}
                        <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
                            {featured.title || product.name}
                        </h2>
                        {(featured.description || product.description) && (
                            <p className="mb-6 text-gray-600">{featured.description || product.description}</p>
                        )}

                        {/* Specifications */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="mb-6">
                                <h4 className="mb-3 font-semibold text-gray-900">Dimensions:</h4>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <li key={key}>
                                            <span className="font-medium">{key}:</span> {value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-gray-900">
                                    {formatPrice(product.sale_price ?? product.price)}
                                </span>
                                {product.sale_price && product.sale_price < product.price && (
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <Button
                            size="lg"
                            className="bg-primary text-gray-900 hover:bg-primary/90"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {featured.button_text || labels.addToCart}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
