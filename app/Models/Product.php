<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'sale_price',
        'images',
        'category_id',
        'is_featured',
        'is_new_arrival',
        'is_best_seller',
        'is_active',
        'specifications',
        'sku',
        'stock_quantity',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'images' => 'array',
        'is_featured' => 'boolean',
        'is_new_arrival' => 'boolean',
        'is_best_seller' => 'boolean',
        'is_active' => 'boolean',
        'specifications' => 'array',
        'stock_quantity' => 'integer',
    ];

    /**
     * Get the category
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the order items for this product
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the primary image
     */
    public function getPrimaryImageAttribute(): ?string
    {
        return $this->images[0] ?? null;
    }

    /**
     * Get the display price (sale price if available, otherwise regular price)
     */
    public function getDisplayPriceAttribute(): string
    {
        return $this->sale_price ?? $this->price;
    }

    /**
     * Check if product is on sale
     */
    public function getOnSaleAttribute(): bool
    {
        return $this->sale_price !== null && $this->sale_price < $this->price;
    }

    /**
     * Scope to get only active products
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get featured products
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to get new arrivals
     */
    public function scopeNewArrivals($query)
    {
        return $query->where('is_new_arrival', true);
    }

    /**
     * Scope to get best sellers
     */
    public function scopeBestSellers($query)
    {
        return $query->where('is_best_seller', true);
    }

    /**
     * Scope to get products in stock
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }
}
