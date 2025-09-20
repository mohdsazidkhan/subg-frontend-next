'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../lib/api'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaCalendarAlt, FaUser, FaEye, FaHeart, FaShare, FaBookmark } from 'react-icons/fa'
import MobileAppWrapper from '../MobileAppWrapper'

const ArticleDetailPage = ({ slug }) => {
  const router = useRouter()
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchArticle()
    }
  }, [slug])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      const response = await API.getArticleBySlug(slug)
      if (response.success) {
        setArticle(response.data)
        setRelatedArticles(response.data.relatedArticles || [])
        setLiked(response.data.liked || false)
        setBookmarked(response.data.bookmarked || false)
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      toast.error('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    try {
      const response = await API.incrementArticleLikes(article._id)
      if (response.success) {
        setLiked(!liked)
        setArticle(prev => ({
          ...prev,
          likes: liked ? prev.likes - 1 : prev.likes + 1
        }))
      }
    } catch (error) {
      console.error('Error liking article:', error)
      toast.error('Failed to like article')
    }
  }

  const handleBookmark = async () => {
    // TODO: Implement bookmark functionality when API is available
    setBookmarked(!bookmarked)
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Article link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <MobileAppWrapper title="Loading Article">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </MobileAppWrapper>
    )
  }

  if (!article) {
    return (
      <MobileAppWrapper title="Article Not Found">
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The article you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push('/articles')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go to Articles
          </button>
        </div>
      </MobileAppWrapper>
    )
  }

  return (
    <MobileAppWrapper title={article.title}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Article</h1>
          </div>
        </div>

        {/* Article Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <FaUser />
                <span>{article.author?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaCalendarAlt />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaEye />
                <span>{article.views || 0} views</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-lg ${
                  liked 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <FaHeart />
              </button>
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg ${
                  bookmarked 
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <FaBookmark />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              >
                <FaShare />
              </button>
            </div>
          </div>

          {article.featuredImage && (
            <div className="mb-6">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Article Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                  liked 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <FaHeart />
                <span>{article.likes || 0}</span>
              </button>
              <button
                onClick={handleBookmark}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                  bookmarked 
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <FaBookmark />
                <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              <FaShare />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Related Articles
            </h3>
            <div className="space-y-4">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle._id}
                  className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => router.push(`/articles/${relatedArticle.slug}`)}
                >
                  {relatedArticle.featuredImage && (
                    <img
                      src={relatedArticle.featuredImage}
                      alt={relatedArticle.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileAppWrapper>
  )
}

export default ArticleDetailPage
