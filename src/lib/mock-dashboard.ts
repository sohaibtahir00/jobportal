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
  status: "pending" | "reviewing" | "interview" | "rejected" | "accepted";
  dateApplied: string;
  salary?: string;
  location: string;
}

export interface UserProfile {
  name: string;
  email: string;
  profileCompletion: number;
  missingFields: string[];
}

export const mockDashboardStats: DashboardStats = {
  applicationsSent: 12,
  testsTaken: 8,
  messages: 5,
  profileCompletion: 75,
};

export const mockUserProfile: UserProfile = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  profileCompletion: 75,
  missingFields: ["Portfolio Link", "Skills Assessment", "Preferred Locations"],
};

export const mockApplications: Application[] = [
  {
    id: "1",
    jobTitle: "Senior Machine Learning Engineer",
    company: "TechCorp AI",
    status: "interview",
    dateApplied: "2025-10-28",
    salary: "$140k - $180k",
    location: "San Francisco, CA",
  },
  {
    id: "2",
    jobTitle: "AI Research Scientist",
    company: "DeepMind Research",
    status: "reviewing",
    dateApplied: "2025-10-25",
    salary: "$160k - $200k",
    location: "Remote",
  },
  {
    id: "3",
    jobTitle: "Data Scientist",
    company: "HealthTech Solutions",
    status: "pending",
    dateApplied: "2025-10-22",
    salary: "$120k - $150k",
    location: "Boston, MA",
  },
  {
    id: "4",
    jobTitle: "ML Engineer",
    company: "FinTech Innovations",
    status: "rejected",
    dateApplied: "2025-10-18",
    salary: "$130k - $170k",
    location: "New York, NY",
  },
  {
    id: "5",
    jobTitle: "Computer Vision Engineer",
    company: "AutoDrive Systems",
    status: "reviewing",
    dateApplied: "2025-10-15",
    salary: "$135k - $175k",
    location: "Austin, TX",
  },
];

// Recommended jobs - reusing job structure from mock-jobs
export const mockRecommendedJobs = [
  {
    id: "21",
    title: "Senior NLP Engineer",
    company: "Conversational AI Inc",
    logo: null,
    location: "Seattle, WA",
    remoteType: "Hybrid" as const,
    salary: { min: 145000, max: 185000, currency: "USD" },
    niche: "AI/ML" as const,
    experienceLevel: "Senior",
    skills: ["Python", "NLP", "Transformers", "PyTorch"],
    postedDate: "2025-10-30",
    matchScore: 95,
  },
  {
    id: "22",
    title: "ML Platform Engineer",
    company: "CloudML Systems",
    logo: null,
    location: "Remote",
    remoteType: "Remote" as const,
    salary: { min: 140000, max: 180000, currency: "USD" },
    niche: "AI/ML" as const,
    experienceLevel: "Mid-Level",
    skills: ["Kubernetes", "MLOps", "Python", "AWS"],
    postedDate: "2025-10-29",
    matchScore: 88,
  },
  {
    id: "23",
    title: "Applied AI Scientist",
    company: "Research Labs AI",
    logo: null,
    location: "Cambridge, MA",
    remoteType: "Hybrid" as const,
    salary: { min: 150000, max: 190000, currency: "USD" },
    niche: "AI/ML" as const,
    experienceLevel: "Senior",
    skills: ["PyTorch", "Research", "Deep Learning", "Python"],
    postedDate: "2025-10-28",
    matchScore: 92,
  },
];

export const getStatusColor = (
  status: Application["status"]
): { bg: string; text: string; label: string } => {
  switch (status) {
    case "pending":
      return {
        bg: "bg-secondary-100",
        text: "text-secondary-700",
        label: "Pending",
      };
    case "reviewing":
      return { bg: "bg-blue-100", text: "text-blue-700", label: "Reviewing" };
    case "interview":
      return {
        bg: "bg-accent-100",
        text: "text-accent-700",
        label: "Interview",
      };
    case "rejected":
      return { bg: "bg-danger-100", text: "text-danger-700", label: "Rejected" };
    case "accepted":
      return {
        bg: "bg-success-100",
        text: "text-success-700",
        label: "Accepted",
      };
  }
};
