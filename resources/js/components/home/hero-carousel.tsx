import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
        [currentIndex, slides.length]
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
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    return (
        <div className="relative h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden bg-gray-100">
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                            backgroundColor: currentSlide.background_color || '#f5f5f5',
                        }}
                    >
                        {/* Subtle overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                    </div>

                    {/* Content - Centered */}
                    <div className="relative h-full flex items-center justify-center">
                        <div className="text-center px-4 max-w-3xl mx-auto">
                            <motion.h1
                                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 drop-shadow-lg"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                {currentSlide.title}
                            </motion.h1>
                            
                            {currentSlide.subtitle && (
                                <motion.p
                                    className="text-base md:text-lg lg:text-xl text-white/90 mb-8 drop-shadow-md max-w-xl mx-auto"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    {currentSlide.subtitle}
                                </motion.p>
                            )}
                            
                            {currentSlide.button_text && currentSlide.button_link && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <Button
                                        size="lg"
                                        className="bg-primary text-gray-900 hover:bg-primary/90 font-semibold px-8 py-6 text-base uppercase tracking-wide rounded-sm shadow-lg"
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
                        className="border bg-primary text-primary-foreground hover:bg-primary/50 rounded-full absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center backdrop-blur-sm transition-colors"
                        onClick={() => paginate(-1)}
                    >
                        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                    <button
                        className="border bg-primary text-primary-foreground hover:bg-primary/50 rounded-full absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-colors"
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
                            onClick={() => setCurrentIndex([index, index > currentIndex ? 1 : -1])}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
