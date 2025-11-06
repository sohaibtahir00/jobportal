/**
 * Type definitions matching backend API models
 * Backend documentation: docs/API_REFERENCE.md
 *
 * CRITICAL NOTES:
 * - Backend uses 'name', NOT 'fullName'
 * - All enums are UPPERCASE with underscores (e.g., FULL_TIME, not full-time)
 * - IDs are string (cuid), not numbers
 * - Dates are ISO 8601 strings
 */

// ============================================================================
// ENUMS (Backend values - UPPERCASE)
// ============================================================================

export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYER = "EMPLOYER",
  CANDIDATE = "CANDIDATE"
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED"
}

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  TEMPORARY = "TEMPORARY"
}

export enum JobStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  EXPIRED = "EXPIRED"
}

export enum ExperienceLevel {
  ENTRY_LEVEL = "ENTRY_LEVEL",
  MID_LEVEL = "MID_LEVEL",
  SENIOR_LEVEL = "SENIOR_LEVEL",
  EXECUTIVE = "EXECUTIVE"
}

export enum ApplicationStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  SHORTLISTED = "SHORTLISTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  INTERVIEWED = "INTERVIEWED",
  OFFERED = "OFFERED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
  ACCEPTED = "ACCEPTED"
}

export enum TestStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED"
}

export enum PlacementStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  UPFRONT_PAID = "UPFRONT_PAID",
  FULLY_PAID = "FULLY_PAID",
  FAILED = "FAILED"
}

// ============================================================================
// DATABASE MODELS (Match Prisma schema)
// ============================================================================

export interface User {
  id: string;                    // cuid
  email: string;                 // CRITICAL: Backend uses 'name', NOT 'fullName'
  password?: string;             // Not returned in API responses (hashed)
  name: string;                  // IMPORTANT: 'name' not 'fullName'
  role: UserRole;                // UPPERCASE enum
  status: UserStatus;            // UPPERCASE enum
  emailVerified: string | null;  // ISO 8601 DateTime
  image: string | null;          // Profile image URL
  createdAt: string;             // ISO 8601 DateTime
  updatedAt: string;             // ISO 8601 DateTime

  // Relations (optional - loaded when needed)
  candidate?: Candidate;
  employer?: Employer;
  sentMessages?: Message[];
  receivedMessages?: Message[];
}

export interface Candidate {
  id: string;                    // cuid
  userId: string;                // References User.id
  phone: string | null;
  resume: string | null;         // URL to resume file
  portfolio: string | null;      // URL to portfolio
  linkedIn: string | null;       // LinkedIn profile URL
  github: string | null;         // GitHub profile URL
  bio: string | null;
  skills: string[];              // PostgreSQL array
  experience: number | null;     // Years of experience (integer)
  education: string | null;
  location: string | null;
  preferredJobType: JobType | null; // UPPERCASE enum
  expectedSalary: number | null; // In dollars (check usage - may be cents)
  availability: boolean;         // Default: true

  // Skills Testing
  hasTakenTest: boolean;
  testScore: number | null;      // 0-100
  testPercentile: number | null; // 0-100
  testTier: string | null;       // "ELITE" | "ADVANCED" | "INTERMEDIATE" | "BEGINNER"
  lastTestDate: string | null;   // ISO 8601 DateTime
  testInviteToken: string | null;
  testInviteSentAt: string | null; // ISO 8601 DateTime

  // Referrals
  referralCode: string | null;
  referredBy: string | null;
  referralEarnings: number;      // In cents, default: 0

  createdAt: string;             // ISO 8601 DateTime
  updatedAt: string;             // ISO 8601 DateTime

  // Relations
  user?: User;
  applications?: Application[];
  testResults?: TestResult[];
  placements?: Placement[];
}

export interface Employer {
  id: string;                    // cuid
  userId: string;                // References User.id
  companyName: string;           // Required
  companyLogo: string | null;
  companyWebsite: string | null;
  companySize: string | null;    // Free text (e.g., "50-100", "500+")
  industry: string | null;
  description: string | null;
  location: string | null;
  phone: string | null;
  verified: boolean;             // Default: false
  stripeCustomerId: string | null;
  totalSpent: number;            // In cents, default: 0
  createdAt: string;             // ISO 8601 DateTime
  updatedAt: string;             // ISO 8601 DateTime

