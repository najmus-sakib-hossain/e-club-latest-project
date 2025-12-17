import { CustomButton } from '@/components/ui/CustomButton';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { HomeStat } from '@/types/cms';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const HeroSection = ({ stats }: { stats: HomeStat[] }) => (
    <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="group relative h-[400px] overflow-hidden rounded-[2rem] shadow-2xl md:h-[500px]"
            >
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                    alt="E-Club Members"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.h1
                    variants={fadeInUp}
                    className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-6xl"
                >
                    To make a better future get{' '}
                    <span className="text-[#006838] underline decoration-[#a3e635] decoration-4">
                        E-Club
                    </span>{' '}
                    Membership Certificate.
                </motion.h1>
                <motion.p
                    variants={fadeInUp}
                    className="mb-8 text-lg leading-relaxed text-gray-600"
                >
                    The Entrepreneurs Club of Bangladesh (E-Club) is a community
                    of business owners, entrepreneurs, and professionals in
                    Bangladesh focused on growth, networking, and success.
                </motion.p>
                <motion.div variants={fadeInUp} className="flex gap-4">
                    <CustomButton className="h-12 gap-2 rounded-full px-8 text-base">
                        Join as Member <ArrowRight className="h-5 w-5" />
                    </CustomButton>
                    <CustomButton
                        variant="outline"
                        className="h-12 rounded-full px-8 text-base"
                    >
                        Learn More
                    </CustomButton>
                </motion.div>
            </motion.div>
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="mt-20 grid grid-cols-2 gap-4 border-t border-gray-100 pt-10 text-center md:grid-cols-5 lg:grid-cols-9"
            >
                {stats.map((stat, idx) => (
                    <motion.div
                        variants={fadeInUp}
                        key={stat.id || idx}
                        className="group flex cursor-default flex-col items-center"
                    >
                        <span className="text-3xl font-bold text-[#e63946] transition-transform group-hover:scale-110">
                            {stat.value}
                        </span>
                        <span className="mt-1 text-[10px] font-semibold tracking-wide text-gray-500 uppercase">
                            {stat.label}
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        )}
    </section>
);
