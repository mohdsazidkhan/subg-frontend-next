'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../../lib/api'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaChartLine, FaTrophy, FaUsers, FaClock } from 'react-icons/fa'
import AdminMobileAppWrapper from '@/components/AdminMobileAppWrapper'

const QuizAnalytics = () => {
  const router = useRouter()
  const [analytics, setAnalytics] = useState({
    totalQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0,
    completionRate: 0,
    topQuizzes: [],
    difficultyDistribution: [],
    categoryPerformance: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizAnalytics()
  }, [])

  const fetchQuizAnalytics = async () => {
    try {
      setLoading(true)
      const response = await API.getQuizAnalytics()
      if (response.success) {
        setAnalytics(response.data)
      }
    } catch (error) {
      console.error('Error fetching quiz analytics:', error)
      toast.error('Failed to fetch quiz analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Quiz Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="Quiz Analytics">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Analytics</h1>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Quizzes</p>
                <p className="text-3xl font-bold">{analytics.totalQuizzes}</p>
              </div>
              <FaTrophy className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Attempts</p>
                <p className="text-3xl font-bold">{analytics.totalAttempts}</p>
              </div>
              <FaUsers className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Average Score</p>
                <p className="text-3xl font-bold">{analytics.averageScore}%</p>
              </div>
              <FaChartLine className="text-4xl text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Completion Rate</p>
                <p className="text-3xl font-bold">{analytics.completionRate}%</p>
              </div>
              <FaClock className="text-4xl text-yellow-200" />
            </div>
          </div>
        </div>

        {/* Top Quizzes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Quizzes</h3>
          <div className="space-y-3">
            {analytics.topQuizzes?.map((quiz, index) => (
              <div key={quiz._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">{quiz.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.category?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{quiz.attempts} attempts</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.averageScore}% avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Difficulty Distribution</h3>
            <div className="space-y-3">
              {analytics.difficultyDistribution?.map((difficulty, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      difficulty.difficulty === 'easy' ? 'bg-green-500' :
                      difficulty.difficulty === 'medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {difficulty.difficulty.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-gray-900 dark:text-white capitalize">{difficulty.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          difficulty.difficulty === 'easy' ? 'bg-green-500' :
                          difficulty.difficulty === 'medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(difficulty.count / Math.max(...analytics.difficultyDistribution.map(d => d.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{difficulty.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Performance</h3>
            <div className="space-y-3">
              {analytics.categoryPerformance?.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-900 dark:text-white">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{category.averageScore}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.attempts} attempts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminMobileAppWrapper>
  )
}

export default QuizAnalytics
