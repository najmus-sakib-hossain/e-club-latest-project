import { Facebook, Linkedin, Mail } from 'lucide-react';

export const PresidentMessage = () => (
    <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2">
                {[
                    {
                        role: "President's Message",
                        name: 'Dr. Mohammad Shah Alam Chowdhury',
                        tenure: 'President (2023-24)',
                        img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
                        msg: 'Together, we can build a future where innovation knows no bounds, where dreams are transformed into reality, and where the entrepreneurial spirit is nurtured.',
                    },
                    {
                        role: "General Secretary's Message",
                        name: 'Biplob Ghosh Rahul',
                        tenure: 'General Secretary (2023-24)',
                        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
                        msg: 'From bustling local markets to global business ventures, entrepreneurs have been the driving force behind our economic growth and development.',
                    },
                ].map((person, idx) => (
                    <div
                        key={idx}
                        className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
                    >
                        <h3 className="mb-6 text-2xl font-bold text-[#006838]">
                            {person.role}
                        </h3>
                        <div className="mb-6 flex gap-4">
                            <span className="absolute top-20 left-4 -z-10 font-serif text-8xl leading-[0] text-gray-100">
                                “
                            </span>
                            <p className="relative z-10 text-sm leading-relaxed text-gray-600 italic">
                                {person.msg}
                            </p>
                        </div>

                        <div className="mt-8 flex items-center gap-4 border-t pt-6">
                            <img
                                src={person.img}
                                alt={person.name}
                                className="h-16 w-16 rounded-full border-2 border-[#006838] object-cover p-0.5"
                            />
                            <div>
                                <h4 className="text-lg font-bold">
                                    {person.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {person.tenure}
                                </p>
                                <div className="mt-2 flex gap-2">
                                    <Facebook className="h-4 w-4 cursor-pointer text-gray-400 hover:text-[#006838]" />
                                    <Linkedin className="h-4 w-4 cursor-pointer text-gray-400 hover:text-[#006838]" />
                                    <Mail className="h-4 w-4 cursor-pointer text-gray-400 hover:text-[#006838]" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
