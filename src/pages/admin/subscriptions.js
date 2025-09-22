import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SubscriptionsPage = dynamic(() => import('../../components/pages/admin/SubscriptionsPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Subscriptions() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscriptionsPage />
    </Suspense>
  );
}
