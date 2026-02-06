import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType } from '../types';
import { authAPI } from '../api/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to check if token is valid
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? (JSON.parse(savedUser) as User) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('token');
    return isTokenValid(savedToken) ? savedToken : null;
  });

  // Sync state with localStorage on mount and storage events
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        
        if (savedUser && isTokenValid(savedToken)) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (e) {
        console.error('Error syncing auth state:', e);
      }
    };

    // Check on mount
    handleStorageChange();

    // Listen for storage events (when other tabs update localStorage)
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authAPI.login(email, password);
    const { token: newToken, user: newUser } = response.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const signup = async (email: string, name: string, password: string): Promise<void> => {
    const response = await authAPI.signup(email, name, password);
    const { token: newToken, user: newUser } = response.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Auto-logout if token expires
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiresAt = payload.exp * 1000;
        const timeUntilExpiry = expiresAt - Date.now();
        
        if (timeUntilExpiry > 0) {
          const timeout = setTimeout(() => {
            logout();
          }, timeUntilExpiry);
          return () => clearTimeout(timeout);
        } else {
          logout();
        }
      } catch (e) {
        logout();
      }
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
