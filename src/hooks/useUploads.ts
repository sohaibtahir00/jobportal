/**
 * useUploads Hook
 * React Query hooks for file upload operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  uploadResume,
  deleteResume,
  uploadProfilePicture,
  deleteProfilePicture,
  uploadCompanyLogo,
} from '@/lib/api/uploads';

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook to upload resume (candidate)
 */
export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadResume(file),
    onSuccess: () => {
      // Invalidate candidate profile to refetch with new resume URL
      queryClient.invalidateQueries({ queryKey: ['candidate-profile'] });

      console.log('[useUploadResume] Resume uploaded successfully');
    },
    onError: (error: any) => {
      console.error('[useUploadResume] Failed to upload resume:', error);
    },
  });
}

/**
 * Hook to delete resume (candidate)
 */
export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      // Invalidate candidate profile to refetch
      queryClient.invalidateQueries({ queryKey: ['candidate-profile'] });

      console.log('[useDeleteResume] Resume deleted successfully');
    },
    onError: (error: any) => {
      console.error('[useDeleteResume] Failed to delete resume:', error);
    },
  });
}

/**
 * Hook to upload profile picture
 */
export function useUploadProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProfilePicture(file),
    onSuccess: () => {
      // Invalidate both candidate and employer profiles
      queryClient.invalidateQueries({ queryKey: ['candidate-profile'] });
      queryClient.invalidateQueries({ queryKey: ['employer-profile'] });

      console.log('[useUploadProfilePicture] Profile picture uploaded successfully');
    },
    onError: (error: any) => {
      console.error('[useUploadProfilePicture] Failed to upload profile picture:', error);
    },
  });
}

/**
 * Hook to delete profile picture
 */
export function useDeleteProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: () => {
      // Invalidate both candidate and employer profiles
      queryClient.invalidateQueries({ queryKey: ['candidate-profile'] });
      queryClient.invalidateQueries({ queryKey: ['employer-profile'] });

      console.log('[useDeleteProfilePicture] Profile picture deleted successfully');
    },
    onError: (error: any) => {
      console.error('[useDeleteProfilePicture] Failed to delete profile picture:', error);
    },
  });
}

/**
 * Hook to upload company logo (employer)
 */
export function useUploadCompanyLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadCompanyLogo(file),
    onSuccess: () => {
      // Invalidate employer profile to refetch with new logo
      queryClient.invalidateQueries({ queryKey: ['employer-profile'] });

      console.log('[useUploadCompanyLogo] Company logo uploaded successfully');
    },
    onError: (error: any) => {
      console.error('[useUploadCompanyLogo] Failed to upload company logo:', error);
    },
  });
}
