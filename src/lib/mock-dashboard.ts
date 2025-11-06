// Mock dashboard data temporarily disabled
export interface DashboardStats {
  applicationsSent: number;
  testsTaken: number;
  messages: number;
  profileCompletion: number;
}

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  dateApplied: string;
  salary?: string;
  location: string;
}

export const mockDashboardStats: DashboardStats = {
  applicationsSent: 0,
  testsTaken: 0,
  messages: 0,
  profileCompletion: 0,
};

export const mockRecentApplications: Application[] = [];
export const mockUsers: any[] = [];
export const mockUserProfile: any = null;
export const mockApplications: any[] = [];
export const mockRecommendedJobs: any[] = [];
export const getStatusColor = (status: string) => 'gray';
export const getStatusIcon = (status: string) => null;
