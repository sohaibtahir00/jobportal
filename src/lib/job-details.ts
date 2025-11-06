import { Job } from "./mock-jobs";

export interface JobDetail extends Job {
  fullDescription: string;
  niceToHaves: string[];
  companyInfo: {
    website: string;
    size: string;
    industry: string;
    founded: string;
    description: string;
  };
}

export function getJobDetails(jobId: number): JobDetail | null {
  // Mock data disabled - return null
  return null;
}
