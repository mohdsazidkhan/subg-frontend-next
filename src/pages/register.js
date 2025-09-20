import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const RegisterPage = dynamic(() => import('../components/pages/RegisterPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
}
