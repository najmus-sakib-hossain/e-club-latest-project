import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface WishlistItem {
    productId: number;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    image: string;
    addedAt: string;
}

interface WishlistState {
    items: WishlistItem[];

    // Actions
    addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
    removeItem: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
    toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    devtools(
        persist(
            (set, get) => ({
                items: [],

                addItem: (item) => {
                    const { items } = get();
                    const existingItem = items.find(
                        (i) => i.productId === item.productId,
                    );

                    if (!existingItem) {
                        set({
                            items: [
                                ...items,
                                { ...item, addedAt: new Date().toISOString() },
                            ],
                        });
                    }
                },

                removeItem: (productId) => {
                    set({
                        items: get().items.filter(
                            (i) => i.productId !== productId,
                        ),
                    });
                },

                isInWishlist: (productId) => {
                    return get().items.some((i) => i.productId === productId);
                },

                toggleItem: (item) => {
                    const { isInWishlist, addItem, removeItem } = get();
                    if (isInWishlist(item.productId)) {
                        removeItem(item.productId);
                    } else {
                        addItem(item);
                    }
                },

                clearWishlist: () => set({ items: [] }),
            }),
            {
                name: 'wishlist-storage',
            },
        ),
        { name: 'WishlistStore' },
    ),
);
