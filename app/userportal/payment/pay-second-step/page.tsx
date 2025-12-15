"use client"
import {
  useState,
  useCallback,
  useEffect,
  memo,
  lazy,
  Suspense,
  type FormEvent,
  type ReactNode,
} from 'react';

import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

// ============ TYPES ============
interface PaymentProgressProps {
  currentStep: number;
}

interface BookingData {
  id?: string;
  amount?: number;
  description?: string;
}

// ============ CONSTANTS ============
const STEPS = [1, 2, 3] as const;
const STRIPE_KEY = 'pk_test_51OTjURBQWp069pqTmqhKZHNNd3kMf9TTynJtLJQIJDOSYcGM7xz3DabzCzE7bTxvuYMY0IX96OHBjsysHEKIrwCK006Mu7mKw8';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#152C5B',
      '::placeholder': { color: '#B0B0B0' },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    invalid: { color: '#EF4444' },
  },
} as const;

// Initialize Stripe outside component for performance
let stripePromiseCache: Promise<Stripe | null> | null = null;
const getStripePromise = () => {
  if (!stripePromiseCache) {
    stripePromiseCache = loadStripe(STRIPE_KEY);
  }
  return stripePromiseCache;
};

// ============ ICONS (Inline SVG for performance) ============
const LoadingIcon = memo(() => (
  <svg
    className="w-5 h-5 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-5.07l-2.83 2.83M8.76 15.24l-2.83 2.83m11.31 0l-2.83-2.83M8.76 8.76L5.93 5.93" />
  </svg>
));
LoadingIcon.displayName = 'LoadingIcon';

const CheckIcon = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
));
CheckIcon.displayName = 'CheckIcon';

// ============ LOADING SKELETON ============
const CardSkeleton = memo(() => (
  <div className="h-12 bg-gray-200 rounded animate-pulse" />
));
CardSkeleton.displayName = 'CardSkeleton';

const PaymentLoadingSkeleton = memo(() => (
  <div className="text-center py-8 text-[#B0B0B0]">Loading secure payment system...</div>
));
PaymentLoadingSkeleton.displayName = 'PaymentLoadingSkeleton';

// ============ STEP INDICATOR ============
const StepIndicator = memo(({ step, currentStep, isLast }: { step: number; currentStep: number; isLast: boolean }) => {
  const isCompleted = step < currentStep;
  const isActive = step <= currentStep;

  return (
    <div className="flex items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors duration-200 ${
          isActive ? 'bg-[#3b82f6] text-white' : 'bg-[#E5E5E5] text-[#898989]'
        }`}
      >
        {isCompleted ? <CheckIcon /> : <span className="text-base font-medium">{step}</span>}
      </div>
      {!isLast && <div className="w-20 h-0.5 bg-[#E5E5E5] mx-4" />}
    </div>
  );
});
StepIndicator.displayName = 'StepIndicator';

// ============ PAYMENT PROGRESS ============
const PaymentProgress = memo(({ currentStep }: PaymentProgressProps) => (
  <div className="flex justify-center items-center mb-10 relative">
    {STEPS.map((step, index) => (
      <StepIndicator
        key={step}
        step={step}
        currentStep={currentStep}
        isLast={index === STEPS.length - 1}
      />
    ))}
  </div>
));
PaymentProgress.displayName = 'PaymentProgress';

// ============ ERROR MESSAGE ============
const ErrorMessage = memo(({ message }: { message: string }) => (
  <div className="p-4 bg-[#FEE2E2] border border-[#EF4444] rounded-lg text-[#991B1B] text-sm">
    {message}
  </div>
));
ErrorMessage.displayName = 'ErrorMessage';

// ============ PAYMENT FORM ============
const PaymentForm = memo(({ booking }: { booking: BookingData | null }) => {
  const navigate = useRouter()
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system is not ready yet');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { token, error: stripeError } = await stripe.createToken(cardElement);

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate.push('/payment/completed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [stripe, elements, navigate]);

  const handleCancel = useCallback(() => {
    navigate.push('/');
  }, [navigate]);

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <div className="p-4 bg-[#F8F9FA] rounded-lg border border-[#E5E5E5]">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={loading || !stripe}
          className="w-full sm:flex-1 bg-[#3b82f6] text-white py-3.5 px-7 rounded-lg font-medium shadow-[0_8px_15px_rgba(59,130,246,0.3)] hover:bg-[#2563eb] hover:shadow-[0_12px_20px_rgba(59,130,246,0.4)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingIcon />
              <span>Processing...</span>
            </>
          ) : (
            'Pay Now'
          )}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="w-full sm:flex-1 bg-white text-[#152C5B] py-3.5 px-7 rounded-lg font-medium border border-[#E5E5E5] shadow-[0_8px_15px_rgba(204,204,204,0.3)] hover:bg-[#F8F9FA] hover:shadow-[0_12px_20px_rgba(204,204,204,0.4)] transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
});
PaymentForm.displayName = 'PaymentForm';

// ============ MAIN COMPONENT ============
const StripePaymentPage = () => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [booking] = useState<BookingData | null>(null);

  // Load Stripe on mount
  useEffect(() => {
    setStripePromise(getStripePromise());
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFBFC] px-5 py-10 md:px-10 md:py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl px-6 py-12 md:px-12 md:py-16 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
        <PaymentProgress currentStep={2} />

        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#000] mb-2">
            Card Payment
          </h1>
          <p className="text-lg text-[#B0B0B0]">
            Enter your card details to complete payment
          </p>
        </header>

        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <PaymentForm booking={booking} />
          </Elements>
        ) : (
          <PaymentLoadingSkeleton />
        )}
      </div>
    </div>
  );
};

export default memo(StripePaymentPage);
