'use client';

import { useEffect, useState } from 'react';
import API from '../lib/api';
import { useRouter } from 'next/navigation';
import { handleAuthError } from '../lib/utils/authUtils';
import { toast } from 'react-hot-toast';
import { useRewards } from '../hooks/useRewards';
import MonthlyRewardsInfo from '../components/MonthlyRewardsInfo';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCrown, 
  FaTrophy, 
  FaMedal, 
  FaStar, 
  FaBrain,  
  FaAward, 
  FaArrowRight,
  FaChartLine,
  FaFire,
  FaBookOpen,
  FaUserGraduate,
  FaMagic,
  FaUniversity,
  FaSave,
  FaMoneyCheckAlt,
  FaEdit,
  FaCheckCircle,
  FaBuilding,
  FaKey,
  FaPlus,
  FaRocket,
  FaGem,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPencilAlt
} from 'react-icons/fa';
import { getSubscriptionStatusTextWithTheme } from '../lib/utils/subscriptionUtils';
import ShareComponent from '../components/ShareComponent';
import MobileAppWrapper from '../components/MobileAppWrapper';
import PaymentTransactions from '../components/PaymentTransactions';
import UnifiedNavbar from '../components/UnifiedNavbar';
import UnifiedFooter from '../components/UnifiedFooter';

