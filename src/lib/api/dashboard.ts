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
  employer: {
    id: string;
    name: string;
    email: string;
    companyName: string;
    companyLogo: string | null;
    location: string | null;
    industry: string | null;
    verified: boolean;
  };
  jobStats: {
    total: number;
    active: number;
    draft: number;
    closed: number;
    expired: number;
  };
  applicationStats: {
    total: number;
    pending: number;
    shortlisted: number;
    inInterview: number;
    offered: number;
    accepted: number;
    rejected: number;
  };
  pendingReviews: number;
  recentApplications: any[];
  topJobs: any[];
  placementStats: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  activePlacements: any[];
  paymentSummary: {
    totalSpent: number;
    totalSpentFormatted: string;
    pendingPayments: number;
    pendingPaymentsFormatted: string;
    fullyPaidPlacements: number;
    placementsWithPendingPayment: number;
  };
  recentActivity: {
    newApplications: number;
    reviewedApplications: number;
    newPlacements: number;
    jobsPosted: number;
  };
  applicationsByJob: any[];
  candidateQualityMetrics: {
    totalCandidatesWithTests: number;
    elite: number;
    advanced: number;
    intermediate: number;
    beginner: number;
  };
  quickActions: any[];
  summary: {
    activeJobs: number;
    totalApplications: number;
    pendingReviews: number;
    activePlacements: number;
    totalSpent: number;
    pendingPayments: number;
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
