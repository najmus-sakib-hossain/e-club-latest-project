import { Quote, Star } from 'lucide-react';
import { motion } from 'motion/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
    staggerContainerVariants,
    staggerItemVariants,
} from '@/lib/animations';
import type { CustomerReview, SiteSettings } from '@/types/cms';

interface CustomerReviewsProps {
    reviews: CustomerReview[];
    settings?: SiteSettings;
}

export function CustomerReviews({ reviews, settings }: CustomerReviewsProps) {
    if (reviews.length === 0) return null;

    // Get dynamic text from settings
    const sectionTitle =
        settings?.homepage?.customer_reviews_title || 'What Our Customers Say';
    const sectionSubtitle =
        settings?.homepage?.customer_reviews_subtitle ||
        'Real feedback from our valued customers';

    const getImageUrl = (review: CustomerReview) => {
        if (!review.image) return null;
        if (review.image.startsWith('http')) {
            // For Unsplash images, add proper sizing parameters for avatar (face crop)
            if (review.image.includes('unsplash.com')) {
                const baseUrl = review.image.split('?')[0];
                return `${baseUrl}?w=150&h=150&fit=crop&crop=face&auto=format&q=80`;
            }
            return review.image;
        }
        return `/storage/${review.image}`;
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        {sectionTitle.includes(' ') ? (
                            <>
                                {sectionTitle.split(' ').slice(0, -1).join(' ')}{' '}
                                <span className="text-primary">
                                    {sectionTitle.split(' ').slice(-1)}
                                </span>
                            </>
                        ) : (
                            <span className="text-primary">{sectionTitle}</span>
                        )}
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                        {sectionSubtitle}
                    </p>
                </motion.div>

                {/* Reviews Grid */}
                <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    variants={staggerContainerVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            variants={staggerItemVariants}
                        >
                            <Card className="h-full border-0 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                                <CardContent className="p-6">
                                    {/* Quote Icon */}
                                    <Quote className="mb-4 h-8 w-8 text-primary/20" />

                                    {/* Rating */}
                                    <div className="mb-4">
                                        {renderStars(review.rating)}
                                    </div>

                                    {/* Review Text */}
                                    <p className="mb-6 line-clamp-4 text-gray-600">
                                        "{review.review}"
                                    </p>

                                    {/* Reviewer Info */}
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={
                                                    getImageUrl(review) ||
                                                    undefined
                                                }
                                                alt={review.name}
                                            />
                                            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                                                {getInitials(review.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {review.name}
                                            </h4>
                                            {review.role && (
                                                <p className="text-sm text-gray-500">
                                                    {review.role}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
