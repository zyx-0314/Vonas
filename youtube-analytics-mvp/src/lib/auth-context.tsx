/**
 * Module: lib/auth-context.tsx
 * Purpose: React context for authentication state management.
 * Provides:
 *   - User authentication state
 *   - Login/logout functions
 *   - Loading states
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import api from './axios-config';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = Cookies.get('auth-token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        Cookies.remove('auth-token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      Cookies.remove('auth-token');
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        // Store token in cookie
        Cookies.set('auth-token', response.data.token, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Request config:', error.config);
        
        // Return server error message if available
        if (error.response?.data?.error) {
          return { success: false, error: error.response.data.error };
        }
        
        // Return status-based error message
        if (error.response?.status === 401) {
          return { success: false, error: 'Invalid credentials' };
        }
        
        if (error.response && error.response.status >= 500) {
          return { success: false, error: 'Server error occurred' };
        }
      }
      
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout API failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Logout error details:', error.response?.data);
      }
    } finally {
      Cookies.remove('auth-token');
      setUser(null);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}