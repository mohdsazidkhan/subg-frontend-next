'use client'

import { useState } from 'react'
import Link from 'next/link'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await API.forgotPassword(email)
      if (res.success) {
        setSuccess(true)
        toast.success(res.message || 'Password reset link sent!')
      } else {
        toast.error(res.message || 'Failed to send reset link.')
      }
    } catch (err) {
      console.error('Forgot password error:', err)
      toast.error(err.response?.data?.message || 'Failed to send reset link.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <img src="/logo.png" alt="SUBG QUIZ" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <Link 
              href="/login" 
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-4"
            >
              <FaArrowLeft /> Back to Login
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Forgot Password
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          {/* Additional Help */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Remember your password?{' '}
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Need help?{' '}
            <Link
              href="/contact"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
