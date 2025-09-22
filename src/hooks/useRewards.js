import { useState, useEffect } from 'react';
import API from '../lib/api'

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
      
      // Mock rewards data since the endpoint might not exist yet
      const mockRewards = {
        unlocked: [],
        claimed: [],
        locked: [
          { id: 1, level: 1, title: 'First Quiz', description: 'Complete your first quiz', value: 10, type: 'coin' },
          { id: 2, level: 5, title: 'Quiz Master', description: 'Complete 5 quizzes', value: 50, type: 'coin' },
          { id: 3, level: 10, title: 'Knowledge Seeker', description: 'Complete 10 quizzes', value: 100, type: 'coin' },
          { id: 4, level: 25, title: 'Quiz Champion', description: 'Complete 25 quizzes', value: 250, type: 'coin' },
          { id: 5, level: 50, title: 'Quiz Legend', description: 'Complete 50 quizzes', value: 500, type: 'coin' }
        ]
      };
      
      setRewards(mockRewards);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rewards');
      console.error('Rewards fetch error:', err);
      // Set default empty rewards on error
      setRewards({
        unlocked: [],
        claimed: [],
        locked: []
      });
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId) => {
    try {
      setError(null);
      
      // Mock claim reward since the endpoint might not exist yet
      const mockReward = {
        id: rewardId,
        title: 'Mock Reward',
        description: 'This is a mock reward',
        value: 100,
        type: 'coin',
        claimedAt: new Date().toISOString()
      };
      
      // Update local state
      setRewards(prev => ({
        ...prev,
        claimed: [...prev.claimed, mockReward],
        unlocked: prev.unlocked.filter(reward => reward.id !== rewardId)
      }));
      
      return mockReward;
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