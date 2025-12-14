import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, Eye, Filter, Grid, Heart, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { SiteLayout, ProductDetailDialog } from '@/components/site';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import type { Category, Product as CMSProduct, SiteSettings } from '@/types/cms';
import type { Product as DialogProduct } from '@/components/site/product-detail-dialog';

interface ProductsIndexProps {
    products: CMSProduct[];
    categories: Category[];
    settings?: SiteSettings;
    filters?: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
        sort?: string;
    };
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
    }).format(amount).replace('BDT', '৳');
};

export default function ProductsIndex({ products, categories, settings, filters }: ProductsIndexProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [sortBy, setSortBy] = useState(filters?.sort || 'newest');
    const [priceRange, setPriceRange] = useState<[number, number]>([
        filters?.minPrice || 0,
        filters?.maxPrice || 100000,
    ]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<DialogProduct | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    
    const addItem = useCartStore((state) => state.addItem);
    const { isInWishlist, toggleItem } = useWishlistStore();

    const getProductImage = (product: CMSProduct) => {
        if (!product.images || product.images.length === 0) return '/placeholder.png';
        const image = product.images[0];
        if (image.startsWith('http')) return image;
        return `/storage/${image}`;
    };

    const getProductImages = (product: CMSProduct): string[] => {
        if (!product.images || product.images.length === 0) {
            return ['/placeholder.png'];
        }
        return product.images.map(img => img.startsWith('http') ? img : `/storage/${img}`);
    };

    const handleAddToCart = (product: CMSProduct, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        addItem({
            productId: product.id,
            name: product.name,
            price: product.sale_price || product.price,
            image: getProductImage(product),
        });
        toast.success(`${product.name} added to cart!`);
    };

    const handleWishlistToggle = (product: CMSProduct, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        const wasInWishlist = isInWishlist(product.id);
        toggleItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            salePrice: product.sale_price,
            image: getProductImage(product),
        });
        toast.success(
            wasInWishlist 
                ? `${product.name} removed from wishlist` 
                : `${product.name} added to wishlist!`
        );
    };

    const handleViewDetails = (product: CMSProduct, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setSelectedProduct({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description ?? undefined,
            price: product.price,
            sale_price: product.sale_price,
            images: getProductImages(product),
            category: product.category ? {
                id: product.category.id,
                name: product.category.name,
                slug: product.category.slug,
            } : undefined,
            stock_quantity: product.stock_quantity,
            is_featured: product.is_featured,
            is_new: product.is_new_arrival,
        });
        setDialogOpen(true);
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (selectedCategory) params.set('category', selectedCategory);
        if (sortBy !== 'newest') params.set('sort', sortBy);
        if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
        if (priceRange[1] < 100000) params.set('maxPrice', priceRange[1].toString());
        
        router.get('/products', Object.fromEntries(params));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSortBy('newest');
        setPriceRange([0, 100000]);
        router.get('/products');
    };

    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <Label className="text-sm font-medium mb-2 block">Search</Label>
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                </div>
            </div>

            {/* Categories */}
            <div>
                <Label className="text-sm font-medium mb-3 block">Categories</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="all-categories"
                            checked={selectedCategory === ''}
                            onCheckedChange={() => setSelectedCategory('')}
                        />
                        <Label htmlFor="all-categories" className="text-sm cursor-pointer">
                            All Categories
                        </Label>
                    </div>
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`cat-${category.id}`}
                                checked={selectedCategory === category.slug}
                                onCheckedChange={() => setSelectedCategory(category.slug)}
                            />
                            <Label htmlFor={`cat-${category.id}`} className="text-sm cursor-pointer">
                                {category.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <Label className="text-sm font-medium mb-3 block">
                    Price Range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </Label>
                <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={100000}
                    min={0}
                    step={1000}
                    className="mt-2"
                />
            </div>

            {/* Apply/Clear Buttons */}
            <div className="flex gap-2">
                <Button onClick={applyFilters} className="flex-1">
                    Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                    Clear
                </Button>
            </div>
        </div>
    );

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="Products" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">Products</span>
                        {selectedCategory && (
                            <>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-foreground font-medium capitalize">
                                    {selectedCategory.replace(/-/g, ' ')}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 bg-card rounded-lg border p-4">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filters
                            </h3>
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {selectedCategory 
                                        ? selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                        : 'All Products'
                                    }
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    {products.length} products found
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {/* Mobile Filter Button */}
                                <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                                    <SheetTrigger asChild className="lg:hidden">
                                        <Button variant="outline" size="sm">
                                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                                            Filters
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80">
                                        <SheetHeader>
                                            <SheetTitle>Filters</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6">
                                            <FilterSidebar />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                {/* Sort */}
                                <Select value={sortBy} onValueChange={(value) => {
                                    setSortBy(value);
                                    const params = new URLSearchParams(window.location.search);
                                    params.set('sort', value);
                                    router.get('/products', Object.fromEntries(params));
                                }}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                                        <SelectItem value="name">Name A-Z</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* View Mode */}
                                <div className="hidden sm:flex border rounded-lg">
                                    <Button
                                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                        size="icon"
                                        className="rounded-r-none"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                        size="icon"
                                        className="rounded-l-none"
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < 100000) && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="text-sm text-muted-foreground">Active filters:</span>
                                {searchQuery && (
                                    <Badge variant="secondary" className="gap-1">
                                        Search: {searchQuery}
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                                    </Badge>
                                )}
                                {selectedCategory && (
                                    <Badge variant="secondary" className="gap-1">
                                        {selectedCategory.replace(/-/g, ' ')}
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                                    </Badge>
                                )}
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    Clear all
                                </Button>
                            </div>
                        )}

                        {/* Products Grid */}
                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-lg">No products found</p>
                                <Button variant="link" onClick={clearFilters}>
                                    Clear filters and try again
                                </Button>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <Card key={product.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-card rounded-xl py-0">
                                        <CardContent className="flex h-full flex-col p-0">
                                            {/* Image Container with Hover Effects */}
                                            <div className="relative bg-muted rounded-t-xl overflow-hidden">
                                                <Link href={`/products/${product.slug}`}>
                                                    <div className="relative aspect-square overflow-hidden">
                                                        <img
                                                            src={getProductImage(product)}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                </Link>
                                                
                                                {/* Badges - Top Left */}
                                                <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
                                                    {product.is_new_arrival && (
                                                        <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">New</Badge>
                                                    )}
                                                    {product.sale_price && (
                                                        <Badge className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5">Sale</Badge>
                                                    )}
                                                </div>

                                                {/* Quick View Button - Top Right */}
                                                <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm text-muted-foreground hover:bg-background hover:text-foreground shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                                                        onClick={(e) => handleViewDetails(product, e)}
                                                        title="Quick View"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className={`h-9 w-9 rounded-full shadow-md transition-all duration-300 ${
                                                            isInWishlist(product.id)
                                                                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                                                : 'bg-background/90 backdrop-blur-sm text-muted-foreground hover:bg-background hover:text-destructive opacity-0 group-hover:opacity-100'
                                                        }`}
                                                        onClick={(e) => handleWishlistToggle(product, e)}
                                                        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                                    >
                                                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                                    </Button>
                                                </div>

                                                {/* Quick Add Button - Bottom */}
                                                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                                                    <Button
                                                        className="w-full bg-foreground hover:bg-foreground/90 text-background font-semibold uppercase tracking-wide text-sm py-2.5 rounded-lg shadow-lg"
                                                        onClick={(e) => handleAddToCart(product, e)}
                                                    >
                                                        Quick Add
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                <Link href={`/products/${product.slug}`}>
                                                    <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <div className="mt-2 flex items-center gap-2">
                                                    {product.sale_price ? (
                                                        <>
                                                            <span className="font-bold text-lg text-foreground">
                                                                {formatCurrency(product.sale_price)}
                                                            </span>
                                                            <span className="text-sm text-muted-foreground line-through">
                                                                {formatCurrency(product.price)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold text-lg text-foreground">
                                                            {formatCurrency(product.price)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {products.map((product) => (
                                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow py-0 bg-card">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="sm:w-48 shrink-0 relative group">
                                                <Link href={`/products/${product.slug}`}>
                                                    <div className="relative aspect-square sm:aspect-auto sm:h-full bg-muted">
                                                        <img
                                                            src={getProductImage(product)}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </Link>
                                                {/* Quick View Button */}
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/90 text-muted-foreground hover:bg-background shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                                                    onClick={(e) => handleViewDetails(product, e)}
                                                    title="Quick View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <CardContent className="p-4 flex-1">
                                                <Link href={`/products/${product.slug}`}>
                                                    <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                                    {product.description}
                                                </p>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {product.sale_price ? (
                                                            <>
                                                                <span className="font-bold text-xl text-foreground">
                                                                    {formatCurrency(product.sale_price)}
                                                                </span>
                                                                <span className="text-muted-foreground line-through">
                                                                    {formatCurrency(product.price)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-bold text-xl text-foreground">
                                                                {formatCurrency(product.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Button onClick={(e) => handleAddToCart(product, e)}>
                                                        Add to Cart
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Detail Dialog */}
            <ProductDetailDialog
                product={selectedProduct}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </SiteLayout>
    );
}
