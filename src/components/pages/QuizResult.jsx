'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaTrophy, FaMedal, FaCrown, FaArrowLeft, FaRedo, FaHome, FaShare } from 'react-icons/fa'
import MobileAppWrapper from '@/components/MobileAppWrapper'

const QuizResult = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const quizId = searchParams.get('quizId')
    const attemptId = searchParams.get('attemptId')
    
    if (quizId && attemptId) {
      fetchQuizResult(quizId, attemptId)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const fetchQuizResult = async (quizId, attemptId) => {
    try {
      setLoading(true)
      const response = await API.getQuizResult(quizId, attemptId)
      if (response.success) {
        setResult(response.data)
      }
    } catch (error) {
      console.error('Error fetching quiz result:', error)
      toast.error('Failed to load quiz result')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreIcon = (score) => {
    if (score >= 90) return <FaCrown className="text-6xl text-yellow-500" />
    if (score >= 80) return <FaTrophy className="text-6xl text-yellow-500" />
    if (score >= 60) return <FaMedal className="text-6xl text-gray-500" />
    return <FaTrophy className="text-6xl text-red-500" />
  }

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding! You\'re a quiz master!'
    if (score >= 80) return 'Excellent work! Keep it up!'
    if (score >= 60) return 'Good job! You\'re getting better!'
    if (score >= 40) return 'Not bad! Practice makes perfect!'
    return 'Keep practicing! You can do better!'
  }

  if (loading) {
    return (
      <MobileAppWrapper title="Loading Result">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </MobileAppWrapper>
    )
  }

  if (!result) {
    return (
      <MobileAppWrapper title="Result Not Found">
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Result Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The quiz result you're looking for doesn't exist.
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
    <MobileAppWrapper title="Quiz Result">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Result</h1>
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6 text-center">
          <div className="mb-6">
            {getScoreIcon(result.score)}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {result.quiz?.title}
          </h2>
          
          <div className={`text-6xl font-bold mb-4 ${getScoreColor(result.score)}`}>
            {result.score}%
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {getScoreMessage(result.score)}
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.correctAnswers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.totalQuestions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quiz Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Category:</span>
              <span className="text-gray-900 dark:text-white">{result.quiz?.category?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
              <span className="text-gray-900 dark:text-white capitalize">{result.quiz?.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Time Taken:</span>
              <span className="text-gray-900 dark:text-white">{result.timeTaken} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Completed On:</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(result.completedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Question Review */}
        {result.questionResults && result.questionResults.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Question Review
            </h3>
            <div className="space-y-4">
              {result.questionResults.map((questionResult, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    questionResult.isCorrect
                      ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      questionResult.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium mb-2">
                        {questionResult.question}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Your answer: </span>
                          <span className={questionResult.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {questionResult.userAnswer}
                          </span>
                        </p>
                        {!questionResult.isCorrect && (
                          <p className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Correct answer: </span>
                            <span className="text-green-600 dark:text-green-400">
                              {questionResult.correctAnswer}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => router.push(`/attempt-quiz/${result.quiz?._id}`)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <FaRedo />
            <span>Retake Quiz</span>
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/home')}
              className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <FaHome />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Quiz Result',
                    text: `I scored ${result.score}% on ${result.quiz?.title}!`,
                    url: window.location.href
                  })
                } else {
                  navigator.clipboard.writeText(`I scored ${result.score}% on ${result.quiz?.title}!`)
                  toast.success('Result copied to clipboard!')
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <FaShare />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </MobileAppWrapper>
  )
}

export default QuizResult
