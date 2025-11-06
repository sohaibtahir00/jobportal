/**
 * API Request and Response Type Definitions
 * Separate from database models - these types match the API contract exactly
 * Backend documentation: docs/API_REFERENCE.md
 */

import type {
  User,
  Candidate,
  Employer,
  Job,
  Application,
  UserRole,
  JobType,
  ExperienceLevel,
  PaginationResponse,
  CursorPaginationResponse,
  ProfileCompletion
} from '@/types';

// ============================================================================
// AUTHENTICATION API
// ============================================================================

/**
 * POST /api/auth/register
 * Register a new user (candidate or employer)
 */
export interface RegisterRequest {
  email: string;              // Required, valid email format
  password: string;           // Required, min 8 chars, uppercase, lowercase, number
  name: string;               // Required, min 1 char - CRITICAL: NOT "fullName"!
  role?: UserRole;            // Optional, defaults to "CANDIDATE"
  companyName?: string;       // For employers (optional during registration)
}

export interface RegisterResponse {
  message: string;            // "User registered successfully"
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    status: string;
    createdAt: string;
  };
}

/**
 * POST /api/auth/signin (via NextAuth)
 * Sign in with credentials
 */
export interface SignInRequest {
  email: string;
  password: string;
  redirect?: boolean;
  callbackUrl?: string;
}

export interface SignInResponse {
  error?: string;             // Error message if login failed
  status?: number;            // HTTP status code
  ok?: boolean;               // True if successful
  url?: string | null;        // Redirect URL
}

/**
 * GET /api/auth/session
 * Get current session
 */
export interface SessionResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    status: string;
    image: string | null;
  };
  expires: string;            // ISO 8601 DateTime
}

/**
 * GET /api/auth/providers
 * Get available auth providers
 */
export interface ProvidersResponse {
  credentials: {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
  };
}

/**
 * GET /api/auth/csrf
 * Get CSRF token
 */
export interface CsrfResponse {
  csrfToken: string;
}

// ============================================================================
// JOBS API
// ============================================================================

/**
 * GET /api/jobs
 * List all active jobs with pagination and filters
 */
export interface GetJobsRequest {
  page?: number;              // Default: 1
  limit?: number;             // Default: 10
  location?: string;          // Filter by location
  remote?: 'true' | 'false';  // Filter by remote status
  type?: JobType;             // Filter by job type
  experienceLevel?: ExperienceLevel;
  search?: string;            // Search in title, description, requirements
  employerId?: string;        // Filter by specific employer
  status?: string;            // Filter by status (default: ACTIVE for public)
}

export interface GetJobsResponse {
  jobs: Job[];
  pagination: PaginationResponse;
}

/**
 * GET /api/jobs/[id]
 * Get single job details
 */
export interface GetJobResponse {
  job: Job;
}

/**
 * POST /api/jobs
 * Create a new job posting (starts as DRAFT)
 */
export interface CreateJobRequest {
  title: string;              // Required
  description: string;        // Required
  requirements: string;       // Required
  responsibilities: string;   // Required
  type: JobType;              // Required, UPPERCASE enum
  location: string;           // Required
  remote: boolean;            // Required, boolean NOT string
  salaryMin?: number;         // Optional
  salaryMax?: number;         // Optional
  experienceLevel: ExperienceLevel; // Required, UPPERCASE enum
  skills?: string[];          // Optional, array of strings
  benefits?: string;          // Optional, text field
  deadline?: string;          // Optional, ISO 8601 DateTime, must be in future
  slots?: number;             // Optional, default: 1
}

export interface CreateJobResponse {
  message: string;            // "Job created successfully as DRAFT..."
  job: Job;
}

/**
 * PATCH /api/jobs/[id]
 * Update an existing job
 */
export interface UpdateJobRequest {
  title?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  type?: JobType;
  status?: string;            // Can change to ACTIVE, CLOSED, etc.
  location?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: ExperienceLevel;
  skills?: string[];
  benefits?: string;
  deadline?: string;
  slots?: number;
}

export interface UpdateJobResponse {
  message: string;            // "Job updated successfully"
  job: Job;
}

/**
 * DELETE /api/jobs/[id]
 * Soft delete job (sets status to CLOSED)
 */
export interface DeleteJobResponse {
  message: string;            // "Job closed successfully"
  job: {
    id: string;
    title: string;
    status: string;           // "CLOSED"
  };
}

/**
 * GET /api/jobs/search
 * Advanced job search with filters and statistics
 */
export interface SearchJobsRequest {
  q?: string;                 // Search query
  type?: JobType[];           // Array of job types
  location?: string;
  remote?: 'true' | 'false';
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  skills?: string;            // Comma-separated
  companyName?: string;
  postedWithin?: number;      // Days
  sortBy?: 'newest' | 'salary_high' | 'salary_low' | 'applicants_high' | 'applicants_low' | 'relevant';
  limit?: number;             // Default: 20, max: 100
  cursor?: string;            // Cursor for pagination
}

export interface SearchJobsResponse {
  jobs: (Job & {
    applicationsCount: number;
    matchingSkills: string[];
    skillMatchScore: number;
  })[];
  pagination: CursorPaginationResponse;
  filters: {
    applied: Record<string, any>;
    statistics: {
      byType: Record<string, number>;
      byExperienceLevel: Record<string, number>;
      byRemote: {
        remote: number;
        onsite: number;
      };
      salaryRange: {
        min: number;
        max: number;
        avgMin: number;
        avgMax: number;
      };
    };
  };
  meta: {
    timestamp: string;
    resultsCount: number;
    totalMatches: number;
  };
}

