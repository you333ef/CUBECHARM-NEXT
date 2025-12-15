// app/userportal/payment/pay-second-step/page.tsx
import PaymentProgress from '../Componants/PaymentProgress';
import StripeClient from '../Componants/StripeClient';

export default function PaySecondStepPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC] px-5 py-10 md:px-10 md:py-16 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl px-6 py-12 md:px-12 md:py-16 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
        
        <PaymentProgress currentStep={2} />

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Card Payment
          </h1>
          <p className="text-lg text-[#B0B0B0]">
            Enter your card details to complete payment
          </p>
        </div>

        <StripeClient />
      </div>
    </div>
  );
}
