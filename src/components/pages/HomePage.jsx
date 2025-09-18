'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaSearch, FaTrophy, FaStar, FaBook, FaBrain, FaRocket, FaUsers, FaChartLine } from 'react-icons/fa'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'
import TokenValidationWrapper from '../TokenValidationWrapper'
import API from '@/lib/api'

const HomePage = () => {
  const [homeData, setHomeData] = useState({
    categories: [],
    levels: [],
    topPerformers: [],
    recentQuizzes: [],
    stats: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      const data = await API.getHomePageData()
      setHomeData(data)
    } catch (err) {
      console.error('Error fetching home data:', err)
      setError('Failed to load data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Mathematics': '🧮',
      'Science': '🔬',
      'Technology': '💻',
      'General Knowledge': '🌍',
      'History': '📚',
      'Sports': '⚽',
      'Entertainment': '🎬',
      'Language': '🗣️',
      'Education': '🎓',
      'Art': '🎨',
      'News': '📰',
    }
    
    return iconMap[categoryName] || '📖'
  }

  const getLevelColor = (level) => {
    if (level <= 3) return 'from-green-500 to-emerald-500'
    if (level <= 6) return 'from-blue-500 to-cyan-500'
    if (level <= 9) return 'from-purple-500 to-violet-500'
    return 'from-yellow-500 to-orange-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
          </div>
        </div>
        <UnifiedFooter />
      </div>
    )
  }

  return (
    <TokenValidationWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavbar />
        
        <div className="pt-20 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Your Quiz Dashboard
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Ready to challenge yourself? Choose a category or level to get started!
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Link
                href="/search"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <FaSearch className="w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Search Quizzes</h3>
                <p className="text-orange-100">Find specific quizzes</p>
              </Link>
              
              <Link
                href="/levels"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <FaRocket className="w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Levels</h3>
                <p className="text-blue-100">Progressive challenges</p>
              </Link>
              
              <Link
                href="/rewards"
                className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <FaTrophy className="w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Rewards</h3>
                <p className="text-purple-100">Earn achievements</p>
              </Link>
              
              <Link
                href="/articles"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <FaBook className="w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Articles</h3>
                <p className="text-green-100">Learn & grow</p>
              </Link>
            </div>

            {/* Categories Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h2>
                <Link
                  href="/search"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {homeData.categories?.slice(0, 8).map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category._id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center mb-4">
                      <div className="text-4xl mr-4">
                        {getCategoryIcon(category.name)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {category.subcategories?.length || 0} Subcategories
                        </p>
                      </div>
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      Explore →
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Levels Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Levels</h2>
                <Link
                  href="/levels"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homeData.levels?.slice(0, 6).map((level) => (
                  <Link
                    key={level.level}
                    href={`/level/${level.level}`}
                    className={`bg-gradient-to-r ${getLevelColor(level.level)} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    <div className="flex items-center mb-4">
                      <FaStar className="w-8 h-8 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          Level {level.level}
                        </h3>
                        <p className="text-sm opacity-90">
                          {level.quizCount || 0} Quizzes Available
                        </p>
                      </div>
                    </div>
                    <div className="text-sm opacity-90">
                      {level.level <= 3 && "Beginner Level"}
                      {level.level > 3 && level.level <= 6 && "Intermediate Level"}
                      {level.level > 6 && level.level <= 9 && "Advanced Level"}
                      {level.level > 9 && "Master Level"}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Performers Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Top Performers</h2>
                <Link
                  href="/rewards"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  View Leaderboard
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homeData.topPerformers?.slice(0, 6).map((performer, index) => (
                  <div
                    key={performer._id}
                    className={`bg-gradient-to-r rounded-xl p-6 shadow-lg ${
                      index === 0 ? 'from-yellow-400 to-orange-500' :
                      index === 1 ? 'from-gray-300 to-gray-500' :
                      index === 2 ? 'from-orange-400 to-red-500' :
                      'from-blue-400 to-purple-500'
                    } text-white`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {performer.name || 'Anonymous'}
                        </h3>
                        <p className="text-sm opacity-90">
                          {performer.totalScore || 0} points
                        </p>
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="flex items-center">
                        <FaTrophy className="w-5 h-5 mr-2" />
                        <span className="text-sm">
                          {index === 0 ? '🥇 Champion' :
                           index === 1 ? '🥈 Runner-up' :
                           '🥉 Third Place'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            {homeData.recentQuizzes?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Recent Quizzes</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="space-y-4">
                    {homeData.recentQuizzes.slice(0, 5).map((quiz) => (
                      <div key={quiz._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                          <FaBrain className="w-6 h-6 text-blue-500 mr-4" />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{quiz.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{quiz.category?.name}</p>
                          </div>
                        </div>
                        <Link
                          href={`/attempt-quiz/${quiz._id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Take Quiz
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <UnifiedFooter />
      </div>
    </TokenValidationWrapper>
  )
}

export default HomePage
