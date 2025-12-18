import {
    Briefcase,
    Building2,
    Check,
    CreditCard,
    FileText,
    LayoutDashboard,
    ShieldCheck,
    User,
    Users,
    Info,
    Award,
    Heart,
    Lightbulb,
} from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Step1Membership } from './join/steps/Step1Membership';
import { Step2BasicInfo } from './join/steps/Step2BasicInfo';
import { Step3Verification } from './join/steps/Step3Verification';
import { Step4CompanyInfo } from './join/steps/Step4CompanyInfo';
import { Step5PersonalInfo } from './join/steps/Step5PersonalInfo';
import { Step6BusinessInfo } from './join/steps/Step6BusinessInfo';
import { Step7Overview } from './join/steps/Step7Overview';
import { Step8Payment } from './join/steps/Step8Payment';
import { FormData, initialFormData } from './join/types';

// --- Constants ---

const STEPS = [
    { id: 1, title: 'Membership Selection', icon: Users },
    { id: 2, title: 'Basic Information', icon: FileText },
    { id: 3, title: 'Verification', icon: ShieldCheck },
    { id: 4, title: 'Company Information', icon: Building2 },
    { id: 5, title: 'Personal Information', icon: User },
    { id: 6, title: 'Business Information', icon: Briefcase },
    { id: 7, title: 'Overview', icon: LayoutDashboard },
    { id: 8, title: 'Payment & Confirmation', icon: CreditCard },
];

