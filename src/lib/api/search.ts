/**
 * Search API Client
 * Handles advanced search operations across jobs and candidates
 */

import api from '../api';
import type { Job } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface JobSearchParams {
  query: string;
  niche?: string;
  location?: string;
  remoteType?: 'REMOTE' | 'HYBRID' | 'ONSITE';
  experienceLevel?: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}

export interface CandidateSearchParams {
  query: string;
  skills?: string[];
  location?: string;
  experience?: number;
  availability?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchResponse<T> {
  results: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * GET /api/search/jobs - Advanced job search
 */
export async function searchJobs(params: JobSearchParams): Promise<SearchResponse<Job>> {
  try {
    console.log('[Search API] Searching jobs:', params.query);

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get<SearchResponse<Job>>(
      `/api/search/jobs?${queryParams}`
    );

    console.log('[Search API] Job search completed:', response.data.results.length, 'results');

    return response.data;
  } catch (error: any) {
    console.error('[Search API] Job search failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/search/candidates - Search candidates (employer only)
 */
export async function searchCandidates(params: CandidateSearchParams): Promise<SearchResponse<any>> {
  try {
    console.log('[Search API] Searching candidates:', params.query);

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await api.get<SearchResponse<any>>(
      `/api/search/candidates?${queryParams}`
    );

    console.log('[Search API] Candidate search completed:', response.data.results.length, 'results');

    return response.data;
  } catch (error: any) {
    console.error('[Search API] Candidate search failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/search/autocomplete - Get search suggestions
 */
export async function getSearchAutocomplete(query: string, type: 'jobs' | 'candidates'): Promise<string[]> {
  try {
    console.log('[Search API] Getting autocomplete suggestions for:', query);

    const response = await api.get<{ suggestions: string[] }>(
      `/api/search/autocomplete?query=${encodeURIComponent(query)}&type=${type}`
    );

    return response.data.suggestions;
  } catch (error: any) {
    console.error('[Search API] Autocomplete failed:', error.response?.data || error.message);
    throw error;
  }
}
