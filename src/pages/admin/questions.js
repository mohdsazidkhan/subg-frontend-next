import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const QuestionsPage = dynamic(() => import('../../components/pages/admin/QuestionsPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Questions() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestionsPage />
    </Suspense>
  );
}
