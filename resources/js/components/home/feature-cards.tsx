import { motion } from 'motion/react';
import { Truck, ShieldCheck, RefreshCw, Headphones, Star } from 'lucide-react';
import type { ElementType } from 'react';

import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';
import type { FeatureCard } from '@/types/cms';

interface FeatureCardsProps {
    cards: FeatureCard[];
}

// Map icon names to components - using ElementType for proper typing
const iconMap: Record<string, ElementType> = {
    'truck': Truck,
    'Truck': Truck,
    'shield-check': ShieldCheck,
    'ShieldCheck': ShieldCheck,
    'refresh-cw': RefreshCw,
    'RefreshCw': RefreshCw,
    'headphones': Headphones,
    'Headphones': Headphones,
    'star': Star,
    'Star': Star,
};

export function FeatureCards({ cards }: FeatureCardsProps) {
    if (cards.length === 0) return null;

    return (
        <section className="border-b bg-white py-8">
            <div className="container mx-auto px-4">
                <motion.div
                    className="grid gap-6 md:grid-cols-4"
                    variants={staggerContainerVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {cards.map((card) => {
                        // Get the icon component from map or fallback to Star
                        const IconComponent = card.icon ? iconMap[card.icon] || Star : Star;

                        return (
                            <motion.div
                                key={card.id}
                                className="flex items-center gap-4 rounded-lg p-4"
                                variants={staggerItemVariants}
                            >
                                <div className="shrink-0 rounded-full bg-primary/10 p-3">
                                    <IconComponent className="h-6 w-6 text-gray-900" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{card.title}</h3>
                                    <p className="text-sm text-gray-600">{card.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
