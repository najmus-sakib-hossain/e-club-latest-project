import { motion } from 'framer-motion';

export const AboutSection = () => (
    <section className="relative overflow-hidden bg-[#f8fcf9] py-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="relative z-10 container mx-auto px-4">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-12 text-4xl font-bold text-[#006838]"
            >
                About Us
            </motion.h2>

            <div className="grid gap-12 md:grid-cols-3">
                {[
                    {
                        title: 'Entrepreneurs Club of Bangladesh',
                        content:
                            'Founded in 2018 and registered with RJSC, the Entrepreneurs Club of Bangladesh is a non-profit organization dedicated to empowering entrepreneurs across the country. Through resource provision, networking opportunities, and ongoing support, the club helps aspiring and established entrepreneurs build and grow thriving businesses.',
                    },
                    {
                        title: 'Our Mission',
                        content:
                            'The Entrepreneurs Club of Bangladesh supports entrepreneurs by providing a network for collaboration and growth, fostering new ventures and member connections.',
                    },
                    {
                        title: 'Our Vision',
                        content:
                            'The Entrepreneurs Club of Bangladesh envisions a thriving ecosystem empowering entrepreneurs and fostering economic development.',
                    },
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className={`pr-6 ${idx !== 2 ? 'border-gray-200 md:border-r' : ''}`}
                    >
                        <h3 className="mb-4 text-xl font-bold text-gray-900">
                            {item.title}
                        </h3>
                        <p className="text-justify text-sm leading-relaxed text-gray-600">
                            {item.content}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);
