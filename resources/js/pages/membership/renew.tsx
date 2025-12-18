import { Head } from '@inertiajs/react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface MembershipType {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: string;
    features: string[];
}

export default function RenewMembership({ membershipTypes }: { membershipTypes: MembershipType[] }) {
    return (
        <SiteLayout>
            <Head title="Renew Membership" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Renew Membership
                        </h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Continue your E-Club journey and access ongoing benefits
                        </p>
                    </div>
                </div>
            </section>

            {/* Membership Plans */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {membershipTypes.map((type) => (
                            <Card key={type.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-2xl">{type.name}</CardTitle>
                                    <CardDescription>{type.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">৳{type.price}</span>
                                        <span className="text-gray-600 ml-2">/ {type.duration}</span>
                                    </div>
                                    <ul className="space-y-3">
                                        {type.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <a href={`/membership/renew/${type.id}`}>
                                            Renew Now
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
                        <p className="text-gray-600 mb-6">
                            If you have any questions about renewing your membership, our team is here to help.
                        </p>
                        <Button asChild variant="outline">
                            <a href="/contact">Contact Support</a>
                        </Button>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
