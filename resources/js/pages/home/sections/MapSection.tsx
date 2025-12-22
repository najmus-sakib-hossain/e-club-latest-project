import { motion } from 'framer-motion';
import {
    ArrowRight,
    Briefcase,
    Lightbulb,
    MapPin,
    Target,
    Users,
} from 'lucide-react';

export const MapSection = () => (
    <section className="overflow-hidden bg-[#f0fdf4] py-20">
        <div className="container mx-auto px-4">
            <div className="mb-16 flex flex-wrap justify-center gap-4">
                {[
                    {
                        id: '09',
                        label: 'Offline Training',
                        color: 'text-yellow-600 border-yellow-600',
                    },
                    {
                        id: '10',
                        label: 'Business Support',
                        color: 'text-orange-600 border-orange-600',
                    },
                    {
                        id: '11',
                        label: 'Investment',
                        color: 'text-red-600 border-red-600',
                    },
                ].map((tab, idx) => (
                    <button
                        key={idx}
                        className={`flex items-center gap-3 rounded-full border bg-white px-6 py-2 ${tab.color} transition-all hover:shadow-lg`}
                    >
                        <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${tab.color.replace('text-', 'bg-').replace('border-', '')}`}
                        >
                            {tab.id}
                        </span>
                        <span className="font-medium">{tab.label}</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                ))}
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-2">
                <div className="relative flex h-[750px] w-full items-center justify-center rounded-3xl border border-gray-100 bg-white p-4 shadow-xl">
                    {/* <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Dhaka_District_Locator_Map.svg/1200px-Dhaka_District_Locator_Map.svg.png')] bg-contain bg-center bg-no-repeat opacity-20" />
                    {[
                        {
                            name: 'Uttara',
                            top: '15%',
                            left: '50%',
                            color: 'bg-lime-500',
                        },
                        {
                            name: 'Mirpur',
                            top: '30%',
                            left: '30%',
                            color: 'bg-blue-600',
                        },
                        {
                            name: 'Gulshan',
                            top: '35%',
                            left: '60%',
                            color: 'bg-yellow-400',
                        },
                        {
                            name: 'Dhanmondi',
                            top: '50%',
                            left: '35%',
                            color: 'bg-red-600',
                        },
                        {
                            name: 'Old Dhaka',
                            top: '70%',
                            left: '40%',
                            color: 'bg-green-600',
                        },
                    ].map((pin, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="absolute flex flex-col items-center"
                            style={{ top: pin.top, left: pin.left }}
                        >
                            <div
                                className={`${pin.color} mb-1 rounded px-2 py-0.5 text-[10px] font-bold text-white shadow-sm`}
                            >
                                {pin.name}
                            </div>
                            <MapPin
                                className={`h-6 w-6 ${pin.color.replace('bg-', 'text-')} drop-shadow-md`}
                                fill="currentColor"
                            />
                        </motion.div>
                    ))} */}
                    <img src="map.png" alt="Map" />

                </div>

                <div>
                    <h3 className="mb-8 text-2xl leading-snug font-bold text-gray-800">
                        The Entrepreneur Club of Bangladesh (E-Club) organizes
                        area-based members meetups to foster:
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                        {[
                            {
                                icon: Users,
                                title: 'Build Strong Community',
                                desc: 'Connect entrepreneurs from different parts of the country.',
                                color: 'text-pink-500',
                            },
                            {
                                icon: Lightbulb,
                                title: 'Share Experience',
                                desc: 'A platform to share experiences and learn.',
                                color: 'text-purple-500',
                            },
                            {
                                icon: Target,
                                title: 'Identify Challenges',
                                desc: 'Address the challenges faced by entrepreneurs.',
                                color: 'text-blue-500',
                            },
                            {
                                icon: Briefcase,
                                title: 'Promote Entrepreneurship',
                                desc: 'Inspire innovation and new ventures.',
                                color: 'text-green-500',
                            },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:shadow-lg"
                                whileHover={{ y: -5 }}
                            >
                                <item.icon
                                    className={`mb-3 h-8 w-8 ${item.color}`}
                                />
                                <h4 className="mb-2 text-sm font-bold">
                                    {item.title}
                                </h4>
                                <p className="text-xs leading-relaxed text-gray-500">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    </section>
);