  // Relations
  user?: User;
  jobs?: Job[];
  emailCampaigns?: EmailCampaign[];
  placements?: Placement[];

  // Aggregations
  _count?: {
    jobs?: number;
    emailCampaigns?: number;
  };
}

export interface Job {
  id: string;                    // cuid
  employerId: string;            // References Employer.id
  title: string;                 // Required
  description: string;           // Text, required
  requirements: string;          // Text, required
  responsibilities: string;      // Text, required
  type: JobType;                 // UPPERCASE enum, required
  status: JobStatus;             // UPPERCASE enum, default: DRAFT
  location: string;              // Required
  remote: boolean;               // CRITICAL: Boolean, NOT "remote" | "hybrid" | "onsite"
  salaryMin: number | null;      // In dollars (check usage - may be cents)
  salaryMax: number | null;
  experienceLevel: ExperienceLevel; // UPPERCASE enum, required
  skills: string[];              // PostgreSQL array
  benefits: string | null;       // Text field
  deadline: string | null;       // ISO 8601 DateTime
  slots: number;                 // Default: 1
  views: number;                 // Default: 0
  createdAt: string;             // ISO 8601 DateTime
  updatedAt: string;             // ISO 8601 DateTime

  // Relations
  employer?: Employer;
  applications?: Application[];
  placements?: Placement[];

  // Aggregations
  _count?: {
    applications?: number;
  };
}

export interface Application {
  id: string;                    // cuid
  jobId: string;                 // References Job.id
  candidateId: string;           // References Candidate.id
  coverLetter: string | null;
  status: ApplicationStatus;     // UPPERCASE enum, default: PENDING
  appliedAt: string;             // ISO 8601 DateTime
  reviewedAt: string | null;     // ISO 8601 DateTime
  notes: string | null;          // Employer notes
  createdAt: string;             // ISO 8601 DateTime
  updatedAt: string;             // ISO 8601 DateTime

  // Relations
  job?: Job;
  candidate?: Candidate;
  testResults?: TestResult[];
}

export interface TestResult {
  id: string;
  candidateId: string;
  applicationId: string | null;
  testName: string;
  score: number;
  percentile: number;
  tier: string;
  completedAt: string;           // ISO 8601 DateTime
  details: any;                  // JSON field
  createdAt: string;             // ISO 8601 DateTime
  updatedAt: string;             // ISO 8601 DateTime

  // Relations
  candidate?: Candidate;
  application?: Application;
}

export interface Placement {
  id: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  applicationId: string;
  status: PlacementStatus;
  startDate: string;             // ISO 8601 DateTime
  endDate: string | null;        // ISO 8601 DateTime
  salary: number;                // In cents
  feePercentage: number;         // Decimal (e.g., 0.15 for 15%)
  totalFee: number;              // In cents
  upfrontFee: number;            // In cents
  remainingFee: number;          // In cents
  paymentStatus: PaymentStatus;
  upfrontPaidAt: string | null;  // ISO 8601 DateTime
  remainingPaidAt: string | null; // ISO 8601 DateTime
  guaranteePeriod: number;       // Days
  guaranteeExpiry: string;       // ISO 8601 DateTime
  isActive: boolean;
  terminationDate: string | null; // ISO 8601 DateTime
  terminationReason: string | null;
  createdAt: string;             // ISO 8601 DateTime
  updatedAt: string;             // ISO 8601 DateTime

  // Relations
  job?: Job;
  candidate?: Candidate;
  employer?: Employer;
  application?: Application;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  read: boolean;
  jobId: string | null;
  applicationId: string | null;
  sentAt: string;                // ISO 8601 DateTime
  createdAt: string;             // ISO 8601 DateTime
  updatedAt: string;             // ISO 8601 DateTime

  // Relations
  sender?: User;
  receiver?: User;
  job?: Job;
  application?: Application;
}

export interface EmailCampaign {
  id: string;
  employerId: string;
  name: string;
  subject: string;
  content: string;
  filters: any;                  // JSON field
  status: string;
  sentCount: number;
  openCount: number;
  clickCount: number;
  scheduledFor: string | null;   // ISO 8601 DateTime
  sentAt: string | null;         // ISO 8601 DateTime
  createdAt: string;             // ISO 8601 DateTime
  updatedAt: string;             // ISO 8601 DateTime

