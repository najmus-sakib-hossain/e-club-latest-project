import { CustomButton } from '@/components/ui/CustomButton';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

export const FeaturedEvents = () => (
    <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#006838] p-8 text-white shadow-2xl md:p-16">
                {/* Abstract Pattern overlay */}
                <div className="absolute top-0 right-0 h-full w-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-10"></div>
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white opacity-5 blur-3xl"></div>

                <div className="relative z-10 grid items-center gap-12 lg:grid-cols-3">
                    {/* Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:col-span-2">
                        {[
                            {
                                title: "E-Club's Startup Pitch Competition",
                                img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80',
                                date: '24-07-24',
                                duration: '2 days event',
                            },
                            {
                                title: "E-Club's Digital Marketing Workshop",
                                img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
                                date: '24-08-24',
                                duration: '1 day event',
                            },
                        ].map((event, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="overflow-hidden rounded-2xl bg-white text-black shadow-lg"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={event.img}
                                        alt={event.title}
                                        className="h-full w-full object-cover transition-transform hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 rounded bg-white/90 px-2 py-1 text-xs font-bold text-[#006838] backdrop-blur-sm">
                                        Featured
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="mb-4 line-clamp-2 h-14 text-lg font-bold">
                                        {event.title}
                                    </h4>
                                    <div className="flex justify-between border-t pt-3 text-xs font-medium text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <ChevronRight className="h-3 w-3" />{' '}
                                            {event.date}
                                        </span>
                                        <span>{event.duration}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Text Content */}
                    <div className="space-y-8">
                        <h2 className="text-4xl leading-tight font-bold md:text-5xl">
                            Join our featured Events & connect with
                            Entrepreneurs
                        </h2>
                        <CustomButton
                            variant="secondary"
                            className="h-12 rounded-full px-8"
                        >
                            More Events <ArrowRight className="ml-2 h-4 w-4" />
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    </section>
);
