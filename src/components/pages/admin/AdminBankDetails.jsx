'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaSearch, FaArrowLeft, FaTrash, FaEdit } from 'react-icons/fa'
import AdminMobileAppWrapper from '@/components/AdminMobileAppWrapper'

const AdminBankDetails = () => {
  const router = useRouter()
  const [bankDetails, setBankDetails] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBankDetails()
  }, [])

  const fetchBankDetails = async () => {
    try {
      setLoading(true)
      const response = await API.getBankDetails()
      if (response.success) {
        setBankDetails(response.data)
      }
    } catch (error) {
      console.error('Error fetching bank details:', error)
      toast.error('Failed to fetch bank details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (bankDetailId) => {
    if (window.confirm('Are you sure you want to delete this bank detail?')) {
      try {
        const response = await API.deleteBankDetail(bankDetailId)
        if (response.success) {
          toast.success('Bank detail deleted successfully')
          fetchBankDetails()
        }
      } catch (error) {
        console.error('Error deleting bank detail:', error)
        toast.error('Failed to delete bank detail')
      }
    }
  }

  const filteredBankDetails = bankDetails.filter(bankDetail =>
    bankDetail.accountHolderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bankDetail.bankName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bankDetail.accountNumber?.includes(searchTerm)
  )

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Bank Details">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="Bank Details">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bank Details</h1>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bank details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Bank Details List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBankDetails.map((bankDetail) => (
            <div
              key={bankDetail._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  🏦
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(bankDetail._id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                    title="Delete Bank Detail"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {bankDetail.accountHolderName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Account Holder
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {bankDetail.accountNumber}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Account Number
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {bankDetail.bankName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bank Name
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {bankDetail.ifscCode}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    IFSC Code
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {bankDetail.branchName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Branch Name
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Added: {new Date(bankDetail.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredBankDetails.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏦</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No bank details found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'No bank details have been submitted yet'}
            </p>
          </div>
        )}
      </div>
    </AdminMobileAppWrapper>
  )
}

export default AdminBankDetails
