'use client'

import React, { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaTrophy, FaBrain, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'
import TokenValidationWrapper from '../TokenValidationWrapper'
import StudentRoute from '../StudentRoute'
import API from '@/lib/api'
import { toast } from 'react-toastify'

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const profileData = await API.getProfile()
      setUser(profileData.user)
      setFormData({
        name: profileData.user.name || '',
        email: profileData.user.email || '',
        phone: profileData.user.phone || '',
        username: profileData.user.username || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const response = await API.updateProfile(formData)
      
      if (response.success) {
        setUser(response.user)
        setEditing(false)
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      username: user.username || ''
    })
    setEditing(false)
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading profile...</p>
          </div>
        </div>
        <UnifiedFooter />
      </div>
    )
  }

  return (
    <TokenValidationWrapper>
      <StudentRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <UnifiedNavbar />
          
          <div className="pt-20 pb-8 px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  My Profile
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Manage your account information and preferences
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUser className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {user?.name || 'User'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        @{user?.username || 'username'}
                      </p>
                      <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                        <FaCalendarAlt className="w-4 h-4 mr-2" />
                        Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Your Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaBrain className="w-5 h-5 text-blue-500 mr-3" />
                          <span className="text-gray-700 dark:text-gray-300">Quizzes Taken</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {user?.stats?.quizzesTaken || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaTrophy className="w-5 h-5 text-yellow-500 mr-3" />
                          <span className="text-gray-700 dark:text-gray-300">Total Score</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {user?.stats?.totalScore || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaUser className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-gray-700 dark:text-gray-300">Level</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {user?.stats?.level || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Profile Information
                      </h3>
                      {!editing ? (
                        <button
                          onClick={() => setEditing(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                        >
                          <FaEdit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
                          >
                            <FaSave className="w-4 h-4 mr-2" />
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <FaTimes className="w-4 h-4 mr-2" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <form className="space-y-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {user?.name || 'Not provided'}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        {editing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {user?.email || 'Not provided'}
                          </p>
                        )}
                      </div>

                      {/* Username */}
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
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {user?.username || 'Not provided'}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        {editing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {user?.phone || 'Not provided'}
                          </p>
                        )}
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Account Type
                        </label>
                        <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                          {user?.role === 'admin' ? 'Administrator' : 'Student'}
                        </p>
                      </div>

                      {/* Subscription Status */}
                      {user?.subscriptionStatus && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Subscription Status
                          </label>
                          <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                              user.subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                            {user.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                            {user.subscriptionPlan && ` (${user.subscriptionPlan})`}
                          </p>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <UnifiedFooter />
        </div>
      </StudentRoute>
    </TokenValidationWrapper>
  )
}

export default ProfilePage
