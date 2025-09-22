'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaCheckCircle, FaArrowRight, FaHome } from 'react-icons/fa'
import MobileAppWrapper from '@/components/MobileAppWrapper'

import UnifiedNavbar from '../UnifiedNavbar';
import UnifiedFooter from '../UnifiedFooter';

const PayuSuccess = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    
    if (paymentId && status === 'success') {
      verifyPayment(paymentId)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const verifyPayment = async (paymentId) => {
    try {
      setLoading(true)
      const response = await API.verifyPayment(paymentId)
      if (response.success) {
        setPaymentDetails(response.data)
        toast.success('Payment successful! Your subscription has been activated.')
      } else {
        toast.error('Payment verification failed')
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      toast.error('Failed to verify payment')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <MobileAppWrapper title="Payment Processing">
        <div className="flex items-center justify-center h-64">
        {/* Desktop Header */}
        <UnifiedNavbar />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
            {/* Desktop Footer */}
      <UnifiedFooter />
    </MobileAppWrapper>
    )
  }

  return (
    <MobileAppWrapper title="Payment Success">
      <div className="p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <FaCheckCircle className="text-4xl text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your payment. Your subscription has been activated successfully.
          </p>

          {paymentDetails && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Payment Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {paymentDetails.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    ₹{paymentDetails.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {paymentDetails.plan?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {paymentDetails.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => router.push('/profile')}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <span>View Profile</span>
              <FaArrowRight />
            </button>
            
            <button
              onClick={() => router.push('/home')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <FaHome />
              <span>Go to Home</span>
            </button>
          </div>
        </div>
      </div>
    </MobileAppWrapper>
  )
}

export default PayuSuccess
