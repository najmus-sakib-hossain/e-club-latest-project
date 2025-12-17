import { Head, Link } from '@inertiajs/react';
import {
    ChevronRight,
    Heart,
    Package,
    ShoppingCart,
    Trash2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { SiteLayout } from '@/components/site';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import type { Category, SiteSettings } from '@/types/cms';
import { toast } from 'sonner';

interface WishlistPageProps {
    settings?: SiteSettings;
    categories?: Category[];
}

export default function WishlistPage({
    settings,
    categories,
}: WishlistPageProps) {
    const { items, removeItem, clearWishlist } = useWishlistStore();
    const addToCart = useCartStore((state) => state.addItem);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleAddToCart = (item: (typeof items)[0]) => {
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
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/account" className="hover:text-primary">
                            Account
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-foreground">
                            Wishlist
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">My Wishlist</h1>
                        <p className="text-muted-foreground">
                            {items.length}{' '}
                            {items.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                    {items.length > 0 && (
                        <Button variant="outline" onClick={handleClearWishlist}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear Wishlist
                        </Button>
                    )}
                </div>

                {items.length === 0 ? (
                    <Card>
                        <CardContent className="py-16">
                            <div className="text-center">
                                <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                                <h2 className="mb-2 text-xl font-semibold">
                                    Your wishlist is empty
                                </h2>
                                <p className="mb-6 text-muted-foreground">
                                    Save items you love by clicking the heart
                                    icon on product pages.
                                </p>
                                <Button asChild>
                                    <Link href="/products">
                                        Browse Products
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                                    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                                        <Link href={`/products/${item.slug}`}>
                                            <div className="relative aspect-square bg-muted">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Package className="h-12 w-12 text-muted-foreground" />
                                                    </div>
                                                )}
                                                {item.salePrice && (
                                                    <span className="absolute top-2 left-2 rounded bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">
                                                        Sale
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                        <CardContent className="p-4">
                                            <Link
                                                href={`/products/${item.slug}`}
                                            >
                                                <h3 className="truncate font-medium transition-colors hover:text-primary">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <div className="mt-1 mb-4 flex items-center gap-2">
                                                {item.salePrice ? (
                                                    <>
                                                        <span className="font-semibold text-primary">
                                                            {formatPrice(
                                                                item.salePrice,
                                                            )}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            {formatPrice(
                                                                item.price,
                                                            )}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="font-semibold">
                                                        {formatPrice(
                                                            item.price,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex-1"
                                                    onClick={() =>
                                                        handleAddToCart(item)
                                                    }
                                                >
                                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                                    Add to Cart
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleRemove(
                                                            item.productId,
                                                            item.name,
                                                        )
                                                    }
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
