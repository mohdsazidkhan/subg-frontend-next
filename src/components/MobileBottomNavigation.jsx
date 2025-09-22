import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useClientSide, useAuthStatus } from '../hooks/useClientSide';
import {
  FaHome,
  FaSearch,
  FaTrophy,
  FaUser,
  FaCreditCard,
  FaCalendarAlt,
  FaLayerGroup,
  FaStickyNote,
  FaLockOpen,
  FaNetworkWired,
  FaSearchPlus,
  FaPeopleCarry,
  FaPeopleArrows,
  FaPersonBooth,
  FaUserLock,
  FaMoneyBill
} from 'react-icons/fa';
import { BsPersonCircle } from 'react-icons/bs';
import { MdDashboard } from 'react-icons/md';
import { getCurrentUser } from '../lib/utils/authUtils';
import { hasActiveSubscription } from '../lib/utils/subscriptionUtils';
import { isAdmin } from '../lib/utils/adminUtils';

const MobileBottomNavigation = () => {
  const router = useRouter();
  const isClient = useClientSide();
  const { user } = useAuthStatus();

  // Don't show on admin pages only
  const isAdminPage = router.pathname.startsWith('/admin');
  
  if (isAdminPage) {
    return null;
  }

  const studentNavItems = [
    { path: '/home', icon: FaHome, label: 'Home' },
    { path: '/subscription', icon: hasActiveSubscription() ? FaCalendarAlt : FaCreditCard, label: 'Plans' },
    { path: '/rewards', icon: FaTrophy, label: 'Rewards' },
    { path: '/levels', icon: FaLayerGroup, label: 'Levels' },
    { path: '/search', icon: FaSearch, label: 'Search' },
    { path: '/profile', icon: BsPersonCircle, label: 'Profile' },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', icon: MdDashboard, label: 'Dashboard' },
    { path: '/admin/payment-transactions', icon: FaMoneyBill, label: 'Payments' },
    { path: '/admin/students', icon: FaUser, label: 'Students' },
    { path: '/admin/categories', icon: FaSearch, label: 'Categories' },
    { path: '/admin/quizzes', icon: FaTrophy, label: 'Quizzes' },
    { path: '/profile', icon: BsPersonCircle, label: 'Profile' },
  ];

  // Landing page navigation items (for non-logged in users)
  const landingNavItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/how-it-works', icon: FaSearchPlus, label: 'How it Works' },
    { path: '/about', icon: FaTrophy, label: 'About' },
    { path: '/contact', icon: FaUser, label: 'Contact' },
    { path: '/register', icon: BsPersonCircle, label: 'Register' },
    { path: '/login', icon: FaUserLock, label: 'Login' },
  ];

  const navItems = isClient && user ? (isAdmin() ? adminNavItems : studentNavItems) : landingNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center py-1 px-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 dark:from-yellow-500 dark:to-red-500 dark:hover:from-yellow-600 dark:hover:to-red-600 text-white dark:text-white transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl dark:shadow-yellow-500/25 hover:dark:shadow-yellow-500/40'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNavigation;