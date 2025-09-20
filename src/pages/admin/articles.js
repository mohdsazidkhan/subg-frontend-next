import dynamic from 'next/dynamic'

const AdminArticles = dynamic(() => import('../../components/pages/admin/AdminArticles'), { ssr: false })

export default function AdminArticlesPage() {
  return <AdminArticles />
}
