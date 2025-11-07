/**
 * useProfile Hook
 * React hook for managing user profile data
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getProfile, updateProfile, type GetProfileResponse, type UpdateProfileRequest } from '@/lib/api/profile';
import type { User } from '@/types';

interface UseProfileReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateUserProfile: (data: UpdateProfileRequest) => Promise<void>;
}

/**
 * Hook to fetch and manage user profile
 *
 * Automatically fetches profile when user is authenticated
 * Provides methods to refresh and update profile
 *
 * @example
 * ```tsx
 * const { profile, loading, error, updateUserProfile } = useProfile();
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 *
 * return <div>Welcome, {profile?.name}</div>;
 * ```
 */
export function useProfile(): UseProfileReturn {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user profile from backend
   */
  const fetchProfile = async () => {
    // Don't fetch if not authenticated
    if (status === 'unauthenticated') {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Wait for session to load
    if (status === 'loading') {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getProfile();
      setProfile(response.user);
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError(err.message || 'Failed to load profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh profile data from backend
   */
  const refreshProfile = async () => {
    await fetchProfile();
  };

  /**
   * Update user profile
   *
   * @param data Profile update data (name, image)
   */
  const updateUserProfile = async (data: UpdateProfileRequest) => {
    try {
      setError(null);

      const response = await updateProfile(data);
      setProfile(response.user);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile');
      throw err; // Re-throw so caller can handle
    }
  };

  // Fetch profile when session changes
  useEffect(() => {
    fetchProfile();
  }, [session, status]);

  return {
    profile,
    loading,
    error,
    refreshProfile,
    updateUserProfile,
  };
}