// Level badge icon mapping
const levelBadgeIcons = {
  'Starter': FaUserGraduate,
  'Rookie': FaStar,
  'Explorer': FaRocket,
  'Thinker': FaBrain,
  'Strategist': FaChartLine,
  'Master': FaCrown,
  'Expert': FaAward,
  'Champion': FaTrophy,
  'Legend': FaGem,
  'Default': FaUser
};

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    university: '',
    city: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    }
  });
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState(null);
  
  const { rewards, loading: rewardsLoading, fetchRewards } = useRewards();

  useEffect(() => {
    fetchUserProfile();
    fetchReferralStats();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await API.getProfile();
      const payload = res?.user || res?.data?.user || res;
      setUser(payload);
      setFormData({
        name: payload?.name || '',
        email: payload?.email || '',
        phone: payload?.phone || '',
        bio: payload?.bio || '',
        university: payload?.university || '',
        city: payload?.city || '',
        socialLinks: {
          facebook: payload?.socialLinks?.facebook || '',
          twitter: payload?.socialLinks?.twitter || '',
          instagram: payload?.socialLinks?.instagram || '',
          youtube: payload?.socialLinks?.youtube || ''
        }
      });
    } catch (error) {
      handleAuthError(error, router);
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralStats = async () => {
    try {
      // Mock referral stats since the endpoint doesn't exist yet
      const mockReferralStats = {
        referralCode: user?.id ? `REF${user.id.toString().padStart(6, '0')}` : 'REF000001',
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        totalEarnings: 0
      };
      setReferralStats(mockReferralStats);
      setReferralCode(mockReferralStats.referralCode);
    } catch (error) {
      console.error('Referral stats fetch error:', error);
      // Set default values if there's an error
      const defaultStats = {
        referralCode: 'REF000001',
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        totalEarnings: 0
      };
      setReferralStats(defaultStats);
      setReferralCode(defaultStats.referralCode);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      await API.updateProfile(formData);
      setUser(prev => ({ ...prev, ...formData }));
      setEditing(false);
      toast.success('Profile updated successfully');
      fetchUserProfile();
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      university: user.university || '',
      city: user.city || '',
      socialLinks: {
        facebook: user.socialLinks?.facebook || '',
        twitter: user.socialLinks?.twitter || '',
        instagram: user.socialLinks?.instagram || '',
        youtube: user.socialLinks?.youtube || ''
      }
    });
    setEditing(false);
  };

  const getLevelBadgeIcon = (level) => {
    const IconComponent = levelBadgeIcons[level] || levelBadgeIcons.Default;
    return <IconComponent className="text-2xl" />;
  };

  const getSubscriptionStatusBadge = () => {
    if (!user.subscription) return null;
    
    const { text, bgColor, textColor } = getSubscriptionStatusTextWithTheme(user.subscription);
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
        <FaCrown className="mr-1" />
        {text}
      </div>
    );
  };

  if (loading) {
    return (
      <MobileAppWrapper>
        <UnifiedNavbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
        <UnifiedFooter />
      </MobileAppWrapper>
    );
  }

  if (!user) {
    return (
      <MobileAppWrapper>
        <UnifiedNavbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Profile not found</p>
          </div>
        </div>
        <UnifiedFooter />
      </MobileAppWrapper>
    );
  }

  return (
    <MobileAppWrapper>
      <UnifiedNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 mb-8 profile-hero">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-4xl text-gray-400" />
                  )}
                </div>
                {getSubscriptionStatusBadge() && (
                  <div className="absolute -bottom-2 -right-2">
                    {getSubscriptionStatusBadge()}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                <p className="text-xl text-blue-100 mb-4">{user.bio || 'Quiz enthusiast and knowledge seeker'}</p>
                
                {/* Level Badge */}
                <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    {getLevelBadgeIcon(user.level)}
                    <span className="text-white font-semibold">Level {user.level || 1}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <FaTrophy className="text-yellow-300" />
                    <span className="text-white font-semibold">{user.totalScore || 0} Points</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.totalQuizzes || 0}</div>
                    <div className="text-sm text-blue-100">Quizzes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.averageAccuracy || 0}%</div>
                    <div className="text-sm text-blue-100">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.currentStreak || 0}</div>
                    <div className="text-sm text-blue-100">Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.rank || 'N/A'}</div>
                    <div className="text-sm text-blue-100">Rank</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  {editing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button
                  onClick={() => setShowReferralModal(true)}
                  className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Referral Code
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 profile-card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaUser className="mr-3 text-blue-500" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-3">{user.name}</p>
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-3 flex items-center">
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-3 flex items-center">
                        <FaPhone className="mr-2 text-gray-400" />
                        {user.phone || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      University
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-3 flex items-center">
                        <FaUniversity className="mr-2 text-gray-400" />
                        {user.university || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-3 flex items-center">
                        <FaBuilding className="mr-2 text-gray-400" />
                        {user.city || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900 dark:text-white py-3 flex items-center">
                      <FaCalendar className="mr-2 text-gray-400" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white py-3">
                      {user.bio || 'No bio provided yet.'}
                    </p>
                  )}
                </div>

                {editing && (
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      <FaSave className="mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Social Links Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 profile-card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaGem className="mr-3 text-purple-500" />
                  Social Links
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaFacebookF className="inline mr-2 text-blue-600" />
                      Facebook
                    </label>
                    {editing ? (
                      <input
                        type="url"
                        name="socialLinks.facebook"
                        value={formData.socialLinks.facebook}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://facebook.com/yourusername"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-3">
                        {user.socialLinks?.facebook || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaTwitter className="inline mr-2 text-blue-400" />
                      Twitter
                    </label>
                    {editing ? (
                      <input
                        type="url"
                        name="socialLinks.twitter"
                        value={formData.socialLinks.twitter}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://twitter.com/yourusername"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-3">
                        {user.socialLinks?.twitter || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaInstagram className="inline mr-2 text-pink-500" />
                      Instagram
                    </label>
                    {editing ? (
                      <input
                        type="url"
                        name="socialLinks.instagram"
                        value={formData.socialLinks.instagram}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://instagram.com/yourusername"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-3">
                        {user.socialLinks?.instagram || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaYoutube className="inline mr-2 text-red-600" />
                      YouTube
                    </label>
                    {editing ? (
                      <input
                        type="url"
                        name="socialLinks.youtube"
                        value={formData.socialLinks.youtube}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://youtube.com/yourchannel"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-3">
                        {user.socialLinks?.youtube || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment History Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 profile-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <FaMoneyCheckAlt className="mr-3 text-green-500" />
                    Payment History
                  </h2>
                  <button
                    onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaArrowRight className={`mr-2 transition-transform ${showPaymentHistory ? 'rotate-90' : ''}`} />
                    {showPaymentHistory ? 'Hide' : 'View'} History
                  </button>
                </div>
                
                {showPaymentHistory && (
                  <PaymentTransactions />
                )}
              </div>
            </div>

            {/* Right Column - Stats and Rewards */}
            <div className="space-y-8">
              {/* Quiz Statistics Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 profile-card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaChartLine className="mr-3 text-blue-500" />
                  Quiz Statistics
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <div className="flex items-center">
                      <FaBookOpen className="text-blue-600 mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white">Total Quizzes</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{user.totalQuizzes || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <div className="flex items-center">
                      <FaTrophy className="text-green-600 mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white">Total Score</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{user.totalScore || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                    <div className="flex items-center">
                      <FaStar className="text-purple-600 mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white">Average Accuracy</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{user.averageAccuracy || 0}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                    <div className="flex items-center">
                      <FaFire className="text-orange-600 mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white">Current Streak</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">{user.currentStreak || 0} days</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                    <div className="flex items-center">
                      <FaMedal className="text-yellow-600 mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white">Best Score</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">{user.bestScore || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                    <div className="flex items-center">
                      <FaCrown className="text-red-600 mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white">Global Rank</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600">#{user.rank || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Rewards Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 profile-card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaAward className="mr-3 text-yellow-500" />
                  Rewards & Achievements
                </h2>
                
                {rewardsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Loading rewards...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rewards && rewards.length > 0 ? (
                      rewards.map((reward, index) => (
                        <div key={index} className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                          <FaMedal className="text-yellow-600 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{reward.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{reward.description}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FaAward className="text-4xl text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No rewards yet. Keep taking quizzes!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Monthly Rewards Info */}
              <MonthlyRewardsInfo />

              {/* Share Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 profile-card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaMagic className="mr-3 text-purple-500" />
                  Share Profile
                </h2>
                <ShareComponent 
                  url={`${window.location.origin}/profile`}
                  title={`Check out ${user.name}'s quiz profile!`}
                  description={`${user.name} is on level ${user.level} with ${user.totalScore} points!`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <UnifiedFooter />
    </MobileAppWrapper>
  );
};

export default ProfilePage;