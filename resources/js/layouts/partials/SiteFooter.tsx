import { FooterData } from '@/types/cms';
import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    MessageCircle,
} from 'lucide-react';

export const SiteFooter = ({ footerData }: { footerData: FooterData }) => (
    <footer className="bg-[#1a1a1a] pt-16 pb-8 text-white">
        <div className="container mx-auto px-4">
            <div className="mb-10 grid grid-cols-2 gap-8 border-b border-gray-700 pb-10 md:grid-cols-4">
                <div>
                    <h3 className="mb-4 text-xl font-bold text-[#006838]">
                        E-CLUB
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-400">
                        {footerData?.sections?.[0]?.content ||
                            'Empowering entrepreneurs to connect, learn, and grow through a supportive community.'}
                    </p>
                    <div className="mt-4 flex space-x-3">
                        {footerData?.socialLinks?.map((social) => (
                            <a
                                key={social.id}
                                href={social.url}
                                className="text-gray-400 transition-colors hover:text-[#006838]"
                            >
                                {/* Icon rendering needs dynamic lookup, falling back to text if needed */}
                                {social.platform}
                            </a>
                        ))}
                        {(!footerData?.socialLinks ||
                            footerData.socialLinks.length === 0) && (
                            <>
                                <a
                                    href="#"
                                    className="text-gray-400 transition-colors hover:text-[#006838]"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 transition-colors hover:text-[#006838]"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 transition-colors hover:text-[#006838]"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            </>
                        )}
                    </div>
                </div>

                {/* Render Footer Links Groups */}
                {footerData?.links && !Array.isArray(footerData.links) ? (
                    Object.entries(footerData.links).map(([group, links]) => (
                        <div key={group}>
                            <h4 className="mb-4 font-semibold text-gray-300">
                                {group}
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                {Array.isArray(links) &&
                                    links.map((link: any) => (
                                        <li key={link.id}>
                                            <a
                                                href={link.url}
                                                className="hover:text-[#006838]"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <div>
                        <h4 className="mb-4 font-semibold text-gray-300">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <a href="#" className="hover:text-[#006838]">
                                    Membership
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#006838]">
                                    E-Shop
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#006838]">
                                    Gallery
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#006838]">
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>
                )}

                <div>
                    {/* Fallback Contact manually or from data if organized */}
                    {footerData?.internationalAddresses?.map((addr) => (
                        <div key={addr.id} className="mb-4">
                            <h4 className="mb-2 font-semibold text-gray-300">
                                Contact
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[#006838]" />{' '}
                                    {addr.address}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-[#006838]" />{' '}
                                    {addr.email}
                                </li>
                                <li className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4 text-[#006838]" />{' '}
                                    {addr.phone}
                                </li>
                            </ul>
                        </div>
                    ))}
                    {(!footerData?.internationalAddresses ||
                        footerData.internationalAddresses.length === 0) && (
                        <div>
                            <h4 className="mb-4 font-semibold text-gray-300">
                                Contact
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[#006838]" />{' '}
                                    Dhaka, Bangladesh
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-[#006838]" />{' '}
                                    info@e-club.org
                                </li>
                                <li className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4 text-[#006838]" />{' '}
                                    +880 1234 567890
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="pt-6 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Entrepreneurs Club of
                Bangladesh (E-CLUB). All rights reserved.
            </div>
        </div>
    </footer>
);
