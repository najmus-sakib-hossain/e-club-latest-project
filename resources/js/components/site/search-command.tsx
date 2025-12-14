import { useCallback, useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, Package, Tag, Loader2 } from 'lucide-react';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import type { Product, Category } from '@/types/cms';

interface SearchCommandProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface SearchResults {
    products: Product[];
    categories: Category[];
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults>({ products: [], categories: [] });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch products based on search query
    const searchProducts = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            // Load some default products when no query
            try {
                setIsLoading(true);
                const response = await fetch('/api/search?limit=8');
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Failed to search products:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        if (!open) return;

        const timer = setTimeout(() => {
            searchProducts(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, open, searchProducts]);

    // Load initial data when opened
    useEffect(() => {
        if (open) {
            searchProducts('');
        }
    }, [open, searchProducts]);

    // Navigate to product page
    const handleSelectProduct = (product: Product) => {
        onOpenChange(false);
        setQuery('');
        router.visit(`/products/${product.slug}`);
    };

    // Navigate to category page
    const handleSelectCategory = (category: Category) => {
        onOpenChange(false);
        setQuery('');
        router.visit(`/products?category=${category.slug}`);
    };

    // Format price display
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <CommandDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Search Products"
            description="Search for products by name or browse categories"
        >
            <CommandInput
                placeholder="Search products, categories..."
                value={query}
                onValueChange={setQuery}
            />
            <CommandList className="max-h-[400px]">
                {isLoading && (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {!isLoading && query && results.products.length === 0 && results.categories.length === 0 && (
                    <CommandEmpty>
                        No results found for "{query}"
                    </CommandEmpty>
                )}

                {!isLoading && results.categories.length > 0 && (
                    <CommandGroup heading="Categories">
                        {results.categories.map((category) => (
                            <CommandItem
                                key={`category-${category.id}`}
                                value={`category-${category.name}`}
                                onSelect={() => handleSelectCategory(category)}
                                className="cursor-pointer"
                            >
                                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{category.name}</span>
                                {category.description && (
                                    <span className="ml-2 text-xs text-muted-foreground truncate max-w-[200px]">
                                        {category.description}
                                    </span>
                                )}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {!isLoading && results.categories.length > 0 && results.products.length > 0 && (
                    <CommandSeparator />
                )}

                {!isLoading && results.products.length > 0 && (
                    <CommandGroup heading="Products">
                        {results.products.map((product) => (
                            <CommandItem
                                key={`product-${product.id}`}
                                value={`product-${product.name}`}
                                onSelect={() => handleSelectProduct(product)}
                                className="cursor-pointer"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    {product.images && product.images[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="h-10 w-10 rounded-md object-cover bg-muted"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                            <Package className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="font-medium truncate">{product.name}</span>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            {product.category && (
                                                <span className="truncate">{product.category.name}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0">
                                        {product.sale_price ? (
                                            <>
                                                <span className="font-semibold text-primary">
                                                    {formatPrice(product.sale_price)}
                                                </span>
                                                <span className="text-xs text-muted-foreground line-through">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-semibold">
                                                {formatPrice(product.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {!isLoading && !query && results.products.length > 0 && (
                    <div className="py-2 px-3 text-xs text-muted-foreground text-center border-t">
                        Start typing to search or browse popular products above
                    </div>
                )}
            </CommandList>
        </CommandDialog>
    );
}
