import { useState, useRef } from "react"
import { Head, router } from "@inertiajs/react"
import { motion } from "motion/react"
import {
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
  Image,
  Star,
  StarIcon,
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getImageUrl } from '@/lib/utils'

// Types
interface CustomerReview {
  id: number
  name: string
  role: string | null
  review: string
  rating: number
  image: string | null
  is_active: boolean
  order: number
  created_at: string
  updated_at: string
}

interface CustomerReviewsIndexProps {
  reviews: CustomerReview[]
}

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Zod validation schema
const reviewSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  role: z.string().max(255).optional().nullable(),
  review: z.string().min(1, "Review text is required"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  is_active: z.boolean(),
  order: z.number().int().min(0),
  image: z.any().optional(),
})

type ReviewFormData = z.infer<typeof reviewSchema>

// Rating Stars Component
interface RatingStarsProps {
  rating: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

function RatingStars({ rating, interactive = false, onChange }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (interactive ? (hoverRating || rating) : rating) >= star
        const StarComp = isFilled ? StarIcon : Star

        return (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange?.(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <StarComp
              className={`h-5 w-5 ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        )
      })}
    </div>
  )
}

export default function CustomerReviewsIndex({ reviews }: CustomerReviewsIndexProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<CustomerReview | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",
      role: "",
      review: "",
      rating: 5,
      is_active: true,
      order: 0,
    } as ReviewFormData,
  })

  const filteredReviews = reviews.filter((review) =>
    review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.role?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.role) formData.append('role', data.role)
      formData.append('review', data.review)
      formData.append('rating', data.rating.toString())
      formData.append('is_active', data.is_active ? '1' : '0')
      formData.append('order', data.order.toString())

      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const response = await fetch("/api/admin/customer-reviews", {
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
        toast.success("Customer review created successfully!")
        setIsCreateOpen(false)
        form.reset()
        setSelectedImage(null)
        setImagePreview(null)
        router.reload()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to create customer review")
      }
    } catch (error) {
      toast.error("An error occurred while creating the customer review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (data: ReviewFormData) => {
    if (!selectedReview) return
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('name', data.name)
      if (data.role) formData.append('role', data.role)
      formData.append('review', data.review)
      formData.append('rating', data.rating.toString())
      formData.append('is_active', data.is_active ? '1' : '0')
      formData.append('order', data.order.toString())

      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const response = await fetch(`/api/admin/customer-reviews/${selectedReview.id}`, {
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
        toast.success("Customer review updated successfully!")
        setIsEditOpen(false)
        setSelectedReview(null)
        form.reset()
        setSelectedImage(null)
        setImagePreview(null)
        router.reload()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update customer review")
      }
    } catch (error) {
      toast.error("An error occurred while updating the customer review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedReview) return
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/customer-reviews/${selectedReview.id}`, {
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
        toast.success("Customer review deleted successfully!")
        setIsDeleteOpen(false)
        setSelectedReview(null)
        router.reload()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to delete customer review")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the customer review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (review: CustomerReview) => {
    setSelectedReview(review)
    form.reset({
      name: review.name,
      role: review.role || "",
      review: review.review,
      rating: review.rating,
      is_active: review.is_active,
      order: review.order,
    })
    setImagePreview(getImageUrl(review.image))
    setSelectedImage(null)
    setIsEditOpen(true)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = () => {
    setImagePreview(null)
    setSelectedImage(null)
  }

  const openDeleteDialog = (review: CustomerReview) => {
    setSelectedReview(review)
    setIsDeleteOpen(true)
  }

  const openCreateDialog = () => {
    form.reset({
      name: "",
      role: "",
      review: "",
      rating: 5,
      is_active: true,
      order: 0,
    })
    setImagePreview(null)
    setSelectedImage(null)
    setIsCreateOpen(true)
  }

  const ReviewForm = ({ onSubmit }: { onSubmit: (data: ReviewFormData) => void }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 pb-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Business Owner, Interior Designer" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Customer's profession or role</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Text *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the customer's review..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating *</FormLabel>
                  <FormControl>
                    <div className="pt-2">
                      <RatingStars
                        rating={field.value!}
                        interactive
                        onChange={(rating) => field.onChange(rating)}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Click to select rating (1-5 stars)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Customer Photo</FormLabel>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={imagePreview} alt="Preview" />
                      <AvatarFallback>
                        <Image className="h-8 w-8 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                {!imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Optional. Square images work best (e.g., 200x200px)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Lower numbers appear first</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Active</FormLabel>
                    <FormControl>
                      <div className="flex items-center pt-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="ml-2 text-sm text-muted-foreground">
                          {field.value ? "Visible on website" : "Hidden from website"}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Review"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )

  return (
    <AdminPageLayout>
      <Head title="Customer Reviews - Admin" />

      <div className="flex-1 space-y-6 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-2xl font-bold">Customer Reviews</CardTitle>
                <CardDescription>
                  Manage customer testimonials displayed on your website
                </CardDescription>
              </div>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Review
              </Button>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-6">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Reviews Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Photo</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead className="w-[120px]">Rating</TableHead>
                      <TableHead className="w-[80px]">Order</TableHead>
                      <TableHead className="w-[80px]">Status</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center">
                          No customer reviews found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={getImageUrl(review.image) || undefined} alt={review.name} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {getInitials(review.name)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{review.name}</p>
                              {review.role && (
                                <p className="text-sm text-muted-foreground">{review.role}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="line-clamp-2 max-w-md text-sm text-muted-foreground">
                              {review.review}
                            </p>
                          </TableCell>
                          <TableCell>
                            <RatingStars rating={review.rating} />
                          </TableCell>
                          <TableCell className="text-center">{review.order}</TableCell>
                          <TableCell>
                            <Badge variant={review.is_active ? "default" : "secondary"}>
                              {review.is_active ? "Active" : "Hidden"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(review)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(review)}
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
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Customer Review</DialogTitle>
            <DialogDescription>
              Add a new customer testimonial to display on your website
            </DialogDescription>
          </DialogHeader>
          <ReviewForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Customer Review</DialogTitle>
            <DialogDescription>
              Update the customer testimonial details
            </DialogDescription>
          </DialogHeader>
          <ReviewForm onSubmit={handleEdit} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the review from "{selectedReview?.name}"? This action cannot be undone.
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
