'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../../lib/api'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowLeft, FaEye } from 'react-icons/fa'
import AdminMobileAppWrapper from '../../AdminMobileAppWrapper'

const AdminArticles = () => {
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchArticles()
  }, [currentPage])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await API.getArticles({ page: currentPage, limit: 10 })
      if (response.success) {
        setArticles(response.data.articles)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      toast.error('Failed to fetch articles')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await API.deleteArticle(articleId)
        if (response.success) {
          toast.success('Article deleted successfully')
          fetchArticles()
        }
      } catch (error) {
        console.error('Error deleting article:', error)
        toast.error('Failed to delete article')
      }
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Articles">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="Articles">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Articles</h1>
          </div>
          <button
            onClick={() => router.push('/admin/articles/create')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FaPlus />
            <span>Create Article</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <div
              key={article._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    📝
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      By {article.author?.name || 'Unknown'} • {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/articles/${article.slug}`)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                    title="View Article"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => router.push(`/admin/articles/${article._id}/edit`)}
                    className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg"
                    title="Edit Article"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                    title="Delete Article"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {article.excerpt || article.content?.substring(0, 200) + '...'}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    article.status === 'published' ? 'bg-green-100 text-green-800' :
                    article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {article.status}
                  </span>
                  {article.featured && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                  {article.pinned && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Pinned
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {article.views || 0} views • {article.likes || 0} likes
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminMobileAppWrapper>
  )
}

export default AdminArticles
