// app/userportal/payment/components/stripe/PaymentForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error } = await stripe.createToken(cardElement);

    if (error) {
      setError(error.message || 'Payment failed');
      setLoading(false);
      return;
    }

    router.push('/userportal/payment/completed');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="p-4 bg-[#F8F9FA] rounded-lg border">
        <CardElement />
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        disabled={loading || !stripe}
        className="w-full bg-blue-500 text-white py-3 rounded-lg"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
