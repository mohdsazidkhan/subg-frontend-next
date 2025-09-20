'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaTrophy, FaCrown, FaStar, FaMedal, FaRocket, FaBrain, FaChartLine, FaArrowLeft, FaAward, FaGem, FaUserGraduate, FaMagic } from 'react-icons/fa'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'
import TokenValidationWrapper from '../TokenValidationWrapper'
import StudentRoute from '../StudentRoute'
import API from '@/lib/api'

// Level badge icon mapping
const levelBadgeIcons = {
  'Starter': FaUserGraduate,
  'Rookie': FaStar,
  'Explorer': FaRocket,
  'Thinker': FaBrain,
  'Strategist': FaChartLine,
  'Achiever': FaAward,
  'Mastermind': FaGem,
  'Champion': FaTrophy,
  'Prodigy': FaMedal,
  'Wizard': FaMagic,
  'Legend': FaCrown,
  Default: FaStar,
}

// Fallback levels data if API fails
const fallbackLevels = [
  { _id: 0, levelName: 'Starter', quizzesRequired: 0, quizCount: 0, description: 'Starting point for all users' },
  { _id: 1, levelName: 'Rookie', quizzesRequired: 2, quizCount: 0, description: 'Begin your quiz journey' },
  { _id: 2, levelName: 'Explorer', quizzesRequired: 6, quizCount: 0, description: 'Discover new challenges' },
  { _id: 3, levelName: 'Thinker', quizzesRequired: 12, quizCount: 0, description: 'Develop critical thinking' },
  { _id: 4, levelName: 'Strategist', quizzesRequired: 20, quizCount: 0, description: 'Master quiz strategies' },
  { _id: 5, levelName: 'Achiever', quizzesRequired: 30, quizCount: 0, description: 'Reach new heights' },
  { _id: 6, levelName: 'Mastermind', quizzesRequired: 42, quizCount: 0, description: 'Become a quiz expert' },
  { _id: 7, levelName: 'Champion', quizzesRequired: 56, quizCount: 0, description: 'Compete with the best' },
  { _id: 8, levelName: 'Prodigy', quizzesRequired: 72, quizCount: 0, description: 'Show exceptional talent' },
  { _id: 9, levelName: 'Wizard', quizzesRequired: 90, quizCount: 0, description: 'Master of all quizzes' },
  { _id: 10, levelName: 'Legend', quizzesRequired: 110, quizCount: 0, description: 'Achieve legendary status' }
]

const LevelsPage = () => {
  const router = useRouter()
  const [userLevelData, setUserLevelData] = useState(null)
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [profileRes, levelsRes] = await Promise.all([
          API.getProfile().catch(() => null),
          API.getAllLevels().catch(() => fallbackLevels)
        ])

        if (profileRes) {
          setUserLevelData(profileRes)
        }
        setLevels(levelsRes || fallbackLevels)
      } catch (err) {
        console.error('Error fetching levels data:', err)
        setError('Failed to load levels data')
        setLevels(fallbackLevels)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getLevelIcon = (levelName) => {
    const IconComponent = levelBadgeIcons[levelName] || levelBadgeIcons.Default
    return <IconComponent className="w-6 h-6" />
  }

  const getLevelColor = (level) => {
    if (level <= 3) return 'from-green-500 to-emerald-500'
    if (level <= 6) return 'from-blue-500 to-cyan-500'
    if (level <= 9) return 'from-purple-500 to-violet-500'
    return 'from-yellow-500 to-orange-500'
  }

  const isLevelUnlocked = (level) => {
    if (!userLevelData) return level === 0
    return level <= userLevelData.currentLevel
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading levels...</p>
          </div>
        </div>
        <UnifiedFooter />
      </div>
    )
  }

  return (
    <TokenValidationWrapper>
      <StudentRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <UnifiedNavbar />
          
          <div className="pt-20 pb-8 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <button
                  onClick={() => router.push('/home')}
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Home
                </button>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Quiz Levels
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Progress through different difficulty levels and unlock new challenges
                </p>
              </div>

              {/* User Progress */}
              {userLevelData && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Progress</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {userLevelData.currentLevel || 0}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">Current Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {userLevelData.totalQuizzesPlayed || 0}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">Quizzes Played</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {userLevelData.accuracy || 0}%
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">Accuracy</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Levels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {levels.map((level) => {
                  const isUnlocked = isLevelUnlocked(level._id)
                  const isCurrentLevel = userLevelData && level._id === userLevelData.currentLevel
                  
                  return (
                    <div
                      key={level._id}
                      className={`relative rounded-xl p-6 shadow-lg transition-all duration-300 transform hover:scale-105 ${
                        isUnlocked
                          ? `bg-gradient-to-r ${getLevelColor(level._id)} text-white cursor-pointer`
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      } ${isCurrentLevel ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}`}
                      onClick={() => {
                        if (isUnlocked) {
                          router.push(`/level/${level._id}`)
                        }
                      }}
                    >
                      {/* Current Level Badge */}
                      {isCurrentLevel && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                          Current
                        </div>
                      )}

                      {/* Level Icon */}
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                          isUnlocked ? 'bg-white bg-opacity-20' : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          {getLevelIcon(level.levelName)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">
                            Level {level._id}
                          </h3>
                          <p className="text-sm opacity-90">
                            {level.levelName}
                          </p>
                        </div>
                      </div>

                      {/* Level Description */}
                      <p className="text-sm opacity-90 mb-4">
                        {level.description}
                      </p>

                      {/* Level Stats */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Quizzes Required:</span>
                          <span className="font-bold">{level.quizzesRequired || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Available:</span>
                          <span className="font-bold">{level.quizCount || 0}</span>
                        </div>
                      </div>

                      {/* Lock Icon for Unlocked Levels */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-xl">
                          <FaStar className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Rewards Info */}
              <div className="mt-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Monthly Rewards</h2>
                <p className="mb-4">
                  Reach Level 10 and play at least 110 quizzes with ≥75% accuracy to be eligible for monthly rewards!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">1st</div>
                    <div className="text-lg">₹4,999</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">2nd</div>
                    <div className="text-lg">₹3,333</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">3rd</div>
                    <div className="text-lg">₹1,667</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <UnifiedFooter />
        </div>
      </StudentRoute>
    </TokenValidationWrapper>
  )
}

export default LevelsPage
