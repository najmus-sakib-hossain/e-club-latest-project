import { HomePartner } from '@/types/cms';

export const PartnersAndNewsSection = ({
    partners,
}: {
    partners: HomePartner[];
}) => (
    <section className="border-t border-gray-100 bg-white py-24">
        <div className="container mx-auto px-4">
            {/* Partners */}
            <div className="mb-24 text-center">
                <h2 className="mb-16 text-4xl font-bold text-[#006838]">
                    Our Partners
                </h2>
                {partners && partners.length > 0 ? (
                    <div className="flex flex-wrap items-end justify-center gap-16 grayscale transition-all duration-500 hover:grayscale-0 md:gap-24">
                        {partners.map((partner, idx) => (
                            <div
                                key={partner.id}
                                className="group flex flex-col items-center"
                            >
                                {/* Placeholder for Logo if not present, but use name */}
                                <div
                                    className={`text-2xl font-black md:text-3xl ${partner.color || 'text-blue-700'} mb-2`}
                                >
                                    {partner.name}
                                </div>
                                <div className="mb-2 h-1 w-12 bg-gray-200 transition-colors group-hover:bg-[#006838]"></div>
                                {partner.type && (
                                    <p className="max-w-[150px] text-center text-xs text-gray-500">
                                        {partner.type}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No partners found.</p>
                )}
            </div>

            {/* News (Keeping hardcoded for now as no data source yet) */}
            <div>
                <h2 className="mb-4 text-4xl font-bold text-[#006838]">News</h2>
                <p className="mb-12 text-gray-600">
                    Stay informed about us with all the news we are featured in
                </p>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((_, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-center rounded-xl border p-6 transition-shadow hover:shadow-md"
                        >
                            {/* Prothom Alo Logo Simulation */}
                            <div className="flex flex-col items-center">
                                <div className="relative z-0 mb-[-20px] h-10 w-10 rounded-full bg-gray-300 opacity-50"></div>
                                <span className="relative z-10 text-2xl font-bold text-gray-800 md:text-3xl">
                                    প্রথম আলো
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);
