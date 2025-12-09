/**
 * useJobs Hook
 * React Query hooks for managing jobs data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  claimJob,
  searchJobs,
  getClaimedJobs,
  searchUnclaimedJobs,
  type GetJobsParams,
  type CreateJobData,
} from '@/lib/api/jobs';
import type { Job } from '@/types';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch paginated jobs with filters
 */
export function useJobs(params?: GetJobsParams) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => getJobs(params),
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    retry: 1,
  });
}

/**
 * Hook to fetch a single job by ID
 */
export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to search jobs
 */
export function useSearchJobs(searchParams: GetJobsParams) {
  return useQuery({
    queryKey: ['jobs-search', searchParams],
    queryFn: () => searchJobs(searchParams),
    enabled: !!searchParams.search || !!searchParams.niche,
    staleTime: 2 * 60 * 1000,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook to create a new job posting
 */
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobData: CreateJobData) => createJob(jobData),
    onSuccess: (data) => {
      // Invalidate jobs list to refetch with new job
      queryClient.invalidateQueries({ queryKey: ['jobs'] });

      // Optionally set the new job in cache
      queryClient.setQueryData(['job', data.job.id], data.job);

      console.log('[useCreateJob] Job created successfully:', data.job.id);
    },
    onError: (error: any) => {
      console.error('[useCreateJob] Failed to create job:', error);
    },
  });
}

/**
 * Hook to update an existing job
 */
export function useUpdateJob(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<CreateJobData>) => updateJob(id, updates),
    onSuccess: (data) => {
      // Update the specific job in cache
      queryClient.setQueryData(['job', id], data.job);

      // Invalidate jobs list to refetch
      queryClient.invalidateQueries({ queryKey: ['jobs'] });

      console.log('[useUpdateJob] Job updated successfully');
    },
    onError: (error: any) => {
      console.error('[useUpdateJob] Failed to update job:', error);
    },
  });
}

/**
 * Hook to delete a job posting
 */
export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: (_, deletedId) => {
      // Remove the job from cache
      queryClient.removeQueries({ queryKey: ['job', deletedId] });

      // Invalidate jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });

      console.log('[useDeleteJob] Job deleted successfully');
    },
    onError: (error: any) => {
      console.error('[useDeleteJob] Failed to delete job:', error);
    },
  });
}

/**
 * Hook to claim an aggregated job
 */
export function useClaimJob(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (claimData: {
      phone: string;
      roleLevel: string;
      salaryMin?: number;
      salaryMax?: number;
      startDateNeeded?: string;
      candidatesNeeded?: number;
      acknowledgment: boolean;
    }) => claimJob(id, claimData),
    onSuccess: (data) => {
      // Update the job in cache with claimed status
      queryClient.setQueryData(['job', id], data.job);

      // Invalidate jobs lists
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['claimed-jobs'] });

      console.log('[useClaimJob] Job claimed successfully');
    },
    onError: (error: any) => {
      console.error('[useClaimJob] Failed to claim job:', error);
    },
  });
}

/**
 * Hook to fetch employer's claimed jobs
 */
export function useClaimedJobs() {
  return useQuery({
    queryKey: ['claimed-jobs'],
    queryFn: getClaimedJobs,
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });
}

/**
 * Hook to search for unclaimed jobs by company name
 */
export function useSearchUnclaimedJobs(companyName: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ['unclaimed-jobs', companyName],
    queryFn: () => searchUnclaimedJobs(companyName),
    enabled: enabled && companyName.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}
