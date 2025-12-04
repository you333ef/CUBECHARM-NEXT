'use client'
import { useRouter } from 'next/navigation';
import { AiOutlineCheck } from 'react-icons/ai';



interface PaymentProgressProps {
  currentStep: number;
}
const paymentSuccess='/images/noResultActivate.png'
const PaymentProgress = ({ currentStep }: PaymentProgressProps) => {
  const steps = [1, 2, 3];

  return (
    <div className="flex justify-center items-center mb-10 relative">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          {/* Step Circle */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 ${
              step <= currentStep
                ? 'bg-[#3b82f6] text-white'
                : 'bg-[#E5E5E5] text-[#898989]'
            }`}
          >
            {step < currentStep ? (
              <AiOutlineCheck className="w-5 h-5" />
            ) : (
              <span className="text-base font-medium">{step}</span>
            )}
          </div>

          {/* Line */}
          {index < steps.length - 1 && (
            <div
              className={`w-20 h-0.5 ${
                step < currentStep ? 'bg-[#E5E5E5]' : 'bg-[#E5E5E5]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};


// Completed Page
const Completed = () => {
  const navigate = useRouter();

  return (
    <div className="min-h-screen bg-[#FAFBFC] px-5 py-10 md:px-10 md:py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl px-6 py-12 md:px-12 md:py-16 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
        {/* Progress Steps */}
        <PaymentProgress currentStep={3} />

        {/* Content */}
        <div className="text-center space-y-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#152C5B]">
            Yay! Completed
          </h1>

          <img
            src={paymentSuccess}
            alt="Payment Success"
            className="w-64 h-64 mx-auto object-contain"
          />

          <p className="text-lg text-[#7C8DB0] max-w-md mx-auto">
            Your payment has been processed successfully. Thank you for your booking!
          </p>

          <button
            onClick={() => navigate.push('/')}
            className="bg-[#3b82f6] text-white py-3.5 px-10 rounded-lg font-medium shadow-[0_8px_15px_rgba(21,44,91,0.3)] hover:bg-[#152C5B]/90 hover:shadow-[0_12px_20px_rgba(21,44,91,0.4)] transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Completed;
