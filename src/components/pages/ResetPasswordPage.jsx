'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'

const ResetPasswordPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Extract token from query string
    const t = searchParams.get('token')
    if (t) setToken(t)
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.error('Invalid or missing reset token.')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    setIsLoading(true)
    try {
      const res = await API.resetPassword({ token, newPassword })
      if (res.success) {
        setSuccess(true)
        toast.success(res.message || 'Password reset successful!')
        setTimeout(() => router.push('/login'), 2000)
      } else {
        toast.error(res.message || 'Failed to reset password.')
      }
    } catch (err) {
      console.error('Reset password error:', err)
      toast.error(err.response?.data?.message || 'Failed to reset password.')
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

        {/* Reset Password Form */}
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
            Reset Password
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
            Enter your new password below.
          </p>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your password has been updated successfully. Redirecting to login...
              </p>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          {!token && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">
                Invalid or missing reset token. Please check your email link.
              </p>
            </div>
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
      </div>
    </div>
  )
}

export default ResetPasswordPage
