/**
 * Saved Jobs API Client
 * Handles all saved jobs-related API calls
 */

import api from '../api';

// ============================================================================
// TYPES
// ============================================================================

export interface SavedJob {
  id: string;
  savedAt: string;
  notes: string | null;
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    remote: boolean;
    type: string;
    status: string;
    salaryMin: number | null;
    salaryMax: number | null;
    experienceLevel: string;
    skills: string[];
    isClaimed: boolean;
    createdAt: string;
    employer: {
      companyName: string;
      companyLogo: string | null;
      location: string | null;
    };
    applicationCount: number;
  };
  hasApplied: boolean;
  application: {
    status: string;
    appliedAt: string;
  } | null;
}

export interface GetSavedJobsParams {
  limit?: number;
  offset?: number;
  sortBy?: 'savedAt' | 'salary';
  order?: 'asc' | 'desc';
}

export interface GetSavedJobsResponse {
  savedJobs: SavedJob[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * GET /api/candidates/saved-jobs - Get all saved jobs
 */
export async function getSavedJobs(params?: GetSavedJobsParams): Promise<GetSavedJobsResponse> {
  try {
    console.log('[Saved Jobs API] Fetching saved jobs with params:', params);

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/candidates/saved-jobs${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await api.get<GetSavedJobsResponse>(url);

    console.log('[Saved Jobs API] Saved jobs fetched:', response.data.savedJobs.length);

    return response.data;
  } catch (error: any) {
    console.error('[Saved Jobs API] Failed to fetch saved jobs:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * POST /api/jobs/[id]/save - Save a job
 */
export async function saveJob(jobId: string, notes?: string): Promise<{ message: string; savedJob: SavedJob }> {
  try {
    console.log('[Saved Jobs API] Saving job:', jobId);

    const response = await api.post<{ message: string; savedJob: SavedJob }>(
      `/api/jobs/${jobId}/save`,
      notes ? { notes } : {}
    );

    console.log('[Saved Jobs API] Job saved successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Saved Jobs API] Failed to save job:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * DELETE /api/jobs/[id]/save - Unsave a job
 */
export async function unsaveJob(jobId: string): Promise<{ message: string }> {
  try {
    console.log('[Saved Jobs API] Unsaving job:', jobId);

    const response = await api.delete<{ message: string }>(`/api/jobs/${jobId}/save`);

    console.log('[Saved Jobs API] Job unsaved successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Saved Jobs API] Failed to unsave job:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * DELETE /api/candidates/saved-jobs - Clear all saved jobs
 */
export async function clearAllSavedJobs(): Promise<{ message: string; count: number }> {
  try {
    console.log('[Saved Jobs API] Clearing all saved jobs');

    const response = await api.delete<{ message: string; count: number }>('/api/candidates/saved-jobs');

    console.log('[Saved Jobs API] All saved jobs cleared:', response.data.count);

    return response.data;
  } catch (error: any) {
    console.error('[Saved Jobs API] Failed to clear saved jobs:', error.response?.data || error.message);
    throw error;
  }
}
