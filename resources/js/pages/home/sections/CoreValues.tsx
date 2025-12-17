import { CustomButton } from '@/components/ui/CustomButton';
import { HomeCoreValue } from '@/types/cms';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const CoreValues = ({ values }: { values: HomeCoreValue[] }) => (
    <section className="overflow-hidden bg-white py-24 text-center">
        <div className="container mx-auto px-4">
            <h2 className="mb-4 text-4xl font-bold text-[#006838]">
                Core Values of E-Club
            </h2>
            <p className="mx-auto mb-20 max-w-2xl text-gray-600">
                These core values guide the actions and initiatives of the
                Entrepreneurs Club of Bangladesh and shape its culture and
                community.
            </p>

            {values && values.length > 0 ? (
                <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 md:flex-row">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 -z-10 hidden h-0.5 w-full -translate-y-1/2 transform bg-gray-200 md:block" />

                    {values.map((val, idx) => (
                        <motion.div
                            key={val.id}
                            className="group z-10 flex h-64 w-64 flex-col items-center justify-center rounded-full border-2 border-[#006838] bg-white p-6 shadow-xl transition-colors duration-300 hover:bg-[#006838]"
                            whileHover={{ scale: 1.1 }}
                        >
                            <h3 className="mb-3 text-xl font-bold text-[#006838] transition-colors group-hover:text-white">
                                {val.title}
                            </h3>
                            {val.description && (
                                <p className="line-clamp-3 text-xs text-gray-600 transition-colors group-hover:text-green-50">
                                    {val.description}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">Core values not set.</p>
            )}

            <div className="mt-16">
                <CustomButton className="rounded-full px-10 py-3 text-lg">
                    Join as Member <ArrowRight className="ml-2 h-5 w-5" />
                </CustomButton>
            </div>
        </div>
    </section>
);
