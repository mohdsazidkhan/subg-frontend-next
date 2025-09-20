'use client'

import React from 'react'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavbar />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Refund & Subscription Policy
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Thank you for using <strong className="text-gray-900 dark:text-white">SUBG QUIZ</strong>. Please read this Refund & Subscription Policy carefully. By subscribing or purchasing any plan, you agree to the terms below.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. General Policy</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>All subscription purchases are <strong className="text-gray-900 dark:text-white">final and non‑refundable</strong>.</li>
                <li>Subscriptions provide access to content and features for a fixed duration. Access is not contingent on performance, leaderboard position, or rewards outcomes.</li>
                <li>SUBG QUIZ is a <strong className="text-gray-900 dark:text-white">skill‑based</strong> platform. Fees are charged for access to premium content/features, not for winning rewards.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Subscriptions</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong className="text-gray-900 dark:text-white">Plan Access:</strong> Each plan grants access to specific levels/features as shown on the subscription page.</li>
                <li><strong className="text-gray-900 dark:text-white">Validity:</strong> Plans are prepaid and remain active until their stated expiry date.</li>
                <li><strong className="text-gray-900 dark:text-white">Renewals:</strong> If auto‑renewal is enabled on your account or payment method, the plan may renew automatically at the then‑current price. You can disable renewal any time before the next billing date from your account or payment provider.</li>
                <li><strong className="text-gray-900 dark:text-white">Upgrades:</strong> If supported, upgrades may take effect immediately; the new plan price applies. No pro‑rated refunds for the remaining period of the previous plan.</li>
                <li><strong className="text-gray-900 dark:text-white">Downgrades/Cancellations:</strong> Downgrades or cancellations apply from the next cycle. We do not provide partial/remaining‑period refunds.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Payments & Invoicing</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong className="text-gray-900 dark:text-white">Processors:</strong> Payments are handled securely via trusted third‑party processors (e.g., Razorpay). We do not store full card/UPI details.</li>
                <li><strong className="text-gray-900 dark:text-white">Failed/Declined Payments:</strong> If a payment fails or is declined, access to premium features may be paused until the payment is completed successfully.</li>
                <li><strong className="text-gray-900 dark:text-white">Taxes/Fees:</strong> Prices may be subject to applicable taxes/charges as per law.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Refund Eligibility (Exceptional Cases Only)</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                While plans are non‑refundable, we may review limited cases such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong className="text-gray-900 dark:text-white">Duplicate Charge:</strong> You were charged more than once for the same order.</li>
                <li><strong className="text-gray-900 dark:text-white">Technical Failure:</strong> A verified payment was made but your subscription did not activate and we are unable to provision access within a reasonable time.</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                To request a review, contact us within <strong className="text-gray-900 dark:text-white">7 days</strong> of the transaction with order ID, payment proof, and account details. Approved cases (if any) are refunded to the original payment method within standard banking timelines.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Monthly Rewards & Refunds</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Monthly rewards are <strong className="text-gray-900 dark:text-white">not purchases</strong> and are <strong className="text-gray-900 dark:text-white">not refundable</strong>. They are prizes based on performance, leaderboard position, and eligibility.</li>
                <li>Reward amounts and eligibility criteria may change based on platform performance and user engagement.</li>
                <li>If you are disqualified from rewards due to policy violations, no compensation or refund will be provided.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">6. Account Suspension/Termination</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>If your account is suspended or terminated for policy violations, no refunds will be provided for active subscriptions.</li>
                <li>Access to premium features will be immediately revoked upon suspension/termination.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">7. Contact Information</h2>
              <p className="text-gray-700 dark:text-gray-300">
                For refund requests or subscription-related questions, contact us at <strong className="text-gray-900 dark:text-white">subgquiz@gmail.com</strong> with your account details and transaction information.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">8. Policy Updates</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We reserve the right to update this Refund & Subscription Policy at any time. Changes will be effective immediately upon posting. Continued use of SUBG QUIZ after changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <UnifiedFooter />
    </div>
  )
}

export default RefundPolicy
