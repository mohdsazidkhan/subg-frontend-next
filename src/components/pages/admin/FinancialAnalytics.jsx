'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../../lib/api'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaMoneyBillWave, FaChartLine, FaCreditCard, FaRupeeSign } from 'react-icons/fa'
import AdminMobileAppWrapper from '@/components/AdminMobileAppWrapper'

const FinancialAnalytics = () => {
  const router = useRouter()
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    subscriptionRevenue: 0,
    totalTransactions: 0,
    revenueGrowth: 0,
    topPlans: [],
    monthlyRevenueData: [],
    paymentMethods: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFinancialAnalytics()
  }, [])

  const fetchFinancialAnalytics = async () => {
    try {
      setLoading(true)
      const response = await API.getFinancialAnalytics()
      if (response.success) {
        setAnalytics(response.data)
      }
    } catch (error) {
      console.error('Error fetching financial analytics:', error)
      toast.error('Failed to fetch financial analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Financial Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="Financial Analytics">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Analytics</h1>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">₹{analytics.totalRevenue?.toLocaleString()}</p>
              </div>
              <FaMoneyBillWave className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Monthly Revenue</p>
                <p className="text-3xl font-bold">₹{analytics.monthlyRevenue?.toLocaleString()}</p>
              </div>
              <FaChartLine className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Subscription Revenue</p>
                <p className="text-3xl font-bold">₹{analytics.subscriptionRevenue?.toLocaleString()}</p>
              </div>
              <FaCreditCard className="text-4xl text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Total Transactions</p>
                <p className="text-3xl font-bold">{analytics.totalTransactions}</p>
              </div>
              <FaRupeeSign className="text-4xl text-yellow-200" />
            </div>
          </div>
        </div>

        {/* Revenue Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Growth</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              +{analytics.revenueGrowth}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">Compared to last month</p>
          </div>
        </div>

        {/* Top Plans */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Subscription Plans</h3>
          <div className="space-y-3">
            {analytics.topPlans?.map((plan, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium capitalize">{plan.plan}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{plan.subscribers} subscribers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">₹{plan.revenue?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{plan.percentage}% of total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue Trend</h3>
            <div className="space-y-3">
              {analytics.monthlyRevenueData?.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-900 dark:text-white font-medium">{month.month}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${(month.revenue / Math.max(...analytics.monthlyRevenueData.map(m => m.revenue))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">₹{month.revenue?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {analytics.paymentMethods?.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {method.method.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-gray-900 dark:text-white capitalize">{method.method}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{method.count}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{method.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminMobileAppWrapper>
  )
}

export default FinancialAnalytics
