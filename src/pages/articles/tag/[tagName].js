import { useRouter } from 'next/router';
import ArticleTagPage from '../../../components/pages/ArticleTagPage';

const TagPage = () => {
  const router = useRouter();
  const { tagName } = router.query;

  if (!tagName) {
    return <div>Loading...</div>;
  }

  return <ArticleTagPage tagName={tagName} />;
};

export default TagPage;
