// User Types
export type UserRole = "candidate" | "employer";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Candidate Types
export interface Candidate {
  id: string;
  userId: string;
  user?: User;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  skills: string[];
  desiredRoles: string[];
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  employmentType: ("full-time" | "part-time" | "contract" | "internship")[];
  remotePreference: "remote" | "hybrid" | "onsite" | "flexible";
  salaryMin?: number;
  salaryMax?: number;
  availabilityDate?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  experience: Experience[];
  applications: Application[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  candidateId: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

// Employer Types
export interface Employer {
  id: string;
  userId: string;
  user?: User;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  location?: string;
  description?: string;
  jobs: Job[];
  createdAt: Date;
  updatedAt: Date;
}

// Job Types
export type JobNiche =
  | "ai-ml"
  | "healthcare-it"
  | "fintech"
  | "cybersecurity"
  | "data-science"
  | "cloud-computing";

export type JobStatus = "draft" | "published" | "closed" | "archived";

export interface Job {
  id: string;
  employerId: string;
  employer?: Employer;
  title: string;
  niche: JobNiche;
  description: string;
  location: string;
  remoteType: "remote" | "hybrid" | "onsite";
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves: string[];
  techStack: string[];
  benefits: string[];
  status: JobStatus;
  applications: Application[];
  views: number;
  applicationsCount?: number;
  postedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Application Types
export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "offer"
  | "rejected"
  | "accepted"
  | "withdrawn";

export interface Application {
  id: string;
  jobId: string;
  job?: Job;
  candidateId: string;
  candidate?: Candidate;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  answers?: Record<string, string>;
  notes?: string;
  appliedAt: Date;
  updatedAt: Date;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  sender?: User;
  receiverId: string;
  receiver?: User;
  jobId?: string;
  job?: Job;
  subject: string;
  content: string;
  read: boolean;
  sentAt: Date;
}

// Notification Types
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
  createdAt: Date;
}

// Dashboard Statistics Types
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

// Filter Types
export interface JobFilters {
  search?: string;
  niche?: JobNiche[];
  remoteType?: ("remote" | "hybrid" | "onsite")[];
  experienceLevel?: ("entry" | "mid" | "senior" | "lead")[];
  employmentType?: ("full-time" | "part-time" | "contract" | "internship")[];
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
  techStack?: string[];
}

export interface CandidateFilters {
  search?: string;
  skills?: string[];
  experienceLevel?: ("entry" | "mid" | "senior" | "lead")[];
  location?: string;
  availability?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  applications: number;
  interviews: number;
  offers?: number;
}

// Form Data Types (for validation schemas)
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  acceptTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface CandidateProfileFormData {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  title?: string;
  company?: string;
  experienceYears?: number;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  skills: string[];
  desiredRoles: string[];
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  employmentType: ("full-time" | "part-time" | "contract" | "internship")[];
  remotePreference: "remote" | "hybrid" | "onsite" | "flexible";
  salaryMin?: number;
  salaryMax?: number;
  availabilityDate?: string;
}

export interface JobPostingFormData {
  title: string;
  niche: string;
  location: string;
  remoteType: "remote" | "hybrid" | "onsite";
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves: string[];
  techStack: string[];
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  benefits: string[];
}

export interface JobApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeFile?: File;
  coverLetter?: string;
  yearsOfExperience: number;
  availableStartDate: string;
}
