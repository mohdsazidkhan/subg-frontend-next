import React, { useState, useEffect } from 'react';
import { FaTrophy, FaGift, FaInfoCircle, FaCalendar, FaUsers, FaClock } from 'react-icons/fa';
import API from '../utils/api';

const MonthlyRewardsInfo = () => {
  const [rewardsInfo, setRewardsInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewardsInfo();
  }, []);

  const fetchRewardsInfo = async () => {
    try {
      setLoading(true);
      const response = await API.request('/api/public/monthly-rewards-info');
      setRewardsInfo(response);
    } catch (error) {
      console.error('Failed to fetch rewards info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = () => {
    if (!rewardsInfo?.nextRewardDate) return null;
    
    const now = new Date();
    const nextReward = new Date(rewardsInfo.nextRewardDate);
    const diff = nextReward - now;
    
    if (diff <= 0) return 'Rewards processing...';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getRewardAmount = (rank) => {
    if (!rewardsInfo?.totalRewardPool) return 0;
    
    const ratios = { 1: 3, 2: 2, 3: 1 };
    const totalRatio = 6; // 3 + 2 + 1
    const rankRatio = ratios[rank] || 0;
    
    return Math.round((rewardsInfo.totalRewardPool * rankRatio) / totalRatio);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <FaTrophy className="mr-3 text-yellow-500" />
          Monthly Rewards
        </h2>
        
        {rewardsInfo?.nextRewardDate && (
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <FaClock className="mr-1" />
              Next rewards in:
            </div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {getTimeRemaining()}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 1st Place */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
          <div className="text-center">
            <div className="text-3xl mb-2">🥇</div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">1st Place</h3>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              ₹{getRewardAmount(1)}
            </div>
          </div>
        </div>

        {/* 2nd Place */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="text-center">
            <div className="text-3xl mb-2">🥈</div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">2nd Place</h3>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ₹{getRewardAmount(2)}
            </div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
          <div className="text-center">
            <div className="text-3xl mb-2">🥉</div>
            <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">3rd Place</h3>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              ₹{getRewardAmount(3)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <FaInfoCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-2">How to qualify for monthly rewards:</p>
            <ul className="space-y-1 text-xs">
              <li>• Reach Level 10 or higher</li>
              <li>• Complete minimum 110 quizzes with ≥75% accuracy</li>
              <li>• Rank in Top 3 on the Level 10 leaderboard</li>
              <li>• Rewards reset every month on the 1st</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
            <FaUsers className="mr-2" />
            Total Pool
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{rewardsInfo?.totalRewardPool || 9999}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
            <FaCalendar className="mr-2" />
            Next Rewards
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {rewardsInfo?.nextRewardDate ? new Date(rewardsInfo.nextRewardDate).toLocaleDateString() : 'TBD'}
          </div>
        </div>
      </div>

      {rewardsInfo?.currentMonthStats && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <FaGift className="mr-2 text-green-500" />
            Current Month Stats
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {rewardsInfo.currentMonthStats.eligibleUsers || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Eligible Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {rewardsInfo.currentMonthStats.totalQuizzes || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Quizzes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {rewardsInfo.currentMonthStats.averageAccuracy || 0}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Accuracy</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyRewardsInfo;