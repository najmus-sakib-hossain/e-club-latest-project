import { Link } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Minus,
    Plus,
    RefreshCw,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Truck,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';

export interface Product {
    id: number;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    price: number;
    sale_price?: number | null;
    images: string[];
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    stock_quantity?: number;
    is_featured?: boolean;
    is_new?: boolean;
    rating?: number;
    review_count?: number;
}

interface ProductDetailDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({
    product,
    open,
    onOpenChange,
}: ProductDetailDialogProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    if (!product) return null;

    const images =
        product.images?.length > 0
            ? product.images
            : [
                  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
              ];

    const hasDiscount =
        product.sale_price && product.sale_price < product.price;
    const displayPrice = hasDiscount ? product.sale_price : product.price;
    const discountPercentage = hasDiscount
        ? Math.round(
              ((product.price - product.sale_price!) / product.price) * 100,
          )
        : 0;

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

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: displayPrice!,
            image: images[0],
        });
        // Add multiple if quantity > 1
        for (let i = 1; i < quantity; i++) {
            addItem({
                productId: product.id,
                name: product.name,
                price: displayPrice!,
                image: images[0],
            });
        }
        toast.success(`${product.name} added to cart!`, {
            description: `Quantity: ${quantity}`,
        });
        setQuantity(1);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + images.length) % images.length,
        );
    };

    const isInStock =
        product.stock_quantity === undefined || product.stock_quantity > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>{product.name}</DialogTitle>
                    <DialogDescription>
                        Product details and options
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-0 md:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="relative aspect-square bg-muted md:aspect-auto md:min-h-[500px]">
                        {/* Main Image */}
                        <img
                            src={images[currentImageIndex]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />

                        {/* Image Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute top-1/2 left-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 shadow-md transition-colors hover:bg-card"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 shadow-md transition-colors hover:bg-card"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>

                                {/* Image Dots */}
                                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentImageIndex(index)
                                            }
                                            className={`h-2.5 w-2.5 rounded-full transition-colors ${
                                                index === currentImageIndex
                                                    ? 'bg-primary'
                                                    : 'bg-card/70 hover:bg-card'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.is_new && (
                                <Badge variant="secondary">New</Badge>
                            )}
                            {hasDiscount && (
                                <Badge variant="destructive">
                                    -{discountPercentage}%
                                </Badge>
                            )}
                            {product.is_featured && <Badge>Featured</Badge>}
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-md transition-colors hover:bg-muted">
                                <Heart className="h-5 w-5 text-muted-foreground" />
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-md transition-colors hover:bg-muted">
                                <Share2 className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col p-6">
                        {/* Category */}
                        {product.category && (
                            <Link
                                href={`/products?category=${product.category.slug}`}
                                className="mb-2 text-sm text-primary hover:underline"
                            >
                                {product.category.name}
                            </Link>
                        )}

                        {/* Name */}
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">
                            {product.name}
                        </h2>

                        {/* Rating */}
                        {product.rating !== undefined && (
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i <
                                                Math.floor(product.rating || 0)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                    ({product.review_count || 0} reviews)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="mb-4 flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-primary">
                                {formatPrice(displayPrice!)}
                            </span>
                            {hasDiscount && (
                                <span className="text-lg text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="mb-4">
                            {isInStock ? (
                                <span className="inline-flex items-center text-sm text-green-600">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                                    In Stock
                                    {product.stock_quantity !== undefined &&
                                        product.stock_quantity < 10 && (
                                            <span className="ml-1 text-gray-500">
                                                (Only {product.stock_quantity}{' '}
                                                left)
                                            </span>
                                        )}
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-sm text-red-600">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-red-500" />
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {(product.short_description || product.description) && (
                            <p className="mb-6 line-clamp-3 text-sm text-gray-600">
                                {product.short_description ||
                                    product.description}
                            </p>
                        )}

                        <Separator className="my-4" />

                        {/* Quantity Selector */}
                        <div className="mb-6 flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">
                                Quantity:
                            </span>
                            <div className="flex items-center rounded-lg border">
                                <button
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="rounded-l-lg p-2.5 transition-colors hover:bg-gray-100"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-[3rem] px-6 py-2 text-center font-medium">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="rounded-r-lg p-2.5 transition-colors hover:bg-gray-100"
                                    disabled={
                                        product.stock_quantity !== undefined &&
                                        quantity >= product.stock_quantity
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="mb-6 flex gap-3">
                            <Button
                                className="h-12 flex-1 bg-primary font-semibold text-gray-900 hover:bg-primary/90"
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Button variant="outline" className="h-12">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="mt-auto space-y-3 border-t pt-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Truck className="h-5 w-5 text-primary" />
                                <span>Free shipping on orders over ৳5,000</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <RefreshCw className="h-5 w-5 text-primary" />
                                <span>7-day easy returns</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Shield className="h-5 w-5 text-primary" />
                                <span>1 year warranty</span>
                            </div>
                        </div>

                        {/* View Full Details Link */}
                        <Link
                            href={`/products/${product.slug}`}
                            className="mt-4 text-center text-sm font-medium text-primary hover:underline"
                            onClick={() => onOpenChange(false)}
                        >
                            View Full Product Details →
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
