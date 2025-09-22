import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AnalyticsDashboard = dynamic(() => import('../../../components/pages/admin/AnalyticsDashboard'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function AnalyticsDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyticsDashboard />
    </Suspense>
  );
}
