'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useGoogleLogin } from '@react-oauth/google'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTrophy, FaBrain, FaRocket, FaSignInAlt } from 'react-icons/fa'
import MobileAppWrapper from '../MobileAppWrapper'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const router = useRouter()

  // Check if Google OAuth is available
  const isGoogleOAuthAvailable = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && 
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== 'your_google_client_id_here'

  // Google OAuth Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        console.log('🔍 Google OAuth process started...')
        
        // Get user info from Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` }
        }).then(res => res.json())
        
        console.log('📊 Google user info:', userInfo)
        
        // Send to backend for authentication with referral code
        const authResponse = await API.googleAuth({
          googleId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          ...(referralCode && { referralCode: referralCode.toUpperCase() })
        })
        
        if (authResponse.success) {
          console.log('✅ Google login successful, processing user data...')
          
          localStorage.setItem('userInfo', JSON.stringify(authResponse.user))
          localStorage.setItem('token', authResponse.token)
          
          if (authResponse.user.role === 'admin') {
            console.log('🚀 Redirecting to admin dashboard...')
            router.push('/admin/dashboard')
          } else {
            console.log('🚀 Redirecting to home page...')
            router.push('/home')
          }
          
          toast.success('Welcome back! 🎉')
        } else {
          toast.error(authResponse.message || 'Google login failed')
        }
      } catch (error) {
        console.error('❌ Google login error:', error)
        toast.error('Google login failed. Please try again.')
      }
    },
    onError: (error) => {
      console.error('❌ Google OAuth error:', error)
      toast.error('Google login failed. Please try again.')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await API.login({
        identifier,
        password,
        ...(referralCode && { referralCode: referralCode.toUpperCase() })
      })

      if (response.success) {
        localStorage.setItem('userInfo', JSON.stringify(response.user))
        localStorage.setItem('token', response.token)
        
        if (response.user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/home')
        }
        
        toast.success('Welcome back! 🎉')
      } else {
        toast.error(response.message || 'Login failed')
      }
    } catch (err) {
      console.error('❌ Login error:', err)
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Desktop Header */}
      <UnifiedNavbar />
      
      <MobileAppWrapper title="Login">
        <div className="bg-subg-light dark:bg-subg-dark flex items-center justify-center p-2 md:p-4 min-h-screen">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Quiz Platform Info */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-xl md:text-2xl lg:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Welcome Back! 🎯
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Ready to continue your quiz journey? Sign in and keep learning!
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-2 lg:space-y-6">
            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg">
                <FaBrain className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Track Your Progress</h3>
                <p className="text-gray-600 dark:text-gray-300">See your level progression and quiz history</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                <FaTrophy className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Compete & Win</h3>
                <p className="text-gray-600 dark:text-gray-300">Join competitions and climb the leaderboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <FaRocket className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Live Battles</h3>
                <p className="text-gray-600 dark:text-gray-300">Participate in real-time quiz competitions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 login-form-container">
            <div className="text-center mb-4 lg:mb-8">
              <h2 className="text-xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back!</h2>
              <p className="text-gray-600 dark:text-gray-400">Sign in to continue your quiz journey</p>
            </div>

            {/* Referral Code Input */}
            <div className="mb-6 referral-code-input">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Referral Code (optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">#</span>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 tracking-widest uppercase"
                  placeholder="Enter referral code"
                  maxLength={8}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 referral-code-help-text">
                Have a friend's referral code? Enter it here to get started with Google sign-in!
              </p>
            </div>

            {/* Google Login Button */}
            {isGoogleOAuthAvailable && (
              <button
                onClick={() => googleLogin()}
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-3 lg:px-6 py-2 lg:py-3 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-3 mb-3 lg:mb-6 shadow-sm hover:shadow-md"
              >
                <img src="/google.svg" alt="Google" className="w-6 h-6" />
                <span>Sign In with Google</span>
              </button>
            )}

            {/* Divider */}
            {isGoogleOAuthAvailable && (
              <div className="relative mb-2 lg:mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email/Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 lg:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                    placeholder="Enter your email or username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-2 lg:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 lg:py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FaSignInAlt className="h-5 w-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-4">
              <div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  Forgot your password?
                </Link>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                </span>
                <Link href="/register" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors">
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </MobileAppWrapper>
    
    {/* Desktop Footer */}
    <UnifiedFooter />
    </>
  )
}

export default LoginPage