/**
 * Candidate API Functions
 * Strongly typed API calls for candidate profile endpoints
 * Backend documentation: docs/API_REFERENCE.md & CANDIDATE_PROFILE_BACKEND_ANALYSIS.md
 */

import api from '../api';
import type {
  Candidate,
  CandidateProfileResponse,
  UpdateCandidateProfileData
} from '@/types';

/**
 * GET /api/candidates/profile
 * Get current candidate's full profile with related data
 *
 * Returns:
 * - Candidate profile
 * - Last 10 applications (with job details)
 * - Last 5 test results
 * - All placements
 * - Profile completion status
 *
 * Auth: Required (CANDIDATE or ADMIN role via NextAuth session)
 *
 * @returns Promise with full candidate profile data
 * @throws Error with backend error message
 */
export async function getCandidateProfile(): Promise<CandidateProfileResponse> {
  try {
    console.log('[Candidate API] Fetching candidate profile...');

    const response = await api.get<CandidateProfileResponse>('/api/candidates/profile');

    console.log('[Candidate API] Profile fetched successfully:', {
      hasProfile: !!response.data.candidate,
      completion: response.data.profileCompletion?.percentage,
      applicationsCount: response.data.candidate?.applications?.length,
    });

    return response.data;
  } catch (error: any) {
    // ✅ DETAILED ERROR LOGGING FOR DEBUGGING
    console.error('[Candidate API] Get profile error - FULL DETAILS:');
    console.error('1. Error object:', error);
    console.error('2. Error message:', error.message);
    console.error('3. Error code:', error.code);
    console.error('4. Error name:', error.name);
    console.error('5. Response data:', error.response?.data);
    console.error('6. Response status:', error.response?.status);
    console.error('7. Response statusText:', error.response?.statusText);
    console.error('8. Response headers:', error.response?.headers);
    console.error('9. Request URL:', error.config?.url);
    console.error('10. Request method:', error.config?.method);
    console.error('11. Request headers:', error.config?.headers);
    console.error('12. Is network error:', !error.response);

    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.message ||
                        error.message ||
                        'Failed to fetch candidate profile';

    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to view your profile.');
    }

    if (error.response?.status === 403) {
      throw new Error('Insufficient permissions. Candidate role required.');
    }

    if (error.response?.status === 404) {
      throw new Error('Candidate profile not found. Please create your profile first.');
    }

    throw new Error(errorMessage);
  }
}

/**
 * POST /api/candidates/profile
 * Create a new candidate profile (typically after signup)
 *
 * Auth: Required (CANDIDATE or ADMIN role)
 *
 * @param data Profile data to create
 * @returns Promise with created candidate profile
 * @throws Error with backend error message
 */
export async function createCandidateProfile(
  data: UpdateCandidateProfileData
): Promise<CandidateProfileResponse> {
  try {
    console.log('[Candidate API] Creating candidate profile...');

    const response = await api.post<CandidateProfileResponse>(
      '/api/candidates/profile',
      data
    );

    console.log('[Candidate API] Profile created successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Candidate API] Create profile error:', error);

    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Failed to create candidate profile';

    // Handle specific error cases
    if (error.response?.status === 400) {
      // Check if profile already exists
      if (errorMessage.includes('already exists')) {
        throw new Error('Profile already exists. Please use update instead.');
      }

      // Validation errors
      if (error.response?.data?.validTypes) {
        throw new Error(`Invalid job type. Valid types: ${error.response.data.validTypes.join(', ')}`);
      }

      throw new Error(errorMessage);
    }

    if (error.response?.status === 401) {
      throw new Error('You must be logged in to create a profile.');
    }

    if (error.response?.status === 403) {
      throw new Error('Insufficient permissions. Candidate role required.');
    }

    throw new Error(errorMessage);
  }
}

/**
 * PATCH /api/candidates/profile
 * Update existing candidate profile
 *
 * All fields are optional - only send fields you want to update
 *
 * Auth: Required (CANDIDATE or ADMIN role)
 *
 * @param data Partial profile data to update
 * @returns Promise with updated candidate profile
 * @throws Error with backend error message
 */
export async function updateCandidateProfile(
  data: UpdateCandidateProfileData
): Promise<CandidateProfileResponse> {
  try {
    console.log('[Candidate API] Updating candidate profile...', {
      fields: Object.keys(data),
    });

    const response = await api.patch<CandidateProfileResponse>(
      '/api/candidates/profile',
      data
    );

    console.log('[Candidate API] Profile updated successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Candidate API] Update profile error:', error);

    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Failed to update candidate profile';

    // Handle specific error cases
    if (error.response?.status === 400) {
      // Validation errors
      if (error.response?.data?.validTypes) {
        throw new Error(`Invalid job type. Valid types: ${error.response.data.validTypes.join(', ')}`);
      }

      throw new Error(errorMessage);
    }

    if (error.response?.status === 401) {
      throw new Error('You must be logged in to update your profile.');
    }

    if (error.response?.status === 403) {
      throw new Error('Insufficient permissions. Candidate role required.');
    }

    if (error.response?.status === 404) {
      throw new Error('Profile not found. Please create your profile first.');
    }

    throw new Error(errorMessage);
  }
}

/**
 * PATCH /api/candidates/profile/status
 * Update only the availability status
 *
 * Auth: Required (CANDIDATE or ADMIN role)
 *
 * @param availability New availability status
 * @returns Promise with updated candidate
 * @throws Error with backend error message
 */
export async function updateAvailabilityStatus(
  availability: boolean
): Promise<{ message: string; candidate: Candidate }> {
  try {
    console.log('[Candidate API] Updating availability status:', availability);

    const response = await api.patch<{ message: string; candidate: Candidate }>(
      '/api/candidates/profile/status',
      { availability }
    );

    console.log('[Candidate API] Availability updated successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Candidate API] Update status error:', error);

    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Failed to update availability status';

    // Handle specific error cases
    if (error.response?.status === 400) {
      throw new Error('Invalid availability value. Must be true or false.');
    }

    if (error.response?.status === 401) {
      throw new Error('You must be logged in to update your status.');
    }

    if (error.response?.status === 403) {
      throw new Error('Insufficient permissions. Candidate role required.');
    }

    if (error.response?.status === 404) {
      throw new Error('Profile not found. Please create your profile first.');
    }

    throw new Error(errorMessage);
  }
}

/**
 * GET /api/candidates/[id]
 * Get public candidate profile by ID (used by employers)
 *
 * Returns limited public data only (no sensitive information)
 *
 * Auth: NOT required (public endpoint)
 *
 * @param id Candidate ID (not userId!)
 * @returns Promise with public candidate profile
 * @throws Error with backend error message
 */
export async function getCandidateById(
  id: string
): Promise<CandidateProfileResponse> {
  try {
    console.log('[Candidate API] Fetching public candidate profile:', id);

    const response = await api.get<CandidateProfileResponse>(
      `/api/candidates/${id}`
    );

    console.log('[Candidate API] Public profile fetched successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Candidate API] Get candidate by ID error:', error);

    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Failed to fetch candidate profile';

    if (error.response?.status === 404) {
      throw new Error('Candidate not found');
    }

    throw new Error(errorMessage);
  }
}
