import { z } from "zod";
import { UserRole, JobType, ExperienceLevel } from "@/types";

/**
 * Validation schemas using Zod
 * Updated to match backend API validation rules
 * Backend documentation: docs/API_REFERENCE.md
 */

// ============================================================================
// AUTHENTICATION VALIDATIONS (Match Backend)
// ============================================================================

/**
 * Login Form
 * Backend: POST /api/auth/signin (NextAuth)
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration Form
 * Backend: POST /api/auth/register
 *
 * CRITICAL BACKEND VALIDATION RULES:
 * - email: Valid email format, unique
 * - password:
 *   - Minimum 8 characters
 *   - Must contain at least one uppercase letter (A-Z)
 *   - Must contain at least one lowercase letter (a-z)
 *   - Must contain at least one number (0-9)
 *   - No special character requirement
 * - name: Required, min 1 character (NOT fullName!)
 * - role: Must be valid UserRole enum value (UPPERCASE)
 */
export const registrationSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must not exceed 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["candidate", "employer"]),
    companyName: z.string().optional(), // For employers (optional during registration)
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;

/**
 * Forgot Password Form
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Form
 * Backend: POST /api/auth/reset-password
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ============================================================================
// CANDIDATE PROFILE VALIDATIONS (Match Backend)
// ============================================================================

/**
 * Candidate Profile Form
 * Backend: POST/PATCH /api/candidates/profile
 *
 * Backend field names:
 * - phone, resume (URL), portfolio (URL), linkedIn (URL), github (URL)
 * - bio, skills (string[]), experience (number - years), education
 * - location, preferredJobType (JobType enum), expectedSalary (number)
 * - availability (boolean)
 */
export const candidateProfileSchema = z.object({
  // Basic Info
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  location: z.string().min(2, "Location is required"),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(1000, "Bio must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),

  // Experience
  experience: z
    .number()
    .int("Years of experience must be a whole number")
    .min(0, "Years of experience must be 0 or greater")
    .max(50, "Years of experience must be 50 or less")
    .optional()
    .nullable(),
  education: z
    .string()
    .max(500, "Education must not exceed 500 characters")
    .optional()
    .or(z.literal("")),

  // Profile Links (URLs)
  resume: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  portfolio: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  linkedIn: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),

  // Skills (array of strings)
  skills: z
    .array(z.string())
    .min(1, "Please select at least one skill")
    .max(50, "Maximum 50 skills allowed"),

  // Preferences
  preferredJobType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"])
    .optional()
    .nullable(),
  expectedSalary: z
    .number()
    .int("Salary must be a whole number")
    .min(0, "Salary must be positive")
    .optional()
    .nullable(),
  availability: z.boolean().optional(),
});

export type CandidateProfileFormData = z.infer<typeof candidateProfileSchema>;

// ============================================================================
// EMPLOYER PROFILE VALIDATIONS (Match Backend)
// ============================================================================

/**
 * Employer Profile Form
 * Backend: POST/PATCH /api/employers/profile
 *
 * Backend field names:
 * - companyName (required), companyLogo (URL), companyWebsite (URL with protocol)
 * - companySize (free text), industry (free text), description
 * - location, phone
 */
