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
} from 'lucide-react';
import { useState } from 'react';
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
                    {/* New Top Right Header Layout */}
                    <div className="mb-16 flex justify-end">
                        <div className="text-right">
                            <h2 className="flex items-center justify-end gap-3 text-2xl font-bold text-[#105D42]">
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
