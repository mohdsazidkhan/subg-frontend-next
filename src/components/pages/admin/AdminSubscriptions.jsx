'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../../lib/api'
import { toast } from 'react-toastify'
import { FaSearch, FaArrowLeft, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import AdminMobileAppWrapper from '@/components/AdminMobileAppWrapper'

const AdminSubscriptions = () => {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchSubscriptions()
  }, [currentPage])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await API.getSubscriptions({ page: currentPage, limit: 10 })
      if (response.success) {
        setSubscriptions(response.data.subscriptions)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      toast.error('Failed to fetch subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        const response = await API.deleteSubscription(subscriptionId)
        if (response.success) {
          toast.success('Subscription deleted successfully')
          fetchSubscriptions()
        }
      } catch (error) {
        console.error('Error deleting subscription:', error)
        toast.error('Failed to delete subscription')
      }
    }
  }

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.plan?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Subscriptions">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="Subscriptions">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                          {subscription.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {subscription.user?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {subscription.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.plan === 'free' ? 'bg-gray-100 text-gray-800' :
                        subscription.plan === 'basic' ? 'bg-green-100 text-green-800' :
                        subscription.plan === 'premium' ? 'bg-blue-100 text-blue-800' :
                        subscription.plan === 'pro' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {subscription.plan || 'free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/subscriptions/${subscription._id}`)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDelete(subscription._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminMobileAppWrapper>
  )
}

export default AdminSubscriptions
