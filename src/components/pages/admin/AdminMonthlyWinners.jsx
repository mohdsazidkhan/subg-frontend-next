'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaSearch, FaArrowLeft, FaTrophy, FaCrown, FaMedal } from 'react-icons/fa'
import AdminMobileAppWrapper from '@/components/AdminMobileAppWrapper'

const AdminMonthlyWinners = () => {
  const router = useRouter()
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchWinners()
  }, [])

  const fetchWinners = async () => {
    try {
      setLoading(true)
      const response = await API.getMonthlyWinners()
      if (response.success) {
        setWinners(response.data)
      }
    } catch (error) {
      console.error('Error fetching winners:', error)
      toast.error('Failed to fetch monthly winners')
    } finally {
      setLoading(false)
    }
  }

  const filteredWinners = winners.filter(winner =>
    winner.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    winner.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    winner.month?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Monthly Winners">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="Monthly Winners">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Winners</h1>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search winners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Winners List */}
        <div className="space-y-4">
          {filteredWinners.map((winner, index) => (
            <div
              key={winner._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                    'bg-gradient-to-r from-orange-400 to-orange-600'
                  }`}>
                    {index === 0 ? <FaCrown /> : index === 1 ? <FaMedal /> : <FaTrophy />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {winner.user?.name || 'Unknown'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{winner.user?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    ₹{winner.prizeAmount?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {winner.month} {winner.year}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {winner.rank}
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">Rank</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {winner.accuracy}%
                  </div>
                  <div className="text-sm text-green-800 dark:text-green-200">Accuracy</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {winner.quizzesCompleted}
                  </div>
                  <div className="text-sm text-purple-800 dark:text-purple-200">Quizzes</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Won on: {new Date(winner.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {filteredWinners.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏆</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No monthly winners found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'No winners have been recorded yet'}
            </p>
          </div>
        )}
      </div>
    </AdminMobileAppWrapper>
  )
}

export default AdminMonthlyWinners
