import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AboutUs = dynamic(() => import('../components/pages/AboutUs'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function About() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutUs />
    </Suspense>
  );
}
