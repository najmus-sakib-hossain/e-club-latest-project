"use client";

import React from "react";
// Since external components like Head and SiteLayout cannot be imported,
// we define the necessary structure and UI components locally for a self-contained application.
import { 
  ArrowRight, 
  MapPin, 
  Facebook, 
  Linkedin, 
  MessageCircle, 
  Mail, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Target, 
  Lightbulb, 
  Briefcase, 
  Instagram
} from "lucide-react";
import { motion } from "framer-motion";

// --- Site Layout Components (Self-Contained) ---

/**
 * Custom button component using Tailwind classes for styling.
 */
const CustomButton = ({ 
  children, 
  className = "", 
  variant = "primary",
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-transform active:scale-95 duration-200";
  const variants = {
    primary: "bg-[#006838] text-white hover:bg-[#00522c] shadow-lg shadow-green-900/20",
    secondary: "bg-[#e63946] text-white hover:bg-[#d62839] shadow-lg shadow-red-900/20",
    outline: "border-2 border-[#006838] text-[#006838] hover:bg-green-50",
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

/**
 * Mock Site Header for the SiteLayout.
 */
const SiteHeader = () => (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="text-2xl font-black text-[#006838]">E-CLUB</div>
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
                <a href="#" className="hover:text-[#e63946] transition-colors">Home</a>
                <a href="#" className="hover:text-[#e63946] transition-colors">About</a>
                <a href="#" className="hover:text-[#e63946] transition-colors">Projects</a>
                <a href="#" className="hover:text-[#e63946] transition-colors">Events</a>
                <a href="#" className="hover:text-[#e63946] transition-colors">Contact</a>
            </nav>
            <CustomButton className="h-9 px-4 text-sm hidden sm:flex">
                Member Login
            </CustomButton>
        </div>
    </header>
);

/**
 * Mock Site Footer for the SiteLayout.
 */
const SiteFooter = () => (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-10 mb-10">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-[#006838]">E-CLUB</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Empowering entrepreneurs to connect, learn, and grow through a supportive community.
                    </p>
                    <div className="flex space-x-3 mt-4">
                         <a href="#" className="text-gray-400 hover:text-[#006838] transition-colors"><Facebook className="w-5 h-5" /></a>
                         <a href="#" className="text-gray-400 hover:text-[#006838] transition-colors"><Instagram className="w-5 h-5" /></a>
                         <a href="#" className="text-gray-400 hover:text-[#006838] transition-colors"><Linkedin className="w-5 h-5" /></a>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-gray-300">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-[#006838]">Membership</a></li>
                        <li><a href="#" className="hover:text-[#006838]">E-Shop</a></li>
                        <li><a href="#" className="hover:text-[#006838]">Gallery</a></li>
                        <li><a href="#" className="hover:text-[#006838]">Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-gray-300">Contact</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#006838]" /> Dhaka, Bangladesh</li>
                        <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#006838]" /> info@e-club.org</li>
                        <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#006838]" /> +880 1234 567890</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-gray-300">Newsletter</h4>
                    <p className="text-sm text-gray-400 mb-4">Subscribe for latest updates.</p>
                    <div className="flex">
                        <input type="email" placeholder="Your email" className="p-2 rounded-l-md text-sm text-gray-900 flex-grow" />
                        <button className="bg-[#006838] p-2 rounded-r-md hover:bg-[#00522c]"><ArrowRight className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>
            <div className="text-center text-xs text-gray-500 pt-6">
                &copy; {new Date().getFullYear()} Entrepreneurs Club of Bangladesh (E-CLUB). All rights reserved.
            </div>
        </div>
    </footer>
);

/**
 * The wrapper layout component replacing the external SiteLayout.
 */
const SiteLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col font-sans">
        {/* We would typically put the <Head title="Home" /> tag here, but since it's an external dependency, we omit it. */}
        <SiteHeader />
        <main className="flex-grow">
            {children}
        </main>
        <SiteFooter />
    </div>
);

// --- Animations ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// --- Sections ---

const TopMarquee = () => (
  <div className="bg-white border-b py-2 overflow-hidden flex items-center">
    <span className="font-bold px-4 text-sm bg-white z-10 text-[#006838]">Notice</span>
    <motion.div 
      className="whitespace-nowrap flex text-sm text-gray-600"
      animate={{ x: ["100%", "-100%"] }}
      transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
    >
      <span className="mx-4">•</span> This is a marquee notice. Upcoming events for E-Club members are now live!
      <span className="mx-4">•</span> Registration for the Startup Pitch Competition closes soon.
      <span className="mx-4">•</span> New mentorship programs available for premium members.
    </motion.div>
  </div>
);

const HeroSection = () => (
  <section className="container mx-auto px-4 py-12 md:py-20">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[400px] md:h-[500px] group"
      >
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
          alt="E-Club Members" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-gray-900">
          To make a better future get <span className="text-[#006838] underline decoration-4 decoration-[#a3e635]">E-Club</span> Membership Certificate.
        </motion.h1>
        <motion.p variants={fadeInUp} className="text-gray-600 mb-8 leading-relaxed text-lg">
          The Entrepreneurs Club of Bangladesh (E-Club) is a community of business owners, entrepreneurs, and professionals in Bangladesh focused on growth, networking, and success.
        </motion.p>
        <motion.div variants={fadeInUp} className="flex gap-4">
          <CustomButton className="h-12 px-8 rounded-full text-base gap-2">
            Join as Member <ArrowRight className="w-5 h-5" />
          </CustomButton>
          <CustomButton variant="outline" className="h-12 px-8 rounded-full text-base">
            Learn More
          </CustomButton>
        </motion.div>
      </motion.div>
    </div>

    {/* Stats */}
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-4 mt-20 border-t border-gray-100 pt-10 text-center"
    >
      {[
        { count: "04", label: "Advisors" },
        { count: "05", label: "Governing Body" },
        { count: "20", label: "Founders" },
        { count: "15", label: "EC Members" },
        { count: "520", label: "General Members" },
        { count: "81", label: "Women Entrepreneur" },
        { count: "80", label: "Standing Committee" },
        { count: "05", label: "Projects" },
        { count: "10", label: "District" },
      ].map((stat, idx) => (
        <motion.div variants={fadeInUp} key={idx} className="flex flex-col items-center group cursor-default">
          <span className="text-3xl font-bold text-[#e63946] group-hover:scale-110 transition-transform">{stat.count}</span>
          <span className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mt-1">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

const AboutSection = () => (
  <section className="bg-[#f8fcf9] py-20 relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    <div className="container mx-auto px-4 relative z-10">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-[#006838] text-4xl font-bold mb-12"
      >
        About Us
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-12">
        {[
          {
            title: "Entrepreneurs Club of Bangladesh",
            content: "Founded in 2018 and registered with RJSC, the Entrepreneurs Club of Bangladesh is a non-profit organization dedicated to empowering entrepreneurs across the country. Through resource provision, networking opportunities, and ongoing support, the club helps aspiring and established entrepreneurs build and grow thriving businesses."
          },
          {
            title: "Our Mission",
            content: "The Entrepreneurs Club of Bangladesh supports entrepreneurs by providing a network for collaboration and growth, fostering new ventures and member connections."
          },
          {
            title: "Our Vision",
            content: "The Entrepreneurs Club of Bangladesh envisions a thriving ecosystem empowering entrepreneurs and fostering economic development."
          }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`pr-6 ${idx !== 2 ? "md:border-r border-gray-200" : ""}`}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm text-justify">{item.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FounderMessageSection = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-[#006838] text-4xl font-bold mb-12"
      >
        Founder's Message
      </motion.h2>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        {/* Text Content */}
        <motion.div 
          className="lg:col-span-3 space-y-6 text-gray-600 text-justify leading-relaxed"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-semibold text-gray-800">Assalamuwalikum, Dear Eclubian Entrepreneurs,</p>
          
          <p>
            I am delighted to welcome you all to the Entrepreneurs Club of Bangladesh (E-Club). As the founder and president of this club, I am proud to see the growing number of passionate entrepreneurs who are joining us on this exciting journey.
          </p>
          <p>
            Entrepreneurship is not just a career choice, it is a way of life. It takes hard work, dedication, and courage to succeed as an entrepreneur. But when you do, the satisfaction and joy that comes with it is unmatched.
          </p>
          <p>
            At the Entrepreneurs Club, we believe in creating a supportive community where entrepreneurs can learn from each other, share their experiences, and grow together. Our goal is to help entrepreneurs succeed by providing them with the resources and support they need, such as workshops, mentorship programs, and networking opportunities.
          </p>
          <p>
            The E-Club was founded in 2018 as a private initiative of collective action planning. We are excited to be a part of this incredible journey and to witness the amazing progress that our members are making. We encourage all of you to join us and take advantage of the opportunities that we offer.
          </p>
          
          <div className="pt-8">
            <h3 className="text-xl font-bold text-gray-900">Mohammad Shahriar Khan</h3>
            <p className="text-sm text-gray-500 mb-4">Founder, Entrepreneurs Club of Bangladesh</p>
            
            <div className="flex gap-3">
              {[Facebook, Linkedin, MessageCircle, Mail].map((Icon, idx) => (
                <div key={idx} className="bg-[#006838] p-2 rounded-full text-white hover:bg-[#004d2a] cursor-pointer transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-[8px] border-white bg-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
              alt="Mohammad Shahriar Khan" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
               <p className="text-white font-bold text-lg">Mohammad Shahriar Khan</p>
               <p className="text-white/80 text-sm">Founder</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const FeaturedEvents = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="rounded-[2.5rem] bg-[#006838] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
        {/* Abstract Pattern overlay */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        
        <div className="grid lg:grid-cols-3 gap-12 relative z-10 items-center">
          {/* Cards */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {[
              { title: "E-Club's Startup Pitch Competition", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80", date: "24-07-24", duration: "2 days event" },
              { title: "E-Club's Digital Marketing Workshop", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80", date: "24-08-24", duration: "1 day event" }
            ].map((event, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden text-black shadow-lg"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={event.img} alt={event.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#006838]">
                    Featured
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg mb-4 line-clamp-2 h-14">{event.title}</h4>
                  <div className="flex justify-between text-xs text-gray-500 font-medium border-t pt-3">
                    <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3" /> {event.date}</span>
                    <span>{event.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Text Content */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Join our featured Events & connect with Entrepreneurs
            </h2>
            <CustomButton variant="secondary" className="h-12 px-8 rounded-full">
              More Events <ArrowRight className="ml-2 w-4 h-4" />
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const SDGGoals = () => (
  <section className="py-20 bg-white text-center">
    <div className="container mx-auto px-4">
      <div className="flex justify-center mb-10">
        <div className="bg-green-50 rounded-full p-6 inline-block shadow-inner">
           <Target className="w-12 h-12 text-[#006838]" />
        </div>
      </div>
      <h2 className="text-[#006838] text-4xl font-bold mb-16">Our SDG Goal</h2>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { id: "05", title: "Gender Equality", desc: "Achieve gender equality and empower all women and girls", color: "from-purple-500 to-indigo-600" },
          { id: "08", title: "Decent Work", desc: "Promote sustained inclusive and sustainable economic growth", color: "from-blue-400 to-blue-600" },
          { id: "11", title: "Sustainable Cities", desc: "Make cities and human settlements inclusive, safe, resilient", color: "from-green-400 to-emerald-600" },
        ].map((goal, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className={`rounded-3xl p-8 text-white text-left bg-gradient-to-br ${goal.color} shadow-xl h-72 flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-5xl font-bold opacity-30">{goal.id}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">{goal.title}</h3>
              <p className="text-sm opacity-90 leading-snug">{goal.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ActivitiesSection = () => (
  <section className="py-20 bg-[#f8fcf9]">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-[#006838] text-4xl font-bold mb-4">E-Club's Activities</h2>
      <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Learn from industry experts, workshops, and networking events to expand your skillset and knowledge.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: "01", title: "Own Market", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80" },
          { id: "02", title: "E-Loan", img: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80" },
          { id: "03", title: "Online Meetup", img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80" },
          { id: "04", title: "Fair Arrangement", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80" }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="bg-black/80 backdrop-blur text-white px-3 py-1 text-sm font-bold rounded-lg">{item.id}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10 text-left">
               <h3 className="text-white font-bold text-lg">{item.title}</h3>
            </div>
            <div className="h-72 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ProjectsSection = () => (
  <section className="py-20 bg-white text-center">
    <div className="container mx-auto px-4">
      <h2 className="text-[#006838] text-4xl font-bold mb-4">E-Club's Projects</h2>
      <p className="text-gray-600 mb-12">Discover real-world applications of entrepreneurial ideas.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { name: "নেটওয়ার্ক বাস্কেট", sub: "Entrepreneur Club Project", color: "text-purple-600", border: "border-purple-100 bg-purple-50" },
          { name: "প্রসার", sub: "Entrepreneur Club Project", color: "text-blue-600", border: "border-blue-100 bg-blue-50" },
          { name: "ভিন্নতা", sub: "Entrepreneur Club Project", color: "text-pink-600", border: "border-pink-100 bg-pink-50" },
          { name: "নেটওয়ার্ক বাস্কেট", sub: "Entrepreneur Club Project", color: "text-purple-600", border: "border-purple-100 bg-purple-50" },
          { name: "মেন্টর এক্সিলারেশন", sub: "Entrepreneur Club Project", color: "text-red-600", border: "border-red-100 bg-red-50" },
          { name: "ই-শপ", sub: "Entrepreneur Club Project", color: "text-indigo-600", border: "border-indigo-100 bg-indigo-50" },
          { name: "বন্ধন", sub: "Entrepreneur Club Project", color: "text-purple-800", border: "border-purple-100 bg-purple-50" },
          { name: "গল্পের শুরু এখানেই", sub: "Entrepreneur Club Project", color: "text-green-600", border: "border-green-100 bg-green-50" },
        ].map((project, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ scale: 1.02 }}
            className={`border rounded-2xl p-6 flex flex-col items-center justify-center h-40 transition-shadow ${project.border}`}
          >
            <h3 className={`text-xl md:text-2xl font-bold ${project.color} font-serif text-center`}>{project.name}</h3>
          </motion.div>
        ))}
      </div>
      
      <CustomButton className="h-12 px-8 rounded-full text-base">
        More Projects <ArrowRight className="ml-2 w-4 h-4" />
      </CustomButton>
    </div>
  </section>
);

const PartnersAndNewsSection = () => (
  <section className="py-24 bg-white border-t border-gray-100">
    <div className="container mx-auto px-4">
      {/* Partners */}
      <div className="text-center mb-24">
        <h2 className="text-[#006838] text-4xl font-bold mb-16">Our Partners</h2>
        <div className="flex flex-wrap justify-center items-end gap-16 md:gap-24 grayscale hover:grayscale-0 transition-all duration-500">
          {[
            { name: "NexKraft Limited", type: "Technology Company", color: "text-blue-700" },
            { name: "KODOMO", type: "Baby Care Products", color: "text-blue-500" },
            { name: "Medistore", type: "Online Platform Media", color: "text-indigo-900" },
            { name: "Shaira Garden", type: "Resort & Hotel", color: "text-red-600" }
          ].map((partner, idx) => (
            <div key={idx} className="flex flex-col items-center group">
               {/* Placeholder for Logo */}
               <div className={`text-2xl md:text-3xl font-black ${partner.color} mb-2`}>{partner.name}</div>
               <div className="h-1 w-12 bg-gray-200 group-hover:bg-[#006838] transition-colors mb-2"></div>
               <p className="text-xs text-gray-500 text-center max-w-[150px]">{partner.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* News */}
      <div>
        <h2 className="text-[#006838] text-4xl font-bold mb-4">News</h2>
        <p className="text-gray-600 mb-12">Stay informed about us with all the news we are featured in</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7].map((_, idx) => (
             <div key={idx} className="flex items-center justify-center p-6 border rounded-xl hover:shadow-md transition-shadow">
               {/* Prothom Alo Logo Simulation */}
               <div className="flex flex-col items-center">
                 <div className="w-10 h-10 rounded-full bg-gray-300 relative mb-[-20px] z-0 opacity-50"></div>
                 <span className="text-2xl md:text-3xl font-bold text-gray-800 z-10 relative">প্রথম আলো</span>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const MapSection = () => (
  <section className="py-20 bg-[#f0fdf4] overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="flex justify-center gap-4 mb-16 flex-wrap">
        {[
            { id: "09", label: "Offline Training", color: "text-yellow-600 border-yellow-600" },
            { id: "10", label: "Business Support", color: "text-orange-600 border-orange-600" },
            { id: "11", label: "Investment", color: "text-red-600 border-red-600" }
        ].map((tab, idx) => (
            <button key={idx} className={`flex items-center gap-3 px-6 py-2 rounded-full border bg-white ${tab.color} hover:shadow-lg transition-all`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${tab.color.replace('text-', 'bg-').replace('border-', '')}`}>{tab.id}</span>
                <span className="font-medium">{tab.label}</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Visual Map Representation */}
        <div className="relative h-[500px] w-full bg-white rounded-3xl p-4 flex items-center justify-center border border-gray-100 shadow-xl">
           <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Dhaka_District_Locator_Map.svg/1200px-Dhaka_District_Locator_Map.svg.png')] bg-contain bg-center bg-no-repeat" />
           
           {/* Mock Pins */}
           {[
               { name: "Uttara", top: "15%", left: "50%", color: "bg-lime-500" },
               { name: "Mirpur", top: "30%", left: "30%", color: "bg-blue-600" },
               { name: "Gulshan", top: "35%", left: "60%", color: "bg-yellow-400" },
               { name: "Dhanmondi", top: "50%", left: "35%", color: "bg-red-600" },
               { name: "Old Dhaka", top: "70%", left: "40%", color: "bg-green-600" },
           ].map((pin, i) => (
               <motion.div 
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="absolute flex flex-col items-center"
                style={{ top: pin.top, left: pin.left }}
               >
                   <div className={`${pin.color} text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm mb-1`}>{pin.name}</div>
                   <MapPin className={`w-6 h-6 ${pin.color.replace('bg-', 'text-')} drop-shadow-md`} fill="currentColor" />
               </motion.div>
           ))}
        </div>

        <div>
           <h3 className="text-2xl font-bold mb-8 text-gray-800 leading-snug">
               The Entrepreneur Club of Bangladesh (E-Club) organizes area-based members meetups to foster:
           </h3>
           
           <div className="grid grid-cols-2 gap-6">
               {[
                   { icon: Users, title: "Build Strong Community", desc: "Connect entrepreneurs from different parts of the country.", color: "text-pink-500" },
                   { icon: Lightbulb, title: "Share Experience", desc: "A platform to share experiences and learn.", color: "text-purple-500" },
                   { icon: Target, title: "Identify Challenges", desc: "Address the challenges faced by entrepreneurs.", color: "text-blue-500" },
                   { icon: Briefcase, title: "Promote Entrepreneurship", desc: "Inspire innovation and new ventures.", color: "text-green-500" },
               ].map((item, idx) => (
                   <motion.div 
                    key={idx}
                    className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-lg transition-all"
                    whileHover={{ y: -5 }}
                   >
                       <item.icon className={`w-8 h-8 mb-3 ${item.color}`} />
                       <h4 className="font-bold text-sm mb-2">{item.title}</h4>
                       <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                   </motion.div>
               ))}
           </div>
        </div>
      </div>
    </div>
  </section>
);

const CoreValues = () => (
  <section className="py-24 bg-white text-center overflow-hidden">
    <div className="container mx-auto px-4">
      <h2 className="text-[#006838] text-4xl font-bold mb-4">Core Values of E-Club</h2>
      <p className="text-gray-600 mb-20 max-w-2xl mx-auto">These core values guide the actions and initiatives of the Entrepreneurs Club of Bangladesh and shape its culture and community.</p>
      
      <div className="relative flex flex-col md:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2" />
        
        {[
          { title: "Innovation", desc: "Thinking creatively and taking risks." },
          { title: "Collaboration", desc: "Creating a supportive community." },
          { title: "Empowerment", desc: "Providing resources for growth." },
          { title: "Dedication", desc: "Helping members succeed." }
        ].map((val, idx) => (
          <motion.div 
            key={idx}
            className="bg-white rounded-full border-2 border-[#006838] w-64 h-64 flex flex-col items-center justify-center p-6 shadow-xl z-10 hover:bg-[#006838] group transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <h3 className="text-[#006838] group-hover:text-white font-bold text-xl mb-3 transition-colors">{val.title}</h3>
            <p className="text-xs text-gray-600 group-hover:text-green-50 transition-colors">{val.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16">
        <CustomButton className="px-10 py-3 rounded-full text-lg">
           Join as Member <ArrowRight className="ml-2 w-5 h-5" />
        </CustomButton>
      </div>
    </div>
  </section>
);

const PresidentMessage = () => (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
            {[
                { 
                    role: "President's Message", 
                    name: "Dr. Mohammad Shah Alam Chowdhury", 
                    tenure: "President (2023-24)",
                    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
                    msg: "Together, we can build a future where innovation knows no bounds, where dreams are transformed into reality, and where the entrepreneurial spirit is nurtured."
                },
                { 
                    role: "General Secretary's Message", 
                    name: "Biplob Ghosh Rahul", 
                    tenure: "General Secretary (2023-24)",
                    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
                    msg: "From bustling local markets to global business ventures, entrepreneurs have been the driving force behind our economic growth and development."
                }
            ].map((person, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm relative border border-gray-100">
                    <h3 className="text-[#006838] text-2xl font-bold mb-6">{person.role}</h3>
                    <div className="flex gap-4 mb-6">
                        <span className="text-8xl font-serif text-gray-100 leading-[0] absolute top-20 left-4 -z-10">“</span>
                        <p className="text-gray-600 relative z-10 italic leading-relaxed text-sm">{person.msg}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-8 border-t pt-6">
                        <img src={person.img} alt={person.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#006838] p-0.5" />
                        <div>
                            <h4 className="font-bold text-lg">{person.name}</h4>
                            <p className="text-gray-500 text-sm">{person.tenure}</p>
                            <div className="flex gap-2 mt-2">
                                <Facebook className="w-4 h-4 text-gray-400 hover:text-[#006838] cursor-pointer" />
                                <Linkedin className="w-4 h-4 text-gray-400 hover:text-[#006838] cursor-pointer" />
                                <Mail className="w-4 h-4 text-gray-400 hover:text-[#006838] cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
);

const CommunityBanner = () => (
    <section className="relative h-[400px] flex items-center bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2064')"}}>
        <div className="absolute inset-0 bg-[#006838]/80 mix-blend-multiply" />
        
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 max-w-4xl mx-auto">Thrive together. Join our founder community.</h2>
            <CustomButton className="bg-[#a3e635] text-[#006838] hover:bg-[#8cc63f] font-bold px-10 py-4 rounded-full text-lg shadow-2xl">
                Join as Member <ArrowRight className="ml-2" />
            </CustomButton>
        </div>
    </section>
);

const MediaGallery = () => (
    <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-4">
            <h2 className="text-[#006838] text-4xl font-bold mb-4">E-Club Media Gallery</h2>
            <p className="text-gray-600 mb-8">Show your E-Club pride with exclusive merchandise.</p>
            
            <div className="flex justify-center gap-3 mb-12">
                <CustomButton className="rounded-full px-6">All</CustomButton>
                <CustomButton variant="outline" className="rounded-full px-6">Images</CustomButton>
                <CustomButton variant="outline" className="rounded-full px-6">Videos</CustomButton>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="relative group overflow-hidden rounded-xl cursor-pointer shadow-md">
                        <img 
                            src={`https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=${400 + item}`} 
                            alt="Gallery" 
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                <Play className="w-5 h-5 text-white fill-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CalendarShopSection = () => (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8 mb-20">
                {/* Calendar Widget */}
                <div className="bg-white p-6 rounded-[2rem] shadow-xl col-span-1 border border-green-100">
                    <h3 className="text-2xl font-bold mb-4 text-[#006838]">Wed, Mar 21</h3>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-medium text-gray-500">March 2024</span>
                        <div className="flex gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                            <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>
                    {/* Simplified Calendar Grid */}
                    <div className="grid grid-cols-7 text-center text-xs gap-y-4 text-gray-400 font-medium">
                        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                        {[...Array(31)].map((_, i) => (
                            <span key={i} className={`p-2 rounded-full w-8 h-8 flex items-center justify-center mx-auto ${i === 20 ? 'bg-[#006838] text-white shadow-lg shadow-green-200' : 'hover:bg-gray-50 text-gray-800'}`}>{i + 1}</span>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events Carousel mockup */}
                <div className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[#006838] text-2xl font-bold">Upcoming Events</h3>
                        <div className="flex gap-2">
                            <button className="p-3 border rounded-full hover:bg-[#006838] hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                            <button className="p-3 border rounded-full hover:bg-[#006838] hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="min-w-[300px] md:min-w-[400px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <img src={`https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=${400 + i}`} className="w-full h-48 object-cover rounded-xl mb-4" alt="event" />
                                <h4 className="font-bold text-lg mb-2">E-Club Starting a Business Seminar {i}</h4>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>21-Mar-2024</span>
                                    <span className="text-[#006838] font-bold flex items-center gap-1">Register <ArrowRight className="w-4 h-4" /></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* E-Shop */}
            <div className="text-center border-t border-gray-200 pt-16">
                <h2 className="text-[#006838] text-4xl font-bold mb-2">E-Club's E-Shop</h2>
                <p className="text-gray-600 mb-10">Show your E-Club pride with exclusive merchandise.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="bg-gray-100 rounded-2xl overflow-hidden group relative h-72">
                            <img 
                                src={`https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=${300 + item}`} 
                                alt="Merch" 
                                className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-sm font-bold text-white text-center">Official Merchandise</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);


// --- Main Page Component ---

export default function Home() {
  return (
    <SiteLayout>
      <TopMarquee />
      <HeroSection />
      <AboutSection />
      <SDGGoals />
      <FeaturedEvents />
      <CommunityBanner />
      <ActivitiesSection />
      <ProjectsSection />
      <PartnersAndNewsSection />
      <MapSection />
      <CoreValues />
      <CalendarShopSection />
      <MediaGallery />
      <FounderMessageSection />
      <PresidentMessage />
    </SiteLayout>
  );
}