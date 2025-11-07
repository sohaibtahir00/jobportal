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
 * GET /api/profile
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
    const response = await api.get<GetProfileResponse>('/api/profile');
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Failed to fetch profile. Please try again.';

    // Handle specific errors
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to view your profile.');
    }

    if (error.response?.status === 404) {
      throw new Error('Profile not found. Please contact support.');
    }

    throw new Error(errorMessage);
  }
}

/**
 * PATCH /api/profile
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
    const response = await api.patch<UpdateProfileResponse>('/api/profile', data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Failed to update profile. Please try again.';

    // Handle specific errors
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to update your profile.');
    }

    if (error.response?.status === 400 && error.response?.data?.details) {
      const details = Array.isArray(error.response.data.details)
        ? error.response.data.details.join(', ')
        : error.response.data.details;
      throw new Error(details);
    }

    throw new Error(errorMessage);
  }
}
