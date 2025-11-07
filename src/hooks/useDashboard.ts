/**
 * useDashboard Hook
 * React Query hooks for dashboard data
 */

import { useQuery } from '@tanstack/react-query';
import { getCandidateDashboard, getEmployerDashboard } from '@/lib/api/dashboard';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch candidate dashboard data
 */
export function useCandidateDashboard() {
  return useQuery({
    queryKey: ['candidate-dashboard'],
    queryFn: getCandidateDashboard,
    staleTime: 60 * 1000, // 1 minute - refresh frequently for real-time stats
    retry: 1,
  });
}

/**
 * Hook to fetch employer dashboard data
 */
export function useEmployerDashboard() {
  return useQuery({
    queryKey: ['employer-dashboard'],
    queryFn: getEmployerDashboard,
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });
}
