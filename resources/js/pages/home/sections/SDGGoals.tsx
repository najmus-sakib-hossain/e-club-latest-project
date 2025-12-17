import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export const SDGGoals = () => (
    <section className="bg-white py-20 text-center">
        <div className="container mx-auto px-4">
            <div className="mb-10 flex justify-center">
                <div className="inline-block rounded-full bg-green-50 p-6 shadow-inner">
                    <Target className="h-12 w-12 text-[#006838]" />
                </div>
            </div>
            <h2 className="mb-16 text-4xl font-bold text-[#006838]">
                Our SDG Goal
            </h2>

            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
                {[
                    {
                        id: '05',
                        title: 'Gender Equality',
                        desc: 'Achieve gender equality and empower all women and girls',
                        color: 'from-purple-500 to-indigo-600',
                    },
                    {
                        id: '08',
                        title: 'Decent Work',
                        desc: 'Promote sustained inclusive and sustainable economic growth',
                        color: 'from-blue-400 to-blue-600',
                    },
                    {
                        id: '11',
                        title: 'Sustainable Cities',
                        desc: 'Make cities and human settlements inclusive, safe, resilient',
                        color: 'from-green-400 to-emerald-600',
                    },
                ].map((goal, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        className={`rounded-3xl bg-gradient-to-br p-8 text-left text-white ${goal.color} flex h-72 flex-col justify-between shadow-xl`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                                <Target className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-5xl font-bold opacity-30">
                                {goal.id}
                            </span>
                        </div>
                        <div>
                            <h3 className="mb-3 text-2xl font-bold">
                                {goal.title}
                            </h3>
                            <p className="text-sm leading-snug opacity-90">
                                {goal.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);
