import { JoinButton } from '@/components/ui/JoinButton';
import { ShieldCheck } from 'lucide-react';
import { FormData } from '../types';

interface StepProps {
    data: FormData;
    update: (key: keyof FormData, value: FormData[keyof FormData]) => void;
    onNext: () => void;
}

export const Step3Verification = ({ data, update, onNext }: StepProps) => {
    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...data.otp];
        newOtp[index] = value;
        update('otp', newOtp);

        // Auto focus next
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    return (
        <div className="mx-auto max-w-xl py-8 text-center">
            <div className="mb-8 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-[#105D42]">
                    <ShieldCheck size={32} />
                </div>
            </div>

            <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Verification
            </h3>
            <p className="mb-8 text-gray-500">
                We have sent a 6-digit verification code to your mobile number{' '}
                <br />
                <span className="font-semibold text-gray-800">
                    {data.repMobile || '+880 1XXX XXXXXX'}
                </span>
            </p>

            <div className="mb-8 flex justify-center gap-3">
                {data.otp.map((digit: string, idx: number) => (
                    <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        className="h-14 w-12 rounded-lg border-2 border-gray-200 text-center text-2xl font-bold transition-all outline-none focus:border-[#105D42] focus:ring-4 focus:ring-green-50"
                    />
                ))}
            </div>

            <div className="space-y-4">
                <JoinButton onClick={onNext} className="w-full py-3">
                    Verify & Proceed
                </JoinButton>
                <button
                    onClick={onNext}
                    className="text-sm text-gray-500 underline decoration-dotted transition-colors hover:text-[#105D42]"
                >
                    Verify & Skip to Payment (Dev Mode)
                </button>
            </div>
        </div>
    );
};
