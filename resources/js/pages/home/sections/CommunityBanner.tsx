import { CustomButton } from '@/components/ui/CustomButton';
import { ArrowRight } from 'lucide-react';

export const CommunityBanner = () => (
    <section
        className="relative flex h-[400px] items-center bg-cover bg-fixed bg-center"
        style={{
            backgroundImage:
                "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2064')",
        }}
    >
        <div className="absolute inset-0 bg-[#006838]/80 mix-blend-multiply" />

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h2 className="mx-auto mb-8 max-w-4xl text-4xl font-bold md:text-6xl">
                Thrive together. Join our founder community.
            </h2>
            <CustomButton className="rounded-full bg-[#a3e635] px-10 py-4 text-lg font-bold text-[#006838] shadow-2xl hover:bg-[#8cc63f]">
                Join as Member <ArrowRight className="ml-2" />
            </CustomButton>
        </div>
    </section>
);
