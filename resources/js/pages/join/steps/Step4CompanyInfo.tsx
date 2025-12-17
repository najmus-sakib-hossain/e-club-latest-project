import { JoinButton } from '@/components/ui/JoinButton';
import { Input } from '@/components/ui/input';
import { Check, ChevronRight, Upload } from 'lucide-react';
import { FormData } from '../types';

interface StepProps {
    data: FormData;
    update: (key: keyof FormData, value: FormData[keyof FormData]) => void;
    onNext: () => void;
    onBack: () => void;
}

export const Step4CompanyInfo = ({
    data,
    update,
    onNext,
    onBack,
}: StepProps) => {
    const colors = [
        'bg-blue-600',
        'bg-purple-600',
        'bg-red-500',
        'bg-green-600',
        'bg-orange-500',
    ];

    return (
        <div className="mx-auto max-w-3xl">
            <h3 className="mb-8 border-b pb-4 text-2xl font-bold text-gray-900">
                Company Information
            </h3>

            <div className="mb-10 grid gap-8 md:grid-cols-3">
                <div className="col-span-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Company Logo <span className="text-red-500">*</span>
                    </label>
                    <div className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:bg-gray-50">
                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-xs text-gray-500">
                            Click to upload or drag & drop
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                            SVG, PNG, JPG (max 250kb)
                        </p>
                    </div>
                </div>

                <div className="col-span-2 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Cover Color Preference
                        </label>
                        <div className="flex gap-4">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => update('coverColor', color)}
                                    className={`h-12 w-12 rounded-lg ${color} relative shadow-sm transition-transform hover:scale-110`}
                                >
                                    {data.coverColor === color && (
                                        <Check className="absolute inset-0 m-auto h-6 w-6 text-white" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700">
                        This color will be used as the background for your
                        company profile page header.
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h4 className="font-semibold text-gray-800">
                    General Information
                </h4>
                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Company Name"
                        required
                        value={data.companyName}
                        onChange={(e) => update('companyName', e.target.value)}
                    />
                    <Input
                        label="Establishment Date"
                        type="date"
                        required
                        value={data.establishmentDate}
                        onChange={(e) =>
                            update('establishmentDate', e.target.value)
                        }
                    />
                </div>

                <h4 className="pt-4 font-semibold text-gray-800">
                    Contact Information
                </h4>
                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Company Email"
                        type="email"
                        required
                        value={data.companyEmail}
                        onChange={(e) => update('companyEmail', e.target.value)}
                    />
                    <Input
                        label="Company Mobile"
                        required
                        value={data.companyContactMobile}
                        onChange={(e) =>
                            update('companyContactMobile', e.target.value)
                        }
                    />
                    <Input
                        label="WhatsApp Number"
                        value={data.companyWhatsapp}
                        onChange={(e) =>
                            update('companyWhatsapp', e.target.value)
                        }
                    />
                    <Input
                        label="Website URL"
                        placeholder="https://"
                        value={data.companyWebsite}
                        onChange={(e) =>
                            update('companyWebsite', e.target.value)
                        }
                    />
                </div>

                <div className="mt-8 flex justify-between border-t pt-6">
                    <JoinButton variant="outline" onClick={onBack}>
                        Back
                    </JoinButton>
                    <JoinButton onClick={onNext}>
                        Next Step <ChevronRight size={18} />
                    </JoinButton>
                </div>
            </div>
        </div>
    );
};
