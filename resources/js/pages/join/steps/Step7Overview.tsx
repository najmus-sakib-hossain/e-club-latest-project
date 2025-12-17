import { JoinButton } from '@/components/ui/JoinButton';
import { Building2, ChevronRight, Edit3 } from 'lucide-react';
import { FormData } from '../types';

interface StepProps {
    data: FormData;
    onNext: () => void;
    onBack: () => void;
    onEdit: (step: number) => void;
}

const SectionHeader = ({
    title,
    step,
    onEdit,
}: {
    title: string;
    step: number;
    onEdit: (step: number) => void;
}) => (
    <div className="mt-8 mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
        <h4 className="text-lg font-bold text-[#105D42]">{title}</h4>
        <button
            onClick={() => onEdit(step)}
            className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:text-[#105D42]"
        >
            <Edit3 size={12} /> Edit
        </button>
    </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="grid grid-cols-3 border-b border-gray-50 py-2 last:border-0">
        <span className="col-span-1 text-sm font-medium text-gray-500">
            {label}
        </span>
        <span className="col-span-2 text-sm font-semibold text-gray-900">
            {value || '-'}
        </span>
    </div>
);

export const Step7Overview = ({ data, onNext, onBack, onEdit }: StepProps) => {
    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                    Application Overview
                </h3>
                <p className="text-gray-500">
                    Please review your information before payment
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-inner">
                {/* Basic Info */}
                <SectionHeader
                    title="Basic Information"
                    step={2}
                    onEdit={onEdit}
                />
                <div className="space-y-1">
                    <InfoRow label="Company Name" value={data.companyName} />
                    <InfoRow label="Rep. Email" value={data.repEmail} />
                    <InfoRow label="Rep. Mobile" value={data.repMobile} />
                </div>

                {/* Company Info */}
                <SectionHeader
                    title="Company Information"
                    step={4}
                    onEdit={onEdit}
                />
                <div className="mb-4 flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg border bg-white shadow-sm">
                        <Building2 className="text-gray-300" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">
                            {data.companyName || 'Company Name'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {data.companyWebsite}
                        </p>
                    </div>
                </div>
                <div className="space-y-1">
                    <InfoRow
                        label="Establishment"
                        value={data.establishmentDate}
                    />
                    <InfoRow label="Email" value={data.companyEmail} />
                    <InfoRow
                        label="Contact"
                        value={data.companyContactMobile}
                    />
                </div>

                {/* Personal Info */}
                <SectionHeader
                    title="Representative"
                    step={5}
                    onEdit={onEdit}
                />
                <div className="space-y-1">
                    <InfoRow label="Name" value={data.repName} />
                    <InfoRow label="Designation" value={data.repDesignation} />
                    <InfoRow label="Gender" value={data.repGender} />
                </div>

                {/* Membership */}
                <SectionHeader title="Membership" step={1} onEdit={onEdit} />
                <div className="flex items-center justify-between rounded-xl bg-[#105D42] p-4 text-white shadow-lg shadow-green-900/10">
                    <div>
                        <p className="text-xs font-medium tracking-wider uppercase opacity-80">
                            Selected Plan
                        </p>
                        <p className="text-xl font-bold">
                            {data.membershipType || 'General Member'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">৳ 10,000</p>
                        <p className="text-xs opacity-80">/ Year</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-10">
                <JoinButton variant="outline" onClick={onBack}>
                    Back
                </JoinButton>
                <JoinButton onClick={onNext}>
                    Proceed to Payment <ChevronRight size={18} />
                </JoinButton>
            </div>
        </div>
    );
};
