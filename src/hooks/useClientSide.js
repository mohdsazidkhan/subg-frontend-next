import { useState, useEffect } from 'react';

/**
 * Hook to safely handle client-side only operations
 * Prevents hydration mismatches by ensuring code only runs on client
 */
export const useClientSide = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

/**
 * Hook to safely get values from localStorage
 * Returns null during SSR and actual value on client
 */
export const useLocalStorage = (key, defaultValue = null) => {
  const [value, setValue] = useState(defaultValue);
  const isClient = useClientSide();

  useEffect(() => {
    if (isClient) {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        try {
          setValue(JSON.parse(stored));
        } catch {
          setValue(stored);
        }
      }
    }
  }, [key, isClient]);

  const setStoredValue = (newValue) => {
    setValue(newValue);
    if (isClient) {
      if (newValue === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    }
  };

  return [value, setStoredValue];
};

/**
 * Hook to safely check authentication status
 * Prevents hydration mismatches by only checking on client
 */
export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const isClient = useClientSide();

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('userInfo');
      
      setIsAuthenticated(!!token);
      
      if (userInfo) {
        try {
          setUser(JSON.parse(userInfo));
        } catch {
          setUser(null);
        }
      }
    }
  }, [isClient]);

  return { isAuthenticated, user, isClient };
};
