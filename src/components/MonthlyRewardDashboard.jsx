import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaCrown, FaStar, FaUsers, FaChartLine } from 'react-icons/fa';
import API from '../lib/api';
import { useTokenValidation } from '../hooks/useTokenValidation';

const MonthlyRewardDashboard = () => {
  const [rewardInfo, setRewardInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { checkAuthStatus } = useTokenValidation();

  useEffect(() => {
    const fetchRewardInfo = async () => {
      try {
        if (!(await checkAuthStatus())) {
          setError('Please log in to view reward information');
          setLoading(false);
          return;
        }

        const result = await API.getMonthlyRewardInfo();
        if (result.success) {
          setRewardInfo(result.data);
        } else {
          setError('Failed to fetch reward information');
        }
      } catch (err) {
        console.error('Error fetching reward info:', err);
        setError(err.message || 'Failed to fetch reward information');
      } finally {
        setLoading(false);
      }
    };

    fetchRewardInfo();
  }, [checkAuthStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!rewardInfo) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <p className="text-gray-600 dark:text-gray-400">No reward information available</p>
      </div>
    );
  }

  const { eligibility, currentRankings, rewardDistribution, totalPrizePool } = rewardInfo;

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FaCrown className="text-yellow-500" />;
      case 2: return <FaMedal className="text-gray-400" />;
      case 3: return <FaMedal className="text-orange-500" />;
      default: return <FaStar className="text-blue-500" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
      case 2: return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
      case 3: return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
      default: return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Eligibility Status */}
      <div className={`rounded-lg p-6 border-2 ${eligibility.isEligible 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <FaTrophy className={`text-2xl ${eligibility.isEligible ? 'text-green-600' : 'text-yellow-600'}`} />
          <h2 className="text-xl font-bold">
            {eligibility.isEligible ? 'You are eligible for monthly rewards!' : 'Work towards eligibility'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Current Level:</span>
              <span className={`font-bold ${eligibility.currentLevel >= 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                {eligibility.currentLevel}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">High-Score Quizzes:</span>
              <span className={`font-bold ${eligibility.highScoreQuizzes >= 330 ? 'text-green-600' : 'text-yellow-600'}`}>
                {eligibility.highScoreQuizzes}/330
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Required Level:</span>
              <span className="font-bold text-gray-600">10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Required High-Score Quizzes:</span>
              <span className="font-bold text-gray-600">330</span>
            </div>
          </div>
        </div>

        {eligibility.userRank && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-blue-800 dark:text-blue-300 font-medium">
              🎉 You are currently ranked #{eligibility.userRank} in the monthly leaderboard!
            </p>
          </div>
        )}
      </div>

      {/* Current Rankings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaUsers className="text-2xl text-blue-600" />
          <h2 className="text-xl font-bold">Current Top 10 Rankings</h2>
        </div>

        {currentRankings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No eligible users found yet. Be the first to reach Level 10 with 330+ high-score quizzes!
          </p>
        ) : (
          <div className="space-y-3">
            {currentRankings.map((user, index) => (
              <div key={user.rank} className={`flex items-center justify-between p-4 rounded-lg border ${getRankColor(user.rank)}`}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(user.rank)}
                    <span className="font-bold text-lg">#{user.rank}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Avg: {user.averageScore}%</span>
                      <span>Accuracy: {user.accuracy}%</span>
                      <span>Quizzes: {user.quizzesPlayed}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-green-600">
                    ₹{user.potentialReward}
                  </div>
                  <div className="text-sm text-gray-500">
                    Potential Reward
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prize Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaChartLine className="text-2xl text-green-600" />
          <h2 className="text-xl font-bold">Prize Distribution</h2>
          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
            Total: ₹{totalPrizePool}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {rewardDistribution.map((reward, index) => (
            <div key={reward.rank} className={`p-3 rounded-lg border text-center ${getRankColor(reward.rank)}`}>
              <div className="flex items-center justify-center gap-1 mb-1">
                {getRankIcon(reward.rank)}
                <span className="font-bold text-sm">#{reward.rank}</span>
              </div>
              <div className="font-bold text-lg text-green-600">
                ₹{reward.amount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {reward.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ranking Criteria */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
          📊 Ranking Criteria (in order)
        </h3>
        <div className="space-y-2 text-blue-700 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <span className="font-bold">1.</span>
            <span>Highest Average Quiz Score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">2.</span>
            <span>Highest Accuracy (correct/total)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">3.</span>
            <span>Total Score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">4.</span>
            <span>Total Quizzes Played</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRewardDashboard;