  // Relations
  employer?: Employer;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredEmail: string;
  code: string;
  status: string;
  registeredAt: string | null;   // ISO 8601 DateTime
  placementId: string | null;
  earningsPaid: boolean;
  paidAt: string | null;         // ISO 8601 DateTime
  createdAt: string;             // ISO 8601 DateTime
  updatedAt: string;             // ISO 8601 DateTime

  // Relations
  referrer?: User;
  placement?: Placement;
}

export interface BlogPost {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  published: boolean;
  publishedAt: string | null;    // ISO 8601 DateTime
  createdAt: string;             // ISO 8601 DateTime
  updatedAt: string;             // ISO 8601 DateTime

  // Relations
  author?: User;
}

// ============================================================================
// FRONTEND-SPECIFIC TYPES (Not in backend)
// ============================================================================

// Notification Types (frontend-only, not in backend API docs)
export type NotificationType =
  | "application_received"
  | "application_status_changed"
  | "new_message"
  | "job_posted"
  | "profile_viewed";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;             // ISO 8601 DateTime
}

// Dashboard Statistics
export interface CandidateStats {
  totalApplications: number;
  pendingApplications: number;
  interviewsScheduled: number;
  profileViews: number;
  messagesUnread: number;
  savedJobs: number;
}

export interface EmployerStats {
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  interviewsScheduled: number;
  totalViews: number;
  avgTimeToHire?: number;
}

// Pagination (matches backend format)
export interface PaginationParams {
  page: number;                  // 1-indexed
  limit: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CursorPaginationResponse {
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
  total: number;
  currentPage: string;           // "N/A (cursor-based)"
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  applications: number;
  interviews: number;
  offers?: number;
}

// Profile Completion (from backend candidate profile response)
export interface ProfileCompletion {
  percentage: number;
  missingFields: string[];
  status: "POOR" | "FAIR" | "GOOD" | "EXCELLENT";
}

// ============================================================================
// TYPE ALIASES FOR BACKWARDS COMPATIBILITY
// ============================================================================
// These allow existing code to continue working with lowercase types
// while we migrate to backend's uppercase enums

export type UserRoleType = "candidate" | "employer" | "admin";
export type JobTypeType = "full-time" | "part-time" | "contract" | "internship" | "temporary";
export type JobStatusType = "draft" | "active" | "closed" | "expired";
export type ExperienceLevelType = "entry" | "mid" | "senior" | "executive";
export type ApplicationStatusType = "pending" | "reviewed" | "shortlisted" | "interview_scheduled" | "interviewed" | "offered" | "rejected" | "withdrawn" | "accepted";

// Helper functions to convert between frontend and backend formats
export function toBackendRole(role: UserRoleType | UserRole): UserRole {
  if (typeof role === 'string') {
    return role.toUpperCase() as UserRole;
  }
  return role;
}

export function toFrontendRole(role: UserRole): UserRoleType {
  return role.toLowerCase() as UserRoleType;
}

export function toBackendJobType(type: JobTypeType | JobType): JobType {
  if (typeof type === 'string') {
    return type.toUpperCase().replace('-', '_') as JobType;
  }
  return type;
}

export function toFrontendJobType(type: JobType): JobTypeType {
  return type.toLowerCase().replace('_', '-') as JobTypeType;
}

export function toBackendExperienceLevel(level: ExperienceLevelType | ExperienceLevel): ExperienceLevel {
  if (typeof level === 'string') {
    return level.toUpperCase().replace('-', '_') as ExperienceLevel;
  }
  return level;
}

export function toFrontendExperienceLevel(level: ExperienceLevel): ExperienceLevelType {
  return level.toLowerCase().replace('_', '-') as ExperienceLevelType;
}

export function toBackendApplicationStatus(status: ApplicationStatusType | ApplicationStatus): ApplicationStatus {
  if (typeof status === 'string') {
    return status.toUpperCase().replace('-', '_') as ApplicationStatus;
  }
  return status;
}

export function toFrontendApplicationStatus(status: ApplicationStatus): ApplicationStatusType {
  return status.toLowerCase().replace('_', '-') as ApplicationStatusType;
}
