import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const AdminArticleForm = dynamic(() => import('../../../../components/pages/admin/AdminArticleForm'), { ssr: false })

export default function EditArticle() {
  const router = useRouter()
  const { id } = router.query

  if (!id) {
    return <div>Loading...</div>
  }

  return <AdminArticleForm articleId={id} />
}
