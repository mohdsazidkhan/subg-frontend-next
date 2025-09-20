'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import API from '../../utils/api';
import { isAdmin, hasAdminPrivileges } from '../../utils/adminUtils';
import ResponsiveTable from '../../components/ResponsiveTable';
import Pagination from '../../components/Pagination';
import { FaUsers, FaEye, FaEdit, FaTrash, FaBan, FaCheck, FaSearch, FaFilter } from 'react-icons/fa';

const AdminUsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentView, setCurrentView] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    subscription: ''
  });

  const itemsPerPage = 10;

  useEffect(() => {
    if (!isAdmin() || !hasAdminPrivileges()) {
      toast.error('Access denied. Admin privileges required.');
      router.push('/home');
      return;
    }
    
    fetchUsers();
  }, [router, currentPage, searchTerm, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        ...filters
      };

      const queryString = new URLSearchParams(params).toString();
      const response = await API.request(`/api/admin/users?${queryString}`);
      setUsers(response.users);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Users fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      let endpoint = '';
      let successMessage = '';

      switch (action) {
        case 'activate':
          endpoint = `/api/admin/users/${userId}/activate`;
          successMessage = 'User activated successfully';
          break;
        case 'deactivate':
          endpoint = `/api/admin/users/${userId}/deactivate`;
          successMessage = 'User deactivated successfully';
          break;
        case 'delete':
          endpoint = `/api/admin/users/${userId}`;
          successMessage = 'User deleted successfully';
          break;
        default:
          return;
      }

      await API[action === 'delete' ? 'delete' : 'put'](endpoint);
      toast.success(successMessage);
      fetchUsers();
    } catch (error) {
      toast.error(`Failed to ${action} user`);
      console.error(`${action} user error:`, error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Inactive</span>;
      case 'banned':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Banned</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Unknown</span>;
    }
  };

  const getSubscriptionBadge = (subscription) => {
    if (!subscription) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Free</span>;
    }

    switch (subscription.plan) {
      case 'basic':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Basic</span>;
      case 'premium':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Premium</span>;
      case 'pro':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pro</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Unknown</span>;
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.username}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {row.email}
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'subscription',
      label: 'Subscription',
      render: (value) => getSubscriptionBadge(value)
    },
    {
      key: 'totalQuizzes',
      label: 'Quizzes',
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {value || 0}
        </span>
      )
    },
    {
      key: 'level',
      label: 'Level',
      render: (value) => (
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
          {value || 0}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
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
        router.push(`/admin/users/${row.id}`);
      },
      className: 'text-blue-600 hover:text-blue-800'
    },
    {
      label: 'Edit User',
      icon: FaEdit,
      onClick: (row) => {
        router.push(`/admin/users/${row.id}/edit`);
      },
      className: 'text-green-600 hover:text-green-800'
    },
    {
      label: row => row.status === 'active' ? 'Deactivate' : 'Activate',
      icon: row => row.status === 'active' ? FaBan : FaCheck,
      onClick: (row) => {
        const action = row.status === 'active' ? 'deactivate' : 'activate';
        handleUserAction(row.id, action);
      },
      className: row => row.status === 'active' 
        ? 'text-red-600 hover:text-red-800' 
        : 'text-green-600 hover:text-green-800'
    },
    {
      label: 'Delete User',
      icon: FaTrash,
      onClick: (row) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          handleUserAction(row.id, 'delete');
        }
      },
      className: 'text-red-600 hover:text-red-800'
    }
  ];

  const filterOptions = {
    status: [
      { value: '', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'banned', label: 'Banned' }
    ],
    role: [
      { value: '', label: 'All Roles' },
      { value: 'user', label: 'User' },
      { value: 'admin', label: 'Admin' }
    ],
    subscription: [
      { value: '', label: 'All Plans' },
      { value: 'free', label: 'Free' },
      { value: 'basic', label: 'Basic' },
      { value: 'premium', label: 'Premium' },
      { value: 'pro', label: 'Pro' }
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
      role: '',
      subscription: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
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
              <FaUsers className="mr-3 text-blue-500" />
              User Management
            </h1>
          </div>

          <ResponsiveTable
            data={users}
            columns={columns}
            actions={tableActions}
            currentView={currentView}
            onViewChange={setCurrentView}
            loading={loading}
            emptyMessage="No users found"
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

export default AdminUsersPage;
