import { Head } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Check } from 'lucide-react';

interface Benefit {
    id: number;
    category: string;
    title: string;
    description: string;
    icon: string;
    sort_order: number;
}

export default function Benefits({ benefits }: { benefits: Benefit[] }) {
    return (
        <SiteLayout>
            <Head title="Benefits of Membership" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Benefits of Membership
                        </h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Discover the exclusive advantages of being an E-Club member
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.id}
                                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                                            {benefit.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm text-primary font-semibold mb-1">
                                            {benefit.category}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="mt-16 text-center">
                        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-white">
                            <h2 className="text-3xl font-bold mb-4">
                                Ready to Join?
                            </h2>
                            <p className="text-lg mb-8 opacity-90">
                                Become a member today and unlock all these amazing benefits
                            </p>
                            <a
                                href="/join"
                                className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Join As Member
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
