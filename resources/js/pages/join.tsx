import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronDown,
  Upload, 
  Calendar, 
  Eye, 
  EyeOff, 
  CreditCard, 
  Landmark, 
  Banknote, 
  User, 
  Building2, 
  FileText, 
  LayoutDashboard, 
  ShieldCheck,
  Briefcase,
  Users,
  CheckCircle2,
  Edit3,
  Plus,
  ArrowRight
} from 'lucide-react';

// --- Types & Interfaces ---

type FormData = {
  membershipType: string;
  companyName: string;
  repEmail: string;
  repMobile: string;
  password: string;
  confirmPassword: string;
  termsAgreed: boolean;
  otp: string[];
  companyLogo: File | null;
  coverColor: string;
  establishmentDate: string;
  companyEmail: string;
  companyContactMobile: string;
  companyWhatsapp: string;
  companyWebsite: string;
  sameAsHead: boolean;
  repName: string;
  repDesignation: string;
  repGender: string;
  repDob: string;
  repPersonalEmail: string;
  repPersonalMobile: string;
  repMaritalStatus: string;
  businessSegment: string;
  productCategory: string;
  exportEnabled: string; // "yes" | "no"
  paymentMethod: string; // "card" | "bank" | "mfs" | "cash"
};

const initialFormData: FormData = {
  membershipType: '',
  companyName: '',
  repEmail: '',
  repMobile: '',
  password: '',
  confirmPassword: '',
  termsAgreed: false,
  otp: ['', '', '', '', '', ''],
  companyLogo: null,
  coverColor: 'blue',
  establishmentDate: '',
  companyEmail: '',
  companyContactMobile: '',
  companyWhatsapp: '',
  companyWebsite: '',
  sameAsHead: false,
  repName: '',
  repDesignation: '',
  repGender: 'male',
  repDob: '',
  repPersonalEmail: '',
  repPersonalMobile: '',
  repMaritalStatus: '',
  businessSegment: 'trading',
  productCategory: '',
  exportEnabled: 'no',
  paymentMethod: 'card'
};

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

// --- Reusable UI Components (Shadcn-like) ---

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#105D42] hover:bg-[#0d4a35] text-white shadow-md hover:shadow-lg",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-[#105D42] hover:bg-green-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
  };
  return (
    <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ label, icon: Icon, error, ...props }: any) => (
  <div className="w-full space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-700 flex items-center gap-1">{label} {props.required && <span className="text-red-500">*</span>}</label>}
    <div className="relative group">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#105D42] transition-colors" />}
      <input 
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#105D42] focus:ring-2 focus:ring-[#105D42]/20 outline-none transition-all placeholder:text-gray-400 bg-white`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div className="w-full space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-700">{label} {props.required && <span className="text-red-500">*</span>}</label>}
    <div className="relative">
      <select 
        className="w-full pl-3 pr-10 py-3 rounded-lg border border-gray-200 focus:border-[#105D42] focus:ring-2 focus:ring-[#105D42]/20 outline-none appearance-none bg-white transition-all cursor-pointer text-gray-700"
        {...props}
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const Checkbox = ({ label, ...props }: any) => (
  <label className="flex items-center gap-3 cursor-pointer group select-none">
    <div className="relative flex items-center justify-center">
      <input type="checkbox" className="peer sr-only" {...props} />
      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#105D42] peer-checked:border-[#105D42] transition-all bg-white"></div>
      <Check className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
    </div>
    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
  </label>
);

