/**
 * useSavedJobs Hook
 * React Query hooks for managing saved jobs
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSavedJobs,
  saveJob,
  unsaveJob,
  clearAllSavedJobs,
  type GetSavedJobsParams,
} from '@/lib/api/saved-jobs';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch user's saved jobs
 */
export function useSavedJobs(params?: GetSavedJobsParams) {
  return useQuery({
    queryKey: ['saved-jobs', params],
    queryFn: () => getSavedJobs(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook to save a job
 */
export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, notes }: { jobId: string; notes?: string }) => saveJob(jobId, notes),
    onSuccess: () => {
      // Invalidate saved jobs list to refetch
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });

      // Also invalidate jobs lists to update saved status
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job'] });

      console.log('[useSaveJob] Job saved successfully');
    },
    onError: (error: any) => {
      console.error('[useSaveJob] Failed to save job:', error);
    },
  });
}

/**
 * Hook to unsave a job
 */
export function useUnsaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => unsaveJob(jobId),
    onSuccess: () => {
      // Invalidate saved jobs list to refetch
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });

      // Also invalidate jobs lists to update saved status
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job'] });

      console.log('[useUnsaveJob] Job unsaved successfully');
    },
    onError: (error: any) => {
      console.error('[useUnsaveJob] Failed to unsave job:', error);
    },
  });
}

/**
 * Hook to clear all saved jobs
 */
export function useClearAllSavedJobs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearAllSavedJobs(),
    onSuccess: () => {
      // Invalidate saved jobs list to refetch
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });

      // Also invalidate jobs lists to update saved status
      queryClient.invalidateQueries({ queryKey: ['jobs'] });

      console.log('[useClearAllSavedJobs] All saved jobs cleared successfully');
    },
    onError: (error: any) => {
      console.error('[useClearAllSavedJobs] Failed to clear saved jobs:', error);
    },
  });
}
