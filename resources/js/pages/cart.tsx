import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

import { SiteLayout } from '@/components/site/site-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore, selectTotalItems, selectTotalPrice } from '@/stores/cart-store';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import type { Category, SiteSettings } from '@/types/cms';

interface CartPageProps {
    settings?: SiteSettings;
    categories?: Category[];
}

export default function CartPage({ settings, categories }: CartPageProps) {
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    const clearCart = useCartStore((state) => state.clearCart);
    const totalItems = useCartStore(selectTotalItems);
    const totalPrice = useCartStore(selectTotalPrice);

    // Get dynamic content from settings
    const pageTitle = settings?.cart?.cart_page_title || 'Shopping Cart';
    const emptyTitle = settings?.cart?.cart_empty_title || 'Your cart is empty';
    const emptyMessage = settings?.cart?.cart_empty_message || 'Start shopping and add some products to your cart!';
    const summaryTitle = settings?.cart?.cart_summary_title || 'Order Summary';
    const checkoutButton = settings?.cart?.cart_checkout_button || 'Proceed to Checkout';
    const continueShoppingText = settings?.cart?.cart_continue_shopping || 'Continue Shopping';

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (items.length === 0) {
        return (
            <SiteLayout settings={settings} categories={categories}>
                <Head title={pageTitle} />
                <div className="container mx-auto px-4 py-16">
                    <motion.div
                        className="flex flex-col items-center justify-center py-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h2 className="mb-2 text-2xl font-semibold">{emptyTitle}</h2>
                        <p className="mb-8 text-muted-foreground">
                            {emptyMessage}
                        </p>
                        <Button asChild>
                            <Link href="/">{continueShoppingText}</Link>
                        </Button>
                    </motion.div>
                </div>
            </SiteLayout>
        );
    }

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={pageTitle} />

            <div className="container mx-auto p-6">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    <motion.h1 
                        className="mb-8 text-3xl font-bold"
                        variants={fadeInUp}
                    >
                        {pageTitle} ({totalItems} items)
                    </motion.h1>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <motion.div className="lg:col-span-2" variants={fadeInUp}>
                            <Card className="py-6">
                                <CardContent className="divide-y">
                                    {items.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="flex gap-4 py-4 first:pt-0 last:pb-0"
                                        >
                                            {/* Product Image */}
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                                {item.image ? (
                                                    <img
                                                        src={item.image.startsWith('http') ? item.image : `/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
                                                        No image
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex flex-1 flex-col">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-medium">{item.name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {formatPrice(item.price)} each
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                updateQuantity(item.productId, item.quantity - 1)
                                                            }
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="w-8 text-center">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                updateQuantity(item.productId, item.quantity + 1)
                                                            }
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => removeItem(item.productId)}
                                                    >
                                                        <Trash2 className="mr-1 h-4 w-4" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <div className="mt-4 flex justify-between">
                                <Button variant="outline" asChild>
                                    <Link href="/">{continueShoppingText}</Link>
                                </Button>
                                <Button variant="ghost" onClick={clearCart} className="text-destructive">
                                    Clear Cart
                                </Button>
                            </div>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div variants={fadeInUp}>
                            <Card className="sticky top-24 py-6">
                                <CardHeader>
                                    <CardTitle>{summaryTitle}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-primary">Free</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" size="lg" asChild>
                                        <Link href="/checkout">{checkoutButton}</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </SiteLayout>
    );
}
