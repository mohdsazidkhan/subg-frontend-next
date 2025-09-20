'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useGoogleLogin } from '@react-oauth/google'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaTrophy, FaBrain, FaRocket } from 'react-icons/fa'
import MonthlyRewardsInfo from '../MonthlyRewardsInfo'
import MobileAppWrapper from '../MobileAppWrapper'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [referralCode, setReferralCode] = useState("")
  const router = useRouter()

  // Check if Google OAuth is available
  const isGoogleOAuthAvailable = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && 
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== 'your_google_client_id_here'

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[@$!%*?&]/.test(password)) strength += 1
    return strength
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    setPasswordStrength(checkPasswordStrength(value))
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'text-red-500'
    if (passwordStrength <= 3) return 'text-yellow-500'
    if (passwordStrength <= 4) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength <= 3) return 'Fair'
    if (passwordStrength <= 4) return 'Good'
    return 'Strong'
  }

  // Google OAuth Registration
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        console.log('🔍 Google OAuth process started...')
        
        // Get user info from Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` }
        }).then(res => res.json())
        
        console.log('📊 Google user info:', userInfo)
        
        // Send to backend for registration with referral code
        const authResponse = await API.googleAuth({
          googleId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          ...(referralCode && { referralCode: referralCode.toUpperCase() })
        })
        
        if (authResponse.success) {
          console.log('✅ Google registration successful, processing user data...')
          
          localStorage.setItem('userInfo', JSON.stringify(authResponse.user))
          localStorage.setItem('token', authResponse.token)
          
          if (authResponse.user.role === 'admin') {
            console.log('🚀 Redirecting to admin dashboard...')
            router.push('/admin/dashboard')
          } else {
            console.log('🚀 Redirecting to home page...')
            router.push('/home')
          }
          
          toast.success('Welcome to SUBG QUIZ! 🎉')
        } else {
          toast.error(authResponse.message || 'Google registration failed')
        }
      } catch (error) {
        console.error('❌ Google registration error:', error)
        toast.error('Google registration failed. Please try again.')
      }
    },
    onError: (error) => {
      console.error('❌ Google OAuth error:', error)
      toast.error('Google registration failed. Please try again.')
    }
  })

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await API.register({
        name,
        email,
        phone,
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
        
        toast.success('Welcome to SUBG QUIZ! 🎉')
      } else {
        toast.error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('❌ Registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Desktop Header */}
      <UnifiedNavbar />
      
      <MobileAppWrapper title="Register">
        <div className="min-h-screen flex items-center justify-center p-2 md:p-4 bg-subg-light dark:bg-subg-dark">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Quiz Platform Info */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Join the Quiz Revolution! 🚀
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Challenge your mind, compete with others, and become a quiz legend!
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg">
                <FaBrain className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Level-Based Learning</h3>
                <p className="text-gray-600 dark:text-gray-300">Progress through 11 exciting levels from Starter to Legend</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                <FaTrophy className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Monthly Rewards System</h3>
                <p className="text-gray-600 dark:text-gray-300">Top 3 eligible users at Level 10 win ₹9,999 each month</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <FaRocket className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Live Competitions</h3>
                <p className="text-gray-600 dark:text-gray-300">Participate in real-time quiz battles</p>
              </div>
            </div>
          </div>

          {/* Monthly Rewards Information */}
          <div className="mt-8">
            <MonthlyRewardsInfo compact={true} />
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl px-2 py-4 md:p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-10 lg:w-16 h-10 lg:h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-white text-2xl" />
              </div>
              <h2 className="text-xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Start your quiz journey today!
              </p>
            </div>

            {/* Referral Code Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Referral Code (optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">#</span>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 tracking-widest uppercase"
                  placeholder="Enter referral code"
                  maxLength={8}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Have a friend's referral code? Enter it here to get started with Google sign-in!
              </p>
            </div>

            {/* Google Registration Button */}
            {isGoogleOAuthAvailable && (
              <button
                onClick={() => googleLogin()}
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-3 lg:px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-3 mb-6 shadow-sm hover:shadow-md"
              >
                <img src="/google.svg" alt="Google" className="w-6 h-6" />
                <span>Sign Up with Google</span>
              </button>
            )}

            {/* Divider */}
            {isGoogleOAuthAvailable && (
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or register with email</span>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value?.toLowerCase())}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Phone Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Password Strength:</span>
                    <span className={`font-medium ${getPasswordStrengthColor()}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength <= 2 ? 'bg-red-500' :
                        passwordStrength <= 3 ? 'bg-yellow-500' :
                        passwordStrength <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FaUser className="h-5 w-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                </span>
                <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors">
                  Sign in here
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

export default RegisterPage