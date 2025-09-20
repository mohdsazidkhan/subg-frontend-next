'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowLeft } from 'react-icons/fa'
import AdminMobileAppWrapper from '@/components/AdminMobileAppWrapper'

const QuestionPage = () => {
  const router = useRouter()
  const [questions, setQuestions] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    quiz: '',
    marks: 1
  })

  useEffect(() => {
    fetchQuestions()
    fetchQuizzes()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await API.getQuestions()
      if (response.success) {
        setQuestions(response.data)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('Failed to fetch questions')
    } finally {
      setLoading(false)
    }
  }

  const fetchQuizzes = async () => {
    try {
      const response = await API.getQuizzes()
      if (response.success) {
        setQuizzes(response.data)
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingQuestion) {
        const response = await API.updateQuestion(editingQuestion._id, formData)
        if (response.success) {
          toast.success('Question updated successfully')
          fetchQuestions()
          setShowForm(false)
          setEditingQuestion(null)
          resetForm()
        }
      } else {
        const response = await API.createQuestion(formData)
        if (response.success) {
          toast.success('Question created successfully')
          fetchQuestions()
          setShowForm(false)
          resetForm()
        }
      }
    } catch (error) {
      console.error('Error saving question:', error)
      toast.error('Failed to save question')
    }
  }

  const resetForm = () => {
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      quiz: '',
      marks: 1
    })
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      question: question.question,
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer || 0,
      explanation: question.explanation || '',
      quiz: question.quiz?._id || '',
      marks: question.marks || 1
    })
    setShowForm(true)
  }

  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const response = await API.deleteQuestion(questionId)
        if (response.success) {
          toast.success('Question deleted successfully')
          fetchQuestions()
        }
      } catch (error) {
        console.error('Error deleting question:', error)
        toast.error('Failed to delete question')
      }
    }
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const filteredQuestions = questions.filter(question =>
    question.question.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Questions">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="Questions">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Questions</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Question</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div
              key={question._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {question.marks} mark{question.marks !== 1 ? 's' : ''}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Quiz: {question.quiz?.title || 'N/A'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(question)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(question._id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {question.question}
              </h3>
              
              <div className="space-y-2 mb-4">
                {question.options?.map((option, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${
                      index === question.correctAnswer
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                    {index === question.correctAnswer && (
                      <span className="ml-2 text-green-600 dark:text-green-400 font-bold">✓</span>
                    )}
                  </div>
                ))}
              </div>
              
              {question.explanation && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Question
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quiz
                  </label>
                  <select
                    value={formData.quiz}
                    onChange={(e) => setFormData({ ...formData, quiz: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select Quiz</option>
                    {quizzes.map((quiz) => (
                      <option key={quiz._id} value={quiz._id}>
                        {quiz.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Options
                  </label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <span className="w-6 text-center font-medium">{String.fromCharCode(65 + index)}.</span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => setFormData({ ...formData, correctAnswer: index })}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Explanation
                  </label>
                  <textarea
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Marks
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg"
                  >
                    {editingQuestion ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingQuestion(null)
                      resetForm()
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminMobileAppWrapper>
  )
}

export default QuestionPage
