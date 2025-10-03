import React from 'react';

const MonthlyRewardsInfo = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 ${className}`}>
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm">📋 Monthly Rewards System</h4>
        <div className="space-y-2">
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Monthly:</strong> Top 10 eligible users at Level 10 with 330 high-score quizzes win prizes from ₹10,000 total pool
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Eligibility:</strong> Must reach Level 10 and have 330 high-score quizzes (≥75% accuracy) in {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Reset:</strong> Progress and rewards reset every month on the 1st
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 lg:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">📋 Monthly Rewards System</h3>
      
      <div className="space-y-4">
        <div className="bg-white dark:bg-blue-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🏆 Monthly Prize Pool</h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Top 10 eligible users at Level 10 each month win prizes from <strong>₹10,000 total pool</strong>
          </p>
        </div>

        <div className="bg-white dark:bg-blue-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">✅ Eligibility Requirements</h4>
          <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
            <li>• Reach <strong>Level 10</strong> (330 total quiz attempts)</li>
            <li>• Have <strong>330 high-score quizzes</strong> (≥75% accuracy)</li>
            <li>• Rank in <strong>Top 10</strong> on monthly leaderboard</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-blue-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🔄 Monthly Reset</h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            All progress resets on the 1st of every month. Each month is independent - previous achievements don't carry forward.
          </p>
        </div>

        <div className="bg-white dark:bg-blue-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">💰 Prize Distribution (Top 10)</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded p-2">
              <div className="font-bold text-yellow-800 dark:text-yellow-200">1st</div>
              <div className="text-yellow-600 dark:text-yellow-300">₹2,500</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded p-2">
              <div className="font-bold text-gray-800 dark:text-gray-200">2nd</div>
              <div className="text-gray-600 dark:text-gray-300">₹2,000</div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded p-2">
              <div className="font-bold text-orange-800 dark:text-orange-200">3rd</div>
              <div className="text-orange-600 dark:text-orange-300">₹1,500</div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded p-2">
              <div className="font-bold text-blue-800 dark:text-blue-200">4th</div>
              <div className="text-blue-600 dark:text-blue-300">₹1,200</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 rounded p-2">
              <div className="font-bold text-green-800 dark:text-green-200">5th</div>
              <div className="text-green-600 dark:text-green-300">₹800</div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-2">
              <div className="font-bold text-purple-800 dark:text-purple-200">6th</div>
              <div className="text-purple-600 dark:text-purple-300">₹600</div>
            </div>
            <div className="bg-pink-100 dark:bg-pink-900/30 rounded p-2">
              <div className="font-bold text-pink-800 dark:text-pink-200">7th</div>
              <div className="text-pink-600 dark:text-pink-300">₹500</div>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded p-2">
              <div className="font-bold text-indigo-800 dark:text-indigo-200">8th</div>
              <div className="text-indigo-600 dark:text-indigo-300">₹400</div>
            </div>
            <div className="bg-teal-100 dark:bg-teal-900/30 rounded p-2">
              <div className="font-bold text-teal-800 dark:text-teal-200">9th</div>
              <div className="text-teal-600 dark:text-teal-300">₹350</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 rounded p-2">
              <div className="font-bold text-red-800 dark:text-red-200">10th</div>
              <div className="text-red-600 dark:text-red-300">₹150</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRewardsInfo;