import dynamic from 'next/dynamic'

const AdminArticleForm = dynamic(() => import('../../../components/pages/admin/AdminArticleForm'), { ssr: false })

export default function CreateArticle() {
  return <AdminArticleForm />
}
