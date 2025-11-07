/**
 * Applications API Client
 * Handles all job application-related API calls
 */

import api from '../api';
import type { Application } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface SubmitApplicationData {
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
  availability?: string;
}

export interface GetApplicationsParams {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  jobId?: string;
}

export interface GetApplicationsResponse {
  applications: Application[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApplicationResponse {
  message: string;
  application: Application;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * POST /api/applications - Submit a job application (candidate only)
 */
export async function submitApplication(
  applicationData: SubmitApplicationData
): Promise<ApplicationResponse> {
  try {
    console.log('[Applications API] Submitting application for job:', applicationData.jobId);

    const response = await api.post<ApplicationResponse>('/api/applications', applicationData);

    console.log('[Applications API] Application submitted successfully:', response.data.application.id);

    return response.data;
  } catch (error: any) {
    console.error('[Applications API] Failed to submit application:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/applications - Get user's job applications
 */
export async function getApplications(
  params?: GetApplicationsParams
): Promise<GetApplicationsResponse> {
  try {
    console.log('[Applications API] Fetching applications with params:', params);

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/applications${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await api.get<GetApplicationsResponse>(url);

    console.log('[Applications API] Applications fetched:', response.data.applications.length);

    return response.data;
  } catch (error: any) {
    console.error('[Applications API] Failed to fetch applications:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/applications/[id] - Get application by ID
 */
export async function getApplicationById(id: string): Promise<Application> {
  try {
    console.log('[Applications API] Fetching application:', id);

    const response = await api.get<Application>(`/api/applications/${id}`);

    console.log('[Applications API] Application fetched successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Applications API] Failed to fetch application:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * PATCH /api/applications/[id]/status - Update application status (employer only)
 */
export async function updateApplicationStatus(
  id: string,
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED'
): Promise<ApplicationResponse> {
  try {
    console.log('[Applications API] Updating application status:', id, status);

    const response = await api.patch<ApplicationResponse>(`/api/applications/${id}/status`, {
      status,
    });

    console.log('[Applications API] Application status updated successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Applications API] Failed to update application status:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * DELETE /api/applications/[id] - Withdraw application (candidate only)
 */
export async function withdrawApplication(id: string): Promise<{ message: string }> {
  try {
    console.log('[Applications API] Withdrawing application:', id);

    const response = await api.delete<{ message: string }>(`/api/applications/${id}`);

    console.log('[Applications API] Application withdrawn successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Applications API] Failed to withdraw application:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/applications/job/[jobId] - Get all applications for a specific job (employer only)
 */
export async function getJobApplications(
  jobId: string,
  params?: { page?: number; limit?: number; status?: string }
): Promise<GetApplicationsResponse> {
  try {
    console.log('[Applications API] Fetching applications for job:', jobId);

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/applications/job/${jobId}${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await api.get<GetApplicationsResponse>(url);

    console.log('[Applications API] Job applications fetched:', response.data.applications.length);

    return response.data;
  } catch (error: any) {
    console.error('[Applications API] Failed to fetch job applications:', error.response?.data || error.message);
    throw error;
  }
}
