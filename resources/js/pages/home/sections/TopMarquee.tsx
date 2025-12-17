import { motion } from 'framer-motion';

export const TopMarquee = () => (
    <div className="flex items-center overflow-hidden border-b bg-white py-2">
        <span className="z-10 bg-white px-4 text-sm font-bold text-[#006838]">
            Notice
        </span>
        <motion.div
            className="flex text-sm whitespace-nowrap text-gray-600"
            animate={{ x: ['100%', '-100%'] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        >
            <span className="mx-4">•</span> This is a marquee notice. Upcoming
            events for E-Club members are now live!
            <span className="mx-4">•</span> Registration for the Startup Pitch
            Competition closes soon.
            <span className="mx-4">•</span> New mentorship programs available
            for premium members.
        </motion.div>
    </div>
);
