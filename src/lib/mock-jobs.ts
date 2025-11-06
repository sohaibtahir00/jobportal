// Mock jobs data temporarily disabled
import type { Job } from "@/types";

export type { Job };
export const mockJobs: Job[] = [];
export const getJobById = (id: string): Job | undefined => undefined;
