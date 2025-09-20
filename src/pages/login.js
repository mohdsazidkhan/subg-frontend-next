import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LoginPage = dynamic(() => import('../components/pages/LoginPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
