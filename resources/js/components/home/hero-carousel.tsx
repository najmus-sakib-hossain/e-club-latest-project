import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { HeroSlide } from '@/types/cms';

interface HeroCarouselProps {
    slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
    const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

    const paginate = useCallback(
        (newDirection: number) => {
            const newIndex = currentIndex + newDirection;
            if (newIndex < 0) {
                setCurrentIndex([slides.length - 1, newDirection]);
            } else if (newIndex >= slides.length) {
                setCurrentIndex([0, newDirection]);
            } else {
                setCurrentIndex([newIndex, newDirection]);
            }
        },
        [currentIndex, slides.length],
    );

    // Auto-play
    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            paginate(1);
        }, 5000);

        return () => clearInterval(interval);
    }, [paginate, slides.length]);

    if (slides.length === 0) {
        return (
            <div className="relative h-[400px] bg-gray-200 md:h-[500px] lg:h-[600px]">
                <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">No slides available</p>
                </div>
            </div>
        );
    }

    const currentSlide = slides[currentIndex];

    // Handle image URL - check if it's already a full URL or needs /storage/ prefix
    const getImageUrl = (image: string | null | undefined) => {
        if (!image) return null;
        if (image.startsWith('http://') || image.startsWith('https://')) {
            return image;
        }
        return `/storage/${image}`;
    };

    const imageUrl = getImageUrl(currentSlide.image);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    };

    return (
        <div className="relative h-[450px] overflow-hidden bg-gray-100 md:h-[550px] lg:h-[650px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: imageUrl
                                ? `url(${imageUrl})`
                                : undefined,
                            backgroundColor:
                                currentSlide.background_color || '#f5f5f5',
                        }}
                    >
                        {/* Subtle overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                    </div>

                    {/* Content - Centered */}
                    <div className="relative flex h-full items-center justify-center">
                        <div className="mx-auto max-w-3xl px-4 text-center">
                            <motion.h1
                                className="mb-4 text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl xl:text-6xl"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                {currentSlide.title}
                            </motion.h1>

                            {currentSlide.subtitle && (
                                <motion.p
                                    className="mx-auto mb-8 max-w-xl text-base text-white/90 drop-shadow-md md:text-lg lg:text-xl"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    {currentSlide.subtitle}
                                </motion.p>
                            )}

                            {currentSlide.button_text &&
                                currentSlide.button_link && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.4,
                                            duration: 0.5,
                                        }}
                                    >
                                        <Button
                                            size="lg"
                                            className="rounded-sm bg-primary px-8 py-6 text-base font-semibold tracking-wide text-gray-900 uppercase shadow-lg hover:bg-primary/90"
                                            asChild
                                        >
                                            <a href={currentSlide.button_link}>
                                                {currentSlide.button_text}
                                            </a>
                                        </Button>
                                    </motion.div>
                                )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-primary text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary/50 md:h-12 md:w-12"
                        onClick={() => paginate(-1)}
                    >
                        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                    <button
                        className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-primary text-primary-foreground transition-colors hover:bg-primary/50 md:h-12 md:w-12"
                        onClick={() => paginate(1)}
                    >
                        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                </>
            )}

            {/* Dots Navigation */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'w-8 bg-primary'
                                    : 'w-2 bg-white/60 hover:bg-white'
                            }`}
                            onClick={() =>
                                setCurrentIndex([
                                    index,
                                    index > currentIndex ? 1 : -1,
                                ])
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
