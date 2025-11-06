"use client";

import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';

/**
 * Custom hook to access authentication context
 *
 * @throws {Error} If used outside of AuthProvider
 * @returns {AuthContextType} Authentication context value
 *
 * @example
 * ```tsx
 * const { user, login, logout, isAuthenticated } = useAuth();
 *
 * // Check if user is authenticated
 * if (isAuthenticated) {
 *   console.log('User:', user);
 * }
 *
 * // Login
 * await login({ email: 'user@example.com', password: 'password' });
 *
 * // Logout
 * logout();
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default useAuth;
