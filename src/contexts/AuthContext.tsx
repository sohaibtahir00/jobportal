"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setAuthToken, getAuthToken, removeAuthToken } from '@/lib/auth-helpers';

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'candidate' | 'employer';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  role: 'candidate' | 'employer';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user from token on mount
  const loadUser = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Fetch user data
      const response = await api.get('/api/auth/me');
      const userData = response.data.user || response.data;

      // Transform user role to lowercase for frontend consistency
      if (userData.role) {
        userData.role = userData.role.toLowerCase();
      }

      setUser(userData);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load user:', err);
      // Token is invalid, remove it
      removeAuthToken();
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', credentials);

      const { token, user: userData } = response.data;

      // Transform user role to lowercase for frontend consistency
      if (userData.role) {
        userData.role = userData.role.toLowerCase();
      }

      // Store token in both localStorage and cookie
      setAuthToken(token);

      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user
      setUser(userData);

      // Redirect based on role
      if (userData.role === 'employer') {
        router.push('/employer/dashboard');
      } else {
        router.push('/candidate/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.error ||
                          'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (data: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Transform data to match backend expectations
      const requestData = {
        email: data.email,
        password: data.password,
        name: data.fullName, // Backend expects 'name', not 'fullName'
        role: data.role.toUpperCase(), // Backend expects uppercase role (CANDIDATE or EMPLOYER)
      };

      const response = await api.post('/api/auth/register', requestData);

      const { token, user: userData } = response.data;

      // Transform user role back to lowercase for frontend consistency
      if (userData.role) {
        userData.role = userData.role.toLowerCase();
      }

      // Store token in both localStorage and cookie
      setAuthToken(token);

      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user
      setUser(userData);

      // Redirect based on role
      if (userData.role === 'employer') {
        router.push('/employer/dashboard');
      } else {
        router.push('/candidate/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.error ||
                          'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    removeAuthToken();
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
    router.push('/login');
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
