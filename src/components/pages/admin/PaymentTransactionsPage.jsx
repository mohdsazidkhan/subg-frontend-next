'use client';

import React from 'react';
import { FaDownload, FaFilter, FaSearch } from 'react-icons/fa';
import AdminNavbar from '../../AdminNavbar';
import Sidebar from '../../Sidebar';

const PaymentTransactionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Payment Transactions
              </h1>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <FaDownload className="mr-2" />
                Export
              </button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Status</option>
                <option>Success</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Plans</option>
                <option>Basic</option>
                <option>Premium</option>
                <option>Pro</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <FaFilter className="mr-2" />
                Filter
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <FaDownload className="text-green-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">₹1,23,456</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <FaDownload className="text-blue-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Successful</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,234</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <FaDownload className="text-yellow-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">56</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <FaDownload className="text-red-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Recent Transactions
                </h2>
              </div>
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Payment transactions management functionality will be implemented here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTransactionsPage;
