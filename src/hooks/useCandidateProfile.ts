/**
 * useCandidateProfile Hook
 * React hook for managing candidate profile data with React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCandidateProfile,
  updateCandidateProfile,
  updateAvailabilityStatus,
  createCandidateProfile,
} from '@/lib/api/candidates';
import type {
  UpdateCandidateProfileData,
  CandidateProfileResponse,
  Candidate,
} from '@/types';

export function useCandidateProfile() {
  const queryClient = useQueryClient();

  // Fetch candidate profile
  const {
    data,
    isLoading,
    error,
    refetch,
    isError,
  } = useQuery<CandidateProfileResponse>({
    queryKey: ['candidate-profile'],
    queryFn: getCandidateProfile,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 1, // Only retry once on failure
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateCandidateProfileData) => updateCandidateProfile(data),
    onSuccess: (updatedData) => {
      // Update cache with new data
      queryClient.setQueryData(['candidate-profile'], updatedData);
    },
    onError: (error: any) => {
      console.error('Failed to update profile:', error);
    },
  });

  // Create profile mutation (for new candidates)
  const createMutation = useMutation({
    mutationFn: (data: UpdateCandidateProfileData) => createCandidateProfile(data),
    onSuccess: (createdData) => {
      // Update cache with new profile
      queryClient.setQueryData(['candidate-profile'], createdData);
    },
    onError: (error: any) => {
      console.error('Failed to create profile:', error);
    },
  });

  // Update availability status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (availability: boolean) => updateAvailabilityStatus(availability),
    onSuccess: (response) => {
      // Update cache with new candidate data
      queryClient.setQueryData(
        ['candidate-profile'],
        (old: CandidateProfileResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            candidate: response.candidate,
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Failed to update availability status:', error);
    },
  });

  return {
    // Data
    profile: data?.candidate ?? null,
    profileCompletion: data?.profileCompletion ?? null,

    // Loading states
    isLoading,
    isError,
    error: error as Error | null,

    // Actions
    updateProfile: updateMutation.mutate,
    updateProfileAsync: updateMutation.mutateAsync,
    createProfile: createMutation.mutate,
    createProfileAsync: createMutation.mutateAsync,
    updateAvailability: updateStatusMutation.mutate,
    updateAvailabilityAsync: updateStatusMutation.mutateAsync,
    refetch,

    // Mutation states
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,

    // Mutation errors
    updateError: updateMutation.error as Error | null,
    createError: createMutation.error as Error | null,
    statusError: updateStatusMutation.error as Error | null,
  };
}
