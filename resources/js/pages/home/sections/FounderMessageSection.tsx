import { motion } from 'framer-motion';
import { Facebook, Linkedin, Mail, MessageCircle } from 'lucide-react';

export const FounderMessageSection = () => (
    <section className="bg-white py-24">
        <div className="container mx-auto px-4">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-12 text-4xl font-bold text-[#006838]"
            >
                Founder's Message
            </motion.h2>

            <div className="grid items-start gap-12 lg:grid-cols-5">
                {/* Text Content */}
                <motion.div
                    className="space-y-6 text-justify leading-relaxed text-gray-600 lg:col-span-3"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="font-semibold text-gray-800">
                        Assalamuwalikum, Dear Eclubian Entrepreneurs,
                    </p>

                    <p>
                        I am delighted to welcome you all to the Entrepreneurs
                        Club of Bangladesh (E-Club). As the founder and
                        president of this club, I am proud to see the growing
                        number of passionate entrepreneurs who are joining us on
                        this exciting journey.
                    </p>
                    <p>
                        Entrepreneurship is not just a career choice, it is a
                        way of life. It takes hard work, dedication, and courage
                        to succeed as an entrepreneur. But when you do, the
                        satisfaction and joy that comes with it is unmatched.
                    </p>
                    <p>
                        At the Entrepreneurs Club, we believe in creating a
                        supportive community where entrepreneurs can learn from
                        each other, share their experiences, and grow together.
                        Our goal is to help entrepreneurs succeed by providing
                        them with the resources and support they need, such as
                        workshops, mentorship programs, and networking
                        opportunities.
                    </p>
                    <p>
                        The E-Club was founded in 2018 as a private initiative
                        of collective action planning. We are excited to be a
                        part of this incredible journey and to witness the
                        amazing progress that our members are making. We
                        encourage all of you to join us and take advantage of
                        the opportunities that we offer.
                    </p>

                    <div className="pt-8">
                        <h3 className="text-xl font-bold text-gray-900">
                            Mohammad Shahriar Khan
                        </h3>
                        <p className="mb-4 text-sm text-gray-500">
                            Founder, Entrepreneurs Club of Bangladesh
                        </p>

                        <div className="flex gap-3">
                            {[Facebook, Linkedin, MessageCircle, Mail].map(
                                (Icon, idx) => (
                                    <div
                                        key={idx}
                                        className="cursor-pointer rounded-full bg-[#006838] p-2 text-white transition-colors hover:bg-[#004d2a]"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Image */}
                <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="relative overflow-hidden rounded-2xl border-[8px] border-white bg-gray-100 shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                            alt="Mohammad Shahriar Khan"
                            className="h-auto w-full object-cover"
                        />
                        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                            <p className="text-lg font-bold text-white">
                                Mohammad Shahriar Khan
                            </p>
                            <p className="text-sm text-white/80">Founder</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);
