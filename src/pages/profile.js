'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import API from '../utils/api';
import { isAuthenticated, getCurrentUser, logout } from '../utils/authUtils';
import { FaUser, FaEdit, FaSave, FaTimes, FaEnvelope, FaPhone, FaCalendar, FaTrophy, FaChartLine, FaSignOutAlt } from 'react-icons/fa';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    fetchUserProfile();
  }, [router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      const response = await API.request(`/api/student/profile/${currentUser.id}`);
      setUser(response);
      setFormData({
        username: response.username || '',
        email: response.email || '',
        phone: response.phone || ''
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await API.request(`/api/student/profile/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      setUser(prev => ({ ...prev, ...formData }));
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaUser className="mr-3" />
              My Profile
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white flex items-center">
                        <FaEnvelope className="mr-2 text-gray-400" />
                        {user.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white flex items-center">
                        <FaPhone className="mr-2 text-gray-400" />
                        {user.phone || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900 dark:text-white flex items-center">
                      <FaCalendar className="mr-2 text-gray-400" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  {editing ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FaSave className="mr-2" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <FaTimes className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FaTrophy className="mr-2 text-yellow-500" />
                  Quiz Statistics
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {user.totalQuizzes || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Quizzes</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {user.level || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Level</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {user.totalScore || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Score</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {user.averageAccuracy ? `${user.averageAccuracy.toFixed(1)}%` : '0%'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Accuracy</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FaChartLine className="mr-2 text-green-500" />
                  Recent Activity
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-900 dark:text-white">Last Quiz Attempt</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user.lastQuizDate ? new Date(user.lastQuizDate).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-900 dark:text-white">Best Score</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user.bestScore || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-900 dark:text-white">Streak</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user.currentStreak || 0} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
