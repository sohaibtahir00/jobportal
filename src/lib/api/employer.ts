/**
 * Employer API Client
 * Handles all employer profile-related API calls
 */

import api from '../api';
import type { Employer } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface EmployerProfileData {
  companyName?: string;
  companyWebsite?: string;
  companyDescription?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface EmployerProfileResponse {
  employer: Employer;
  stats: {
    activeJobs: number;
    totalApplications: number;
    newApplications: number;
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * GET /api/employers/profile - Get employer profile
 */
export async function getEmployerProfile(): Promise<EmployerProfileResponse> {
  try {
    console.log('[Employer API] Fetching employer profile...');

    const response = await api.get<EmployerProfileResponse>('/api/employers/profile');

    console.log('[Employer API] Employer profile fetched successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Employer API] Failed to fetch employer profile:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * POST /api/employers/profile - Create employer profile
 */
export async function createEmployerProfile(
  data: EmployerProfileData
): Promise<EmployerProfileResponse> {
  try {
    console.log('[Employer API] Creating employer profile...');

    const response = await api.post<EmployerProfileResponse>('/api/employers/profile', data);

    console.log('[Employer API] Employer profile created successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Employer API] Failed to create employer profile:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * PATCH /api/employers/profile - Update employer profile
 */
export async function updateEmployerProfile(
  data: Partial<EmployerProfileData>
): Promise<EmployerProfileResponse> {
  try {
    console.log('[Employer API] Updating employer profile...');

    const response = await api.patch<EmployerProfileResponse>('/api/employers/profile', data);

    console.log('[Employer API] Employer profile updated successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Employer API] Failed to update employer profile:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * POST /api/employers/logo - Upload company logo
 */
export async function uploadEmployerLogo(file: File): Promise<{ logoUrl: string }> {
  try {
    console.log('[Employer API] Uploading company logo...');

    const formData = new FormData();
    formData.append('logo', file);

    const response = await api.post<{ logoUrl: string }>('/api/employers/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[Employer API] Company logo uploaded successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Employer API] Failed to upload company logo:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/employers/stats - Get employer statistics
 */
export async function getEmployerStats(): Promise<any> {
  try {
    console.log('[Employer API] Fetching employer stats...');

    const response = await api.get('/api/employers/stats');

    console.log('[Employer API] Employer stats fetched successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Employer API] Failed to fetch employer stats:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/employers/[id] - Get public employer profile
 */
export async function getEmployerById(id: string): Promise<Employer> {
  try {
    console.log('[Employer API] Fetching employer by ID:', id);

    const response = await api.get<Employer>(`/api/employers/${id}`);

    console.log('[Employer API] Employer fetched successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Employer API] Failed to fetch employer:', error.response?.data || error.message);
    throw error;
  }
}
