import { useState, useEffect } from 'react';
import API from '../utils/api';

const useRewards = (userId) => {
  const [rewards, setRewards] = useState({
    unlocked: [],
    claimed: [],
    locked: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchRewards();
    }
  }, [userId]);

  const fetchRewards = async () => {
    try {
        setLoading(true);
      setError(null);
      
      const response = await API.request(`/api/student/rewards/${userId}`);
      setRewards(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rewards');
      console.error('Rewards fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId) => {
    try {
      setError(null);
      
      const response = await API.request(`/api/student/rewards/${rewardId}/claim`, {
        method: 'POST'
      });
      
      // Update local state
      setRewards(prev => ({
        ...prev,
        claimed: [...prev.claimed, response],
        unlocked: prev.unlocked.filter(reward => reward.id !== rewardId)
      }));
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to claim reward');
      throw err;
    }
  };

  const getRewardStatus = (level) => {
    const unlocked = rewards.unlocked.find(reward => reward.level === level);
    const claimed = rewards.claimed.find(reward => reward.level === level);
    const locked = rewards.locked.find(reward => reward.level === level);

    if (claimed) return 'claimed';
    if (unlocked) return 'unlocked';
    if (locked) return 'locked';
    return 'locked';
  };

  const getClaimableRewards = () => {
    return rewards.unlocked.filter(reward => !reward.claimed);
  };

  const getClaimedRewards = () => {
    return rewards.claimed;
  };

  const getLockedRewards = () => {
    return rewards.locked;
  };

  const getTotalRewardsValue = () => {
    const claimed = rewards.claimed.reduce((sum, reward) => sum + (reward.value || 0), 0);
    const claimable = rewards.unlocked.reduce((sum, reward) => sum + (reward.value || 0), 0);
    return { claimed, claimable, total: claimed + claimable };
  };

  const refreshRewards = () => {
    if (userId) {
    fetchRewards();
    }
  };

  return {
    rewards,
    loading,
    error,
    claimReward,
    getRewardStatus,
    getClaimableRewards,
    getClaimedRewards,
    getLockedRewards,
    getTotalRewardsValue,
    refreshRewards
  };
};

export { useRewards };
export default useRewards;