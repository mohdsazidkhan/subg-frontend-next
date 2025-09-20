'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalError } from '../contexts/GlobalErrorContext';
import { useTokenValidation } from '../hooks/useTokenValidation';
import API from '../utils/api';
import { FaBell, FaCheck, FaTimes, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState(null);
  const { handleError } = useGlobalError();
  const { isValidating } = useTokenValidation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await API.request('/api/student/notifications');
      setNotifications(response);
    } catch (error) {
      handleError(error, 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(notificationId);
      await API.request(`/api/student/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      handleError(error, 'Failed to mark notification as read');
    } finally {
      setMarkingAsRead(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.request('/api/student/notifications/mark-all-read', {
        method: 'PUT'
      });
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      handleError(error, 'Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await API.request(`/api/student/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      handleError(error, 'Failed to delete notification');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await API.delete('/api/student/notifications/clear-all');
      setNotifications([]);
    } catch (error) {
      handleError(error, 'Failed to clear all notifications');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'quiz_completed':
        return '🎯';
      case 'level_up':
        return '🎉';
      case 'reward_earned':
        return '🏆';
      case 'subscription_expired':
        return '⚠️';
      case 'system_update':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type, isRead) => {
    if (isRead) return 'bg-gray-50 dark:bg-gray-700';
    
    switch (type) {
      case 'quiz_completed':
        return 'bg-green-50 dark:bg-green-900/20 border-l-green-500';
      case 'level_up':
        return 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500';
      case 'reward_earned':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-500';
      case 'subscription_expired':
        return 'bg-red-50 dark:bg-red-900/20 border-l-red-500';
      case 'system_update':
        return 'bg-purple-50 dark:bg-purple-900/20 border-l-purple-500';
      default:
        return 'bg-gray-50 dark:bg-gray-700 border-l-gray-500';
    }
  };

  if (loading || isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaBell className="mr-3 text-blue-500" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-3 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            
            {notifications.length > 0 && (
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <FaEye className="mr-2" />
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={clearAllNotifications}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <FaTrash className="mr-2" />
                  Clear All
                </button>
              </div>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You're all caught up! Check back later for new updates.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 p-4 rounded-lg transition-all duration-200 ${getNotificationColor(notification.type, notification.isRead)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="text-2xl mt-1">
                        {getNotificationIcon(notification.type)}
                      </span>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medium ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        
                        <p className={`text-sm ${notification.isRead ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          disabled={markingAsRead === notification.id}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                          title="Mark as read"
                        >
                          {markingAsRead === notification.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <FaEye className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete notification"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
