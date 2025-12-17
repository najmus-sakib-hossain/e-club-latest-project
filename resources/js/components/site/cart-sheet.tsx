import { Link } from '@inertiajs/react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useCartStore } from '@/stores/cart-store';

interface CartSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children?: React.ReactNode;
}

export function CartSheet({ open, onOpenChange, children }: CartSheetProps) {
    const { items, updateQuantity, removeItem, clearCart } = useCartStore();

    const subtotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );
    const shipping = subtotal > 5000 ? 0 : 150; // Free shipping over ৳5000
    const total = subtotal + shipping;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
            .format(price)
            .replace('BDT', '৳');
    };

    return (
        <>
            {children}
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="flex w-full flex-col sm:max-w-lg">
                    <SheetHeader className="space-y-2.5 pr-6">
                        <SheetTitle className="flex items-center gap-2 px-1">
                            <ShoppingBag className="h-5 w-5" />
                            Shopping Cart
                            {items.length > 0 && (
                                <span className="text-sm font-normal text-muted-foreground">
                                    ({items.length}{' '}
                                    {items.length === 1 ? 'item' : 'items'})
                                </span>
                            )}
                        </SheetTitle>
                        <SheetDescription className="px-2">
                            {items.length > 0
                                ? 'Review your items before checkout'
                                : 'Your cart is empty'}
                        </SheetDescription>
                    </SheetHeader>

                    {items.length === 0 ? (
                        <div className="mx-auto flex w-[95%] flex-1 flex-col items-center justify-center">
                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                                <ShoppingBag className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                Your cart is empty
                            </h3>
                            <p className="mb-6 max-w-[250px] text-center text-sm text-gray-500">
                                Looks like you haven't added any items to your
                                cart yet.
                            </p>
                            <Button
                                onClick={() => onOpenChange(false)}
                                className="bg-primary text-gray-900 hover:bg-primary/90"
                                asChild
                            >
                                <Link href="/products">Start Shopping</Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <ScrollArea className="mx-auto w-[95%] flex-1">
                                <div className="space-y-4 py-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="flex gap-4 rounded-lg bg-gray-50 p-3"
                                        >
                                            {/* Product Image */}
                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-white">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate text-sm font-medium text-gray-900">
                                                    {item.name}
                                                </h4>
                                                <p className="mt-1 text-sm font-semibold text-primary">
                                                    {formatPrice(item.price)}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="mt-2 flex items-center justify-between">
                                                    <div className="flex items-center rounded-md border">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.productId,
                                                                    item.quantity -
                                                                        1,
                                                                )
                                                            }
                                                            className="p-1.5 transition-colors hover:bg-gray-100"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="h-3.5 w-3.5" />
                                                        </button>
                                                        <span className="min-w-[2rem] px-3 py-1 text-center text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.productId,
                                                                    item.quantity +
                                                                        1,
                                                                )
                                                            }
                                                            className="p-1.5 transition-colors hover:bg-gray-100"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            removeItem(
                                                                item.productId,
                                                            )
                                                        }
                                                        className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* Cart Summary */}
                            <div className="mx-auto w-[90%] space-y-4 border-t py-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Subtotal
                                        </span>
                                        <span className="font-medium">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Shipping
                                        </span>
                                        <span className="font-medium">
                                            {shipping === 0 ? (
                                                <span className="text-green-600">
                                                    Free
                                                </span>
                                            ) : (
                                                formatPrice(shipping)
                                            )}
                                        </span>
                                    </div>
                                    {shipping > 0 && subtotal < 5000 && (
                                        <p className="text-xs text-gray-500">
                                            Add {formatPrice(5000 - subtotal)}{' '}
                                            more for free shipping!
                                        </p>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between text-base font-semibold">
                                        <span>Total</span>
                                        <span className="text-primary">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <Button
                                        className="w-full bg-primary font-semibold text-gray-900 hover:bg-primary/90"
                                        size="lg"
                                        asChild
                                    >
                                        <Link
                                            href="/checkout"
                                            onClick={() => onOpenChange(false)}
                                        >
                                            Proceed to Checkout
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        size="lg"
                                        asChild
                                    >
                                        <Link
                                            href="/cart"
                                            onClick={() => onOpenChange(false)}
                                        >
                                            View Full Cart
                                        </Link>
                                    </Button>
                                </div>

                                {/* Clear Cart */}
                                <button
                                    onClick={clearCart}
                                    className="w-full text-center text-sm text-red-500 hover:text-red-600 hover:underline"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}
