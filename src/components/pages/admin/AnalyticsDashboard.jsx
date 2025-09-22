'use client';

import React from 'react';
import { FaChartLine, FaUsers, FaTrophy, FaDollarSign } from 'react-icons/fa';
import AdminNavbar from '../../AdminNavbar';
import Sidebar from '../../Sidebar';

const AnalyticsDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Analytics Dashboard
            </h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FaUsers className="text-3xl text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,234</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FaTrophy className="text-3xl text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quizzes</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">5,678</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FaChartLine className="text-3xl text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">890</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FaDollarSign className="text-3xl text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">₹45,678</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder for charts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Analytics Coming Soon
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed analytics and charts will be implemented here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
