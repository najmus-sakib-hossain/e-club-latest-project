import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Linkedin, 
  Youtube, 
  ArrowUpRight, 
  ScanLine, 
  ArrowRight,
  Globe
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';

// --- UTILITY FOR TAILWIND CLASS MERGING (Simulating clsx/tailwind-merge) ---
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// --- MOCK SHADCN UI COMPONENTS (Replace with your actual imports) ---
// e.g. import { Button } from "@/components/ui/button"
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'link', size?: 'default' | 'sm' | 'lg' | 'icon' }>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant as keyof typeof variants],
          sizes[size as keyof typeof sizes],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const Separator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "shrink-0 bg-border opacity-20",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

// --- MAIN FOOTER COMPONENT ---

interface FooterProps {
  footerData?: {
    sections?: any[];
    bangladeshAddresses?: any[];
    internationalAddresses?: any[];
    links?: any;
    socialLinks?: any[];
  };
}

const Footer = ({ footerData }: FooterProps) => {
  // Use default/fallback data if footerData is not provided
  const sections = footerData?.sections || [];
  const bangladeshAddresses = footerData?.bangladeshAddresses || [];
  const internationalAddresses = footerData?.internationalAddresses || [];
  const links = footerData?.links || {};
  const socialLinks = footerData?.socialLinks || [];
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <footer className="bg-[#0b3025] text-white font-sans overflow-hidden">
      {/* Top Section: Main Info & Links */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8"
        >
          
          {/* Column 1: Brand & About */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-2">
              {/* Logo Placeholder */}
              <div className="bg-white/10 p-2 rounded-lg">
                 <span className="text-2xl font-bold tracking-tighter text-white">
                   <span className="text-red-500">E</span>CLUB
                 </span>
              </div>
              <span className="text-sm text-gray-300 uppercase tracking-widest font-semibold">Entrepreneurs Club</span>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              The Entrepreneurs Club of Bangladesh is a non-profit organization based in Bangladesh that focuses on supporting and promoting entrepreneurship in the country. The club provides resources, networking opportunities, and support to entrepreneurs.
            </p>

            <div className="space-y-2 text-sm text-gray-300">
              <div>
                <span className="font-semibold text-white block mb-1">Office Time:</span>
                Sunday – Thursday 11am–5pm
              </div>
              <div>
                <span className="font-semibold text-white">Email: </span>
                <a href="mailto:query.eclub@gmail.com" className="hover:text-emerald-400 transition-colors">query.eclub@gmail.com</a>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Community Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold text-white">Join Our Community</h3>
            <ul className="space-y-3">
              {['Online Forums', 'Networking Groups', 'Volunteer Opportunities'].map((item) => (
                <li key={item}>
                  <a href="#" className="group flex items-center text-gray-300 hover:text-emerald-400 text-sm transition-colors">
                    {item}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Blog Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold text-white">Blog</h3>
            <ul className="space-y-3">
              {['Read Blogs', 'Latest Blogs', 'Guest Articles', 'Entrepreneurial Insights', 'Industry Trends'].map((item) => (
                <li key={item}>
                  <a href="#" className="group flex items-center text-gray-300 hover:text-emerald-400 text-sm transition-colors">
                    {item}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact & QR */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Phone Numbers */}
              <div className="space-y-3 text-sm text-gray-300">
                <a href="tel:+8801792111113" className="flex items-center hover:text-emerald-400 transition-colors">
                  <Phone className="w-4 h-4 mr-2 text-emerald-500" /> +880 1792 111 113
                </a>
                <a href="tel:+8801819800006" className="flex items-center hover:text-emerald-400 transition-colors">
                  <Phone className="w-4 h-4 mr-2 text-emerald-500" /> +880 1819 800 006
                </a>
                <a href="tel:+8801740443638" className="flex items-center hover:text-emerald-400 transition-colors">
                  <Phone className="w-4 h-4 mr-2 text-emerald-500" /> +880 1740 443 638
                </a>
                
                <div className="pt-2 text-xs text-gray-400">
                  <p>Visit Time: 11am to 6pm</p>
                  <p className="mt-1 opacity-70">Please call respective branch number before visiting offices.</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center sm:items-end space-y-3">
                <div className="bg-white p-2 rounded-lg w-28 h-28 flex items-center justify-center">
                   {/* Mock QR Code */}
                   <div className="w-full h-full bg-gray-900 flex flex-wrap content-center justify-center gap-1">
                      <div className="w-3/4 h-3/4 border-4 border-black relative flex items-center justify-center">
                        <div className="w-1/2 h-1/2 bg-black"></div>
                      </div>
                   </div>
                </div>
                <Button size="sm" className="w-28 bg-[#0a1f26] hover:bg-[#143d35] text-emerald-400 border border-emerald-900/50 shadow-lg text-xs font-medium">
                  <ScanLine className="w-3 h-3 mr-2" /> Scan Me
                </Button>
              </div>
            </div>

            {/* Socials */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold mb-3">Follow Us On</h4>
              <div className="flex space-x-3">
                {[Facebook, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="bg-white/10 hover:bg-emerald-600 p-2 rounded-full transition-all duration-300 hover:scale-110">
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      <Separator className="bg-emerald-800/30 container mx-auto" />

      {/* Middle Section: Bangladesh Addresses */}
      <div className="bg-[#0b3025] relative">
        <div className="container mx-auto px-4 py-12">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.5 }}
            className="text-xl font-semibold mb-8 flex items-center"
          >
            <span className="w-1 h-6 bg-emerald-500 mr-3 rounded-full"></span>
            Bangladesh Collaboration Addresses
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AddressCard 
              title="Branch Office in Gulshan/Banani"
              address="House-108, Road-12, Floor-3rd, Block-E, Gulshan, Banani, (Beside Prescription Point), Dhaka, Bangladesh"
              phone="+880707-929811"
            />
            <AddressCard 
              title="Branch Office in Panthapath/Banglamotor"
              address="50, Lake Circus, 5th Floor, Kalabagan, Dhaka, Dhaka Division, Bangladesh"
              phone="+8801819-800006"
            />
            <AddressCard 
              title="Branch Office in Dhanmondi/Lalmatia"
              address="275/D, Suite # C11, Lift Level-11, Rd 27, Dhaka 1207"
              phone="+8801711-661665"
            />
            <AddressCard 
              title="Branch Office in Niketon/Badda"
              address="H# 87-89, R# 4, Bl# B, 1st Floor, Niketon, Gulshan, Dhaka 1212, Bangladesh"
              phone="+8801331-546622"
            />
             <AddressCard 
              title="Branch Office in Motijheel/Paltan"
              address="Suite# F-11, Level# 11, TROPICANA TOWER, 45 Purana Paltan, Dhaka 1000"
              phone="+8801988-121212"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: International Addresses */}
      <div className="bg-[#09281f] border-t border-emerald-900/30">
        <div className="container mx-auto px-4 py-12">
           <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.5 }}
            className="text-xl font-semibold mb-8 flex items-center"
          >
            <span className="w-1 h-6 bg-teal-500 mr-3 rounded-full"></span>
            International Collaboration Addresses
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Dubai', 'Malaysia', 'Canada', 'USA', 'Singapore', 'Thailand'].map((country) => (
               <AddressCard 
               key={country}
               title={country}
               // Note: Using placeholder text as per the reference image design which reused the Gulshan address
               address={`Collaboration Office in ${country}. Contact us for specific location details and appointments.`}
               phone="+880707-929811"
               icon={<Globe className="w-5 h-5 text-white" />}
             />
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#b91c1c] text-white py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm">
          <p>© 2024. All Rights Reserved</p>
          <div className="flex items-center mt-2 sm:mt-0">
             <span className="opacity-80 mr-1">Designed & Managed by</span>
             <a href="#" className="font-bold hover:underline decoration-white/50 underline-offset-4">Nexkraft</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- HELPER COMPONENTS ---

const AddressCard = ({ title, address, phone, icon }: { title: string, address: string, phone: string, icon?: React.ReactNode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-50px" }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
      className="flex items-start p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-default"
    >
      <div className="flex-shrink-0 mr-4">
        <div className="w-12 h-12 bg-[#3f8f7f] rounded-lg flex items-center justify-center shadow-lg group-hover:bg-[#4fa794] transition-colors">
          {icon || <MapPin className="w-5 h-5 text-white" />}
        </div>
      </div>
      <div>
        <h4 className="font-bold text-white text-sm mb-1 group-hover:text-emerald-300 transition-colors">{title}</h4>
        <p className="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-3">{address}</p>
        <div className="flex items-center text-xs font-semibold text-emerald-400">
          <span className="text-gray-500 mr-1 font-normal">Contact:</span> {phone}
        </div>
      </div>
    </motion.div>
  );
};

// --- APP WRAPPER FOR PREVIEW ---

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Fake Header/Body to push footer down */}
      <div className="flex-grow container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Scroll Down</h1>
        <p className="text-gray-600">To see the animated footer implementation.</p>
        <ArrowRight className="w-6 h-6 mx-auto mt-8 text-gray-400 rotate-90 animate-bounce" />
      </div>
      
      {/* The Footer */}
      <Footer />
    </div>
  );
}