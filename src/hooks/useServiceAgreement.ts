/**
 * useServiceAgreement Hook
 * React Query hook for managing employer service agreement status
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';

// ============================================================================
// TYPES
// ============================================================================

export interface ServiceAgreementStatus {
  hasSigned: boolean;
  signedAt: string | null;
  agreementVersion: string | null;
}

export interface SignAgreementData {
  signerName: string;
  signerTitle: string;
  agreedToTerms: boolean;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

async function getAgreementStatus(): Promise<ServiceAgreementStatus> {
  const response = await api.get('/api/employer/service-agreement');
  return response.data;
}

async function signAgreement(data: SignAgreementData): Promise<{ success: boolean; signedAt: string }> {
  const response = await api.post('/api/employer/service-agreement', data);
  return response.data;
}

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch service agreement status
 * Only fetches for EMPLOYER users
 */
export function useServiceAgreement() {
  const { data: session, status: sessionStatus } = useSession();
  const isEmployer = session?.user?.role === 'EMPLOYER';

  return useQuery({
    queryKey: ['service-agreement-status'],
    queryFn: getAgreementStatus,
    enabled: sessionStatus === 'authenticated' && isEmployer,
    staleTime: 10 * 60 * 1000, // 10 minutes - agreement status doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: 1,
  });
}

/**
 * Hook to sign the service agreement
 */
export function useSignAgreement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signAgreement,
    onSuccess: (data) => {
      // Update the cached agreement status
      queryClient.setQueryData(['service-agreement-status'], {
        hasSigned: true,
        signedAt: data.signedAt,
        agreementVersion: 'v1.0', // Current version
      });

      console.log('[useSignAgreement] Agreement signed successfully');
    },
    onError: (error: any) => {
      console.error('[useSignAgreement] Failed to sign agreement:', error);
    },
  });
}

/**
 * Simple hook to check if employer needs to sign agreement
 * Returns: { needsAgreement: boolean, isLoading: boolean }
 */
export function useNeedsAgreement() {
  const { data, isLoading, isError } = useServiceAgreement();

  return {
    needsAgreement: !isLoading && !isError && data?.hasSigned === false,
    isLoading,
    hasSigned: data?.hasSigned ?? false,
  };
}
