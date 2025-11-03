import { Job } from "./mock-jobs";

export interface JobDetail extends Job {
  fullDescription: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves: string[];
  benefits: string[];
  companyInfo: {
    website: string;
    size: string;
    industry: string;
    founded: string;
    description: string;
  };
}

export function getJobDetails(jobId: number): JobDetail | null {
  const detailsMap: Record<number, Omit<JobDetail, keyof Job>> = {
    1: {
      fullDescription:
        "We're seeking an exceptional Senior Machine Learning Engineer to join our AI research team. You'll be at the forefront of developing cutting-edge machine learning models that power our products used by millions of users worldwide. This role offers the opportunity to work on challenging problems in natural language processing, computer vision, and recommendation systems.",
      responsibilities: [
        "Design, develop, and deploy machine learning models at scale",
        "Collaborate with cross-functional teams to identify ML opportunities",
        "Optimize existing ML pipelines for performance and efficiency",
        "Mentor junior engineers and contribute to technical decisions",
        "Stay current with latest ML research and implement state-of-the-art techniques",
        "Work closely with product teams to translate business requirements into ML solutions",
      ],
      requirements: [
        "5+ years of experience in machine learning engineering",
        "Strong proficiency in Python and ML frameworks (TensorFlow, PyTorch)",
        "Deep understanding of ML algorithms, statistics, and optimization",
        "Experience deploying ML models to production environments",
        "Strong software engineering fundamentals and coding skills",
        "Master's degree in Computer Science, Statistics, or related field",
        "Excellent communication and collaboration skills",
      ],
      niceToHaves: [
        "PhD in Machine Learning or related field",
        "Experience with MLOps tools (MLflow, Kubeflow)",
        "Publications in top-tier ML conferences",
        "Experience with distributed computing (Spark, Ray)",
        "Contributions to open-source ML projects",
        "Experience in specific domains (NLP, CV, RL)",
      ],
      benefits: [
        "Competitive salary and equity package",
        "Comprehensive health, dental, and vision insurance",
        "401(k) matching program",
        "Unlimited PTO and flexible work hours",
        "Remote work options (hybrid model)",
        "Professional development budget ($5,000/year)",
        "Latest MacBook Pro and equipment",
        "Gym membership and wellness programs",
        "Catered lunches and snacks",
        "Annual team retreats and offsites",
      ],
      companyInfo: {
        website: "https://techcorp-ai.com",
        size: "500-1000 employees",
        industry: "Artificial Intelligence",
        founded: "2018",
        description:
          "TechCorp AI is a leading artificial intelligence company building the next generation of intelligent systems. We're backed by top-tier venture capital firms and serve Fortune 500 companies worldwide.",
      },
    },
    2: {
      fullDescription:
        "Join our world-class research team at DeepMind Labs to push the boundaries of artificial intelligence. We're looking for passionate researchers who want to contribute to fundamental advances in deep learning, reinforcement learning, and AI safety.",
      responsibilities: [
        "Conduct original research in deep learning and publish in top-tier venues",
        "Develop novel algorithms and architectures for AI systems",
        "Collaborate with engineers to implement and scale research ideas",
        "Present research findings at conferences and workshops",
        "Mentor PhD students and interns",
        "Contribute to the broader AI research community",
      ],
      requirements: [
        "PhD in Computer Science, Machine Learning, or related field",
        "Strong publication record in top ML/AI conferences (NeurIPS, ICML, ICLR)",
        "Expert knowledge of deep learning and neural networks",
        "Proficiency in Python and deep learning frameworks",
        "Strong mathematical background in linear algebra, calculus, probability",
        "Experience with large-scale experiments and compute infrastructure",
        "Excellent written and verbal communication skills",
      ],
      niceToHaves: [
        "Postdoctoral research experience",
        "Experience with reinforcement learning",
        "Background in neuroscience or cognitive science",
        "Experience with multi-agent systems",
        "Strong track record of open-source contributions",
        "Experience leading research projects",
      ],
      benefits: [
        "Highly competitive compensation package",
        "Access to world-class compute resources",
        "Opportunity to publish and attend conferences",
        "Collaborative research environment",
        "Health insurance and wellness programs",
        "Relocation assistance available",
        "Flexible working arrangements",
        "Learning and development opportunities",
      ],
      companyInfo: {
        website: "https://deepmind-labs.com",
        size: "200-500 employees",
        industry: "AI Research",
        founded: "2015",
        description:
          "DeepMind Labs is at the forefront of artificial intelligence research, working on some of the most challenging problems in AI and machine learning.",
      },
    },
  };

  // For other jobs, return null for now (they'll use default template)
  const baseJob = require("./mock-jobs").mockJobs.find(
    (j: Job) => j.id === jobId
  );
  if (!baseJob) return null;

  const details = detailsMap[jobId];
  if (!details) {
    // Generate default details for jobs without custom details
    return {
      ...baseJob,
      fullDescription: `${baseJob.description} Join our team at ${baseJob.company} and help us build innovative solutions in ${baseJob.niche}.`,
      responsibilities: [
        "Develop and maintain high-quality software solutions",
        "Collaborate with cross-functional teams",
        "Participate in code reviews and technical discussions",
        "Contribute to architectural decisions",
        "Mentor junior team members",
      ],
      requirements: [
        `${baseJob.experienceLevel} level experience in ${baseJob.niche}`,
        "Strong programming fundamentals",
        "Excellent problem-solving skills",
        "Good communication abilities",
        "Bachelor's degree in Computer Science or related field",
      ],
      niceToHaves: [
        "Experience with cloud platforms (AWS, GCP, Azure)",
        "Open source contributions",
        "Master's degree",
        "Industry certifications",
      ],
      benefits: [
        "Competitive salary and benefits",
        "Health insurance",
        "401(k) matching",
        "Flexible work arrangements",
        "Professional development budget",
        "Team events and activities",
      ],
      companyInfo: {
        website: `https://${baseJob.company.toLowerCase().replace(/\s+/g, "")}.com`,
        size: "100-500 employees",
        industry: baseJob.niche,
        founded: "2015",
        description: `${baseJob.company} is a leading company in the ${baseJob.niche} space, committed to innovation and excellence.`,
      },
    };
  }

  return {
    ...baseJob,
    ...details,
  };
}
