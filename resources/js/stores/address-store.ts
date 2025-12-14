import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface Address {
    id: string;
    label: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
    createdAt: string;
}

interface AddressState {
    addresses: Address[];
    
    // Actions
    addAddress: (address: Omit<Address, 'id' | 'createdAt'>) => void;
    updateAddress: (id: string, address: Partial<Omit<Address, 'id' | 'createdAt'>>) => void;
    removeAddress: (id: string) => void;
    setDefaultAddress: (id: string) => void;
    getDefaultAddress: () => Address | undefined;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAddressStore = create<AddressState>()(
    devtools(
        persist(
            (set, get) => ({
                addresses: [],

                addAddress: (address) => {
                    const { addresses } = get();
                    const newAddress: Address = {
                        ...address,
                        id: generateId(),
                        createdAt: new Date().toISOString(),
                        // If this is the first address, make it default
                        isDefault: addresses.length === 0 ? true : address.isDefault,
                    };
                    
                    // If new address is default, remove default from others
                    if (newAddress.isDefault) {
                        set({
                            addresses: [
                                ...addresses.map((a) => ({ ...a, isDefault: false })),
                                newAddress,
                            ],
                        });
                    } else {
                        set({ addresses: [...addresses, newAddress] });
                    }
                },

                updateAddress: (id, updates) => {
                    const { addresses } = get();
                    
                    // If updating to default, remove default from others
                    if (updates.isDefault) {
                        set({
                            addresses: addresses.map((a) =>
                                a.id === id
                                    ? { ...a, ...updates }
                                    : { ...a, isDefault: false }
                            ),
                        });
                    } else {
                        set({
                            addresses: addresses.map((a) =>
                                a.id === id ? { ...a, ...updates } : a
                            ),
                        });
                    }
                },

                removeAddress: (id) => {
                    const { addresses } = get();
                    const addressToRemove = addresses.find((a) => a.id === id);
                    const remainingAddresses = addresses.filter((a) => a.id !== id);
                    
                    // If removed address was default and there are remaining addresses,
                    // make the first one default
                    if (addressToRemove?.isDefault && remainingAddresses.length > 0) {
                        remainingAddresses[0].isDefault = true;
                    }
                    
                    set({ addresses: remainingAddresses });
                },

                setDefaultAddress: (id) => {
                    set({
                        addresses: get().addresses.map((a) => ({
                            ...a,
                            isDefault: a.id === id,
                        })),
                    });
                },

                getDefaultAddress: () => {
                    return get().addresses.find((a) => a.isDefault);
                },
            }),
            {
                name: 'address-storage',
            }
        ),
        { name: 'AddressStore' }
    )
);
