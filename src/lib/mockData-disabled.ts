// Mock data disabled to avoid schema mismatches
import type {
  User,
  Candidate,
  Employer,
  Job,
  Application,
  ApplicationStatus,
} from "@/types";

export const mockUsers: User[] = [];
export const mockEmployers: Employer[] = [];
export const mockCandidates: Candidate[] = [];
export const mockJobs: Job[] = [];
export const mockApplications: Application[] = [];

export function getJobById(id: string): Job | undefined {
  return undefined;
}

export function getEmployerById(id: string): Employer | undefined {
  return undefined;
}

export function getCandidateById(id: string): Candidate | undefined {
  return undefined;
}

export function getUserById(id: string): User | undefined {
  return undefined;
}

export function getJobsByEmployerId(employerId: string): Job[] {
  return [];
}

export function getApplicationsByJobId(jobId: string): Application[] {
  return [];
}

export function getApplicationsByCandidateId(candidateId: string): Application[] {
  return [];
}

export function filterJobs(filters: any): Job[] {
  return [];
}

export function paginateResults<T>(items: T[], page: number, limit: number) {
  return {
    data: [],
    total: 0,
    page,
    limit,
    totalPages: 0,
  };
}

export const mockData = {
  users: mockUsers,
  employers: mockEmployers,
  candidates: mockCandidates,
  jobs: mockJobs,
  applications: mockApplications,
};
