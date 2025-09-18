'use client'

import React, { useState, useEffect } from 'react'
import { FaUsers, FaBrain, FaTrophy, FaDollarSign, FaChartLine, FaUserGraduate, FaQuestionCircle, FaCrown } from 'react-icons/fa'
import UnifiedNavbar from '../../UnifiedNavbar'
import UnifiedFooter from '../../UnifiedFooter'
import TokenValidationWrapper from '../../TokenValidationWrapper'
import AdminRoute from '../../AdminRoute'
import API from '@/lib/api'

const DashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await API.getAdminStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading dashboard...</p>
          </div>
        </div>
        <UnifiedFooter />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FaUsers,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      title: 'Total Quizzes',
      value: stats?.totalQuizzes || 0,
      icon: FaBrain,
      color: 'from-green-500 to-emerald-500',
      change: '+8%'
    },
    {
      title: 'Total Questions',
      value: stats?.totalQuestions || 0,
      icon: FaQuestionCircle,
      color: 'from-purple-500 to-violet-500',
      change: '+15%'
    },
    {
      title: 'Total Categories',
      value: stats?.totalCategories || 0,
      icon: FaCrown,
      color: 'from-yellow-500 to-orange-500',
      change: '+5%'
    },
    {
      title: 'Active Subscriptions',
      value: stats?.activeSubscriptions || 0,
      icon: FaUserGraduate,
      color: 'from-pink-500 to-rose-500',
      change: '+20%'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue || 0}`,
      icon: FaDollarSign,
      color: 'from-indigo-500 to-blue-500',
      change: '+25%'
    }
  ]

  return (
    <TokenValidationWrapper>
      <AdminRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <UnifiedNavbar />
          
          <div className="pt-20 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Admin Dashboard
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Welcome to the admin panel. Here's an overview of your platform.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-r ${stat.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-opacity-90 text-sm font-medium mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold">
                          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </p>
                        <p className="text-white text-opacity-75 text-sm mt-1">
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-full p-3">
                        <stat.icon className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Quick Actions
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="/admin/categories"
                      className="flex items-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                    >
                      <FaCrown className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-4" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Manage Categories</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Add, edit, or delete categories</p>
                      </div>
                    </a>
                    
                    <a
                      href="/admin/quizzes"
                      className="flex items-center p-4 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                    >
                      <FaBrain className="w-6 h-6 text-green-600 dark:text-green-400 mr-4" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Manage Quizzes</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Create and edit quizzes</p>
                      </div>
                    </a>
                    
                    <a
                      href="/admin/students"
                      className="flex items-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                    >
                      <FaUsers className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-4" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Manage Users</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">View and manage user accounts</p>
                      </div>
                    </a>
                    
                    <a
                      href="/admin/analytics/dashboard"
                      className="flex items-center p-4 bg-orange-50 dark:bg-orange-900 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-800 transition-colors"
                    >
                      <FaChartLine className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-4" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Analytics</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">View detailed analytics</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    System Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-900 dark:text-white">API Status</span>
                      </div>
                      <span className="text-green-600 dark:text-green-400 font-semibold">Online</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-900 dark:text-white">Database</span>
                      </div>
                      <span className="text-green-600 dark:text-green-400 font-semibold">Connected</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-900 dark:text-white">Server Load</span>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">Normal</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-900 dark:text-white">Cache</span>
                      </div>
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Warming</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <UnifiedFooter />
        </div>
      </AdminRoute>
    </TokenValidationWrapper>
  )
}

export default DashboardPage
