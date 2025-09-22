'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalError } from '../contexts/GlobalErrorContext';
import { useTokenValidation } from '../hooks/useTokenValidation';
import API from '../lib/api'
import ResponsiveTable from '../components/ResponsiveTable';
import { FaTrophy, FaCrown, FaMedal } from 'react-icons/fa';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('table');
  const { handleError } = useGlobalError();
  const { isValidating } = useTokenValidation();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await API.request('/api/public/leaderboard');
      setLeaderboard(response);
    } catch (error) {
      handleError(error, 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'rank',
      label: 'Rank',
      render: (value, row, index) => {
        const rank = index + 1;
        if (rank === 1) return <FaCrown className="text-yellow-500 text-xl" />;
        if (rank === 2) return <FaMedal className="text-gray-400 text-xl" />;
        if (rank === 3) return <FaTrophy className="text-orange-600 text-xl" />;
        return <span className="font-semibold">#{rank}</span>;
      }
    },
    {
      key: 'username',
      label: 'Username',
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {value}
        </span>
      )
    },
    {
      key: 'score',
      label: 'Score',
      render: (value) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          {value}
        </span>
      )
    },
    {
      key: 'level',
      label: 'Level',
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
          {value}
        </span>
      )
    }
  ];

  const tableActions = [];

  if (loading || isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaTrophy className="mr-3 text-yellow-500" />
              Leaderboard
            </h1>
          </div>

          <ResponsiveTable
            data={leaderboard}
            columns={columns}
            actions={tableActions}
            currentView={currentView}
            onViewChange={setCurrentView}
            loading={loading}
            emptyMessage="No leaderboard data available"
            className="min-h-[400px]"
          />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
