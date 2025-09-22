'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaPlay, FaClock, FaUsers, FaTrophy } from 'react-icons/fa'
import MobileAppWrapper from '@/components/MobileAppWrapper'

import UnifiedNavbar from '../UnifiedNavbar';
import UnifiedFooter from '../UnifiedFooter';

const SubcategoryDetailPage = ({ subcategoryId }) => {
  const router = useRouter()
  const [subcategory, setSubcategory] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (subcategoryId) {
      fetchSubcategoryDetails()
    }
  }, [subcategoryId])

  const fetchSubcategoryDetails = async () => {
    try {
      setLoading(true)
      const response = await API.getSubcategoryDetails(subcategoryId)
      if (response.success) {
        setSubcategory(response.data.subcategory)
        setQuizzes(response.data.quizzes)
      }
    } catch (error) {
      console.error('Error fetching subcategory details:', error)
      toast.error('Failed to load subcategory details')
    } finally {
      setLoading(false)
    }
  }

  const handleQuizClick = (quizId) => {
    router.push(`/attempt-quiz/${quizId}`)
  }

  if (loading) {
    return (
      <MobileAppWrapper title="Loading Subcategory">
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

  if (!subcategory) {
    return (
      <MobileAppWrapper title="Subcategory Not Found">
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Subcategory Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The subcategory you're looking for doesn't exist.
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
    <MobileAppWrapper title={subcategory.name}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{subcategory.name}</h1>
          </div>
        </div>

        {/* Subcategory Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 mb-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              {subcategory.icon || '📖'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{subcategory.name}</h2>
              <p className="text-green-100">{subcategory.description}</p>
              <p className="text-sm text-green-200 mt-1">
                Under {subcategory.category?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Subcategory Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaTrophy className="text-2xl text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaUsers className="text-2xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{subcategory.totalAttempts || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Attempts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaClock className="text-2xl text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{subcategory.averageTime || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Time (min)</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaTrophy className="text-2xl text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{subcategory.averageScore || 0}%</div>
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
              <div className="text-gray-400 text-6xl mb-4">📖</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No quizzes available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This subcategory doesn't have any quizzes yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </MobileAppWrapper>
  )
}

export default SubcategoryDetailPage
