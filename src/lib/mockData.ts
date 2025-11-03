import type {
  User,
  Candidate,
  Employer,
  Job,
  Application,
  JobNiche,
  ApplicationStatus,
} from "@/types";

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Helper function to get random date
const getRandomDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
};

// Mock Users
export const mockUsers: User[] = [
  // Candidates (1-20)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `user-${i + 1}`,
    email: `candidate${i + 1}@example.com`,
    fullName: [
      "Sarah Johnson",
      "Michael Chen",
      "Emily Rodriguez",
      "David Kim",
      "Jessica Martinez",
      "James Wilson",
      "Maria Garcia",
      "Robert Taylor",
      "Jennifer Brown",
      "William Anderson",
      "Lisa Thompson",
      "Christopher Lee",
      "Amanda White",
      "Daniel Harris",
      "Michelle Clark",
      "Matthew Lewis",
      "Laura Walker",
      "Andrew Hall",
      "Nicole Allen",
      "Kevin Young",
    ][i],
    role: "candidate" as const,
    createdAt: getRandomDate(180),
    updatedAt: getRandomDate(30),
  })),
  // Employers (21-30)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `user-${i + 21}`,
    email: `employer${i + 1}@company.com`,
    fullName: [
      "John Smith",
      "Anna Davis",
      "Mark Johnson",
      "Susan Williams",
      "Paul Martinez",
      "Karen Brown",
      "Steven Taylor",
      "Nancy Wilson",
      "Richard Garcia",
      "Patricia Anderson",
    ][i],
    role: "employer" as const,
    createdAt: getRandomDate(365),
    updatedAt: getRandomDate(60),
  })),
];

// Mock Employers
export const mockEmployers: Employer[] = [
  {
    id: "emp-1",
    userId: "user-21",
    companyName: "TechAI Solutions",
    companyLogo: "/logos/techai.png",
    companyWebsite: "https://techai.com",
    companySize: "50-200",
    industry: "AI/ML",
    location: "San Francisco, CA",
    description: "Leading AI research and development company specializing in machine learning solutions for enterprise.",
    jobs: [],
    createdAt: getRandomDate(365),
    updatedAt: getRandomDate(60),
  },
  {
    id: "emp-2",
    userId: "user-22",
    companyName: "HealthTech Innovators",
    companyLogo: "/logos/healthtech.png",
    companyWebsite: "https://healthtech.com",
    companySize: "200-500",
    industry: "Healthcare IT",
    location: "Boston, MA",
    description: "Revolutionizing healthcare through innovative IT solutions and digital health platforms.",
    jobs: [],
    createdAt: getRandomDate(365),
    updatedAt: getRandomDate(60),
  },
  {
    id: "emp-3",
    userId: "user-23",
    companyName: "FinanceAI Corp",
    companyLogo: "/logos/financeai.png",
    companyWebsite: "https://financeai.com",
    companySize: "100-500",
    industry: "FinTech",
    location: "New York, NY",
    description: "AI-powered financial technology company providing cutting-edge trading and risk management solutions.",
    jobs: [],
    createdAt: getRandomDate(365),
    updatedAt: getRandomDate(60),
  },
  {
    id: "emp-4",
    userId: "user-24",
    companyName: "CyberShield Security",
    companyLogo: "/logos/cybershield.png",
    companyWebsite: "https://cybershield.com",
    companySize: "50-200",
    industry: "Cybersecurity",
    location: "Austin, TX",
    description: "Next-generation cybersecurity solutions protecting enterprises from evolving threats.",
    jobs: [],
    createdAt: getRandomDate(365),
    updatedAt: getRandomDate(60),
  },
  {
    id: "emp-5",
    userId: "user-25",
    companyName: "DataInsights Analytics",
    companyLogo: "/logos/datainsights.png",
    companyWebsite: "https://datainsights.com",
    companySize: "20-50",
    industry: "Data Science",
    location: "Seattle, WA",
    description: "Advanced data analytics and business intelligence solutions for modern enterprises.",
    jobs: [],
    createdAt: getRandomDate(365),
    updatedAt: getRandomDate(60),
  },
  {
    id: "emp-6",
    userId: "user-26",
    companyName: "CloudScale Systems",
    companyLogo: "/logos/cloudscale.png",
    companyWebsite: "https://cloudscale.com",
    companySize: "500-1000",
    industry: "Cloud Computing",
    location: "Remote",
    description: "Enterprise cloud infrastructure and platform solutions enabling digital transformation.",
    jobs: [],
    createdAt: getRandomDate(365),
    updatedAt: getRandomDate(60),
  },
  {
    id: "emp-7",
    userId: "user-27",
    companyName: "NeuralNet Labs",
    companyLogo: "/logos/neuralnet.png",
    companyWebsite: "https://neuralnetlabs.com",
    companySize: "10-50",
    industry: "AI/ML",
    location: "Palo Alto, CA",
    description: "Research-focused AI company pushing the boundaries of neural network technology.",
    jobs: [],
    createdAt: getRandomDate(365),
    updatedAt: getRandomDate(60),
  },
  {
    id: "emp-8",
    userId: "user-28",
    companyName: "MedCloud Solutions",
    companyLogo: "/logos/medcloud.png",
    companyWebsite: "https://medcloud.com",
    companySize: "100-200",
    industry: "Healthcare IT",
    location: "Chicago, IL",
    description: "Cloud-based healthcare management systems and electronic health records solutions.",
    jobs: [],
    createdAt: getRandomDate(365),
    updatedAt: getRandomDate(60),
  },
  {
    id: "emp-9",
    userId: "user-29",
    companyName: "CryptoFinance Pro",
    companyLogo: "/logos/cryptofinance.png",
    companyWebsite: "https://cryptofinance.com",
    companySize: "50-100",
    industry: "FinTech",
    location: "Miami, FL",
    description: "Blockchain and cryptocurrency financial services platform.",
    jobs: [],
    createdAt: getRandomDate(365),
    updatedAt: getRandomDate(60),
  },
  {
    id: "emp-10",
    userId: "user-30",
    companyName: "SecureData Technologies",
    companyLogo: "/logos/securedata.png",
    companyWebsite: "https://securedata.com",
    companySize: "200-500",
    industry: "Cybersecurity",
    location: "Washington, DC",
    description: "Enterprise data security and compliance solutions for regulated industries.",
    jobs: [],
    createdAt: getRandomDate(365),
    updatedAt: getRandomDate(60),
  },
];

