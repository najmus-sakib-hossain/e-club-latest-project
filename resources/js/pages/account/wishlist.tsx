import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Heart, Trash2, ShoppingCart, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { SiteLayout } from '@/components/site';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';
import type { Category, SiteSettings } from '@/types/cms';

interface WishlistPageProps {
    settings?: SiteSettings;
    categories?: Category[];
}

export default function WishlistPage({ settings, categories }: WishlistPageProps) {
    const { items, removeItem, clearWishlist } = useWishlistStore();
    const addToCart = useCartStore((state) => state.addItem);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleAddToCart = (item: typeof items[0]) => {
        addToCart({
            productId: item.productId,
            name: item.name,
            price: item.salePrice || item.price,
            image: item.image,
        });
        toast.success(`${item.name} added to cart!`);
    };

    const handleRemove = (productId: number, name: string) => {
        removeItem(productId);
        toast.success(`${name} removed from wishlist`);
    };

    const handleClearWishlist = () => {
        clearWishlist();
        toast.success('Wishlist cleared');
    };

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="My Wishlist" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/account" className="hover:text-primary">Account</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">Wishlist</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">My Wishlist</h1>
                        <p className="text-muted-foreground">
                            {items.length} {items.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                    {items.length > 0 && (
                        <Button variant="outline" onClick={handleClearWishlist}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear Wishlist
                        </Button>
                    )}
                </div>

                {items.length === 0 ? (
                    <Card>
                        <CardContent className="py-16">
                            <div className="text-center">
                                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                                <p className="text-muted-foreground mb-6">
                                    Save items you love by clicking the heart icon on product pages.
                                </p>
                                <Button asChild>
                                    <Link href="/products">Browse Products</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={item.productId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                                        <Link href={`/products/${item.slug}`}>
                                            <div className="relative aspect-square bg-muted">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="h-12 w-12 text-muted-foreground" />
                                                    </div>
                                                )}
                                                {item.salePrice && (
                                                    <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded">
                                                        Sale
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                        <CardContent className="p-4">
                                            <Link href={`/products/${item.slug}`}>
                                                <h3 className="font-medium truncate hover:text-primary transition-colors">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1 mb-4">
                                                {item.salePrice ? (
                                                    <>
                                                        <span className="font-semibold text-primary">
                                                            {formatPrice(item.salePrice)}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="font-semibold">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex-1"
                                                    onClick={() => handleAddToCart(item)}
                                                >
                                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                                    Add to Cart
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleRemove(item.productId, item.name)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Continue Shopping */}
                <div className="mt-8 text-center">
                    <Button variant="outline" asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        </SiteLayout>
    );
}
