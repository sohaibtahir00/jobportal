export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Career Guide" | "Salary Data" | "Interview Tips" | "Skills Assessment" | "AI/ML" | "Healthcare IT" | "FinTech" | "Cybersecurity";
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "how-to-become-ai-ml-engineer-2025",
    title: "How to Become an AI/ML Engineer in 2025",
    excerpt: "A comprehensive guide to breaking into artificial intelligence and machine learning, including required skills, educational paths, and portfolio projects.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    category: "AI/ML",
    author: "Sarah Chen",
    date: "March 15, 2025",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: 2,
    slug: "2025-ai-engineer-salary-guide",
    title: "2025 AI Engineer Salary Guide by City",
    excerpt: "Detailed salary data for AI/ML engineers across major tech hubs. Includes base salary, bonuses, equity, and total compensation breakdowns.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "Salary Data",
    author: "Marcus Johnson",
    date: "March 12, 2025",
    readTime: "12 min read",
    featured: true,
  },
  {
    id: 3,
    slug: "top-20-machine-learning-interview-questions",
    title: "Top 20 Machine Learning Interview Questions",
    excerpt: "Master these essential ML interview questions covering algorithms, statistics, model evaluation, and practical implementation scenarios.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "Interview Tips",
    author: "Priya Patel",
    date: "March 10, 2025",
    readTime: "15 min read",
    featured: true,
  },
  {
    id: 4,
    slug: "how-to-ace-ai-ml-skills-assessment",
    title: "How to Ace the AI/ML Skills Assessment",
    excerpt: "Strategic preparation guide for technical skills assessments. Learn what to study, practice problems, and time management strategies.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "Skills Assessment",
    author: "David Lee",
    date: "March 8, 2025",
    readTime: "10 min read",
    featured: false,
  },
  {
    id: 5,
    slug: "junior-to-senior-ml-engineer-career-path",
    title: "Junior to Senior: ML Engineer Career Path",
    excerpt: "Navigate your ML engineering career from entry-level to senior roles. Timeline expectations, skill development, and salary progression.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "Career Guide",
    author: "Sarah Chen",
    date: "March 5, 2025",
    readTime: "9 min read",
    featured: false,
  },
  {
    id: 6,
    slug: "remote-vs-onsite-tech-salary-comparison",
    title: "Remote vs. On-site: What Pays More?",
    excerpt: "Comprehensive analysis of compensation differences between remote and on-site tech positions. Data from 5,000+ job offers.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "Salary Data",
    author: "Marcus Johnson",
    date: "March 3, 2025",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 7,
    slug: "5-ways-prepare-skills-assessment",
    title: "5 Ways to Prepare for Your Skills Assessment",
    excerpt: "Proven preparation strategies that help candidates score in the top 20%. Includes study resources, practice schedules, and test-taking tips.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "Skills Assessment",
    author: "David Lee",
    date: "February 28, 2025",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 8,
    slug: "what-employers-look-for-skills-score-cards",
    title: "What Employers Look for in Skills Score Cards",
    excerpt: "Inside perspective from hiring managers on how they evaluate skills assessments. Learn which scores matter most and red flags to avoid.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "Career Guide",
    author: "Priya Patel",
    date: "February 25, 2025",
    readTime: "8 min read",
    featured: false,
  },
  {
    id: 9,
    slug: "system-design-for-ml-engineers",
    title: "System Design for ML Engineers",
    excerpt: "Essential system design patterns for ML systems. Covers scalability, monitoring, data pipelines, and model serving architectures.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "Interview Tips",
    author: "Sarah Chen",
    date: "February 22, 2025",
    readTime: "14 min read",
    featured: false,
  },
  {
    id: 10,
    slug: "negotiating-tech-salary-complete-guide",
    title: "Negotiating Your Tech Salary: A Complete Guide",
    excerpt: "Step-by-step negotiation framework that has helped candidates secure $50k+ higher offers. Includes scripts, timing, and leverage strategies.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    category: "Career Guide",
    author: "Marcus Johnson",
    date: "February 20, 2025",
    readTime: "11 min read",
    featured: false,
  },
];

export const blogCategories = [
  "All Articles",
  "Career Guide",
  "Salary Data",
  "Interview Tips",
  "Skills Assessment",
  "AI/ML",
] as const;
