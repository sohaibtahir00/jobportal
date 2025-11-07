/**
 * useEmployer Hook
 * React Query hooks for employer profile management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEmployerProfile,
  createEmployerProfile,
  updateEmployerProfile,
  uploadEmployerLogo,
  getEmployerStats,
  getEmployerById,
  type EmployerProfileData,
} from '@/lib/api/employer';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch employer profile
 */
export function useEmployerProfile() {
  return useQuery({
    queryKey: ['employer-profile'],
    queryFn: getEmployerProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to fetch employer stats
 */
export function useEmployerStats() {
  return useQuery({
    queryKey: ['employer-stats'],
    queryFn: getEmployerStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}

/**
 * Hook to fetch public employer profile by ID
 */
export function useEmployer(id: string) {
  return useQuery({
    queryKey: ['employer', id],
    queryFn: () => getEmployerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook to create employer profile
 */
export function useCreateEmployerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployerProfileData) => createEmployerProfile(data),
    onSuccess: (data) => {
      // Set the new profile in cache
      queryClient.setQueryData(['employer-profile'], data);

      console.log('[useCreateEmployerProfile] Employer profile created successfully');
    },
    onError: (error: any) => {
      console.error('[useCreateEmployerProfile] Failed to create employer profile:', error);
    },
  });
}

/**
 * Hook to update employer profile
 */
export function useUpdateEmployerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EmployerProfileData>) => updateEmployerProfile(data),
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(['employer-profile'], data);

      // Invalidate stats to refetch
      queryClient.invalidateQueries({ queryKey: ['employer-stats'] });

      console.log('[useUpdateEmployerProfile] Employer profile updated successfully');
    },
    onError: (error: any) => {
      console.error('[useUpdateEmployerProfile] Failed to update employer profile:', error);
    },
  });
}

/**
 * Hook to upload employer logo
 */
export function useUploadEmployerLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadEmployerLogo(file),
    onSuccess: () => {
      // Invalidate profile to refetch with new logo
      queryClient.invalidateQueries({ queryKey: ['employer-profile'] });

      console.log('[useUploadEmployerLogo] Employer logo uploaded successfully');
    },
    onError: (error: any) => {
      console.error('[useUploadEmployerLogo] Failed to upload employer logo:', error);
    },
  });
}
