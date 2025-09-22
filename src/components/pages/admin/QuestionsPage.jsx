'use client';

import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import AdminNavbar from '../../AdminNavbar';
import Sidebar from '../../Sidebar';

const QuestionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Questions Management
              </h1>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FaPlus className="mr-2" />
                Add Question
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Questions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Questions List
                </h2>
              </div>
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Questions management functionality will be implemented here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
