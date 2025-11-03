export interface EmployerDashboardStats {
  activeJobs: number;
  totalApplications: number;
  filledPositions: number;
  pendingInvoices: number;
}

export interface ActiveJob {
  id: string;
  title: string;
  department: string;
  postedDate: string;
  applicationsCount: number;
  newApplications: number;
  status: "active" | "paused" | "closed";
  views: number;
}

export interface RecentApplication {
  id: string;
  candidateName: string;
  jobTitle: string;
  jobId: string;
  status: "new" | "reviewing" | "shortlisted" | "interview" | "rejected" | "offered";
  appliedDate: string;
  matchScore?: number;
  resumeUrl?: string;
}

export interface ApplicationsOverTime {
  date: string;
  applications: number;
  interviews: number;
}

export const mockEmployerStats: EmployerDashboardStats = {
  activeJobs: 8,
  totalApplications: 247,
  filledPositions: 12,
  pendingInvoices: 3,
};

export const mockActiveJobs: ActiveJob[] = [
  {
    id: "1",
    title: "Senior Machine Learning Engineer",
    department: "AI Research",
    postedDate: "2025-10-15",
    applicationsCount: 45,
    newApplications: 8,
    status: "active",
    views: 892,
  },
  {
    id: "2",
    title: "Data Scientist",
    department: "Analytics",
    postedDate: "2025-10-20",
    applicationsCount: 38,
    newApplications: 5,
    status: "active",
    views: 654,
  },
  {
    id: "3",
    title: "AI Research Scientist",
    department: "AI Research",
    postedDate: "2025-10-22",
    applicationsCount: 52,
    newApplications: 12,
    status: "active",
    views: 1024,
  },
  {
    id: "4",
    title: "ML Platform Engineer",
    department: "Engineering",
    postedDate: "2025-10-25",
    applicationsCount: 28,
    newApplications: 6,
    status: "active",
    views: 487,
  },
  {
    id: "5",
    title: "Computer Vision Engineer",
    department: "Product",
    postedDate: "2025-10-28",
    applicationsCount: 31,
    newApplications: 15,
    status: "active",
    views: 723,
  },
];

export const mockRecentApplications: RecentApplication[] = [
  {
    id: "1",
    candidateName: "Michael Chen",
    jobTitle: "Senior Machine Learning Engineer",
    jobId: "1",
    status: "shortlisted",
    appliedDate: "2025-11-01",
    matchScore: 92,
  },
  {
    id: "2",
    candidateName: "Sarah Johnson",
    jobTitle: "Data Scientist",
    jobId: "2",
    status: "interview",
    appliedDate: "2025-11-01",
    matchScore: 88,
  },
  {
    id: "3",
    candidateName: "David Martinez",
    jobTitle: "AI Research Scientist",
    jobId: "3",
    status: "new",
    appliedDate: "2025-11-02",
    matchScore: 95,
  },
  {
    id: "4",
    candidateName: "Emily Rodriguez",
    jobTitle: "ML Platform Engineer",
    jobId: "4",
    status: "reviewing",
    appliedDate: "2025-11-02",
    matchScore: 85,
  },
  {
    id: "5",
    candidateName: "James Wilson",
    jobTitle: "Computer Vision Engineer",
    jobId: "5",
    status: "new",
    appliedDate: "2025-11-03",
    matchScore: 90,
  },
  {
    id: "6",
    candidateName: "Lisa Anderson",
    jobTitle: "Senior Machine Learning Engineer",
    jobId: "1",
    status: "reviewing",
    appliedDate: "2025-11-03",
    matchScore: 87,
  },
  {
    id: "7",
    candidateName: "Robert Taylor",
    jobTitle: "Data Scientist",
    jobId: "2",
    status: "shortlisted",
    appliedDate: "2025-11-03",
    matchScore: 91,
  },
];

export const mockApplicationsOverTime: ApplicationsOverTime[] = [
  { date: "Oct 4", applications: 18, interviews: 3 },
  { date: "Oct 11", applications: 24, interviews: 5 },
  { date: "Oct 18", applications: 31, interviews: 7 },
  { date: "Oct 25", applications: 28, interviews: 6 },
  { date: "Nov 1", applications: 35, interviews: 9 },
  { date: "Nov 8", applications: 42, interviews: 11 },
  { date: "Nov 15", applications: 38, interviews: 8 },
];

export const getApplicationStatusColor = (
  status: RecentApplication["status"]
): { bg: string; text: string; label: string } => {
  switch (status) {
    case "new":
      return {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "New",
      };
    case "reviewing":
      return {
        bg: "bg-secondary-100",
        text: "text-secondary-700",
        label: "Reviewing",
      };
    case "shortlisted":
      return {
        bg: "bg-accent-100",
        text: "text-accent-700",
        label: "Shortlisted",
      };
    case "interview":
      return {
        bg: "bg-primary-100",
        text: "text-primary-700",
        label: "Interview",
      };
    case "rejected":
      return {
        bg: "bg-danger-100",
        text: "text-danger-700",
        label: "Rejected",
      };
    case "offered":
      return {
        bg: "bg-success-100",
        text: "text-success-700",
        label: "Offered",
      };
  }
};

export const getJobStatusColor = (
  status: ActiveJob["status"]
): { bg: string; text: string; label: string } => {
  switch (status) {
    case "active":
      return {
        bg: "bg-success-100",
        text: "text-success-700",
        label: "Active",
      };
    case "paused":
      return {
        bg: "bg-secondary-100",
        text: "text-secondary-700",
        label: "Paused",
      };
    case "closed":
      return {
        bg: "bg-danger-100",
        text: "text-danger-700",
        label: "Closed",
      };
  }
};
