import { JoinButton } from '@/components/ui/JoinButton';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/simple-checkbox';
import { Building2, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FormData } from '../types';

interface StepProps {
    data: FormData;
    update: (key: keyof FormData, value: FormData[keyof FormData]) => void;
    onNext: () => void;
}

export const Step2BasicInfo = ({ data, update, onNext }: StepProps) => {
    const [showPass, setShowPass] = useState(false);

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                    Basic Information
                </h3>
                <p className="text-gray-500">
                    Please fill in your basic account details
                </p>
            </div>

            <div className="space-y-6">
                <Input
                    label="Company Name"
                    required
                    placeholder="e.g. Tech Solutions Ltd."
                    icon={Building2}
                    value={data.companyName}
                    onChange={(e) => update('companyName', e.target.value)}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Representative Email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={data.repEmail}
                        onChange={(e) => update('repEmail', e.target.value)}
                    />
                    <Input
                        label="Representative Mobile"
                        type="tel"
                        required
                        placeholder="+880 1XXX XXXXXX"
                        value={data.repMobile}
                        onChange={(e) => update('repMobile', e.target.value)}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPass ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => update('password', e.target.value)}
                        />
                        <button
                            onClick={() => setShowPass(!showPass)}
                            className="absolute top-[34px] right-3 text-gray-400 hover:text-gray-600"
                        >
                            {showPass ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                    <Input
                        label="Confirm Password"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={data.confirmPassword}
                        onChange={(e) =>
                            update('confirmPassword', e.target.value)
                        }
                    />
                </div>

                <div className="pt-2">
                    <Checkbox
                        label={
                            <span>
                                I agree with the{' '}
                                <a
                                    href="#"
                                    className="text-[#105D42] hover:underline"
                                >
                                    Terms & Conditions
                                </a>
                            </span>
                        }
                        checked={data.termsAgreed}
                        onChange={(e) =>
                            update('termsAgreed', e.target.checked)
                        }
                    />
                </div>

                <div className="flex justify-end pt-6">
                    <JoinButton
                        onClick={onNext}
                        disabled={!data.termsAgreed}
                        className="w-full md:w-auto"
                    >
                        Next Step <ChevronRight size={18} />
                    </JoinButton>
                </div>
            </div>
        </div>
    );
};
