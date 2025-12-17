import { HomeActivity } from '@/types/cms';
import { motion } from 'framer-motion';

export const ActivitiesSection = ({
    activities,
}: {
    activities: HomeActivity[];
}) => (
    <section className="bg-[#f8fcf9] py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#006838]">
                E-Club's Activities
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-gray-600">
                Learn from industry experts, workshops, and networking events to
                expand your skillset and knowledge.
            </p>

            {activities && activities.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {activities.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-2xl"
                        >
                            <div className="absolute top-4 left-4 z-10 flex gap-2">
                                <span className="rounded-lg bg-black/80 px-3 py-1 text-sm font-bold text-white backdrop-blur">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                            </div>
                            <div className="absolute right-0 bottom-0 left-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4 text-left">
                                <h3 className="text-lg font-bold text-white">
                                    {item.title}
                                </h3>
                            </div>
                            <div className="h-72 overflow-hidden">
                                <img
                                    src={
                                        item.image ||
                                        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80'
                                    }
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No activities found.</p>
            )}
        </div>
    </section>
);
