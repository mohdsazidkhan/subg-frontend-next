'use client';

import React, { useEffect, useState, useCallback } from 'react';
import API from '../../lib/api';
import MobileAppWrapper from '../../components/MobileAppWrapper';
import UnifiedNavbar from '../../components/UnifiedNavbar';
import UnifiedFooter from '../../components/UnifiedFooter';
import { toast } from 'react-toastify';

const UserWallet = () => {
  const [wallet, setWallet] = useState({ balance: 0, totalEarned: 0, approvedCount: 0, totalQuestions: 0 });
  const [amount, setAmount] = useState('');
  const [upi, setUpi] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(true);

  const userInfo = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const load = useCallback(async () => {
    if (!userInfo || (!userInfo.id && !userInfo._id)) return;
    setWalletLoading(true);
    try {
      const res = await API.getUserWallet(userInfo.id || userInfo._id);
      if (res?.success) setWallet(res.data || res.wallet || res);
    } catch (e) {
      console.error('Error loading wallet:', e);
    } finally {
      setWalletLoading(false);
    }
  }, [userInfo?.id, userInfo?._id]);

  useEffect(() => { load(); }, [load]);

  const submitWithdraw = async (e) => {
    e.preventDefault();
    if (!userInfo || (!userInfo.id && !userInfo._id)) {
      toast.error('Please login to withdraw');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (Number(amount) > wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }
    if (Number(amount) < 1000) {
      toast.error('Minimum withdrawal amount is ₹1000');
      return;
    }
    setLoading(true);
    try {
      const res = await API.createWithdrawRequest({ amount: Number(amount), upi });
      if (res?.success) {
        toast.success('Withdrawal request submitted successfully!');
        setAmount('');
        setUpi('');
        load();
      } else {
        toast.error(res?.message || 'Failed to submit withdrawal request');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n || 0);
  const canWithdraw = (wallet.approvedCount || 0) >= 100;
  const remainingForWithdraw = Math.max(0, 100 - (wallet.approvedCount || 0));
  const progressPercentage = Math.min(((wallet.approvedCount || 0) / 100) * 100, 100);

  return (
    <MobileAppWrapper title="My Wallet">
      <UnifiedNavbar />
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-600 to-red-600 rounded-full mb-3">
              <span className="text-2xl">💰</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
            <p className="text-gray-600 dark:text-gray-300">Track your earnings and manage withdrawals</p>
          </div>

          {/* Stats */}
          {walletLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                <p className="text-yellow-600 dark:text-yellow-400 text-sm">Available Balance</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(wallet.balance)}</h3>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                <p className="text-red-600 dark:text-red-400 text-sm">Total Earned</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(wallet.totalEarned)}</h3>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                <p className="text-purple-600 dark:text-purple-400 text-sm">Approved Questions</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{wallet.approvedCount || 0}</h3>
                {!canWithdraw && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{Math.round(progressPercentage)}% complete</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Withdraw Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-600 to red-600 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Withdraw Funds</h2>
              <p className="text-yellow-100 text-sm">{canWithdraw ? 'You can withdraw your earnings' : `Complete ${remainingForWithdraw} more approved questions`}</p>
            </div>

            {!canWithdraw && (
              <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">You need {remainingForWithdraw} more approved questions to enable withdrawal. (100 questions = ₹1000)</p>
              </div>
            )}

            {canWithdraw && (
              <form onSubmit={submitWithdraw} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white">Withdrawal Amount</label>
                  <input type="number" className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter amount (min ₹1000)" value={amount} onChange={e => setAmount(e.target.value)} min="1000" max={wallet.balance} step="1" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Available: {formatCurrency(wallet.balance)} • Minimum: ₹1000</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white">UPI ID or Bank Details</label>
                  <input type="text" className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="username@upi or bank details" value={upi} onChange={e => setUpi(e.target.value)} />
                </div>
                <button disabled={loading || !amount || !upi || Number(amount) < 1000 || Number(amount) > wallet.balance} type="submit"
                  className="w-full bg-gradient-to-r from-yellow-600 to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg">
                  {loading ? 'Processing...' : 'Request Withdrawal'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <UnifiedFooter />
    </MobileAppWrapper>
  );
};

export default UserWallet;


