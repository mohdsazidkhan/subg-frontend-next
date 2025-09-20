import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const RewardsPage = dynamic(() => import('../components/pages/RewardsPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Rewards() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RewardsPage />
    </Suspense>
  );
}
