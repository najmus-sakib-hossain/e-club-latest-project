import { JoinButton } from '@/components/ui/JoinButton';
import { Select } from '@/components/ui/simple-select';
import { ArrowRight, Users } from 'lucide-react';
import { FormData } from '../types';

interface StepProps {
    data: FormData;
    update: (key: keyof FormData, value: FormData[keyof FormData]) => void;
    onNext: () => void;
}

export const Step1Membership = ({ data, update, onNext }: StepProps) => {
    return (
        <div className="mx-auto flex h-full max-w-2xl flex-col text-center">
            <h3 className="mb-3 text-3xl font-bold text-[#0B4632]">
                Want to be a member of ECLUB?
            </h3>
            <p className="mb-10 text-gray-400">
                Select a membership plan that suits your business needs
            </p>

            {/* Dropdown Section */}
            <div className="mb-12 text-left">
                <label className="mb-2 block pl-1 text-sm font-semibold text-gray-700">
                    Select a Membership Type{' '}
                    <span className="text-red-500">*</span>
                </label>
                <div className="rounded-xl border border-gray-100 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <Select
                        value={data.membershipType}
                        onChange={(e) =>
                            update('membershipType', e.target.value)
                        }
                        options={[
                            'General Member',
                            'Associate Member',
                            'Corporate Member',
                            'Life Member',
                        ]}
                        className="border-none py-4 text-lg focus:ring-0"
                    />
                </div>
            </div>

            {/* Illustration Section - Custom Built with Tailwind */}
            <div className="relative mb-10 flex h-80 w-full items-center justify-center overflow-hidden rounded-3xl border border-green-100/50 bg-[#F0FDF4]">
                {/* Dotted Pattern Background */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'radial-gradient(#105D42 1.5px, transparent 1.5px)',
                        backgroundSize: '24px 24px',
                        opacity: 0.1,
                    }}
                ></div>

                <div className="relative top-4 z-10 flex flex-col items-center">
                    {/* People Icon */}
                    <Users
                        strokeWidth={1.5}
                        className="mb-6 h-28 w-28 text-[#0B4632]"
                    />

                    {/* Cards Cluster */}
                    <div className="relative flex h-24 w-full items-end justify-center">
                        {/* White Card (Left) */}
                        <div className="z-0 h-20 w-16 translate-x-4 translate-y-2 -rotate-[15deg] transform rounded-lg border border-gray-100 bg-white shadow-lg"></div>

                        {/* Green Card (Middle) */}
                        <div className="z-20 h-20 w-16 -translate-y-1 rotate-0 transform rounded-lg bg-[#0B4632] shadow-xl"></div>

                        {/* Yellow Card (Right) */}
                        <div className="z-10 h-20 w-16 -translate-x-4 translate-y-2 rotate-[15deg] transform rounded-lg bg-yellow-400 shadow-lg"></div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <JoinButton
                    onClick={onNext}
                    className="w-full py-4 text-lg shadow-xl shadow-[#105D42]/20 md:w-1/2"
                >
                    Next Step <ArrowRight size={20} className="ml-2" />
                </JoinButton>
            </div>

            <p className="mt-8 text-sm text-gray-500">
                Already have an account?{' '}
                <a
                    href="#"
                    className="font-bold text-[#105D42] hover:underline"
                >
                    Login
                </a>
            </p>
        </div>
    );
};
