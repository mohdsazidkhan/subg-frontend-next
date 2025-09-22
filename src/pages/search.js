import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SearchPage = dynamic(() => import('../components/pages/SearchPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Search() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}
