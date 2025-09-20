'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import API from '../../utils/api';
import { isAdmin, hasAdminPrivileges } from '../../utils/adminUtils';
import { FaUsers, FaQuestionCircle, FaChartLine, FaTrophy, FaDollarSign, FaCalendar, FaClock, FaCheckCircle } from 'react-icons/fa';

const AdminDashboard = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin() || !hasAdminPrivileges()) {
      toast.error('Access denied. Admin privileges required.');
      router.push('/home');
      return;
    }
    
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await API.request('/api/admin/dashboard');
      setDashboardData(response);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: dashboardData.totalUsers || 0,
      icon: FaUsers,
      color: 'bg-blue-500',
      change: dashboardData.userGrowth || 0,
      changeType: 'increase'
    },
    {
      title: 'Total Quizzes',
      value: dashboardData.totalQuizzes || 0,
      icon: FaQuestionCircle,
      color: 'bg-green-500',
      change: dashboardData.quizGrowth || 0,
      changeType: 'increase'
    },
    {
      title: 'Quiz Attempts',
      value: dashboardData.totalAttempts || 0,
      icon: FaChartLine,
      color: 'bg-purple-500',
      change: dashboardData.attemptGrowth || 0,
      changeType: 'increase'
    },
    {
      title: 'Active Subscriptions',
      value: dashboardData.activeSubscriptions || 0,
      icon: FaDollarSign,
      color: 'bg-yellow-500',
      change: dashboardData.subscriptionGrowth || 0,
      changeType: 'increase'
    }
  ];

  const recentActivities = dashboardData.recentActivities || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome to the admin panel. Here's an overview of your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.changeType === 'increase' ? '+' : '-'}{Math.abs(stat.change)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-2">from last month</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaClock className="mr-2 text-blue-500" />
              Recent Activities
            </h2>
            
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.details}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaClock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">No recent activities</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaTrophy className="mr-2 text-yellow-500" />
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/admin/users')}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
              >
                <FaUsers className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">View and manage user accounts</p>
              </button>
              
              <button
                onClick={() => router.push('/admin/quizzes')}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
              >
                <FaQuestionCircle className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Manage Quizzes</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create and edit quizzes</p>
              </button>
              
              <button
                onClick={() => router.push('/admin/analytics')}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
              >
                <FaChartLine className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Analytics</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">View platform analytics</p>
              </button>
              
              <button
                onClick={() => router.push('/admin/subscriptions')}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors text-left"
              >
                <FaDollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Subscriptions</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage subscription plans</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;