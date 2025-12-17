import { JoinButton } from '@/components/ui/JoinButton';
import { Radio } from '@/components/ui/Radio';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/simple-select';
import { ChevronRight, Plus } from 'lucide-react';
import { FormData } from '../types';

interface StepProps {
    data: FormData;
    update: (key: keyof FormData, value: FormData[keyof FormData]) => void;
    onNext: () => void;
    onBack: () => void;
}

export const Step6BusinessInfo = ({
    data,
    update,
    onNext,
    onBack,
}: StepProps) => {
    return (
        <div className="mx-auto max-w-3xl">
            <h3 className="mb-8 border-b pb-4 text-2xl font-bold text-gray-900">
                Business Information
            </h3>

            <div className="space-y-8">
                <div>
                    <h4 className="mb-4 text-lg font-semibold text-gray-800">
                        Type of Business Segment
                    </h4>
                    <div className="flex flex-wrap gap-4">
                        {[
                            'Trading',
                            'Manufacturing',
                            'Consultancy',
                            'Service',
                            'Other',
                        ].map((type) => (
                            <Radio
                                key={type}
                                label={type}
                                name="segment"
                                value={type.toLowerCase()}
                                checked={
                                    data.businessSegment === type.toLowerCase()
                                }
                                onChange={() =>
                                    update(
                                        'businessSegment',
                                        type.toLowerCase(),
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Select
                        label="Product/Service Category"
                        required
                        value={data.productCategory}
                        onChange={(e: any) =>
                            update('productCategory', e.target.value)
                        }
                        options={[
                            'IT/Software',
                            'Garments',
                            'Agriculture',
                            'Education',
                            'Healthcare',
                            'Real Estate',
                        ]}
                    />
                    <Input
                        label="Other (if applicable)"
                        placeholder="Specify if other"
                    />
                </div>

                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">
                            Additional Services
                        </h4>
                        <JoinButton
                            variant="ghost"
                            className="h-auto px-2 py-1 text-xs"
                        >
                            <Plus size={14} /> Add Service
                        </JoinButton>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                label="Service Name"
                                placeholder="e.g. Consultation"
                            />
                            <Select
                                label="Target Industry"
                                options={['Retail', 'B2B', 'Government']}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="mb-4 text-lg font-semibold text-gray-800">
                        Export Information
                    </h4>
                    <div className="flex items-center gap-8">
                        <span className="text-sm font-medium text-gray-700">
                            Does your company export?
                        </span>
                        <div className="flex gap-4">
                            <Radio
                                label="Yes"
                                name="export"
                                value="yes"
                                checked={data.exportEnabled === 'yes'}
                                onChange={() => update('exportEnabled', 'yes')}
                            />
                            <Radio
                                label="No"
                                name="export"
                                value="no"
                                checked={data.exportEnabled === 'no'}
                                onChange={() => update('exportEnabled', 'no')}
                            />
                        </div>
                    </div>
                </div>
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
