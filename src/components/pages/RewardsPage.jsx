'use client'

import React from 'react';
import RewardsDashboard from '../RewardsDashboard';
import { useRewards } from '../../hooks/useRewards';
import MobileAppWrapper from '../MobileAppWrapper';

const RewardsPage = () => {
  const { rewards, loading, error } = useRewards();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading rewards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl lg:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Rewards</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <MobileAppWrapper title="Rewards">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <RewardsDashboard rewards={rewards} />
      </div>
    </MobileAppWrapper>
  );
};

export default RewardsPage;