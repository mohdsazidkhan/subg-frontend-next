'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaPlay, FaClock, FaUsers, FaTrophy, FaLock, FaCheck } from 'react-icons/fa'
import MobileAppWrapper from '@/components/MobileAppWrapper'

const LevelDetailPage = ({ levelNumber }) => {
  const router = useRouter()
  const [level, setLevel] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (levelNumber) {
      fetchLevelDetails()
    }
  }, [levelNumber])

  const fetchLevelDetails = async () => {
    try {
      setLoading(true)
      const response = await API.getLevelDetails(levelNumber)
      if (response.success) {
        setLevel(response.data.level)
        setQuizzes(response.data.quizzes)
        setUserProgress(response.data.userProgress)
      }
    } catch (error) {
      console.error('Error fetching level details:', error)
      toast.error('Failed to load level details')
    } finally {
      setLoading(false)
    }
  }

  const handleQuizClick = (quizId) => {
    router.push(`/attempt-quiz/${quizId}`)
  }

  const isLevelUnlocked = () => {
    if (!userProgress) return false
    return userProgress.currentLevel >= levelNumber
  }

  const getLevelColor = (levelNum) => {
    const colors = [
      'from-gray-500 to-gray-600',
      'from-green-500 to-green-600',
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600'
    ]
    return colors[(levelNum - 1) % colors.length]
  }

  if (loading) {
    return (
      <MobileAppWrapper title="Loading Level">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </MobileAppWrapper>
    )
  }

  if (!level) {
    return (
      <MobileAppWrapper title="Level Not Found">
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Level Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The level you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push('/levels')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go to Levels
          </button>
        </div>
      </MobileAppWrapper>
    )
  }

  return (
    <MobileAppWrapper title={`Level ${levelNumber}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Level {levelNumber}</h1>
          </div>
        </div>

        {/* Level Header */}
        <div className={`bg-gradient-to-r ${getLevelColor(levelNumber)} rounded-lg p-6 mb-6 text-white relative overflow-hidden`}>
          {!isLevelUnlocked() && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <FaLock className="text-4xl mx-auto mb-2" />
                <p className="text-lg font-semibold">Level Locked</p>
                <p className="text-sm opacity-90">Complete previous levels to unlock</p>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {levelNumber}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Level {levelNumber}</h2>
              <p className="text-white/90">{level.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="flex items-center space-x-1">
                  <FaTrophy />
                  <span>{level.requiredScore || 0}% required</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaClock />
                  <span>{level.estimatedTime || 0} min</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaTrophy className="text-2xl text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaUsers className="text-2xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{level.totalAttempts || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Attempts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaClock className="text-2xl text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{level.averageTime || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Time (min)</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <FaTrophy className="text-2xl text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{level.averageScore || 0}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
          </div>
        </div>

        {/* User Progress */}
        {userProgress && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Level Completion</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {userProgress.completedQuizzes || 0} / {quizzes.length} quizzes
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((userProgress.completedQuizzes || 0) / quizzes.length) * 100}%` }}
                ></div>
              </div>
              {userProgress.bestScore && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Best Score</span>
                  <span className="text-gray-900 dark:text-white font-medium">{userProgress.bestScore}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quizzes List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Level Quizzes</h3>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => {
              const isCompleted = userProgress?.completedQuizzes?.includes(quiz._id)
              return (
                <div
                  key={quiz._id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow ${
                    !isLevelUnlocked() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => isLevelUnlocked() && handleQuizClick(quiz._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {quiz.title}
                        </h4>
                        {isCompleted && (
                          <FaCheck className="text-green-500" />
                        )}
                      </div>
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
                      <button 
                        disabled={!isLevelUnlocked()}
                        className={`mt-3 px-4 py-2 rounded-lg flex items-center space-x-2 ${
                          !isLevelUnlocked() 
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : isCompleted
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        }`}
                      >
                        <FaPlay />
                        <span>{isCompleted ? 'Retake' : 'Start Quiz'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No quizzes available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This level doesn't have any quizzes yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </MobileAppWrapper>
  )
}

export default LevelDetailPage
