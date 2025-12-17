import { Head, Link } from '@inertiajs/react';
import {
    ChevronRight,
    Heart,
    Minus,
    Plus,
    RotateCcw,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Truck,
} from 'lucide-react';
import { useState } from 'react';

import { SiteLayout } from '@/components/site';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import type { Category, Product, SiteSettings } from '@/types/cms';
import { toast } from 'sonner';

interface ProductShowProps {
    product: Product;
    relatedProducts: Product[];
    categories: Category[];
    settings?: SiteSettings;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
    })
        .format(amount)
        .replace('BDT', '৳');
};

export default function ProductShow({
    product,
    relatedProducts,
    categories,
    settings,
}: ProductShowProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const addItem = useCartStore((state) => state.addItem);
    const { isInWishlist, toggleItem } = useWishlistStore();

    const isWishlisted = isInWishlist(product.id);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem({
                productId: product.id,
                name: product.name,
                price: product.sale_price || product.price,
                image: product.images?.[0] || '/placeholder.png',
            });
        }
        toast.success(`${product.name} added to cart!`);
    };

    const handleWishlistToggle = () => {
        toggleItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            salePrice: product.sale_price,
            image: product.images?.[0] || '/placeholder.png',
        });
        toast.success(
            isWishlisted
                ? `${product.name} removed from wishlist`
                : `${product.name} added to wishlist!`,
        );
    };

    const incrementQuantity = () => {
        if (quantity < product.stock_quantity) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const discountPercentage = product.sale_price
        ? Math.round(
              ((product.price - product.sale_price) / product.price) * 100,
          )
        : 0;

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title={product.name} />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/products" className="hover:text-primary">
                            Products
                        </Link>
                        {product.category && (
                            <>
                                <ChevronRight className="h-4 w-4" />
                                <Link
                                    href={`/products?category=${product.category.slug}`}
                                    className="hover:text-primary"
                                >
                                    {product.category.name}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="h-4 w-4" />
                        <span className="max-w-[200px] truncate font-medium text-foreground">
                            {product.name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                            <img
                                src={
                                    product.images?.[selectedImage] ||
                                    '/placeholder.png'
                                }
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                            {product.sale_price && (
                                <Badge className="absolute top-4 left-4 bg-destructive px-3 py-1 text-lg text-destructive-foreground">
                                    -{discountPercentage}%
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                                            selectedImage === index
                                                ? 'border-primary'
                                                : 'border-transparent'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            {product.is_new_arrival && (
                                <Badge className="mb-2 bg-primary text-primary-foreground">
                                    New Arrival
                                </Badge>
                            )}
                            <h1 className="text-2xl font-bold lg:text-3xl">
                                {product.name}
                            </h1>
                            {product.sku && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    SKU: {product.sku}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            {product.sale_price ? (
                                <>
                                    <span className="text-3xl font-bold text-primary">
                                        {formatCurrency(product.sale_price)}
                                    </span>
                                    <span className="text-xl text-muted-foreground line-through">
                                        {formatCurrency(product.price)}
                                    </span>
                                    <Badge variant="destructive">
                                        Save {discountPercentage}%
                                    </Badge>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-primary">
                                    {formatCurrency(product.price)}
                                </span>
                            )}
                        </div>

                        {/* Short Description */}
                        {product.description && (
                            <p className="leading-relaxed text-muted-foreground">
                                {product.description.substring(0, 200)}
                                {product.description.length > 200 && '...'}
                            </p>
                        )}

                        <Separator />

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Availability:
                            </span>
                            {product.stock_quantity > 0 ? (
                                <Badge
                                    variant="outline"
                                    className="border-primary text-primary"
                                >
                                    In Stock ({product.stock_quantity}{' '}
                                    available)
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="border-destructive text-destructive"
                                >
                                    Out of Stock
                                </Badge>
                            )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex items-center rounded-lg border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium">
                                    {quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={incrementQuantity}
                                    disabled={
                                        quantity >= product.stock_quantity
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                size="lg"
                                className="flex-1"
                                onClick={handleAddToCart}
                                disabled={product.stock_quantity === 0}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Button
                                variant={isWishlisted ? 'default' : 'outline'}
                                size="lg"
                                onClick={handleWishlistToggle}
                                className={
                                    isWishlisted
                                        ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                        : ''
                                }
                            >
                                <Heart
                                    className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`}
                                />
                            </Button>
                            <Button variant="outline" size="lg">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
                            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                                <Truck className="h-5 w-5 text-primary" />
                                <div className="text-sm">
                                    <p className="font-medium">Free Delivery</p>
                                    <p className="text-muted-foreground">
                                        On orders over ৳5000
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                                <Shield className="h-5 w-5 text-primary" />
                                <div className="text-sm">
                                    <p className="font-medium">
                                        2 Year Warranty
                                    </p>
                                    <p className="text-muted-foreground">
                                        Quality guarantee
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                                <RotateCcw className="h-5 w-5 text-primary" />
                                <div className="text-sm">
                                    <p className="font-medium">Easy Returns</p>
                                    <p className="text-muted-foreground">
                                        7 days return policy
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        {product.category && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">
                                    Category:
                                </span>
                                <Link
                                    href={`/products?category=${product.category.slug}`}
                                    className="text-primary hover:underline"
                                >
                                    {product.category.name}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="mt-12">
                    <Tabs defaultValue="description">
                        <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
                            <TabsTrigger
                                value="description"
                                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                Description
                            </TabsTrigger>
                            <TabsTrigger
                                value="specifications"
                                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                Specifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                Reviews
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="mt-6">
                            <div className="prose max-w-none">
                                <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                                    {product.description ||
                                        'No description available.'}
                                </p>
                            </div>
                        </TabsContent>
                        <TabsContent value="specifications" className="mt-6">
                            {product.specifications ? (
                                <div className="grid gap-4">
                                    {Object.entries(product.specifications).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex border-b pb-3"
                                            >
                                                <span className="w-1/3 text-muted-foreground capitalize">
                                                    {key.replace(/_/g, ' ')}
                                                </span>
                                                <span className="w-2/3 font-medium">
                                                    {value}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">
                                    No specifications available.
                                </p>
                            )}
                        </TabsContent>
                        <TabsContent value="reviews" className="mt-6">
                            <div className="py-8 text-center">
                                <Star className="mx-auto mb-4 h-12 w-12 text-muted-foreground/60" />
                                <p className="text-muted-foreground">
                                    No reviews yet.
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground/70">
                                    Be the first to review this product!
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="mb-6 text-2xl font-bold">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {relatedProducts.map((relatedProduct) => (
                                <Card
                                    key={relatedProduct.id}
                                    className="group overflow-hidden pt-0"
                                >
                                    <Link
                                        href={`/products/${relatedProduct.slug}`}
                                    >
                                        <div className="relative aspect-square bg-muted">
                                            <img
                                                src={
                                                    relatedProduct
                                                        .images?.[0] ||
                                                    '/placeholder.png'
                                                }
                                                alt={relatedProduct.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    </Link>
                                    <CardContent className="p-4">
                                        <Link
                                            href={`/products/${relatedProduct.slug}`}
                                        >
                                            <h3 className="line-clamp-2 text-sm font-medium hover:text-primary">
                                                {relatedProduct.name}
                                            </h3>
                                        </Link>
                                        <p className="mt-2 font-bold text-primary">
                                            {formatCurrency(
                                                relatedProduct.sale_price ||
                                                    relatedProduct.price,
                                            )}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </SiteLayout>
    );
}
