import { JoinButton } from '@/components/ui/JoinButton';
import { Radio } from '@/components/ui/Radio';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/simple-checkbox';
import { ChevronRight, Upload, User } from 'lucide-react';
import { FormData } from '../types';

interface StepProps {
    data: FormData;
    update: (key: keyof FormData, value: FormData[keyof FormData]) => void;
    onNext: () => void;
    onBack: () => void;
}

export const Step5PersonalInfo = ({
    data,
    update,
    onNext,
    onBack,
}: StepProps) => {
    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-end justify-between border-b pb-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        Representative Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Authorized person for E-Club operations
                    </p>
                </div>
                <Checkbox
                    label="Same as organization head"
                    checked={data.sameAsHead}
                    onChange={(e: any) =>
                        update('sameAsHead', e.target.checked)
                    }
                />
            </div>

            <div className="mb-8 flex flex-col items-start gap-8 md:flex-row">
                <div className="group relative flex h-32 w-32 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                    <User size={48} className="text-gray-300" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Upload size={24} className="text-white" />
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    <h4 className="font-medium">Profile Photo</h4>
                    <p className="max-w-xs text-xs text-gray-500">
                        Upload a professional passport size photo. Max file size
                        250kb. Dimensions 300x350px.
                    </p>
                    <div className="mt-2 flex gap-3">
                        <JoinButton
                            variant="outline"
                            className="h-auto px-3 py-2 text-xs"
                        >
                            Choose File
                        </JoinButton>
                    </div>
                </div>
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
                <Input
                    label="Full Name"
                    required
                    value={data.repName}
                    onChange={(e: any) => update('repName', e.target.value)}
                />
                <Input
                    label="Designation"
                    required
                    value={data.repDesignation}
                    onChange={(e: any) =>
                        update('repDesignation', e.target.value)
                    }
                />
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                        <Radio
                            label="Male"
                            name="gender"
                            value="male"
                            checked={data.repGender === 'male'}
                            onChange={() => update('repGender', 'male')}
                        />
                        <Radio
                            label="Female"
                            name="gender"
                            value="female"
                            checked={data.repGender === 'female'}
                            onChange={() => update('repGender', 'female')}
                        />
                        <Radio
                            label="Other"
                            name="gender"
                            value="other"
                            checked={data.repGender === 'other'}
                            onChange={() => update('repGender', 'other')}
                        />
                    </div>
                </div>
                <Input
                    label="Date of Birth"
                    type="date"
                    required
                    value={data.repDob}
                    onChange={(e: any) => update('repDob', e.target.value)}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Input
                    label="Personal Email"
                    type="email"
                    value={data.repPersonalEmail}
                    onChange={(e: any) =>
                        update('repPersonalEmail', e.target.value)
                    }
                />
                <Input
                    label="Personal Website"
                    value={data.repPersonalWebsite}
                    onChange={(e: any) =>
                        update('repPersonalWebsite', e.target.value)
                    }
                />
            </div>

            <div className="flex justify-between pt-10">
                <JoinButton variant="outline" onClick={onBack}>
                    Back
                </JoinButton>
                <JoinButton onClick={onNext}>
                    Next Step <ChevronRight size={18} />
                </JoinButton>
            </div>
        </div>
    );
};
