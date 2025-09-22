'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalError } from '../contexts/GlobalErrorContext';
import { useTokenValidation } from '../hooks/useTokenValidation';
import API from '../lib/api'
import ResponsiveTable from '../components/ResponsiveTable';
import Pagination from '../components/Pagination';
import { FaClock, FaCheckCircle, FaTimesCircle, FaTrophy, FaEye } from 'react-icons/fa';

const QuizHistoryPage = () => {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentView, setCurrentView] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    difficulty: ''
  });
  const { handleError } = useGlobalError();
  const { isValidating } = useTokenValidation();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchQuizHistory();
  }, [currentPage, searchTerm, filters]);

  const fetchQuizHistory = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        ...filters
      };

      const queryString = new URLSearchParams(params).toString();
      const response = await API.getStudentQuizHistory({ page, limit: itemsPerPage });
      setQuizHistory(response.attempts);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error) {
      handleError(error, 'Failed to fetch quiz history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'failed':
        return <FaTimesCircle className="text-red-500" />;
      case 'timeout':
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'timeout':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const columns = [
    {
      key: 'quiz',
      label: 'Quiz',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.quiz?.title || 'Unknown Quiz'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {row.quiz?.category?.name || 'No Category'}
          </div>
        </div>
      )
    },
    {
      key: 'score',
      label: 'Score',
      render: (value, row) => (
        <div className="text-center">
          <div className="font-semibold text-blue-600 dark:text-blue-400">
            {row.score}/{row.totalQuestions}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {row.percentage ? `${row.percentage.toFixed(1)}%` : '0%'}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(value)}
          <span className={`font-medium ${getStatusColor(value)}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </div>
      )
    },
    {
      key: 'timeSpent',
      label: 'Time Spent',
      render: (value) => (
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <FaClock className="mr-1" />
          {Math.floor(value / 60)}:{(value % 60).toString().padStart(2, '0')}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => (
        <div className="text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ];

  const tableActions = [
    {
      label: 'View Details',
      icon: FaEye,
      onClick: (row) => {
        // Handle view details
        console.log('View details for:', row.id);
      },
      className: 'text-blue-600 hover:text-blue-800'
    }
  ];

  const filterOptions = {
    status: [
      { value: '', label: 'All Status' },
      { value: 'completed', label: 'Completed' },
      { value: 'failed', label: 'Failed' },
      { value: 'timeout', label: 'Timeout' }
    ],
    difficulty: [
      { value: '', label: 'All Difficulties' },
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' }
    ]
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      category: '',
      difficulty: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (loading && quizHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaTrophy className="mr-3 text-yellow-500" />
              Quiz History
            </h1>
          </div>

          <ResponsiveTable
            data={quizHistory}
            columns={columns}
            actions={tableActions}
            currentView={currentView}
            onViewChange={setCurrentView}
            loading={loading}
            emptyMessage="No quiz history found"
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            filterOptions={filterOptions}
            className="min-h-[400px]"
          />

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizHistoryPage;
