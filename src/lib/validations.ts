import { z } from "zod";

/**
 * Validation schemas using Zod
 */

// Job Search Form
export const jobSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  location: z.string().optional(),
  jobType: z.string().optional(),
  remote: z.boolean().optional(),
});

export type JobSearchFormData = z.infer<typeof jobSearchSchema>;

// Job Application Form
export const jobApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  resumeFile: z.instanceof(File).optional().or(z.string().optional()),
  linkedinUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(2000, "Cover letter must not exceed 2000 characters"),
  whyGoodFit: z
    .string()
    .min(50, "Please provide at least 50 characters")
    .max(1000, "Response must not exceed 1000 characters"),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

// Contact Form
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Login Form
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration Form
export const registrationSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    role: z.enum(["candidate", "employer"]),
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

// Forgot Password Form
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Candidate Profile Form
export const candidateProfileSchema = z.object({
  // Basic Info
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  timezone: z.string().min(1, "Please select a timezone"),

  // Experience
  yearsOfExperience: z.string().min(1, "Please select years of experience"),
  currentTitle: z.string().optional(),
  currentCompany: z.string().optional(),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(1000, "Bio must not exceed 1000 characters"),

  // Profile Links
  resumeUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),

  // Skills
  skills: z.array(z.string()).min(1, "Please select at least one skill"),

  // Preferences
  desiredRoles: z.array(z.string()).min(1, "Please select at least one desired role"),
  salaryMin: z.number().min(0, "Minimum salary must be positive"),
  salaryMax: z.number().min(0, "Maximum salary must be positive"),
  remotePreference: z.enum(["remote", "hybrid", "onsite", "flexible"]),
  availabilityDate: z.string().optional(),
});

export type CandidateProfileFormData = z.infer<typeof candidateProfileSchema>;

// Job Posting Form
export const jobPostingSchema = z.object({
  // Step 1 - Basic Info
  title: z.string().min(5, "Job title must be at least 5 characters"),
  niche: z.string().min(1, "Please select a niche"),
  location: z.string().min(2, "Location is required"),
  remoteType: z.enum(["remote", "hybrid", "onsite"]),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead"]),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"]),

  // Step 2 - Details
  description: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .max(5000, "Description must not exceed 5000 characters"),
  responsibilities: z.array(z.string().min(1)).min(3, "Add at least 3 responsibilities"),
  requirements: z.array(z.string().min(1)).min(3, "Add at least 3 requirements"),
  niceToHaves: z.array(z.string().min(1)).optional(),
  techStack: z.array(z.string()).min(1, "Add at least 1 technology"),
  salaryMin: z.number().min(0, "Minimum salary must be positive"),
  salaryMax: z.number().min(0, "Maximum salary must be positive"),
  salaryCurrency: z.string().default("USD"),
  benefits: z.array(z.string().min(1)).optional(),
});

export type JobPostingFormData = z.infer<typeof jobPostingSchema>;