const Radio = ({ label, name, value, checked, onChange }: any) => (
  <label className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all ${checked ? 'border-[#105D42] bg-green-50 text-[#105D42]' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
    <div className="relative flex items-center justify-center">
      <input 
        type="radio" 
        name={name} 
        value={value} 
        checked={checked} 
        onChange={onChange}
        className="sr-only" 
      />
      <div className={`w-4 h-4 rounded-full border ${checked ? 'border-[#105D42]' : 'border-gray-300'} flex items-center justify-center`}>
        {checked && <div className="w-2 h-2 rounded-full bg-[#105D42]" />}
      </div>
    </div>
    <span className="text-sm font-medium">{label}</span>
  </label>
);

// --- Main Application Component ---

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateForm = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, 8));
      setIsAnimating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.max(prev - 1, 1));
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
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
      {/* --- New Sidebar Navigation (Fixed position on desktop) --- */}
      <aside className="w-full md:w-[320px] bg-[#0B4632] text-white flex-shrink-0 md:h-screen md:sticky md:top-0 overflow-y-auto z-20 flex flex-col">
        {/* Logo Section */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 text-2xl font-bold tracking-tight mb-8">
             <div className="w-10 h-10 border-2 border-yellow-400 rounded-lg flex items-center justify-center">
                 <Building2 className="text-yellow-400 w-6 h-6" />
             </div>
             <span className="text-white">E<span className="text-yellow-400">CLUB</span></span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-4 relative">
          {/* Continuous vertical line background */}
          <div className="absolute left-[39px] top-4 bottom-10 w-[1px] bg-white/20 z-0 hidden md:block"></div>

          <div className="space-y-4">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div 
                  key={step.id}
                  className={`relative flex items-center gap-4 p-3 rounded-lg transition-all duration-300 cursor-pointer z-10 ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  onClick={() => goToStep(step.id)}
                >
                  {/* Circle Indicator */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-all duration-300 flex-shrink-0
                    ${isActive ? 'bg-yellow-400 border-yellow-400 text-[#0B4632]' : 
                      isCompleted ? 'bg-transparent border-yellow-400 text-yellow-400' : 'bg-[#0B4632] border-white/40 text-white/60'}
                  `}>
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium transition-colors ${isActive ? 'text-white font-bold' : isCompleted ? 'text-white/90' : 'text-white/60'}`}>
                      {step.title}
                    </span>
                    {isActive && <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mt-0.5">In Progress</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Footer decoration or copyright could go here */}
        <div className="p-4 text-xs text-white/20 text-center">
          © 2024 ECLUB
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-bl-full -z-0 opacity-50"></div>

        <div className="p-6 md:p-12 lg:p-16 max-w-5xl mx-auto w-full relative z-10">
          
          {/* New Top Right Header Layout */}
          <div className="flex justify-end mb-16">
            <div className="text-right">
              <h2 className="text-2xl font-bold text-[#105D42] flex items-center justify-end gap-3">
                Member Registration 
                <span className="px-2 py-1 bg-green-100 text-[#105D42] text-[10px] rounded font-bold uppercase tracking-wider">Beta</span>
              </h2>
              <p className="text-sm text-gray-400 mt-1">Join the largest community of entrepreneurs</p>
            </div>
          </div>

          {/* --- Content Transition Wrapper --- */}
          <div className={`transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {currentStep === 1 && (
              <Step1Membership 
                data={formData} 
                update={updateForm} 
                onNext={handleNext} 
              />
            )}
            {/* Keeping other steps in a clean card container like style if needed, but per screenshot Step 1 is quite open */}
            {currentStep !== 1 && (
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  {currentStep === 2 && <Step2BasicInfo data={formData} update={updateForm} onNext={handleNext} />}
                  {currentStep === 3 && <Step3Verification data={formData} update={updateForm} onNext={handleNext} />}
                  {currentStep === 4 && <Step4CompanyInfo data={formData} update={updateForm} onNext={handleNext} onBack={handleBack} />}
                  {currentStep === 5 && <Step5PersonalInfo data={formData} update={updateForm} onNext={handleNext} onBack={handleBack} />}
                  {currentStep === 6 && <Step6BusinessInfo data={formData} update={updateForm} onNext={handleNext} onBack={handleBack} />}
                  {currentStep === 7 && <Step7Overview data={formData} onNext={handleNext} onBack={handleBack} onEdit={(step: number) => goToStep(step)} />}
                  {currentStep === 8 && <Step8Payment data={formData} update={updateForm} onBack={handleBack} />}
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Step Components ---

const Step1Membership = ({ data, update, onNext }: any) => {
  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto text-center">
      <h3 className="text-3xl font-bold text-[#0B4632] mb-3">Want to be a member of ECLUB?</h3>
      <p className="text-gray-400 mb-10">Select a membership plan that suits your business needs</p>
      
      {/* Dropdown Section */}
      <div className="mb-12 text-left">
        <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">Select a Membership Type <span className="text-red-500">*</span></label>
        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
           <Select 
            value={data.membershipType}
            onChange={(e: any) => update('membershipType', e.target.value)}
            options={["General Member", "Associate Member", "Corporate Member", "Life Member"]}
            className="border-none focus:ring-0 text-lg py-4"
          />
        </div>
      </div>

      {/* Illustration Section - Custom Built with Tailwind */}
      <div className="relative w-full h-80 bg-[#F0FDF4] rounded-3xl border border-green-100/50 mb-10 overflow-hidden flex items-center justify-center">
         {/* Dotted Pattern Background */}
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#105D42 1.5px, transparent 1.5px)', backgroundSize: '24px 24px', opacity: 0.1 }}></div>
         
         <div className="relative z-10 flex flex-col items-center top-4">
            {/* People Icon */}
            <Users strokeWidth={1.5} className="w-28 h-28 text-[#0B4632] mb-6" />
            
            {/* Cards Cluster */}
            <div className="relative w-full h-24 flex justify-center items-end">
               {/* White Card (Left) */}
               <div className="w-16 h-20 bg-white rounded-lg shadow-lg border border-gray-100 transform -rotate-[15deg] translate-x-4 translate-y-2 z-0"></div>
               
               {/* Green Card (Middle) */}
               <div className="w-16 h-20 bg-[#0B4632] rounded-lg shadow-xl transform rotate-0 -translate-y-1 z-20"></div>
               
               {/* Yellow Card (Right) */}
               <div className="w-16 h-20 bg-yellow-400 rounded-lg shadow-lg transform rotate-[15deg] -translate-x-4 translate-y-2 z-10"></div>
            </div>
         </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={onNext} className="w-full md:w-1/2 py-4 text-lg shadow-xl shadow-[#105D42]/20">
          Next Step <ArrowRight size={20} className="ml-2" />
        </Button>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Already have an account? <a href="#" className="text-[#105D42] font-bold hover:underline">Login</a>
      </p>
    </div>
  );
};

const Step2BasicInfo = ({ data, update, onNext }: any) => {
  const [showPass, setShowPass] = useState(false);
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-gray-900">Basic Information</h3>
        <p className="text-gray-500">Please fill in your basic account details</p>
      </div>

      <div className="space-y-6">
        <Input 
          label="Company Name" 
          required 
          placeholder="e.g. Tech Solutions Ltd."
          icon={Building2}
          value={data.companyName}
          onChange={(e: any) => update('companyName', e.target.value)}
        />
        
        <div className="grid md:grid-cols-2 gap-6">
          <Input 
            label="Representative Email" 
            type="email" 
            required 
            placeholder="john@example.com"
            value={data.repEmail}
            onChange={(e: any) => update('repEmail', e.target.value)}
          />
          <Input 
            label="Representative Mobile" 
            type="tel" 
            required 
            placeholder="+880 1XXX XXXXXX"
            value={data.repMobile}
            onChange={(e: any) => update('repMobile', e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <Input 
              label="Password" 
              type={showPass ? "text" : "password"} 
              required 
              placeholder="••••••••"
              value={data.password}
              onChange={(e: any) => update('password', e.target.value)}
            />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Input 
            label="Confirm Password" 
            type="password" 
            required 
            placeholder="••••••••"
            value={data.confirmPassword}
            onChange={(e: any) => update('confirmPassword', e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Checkbox 
            label={<span>I agree with the <a href="#" className="text-[#105D42] hover:underline">Terms & Conditions</a></span>}
            checked={data.termsAgreed}
            onChange={(e: any) => update('termsAgreed', e.target.checked)}
          />
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={onNext} disabled={!data.termsAgreed} className="w-full md:w-auto">
            Next Step <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Step3Verification = ({ data, update, onNext }: any) => {
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
    <div className="max-w-xl mx-auto text-center py-8">
      <div className="mb-8 flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-[#105D42]">
          <ShieldCheck size={32} />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Verification</h3>
      <p className="text-gray-500 mb-8">
        We have sent a 6-digit verification code to your mobile number <br/>
        <span className="font-semibold text-gray-800">{data.repMobile || "+880 1XXX XXXXXX"}</span>
      </p>

      <div className="flex gap-3 justify-center mb-8">
        {data.otp.map((digit: string, idx: number) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            className="w-12 h-14 border-2 border-gray-200 rounded-lg text-center text-2xl font-bold focus:border-[#105D42] focus:ring-4 focus:ring-green-50 outline-none transition-all"
          />
        ))}
      </div>

      <div className="space-y-4">
        <Button onClick={onNext} className="w-full py-3">
          Verify & Proceed
        </Button>
        <button onClick={onNext} className="text-sm text-gray-500 hover:text-[#105D42] transition-colors underline decoration-dotted">
          Verify & Skip to Payment (Dev Mode)
        </button>
      </div>
    </div>
  );
};

const Step4CompanyInfo = ({ data, update, onNext, onBack }: any) => {
  const colors = ['bg-blue-600', 'bg-purple-600', 'bg-red-500', 'bg-green-600', 'bg-orange-500'];

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Company Information</h3>

      <div className="grid md:grid-cols-3 gap-8 mb-10">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo <span className="text-red-500">*</span></label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer bg-gray-50 h-40">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">Click to upload or drag & drop</p>
            <p className="text-[10px] text-gray-400 mt-1">SVG, PNG, JPG (max 250kb)</p>
          </div>
        </div>
        
        <div className="col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Color Preference</label>
            <div className="flex gap-4">
              {colors.map((color) => (
                <button 
                  key={color}
                  onClick={() => update('coverColor', color)}
                  className={`w-12 h-12 rounded-lg ${color} transition-transform hover:scale-110 relative shadow-sm`}
                >
                   {data.coverColor === color && <Check className="absolute inset-0 m-auto text-white w-6 h-6" />}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-xs text-blue-700">
            This color will be used as the background for your company profile page header.
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="font-semibold text-gray-800">General Information</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <Input 
            label="Company Name" 
            required 
            value={data.companyName}
            onChange={(e: any) => update('companyName', e.target.value)}
          />
          <Input 
            label="Establishment Date" 
            type="date" 
            required 
            value={data.establishmentDate}
            onChange={(e: any) => update('establishmentDate', e.target.value)}
          />
        </div>

        <h4 className="font-semibold text-gray-800 pt-4">Contact Information</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <Input 
            label="Company Email" 
            type="email"
            required 
            value={data.companyEmail}
            onChange={(e: any) => update('companyEmail', e.target.value)}
          />
          <Input 
            label="Company Mobile" 
            required 
            value={data.companyContactMobile}
            onChange={(e: any) => update('companyContactMobile', e.target.value)}
          />
          <Input 
            label="WhatsApp Number" 
            value={data.companyWhatsapp}
            onChange={(e: any) => update('companyWhatsapp', e.target.value)}
          />
          <Input 
            label="Website URL" 
            placeholder="https://"
            value={data.companyWebsite}
            onChange={(e: any) => update('companyWebsite', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between pt-10">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Next Step <ChevronRight size={18} /></Button>
      </div>
    </div>
  );
};

const Step5PersonalInfo = ({ data, update, onNext, onBack }: any) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
           <h3 className="text-2xl font-bold text-gray-900">Representative Information</h3>
           <p className="text-sm text-gray-500 mt-1">Authorized person for E-Club operations</p>
        </div>
        <Checkbox 
          label="Same as organization head" 
          checked={data.sameAsHead}
          onChange={(e: any) => update('sameAsHead', e.target.checked)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative group cursor-pointer">
           <User size={48} className="text-gray-300" />
           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
             <Upload size={24} className="text-white" />
           </div>
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-medium">Profile Photo</h4>
          <p className="text-xs text-gray-500 max-w-xs">Upload a professional passport size photo. Max file size 250kb. Dimensions 300x350px.</p>
          <div className="flex gap-3 mt-2">
             <Button variant="outline" className="text-xs px-3 py-2 h-auto">Choose File</Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
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
          onChange={(e: any) => update('repDesignation', e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
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

      <div className="grid md:grid-cols-2 gap-6">
        <Input 
          label="Personal Email" 
          type="email"
          value={data.repPersonalEmail}
          onChange={(e: any) => update('repPersonalEmail', e.target.value)}
        />
        <Input 
          label="Personal Website" 
          value={data.repPersonalWebsite}
          onChange={(e: any) => update('repPersonalWebsite', e.target.value)}
        />
      </div>

      <div className="flex justify-between pt-10">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Next Step <ChevronRight size={18} /></Button>
      </div>
    </div>
  );
};

const Step6BusinessInfo = ({ data, update, onNext, onBack }: any) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Business Information</h3>

      <div className="space-y-8">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Type of Business Segment</h4>
          <div className="flex flex-wrap gap-4">
             {['Trading', 'Manufacturing', 'Consultancy', 'Service', 'Other'].map((type) => (
                <Radio 
                  key={type}
                  label={type}
                  name="segment"
                  value={type.toLowerCase()}
                  checked={data.businessSegment === type.toLowerCase()}
                  onChange={() => update('businessSegment', type.toLowerCase())}
                />
             ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Select 
            label="Product/Service Category"
            required
            value={data.productCategory}
            onChange={(e: any) => update('productCategory', e.target.value)}
            options={["IT/Software", "Garments", "Agriculture", "Education", "Healthcare", "Real Estate"]}
          />
          <Input 
            label="Other (if applicable)" 
            placeholder="Specify if other"
          />
        </div>

        <div>
           <div className="flex justify-between items-center mb-4">
             <h4 className="font-semibold text-gray-800">Additional Services</h4>
             <Button variant="ghost" className="text-xs px-2 py-1 h-auto"><Plus size={14} /> Add Service</Button>
           </div>
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid md:grid-cols-2 gap-4">
                 <Input label="Service Name" placeholder="e.g. Consultation" />
                 <Select label="Target Industry" options={["Retail", "B2B", "Government"]} />
              </div>
           </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Export Information</h4>
          <div className="flex items-center gap-8">
            <span className="text-sm font-medium text-gray-700">Does your company export?</span>
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
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Next Step <ChevronRight size={18} /></Button>
      </div>
    </div>
  );
};

const Step7Overview = ({ data, onNext, onBack, onEdit }: any) => {
  const SectionHeader = ({ title, step }: any) => (
    <div className="flex justify-between items-center mb-4 mt-8 border-b border-gray-100 pb-2">
      <h4 className="text-lg font-bold text-[#105D42]">{title}</h4>
      <button onClick={() => onEdit(step)} className="text-xs flex items-center gap-1 text-gray-500 hover:text-[#105D42] transition-colors bg-gray-100 px-3 py-1.5 rounded-full">
        <Edit3 size={12} /> Edit
      </button>
    </div>
  );

  const InfoRow = ({ label, value }: any) => (
    <div className="grid grid-cols-3 py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm font-medium text-gray-500 col-span-1">{label}</span>
      <span className="text-sm font-semibold text-gray-900 col-span-2">{value || '-'}</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Application Overview</h3>
        <p className="text-gray-500">Please review your information before payment</p>
      </div>

      <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-inner">
        
        {/* Basic Info */}
        <SectionHeader title="Basic Information" step={2} />
        <div className="space-y-1">
          <InfoRow label="Company Name" value={data.companyName} />
          <InfoRow label="Rep. Email" value={data.repEmail} />
          <InfoRow label="Rep. Mobile" value={data.repMobile} />
        </div>

        {/* Company Info */}
        <SectionHeader title="Company Information" step={4} />
        <div className="flex items-start gap-4 mb-4">
           <div className="w-16 h-16 bg-white rounded-lg border shadow-sm flex items-center justify-center">
             <Building2 className="text-gray-300" />
           </div>
           <div>
             <p className="font-bold text-gray-900">{data.companyName || "Company Name"}</p>
             <p className="text-xs text-gray-500">{data.companyWebsite}</p>
           </div>
        </div>
        <div className="space-y-1">
          <InfoRow label="Establishment" value={data.establishmentDate} />
          <InfoRow label="Email" value={data.companyEmail} />
          <InfoRow label="Contact" value={data.companyContactMobile} />
        </div>

        {/* Personal Info */}
        <SectionHeader title="Representative" step={5} />
        <div className="space-y-1">
          <InfoRow label="Name" value={data.repName} />
          <InfoRow label="Designation" value={data.repDesignation} />
          <InfoRow label="Gender" value={data.repGender} />
        </div>

        {/* Membership */}
        <SectionHeader title="Membership" step={1} />
        <div className="bg-[#105D42] text-white p-4 rounded-xl flex justify-between items-center shadow-lg shadow-green-900/10">
          <div>
            <p className="text-xs opacity-80 uppercase tracking-wider font-medium">Selected Plan</p>
            <p className="text-xl font-bold">{data.membershipType || "General Member"}</p>
          </div>
          <div className="text-right">
             <p className="text-2xl font-bold">৳ 10,000</p>
             <p className="text-xs opacity-80">/ Year</p>
          </div>
        </div>

      </div>

      <div className="flex justify-between pt-10">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Proceed to Payment <ChevronRight size={18} /></Button>
      </div>
    </div>
  );
};

const Step8Payment = ({ data, update, onBack }: any) => {
  const [activeTab, setActiveTab] = useState('card');
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePay = () => {
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={48} className="text-[#105D42]" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Thank you for joining ECLUB. Your application has been submitted and is pending approval. You will receive an email shortly.
        </p>
        <Button onClick={() => window.location.reload()}>Return to Home</Button>
      </div>
    );
  }

  const PaymentTab = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 text-sm font-medium rounded-lg transition-all border ${activeTab === id ? 'bg-[#105D42] border-[#105D42] text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
    >
      <Icon size={16} /> <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment</h3>
      <p className="text-gray-500 mb-8">Choose your preferred payment method</p>

      <div className="bg-green-50 border border-green-100 p-6 rounded-xl mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm text-green-800 font-medium">Payable Amount</p>
          <h2 className="text-3xl font-bold text-[#105D42]">৳ 10,000<span className="text-sm text-gray-500 font-normal ml-1">BDT</span></h2>
        </div>
        <div className="text-right">
           <p className="text-sm font-semibold text-gray-700">{data.membershipType}</p>
           <p className="text-xs text-gray-500">Includes VAT & Tax</p>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <PaymentTab id="card" label="Card" icon={CreditCard} />
        <PaymentTab id="bank" label="Bank" icon={Landmark} />
        <PaymentTab id="mfs" label="MFS" icon={Banknote} />
        <PaymentTab id="cash" label="In Person" icon={Users} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {activeTab === 'card' && (
          <div className="space-y-6 animate-fadeIn">
            <Input label="Cardholder Name" placeholder="Name as on card" icon={User} />
            <Input label="Card Number" placeholder="XXXX XXXX XXXX XXXX" icon={CreditCard} />
            <div className="grid grid-cols-2 gap-6">
              <Input label="Expiry Date" placeholder="MM/YY" icon={Calendar} />
              <Input label="CVV" placeholder="123" icon={ShieldCheck} />
            </div>
          </div>
        )}
        {activeTab === 'bank' && (
          <div className="text-center py-10 space-y-4">
            <Landmark className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-500">Bank transfer instructions will be sent to your email.</p>
          </div>
        )}
        {activeTab === 'mfs' && (
           <div className="text-center py-10 space-y-4">
             <div className="flex justify-center gap-4 grayscale opacity-70">
                <div className="w-12 h-12 bg-pink-600 rounded-lg"></div>
                <div className="w-12 h-12 bg-orange-500 rounded-lg"></div>
             </div>
             <p className="text-gray-500">Select your mobile wallet provider in the next step.</p>
           </div>
        )}
        {activeTab === 'cash' && (
           <div className="text-center py-10 space-y-4">
             <Users className="w-12 h-12 text-gray-300 mx-auto" />
             <p className="text-gray-500">Please visit our office to complete the payment in person.</p>
           </div>
        )}
      </div>

      <div className="flex justify-between pt-10">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <div className="flex gap-3">
           <Button variant="ghost">Save Draft</Button>
           <Button onClick={handlePay}>Confirm & Pay</Button>
        </div>
      </div>
    </div>
  );
};