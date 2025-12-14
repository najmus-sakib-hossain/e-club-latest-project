import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export interface GuestCheckout {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
}

interface CartState {
    items: CartItem[];
    guestInfo: GuestCheckout | null;
    
    // Actions
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    setGuestInfo: (info: GuestCheckout) => void;
    clearGuestInfo: () => void;
}

export const useCartStore = create<CartState>()(
    devtools(
        persist(
            (set, get) => ({
                items: [],
                guestInfo: null,

                addItem: (item) => {
                    const { items } = get();
                    const existingItem = items.find((i) => i.productId === item.productId);
                    
                    if (existingItem) {
                        set({
                            items: items.map((i) =>
                                i.productId === item.productId
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i
                            ),
                        });
                    } else {
                        set({ items: [...items, { ...item, quantity: 1 }] });
                    }
                },

                removeItem: (productId) => {
                    set({ items: get().items.filter((i) => i.productId !== productId) });
                },

                updateQuantity: (productId, quantity) => {
                    if (quantity <= 0) {
                        get().removeItem(productId);
                        return;
                    }
                    set({
                        items: get().items.map((i) =>
                            i.productId === productId ? { ...i, quantity } : i
                        ),
                    });
                },

                clearCart: () => set({ items: [] }),

                setGuestInfo: (info) => set({ guestInfo: info }),

                clearGuestInfo: () => set({ guestInfo: null }),
            }),
            {
                name: 'furniture-cart',
            }
        ),
        { name: 'cart-store' }
    )
);

// Selectors
export const selectCartItems = (state: CartState) => state.items;
export const selectTotalItems = (state: CartState) => 
    state.items.reduce((acc, item) => acc + item.quantity, 0);
export const selectTotalPrice = (state: CartState) => 
    state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
