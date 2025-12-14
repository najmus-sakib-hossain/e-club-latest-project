import { useState, useRef } from "react"
import { Head, router } from "@inertiajs/react"
import { motion } from "motion/react"
import {
  Pencil,
  Eye,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
  Image,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { AdminPageLayout } from "@/layouts/admin-page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getImageUrl } from '@/lib/utils'

// Types
interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  sale_price: number | null
  images: string[] | null
  category_id: number | null
  category: Category | null
  is_featured: boolean
  is_new_arrival: boolean
  is_best_seller: boolean
  is_active: boolean
  sku: string | null
  stock_quantity: number
  created_at: string
  updated_at: string
}

interface ProductsIndexProps {
  products: Product[]
  categories: Category[]
}

// Zod validation schema
const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().max(255).optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  sale_price: z.coerce.number().min(0).optional().nullable(),
  category_id: z.coerce.number().optional().nullable(),
  is_featured: z.boolean(),
  is_new_arrival: z.boolean(),
  is_best_seller: z.boolean(),
  is_active: z.boolean(),
  sku: z.string().max(100).optional().nullable(),
  stock_quantity: z.coerce.number().int().min(0),
  images: z.any().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(amount).replace("BDT", "৳")
}

export default function ProductsIndex({ products, categories }: ProductsIndexProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      sale_price: null,
      category_id: null,
      is_featured: false,
      is_new_arrival: false,
      is_best_seller: false,
      is_active: true,
      sku: "",
      stock_quantity: 0,
    },
  })

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.slug) formData.append('slug', data.slug)
      if (data.description) formData.append('description', data.description)
      formData.append('price', data.price.toString())
      if (data.sale_price) formData.append('sale_price', data.sale_price.toString())
      if (data.category_id) formData.append('category_id', data.category_id.toString())
      formData.append('is_featured', data.is_featured ? '1' : '0')
      formData.append('is_new_arrival', data.is_new_arrival ? '1' : '0')
      formData.append('is_best_seller', data.is_best_seller ? '1' : '0')
      formData.append('is_active', data.is_active ? '1' : '0')
      if (data.sku) formData.append('sku', data.sku)
      formData.append('stock_quantity', data.stock_quantity.toString())

      selectedImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image)
      })

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(
            document.cookie.match(/XSRF-TOKEN=([^;]*)/)?.[1] || ""
          ),
        },
        credentials: "include",
        body: formData,
      })

      if (response.ok) {
        toast.success("Product created successfully!")
        setIsCreateOpen(false)
        form.reset()
        setSelectedImages([])
        setImagePreviews([])
        router.reload()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to create product")
      }
    } catch (error) {
      toast.error("An error occurred while creating the product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (data: ProductFormData) => {
    if (!selectedProduct) return
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('name', data.name)
      if (data.slug) formData.append('slug', data.slug)
      if (data.description) formData.append('description', data.description)
      formData.append('price', data.price.toString())
      if (data.sale_price) formData.append('sale_price', data.sale_price.toString())
      if (data.category_id) formData.append('category_id', data.category_id.toString())
      formData.append('is_featured', data.is_featured ? '1' : '0')
      formData.append('is_new_arrival', data.is_new_arrival ? '1' : '0')
      formData.append('is_best_seller', data.is_best_seller ? '1' : '0')
      formData.append('is_active', data.is_active ? '1' : '0')
      if (data.sku) formData.append('sku', data.sku)
      formData.append('stock_quantity', data.stock_quantity.toString())

      selectedImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image)
      })

      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(
            document.cookie.match(/XSRF-TOKEN=([^;]*)/)?.[1] || ""
          ),
        },
        credentials: "include",
        body: formData,
      })

      if (response.ok) {
        toast.success("Product updated successfully!")
        setIsEditOpen(false)
        setSelectedProduct(null)
        form.reset()
        setSelectedImages([])
        setImagePreviews([])
        router.reload()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update product")
      }
    } catch (error) {
      toast.error("An error occurred while updating the product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProduct) return
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(
            document.cookie.match(/XSRF-TOKEN=([^;]*)/)?.[1] || ""
          ),
        },
        credentials: "include",
      })

      if (response.ok) {
        toast.success("Product deleted successfully!")
        setIsDeleteOpen(false)
        setSelectedProduct(null)
        router.reload()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to delete product")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    form.reset({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price,
      sale_price: product.sale_price,
      category_id: product.category_id,
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
      is_best_seller: product.is_best_seller,
      is_active: product.is_active,
      sku: product.sku || "",
      stock_quantity: product.stock_quantity,
    })
    // Set existing images for preview
    if (product.images && product.images.length > 0) {
      setImagePreviews(product.images.map(img => getImageUrl(img) || ''))
    } else {
      setImagePreviews([])
    }
    setSelectedImages([])
    setIsEditOpen(true)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      setSelectedImages(prev => [...prev, ...newFiles])
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteOpen(true)
  }

  const ProductForm = ({ onSubmit }: { onSubmit: (data: ProductFormData) => void }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 pb-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Modern Sofa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="modern-sofa (auto-generated if empty)" {...field} />
                  </FormControl>
                  <FormDescription>URL-friendly version of the name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (৳) *</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sale_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price (৳)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Leave empty if no sale"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value ? Number(value) : null)}
                    value={field.value?.toString() ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the product..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="PRD-001" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Add Images
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Upload product images (you can select multiple)
              </FormDescription>
            </FormItem>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Make this product visible on the store
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        Display this product in featured sections
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_new_arrival"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>New Arrival</FormLabel>
                      <FormDescription>
                        Mark this product as a new arrival
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_best_seller"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Best Seller</FormLabel>
                      <FormDescription>
                        Mark this product as a best seller
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )

  return (
    <AdminPageLayout>
      <Head title="Products - E-Club Admin" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="@container/main flex flex-1 flex-col gap-2 py-4 px-4 lg:px-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your e-club inventory
            </p>
          </div>
          <Button onClick={() => { form.reset(); setSelectedImages([]); setImagePreviews([]); setIsCreateOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>All Products</CardTitle>
                <CardDescription>
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} total
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto -mx-4 md:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">Stock</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-lg bg-gray-100">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0].startsWith("http") ? product.images[0] : `/storage/${product.images[0]}`}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                No img
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{product.name}</span>
                            {product.sku && (
                              <span className="text-xs text-muted-foreground">
                                SKU: {product.sku}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground md:hidden">
                              {product.category?.name || 'Uncategorized'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.category?.name || (
                            <span className="text-muted-foreground">Uncategorized</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium">
                            {formatCurrency(product.sale_price ?? product.price)}
                          </div>
                          {product.sale_price && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatCurrency(product.price)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-center">
                          <Badge
                            variant={product.stock_quantity > 10 ? "default" : product.stock_quantity > 0 ? "secondary" : "destructive"}
                          >
                            {product.stock_quantity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
                            {product.is_active ? (
                              <Badge variant="default" className="bg-green-500">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                            {product.is_featured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9"
                              onClick={() => openEditDialog(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9"
                              onClick={() => openDeleteDialog(product)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product for your store.
            </DialogDescription>
          </DialogHeader>
          <ProductForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information.
            </DialogDescription>
          </DialogHeader>
          <ProductForm onSubmit={handleEdit} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedProduct?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageLayout>
  )
}
