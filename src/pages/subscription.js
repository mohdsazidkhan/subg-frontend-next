import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SubscriptionPage = dynamic(() => import('../components/pages/SubscriptionPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Subscription() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscriptionPage />
    </Suspense>
  );
}
