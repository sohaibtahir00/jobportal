/**
 * Profile API Functions
 * Strongly typed API calls for profile management endpoints
 * Backend documentation: docs/API_REFERENCE.md
 */

import api from '../api';
import type { User } from '@/types';
import type { ErrorResponse } from '../api-types';

/**
 * Profile response from GET /api/profile
 * Backend returns user + role-specific profile data
 */
export interface GetProfileResponse {
  user: User;
  profile: any; // Role-specific: Candidate or Employer profile with nested data
}

/**
 * Update profile request for PATCH /api/profile
 */
export interface UpdateProfileRequest {
  name?: string;
  image?: string;
}

/**
 * Update profile response from PATCH /api/profile
 */
export interface UpdateProfileResponse {
  message: string;
  user: User;
}

/**
 * GET /api/profile (via axios with session headers)
 * Get current user's profile with role-specific data
 *
 * Returns user data with nested candidate or employer profile
 * based on the user's role.
 *
 * @returns Promise with user profile data
 * @throws Error with backend error message
 */
export async function getProfile(): Promise<GetProfileResponse> {
  try {
    console.log('[Profile API] Fetching profile via Next.js proxy...');

    // Use Next.js API route proxy to avoid CORS (frontend-only solution)
    const response = await fetch('/api/proxy/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // Important for Next.js API routes
    });

    console.log('[Profile API] Proxy response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch profile' }));
      console.error('[Profile API] Proxy error response:', errorData);
      throw new Error(errorData.error || 'Failed to fetch profile');
    }

    const data = await response.json();
    console.log('[Profile API] Profile fetched successfully via proxy:', data);
    return data;
  } catch (error: any) {
    console.error('[Profile API] Error:', error);

    const errorMessage = error.message || 'Failed to fetch profile. Please try again.';

    // Handle specific errors
    if (errorMessage.includes('Authentication required') || errorMessage.includes('Unauthorized')) {
      throw new Error('You must be logged in to view your profile.');
    }

    if (errorMessage.includes('not found')) {
      throw new Error('Profile not found. Please contact support.');
    }

    throw new Error(errorMessage);
  }
}

/**
 * PATCH /api/profile (via axios with session headers)
 * Update user profile (name, image)
 *
 * Only updates basic user fields. For role-specific updates:
 * - Candidates: use /api/candidates/profile
 * - Employers: use /api/employers/profile
 *
 * @param data Profile update data
 * @returns Promise with updated user data
 * @throws Error with backend error message
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  try {
    console.log('[Profile API] Updating profile via Next.js proxy...');

    // Use Next.js API route proxy to avoid CORS (frontend-only solution)
    const response = await fetch('/api/proxy/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // Important for Next.js API routes
      body: JSON.stringify(data),
    });

    console.log('[Profile API] Proxy update response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to update profile' }));
      console.error('[Profile API] Proxy update error response:', errorData);
      throw new Error(errorData.error || 'Failed to update profile');
    }

    const result = await response.json();
    console.log('[Profile API] Profile updated successfully via proxy:', result);
    return result;
  } catch (error: any) {
    console.error('[Profile API] Update error:', error);

    const errorMessage = error.message || 'Failed to update profile. Please try again.';

    // Handle specific errors
    if (errorMessage.includes('Authentication required') || errorMessage.includes('Unauthorized')) {
      throw new Error('You must be logged in to update your profile.');
    }

    if (errorMessage.includes('validation')) {
      throw new Error(errorMessage);
    }

    throw new Error(errorMessage);
  }
}
