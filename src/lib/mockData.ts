// Mock data temporarily disabled - use API data instead
// Original mock data moved to mockData-disabled.ts

import type { Job, User } from "@/types";

export const mockUsers: User[] = [];
export const mockCandidates: any[] = [];
export const mockEmployers: any[] = [];
export const mockJobs: Job[] = [];
export const mockApplications: any[] = [];

// Helper functions
export const generateId = () => Math.random().toString(36).substring(2, 11);
export const getJobById = (id: string): Job | undefined => undefined;
export const getUserById = (id: string): User | undefined => undefined;
