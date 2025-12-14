import type { Variants } from 'motion/react';

// Page transition variants
export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: 'easeIn',
        },
    },
};

// Fade in animation
export const fadeInVariants: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

// Slide up animation
export const slideUpVariants: Variants = {
    initial: {
        opacity: 0,
        y: 40,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// Stagger children animation
export const staggerContainerVariants: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

// Alias for staggerContainerVariants
export const staggerContainer = staggerContainerVariants;

export const staggerItemVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

// Fade in up animation (commonly used alias for slideUp)
export const fadeInUp: Variants = {
    initial: {
        opacity: 0,
        y: 30,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// Scale animation for cards/images
export const scaleVariants: Variants = {
    initial: {
        scale: 0.95,
        opacity: 0,
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

// Hover animations
export const cardHoverVariants: Variants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
};

export const imageHoverVariants: Variants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

// Button hover animation
export const buttonHoverVariants: Variants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.05,
    },
    tap: {
        scale: 0.95,
    },
};

// Slide in from left/right
export const slideInLeftVariants: Variants = {
    initial: {
        opacity: 0,
        x: -50,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

export const slideInRightVariants: Variants = {
    initial: {
        opacity: 0,
        x: 50,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// Hero carousel animation
export const heroSlideVariants: Variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
    exit: (direction: number) => ({
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: 'easeIn',
        },
    }),
};
