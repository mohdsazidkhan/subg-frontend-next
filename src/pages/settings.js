'use client';

import React, { useEffect, useState } from 'react';
import API from '../lib/api';
import { toast } from 'react-toastify';
import MobileAppWrapper from '../components/MobileAppWrapper';
import UnifiedNavbar from '../components/UnifiedNavbar';
import UnifiedFooter from '../components/UnifiedFooter';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    socialLinks: { facebook: '', twitter: '', instagram: '', youtube: '' },
    bio: '',
    city: '',
    university: ''
  });
  const [bank, setBank] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    branchName: ''
  });

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const profileRes = await API.getProfile();
        const user = profileRes?.user || profileRes?.data?.user || profileRes;
        setProfile({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          socialLinks: {
            facebook: user?.socialLinks?.facebook || '',
            twitter: user?.socialLinks?.twitter || '',
            instagram: user?.socialLinks?.instagram || '',
            youtube: user?.socialLinks?.youtube || ''
          },
          bio: user?.bio || '',
          city: user?.city || '',
          university: user?.university || ''
        });
        try {
          const bankRes = await API.getBankDetails();
          if (bankRes?.success && bankRes.bankDetail) {
            setBank({
              accountHolderName: bankRes.bankDetail.accountHolderName || '',
              accountNumber: bankRes.bankDetail.accountNumber || '',
              bankName: bankRes.bankDetail.bankName || '',
              ifscCode: bankRes.bankDetail.ifscCode || '',
              branchName: bankRes.bankDetail.branchName || ''
            });
          }
        } catch (_) {}
      } catch (e) {
        console.error('Init settings error:', e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await API.updateProfile(profile);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const saveBank = async (e) => {
    e.preventDefault();
    try {
      setSavingBank(true);
      await API.saveBankDetails(bank);
      toast.success('Bank details saved');
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Failed to save bank details');
    } finally {
      setSavingBank(false);
    }
  };

  if (loading) {
    return (
      <MobileAppWrapper title="Settings">
        <UnifiedNavbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
        </div>
        <UnifiedFooter />
      </MobileAppWrapper>
    );
  }

  return (
    <MobileAppWrapper title="Settings">
      <UnifiedNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h1>

          <div className="grid grid-cols-1 gap-6">
            {/* Profile */}
            <form onSubmit={saveProfile} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Name</label>
                  <input value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Email</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Phone</label>
                  <input value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">City</label>
                  <input value={profile.city} onChange={(e) => setProfile(p => ({ ...p, city: e.target.value }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">University</label>
                  <input value={profile.university} onChange={(e) => setProfile(p => ({ ...p, university: e.target.value }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Bio</label>
                  <textarea rows={3} value={profile.bio} onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Facebook</label>
                  <input value={profile.socialLinks.facebook} onChange={(e) => setProfile(p => ({ ...p, socialLinks: { ...p.socialLinks, facebook: e.target.value } }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Twitter</label>
                  <input value={profile.socialLinks.twitter} onChange={(e) => setProfile(p => ({ ...p, socialLinks: { ...p.socialLinks, twitter: e.target.value } }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Instagram</label>
                  <input value={profile.socialLinks.instagram} onChange={(e) => setProfile(p => ({ ...p, socialLinks: { ...p.socialLinks, instagram: e.target.value } }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">YouTube</label>
                  <input value={profile.socialLinks.youtube} onChange={(e) => setProfile(p => ({ ...p, socialLinks: { ...p.socialLinks, youtube: e.target.value } }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div className="mt-6">
                <button disabled={savingProfile} type="submit" className="px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-semibold">
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>

            {/* Bank Details */}
            <form onSubmit={saveBank} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bank Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Account Holder Name</label>
                  <input value={bank.accountHolderName} onChange={(e) => setBank(b => ({ ...b, accountHolderName: e.target.value }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Account Number</label>
                  <input value={bank.accountNumber} onChange={(e) => setBank(b => ({ ...b, accountNumber: e.target.value }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Bank Name</label>
                  <input value={bank.bankName} onChange={(e) => setBank(b => ({ ...b, bankName: e.target.value }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">IFSC Code</label>
                  <input value={bank.ifscCode} onChange={(e) => setBank(b => ({ ...b, ifscCode: e.target.value }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Branch Name</label>
                  <input value={bank.branchName} onChange={(e) => setBank(b => ({ ...b, branchName: e.target.value }))} className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div className="mt-6">
                <button disabled={savingBank} type="submit" className="px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-semibold">
                  {savingBank ? 'Saving...' : 'Save Bank Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <UnifiedFooter />
    </MobileAppWrapper>
  );
};

export default SettingsPage;


