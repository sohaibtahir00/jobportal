/**
 * Jobs API Client
 * Handles all job-related API calls
 */

import api from '../api';
import type { Job } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface GetJobsParams {
  page?: number;
  limit?: number;
  niche?: string;
  location?: string;
  remoteType?: 'REMOTE' | 'HYBRID' | 'ONSITE';
  experienceLevel?: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  salaryMin?: number;
  salaryMax?: number;
  search?: string;
  employerId?: string;
}

export interface GetJobsResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateJobData {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  location: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel: 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR_LEVEL' | 'EXECUTIVE';
  skills?: string[];
  benefits?: string;
  deadline?: string;
  slots?: number;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * GET /api/jobs - List all active jobs with pagination and filters
 */
export async function getJobs(params?: GetJobsParams): Promise<GetJobsResponse> {
  try {
    console.log('[Jobs API] Fetching jobs with params:', params);

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/jobs${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await api.get<GetJobsResponse>(url);

    console.log('[Jobs API] Jobs fetched successfully:', {
      count: response.data.jobs.length,
      totalPages: response.data.pagination?.totalPages,
    });

    return response.data;
  } catch (error: any) {
    console.error('[Jobs API] Failed to fetch jobs:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/jobs/[id] - Get job details by ID
 * Now returns { job, candidateInfo } if authenticated
 */
export async function getJobById(id: string): Promise<any> {
  try {
    console.log('[Jobs API] Fetching job by ID:', id);

    const response = await api.get<any>(`/api/jobs/${id}`);

    console.log('[Jobs API] Job fetched successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Jobs API] Failed to fetch job:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * POST /api/jobs - Create a new job posting (employer only)
 */
export async function createJob(jobData: CreateJobData): Promise<{ message: string; job: Job }> {
  try {
    console.log('[Jobs API] Creating job with full payload:', jobData);

    const response = await api.post<{ message: string; job: Job }>('/api/jobs', jobData);

    console.log('[Jobs API] Job created successfully:', response.data.job.id);

    return response.data;
  } catch (error: any) {
    console.error('[Jobs API] Create job error - Full details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.response?.data?.message);
    console.error('Validation Errors:', error.response?.data?.errors);
    console.error('Payload sent:', jobData);
    throw error;
  }
}

/**
 * PATCH /api/jobs/[id] - Update job posting
 */
export async function updateJob(
  id: string,
  updates: Partial<CreateJobData>
): Promise<{ message: string; job: Job }> {
  try {
    console.log('[Jobs API] Updating job:', id);

    const response = await api.patch<{ message: string; job: Job }>(`/api/jobs/${id}`, updates);

    console.log('[Jobs API] Job updated successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Jobs API] Failed to update job:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * DELETE /api/jobs/[id] - Delete job posting
 */
export async function deleteJob(id: string): Promise<{ message: string }> {
  try {
    console.log('[Jobs API] Deleting job:', id);

    const response = await api.delete<{ message: string }>(`/api/jobs/${id}`);

    console.log('[Jobs API] Job deleted successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Jobs API] Failed to delete job:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * POST /api/jobs/[id]/claim - Claim an aggregated job posting
 */
export async function claimJob(
  id: string,
  claimData: {
    phone: string;
    roleLevel: string;
    salaryMin?: number;
    salaryMax?: number;
    startDateNeeded?: string;
    candidatesNeeded?: number;
  }
): Promise<{
  message: string;
  job: Job;
  claimMetadata: any;
  stats: { totalApplicants: number; skillsVerifiedApplicants: number };
  nextSteps: string[];
}> {
  try {
    console.log('[Jobs API] Claiming job:', id);

    const response = await api.post(
      `/api/jobs/${id}/claim`,
      claimData
    );

    console.log('[Jobs API] Job claimed successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Jobs API] Failed to claim job:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/employers/claimed-jobs - Get employer's claimed jobs
 */
export async function getClaimedJobs(): Promise<{
  claimedJobs: any[];
  totalClaimed: number;
  totalApplicants: number;
  totalSkillsVerified: number;
}> {
  try {
    console.log('[Jobs API] Fetching claimed jobs');

    const response = await api.get('/api/employers/claimed-jobs');

    console.log('[Jobs API] Claimed jobs fetched successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Jobs API] Failed to fetch claimed jobs:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/employers/search-jobs - Search for unclaimed jobs by company name
 */
export async function searchUnclaimedJobs(companyName: string): Promise<{
  jobs: any[];
  searchQuery: string;
  pagination: any;
  message: string;
}> {
  try {
    console.log('[Jobs API] Searching unclaimed jobs for:', companyName);

    const response = await api.get(`/api/employers/search-jobs?companyName=${encodeURIComponent(companyName)}`);

    console.log('[Jobs API] Unclaimed jobs search completed');

    return response.data;
  } catch (error: any) {
    console.error('[Jobs API] Failed to search unclaimed jobs:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/jobs/search - Advanced job search
 */
export async function searchJobs(searchParams: GetJobsParams): Promise<GetJobsResponse> {
  try {
    console.log('[Jobs API] Searching jobs:', searchParams);

    const response = await api.get<GetJobsResponse>('/api/jobs/search', {
      params: searchParams,
    });

    console.log('[Jobs API] Search completed:', response.data.jobs.length, 'results');

    return response.data;
  } catch (error: any) {
    console.error('[Jobs API] Search failed:', error.response?.data || error.message);
    throw error;
  }
}
