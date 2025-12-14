import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Get the correct image URL based on the image path.
 * Handles:
 * - Full URLs (http:// or https://) - returns as-is
 * - Storage paths (without leading slash) - prefixes with /storage/
 * - Public paths (with leading slash like /company/) - returns as-is
 * - Null/undefined - returns null
 */
export function getImageUrl(image: string | null | undefined): string | null {
    if (!image) return null;
    
    // Full URLs - return as-is
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }
    
    // Paths starting with / are already public paths - return as-is
    if (image.startsWith('/')) {
        return image;
    }
    
    // Otherwise, assume it's a storage path
    return `/storage/${image}`;
}
