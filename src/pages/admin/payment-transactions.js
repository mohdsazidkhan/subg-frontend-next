import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const PaymentTransactionsPage = dynamic(() => import('../../components/pages/admin/PaymentTransactionsPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function PaymentTransactions() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentTransactionsPage />
    </Suspense>
  );
}