// Mock Candidates
export const mockCandidates: Candidate[] = Array.from({ length: 20 }, (_, i) => ({
  id: `cand-${i + 1}`,
  userId: `user-${i + 1}`,
  phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  location: [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
    "Remote",
    "Los Angeles, CA",
    "Chicago, IL",
    "Denver, CO",
    "Portland, OR",
  ][i % 10],
  bio: `Passionate ${["AI/ML engineer", "healthcare IT specialist", "FinTech developer", "cybersecurity expert", "data scientist"][i % 5]} with ${3 + (i % 8)} years of experience building innovative solutions.`,
  avatar: `/avatars/candidate-${i + 1}.jpg`,
  skills: [
    ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Deep Learning"],
    ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    ["Java", "Spring Boot", "Microservices", "Kubernetes", "PostgreSQL"],
    ["Penetration Testing", "SIEM", "Network Security", "Incident Response", "Cryptography"],
    ["R", "SQL", "Tableau", "Apache Spark", "Statistical Analysis"],
  ][i % 5],
  desiredRoles: [
    ["Machine Learning Engineer", "AI Researcher"],
    ["Full Stack Developer", "Senior Software Engineer"],
    ["Backend Engineer", "DevOps Engineer"],
    ["Security Engineer", "Security Analyst"],
    ["Data Scientist", "Data Engineer"],
  ][i % 5],
  experienceLevel: ["entry", "mid", "senior", "lead"][i % 4] as "entry" | "mid" | "senior" | "lead",
  employmentType: i % 3 === 0 ? ["full-time", "contract"] : ["full-time"],
  remotePreference: ["remote", "hybrid", "onsite", "flexible"][i % 4] as "remote" | "hybrid" | "onsite" | "flexible",
  salaryMin: 80000 + (i % 10) * 20000,
  salaryMax: 120000 + (i % 10) * 30000,
  availabilityDate: new Date(Date.now() + (i % 90) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  resumeUrl: `/resumes/candidate-${i + 1}.pdf`,
  portfolioUrl: i % 3 === 0 ? `https://portfolio-${i + 1}.com` : undefined,
  githubUrl: i % 2 === 0 ? `https://github.com/candidate${i + 1}` : undefined,
  linkedinUrl: `https://linkedin.com/in/candidate${i + 1}`,
  experience: [
    {
      id: `exp-${i}-1`,
      candidateId: `cand-${i + 1}`,
      title: ["Senior ML Engineer", "Software Engineer", "Backend Developer", "Security Analyst", "Data Scientist"][i % 5],
      company: ["Tech Corp", "Startup Inc", "BigTech Ltd", "Security Co", "Data Analytics LLC"][i % 5],
      location: ["San Francisco, CA", "Remote", "New York, NY"][i % 3],
      startDate: "2021-01",
      endDate: i % 3 === 0 ? undefined : "2023-12",
      current: i % 3 === 0,
      description: "Led development of machine learning models and data pipelines.",
    },
  ],
  applications: [],
  createdAt: getRandomDate(180),
  updatedAt: getRandomDate(30),
}));

// Mock Jobs
export const mockJobs: Job[] = [
  // AI/ML Jobs (1-15)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `job-${i + 1}`,
    employerId: ["emp-1", "emp-7"][i % 2],
    title: [
      "Senior Machine Learning Engineer",
      "AI Research Scientist",
      "Deep Learning Engineer",
      "ML Ops Engineer",
      "Computer Vision Engineer",
      "NLP Engineer",
      "AI Product Manager",
      "Machine Learning Architect",
      "Research Engineer - Reinforcement Learning",
      "Applied AI Scientist",
      "MLOps Platform Engineer",
      "AI Solutions Architect",
      "Senior Data Scientist - ML",
      "Machine Learning Engineer - Recommendation Systems",
      "AI Engineering Lead",
    ][i],
    niche: "ai-ml" as JobNiche,
    description: `We're seeking an exceptional ${["Senior Machine Learning Engineer", "AI Research Scientist"][i % 2]} to join our growing team. You'll work on cutting-edge AI projects, developing innovative solutions that impact millions of users. This role offers the opportunity to work with state-of-the-art technologies and collaborate with world-class researchers and engineers.`,
    location: ["San Francisco, CA", "Palo Alto, CA", "Remote", "New York, NY"][i % 4],
    remoteType: ["remote", "hybrid", "onsite"][i % 3] as "remote" | "hybrid" | "onsite",
    experienceLevel: ["mid", "senior", "lead", "senior"][i % 4] as "entry" | "mid" | "senior" | "lead",
    employmentType: (i % 10 === 0 ? "contract" : "full-time") as "full-time" | "part-time" | "contract" | "internship",
    salaryMin: 120000 + i * 10000,
    salaryMax: 180000 + i * 15000,
    salaryCurrency: "USD",
    responsibilities: [
      "Design and implement machine learning models for production systems",
      "Collaborate with cross-functional teams to identify AI opportunities",
      "Optimize model performance and scalability",
      "Mentor junior engineers and conduct code reviews",
      "Stay current with latest ML research and best practices",
    ],
    requirements: [
      "5+ years of experience in machine learning engineering",
      "Strong proficiency in Python and ML frameworks (TensorFlow/PyTorch)",
      "Experience deploying ML models at scale",
      "Deep understanding of ML algorithms and statistics",
      "Excellent problem-solving and communication skills",
    ],
    niceToHaves: [
      "PhD in Computer Science, Machine Learning, or related field",
      "Publications at top-tier ML conferences",
      "Experience with MLOps and model monitoring",
      "Contributions to open-source ML projects",
    ],
    techStack: ["Python", "TensorFlow", "PyTorch", "AWS", "Docker", "Kubernetes", "SQL"],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Unlimited PTO",
      "401(k) matching",
      "Professional development budget",
      "Remote work flexibility",
    ],
    status: "published" as "draft" | "published" | "closed" | "archived",
    applications: [],
    views: Math.floor(Math.random() * 500) + 100,
    applicationsCount: Math.floor(Math.random() * 50) + 10,
    postedAt: getRandomDate(30),
    createdAt: getRandomDate(45),
    updatedAt: getRandomDate(15),
  })),

  // Healthcare IT Jobs (16-25)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `job-${i + 16}`,
    employerId: ["emp-2", "emp-8"][i % 2],
    title: [
      "Senior Healthcare Software Engineer",
      "Clinical Data Analyst",
      "Healthcare IT Project Manager",
      "FHIR Integration Specialist",
      "Health Informatics Engineer",
      "Medical Device Software Developer",
      "Healthcare Cloud Architect",
      "EHR Implementation Specialist",
      "Healthcare Data Engineer",
      "Telemedicine Platform Developer",
    ][i],
    niche: "healthcare-it" as JobNiche,
    description: `Join our mission to transform healthcare through technology. As a ${[
      "Senior Healthcare Software Engineer",
      "Clinical Data Analyst",
    ][i % 2]}, you'll build innovative solutions that improve patient outcomes and streamline healthcare delivery.`,
    location: ["Boston, MA", "Chicago, IL", "Remote", "San Diego, CA"][i % 4],
    remoteType: ["hybrid", "onsite", "remote"][i % 3] as "remote" | "hybrid" | "onsite",
    experienceLevel: ["mid", "senior", "entry", "senior"][i % 4] as "entry" | "mid" | "senior" | "lead",
    employmentType: "full-time" as "full-time" | "part-time" | "contract" | "internship",
    salaryMin: 100000 + i * 8000,
    salaryMax: 150000 + i * 12000,
    salaryCurrency: "USD",
    responsibilities: [
      "Develop and maintain healthcare applications and systems",
      "Ensure HIPAA compliance and data security",
      "Integrate with EHR systems and healthcare APIs",
      "Collaborate with clinical staff to understand requirements",
      "Implement HL7/FHIR standards",
    ],
    requirements: [
      "3+ years of healthcare software development experience",
      "Strong understanding of HIPAA and healthcare regulations",
      "Experience with healthcare data standards (HL7, FHIR)",
      "Proficiency in modern web technologies",
      "Bachelor's degree in Computer Science or related field",
    ],
    niceToHaves: [
      "Healthcare certifications (e.g., CPHIMS)",
      "Experience with Epic, Cerner, or other EHR systems",
      "Knowledge of medical terminology",
      "Experience in clinical settings",
    ],
    techStack: ["Java", "React", "Node.js", "PostgreSQL", "AWS", "Docker", "HL7/FHIR"],
    benefits: [
      "Comprehensive health insurance",
      "401(k) with matching",
      "Flexible work arrangements",
      "Professional development opportunities",
      "Paid time off and holidays",
    ],
    status: "published" as "draft" | "published" | "closed" | "archived",
    applications: [],
    views: Math.floor(Math.random() * 400) + 80,
    applicationsCount: Math.floor(Math.random() * 40) + 8,
    postedAt: getRandomDate(25),
    createdAt: getRandomDate(40),
    updatedAt: getRandomDate(10),
  })),

  // FinTech Jobs (26-35)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `job-${i + 26}`,
    employerId: ["emp-3", "emp-9"][i % 2],
    title: [
      "Senior FinTech Engineer",
      "Blockchain Developer",
      "Quantitative Developer",
      "Payment Systems Engineer",
      "Risk Analytics Engineer",
      "Trading Platform Developer",
      "Financial Data Scientist",
      "Cryptocurrency Engineer",
      "Financial Services Architect",
      "RegTech Solutions Engineer",
    ][i],
    niche: "fintech" as JobNiche,
    description: `We're revolutionizing financial services with cutting-edge technology. Join us as a ${[
      "Senior FinTech Engineer",
      "Blockchain Developer",
    ][i % 2]} to build the future of finance.`,
    location: ["New York, NY", "Miami, FL", "San Francisco, CA", "Remote"][i % 4],
    remoteType: ["onsite", "hybrid", "remote"][i % 3] as "remote" | "hybrid" | "onsite",
    experienceLevel: ["senior", "mid", "senior", "lead"][i % 4] as "entry" | "mid" | "senior" | "lead",
    employmentType: "full-time" as "full-time" | "part-time" | "contract" | "internship",
    salaryMin: 130000 + i * 10000,
    salaryMax: 200000 + i * 15000,
    salaryCurrency: "USD",
    responsibilities: [
      "Design and build scalable financial systems",
      "Implement secure payment processing solutions",
      "Develop trading algorithms and risk models",
      "Ensure regulatory compliance (PCI-DSS, SOC2)",
      "Optimize system performance for high-frequency transactions",
    ],
    requirements: [
      "5+ years of experience in financial technology",
      "Strong understanding of financial systems and regulations",
      "Experience with high-performance, low-latency systems",
      "Proficiency in Java, Python, or C++",
      "Knowledge of cryptography and security best practices",
    ],
    niceToHaves: [
      "CFA or FRM certification",
      "Experience with blockchain and smart contracts",
      "Knowledge of quantitative finance",
      "Previous work at trading firms or banks",
    ],
    techStack: ["Java", "Python", "Kafka", "Redis", "PostgreSQL", "AWS", "Kubernetes"],
    benefits: [
      "Competitive salary and bonuses",
      "Stock options",
      "Premium health insurance",
      "401(k) matching",
      "Gym membership",
      "Catered meals",
    ],
    status: "published" as "draft" | "published" | "closed" | "archived",
    applications: [],
    views: Math.floor(Math.random() * 450) + 90,
    applicationsCount: Math.floor(Math.random() * 45) + 12,
    postedAt: getRandomDate(20),
    createdAt: getRandomDate(35),
    updatedAt: getRandomDate(12),
  })),

  // Cybersecurity Jobs (36-43)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `job-${i + 36}`,
    employerId: ["emp-4", "emp-10"][i % 2],
    title: [
      "Senior Security Engineer",
      "Penetration Tester",
      "Security Operations Center Analyst",
      "Cloud Security Architect",
      "Incident Response Specialist",
      "Application Security Engineer",
      "Security Compliance Manager",
      "Threat Intelligence Analyst",
    ][i],
    niche: "cybersecurity" as JobNiche,
    description: `Protect our infrastructure and customers from evolving cyber threats. As a ${[
      "Senior Security Engineer",
      "Penetration Tester",
    ][i % 2]}, you'll be at the forefront of cybersecurity.`,
    location: ["Austin, TX", "Washington, DC", "Remote", "Seattle, WA"][i % 4],
    remoteType: ["remote", "hybrid", "onsite"][i % 3] as "remote" | "hybrid" | "onsite",
    experienceLevel: ["senior", "mid", "senior", "mid"][i % 4] as "entry" | "mid" | "senior" | "lead",
    employmentType: "full-time" as "full-time" | "part-time" | "contract" | "internship",
    salaryMin: 110000 + i * 10000,
    salaryMax: 170000 + i * 15000,
    salaryCurrency: "USD",
    responsibilities: [
      "Conduct security assessments and penetration testing",
      "Monitor and respond to security incidents",
      "Implement security controls and best practices",
      "Develop and maintain security policies",
      "Collaborate with development teams on secure coding",
    ],
    requirements: [
      "4+ years of cybersecurity experience",
      "Strong knowledge of security frameworks (NIST, ISO 27001)",
      "Experience with security tools (SIEM, IDS/IPS, firewalls)",
      "Understanding of network protocols and architectures",
      "Security certifications (CISSP, CEH, or equivalent)",
    ],
    niceToHaves: [
      "OSCP or GPEN certification",
      "Experience with cloud security (AWS, Azure, GCP)",
      "Bug bounty program participation",
      "Malware analysis expertise",
    ],
    techStack: ["Python", "Burp Suite", "Metasploit", "Wireshark", "Splunk", "AWS", "Linux"],
    benefits: [
      "Competitive compensation",
      "Health and wellness benefits",
      "Certification and training budget",
      "Conference attendance",
      "Flexible schedule",
    ],
    status: "published" as "draft" | "published" | "closed" | "archived",
    applications: [],
    views: Math.floor(Math.random() * 350) + 70,
    applicationsCount: Math.floor(Math.random() * 35) + 8,
    postedAt: getRandomDate(18),
    createdAt: getRandomDate(30),
    updatedAt: getRandomDate(8),
  })),

  // Data Science Jobs (44-48)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `job-${i + 44}`,
    employerId: "emp-5",
    title: [
      "Senior Data Scientist",
      "Analytics Engineer",
      "Business Intelligence Developer",
      "Data Engineer",
      "Machine Learning Data Scientist",
    ][i],
    niche: "data-science" as JobNiche,
    description: `Transform data into actionable insights. As a ${["Senior Data Scientist", "Analytics Engineer"][i % 2]}, you'll drive data-driven decision making across the organization.`,
    location: ["Seattle, WA", "San Francisco, CA", "Remote", "New York, NY"][i % 4],
    remoteType: ["remote", "hybrid"][i % 2] as "remote" | "hybrid" | "onsite",
    experienceLevel: ["senior", "mid", "senior", "mid"][i % 4] as "entry" | "mid" | "senior" | "lead",
    employmentType: "full-time" as "full-time" | "part-time" | "contract" | "internship",
    salaryMin: 115000 + i * 12000,
    salaryMax: 175000 + i * 18000,
    salaryCurrency: "USD",
    responsibilities: [
      "Develop predictive models and statistical analyses",
      "Build data pipelines and ETL processes",
      "Create dashboards and data visualizations",
      "Collaborate with stakeholders on analytics projects",
      "Mentor junior data scientists",
    ],
    requirements: [
      "4+ years of data science experience",
      "Strong proficiency in Python and SQL",
      "Experience with statistical modeling and machine learning",
      "Expertise in data visualization tools (Tableau, PowerBI)",
      "Master's degree in Statistics, Math, or related field",
    ],
    niceToHaves: [
      "PhD in quantitative field",
      "Experience with big data technologies (Spark, Hadoop)",
      "Knowledge of A/B testing and experimentation",
      "Industry domain expertise",
    ],
    techStack: ["Python", "R", "SQL", "Tableau", "Apache Spark", "AWS", "Snowflake"],
    benefits: [
      "Competitive salary",
      "Stock options",
      "Comprehensive benefits",
      "Learning and development budget",
      "Flexible work environment",
    ],
    status: "published" as "draft" | "published" | "closed" | "archived",
    applications: [],
    views: Math.floor(Math.random() * 300) + 60,
    applicationsCount: Math.floor(Math.random() * 30) + 6,
    postedAt: getRandomDate(15),
    createdAt: getRandomDate(25),
    updatedAt: getRandomDate(7),
  })),

  // Cloud Computing Jobs (49-50)
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `job-${i + 49}`,
    employerId: "emp-6",
    title: ["Cloud Solutions Architect", "DevOps Engineer - Cloud Infrastructure"][i],
    niche: "cloud-computing" as JobNiche,
    description: `Build and scale cloud infrastructure for enterprise clients. Join us as a ${["Cloud Solutions Architect", "DevOps Engineer"][i]} to shape the future of cloud computing.`,
    location: "Remote",
    remoteType: "remote" as "remote" | "hybrid" | "onsite",
    experienceLevel: ["lead", "senior"][i] as "entry" | "mid" | "senior" | "lead",
    employmentType: "full-time" as "full-time" | "part-time" | "contract" | "internship",
    salaryMin: 140000 + i * 15000,
    salaryMax: 210000 + i * 20000,
    salaryCurrency: "USD",
    responsibilities: [
      "Design cloud architecture solutions for enterprise clients",
      "Implement Infrastructure as Code (IaC) practices",
      "Optimize cloud costs and performance",
      "Lead cloud migration projects",
      "Mentor engineering teams on cloud best practices",
    ],
    requirements: [
      "6+ years of cloud engineering experience",
      "Expert knowledge of AWS, Azure, or GCP",
      "Strong experience with Kubernetes and Docker",
      "Proficiency in Terraform or CloudFormation",
      "Cloud certifications (AWS Solutions Architect, etc.)",
    ],
    niceToHaves: [
      "Multiple cloud platform certifications",
      "Experience with multi-cloud architectures",
      "Background in site reliability engineering",
      "Open-source contributions",
    ],
    techStack: ["AWS", "Kubernetes", "Docker", "Terraform", "Python", "Go", "Jenkins"],
    benefits: [
      "Top-tier compensation and equity",
      "Remote-first culture",
      "Unlimited PTO",
      "Health, dental, vision insurance",
      "Home office stipend",
      "Professional development budget",
    ],
    status: "published" as "draft" | "published" | "closed" | "archived",
    applications: [],
    views: Math.floor(Math.random() * 400) + 80,
    applicationsCount: Math.floor(Math.random() * 40) + 10,
    postedAt: getRandomDate(12),
    createdAt: getRandomDate(20),
    updatedAt: getRandomDate(5),
  })),
];

