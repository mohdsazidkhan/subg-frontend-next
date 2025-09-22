'use client';

import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AdminNavbar from '../../AdminNavbar';
import Sidebar from '../../Sidebar';

const SubscriptionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Subscription Plans
              </h1>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FaPlus className="mr-2" />
                Add Plan
              </button>
            </div>
            
            {/* Subscription Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Free</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">₹0</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• Basic quizzes</li>
                  <li>• Limited access</li>
                  <li>• Community features</li>
                </ul>
                <button className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FaEye className="inline mr-2" />
                  View Details
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Basic</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">₹299</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• All basic features</li>
                  <li>• Advanced quizzes</li>
                  <li>• Progress tracking</li>
                </ul>
                <button className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FaEye className="inline mr-2" />
                  View Details
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Premium</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">₹599</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• All basic features</li>
                  <li>• Premium quizzes</li>
                  <li>• Priority support</li>
                </ul>
                <button className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FaEye className="inline mr-2" />
                  View Details
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pro</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">₹999</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• All premium features</li>
                  <li>• Exclusive content</li>
                  <li>• Personal coach</li>
                </ul>
                <button className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FaEye className="inline mr-2" />
                  View Details
                </button>
              </div>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Active Subscriptions
                </h2>
              </div>
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Subscription management functionality will be implemented here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
