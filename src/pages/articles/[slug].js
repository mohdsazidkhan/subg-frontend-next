import { useRouter } from 'next/router'
import ArticleDetailPage from '../../components/pages/ArticleDetailPage'

export default function ArticleDetail() {
  const router = useRouter()
  const { slug } = router.query

  if (!slug) {
    return <div>Loading...</div>
  }

  return <ArticleDetailPage slug={slug} />
}
