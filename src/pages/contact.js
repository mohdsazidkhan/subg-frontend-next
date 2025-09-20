import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ContactUs = dynamic(() => import('../components/pages/ContactUs'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Contact() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactUs />
    </Suspense>
  );
}
