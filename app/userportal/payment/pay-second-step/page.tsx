// app/payment/page.tsx
'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js/pure';
import { AiOutlineLoading3Quarters, AiOutlineCheck } from 'react-icons/ai';
import dynamic from 'next/dynamic';

const Elements = dynamic(
  () => import('@stripe/react-stripe-js').then((mod) => mod.Elements),
  { ssr: false, loading: () => <div className="text-center py-8">Loading secure payment...</div> }
);

const CardElementDynamic = dynamic(
  () => import('@stripe/react-stripe-js').then((mod) => mod.CardElement),
  { ssr: false }
);

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    'pk_test_51OTjURBQWp069pqTmqhKZHNNd3kMf9TTynJtLJQIJDOSYcGM7xz3DabzCzE7bTxvuYMY0IX96OHBjsysHEKIrwCK006Mu7mKw8'
);

interface PaymentProgressProps {
  currentStep: number;
}

const PaymentProgress = ({ currentStep }: PaymentProgressProps) => {
  const steps = [1, 2, 3];

  return (
    <div className="flex justify-center items-center mb-10 relative">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors ${
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
          {index < steps.length - 1 && (
            <div className="w-20 h-0.5 bg-[#E5E5E5] mx-4" />
          )}
        </div>
      ))}
    </div>
  );
};

const PaymentForm = ({ booking }: { booking: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // @ts-ignore – Stripe hooks will be available after dynamic load
    const stripe = (await import('@stripe/react-stripe-js')).useStripe();
    // @ts-ignore
    const elements = (await import('@stripe/react-stripe-js')).useElements();

    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    // @ts-ignore
    const CardElement = (await import('@stripe/react-stripe-js')).CardElement;
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setLoading(false);
      return;
    }

    const { token, error: stripeError } = await stripe.createToken(cardElement);

    if (stripeError) {
      setError(stripeError.message || 'Payment failed');
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/userportal/payment/completed');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <div className="p-4 bg-[#F8F9FA] rounded-lg border border-[#E5E5E5]">
        <Suspense fallback={<div className="h-12 bg-gray-200 rounded animate-pulse" />}>
          <CardElementDynamic
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#152C5B',
                  '::placeholder': { color: '#B0B0B0' },
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                },
                invalid: { color: '#EF4444' },
              },
            }}
          />
        </Suspense>
      </div>

      {error && (
        <div className="p-4 bg-[#FEE2E2] border border-[#EF4444] rounded-lg text-[#991B1B] text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:flex-1 bg-[#3b82f6] text-white py-3.5 px-7 rounded-lg font-medium shadow-[0_8px_15px_rgba(21,44,91,0.3)] hover:bg-[#152C5B]/90 hover:shadow-[0_12px_20px_rgba(21,44,91,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            'Pay Now'
          )}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="w-full sm:flex-1 bg-white text-[#152C5B] py-3.5 px-7 rounded-lg font-medium border border-[#E5E5E5] shadow-[0_8px_15px_rgba(204,204,204,0.3)] hover:bg-[#F8F9FA] hover:shadow-[0_12px_20px_rgba(204,204,204,0.4)] transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default function StripePaymentPage() {
  const router = useRouter();

  const booking = typeof window !== 'undefined' ? (router as any).state?.booking : null;

  return (
    <div className="min-h-screen bg-[#FAFBFC] px-5 py-10 md:px-10 md:py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl px-6 py-12 md:px-12 md:py-16 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
        <PaymentProgress currentStep={2} />

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#000] mb-2">
            Card Payment
          </h1>
          <p className="text-lg text-[#B0B0B0]">
            Enter your card details to complete payment
          </p>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm booking={booking} />
        </Elements>
      </div>
    </div>
  );
}