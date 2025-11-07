/**
 * Dashboard API Client
 * Handles dashboard statistics and data for both candidates and employers
 */

import api from '../api';
import type { CandidateStats, EmployerStats } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface CandidateDashboardData {
  stats: CandidateStats;
  recentApplications: any[];
  recommendedJobs: any[];
  profileCompletion: {
    percentage: number;
    missingFields: string[];
  };
}

export interface EmployerDashboardData {
  stats: EmployerStats;
  activeJobs: any[];
  recentApplications: any[];
  analytics: {
    applicationTrend: { date: string; count: number }[];
    topPerformingJobs: any[];
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * GET /api/dashboard/candidate - Get candidate dashboard data
 */
export async function getCandidateDashboard(): Promise<CandidateDashboardData> {
  try {
    console.log('[Dashboard API] Fetching candidate dashboard...');

    const response = await api.get<CandidateDashboardData>('/api/dashboard/candidate');

    console.log('[Dashboard API] Candidate dashboard fetched successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Dashboard API] Failed to fetch candidate dashboard:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /api/dashboard/employer - Get employer dashboard data
 */
export async function getEmployerDashboard(): Promise<EmployerDashboardData> {
  try {
    console.log('[Dashboard API] Fetching employer dashboard...');

    const response = await api.get<EmployerDashboardData>('/api/dashboard/employer');

    console.log('[Dashboard API] Employer dashboard fetched successfully');

    return response.data;
  } catch (error: any) {
    console.error('[Dashboard API] Failed to fetch employer dashboard:', error.response?.data || error.message);
    throw error;
  }
}
