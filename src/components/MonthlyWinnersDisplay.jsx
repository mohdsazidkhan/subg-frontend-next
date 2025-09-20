import React, { useState, useEffect } from 'react';
import { FaTrophy, FaCrown, FaMedal, FaAward, FaRupeeSign } from 'react-icons/fa';
import API from '../utils/api';

const MonthlyWinnersDisplay = ({ title = "🏆 Previous Month Legends", showTitle = true, className = "" }) => {
  const [monthlyWinners, setMonthlyWinners] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMonthlyWinners();
  }, []);

  const fetchMonthlyWinners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get previous month's winners by default
      const previousMonth = getPreviousMonth();
      const response = await API.getRecentMonthlyWinners(1, previousMonth);
      
      if (response.success && response.data && response.data.length > 0) {
        setMonthlyWinners(response.data[0]);
      } else {
        // If no previous month winners, try to get the most recent winners
        const recentResponse = await API.getRecentMonthlyWinners(1);
        if (recentResponse.success && recentResponse.data.length > 0) {
          setMonthlyWinners(recentResponse.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch monthly winners:', err);
      setError('Failed to load monthly winners');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get previous month in YYYY-MM format
  const getPreviousMonth = () => {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = previousMonth.getFullYear();
    const month = String(previousMonth.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!monthlyWinners) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No monthly winners data available</p>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaCrown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <FaMedal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <FaAward className="w-6 h-6 text-orange-500" />;
      default:
        return <FaTrophy className="w-6 h-6 text-blue-500" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800';
      case 2:
        return 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600';
      case 3:
        return 'from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800';
      default:
        return 'from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      
      <div className="space-y-3">
        {monthlyWinners.winners && monthlyWinners.winners.length > 0 ? (
          monthlyWinners.winners.slice(0, 3).map((winner, index) => (
            <div
              key={winner._id || index}
              className={`bg-gradient-to-r ${getRankColor(index + 1)} rounded-lg p-3 flex items-center justify-between`}
            >
              <div className="flex items-center space-x-3">
                {getRankIcon(index + 1)}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {winner.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Rank #{index + 1}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">
                  {winner.totalScore || 0} pts
                </p>
                {winner.prize && (
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                    <FaRupeeSign className="w-3 h-3 mr-1" />
                    {winner.prize}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            <FaTrophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No winners for this month yet</p>
          </div>
        )}
      </div>
      
      {monthlyWinners.month && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Month: {monthlyWinners.month}</p>
        </div>
      )}
    </div>
  );
};

export default MonthlyWinnersDisplay;
