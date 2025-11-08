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
  candidate: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    location: string | null;
    availability: string | null;
    skills: string[];
    experience: number | null;
  };
  applicationStats: {
    total: number;
    pending: number;
    reviewed: number;
    shortlisted: number;
    interviewScheduled: number;
    interviewed: number;
    offered: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
  };
  activeApplications: number;
  recentApplications: any[];
  profileCompleteness: {
    percentage: number;
    completedFields: number;
    totalFields: number;
    missingFields: string[];
  };
  testInfo: {
    hasTaken: boolean;
    score?: number;
    percentile?: number;
    tier?: {
      name: string;
      description: string;
      color: string;
      emoji: string;
    };
    lastTestDate?: string;
    nextTier?: any;
    recentTests?: any[];
    inviteSent?: boolean;
    inviteSentAt?: string;
    message?: string;
  };
  placementInfo: {
    hasActivePlacement: boolean;
    placement?: any;
    totalPlacements?: number;
    completedPlacements?: number;
  };
  recommendedJobs: any[];
  recentActivity: {
    applicationsSubmitted: number;
    statusUpdates: number;
    testsCompleted: number;
  };
  quickActions: any[];
  summary: {
    totalApplications: number;
    activeApplications: number;
    profileCompleteness: number;
    hasTestResults: boolean;
    testTier: string | null;
    hasActivePlacement: boolean;
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
