'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaClock, FaQuestionCircle, FaCheck, FaTimes, FaArrowLeft, FaFlag } from 'react-icons/fa'
import MobileAppWrapper from '@/components/MobileAppWrapper'

const AttemptQuizPage = ({ quizId }) => {
  const router = useRouter()
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (quizId) {
      fetchQuiz()
    }
  }, [quizId])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quiz) {
      handleSubmitQuiz()
    }
  }, [timeLeft])

  const fetchQuiz = async () => {
    try {
      setLoading(true)
      const response = await API.getQuiz(quizId)
      if (response.success) {
        setQuiz(response.data.quiz)
        setQuestions(response.data.questions)
        setTimeLeft(response.data.quiz.duration * 60) // Convert minutes to seconds
      }
    } catch (error) {
      console.error('Error fetching quiz:', error)
      toast.error('Failed to load quiz')
      router.push('/home')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true)
      const response = await API.submitQuiz(quizId, { answers })
      if (response.success) {
        toast.success('Quiz submitted successfully!')
        router.push(`/quiz-result?quizId=${quizId}&attemptId=${response.data.attemptId}`)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <MobileAppWrapper title="Loading Quiz">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </MobileAppWrapper>
    )
  }

  if (!quiz || !questions.length) {
    return (
      <MobileAppWrapper title="Quiz Not Found">
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The quiz you're looking for doesn't exist or has been removed.
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

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <MobileAppWrapper title={quiz.title}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {quiz.category?.name} • {quiz.difficulty}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <FaClock />
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {currentQuestionIndex + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {currentQuestion.question}
              </h3>
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      answers[currentQuestion._id] === option._id
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question_${currentQuestion._id}`}
                      value={option._id}
                      checked={answers[currentQuestion._id] === option._id}
                      onChange={() => handleAnswerSelect(currentQuestion._id, option._id)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion._id] === option._id
                        ? 'border-yellow-500 bg-yellow-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {answers[currentQuestion._id] === option._id && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-white">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium ${
                  index === currentQuestionIndex
                    ? 'bg-yellow-500 text-white'
                    : answers[questions[index]._id]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </MobileAppWrapper>
  )
}

export default AttemptQuizPage
