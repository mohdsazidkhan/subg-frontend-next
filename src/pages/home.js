import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const HomePage = dynamic(() => import('../components/pages/HomePage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
