'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaPlay, FaClock, FaUsers, FaTrophy } from 'react-icons/fa'
import MobileAppWrapper from '@/components/MobileAppWrapper'

import UnifiedNavbar from '../UnifiedNavbar';
import UnifiedFooter from '../UnifiedFooter';

const CategoryDetailPage = ({ categoryId }) => {
  const router = useRouter()
  const [category, setCategory] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (categoryId) {
      fetchCategoryDetails()
    }
  }, [categoryId])

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true)
      const response = await API.getCategoryDetails(categoryId)
      if (response.success) {
        setCategory(response.data.category)
        setQuizzes(response.data.quizzes)
      }
    } catch (error) {
      console.error('Error fetching category details:', error)
      toast.error('Failed to load category details')
    } finally {
      setLoading(false)
    }
  }

  const handleQuizClick = (quizId) => {
    router.push(`/attempt-quiz/${quizId}`)
  }

  if (loading) {
    return (
      <MobileAppWrapper title="Loading Category">
        <div className="flex items-center justify-center h-64">
        {/* Desktop Header */}
        <UnifiedNavbar />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
            {/* Desktop Footer */}
      <UnifiedFooter />
    </MobileAppWrapper>
    )
  }

  if (!category) {
    return (
      <MobileAppWrapper title="Category Not Found">
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The category you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push('/home')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go to Home
          </button>
        </div>
      </MobileAppWrapper>
    )
  }

  return (
    <MobileAppWrapper title={category.name}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
          </div>
        </div>

        {/* Category Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              {category.icon || '📚'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{category.name}</h2>
              <p className="text-blue-100">{category.description}</p>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaTrophy className="text-2xl text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaUsers className="text-2xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{category.totalAttempts || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Attempts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaClock className="text-2xl text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{category.averageTime || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Time (min)</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaTrophy className="text-2xl text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{category.averageScore || 0}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
          </div>
        </div>

        {/* Quizzes List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available Quizzes</h3>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleQuizClick(quiz._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {quiz.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {quiz.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <FaClock />
                        <span>{quiz.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaUsers />
                        <span>{quiz.attempts || 0} attempts</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaTrophy />
                        <span>{quiz.questions?.length || 0} questions</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {quiz.difficulty}
                    </div>
                    <button className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <FaPlay />
                      <span>Start Quiz</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No quizzes available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This category doesn't have any quizzes yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </MobileAppWrapper>
  )
}

export default CategoryDetailPage
