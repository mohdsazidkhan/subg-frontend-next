import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getToken, logout } from '../lib/utils/authUtils';
import API from '../lib/api';

export const useTokenValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const router = useRouter();

  const validateToken = useCallback(async () => {
    if (!isAuthenticated()) {
      setIsValid(false);
      return false;
    }

    try {
      setIsValidating(true);
      const token = getToken();
      
      // Validate token with backend (API automatically adds Authorization header)
      const response = await API.request('/api/auth/validate');
      
      if (response.valid) {
        setIsValid(true);
        return true;
      } else {
        setIsValid(false);
        logout();
        router.push('/login');
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setIsValid(false);
      logout();
      router.push('/login');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [router]);

  const refreshToken = useCallback(async () => {
    if (!isAuthenticated()) {
      return false;
    }

    try {
      setIsValidating(true);
      const response = await API.request('/api/auth/refresh', {
        method: 'POST'
      });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        setIsValid(true);
        return true;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      setIsValid(false);
      logout();
      router.push('/login');
    } finally {
      setIsValidating(false);
    }

    return false;
  }, [router]);

  const checkAuthStatus = useCallback(async () => {
    if (!isAuthenticated()) {
      setIsValid(false);
      return false;
    }

    // If we already validated recently, don't validate again
    if (isValid !== null && !isValidating) {
      return isValid;
    }

    return await validateToken();
  }, [isValid, isValidating, validateToken]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Auto-refresh token every 30 minutes
  useEffect(() => {
    if (!isAuthenticated() || !isValid) return;

    const interval = setInterval(() => {
      refreshToken();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [isValid, refreshToken]);

  return {
    isValid,
    isValidating,
    validateToken,
    refreshToken,
    checkAuthStatus
  };
};

export default useTokenValidation;