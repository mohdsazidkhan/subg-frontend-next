'use client'

import React from 'react'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavbar />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Privacy Policy
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                This Privacy Policy explains how <strong className="text-gray-900 dark:text-white">SUBG QUIZ</strong> collects, uses, stores, and protects your information when you use our platform. By using SUBG QUIZ, you agree to the practices described below.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong className="text-gray-900 dark:text-white">Account Information:</strong> name, email, phone number, password (hashed), referral code.</li>
                <li><strong className="text-gray-900 dark:text-white">Profile/Student Data:</strong> level progression, badges, leaderboard placement, high‑score quizzes count, quiz best scores, total quizzes played.</li>
                <li><strong className="text-gray-900 dark:text-white">Quiz Activity:</strong> quiz attempts, scores, timings, and related analytics used to calculate levels, leaderboard ranks, and rewards eligibility.</li>
                <li><strong className="text-gray-900 dark:text-white">Rewards & Wallet:</strong> locked/unlocked/claimed rewards history, claimable balance, and monthly rewards processing status.</li>
                <li><strong className="text-gray-900 dark:text-white">Bank/Withdrawal Details (optional):</strong> if you provide bank information for rewards withdrawal, we store it securely and use it only for payout verification and processing.</li>
                <li><strong className="text-gray-900 dark:text-white">Subscription & Payments:</strong> plan details and payment status handled via secure third‑party processors (e.g., Razorpay). We do not store full card/UPI details.</li>
                <li><strong className="text-gray-900 dark:text-white">Device/Log Data:</strong> IP, browser type, device information, timestamps, and limited logs for security and troubleshooting.</li>
                <li><strong className="text-gray-900 dark:text-white">Support/Contact:</strong> messages you send via forms or email.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>To create and manage your account, authenticate logins, and provide core features.</li>
                <li>To run quizzes, compute scores, determine level progression, and show leaderboard rankings.</li>
                <li>To process rewards, including the <strong className="text-gray-900 dark:text-white">Monthly Rewards System</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong className="text-gray-900 dark:text-white">Monthly:</strong> Top 3 eligible users at (Level 10 and Minimum 110 Quizzes with ≥75% Accuracy) win ₹9,999 each</li>
                    <li><strong className="text-gray-900 dark:text-white">Eligibility:</strong> Must reach Level 10 and minimum 110 quizzes ≥75% accuracy in the current month</li>
                    <li><strong className="text-gray-900 dark:text-white">Reset:</strong> Progress and rewards reset every month on the 1st</li>
                  </ul>
                </li>
                <li>To process subscription payments and manage your plan access.</li>
                <li>To provide customer support and respond to your inquiries.</li>
                <li>To improve our platform, develop new features, and ensure security.</li>
                <li>To comply with legal obligations and protect our rights.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Information Sharing</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong className="text-gray-900 dark:text-white">Public Leaderboards:</strong> Your username, level, and quiz performance may appear on public leaderboards.</li>
                <li><strong className="text-gray-900 dark:text-white">Payment Processors:</strong> We share necessary payment information with secure third-party processors to process your subscriptions.</li>
                <li><strong className="text-gray-900 dark:text-white">Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and users.</li>
                <li><strong className="text-gray-900 dark:text-white">Business Transfers:</strong> In case of merger or acquisition, user data may be transferred as part of business assets.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Data Security</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>We use industry-standard encryption and security measures to protect your data.</li>
                <li>Passwords are hashed and never stored in plain text.</li>
                <li>Financial information is handled by secure third-party payment processors.</li>
                <li>We regularly update our security practices and monitor for potential threats.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>You can access, update, or delete your account information at any time.</li>
                <li>You can opt out of promotional communications while keeping essential service messages.</li>
                <li>You can request a copy of your data or its deletion, subject to legal and business requirements.</li>
                <li>You can contact us with privacy concerns or questions about your data.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We retain your information as long as your account is active or as needed to provide services. Quiz data and leaderboard information may be retained for longer periods to maintain platform integrity and historical records.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">7. Changes to Privacy Policy</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We may update this Privacy Policy from time to time. We will notify users of significant changes via email or platform notifications. Continued use of SUBG QUIZ after changes constitutes acceptance of the updated policy.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">8. Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you have questions about this Privacy Policy or our data practices, please contact us at <strong className="text-gray-900 dark:text-white">subgquiz@gmail.com</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <UnifiedFooter />
    </div>
  )
}

export default PrivacyPolicy
