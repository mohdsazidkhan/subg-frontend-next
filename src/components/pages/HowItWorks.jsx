'use client'

import React from 'react'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavbar />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How It Works
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <ol className="space-y-8 text-lg leading-relaxed">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">1</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Register / Login: </strong>
                  <span className="text-gray-700 dark:text-gray-300">
                    Sign up using your mobile number or email to create your SUBG QUIZ account.
                  </span>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">2</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Choose Subscription & Access Levels: </strong>
                  <span className="text-gray-700 dark:text-gray-300">
                    Access quizzes based on your subscription:
                  </span>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-base text-gray-600 dark:text-gray-400">
                    <li>Free Plan – Levels 0 to 3</li>
                    <li>Basic Plan – Levels 0 to 6</li>
                    <li>Premium Plan – Levels 0 to 9</li>
                    <li>Pro Plan – All Levels (0 to 10)</li>
                  </ul>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">3</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Play Timed Quizzes: </strong>
                  <span className="text-gray-700 dark:text-gray-300">
                    Participate in daily multiple-choice quizzes. Each quiz is skill-based and carefully curated.
                  </span>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">4</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Track Progress: </strong>
                  <span className="text-gray-700 dark:text-gray-300">
                    View your quiz performance, accuracy stats, and level advancement in your dashboard.
                  </span>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">5</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Monthly Rewards System: </strong>
                  <span className="text-gray-700 dark:text-gray-300">
                    Every month, rewards are given to the <strong>Top 3 eligible users</strong> who meet these criteria:
                  </span>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-base text-gray-600 dark:text-gray-400">
                    <li>Reached Level 10</li>
                    <li>Played at least 110 quizzes</li>
                    <li>Maintained an accuracy of ≥75%</li>
                  </ul>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    <strong>Ranking is based on:</strong> 1) High-scoring quizzes, 2) Accuracy, 3) Total score, 4) Total quizzes played.
                    In case of a tie, these same metrics are used again in order as tie-breakers.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">6</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Result & Prize Distribution: </strong>
                  <span className="text-gray-700 dark:text-gray-300">
                    Results are declared on the <strong>last day of every month after 9:00 PM</strong>. The Top 3 winners receive their rewards within <strong>7 days</strong>.
                  </span>
                </div>
              </li>
            </ol>

            <div className="mt-8 p-6 bg-orange-50 dark:bg-orange-900 rounded-lg border-l-4 border-orange-400">
              <p className="text-orange-800 dark:text-orange-200 font-semibold">
                Note: SUBG QUIZ is a 100% skill-based platform. There is no gambling or betting involved. Rewards are purely based on consistent knowledge, accuracy, and performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <UnifiedFooter />
    </div>
  )
}

export default HowItWorks
