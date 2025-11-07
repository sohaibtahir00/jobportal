/**
 * useSearch Hook
 * React Query hooks for search functionality
 */

import { useQuery } from '@tanstack/react-query';
import {
  searchJobs,
  searchCandidates,
  getSearchAutocomplete,
  type JobSearchParams,
  type CandidateSearchParams,
} from '@/lib/api/search';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook to search jobs
 */
export function useJobSearch(params: JobSearchParams) {
  return useQuery({
    queryKey: ['job-search', params],
    queryFn: () => searchJobs(params),
    enabled: !!params.query && params.query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}

/**
 * Hook to search candidates (employer only)
 */
export function useCandidateSearch(params: CandidateSearchParams) {
  return useQuery({
    queryKey: ['candidate-search', params],
    queryFn: () => searchCandidates(params),
    enabled: !!params.query && params.query.length > 0,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to get search autocomplete suggestions
 */
export function useSearchAutocomplete(query: string, type: 'jobs' | 'candidates') {
  return useQuery({
    queryKey: ['search-autocomplete', query, type],
    queryFn: () => getSearchAutocomplete(query, type),
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
