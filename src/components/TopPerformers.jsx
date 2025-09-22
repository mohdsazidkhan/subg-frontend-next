import React, { useState, useEffect, useCallback } from 'react';
import { FaTable, FaList, FaTh } from 'react-icons/fa';
import Link from 'next/link';
import { useGlobalError } from '../contexts/GlobalErrorContext';
import { useTokenValidation } from '../hooks/useTokenValidation';
import API from '../lib/api';

const TopPerformers = () => {
  const [viewMode, setViewMode] = useState("table"); // Default fallback
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Global error context
  const { checkRateLimitError } = useGlobalError();
  
  // Token validation
  const { checkAuthStatus } = useTokenValidation();

  // Check if user is logged in and get current user info - use client-side state to avoid hydration mismatch
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag and check login status
    setIsClient(true);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setCurrentUserId(parsed._id || null);
      } catch (e) {
        setCurrentUserId(null);
      }
    }
    
    // Set view mode based on screen size
    setViewMode(window.innerWidth < 768 ? "list" : "table");
  }, []);

  const fetchTopPerformers = useCallback(async (isRefresh = false) => {
    // Only fetch if we're on the client side
    if (!isClient) return;
    
    // Validate token before making API call
    if (!(await checkAuthStatus())) {
      return;
    }
    
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Use centralized API service instead of direct fetch
      const result = await API.getPublicTopPerformersMonthly(10, currentUserId);
      
      if (result.success) {
        const month = result?.data?.month;
        const top = Array.isArray(result?.data?.top) ? result.data.top : [];
        // Transform to legacy shape expected by UI
        const transformed = top.map((u) => ({
          userId: u.userId,
          name: u.name,
          position: u.rank,
          isCurrentUser: u.userId === currentUserId,
          profilePicture: u.profilePicture,
          subscriptionName: u.subscriptionName,
          level: {
            currentLevel: u.monthly?.currentLevel || 0,
            levelName: u.monthly?.currentLevel === 10 ? 'Legend' : getLevelName(u.monthly?.currentLevel || 0),
            highScoreQuizzes: u.monthly?.highScoreWins || 0,
            quizzesPlayed: u.monthly?.totalQuizAttempts || 0,
            accuracy: u.monthly?.accuracy || 0,
            averageScore: u.monthly?.accuracy || 0
          }
        }));
        const surroundingUsers = Array.isArray(result?.data?.surroundingUsers) ? result.data.surroundingUsers : [];
        const currentUser = result?.data?.currentUser;
        
        // Transform surrounding users to match expected format
        const transformedSurroundingUsers = surroundingUsers.map((u) => ({
          userId: u.userId,
          name: u.name,
          position: u.position,
          isCurrentUser: u.isCurrentUser,
          subscriptionName: u.subscriptionName,
          level: {
            currentLevel: u.level?.currentLevel || 0,
            levelName: u.level?.levelName || getLevelName(u.level?.currentLevel || 0),
            highScoreQuizzes: u.level?.highScoreQuizzes || 0,
            quizzesPlayed: u.level?.quizzesPlayed || 0,
            accuracy: u.level?.accuracy || 0,
            averageScore: u.level?.averageScore || 0
          }
        }));

        setData({ 
          month, 
          topPerformers: transformed, 
          surroundingUsers: transformedSurroundingUsers, 
          currentUser: currentUser ? {
            userId: currentUser.userId,
            name: currentUser.name,
            position: currentUser.position,
            isCurrentUser: true,
            subscriptionName: currentUser.subscriptionName,
            level: {
              currentLevel: currentUser.level?.currentLevel || 0,
              levelName: currentUser.level?.levelName || getLevelName(currentUser.level?.currentLevel || 0),
              highScoreQuizzes: currentUser.level?.highScoreQuizzes || 0,
              quizzesPlayed: currentUser.level?.quizzesPlayed || 0,
              accuracy: currentUser.level?.accuracy || 0,
              averageScore: currentUser.level?.accuracy || 0
            }
          } : null,
          total: result.data.total || transformed.length 
        });
      } else {
        // Check if it's a rate limit error first
        const errorMessage = result.message || result.error || "Failed to load top performers. Please try again.";
        
        if (checkRateLimitError(errorMessage)) {
          // Rate limit error is handled globally, just set local error
          setError("Rate limit reached. Please wait or login for higher limits.");
        } else {
          // Show other backend errors
          setError(`Backend Error: ${errorMessage}`);
        }
      }
    } catch (err) {
      console.error("API Error:", err);
      
      // Check if it's a rate limit error first
      if (err.message && checkRateLimitError(err.message)) {
        // Rate limit error is handled globally, just set local error
        setError("Rate limit reached. Please wait or login for higher limits.");
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("Network Error: Unable to connect to server. Please check if the backend is running.");
      } else if (err.response?.status === 404) {
        setError("API endpoint not found. The backend server may not be running or the endpoint is not available.");
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError("Failed to load top performers. Please try again.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId, checkRateLimitError, checkAuthStatus]);

  // Helper function to get level names
  const getLevelName = (level) => {
    const levelNames = {
      0: 'Starter', 1: 'Rookie', 2: 'Explorer', 3: 'Thinker', 4: 'Strategist', 5: 'Achiever',
      6: 'Mastermind', 7: 'Champion', 8: 'Prodigy', 9: 'Wizard', 10: 'Legend'
    };
    return levelNames[level] || 'Unknown';
  };

  useEffect(() => {
    if (isClient) {
      fetchTopPerformers();
      
      // Auto-refresh every 5 minutes to keep data current
      const interval = setInterval(() => {
        fetchTopPerformers();
      }, 5 * 60 * 1000); // 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [isClient, fetchTopPerformers, checkRateLimitError]);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        if (isMobile && viewMode === "table") {
          setViewMode("list");
        } else if (!isMobile && viewMode === "list") {
          setViewMode("table");
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [viewMode]);

  const getSortedTopPerformers = () => {
    if (!data?.topPerformers) return [];
    const performers = [...data.topPerformers];
    return performers.sort((a, b) => {
      // Use the transformed data structure (level properties contain monthly data)
      const aHighScore = a.level?.highScoreQuizzes || 0;
      const bHighScore = b.level?.highScoreQuizzes || 0;
      const aAccuracy = a.level?.accuracy || 0;
      const bAccuracy = b.level?.accuracy || 0;
      const aTotalQuizzes = a.level?.quizzesPlayed || 0;
      const bTotalQuizzes = b.level?.quizzesPlayed || 0;
      
      // First priority: High Score Wins (descending) - same as Performance Analytics
      if (aHighScore !== bHighScore) {
        return bHighScore - aHighScore;
      }
      
      // Second priority: Accuracy (descending) - same as Performance Analytics
      if (aAccuracy !== bAccuracy) {
        return bAccuracy - aAccuracy;
      }
      
      // Third priority: Total quizzes played (descending) - same as Performance Analytics
      return bTotalQuizzes - aTotalQuizzes;
    });
  };

  const getCurrentMonthDisplay = () => {
    if (data?.month) {
      const [year, month] = data.month.split('-');
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    
    // Fallback to current month if no data available
    const now = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  };

  // Logged-out state UI
  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border p-3 lg:p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">🏆 Top Performers</h3>
        </div>
        <div className="text-center py-10">
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">Login to View Your Rank</p>
          <Link
            href="/login"
            className="inline-flex bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-semibold py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-xs sm:text-sm md:text-base"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading {getCurrentMonthDisplay()} leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="text-red-500 dark:text-red-400 text-lg mb-4">
            ⚠️ {error}
          </div>
          <div className="text-sm text-red-600 dark:text-red-300 mb-4">
            This could be due to:
            <ul className="list-disc list-inside mt-2 text-left">
              <li>Backend server not running</li>
              <li>Network connectivity issues</li>
              <li>Rate limiting from backend</li>
              <li>Backend service errors</li>
            </ul>
          </div>
          <button
            onClick={() => fetchTopPerformers(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  const topPerformers = getSortedTopPerformers();
  if (!topPerformers.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg">
          No top performers data available.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-3 lg:p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <div className='mb-4 lg:mb-0 text-center lg:text-left'>
          <h3 className="text-md lg:text-xl font-bold text-gray-900 dark:text-white mb-2">
            🏆 Top 10 Performers - {getCurrentMonthDisplay()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Top performers for {getCurrentMonthDisplay()} based on high scores, accuracy & level
          </p>
        </div>
        
        {/* View Toggle Buttons and Refresh */}
        <div className="flex gap-2">
          <button
            onClick={() => fetchTopPerformers(true)}
            disabled={refreshing}
            className={`p-2 rounded-lg transition-all duration-200 ${
              refreshing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white shadow-lg`}
            title={refreshing ? "Refreshing..." : "Refresh Data"}
          >
            {refreshing ? '⏳' : '🔄'}
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "table" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            title="Table View"
          >
            <FaTable />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "list" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            title="List View"
          >
            <FaList />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "grid" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            title="Grid View"
          >
            <FaTh />
          </button>
        </div>
      </div>

      {/* Current User Position Section */}
      {data?.currentUser && (
        <div className="my-8 p-3 lg:p-6 bg-gradient-to-r from-red-50 to-yellow-50 dark:from-red-900/20 dark:to-yellow-900/20 rounded-xl border-2 border-red-200 dark:border-yellow-600">
          <h4 className="text-md lg:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            🎯 Your Current Position
          </h4>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-0 lg:p-4 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {data.currentUser.position}
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-900 dark:text-white">
                    {data.currentUser.name}
                  </h5>
                  <div className={`subscription-name-badge text-white ${
                              data.currentUser.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : data.currentUser.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : data.currentUser.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                        }`}>
                          {data.currentUser.subscriptionName || "FREE"}
                        </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Level {data.currentUser.level.currentLevel} - {data.currentUser.level.levelName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Position #{data.currentUser.position} out of {data.total} students
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                    {data.currentUser.level.highScoreQuizzes}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">High Scores</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {data.currentUser.level.quizzesPlayed}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Quizzes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Surrounding Users (1 before + current + 1 after) */}
      {Array.isArray(data?.surroundingUsers) && data.surroundingUsers.length > 0 && (
        <div className="my-8">
          <h4 className="text-md lg:text-xl font-bold text-gray-900 dark:text-white mb-4">
            👥 Nearby Rankings
          </h4>
          <div className="space-y-3">
            {data.surroundingUsers.map((u, idx) => (
              <div
                key={`${u.userId || idx}`}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                  u.isCurrentUser
                    ? "bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-800 dark:to-yellow-900 border-red-400 dark:border-yellow-600"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold flex items-center justify-center shadow">
                    {u.position}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{u.name || "Unknown"}</div>
                    <div className={`subscription-name-badge text-white ${
                              u.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : u.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : u.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                          }`}>
                      {u.subscriptionName || "FREE"}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Level {u.level?.currentLevel || 0} • {u.level?.levelName || "No Level"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-green-600 dark:text-green-400">{u.level?.highScoreQuizzes || 0}</div>
                    <div className="text-gray-500 dark:text-gray-400">High Scores</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600 dark:text-blue-400">{u.level?.quizzesPlayed || 0}</div>
                    <div className="text-gray-500 dark:text-gray-400">Quizzes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-purple-600 dark:text-purple-400">{u.level?.accuracy || 0}%</div>
                    <div className="text-gray-500 dark:text-gray-400">Accuracy</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simplified List View */}
      {viewMode === "list" && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            🎯 Top 10 Performers - List View
          </h4>
          {topPerformers.map((p, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                p.userId === currentUserId 
                  ? "bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-800 dark:to-yellow-900 border-red-400 dark:border-yellow-600 shadow-lg" :
                i === 0 
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-600 shadow-lg" 
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                  p.userId === currentUserId ? "bg-gradient-to-r from-red-500 to-yellow-500" :
                  i === 0 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                  "bg-gradient-to-r from-blue-400 to-indigo-500"
                }`}>
                  {p.userId === currentUserId ? "👤" : i === 0 ? "🥇" : i + 1}
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 dark:text-white">
                    {p.name || "Unknown"}
                    {p.userId === currentUserId && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100">
                        You
                      </span>
                    )}
                  </h5>
                  <div className={`subscription-name-badge text-white ${
                              p.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : p.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : p.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                          }`}>
                    {p.subscriptionName || "FREE"}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Level {p.level?.currentLevel || 0} - {p.level?.levelName || "No Level"}
                  </p>
                </div>
                <div className="ml-auto flex gap-4">
                  <div className="text-center">
                    <div className="font-bold text-green-600 dark:text-green-400">
                      {p.level?.highScoreQuizzes || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">High Scores</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {p.level?.quizzesPlayed || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Quizzes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600 dark:text-purple-400">
                      {p.level?.accuracy || 0}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="overflow-x-auto">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📊 Top 10 Performers - Table View
          </h4>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">High Scores</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quizzes</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Accuracy</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {topPerformers.map((p, i) => (
                <tr key={i} className={p.userId === currentUserId ? "bg-yellow-50/60 dark:bg-yellow-900/10" : ""}>
                  <td className="px-4 py-2 whitespace-nowrap font-semibold text-gray-900 dark:text-white">{i + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-md lg:text-lg">
                          {p.name || "Unknown"}
                        </div>
                        <div className={`subscription-name-badge text-white ${
                              p.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : p.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : p.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                        }`}>
                          {p.subscriptionName || "FREE"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center text-gray-700 dark:text-gray-300">L{p.level?.currentLevel || 0} - {p.level?.levelName || "No Level"}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-center text-green-600 dark:text-green-400 font-semibold">{p.level?.highScoreQuizzes || 0}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-center text-blue-600 dark:text-blue-400 font-semibold">{p.level?.quizzesPlayed || 0}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-center text-purple-600 dark:text-purple-400 font-semibold">{p.level?.accuracy || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            🧩 Top 10 Performers - Grid View
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPerformers.map((p, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border shadow transition-all duration-200 ${
                  p.userId === currentUserId
                    ? "bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-800 dark:to-yellow-900 border-red-400 dark:border-yellow-600"
                    : i === 0
                    ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-600"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow ${
                    p.userId === currentUserId ? "bg-gradient-to-r from-red-500 to-yellow-500" :
                    i === 0 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                    "bg-gradient-to-r from-blue-400 to-indigo-500"
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{p.name || "Unknown"}</div>
                    <div className={`subscription-name-badge text-white ${
                              p.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : p.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : p.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                          }`}>
                      {p.subscriptionName || "FREE"}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Level</div>
                    <div className="font-semibold text-gray-900 dark:text-white">L{p.level?.currentLevel || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">High Scores</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">{p.level?.highScoreQuizzes || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">Quizzes</div>
                    <div className="font-semibold text-blue-600 dark:text-blue-400">{p.level?.quizzesPlayed || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">Accuracy</div>
                    <div className="font-semibold text-purple-600 dark:text-purple-400">{p.level?.accuracy || 0}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopPerformers;
