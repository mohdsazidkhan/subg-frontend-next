import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LevelsPage = dynamic(() => import('../components/pages/LevelsPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Levels() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LevelsPage />
    </Suspense>
  );
}
