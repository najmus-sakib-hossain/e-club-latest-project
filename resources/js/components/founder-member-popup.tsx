import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const COOKIE_NAME = 'founder_member_popup_dismissed';
const COOKIE_EXPIRY_DAYS = 30;

interface FounderMemberPopupProps {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    imageUrl?: string;
}

export function FounderMemberPopup({
    title = 'Become a Founder Member',
    description = "Join our exclusive club and unlock a world of opportunities! Get personalized support, access to exclusive resources, and connect with like-minded professionals. Become a Founder Member today!",
    buttonText = 'Join Now',
    buttonLink = '/join',
    imageUrl = '/images/founder-member-popup.jpg',
}: FounderMemberPopupProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Check if cookie exists
        const hasSeenPopup = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${COOKIE_NAME}=`));

        if (!hasSeenPopup) {
            // Show popup after a small delay
            const timer = setTimeout(() => {
                setOpen(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setOpen(false);

        // Set cookie to expire in 30 days
        const date = new Date();
        date.setTime(date.getTime() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${COOKIE_NAME}=true;${expires};path=/`;
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[900px]">
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-1.5 shadow-lg transition-all hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    aria-label="Close popup"
                >
                    <X className="h-5 w-5 text-gray-600" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left side - Image */}
                    <div className="relative h-64 w-full overflow-hidden bg-gray-100 md:h-auto">
                        <img
                            src={imageUrl}
                            alt="Founder Member"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                // Fallback if image doesn't exist
                                const target = e.target as HTMLImageElement;
                                target.src =
                                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"%3E%3Crect width="400" height="600" fill="%230e5843"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EE-Club%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    </div>

                    {/* Right side - Content */}
                    <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
                        {/* Logo */}
                        <div className="mb-6">
                            <div className="flex flex-col">
                                <span className="text-3xl leading-none font-bold text-[#0e5843]">
                                    E<span className="text-red-600">C</span>LUB
                                </span>
                                <span className="text-[0.6rem] tracking-wider text-gray-600 uppercase">
                                    Entrepreneurs Club
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <DialogHeader className="space-y-4 text-left">
                            <DialogTitle className="text-2xl font-bold leading-tight text-[#0e5843] md:text-3xl">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-base leading-relaxed text-gray-600">
                                {description}
                            </DialogDescription>
                        </DialogHeader>

                        {/* CTA Button */}
                        <div className="mt-8">
                            <Button
                                asChild
                                className="w-full bg-[#0e5843] py-6 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#0b4635] hover:shadow-xl"
                            >
                                <a href={buttonLink} onClick={handleClose}>
                                    {buttonText}
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
