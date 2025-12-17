import { CustomButton } from '@/components/ui/CustomButton';
import { Play } from 'lucide-react';

export const MediaGallery = () => (
    <section className="bg-white py-20 text-center">
        <div className="container mx-auto px-4">
            <h2 className="mb-4 text-4xl font-bold text-[#006838]">
                E-Club Media Gallery
            </h2>
            <p className="mb-8 text-gray-600">
                Show your E-Club pride with exclusive merchandise.
            </p>

            <div className="mb-12 flex justify-center gap-3">
                <CustomButton className="rounded-full px-6">All</CustomButton>
                <CustomButton variant="outline" className="rounded-full px-6">
                    Images
                </CustomButton>
                <CustomButton variant="outline" className="rounded-full px-6">
                    Videos
                </CustomButton>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="group relative cursor-pointer overflow-hidden rounded-xl shadow-md"
                    >
                        <img
                            src={`https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=${400 + item}`}
                            alt="Gallery"
                            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/20 backdrop-blur-md">
                                <Play className="h-5 w-5 fill-white text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
