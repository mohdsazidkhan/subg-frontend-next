import React from 'react';
import Link from 'next/link';
import { useSSR } from '../hooks/useSSR';
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
  const { isMounted, isRouterReady, router } = useSSR();
  const user = getCurrentUser();
  
  // Don't render anything during SSR
  if (!isMounted) {
    return null;
  }

  // Don't show on admin pages only
  const isAdminPage = isRouterReady && router && router.pathname.startsWith('/admin');
  
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
    { path: '/admin/questions', icon: FaStickyNote, label: 'Questions' },
    { path: '/admin/subscriptions', icon: FaCalendarAlt, label: 'Plans' },
    { path: '/admin/contacts', icon: FaUserLock, label: 'Contacts' },
  ];

  // Determine which navigation items to show
  const navItems = user && isAdmin() ? adminNavItems : studentNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Student Mobile Bottom Navigation */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router && router.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center w-20 h-12 transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 dark:from-yellow-500 dark:to-red-500 dark:hover:from-yellow-600 dark:hover:to-red-600 text-white dark:text-white transition-all duration-300 font-semibold shadow-lg hover:shadow-xl dark:shadow-yellow-500/25 hover:dark:shadow-yellow-500/40'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
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
