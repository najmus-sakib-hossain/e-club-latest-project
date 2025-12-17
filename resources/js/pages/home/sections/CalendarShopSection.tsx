import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarShopSection = () => (
    <section className="bg-gradient-to-br from-green-50 to-white py-20">
        <div className="container mx-auto px-4">
            <div className="mb-20 grid gap-8 lg:grid-cols-4">
                {/* Calendar Widget */}
                <div className="col-span-1 rounded-[2rem] border border-green-100 bg-white p-6 shadow-xl">
                    <h3 className="mb-4 text-2xl font-bold text-[#006838]">
                        Wed, Mar 21
                    </h3>
                    <div className="mb-6 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                            March 2024
                        </span>
                        <div className="flex gap-2">
                            <button className="rounded-full p-1 hover:bg-gray-100">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button className="rounded-full p-1 hover:bg-gray-100">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    {/* Simplified Calendar Grid */}
                    <div className="grid grid-cols-7 gap-y-4 text-center text-xs font-medium text-gray-400">
                        <span>S</span>
                        <span>M</span>
                        <span>T</span>
                        <span>W</span>
                        <span>T</span>
                        <span>F</span>
                        <span>S</span>
                        {[...Array(31)].map((_, i) => (
                            <span
                                key={i}
                                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full p-2 ${i === 20 ? 'bg-[#006838] text-white shadow-lg shadow-green-200' : 'text-gray-800 hover:bg-gray-50'}`}
                            >
                                {i + 1}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events Carousel mockup */}
                <div className="lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-[#006838]">
                            Upcoming Events
                        </h3>
                        <div className="flex gap-2">
                            <button className="rounded-full border p-3 transition-colors hover:bg-[#006838] hover:text-white">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button className="rounded-full border p-3 transition-colors hover:bg-[#006838] hover:text-white">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="min-w-[300px] rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:min-w-[400px]"
                            >
                                <img
                                    src={`https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=${400 + i}`}
                                    className="mb-4 h-48 w-full rounded-xl object-cover"
                                    alt="event"
                                />
                                <h4 className="mb-2 text-lg font-bold">
                                    E-Club Starting a Business Seminar {i}
                                </h4>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>21-Mar-2024</span>
                                    <span className="flex items-center gap-1 font-bold text-[#006838]">
                                        Register{' '}
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* E-Shop */}
            <div className="border-t border-gray-200 pt-16 text-center">
                <h2 className="mb-2 text-4xl font-bold text-[#006838]">
                    E-Club's E-Shop
                </h2>
                <p className="mb-10 text-gray-600">
                    Show your E-Club pride with exclusive merchandise.
                </p>

                <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="group relative h-72 overflow-hidden rounded-2xl bg-gray-100"
                        >
                            <img
                                src={`https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=${300 + item}`}
                                alt="Merch"
                                className="h-full w-full object-cover opacity-80 mix-blend-multiply transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <p className="text-center text-sm font-bold text-white">
                                    Official Merchandise
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);
