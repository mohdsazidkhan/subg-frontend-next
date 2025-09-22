'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../../lib/api'
import { toast } from 'react-toastify'
import { FaSearch, FaArrowLeft, FaDownload, FaEye } from 'react-icons/fa'
import AdminMobileAppWrapper from '@/components/AdminMobileAppWrapper'

const AdminPaymentTransactions = () => {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0
  })

  useEffect(() => {
    fetchTransactions()
    fetchStats()
  }, [currentPage])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await API.getPaymentTransactions({ page: currentPage, limit: 10 })
      if (response.success) {
        setTransactions(response.data.transactions)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error('Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await API.getPaymentStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const filteredTransactions = transactions.filter(transaction =>
    transaction.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Payment Transactions">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="Payment Transactions">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Transactions</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              ₹{stats.totalRevenue?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Total Revenue</div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {stats.totalTransactions || 0}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Transactions</div>
          </div>
          <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
              {stats.successfulTransactions || 0}
            </div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400">Successful</div>
          </div>
          <div className="bg-red-100 dark:bg-red-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-800 dark:text-red-200">
              {stats.failedTransactions || 0}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">Failed</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                          {transaction.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.user?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-mono">
                        {transaction.orderId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{transaction.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => window.open(`/admin/payment-transactions/${transaction._id}`)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <FaEye />
                      </button>
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

export default AdminPaymentTransactions
