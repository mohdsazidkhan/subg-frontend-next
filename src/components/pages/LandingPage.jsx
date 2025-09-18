'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FaTrophy,
  FaCrown,
  FaStar,
  FaMedal,
  FaRocket,
  FaBrain,
  FaChartLine,
  FaAward,
  FaGem,
  FaBook,
  FaFlask,
  FaLaptopCode,
  FaGlobe,
  FaCalculator,
  FaPalette,
  FaUserGraduate,
  FaArrowRight,
  FaPlay,
  FaUsers,
  FaGift,
  FaCheckCircle,
  FaShieldAlt,
  FaHeadset,
  FaMobileAlt,
  FaDesktop,
  FaTabletAlt,
  FaMagic,
  FaQuestionCircle,
  FaNewspaper,
  FaHistory,
  FaFutbol,
  FaFilm,
  FaLanguage,
  FaGraduationCap,
  FaDollarSign,
  FaCalendarDay,
} from 'react-icons/fa'

import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'
import API from '@/lib/api'

const LandingPage = () => {
  const [levels, setLevels] = useState([])
  const [categories, setCategories] = useState([])
  const [topPerformers, setTopPerformers] = useState([])
  const [stats, setStats] = useState({
    activeStudents: "10K+",
    quizCategories: "500+",
    subcategories: "100+",
    totalQuizzes: "1000+",
    totalQuestions: "5000+",
    quizzesTaken: "50K+",
    monthlyPrizePool: "₹9,999",
    paidSubscriptions: "99",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
    if (token) {
      router.push("/home")
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch data in parallel
      const [levelsData, categoriesData, topPerformersData, statsData] = await Promise.all([
        API.getPublicLevels().catch(() => []),
        API.getPublicCategoriesEnhanced().catch(() => []),
        API.getPublicLandingTopPerformers(10).catch(() => []),
        API.getPublicLandingStats().catch(() => null)
      ])

      setLevels(levelsData || [])
      setCategories(categoriesData || [])
      setTopPerformers(topPerformersData || [])
      
      if (statsData) {
        setStats(prevStats => ({
          ...prevStats,
          ...statsData
        }))
      }
    } catch (err) {
      console.error('Error fetching landing page data:', err)
      setError('Failed to load some data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Mathematics': FaCalculator,
      'Science': FaFlask,
      'Technology': FaLaptopCode,
      'General Knowledge': FaGlobe,
      'History': FaHistory,
      'Sports': FaFutbol,
      'Entertainment': FaFilm,
      'Language': FaLanguage,
      'Education': FaGraduationCap,
      'Art': FaPalette,
      'News': FaNewspaper,
    }
    
    const IconComponent = iconMap[categoryName] || FaBook
    return <IconComponent className="w-6 h-6" />
  }

  const getLevelIcon = (level) => {
    if (level <= 3) return <FaGem className="w-6 h-6 text-green-500" />
    if (level <= 6) return <FaMedal className="w-6 h-6 text-blue-500" />
    if (level <= 9) return <FaCrown className="w-6 h-6 text-purple-500" />
    return <FaTrophy className="w-6 h-6 text-yellow-500" />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <UnifiedNavbar isLandingPage={true} scrollToSection={scrollToSection} />
      
      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                SUBG QUIZ
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Test your knowledge, compete with others, and win amazing prizes! 
              Join thousands of students in our interactive quiz platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/register"
              className="bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Free
              <FaArrowRight className="inline-block ml-2" />
            </Link>
            <Link
              href="/login"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 px-8 rounded-full text-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose from a wide variety of quiz categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <div
                key={category._id}
                className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-4">
                    {getCategoryIcon(category.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {category.subcategories?.length || 0} Subcategories
                    </p>
                  </div>
                </div>
                <Link
                  href={`/category/${category._id}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center"
                >
                  Explore Quizzes
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section id="levels" className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Levels
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Progress through different difficulty levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.slice(0, 6).map((level) => (
              <div
                key={level.level}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  {getLevelIcon(level.level)}
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Level {level.level}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {level.quizCount || 0} Quizzes Available
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {level.level <= 3 && "Beginner Level - Perfect for getting started"}
                  {level.level > 3 && level.level <= 6 && "Intermediate Level - Challenge yourself"}
                  {level.level > 6 && level.level <= 9 && "Advanced Level - For experts"}
                  {level.level > 9 && "Master Level - Ultimate challenge"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Performers Section */}
      <section id="performers" className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Top Performers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See who's leading the leaderboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPerformers.slice(0, 6).map((performer, index) => (
              <div
                key={performer._id}
                className={`bg-gradient-to-br rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  index === 0 ? 'from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800' :
                  index === 1 ? 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600' :
                  index === 2 ? 'from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800' :
                  'from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700'
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mr-4 ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-500' :
                    index === 2 ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}>
                    {index < 3 ? <FaTrophy className="w-6 h-6" /> : <FaUserGraduate className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {performer.name || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Rank #{index + 1}
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {performer.totalScore || 0} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Quiz Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and test your knowledge today!
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
          >
            Get Started Now
            <FaRocket className="inline-block ml-2" />
          </Link>
        </div>
      </section>

      <UnifiedFooter isLandingPage={true} />
    </div>
  )
}

export default LandingPage
