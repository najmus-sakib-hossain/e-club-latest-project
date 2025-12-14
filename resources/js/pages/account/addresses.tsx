import { Head, Link } from '@inertiajs/react';
import { ChevronRight, MapPin, Plus, Pencil, Trash2, Star, Home, Building } from 'lucide-react';
import { useState } from 'react';

import { SiteLayout } from '@/components/site';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneInput } from '@/components/ui/phone-input';
import { useAddressStore, type Address } from '@/stores/address-store';
import { toast } from 'sonner';
import type { Category, SiteSettings } from '@/types/cms';

interface AddressesPageProps {
    settings?: SiteSettings;
    categories?: Category[];
}

const addressLabels = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'office', label: 'Office', icon: Building },
    { value: 'other', label: 'Other', icon: MapPin },
];

export default function AddressesPage({ settings, categories }: AddressesPageProps) {
    const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAddressStore();
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        label: 'home',
        name: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        isDefault: false,
    });

    const resetForm = () => {
        setFormData({
            label: 'home',
            name: '',
            phone: '',
            address: '',
            city: '',
            postalCode: '',
            isDefault: false,
        });
        setEditingAddress(null);
    };

    const openAddDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const openEditDialog = (address: Address) => {
        setEditingAddress(address);
        setFormData({
            label: address.label,
            name: address.name,
            phone: address.phone,
            address: address.address,
            city: address.city,
            postalCode: address.postalCode,
            isDefault: address.isDefault,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingAddress) {
            updateAddress(editingAddress.id, formData);
            toast.success('Address updated successfully');
        } else {
            addAddress(formData);
            toast.success('Address added successfully');
        }
        
        setIsDialogOpen(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        removeAddress(id);
        setDeleteConfirmId(null);
        toast.success('Address deleted');
    };

    const handleSetDefault = (id: string) => {
        setDefaultAddress(id);
        toast.success('Default address updated');
    };

    const getLabelIcon = (label: string) => {
        const labelInfo = addressLabels.find((l) => l.value === label);
        return labelInfo?.icon || MapPin;
    };

    return (
        <SiteLayout settings={settings} categories={categories}>
            <Head title="My Addresses" />

            {/* Breadcrumb */}
            <div className="bg-muted py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/account" className="hover:text-primary">Account</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">Addresses</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">My Addresses</h1>
                        <p className="text-muted-foreground">
                            Manage your delivery addresses
                        </p>
                    </div>
                    <Button onClick={openAddDialog}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                    </Button>
                </div>

                {addresses.length === 0 ? (
                    <Card>
                        <CardContent className="py-16">
                            <div className="text-center">
                                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h2 className="text-xl font-semibold mb-2">No addresses saved</h2>
                                <p className="text-muted-foreground mb-6">
                                    Add your delivery address to make checkout faster.
                                </p>
                                <Button onClick={openAddDialog}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Address
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {addresses.map((address) => {
                            const LabelIcon = getLabelIcon(address.label);
                            
                            return (
                                <Card
                                    key={address.id}
                                    className={`relative ${address.isDefault ? 'border-primary' : ''}`}
                                >
                                    {address.isDefault && (
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-primary text-primary-foreground">
                                                <Star className="h-3 w-3 mr-1" />
                                                Default
                                            </Badge>
                                        </div>
                                    )}
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <LabelIcon className="h-4 w-4" />
                                            {address.label.charAt(0).toUpperCase() + address.label.slice(1)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-1 text-sm mb-4">
                                            <p className="font-medium">{address.name}</p>
                                            <p className="text-muted-foreground">{address.phone}</p>
                                            <p className="text-muted-foreground">{address.address}</p>
                                            <p className="text-muted-foreground">
                                                {address.city}{address.postalCode && ` - ${address.postalCode}`}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditDialog(address)}
                                            >
                                                <Pencil className="h-3 w-3 mr-1" />
                                                Edit
                                            </Button>
                                            {!address.isDefault && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSetDefault(address.id)}
                                                >
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Set Default
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteConfirmId(address.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingAddress
                                ? 'Update your delivery address details.'
                                : 'Add a new delivery address for your orders.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            {/* Label Selection */}
                            <div className="space-y-2">
                                <Label>Address Type</Label>
                                <div className="flex gap-2">
                                    {addressLabels.map(({ value, label, icon: Icon }) => (
                                        <Button
                                            key={value}
                                            type="button"
                                            variant={formData.label === value ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setFormData({ ...formData, label: value })}
                                        >
                                            <Icon className="h-4 w-4 mr-1" />
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <PhoneInput
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(value) => setFormData({ ...formData, phone: value || '' })}
                                        defaultCountry="BD"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="House/Building number, Street name, Area"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input
                                        id="postalCode"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, isDefault: checked === true })
                                    }
                                />
                                <Label htmlFor="isDefault" className="text-sm font-normal">
                                    Set as default address
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingAddress ? 'Update Address' : 'Add Address'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Address</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this address? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SiteLayout>
    );
}
