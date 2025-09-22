'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../../lib/api'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaUsers, FaChartLine, FaTrophy, FaCalendarAlt } from 'react-icons/fa'
import AdminMobileAppWrapper from '@/components/AdminMobileAppWrapper'

const UserAnalytics = () => {
  const router = useRouter()
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    userGrowth: 0,
    userRetention: 0,
    topUsers: [],
    userDistribution: [],
    monthlySignups: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserAnalytics()
  }, [])

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true)
      const response = await API.getUserAnalytics()
      if (response.success) {
        setAnalytics(response.data)
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      toast.error('Failed to fetch user analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminMobileAppWrapper title="User Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="User Analytics">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Analytics</h1>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold">{analytics.totalUsers}</p>
              </div>
              <FaUsers className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">New Users</p>
                <p className="text-3xl font-bold">{analytics.newUsers}</p>
              </div>
              <FaCalendarAlt className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold">{analytics.activeUsers}</p>
              </div>
              <FaChartLine className="text-4xl text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">User Growth</p>
                <p className="text-3xl font-bold">+{analytics.userGrowth}%</p>
              </div>
              <FaTrophy className="text-4xl text-yellow-200" />
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Distribution by Level</h3>
            <div className="space-y-3">
              {analytics.userDistribution?.map((level, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {level.level}
                    </span>
                    <span className="text-gray-900 dark:text-white">Level {level.level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full"
                        style={{ width: `${(level.count / analytics.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{level.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Retention</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {analytics.userRetention}%
              </div>
              <p className="text-gray-600 dark:text-gray-400">Monthly retention rate</p>
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Users</h3>
          <div className="space-y-3">
            {analytics.topUsers?.map((user, index) => (
              <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{user.score} points</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Level {user.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Signups */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Signups</h3>
          <div className="space-y-3">
            {analytics.monthlySignups?.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-900 dark:text-white font-medium">{month.month}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(month.count / Math.max(...analytics.monthlySignups.map(m => m.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{month.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminMobileAppWrapper>
  )
}

export default UserAnalytics