// ============================================================================
// APPLICATIONS API
// ============================================================================

/**
 * POST /api/applications
 * Submit a job application
 */
export interface CreateApplicationRequest {
  jobId: string;              // Required
  coverLetter?: string;       // Optional
}

export interface CreateApplicationResponse {
  message: string;            // "Application submitted successfully"
  application: Application;
}

/**
 * GET /api/applications
 * Get applications for current user
 */
export interface GetApplicationsRequest {
  page?: number;              // Default: 1
  limit?: number;             // Default: 10
  status?: string;            // Filter by status
  jobId?: string;             // Filter by specific job
}

export interface GetApplicationsResponse {
  applications: Application[];
  pagination: PaginationResponse;
}

// ============================================================================
// CANDIDATES API
// ============================================================================

/**
 * GET /api/candidates/profile
 * Get current candidate's profile
 */
export interface GetCandidateProfileResponse {
  candidate: Candidate;
  profileCompletion: ProfileCompletion;
}

/**
 * POST /api/candidates/profile
 * Create candidate profile
 */
export interface CreateCandidateProfileRequest {
  phone?: string;
  resume?: string;            // URL
  portfolio?: string;         // URL
  linkedIn?: string;          // URL
  github?: string;            // URL
  bio?: string;
  skills?: string[];          // Array of strings
  experience?: number;        // Years (integer)
  education?: string;
  location?: string;
  preferredJobType?: JobType; // UPPERCASE enum
  expectedSalary?: number;    // In dollars
  availability?: boolean;
}

export interface CreateCandidateProfileResponse {
  message: string;            // "Candidate profile created successfully"
  candidate: Candidate;
  profileCompletion: ProfileCompletion;
}

/**
 * PATCH /api/candidates/profile
 * Update candidate profile
 */
export interface UpdateCandidateProfileRequest {
  phone?: string;
  resume?: string;
  portfolio?: string;
  linkedIn?: string;
  github?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  education?: string;
  location?: string;
  preferredJobType?: JobType;
  expectedSalary?: number;
  availability?: boolean;
}

export interface UpdateCandidateProfileResponse {
  message: string;            // "Candidate profile updated successfully"
  candidate: Candidate;
  profileCompletion: ProfileCompletion;
}

// ============================================================================
// EMPLOYERS API
// ============================================================================

/**
 * GET /api/employers/profile
 * Get current employer's profile with stats
 */
export interface GetEmployerProfileResponse {
  employer: Employer;
  applicationStats: Array<{
    status: string;
    _count: number;
  }>;
}

/**
 * POST /api/employers/profile
 * Create employer profile
 */
export interface CreateEmployerProfileRequest {
  companyName: string;        // Required
  companyLogo?: string;       // URL
  companyWebsite?: string;    // URL with protocol
  companySize?: string;       // Free text
  industry?: string;          // Free text
  description?: string;
  location?: string;
  phone?: string;
}

export interface CreateEmployerProfileResponse {
  message: string;            // "Employer profile created successfully"
  employer: Employer;
}

/**
 * PATCH /api/employers/profile
 * Update employer profile
 */
export interface UpdateEmployerProfileRequest {
  companyName?: string;
  companyLogo?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  description?: string;
  location?: string;
  phone?: string;
}

export interface UpdateEmployerProfileResponse {
  message: string;            // "Employer profile updated successfully"
  employer: Employer;
}

// ============================================================================
// DASHBOARD API
// ============================================================================

export interface CandidateDashboardResponse {
  stats: {
    totalApplications: number;
    pendingApplications: number;
    interviewsScheduled: number;
    profileViews: number;
  };
  recentApplications: Application[];
  recommendedJobs: Job[];
}

export interface EmployerDashboardResponse {
  stats: {
    activeJobs: number;
    totalApplications: number;
    newApplications: number;
    totalViews: number;
  };
  recentApplications: Application[];
  topJobs: Job[];
}

// ============================================================================
// ERROR RESPONSES
// ============================================================================

export interface ErrorResponse {
  error: string;              // User-friendly error message
  details?: string | string[]; // Additional error details
  [key: string]: any;         // Context-specific fields
}

// Common error responses
export interface ValidationErrorResponse extends ErrorResponse {
  details: string[];          // Array of validation error messages
}

export interface ConflictErrorResponse extends ErrorResponse {
  error: string;
  [key: string]: any;         // E.g., existingEmail, applicationId, etc.
}

export interface NotFoundErrorResponse extends ErrorResponse {
  error: string;              // E.g., "Job not found", "User not found"
}

export interface UnauthorizedErrorResponse extends ErrorResponse {
  error: "Authentication required" | "Unauthorized";
}

export interface ForbiddenErrorResponse extends ErrorResponse {
  error: string;              // E.g., "Insufficient permissions. Employer role required."
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: {
      status: "ok" | "error";
      latency: number;
    };
    environment: {
      status: "ok" | "error";
    };
    email: {
      status: "ok" | "error";
    };
    stripe: {
      status: "ok" | "error";
    };
  };
  responseTime: number;
}