// Mock Applications
export const mockApplications: Application[] = Array.from({ length: 100 }, (_, i) => ({
  id: `app-${i + 1}`,
  jobId: mockJobs[i % 50].id,
  candidateId: mockCandidates[i % 20].id,
  status: ["pending", "reviewing", "shortlisted", "interview", "offer", "rejected"][
    Math.floor(Math.random() * 6)
  ] as ApplicationStatus,
  coverLetter: i % 3 === 0 ? "I am excited to apply for this position..." : undefined,
  resumeUrl: `/resumes/candidate-${(i % 20) + 1}.pdf`,
  answers: {},
  notes: i % 5 === 0 ? "Strong technical background" : undefined,
  appliedAt: getRandomDate(60),
  updatedAt: getRandomDate(30),
}));

// Helper Functions
export function getJobById(id: string): Job | undefined {
  return mockJobs.find((job) => job.id === id);
}

export function getEmployerById(id: string): Employer | undefined {
  return mockEmployers.find((emp) => emp.id === id);
}

export function getCandidateById(id: string): Candidate | undefined {
  return mockCandidates.find((cand) => cand.id === id);
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

export function getJobsByEmployerId(employerId: string): Job[] {
  return mockJobs.filter((job) => job.employerId === employerId);
}

export function getApplicationsByJobId(jobId: string): Application[] {
  return mockApplications.filter((app) => app.jobId === jobId);
}

export function getApplicationsByCandidateId(candidateId: string): Application[] {
  return mockApplications.filter((app) => app.candidateId === candidateId);
}

export function filterJobs(filters: {
  search?: string;
  niche?: JobNiche[];
  remoteType?: ("remote" | "hybrid" | "onsite")[];
  experienceLevel?: ("entry" | "mid" | "senior" | "lead")[];
  employmentType?: ("full-time" | "part-time" | "contract" | "internship")[];
  salaryMin?: number;
  location?: string;
}): Job[] {
  let filtered = [...mockJobs];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.techStack.some((tech) => tech.toLowerCase().includes(search))
    );
  }

  if (filters.niche && filters.niche.length > 0) {
    filtered = filtered.filter((job) => filters.niche!.includes(job.niche));
  }

  if (filters.remoteType && filters.remoteType.length > 0) {
    filtered = filtered.filter((job) => filters.remoteType!.includes(job.remoteType));
  }

  if (filters.experienceLevel && filters.experienceLevel.length > 0) {
    filtered = filtered.filter((job) => filters.experienceLevel!.includes(job.experienceLevel));
  }

  if (filters.employmentType && filters.employmentType.length > 0) {
    filtered = filtered.filter((job) => filters.employmentType!.includes(job.employmentType));
  }

  if (filters.salaryMin) {
    filtered = filtered.filter((job) => job.salaryMax >= filters.salaryMin!);
  }

  if (filters.location) {
    const location = filters.location.toLowerCase();
    filtered = filtered.filter((job) => job.location.toLowerCase().includes(location));
  }

  return filtered;
}

export function paginateResults<T>(items: T[], page: number, limit: number) {
  const totalPages = Math.ceil(items.length / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: items.slice(startIndex, endIndex),
    total: items.length,
    page,
    limit,
    totalPages,
  };
}

// Export all mock data
export const mockData = {
  users: mockUsers,
  employers: mockEmployers,
  candidates: mockCandidates,
  jobs: mockJobs,
  applications: mockApplications,
};
