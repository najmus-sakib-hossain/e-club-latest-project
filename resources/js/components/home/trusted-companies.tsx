import { motion } from 'motion/react';

import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';
import type { TrustedCompany } from '@/types/cms';

interface TrustedCompaniesProps {
    companies: TrustedCompany[];
}

export function TrustedCompanies({ companies }: TrustedCompaniesProps) {
    if (companies.length === 0) return null;

    // Helper function to get the logo URL - uses UI Avatars as fallback (not blocked by adblockers)
    const getLogoUrl = (company: TrustedCompany) => {
        // Prefer logo_url if available
        if (company.logo_url) {
            return company.logo_url;
        }
        // If it's a stored file
        if (company.logo) {
            if (company.logo.startsWith('http')) {
                return company.logo;
            }
            return `/storage/${company.logo}`;
        }
        // Fallback to UI Avatars (not blocked by adblockers)
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=f3f4f6&color=374151&size=120&font-size=0.33`;
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Title */}
                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Who Trust Us
                </motion.h2>

                {/* Company Logos Grid - 8 columns on desktop */}
                <motion.div
                    className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 md:gap-8 items-center justify-items-center"
                    variants={staggerContainerVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {companies.map((company) => (
                        <motion.a
                            key={company.id}
                            href={company.website || '#'}
                            target={company.website ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-2 transition-all duration-300 hover:scale-110"
                            variants={staggerItemVariants}
                            title={company.name}
                        >
                            <img
                                src={getLogoUrl(company)}
                                alt={company.name}
                                className="max-h-12 md:max-h-14 lg:max-h-16 w-auto object-contain"
                                loading="lazy"
                                onError={(e) => {
                                    // Fallback to placeholder if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null; // Prevent infinite loop
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=f3f4f6&color=374151&size=120&font-size=0.33`;
                                }}
                            />
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