export const employerProfileSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name must not exceed 200 characters"),
  companyLogo: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  companyWebsite: z
    .string()
    .url("Please enter a valid URL with protocol (https://)")
    .regex(
      /^https?:\/\//,
      "Website must include protocol (https:// or http://)"
    )
    .optional()
    .or(z.literal("")),
  companySize: z
    .string()
    .max(50, "Company size must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  industry: z
    .string()
    .max(100, "Industry must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(200, "Location must not exceed 200 characters")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export type EmployerProfileFormData = z.infer<typeof employerProfileSchema>;

// ============================================================================
// JOB POSTING VALIDATIONS (Match Backend)
// ============================================================================

/**
 * Job Posting Form
 * Backend: POST /api/jobs
 *
 * CRITICAL BACKEND VALIDATION RULES:
 * - title, description, requirements, responsibilities: Required
 * - type: Required, must be valid JobType enum (UPPERCASE)
 * - location: Required
 * - experienceLevel: Required, must be valid ExperienceLevel enum (UPPERCASE)
 * - remote: Boolean, NOT "remote" | "hybrid" | "onsite"
 * - skills: Optional, array of strings
 * - salaryMin/salaryMax: Optional, if both provided: salaryMin <= salaryMax
 * - deadline: Optional, must be in the future
 */
export const jobPostingSchema = z
  .object({
    // Basic Info (Required)
    title: z
      .string()
      .min(5, "Job title must be at least 5 characters")
      .max(200, "Job title must not exceed 200 characters"),
    description: z
      .string()
      .min(100, "Description must be at least 100 characters")
      .max(10000, "Description must not exceed 10000 characters"),
    requirements: z
      .string()
      .min(50, "Requirements must be at least 50 characters")
      .max(5000, "Requirements must not exceed 5000 characters"),
    responsibilities: z
      .string()
      .min(50, "Responsibilities must be at least 50 characters")
      .max(5000, "Responsibilities must not exceed 5000 characters"),
    type: z.enum(
      ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"]
    ),
    location: z
      .string()
      .min(2, "Location is required")
      .max(200, "Location must not exceed 200 characters"),
    experienceLevel: z.enum(
      ["ENTRY_LEVEL", "MID_LEVEL", "SENIOR_LEVEL", "EXECUTIVE"]
    ),

    // Remote (boolean)
    remote: z.boolean(),

    // Optional Fields
    salaryMin: z
      .number()
      .int("Salary must be a whole number")
      .min(0, "Minimum salary must be positive")
      .optional()
      .nullable(),
    salaryMax: z
      .number()
      .int("Salary must be a whole number")
      .min(0, "Maximum salary must be positive")
      .optional()
      .nullable(),
    skills: z
      .array(z.string())
      .max(50, "Maximum 50 skills allowed")
      .optional(),
    benefits: z
      .string()
      .max(2000, "Benefits must not exceed 2000 characters")
      .optional()
      .or(z.literal("")),
    deadline: z
      .string()
      .datetime("Invalid date format")
      .optional()
      .or(z.literal("")),
    slots: z
      .number()
      .int("Slots must be a whole number")
      .min(1, "At least 1 slot required")
      .max(100, "Maximum 100 slots allowed")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.salaryMin && data.salaryMax) {
        return data.salaryMin <= data.salaryMax;
      }
      return true;
    },
    {
      message: "Minimum salary cannot be greater than maximum salary",
      path: ["salaryMax"],
    }
  )
  .refine(
    (data) => {
      if (data.deadline) {
        return new Date(data.deadline) > new Date();
      }
      return true;
    },
    {
      message: "Deadline must be in the future",
      path: ["deadline"],
    }
  );

export type JobPostingFormData = z.infer<typeof jobPostingSchema>;

// ============================================================================
// APPLICATION VALIDATIONS (Match Backend)
// ============================================================================

/**
 * Job Application Form
 * Backend: POST /api/applications
 *
 * Backend only requires:
 * - jobId (string, required)
 * - coverLetter (string, optional)
 *
 * But forms might collect additional info for candidate profile
 */
export const jobApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(2000, "Cover letter must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

// ============================================================================
// SEARCH & FILTER VALIDATIONS
// ============================================================================

/**
 * Job Search Form
 */
export const jobSearchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"])
    .optional(),
  remote: z.boolean().optional(),
  experienceLevel: z
    .enum(["ENTRY_LEVEL", "MID_LEVEL", "SENIOR_LEVEL", "EXECUTIVE"])
    .optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  skills: z.string().optional(), // Comma-separated
});

export type JobSearchFormData = z.infer<typeof jobSearchSchema>;

// ============================================================================
// OTHER FORMS (Non-backend)
// ============================================================================

/**
 * Contact Form (Frontend only)
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must not exceed 200 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must not exceed 2000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
