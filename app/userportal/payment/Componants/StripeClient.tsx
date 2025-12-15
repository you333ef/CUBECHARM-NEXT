// app/userportal/payment/components/stripe/StripeClient.tsx
'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMemo } from 'react';
import PaymentForm from './PaymentForm';

export default function StripeClient() {
  const stripePromise = useMemo(
    () =>
      loadStripe(
        'pk_test_XXXXXXXXXXXXXXXXXXXX' 
      ),
    []
  );

  console.log('STRIPE KEY:', 'pk_test_***');

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}
