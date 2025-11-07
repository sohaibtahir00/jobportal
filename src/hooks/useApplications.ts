/**
 * useApplications Hook
 * React Query hooks for managing job applications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  getJobApplications,
  type SubmitApplicationData,
  type GetApplicationsParams,
} from '@/lib/api/applications';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch user's applications
 */
export function useApplications(params?: GetApplicationsParams) {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => getApplications(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  });
}

/**
 * Hook to fetch a single application by ID
 */
export function useApplication(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => getApplicationById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to fetch all applications for a specific job (employer only)
 */
export function useJobApplications(
  jobId: string,
  params?: { page?: number; limit?: number; status?: string }
) {
  return useQuery({
    queryKey: ['job-applications', jobId, params],
    queryFn: () => getJobApplications(jobId, params),
    enabled: !!jobId,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook to submit a job application
 */
export function useSubmitApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationData: SubmitApplicationData) => submitApplication(applicationData),
    onSuccess: (data) => {
      // Invalidate applications list to refetch
      queryClient.invalidateQueries({ queryKey: ['applications'] });

      // Set the new application in cache
      queryClient.setQueryData(['application', data.application.id], data.application);

      console.log('[useSubmitApplication] Application submitted successfully');
    },
    onError: (error: any) => {
      console.error('[useSubmitApplication] Failed to submit application:', error);
    },
  });
}

/**
 * Hook to withdraw an application (candidate only)
 */
export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => withdrawApplication(id),
    onSuccess: (_, withdrawnId) => {
      // Remove the application from cache
      queryClient.removeQueries({ queryKey: ['application', withdrawnId] });

      // Invalidate applications list
      queryClient.invalidateQueries({ queryKey: ['applications'] });

      console.log('[useWithdrawApplication] Application withdrawn successfully');
    },
    onError: (error: any) => {
      console.error('[useWithdrawApplication] Failed to withdraw application:', error);
    },
  });
}

/**
 * Hook to update application status (employer only)
 */
export function useUpdateApplicationStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED') =>
      updateApplicationStatus(id, status),
    onSuccess: (data) => {
      // Update the application in cache
      queryClient.setQueryData(['application', id], data.application);

      // Invalidate applications lists
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });

      console.log('[useUpdateApplicationStatus] Application status updated successfully');
    },
    onError: (error: any) => {
      console.error('[useUpdateApplicationStatus] Failed to update application status:', error);
    },
  });
}
