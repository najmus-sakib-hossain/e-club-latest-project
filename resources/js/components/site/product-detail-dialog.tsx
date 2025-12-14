import { Link } from '@inertiajs/react';
import { 
    ChevronLeft, 
    ChevronRight, 
    Heart, 
    Minus, 
    Plus, 
    Share2, 
    ShoppingCart, 
    Star, 
    Truck,
    Shield,
    RefreshCw,
    X
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    if (!product) return null;

    const images = product.images?.length > 0 
        ? product.images 
        : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop'];
    
    const hasDiscount = product.sale_price && product.sale_price < product.price;
    const displayPrice = hasDiscount ? product.sale_price : product.price;
    const discountPercentage = hasDiscount 
        ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
        : 0;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price).replace('BDT', '৳');
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
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const isInStock = product.stock_quantity === undefined || product.stock_quantity > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>{product.name}</DialogTitle>
                    <DialogDescription>Product details and options</DialogDescription>
                </DialogHeader>
                
                <div className="grid md:grid-cols-2 gap-0">
                    {/* Image Gallery */}
                    <div className="relative bg-muted aspect-square md:aspect-auto md:min-h-[500px]">
                        {/* Main Image */}
                        <img
                            src={images[currentImageIndex]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Image Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 hover:bg-card rounded-full flex items-center justify-center shadow-md transition-colors"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 hover:bg-card rounded-full flex items-center justify-center shadow-md transition-colors"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>

                                {/* Image Dots */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2.5 h-2.5 rounded-full transition-colors ${
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
                                <Badge variant="destructive">-{discountPercentage}%</Badge>
                            )}
                            {product.is_featured && (
                                <Badge>Featured</Badge>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors">
                                <Heart className="h-5 w-5 text-muted-foreground" />
                            </button>
                            <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors">
                                <Share2 className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6 flex flex-col">
                        {/* Category */}
                        {product.category && (
                            <Link 
                                href={`/products?category=${product.category.slug}`}
                                className="text-sm text-primary hover:underline mb-2"
                            >
                                {product.category.name}
                            </Link>
                        )}

                        {/* Name */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {product.name}
                        </h2>

                        {/* Rating */}
                        {product.rating !== undefined && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i < Math.floor(product.rating || 0)
                                                    ? 'text-yellow-400 fill-yellow-400'
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
                        <div className="flex items-baseline gap-3 mb-4">
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
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                    In Stock
                                    {product.stock_quantity !== undefined && product.stock_quantity < 10 && (
                                        <span className="text-gray-500 ml-1">
                                            (Only {product.stock_quantity} left)
                                        </span>
                                    )}
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-sm text-red-600">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {(product.short_description || product.description) && (
                            <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                {product.short_description || product.description}
                            </p>
                        )}

                        <Separator className="my-4" />

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center border rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2.5 hover:bg-gray-100 transition-colors rounded-l-lg"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-6 py-2 text-center font-medium min-w-[3rem]">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2.5 hover:bg-gray-100 transition-colors rounded-r-lg"
                                    disabled={product.stock_quantity !== undefined && quantity >= product.stock_quantity}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="flex gap-3 mb-6">
                            <Button
                                className="flex-1 bg-primary text-gray-900 hover:bg-primary/90 font-semibold h-12"
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Add to Cart
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12"
                            >
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mt-auto pt-4 border-t">
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
                            className="mt-4 text-center text-sm text-primary hover:underline font-medium"
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
