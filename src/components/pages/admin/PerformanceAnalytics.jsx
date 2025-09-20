'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaTachometerAlt, FaClock, FaServer, FaChartLine } from 'react-icons/fa'
import AdminMobileAppWrapper from '@/components/AdminMobileAppWrapper'

const PerformanceAnalytics = () => {
  const router = useRouter()
  const [analytics, setAnalytics] = useState({
    averageResponseTime: 0,
    uptime: 0,
    errorRate: 0,
    totalRequests: 0,
    peakConcurrentUsers: 0,
    serverLoad: 0,
    databasePerformance: 0,
    apiEndpoints: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceAnalytics()
  }, [])

  const fetchPerformanceAnalytics = async () => {
    try {
      setLoading(true)
      const response = await API.getPerformanceAnalytics()
      if (response.success) {
        setAnalytics(response.data)
      }
    } catch (error) {
      console.error('Error fetching performance analytics:', error)
      toast.error('Failed to fetch performance analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Performance Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="Performance Analytics">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Response Time</p>
                <p className="text-3xl font-bold">{analytics.averageResponseTime}ms</p>
              </div>
              <FaClock className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Uptime</p>
                <p className="text-3xl font-bold">{analytics.uptime}%</p>
              </div>
              <FaServer className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Error Rate</p>
                <p className="text-3xl font-bold">{analytics.errorRate}%</p>
              </div>
              <FaTachometerAlt className="text-4xl text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Requests</p>
                <p className="text-3xl font-bold">{analytics.totalRequests?.toLocaleString()}</p>
              </div>
              <FaChartLine className="text-4xl text-purple-200" />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Peak Concurrent Users</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {analytics.peakConcurrentUsers}
              </div>
              <p className="text-gray-600 dark:text-gray-400">Users online simultaneously</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Server Load</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {analytics.serverLoad}%
              </div>
              <p className="text-gray-600 dark:text-gray-400">Current server utilization</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Database Performance</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {analytics.databasePerformance}ms
              </div>
              <p className="text-gray-600 dark:text-gray-400">Average query time</p>
            </div>
          </div>
        </div>

        {/* API Endpoints Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Endpoints Performance</h3>
          <div className="space-y-3">
            {analytics.apiEndpoints?.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">{endpoint.method} {endpoint.path}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{endpoint.requests} requests</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{endpoint.avgResponseTime}ms</p>
                  <p className={`text-sm ${
                    endpoint.errorRate > 5 ? 'text-red-600 dark:text-red-400' :
                    endpoint.errorRate > 2 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {endpoint.errorRate}% errors
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminMobileAppWrapper>
  )
}

export default PerformanceAnalytics
