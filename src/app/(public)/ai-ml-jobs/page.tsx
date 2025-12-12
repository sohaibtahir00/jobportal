"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  TrendingUp,
  DollarSign,
  Briefcase,
  Award,
  CheckCircle2,
  ArrowRight,
  Code,
  Zap,
  Target,
  Users,
  BarChart,
  MapPin,
  Building2,
} from "lucide-react";
import { Card, CardContent, Badge, Button, Input } from "@/components/ui";
import { useJobs } from "@/hooks/useJobs";

export default function AIMLJobsPage() {
  const [email, setEmail] = useState("");

  // Fetch real jobs from API filtered by AI/ML niche
  const { data: jobsData, isLoading } = useJobs({
    niche: "AI/ML",
    limit: 6,
    page: 1,
  });

  const jobs = jobsData?.jobs || [];
  const totalJobs = jobsData?.pagination?.totalCount || 0;

  const stats = [
    {
      icon: TrendingUp,
      value: "127%",
      label: "Job Growth Since 2023",
      color: "text-success-600",
    },
    {
      icon: DollarSign,
      value: "$165k",
      label: "Average Base Salary",
      color: "text-accent-600",
    },
    {
      icon: Briefcase,
      value: totalJobs > 0 ? `${totalJobs}+` : "450+",
      label: "Open Positions",
      color: "text-primary-600",
    },
    {
      icon: Users,
      value: "85%",
      label: "Verified Candidates",
      color: "text-yellow-600",
    },
  ];

  const topRoles = [
    {
      title: "Machine Learning Engineer",
      count: 156,
      avgSalary: "$160k - $220k",
      topSkills: ["Python", "TensorFlow", "PyTorch"],
    },
    {
      title: "AI Research Scientist",
      count: 89,
      avgSalary: "$180k - $250k",
      topSkills: ["Deep Learning", "NLP", "Computer Vision"],
    },
    {
      title: "Data Scientist (ML Focus)",
      count: 134,
      avgSalary: "$140k - $190k",
      topSkills: ["Python", "SQL", "Scikit-learn"],
    },
    {
      title: "MLOps Engineer",
      count: 71,
      avgSalary: "$150k - $200k",
      topSkills: ["Kubernetes", "AWS", "CI/CD"],
    },
  ];

  const requiredSkills = [
    { skill: "Python", jobs: 420 },
    { skill: "TensorFlow", jobs: 312 },
    { skill: "PyTorch", jobs: 298 },
    { skill: "Deep Learning", jobs: 287 },
    { skill: "NLP", jobs: 213 },
    { skill: "Computer Vision", jobs: 198 },
    { skill: "AWS/GCP/Azure", jobs: 189 },
    { skill: "SQL", jobs: 176 },
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: "Skills-Verified Candidates",
      description:
        "All ML engineers complete our specialized AI/ML assessment covering algorithms, model training, and deployment.",
    },
    {
      icon: Zap,
      title: "Fast Matching",
      description:
        "Our AI-powered matching connects you with relevant opportunities based on your ML expertise.",
    },
    {
      icon: Target,
      title: "Exclusive AI/ML Roles",
      description:
        "Access 250+ AI/ML positions not posted anywhere else, from startups to FAANG companies.",
    },
    {
      icon: BarChart,
      title: "Salary Transparency",
      description:
        "See real salary ranges upfront. AI/ML engineers on our platform earn 18% above market average.",
    },
  ];

  const companies = [
    "OpenAI",
    "Google DeepMind",
    "Meta AI",
    "Anthropic",
    "Hugging Face",
    "Cohere",
    "Stability AI",
    "Scale AI",
    "Databricks",
    "Weights & Biases",
  ];

  // Format salary for display
  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Competitive";
    if (min && max) {
      return `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`;
    }
    if (min) return `$${Math.round(min / 1000)}k+`;
    if (max) return `Up to $${Math.round(max / 1000)}k`;
    return "Competitive";
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-accent-600 to-primary-700 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Brain className="h-10 w-10" />
              </div>
            </div>
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              AI & Machine Learning Jobs
            </h1>
            <p className="mb-8 text-xl opacity-95">
              Connect with top AI/ML opportunities at leading companies. All
              candidates verified with specialized ML assessments.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/jobs?niche=ai-ml">
                  Browse {totalJobs > 0 ? `${totalJobs}+` : "450+"} AI/ML Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/skills-assessment">Take ML Assessment</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-secondary-200 bg-white py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <Icon className={`mx-auto mb-3 h-8 w-8 ${stat.color}`} />
                  <div className="mb-1 text-3xl font-bold text-secondary-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-secondary-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Roles Section */}
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Top AI/ML Roles Hiring Now
            </h2>
            <p className="mx-auto max-w-2xl text-secondary-600">
              Explore the most in-demand AI and machine learning positions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {topRoles.map((role, idx) => (
              <Card key={idx} className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-secondary-900">
                        {role.title}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {role.count} open positions
                      </p>
                    </div>
                    <Badge variant="primary">{role.avgSalary}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.topSkills.map((skill, skillIdx) => (
                      <Badge key={skillIdx} variant="secondary" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4 w-full" asChild>
                    <Link
                      href={`/jobs?search=${encodeURIComponent(
                        role.title
                      )}&niche=ai-ml`}
                    >
                      View Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Jobs - Real Data */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Featured AI/ML Opportunities
            </h2>
            <p className="text-secondary-600">
              Latest roles from top AI companies
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-secondary-200 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-secondary-200 rounded w-1/4 mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-secondary-200 rounded w-16"></div>
                      <div className="h-6 bg-secondary-200 rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-xl font-bold text-secondary-900">
                            {job.title}
                          </h3>
                          {job.isClaimed && (
                            <Badge variant="success" size="sm">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="mb-3 text-secondary-600 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {job.employer?.companyName || "Company"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills?.slice(0, 4).map((skill, tagIdx) => (
                            <Badge key={tagIdx} variant="secondary" size="sm">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 md:items-end">
                        <div className="text-xl font-bold text-primary-600">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </div>
                        <Button variant="primary" asChild>
                          <Link href={`/jobs/${job.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600 mb-4">
                No AI/ML jobs available at the moment.
              </p>
              <Button variant="outline" asChild>
                <Link href="/jobs">Browse All Jobs</Link>
              </Button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/jobs?niche=ai-ml">
                View All {totalJobs > 0 ? `${totalJobs}+` : "450+"} AI/ML Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Required Skills */}
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Most In-Demand ML Skills
            </h2>
            <p className="text-secondary-600">
              Top skills employers are looking for in AI/ML candidates
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {requiredSkills.map((item, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="p-4">
                  <div className="mb-2 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary-100">
                    <Code className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mb-1 font-bold text-secondary-900">
                    {item.skill}
                  </h3>
                  <p className="text-sm text-secondary-600">{item.jobs} jobs</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Why AI/ML Engineers Choose Us
            </h2>
            <p className="text-secondary-600">
              The best platform for machine learning careers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                      <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-secondary-900">
                      {item.title}
                    </h3>
                    <p className="text-secondary-600">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Companies Hiring */}
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Top AI Companies Hiring
            </h2>
            <p className="text-secondary-600">
              From startups to industry leaders
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {companies.map((company, idx) => (
              <div
                key={idx}
                className="flex h-16 w-40 items-center justify-center rounded-lg bg-white px-6 shadow-sm"
              >
                <span className="font-semibold text-secondary-700">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary-600 to-accent-600 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Start Your AI/ML Career Today
            </h2>
            <p className="mb-8 text-xl opacity-95">
              Join 12,000+ verified ML engineers and get access to exclusive
              opportunities
            </p>

            <div className="mx-auto mb-8 max-w-md gap-3">
              <Button
                variant="secondary"
                className="whitespace-nowrap bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/signup?role=candidate&category=ai-ml">
                  Sign Up Free
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Get hired faster</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
