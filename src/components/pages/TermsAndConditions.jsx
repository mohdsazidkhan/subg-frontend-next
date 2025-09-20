'use client'

import React from 'react'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavbar />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Terms & Conditions
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                By using <strong className="text-gray-900 dark:text-white">SUBG QUIZ</strong>, you agree to participate fairly and follow all platform rules. You must be at least <strong className="text-gray-900 dark:text-white">14 years old</strong> to register and play.
              </p>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                SUBG QUIZ is a <strong className="text-gray-900 dark:text-white">skill-based quiz platform</strong>. Success depends on your knowledge, accuracy, and speed. All participation is voluntary.
              </p>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We offer 4 subscription plans: Free, Basic, Premium, and Pro — each with access to different quiz levels. Once subscribed, all fees are <strong className="text-gray-900 dark:text-white">non-refundable</strong>, regardless of performance or disqualification.
              </p>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Monthly Rewards System</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Rewards are processed monthly based on Top 3 leaderboard ranks:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong className="text-gray-900 dark:text-white">Monthly:</strong> Top 3 eligible users at (Level 10 and Minimum 110 Quizzes with ≥75% Accuracy) win prizes in 3:2:1 ratio from ₹9,999 total pool</li>
                  <li><strong className="text-gray-900 dark:text-white">Eligibility:</strong> Must reach Level 10 and minimum 110 quizzes ≥75% accuracy in the current month</li>
                  <li><strong className="text-gray-900 dark:text-white">Reset:</strong> Progress and rewards reset every month on the 1st</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  Monthly rewards are based on current month performance only. Each month is independent and previous month achievements do not carry forward.
                </p>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                To qualify for monthly rewards, users must complete at least <strong className="text-gray-900 dark:text-white">(Level 10 and Minimum 110 Quizzes with ≥75% accuracy)</strong> and rank in the Top 3 on the <strong className="text-gray-900 dark:text-white">Level 10</strong> leaderboard by the end of the month. All progress resets monthly.
              </p>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Any attempt to cheat, use automated tools, impersonate others, or manipulate the system will lead to an immediate and permanent ban. We monitor all activity to maintain fairness.
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                We reserve the right to update our terms, quiz rules, leaderboard conditions, subscription pricing, or reward structure at any time without prior notice. By continuing to use SUBG QUIZ, you agree to accept all such updates automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      <UnifiedFooter />
    </div>
  )
}

export default TermsAndConditions
