import { useRouter } from 'next/router';
import ArticleCategoryPage from '../../../components/pages/ArticleCategoryPage';

const CategoryPage = () => {
  const router = useRouter();
  const { categoryId } = router.query;

  if (!categoryId) {
    return <div>Loading...</div>;
  }

  return <ArticleCategoryPage categoryId={categoryId} />;
};

export default CategoryPage;
