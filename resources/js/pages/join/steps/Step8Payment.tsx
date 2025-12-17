import { JoinButton } from '@/components/ui/JoinButton';
import { Input } from '@/components/ui/input';
import {
    Banknote,
    Calendar,
    CheckCircle2,
    CreditCard,
    Landmark,
    LucideIcon,
    ShieldCheck,
    User,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { FormData } from '../types';

interface StepProps {
    data: FormData;
    update: (key: keyof FormData, value: FormData[keyof FormData]) => void;
    onBack: () => void;
}

const PaymentTab = ({
    id,
    label,
    icon: Icon,
    activeTab,
    setActiveTab,
}: {
    id: string;
    label: string;
    icon: LucideIcon;
    activeTab: string;
    setActiveTab: (id: string) => void;
}) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-2 py-3 text-sm font-medium transition-all ${activeTab === id ? 'border-[#105D42] bg-[#105D42] text-white shadow-md' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
    >
        <Icon size={16} /> <span className="hidden sm:inline">{label}</span>
    </button>
);

export const Step8Payment = ({ data, onBack }: StepProps) => {
    const [activeTab, setActiveTab] = useState('card');
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePay = () => {
        setShowSuccess(true);
    };

    if (showSuccess) {
        return (
            <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 size={48} className="text-[#105D42]" />
                </div>
                <h3 className="mb-2 text-3xl font-bold text-gray-900">
                    Registration Successful!
                </h3>
                <p className="mx-auto mb-8 max-w-md text-gray-500">
                    Thank you for joining ECLUB. Your application has been
                    submitted and is pending approval. You will receive an email
                    shortly.
                </p>
                <JoinButton onClick={() => window.location.reload()}>
                    Return to Home
                </JoinButton>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl">
            <h3 className="mb-2 text-2xl font-bold text-gray-900">Payment</h3>
            <p className="mb-8 text-gray-500">
                Choose your preferred payment method
            </p>

            <div className="mb-8 flex items-center justify-between rounded-xl border border-green-100 bg-green-50 p-6">
                <div>
                    <p className="text-sm font-medium text-green-800">
                        Payable Amount
                    </p>
                    <h2 className="text-3xl font-bold text-[#105D42]">
                        ৳ 10,000
                        <span className="ml-1 text-sm font-normal text-gray-500">
                            BDT
                        </span>
                    </h2>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">
                        {data.membershipType}
                    </p>
                    <p className="text-xs text-gray-500">Includes VAT & Tax</p>
                </div>
            </div>

            <div className="mb-8 flex gap-3">
                <PaymentTab
                    id="card"
                    label="Card"
                    icon={CreditCard}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <PaymentTab
                    id="bank"
                    label="Bank"
                    icon={Landmark}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <PaymentTab
                    id="mfs"
                    label="MFS"
                    icon={Banknote}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <PaymentTab
                    id="cash"
                    label="In Person"
                    icon={Users}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {activeTab === 'card' && (
                    <div className="animate-fadeIn space-y-6">
                        <Input
                            label="Cardholder Name"
                            placeholder="Name as on card"
                            icon={User}
                        />
                        <Input
                            label="Card Number"
                            placeholder="XXXX XXXX XXXX XXXX"
                            icon={CreditCard}
                        />
                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                label="Expiry Date"
                                placeholder="MM/YY"
                                icon={Calendar}
                            />
                            <Input
                                label="CVV"
                                placeholder="123"
                                icon={ShieldCheck}
                            />
                        </div>
                    </div>
                )}
                {activeTab === 'bank' && (
                    <div className="space-y-4 py-10 text-center">
                        <Landmark className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="text-gray-500">
                            Bank transfer instructions will be sent to your
                            email.
                        </p>
                    </div>
                )}
                {activeTab === 'mfs' && (
                    <div className="space-y-4 py-10 text-center">
                        <div className="flex justify-center gap-4 opacity-70 grayscale">
                            <div className="h-12 w-12 rounded-lg bg-pink-600"></div>
                            <div className="h-12 w-12 rounded-lg bg-orange-500"></div>
                        </div>
                        <p className="text-gray-500">
                            Select your mobile wallet provider in the next step.
                        </p>
                    </div>
                )}
                {activeTab === 'cash' && (
                    <div className="space-y-4 py-10 text-center">
                        <Users className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="text-gray-500">
                            Please visit our office to complete the payment in
                            person.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-10">
                <JoinButton variant="outline" onClick={onBack}>
                    Back
                </JoinButton>
                <div className="flex gap-3">
                    <JoinButton variant="ghost">Save Draft</JoinButton>
                    <JoinButton onClick={handlePay}>Confirm & Pay</JoinButton>
                </div>
            </div>
        </div>
    );
};