export default function Join() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isAnimating, setIsAnimating] = useState(false);

    const updateForm = (
        key: keyof FormData,
        value: FormData[keyof FormData],
    ) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleNext = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentStep((prev) => Math.min(prev + 1, 8));
            setIsAnimating(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    };

    const handleBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentStep((prev) => Math.max(prev - 1, 1));
            setIsAnimating(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    };

    const goToStep = (step: number) => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentStep(step);
            setIsAnimating(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 font-sans md:flex-row">
            {/* --- New Sidebar Navigation (Fixed position on desktop) --- */}
            <aside className="z-20 flex w-full flex-shrink-0 flex-col overflow-y-auto bg-[#0B4632] text-white md:sticky md:top-0 md:h-screen md:w-[320px]">
                {/* Logo Section */}
                <div className="p-8 pb-4">
                    <div className="mb-8 flex items-center gap-3 text-2xl font-bold tracking-tight">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-yellow-400">
                            <Building2 className="h-6 w-6 text-yellow-400" />
                        </div>
                        <span className="text-white">
                            E<span className="text-yellow-400">CLUB</span>
                        </span>
                    </div>
                </div>

                {/* Navigation List */}
                <div className="relative flex-1 px-4">
                    {/* Continuous vertical line background */}
                    <div className="absolute top-4 bottom-10 left-[39px] z-0 hidden w-[1px] bg-white/20 md:block"></div>

                    <div className="space-y-4">
                        {STEPS.map((step) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div
                                    key={step.id}
                                    className={`relative z-10 flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-all duration-300 ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                    onClick={() => goToStep(step.id)}
                                >
                                    {/* Circle Indicator */}
                                    <div
                                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-all duration-300 ${
                                            isActive
                                                ? 'border-yellow-400 bg-yellow-400 text-[#0B4632]'
                                                : isCompleted
                                                  ? 'border-yellow-400 bg-transparent text-yellow-400'
                                                  : 'border-white/40 bg-[#0B4632] text-white/60'
                                        } `}
                                    >
                                        {isCompleted ? (
                                            <Check size={14} strokeWidth={3} />
                                        ) : (
                                            step.id
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex flex-col">
                                        <span
                                            className={`text-sm font-medium transition-colors ${isActive ? 'font-bold text-white' : isCompleted ? 'text-white/90' : 'text-white/60'}`}
                                        >
                                            {step.title}
                                        </span>
                                        {isActive && (
                                            <span className="mt-0.5 text-[10px] font-bold tracking-widest text-yellow-400 uppercase">
                                                In Progress
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer decoration or copyright could go here */}
                <div className="p-4 text-center text-xs text-white/20">
                    © 2024 ECLUB
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <main className="relative flex-1 overflow-hidden bg-white">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -z-0 h-64 w-64 rounded-bl-full bg-green-50 opacity-50"></div>

                <div className="relative z-10 mx-auto w-full max-w-5xl p-6 md:p-12 lg:p-16">
                    {/* New Top Right Header Layout with E-Club Tour */}
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <h2 className="flex items-center gap-3 text-2xl font-bold text-[#105D42]">
                                Member Registration
                                <span className="rounded bg-green-100 px-2 py-1 text-[10px] font-bold tracking-wider text-[#105D42] uppercase">
                                    Beta
                                </span>
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Join the largest community of entrepreneurs
                            </p>
                        </div>
                    </div>

                    {/* E-Club Tour - Informational Tabs */}
                    <Tabs defaultValue="overview" className="mb-8 w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-green-50">
                            <TabsTrigger value="overview" className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                <span className="hidden sm:inline">Overview</span>
                            </TabsTrigger>
                            <TabsTrigger value="benefits" className="flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                <span className="hidden sm:inline">Benefits</span>
                            </TabsTrigger>
                            <TabsTrigger value="process" className="flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" />
                                <span className="hidden sm:inline">Process</span>
                            </TabsTrigger>
                            <TabsTrigger value="support" className="flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                <span className="hidden sm:inline">Support</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-[#105D42]">Welcome to E-Club</CardTitle>
                                    <CardDescription>
                                        Your gateway to Bangladesh's premier entrepreneurial community
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-gray-600">
                                        E-Club is a dynamic platform connecting entrepreneurs, business leaders, and innovators
                                        across Bangladesh. As a member, you'll gain access to exclusive networking opportunities,
                                        business development resources, and a supportive community dedicated to entrepreneurial success.
                                    </p>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                                            <h4 className="mb-2 font-semibold text-[#105D42]">5,000+ Members</h4>
                                            <p className="text-xs text-gray-600">Active entrepreneurs and business leaders</p>
                                        </div>
                                        <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                                            <h4 className="mb-2 font-semibold text-[#105D42]">200+ Events</h4>
                                            <p className="text-xs text-gray-600">Annual networking and learning opportunities</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="benefits" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-[#105D42]">Membership Benefits</CardTitle>
                                    <CardDescription>
                                        Everything you get as an E-Club member
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Networking Events</p>
                                                <p className="text-sm text-gray-600">Access to exclusive networking sessions, meet-ups, and business forums</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Business Development</p>
                                                <p className="text-sm text-gray-600">Workshops, training programs, and mentorship opportunities</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Resource Library</p>
                                                <p className="text-sm text-gray-600">Access to industry reports, guides, and business tools</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Recognition & Awards</p>
                                                <p className="text-sm text-gray-600">Opportunities to showcase achievements and gain industry recognition</p>
                                            </div>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="process" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-[#105D42]">Registration Process</CardTitle>
                                    <CardDescription>
                                        Simple steps to become a member
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {STEPS.map((step, index) => (
                                            <div key={step.id} className="flex items-start gap-4">
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-[#105D42]">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{step.title}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {index === 0 && "Choose your membership tier based on your business needs"}
                                                        {index === 1 && "Provide your contact information and business details"}
                                                        {index === 2 && "Verify your email and phone number"}
                                                        {index === 3 && "Share your company information and registration details"}
                                                        {index === 4 && "Complete your personal profile information"}
                                                        {index === 5 && "Tell us about your business and industry"}
                                                        {index === 6 && "Review all information before submission"}
                                                        {index === 7 && "Complete payment and confirm your membership"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="support" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-[#105D42]">Need Help?</CardTitle>
                                    <CardDescription>
                                        We're here to support you throughout the process
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                                        <h4 className="mb-2 font-semibold text-blue-900">Contact Support</h4>
                                        <p className="mb-2 text-sm text-blue-800">Email: support@eclub.org.bd</p>
                                        <p className="text-sm text-blue-800">Phone: +880 1XXX-XXXXXX</p>
                                    </div>
                                    <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                                        <h4 className="mb-2 font-semibold text-green-900">Office Hours</h4>
                                        <p className="text-sm text-green-800">Saturday - Thursday: 9:00 AM - 6:00 PM</p>
                                        <p className="text-sm text-green-800">Friday: Closed</p>
                                    </div>
                                    <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                                        <h4 className="mb-2 font-semibold text-purple-900">FAQs</h4>
                                        <p className="text-sm text-purple-800">
                                            Visit our FAQ section for answers to common questions about membership,
                                            benefits, and the registration process.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* --- Content Transition Wrapper --- */}
                    <div
                        className={`transition-all duration-500 ease-in-out ${isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}
                    >
                        {currentStep === 1 && (
                            <Step1Membership
                                data={formData}
                                update={updateForm}
                                onNext={handleNext}
                            />
                        )}
                        {/* Keeping other steps in a clean card container like style if needed, but per screenshot Step 1 is quite open */}
                        {currentStep !== 1 && (
                            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                                {currentStep === 2 && (
                                    <Step2BasicInfo
                                        data={formData}
                                        update={updateForm}
                                        onNext={handleNext}
                                    />
                                )}
                                {currentStep === 3 && (
                                    <Step3Verification
                                        data={formData}
                                        update={updateForm}
                                        onNext={handleNext}
                                    />
                                )}
                                {currentStep === 4 && (
                                    <Step4CompanyInfo
                                        data={formData}
                                        update={updateForm}
                                        onNext={handleNext}
                                        onBack={handleBack}
                                    />
                                )}
                                {currentStep === 5 && (
                                    <Step5PersonalInfo
                                        data={formData}
                                        update={updateForm}
                                        onNext={handleNext}
                                        onBack={handleBack}
                                    />
                                )}
                                {currentStep === 6 && (
                                    <Step6BusinessInfo
                                        data={formData}
                                        update={updateForm}
                                        onNext={handleNext}
                                        onBack={handleBack}
                                    />
                                )}
                                {currentStep === 7 && (
                                    <Step7Overview
                                        data={formData}
                                        onNext={handleNext}
                                        onBack={handleBack}
                                        onEdit={(step: number) =>
                                            goToStep(step)
                                        }
                                    />
                                )}
                                {currentStep === 8 && (
                                    <Step8Payment
                                        data={formData}
                                        update={updateForm}
                                        onBack={handleBack}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
