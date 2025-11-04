"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Building2,
  Rocket,
  Shield,
  Zap,
  Target,
  Clock,
  Phone,
  Brain,
  Heart,
  DollarSign,
  Lock,
} from "lucide-react";
import { Button, Input, Badge, Card, CardContent, useToast } from "@/components/ui";

export default function Home() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState<string>("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast("success", "Subscribed successfully!", `Welcome aboard! Check your inbox at ${email}`);
      setEmail(""); // Clear email after successful submission
    } catch (error) {
      showToast("error", "Subscription failed", "There was a problem subscribing you to our newsletter. Please try again.");
    } finally {
      setIsNewsletterLoading(false);
    }
  };

  const featuredJobs = [
    {
      id: 1,
      title: "Senior Machine Learning Engineer",
      company: "TechCorp AI",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$150k - $220k",
      remote: true,
      logo: "🚀",
      tags: ["Python", "TensorFlow", "PyTorch"],
      posted: "2 days ago",
      niche: "ai-ml",
      skillsVerified: true,
    },
    {
      id: 2,
      title: "AI Research Scientist",
      company: "DeepMind Labs",
      location: "New York, NY",
      type: "Full-time",
      salary: "$180k - $250k",
      remote: true,
      logo: "🧠",
      tags: ["Research", "Deep Learning", "NLP"],
      posted: "1 day ago",
      niche: "ai-ml",
      skillsVerified: true,
    },
    {
      id: 3,
      title: "Healthcare Data Engineer",
      company: "MedTech Solutions",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$120k - $160k",
      remote: false,
      logo: "🏥",
      tags: ["Python", "SQL", "HIPAA"],
      posted: "3 days ago",
      niche: "healthcare",
      skillsVerified: false,
    },
    {
      id: 4,
      title: "Fintech Backend Engineer",
      company: "PaymentsCo",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$140k - $180k",
      remote: true,
      logo: "💰",
      tags: ["Java", "Spring", "Microservices"],
      posted: "1 week ago",
      niche: "fintech",
      skillsVerified: true,
    },
    {
      id: 5,
      title: "Cybersecurity Analyst",
      company: "SecureGuard",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$130k - $190k",
      remote: true,
      logo: "🔒",
      tags: ["Penetration Testing", "SIEM", "AWS"],
      posted: "4 days ago",
      niche: "cybersecurity",
      skillsVerified: true,
    },
    {
      id: 6,
      title: "NLP Engineer",
      company: "LangTech AI",
      location: "Remote",
      type: "Full-time",
      salary: "$145k - $200k",
      remote: true,
      logo: "💬",
      tags: ["NLP", "Transformers", "BERT"],
      posted: "5 days ago",
      niche: "ai-ml",
      skillsVerified: false,
    },
  ];

  const nicheCategories = [
    { id: "all", label: "All Jobs", count: featuredJobs.length },
    { id: "ai-ml", label: "AI/ML Engineers", count: featuredJobs.filter(j => j.niche === "ai-ml").length },
    { id: "healthcare", label: "Healthcare IT", count: featuredJobs.filter(j => j.niche === "healthcare").length },
    { id: "fintech", label: "Fintech Engineers", count: featuredJobs.filter(j => j.niche === "fintech").length },
    { id: "cybersecurity", label: "Cybersecurity", count: featuredJobs.filter(j => j.niche === "cybersecurity").length },
  ];

  // Filter jobs based on selected niche
  const filteredJobs = selectedNiche === "all"
    ? featuredJobs
    : featuredJobs.filter(job => job.niche === selectedNiche);

  const howItWorksSteps = [
    {
      icon: Search,
      title: "Search & Discover",
      description:
        "Browse thousands of AI/ML job opportunities from top companies worldwide. Use advanced filters to find your perfect match.",
    },
    {
      icon: Target,
      title: "Apply with Confidence",
      description:
        "Create your profile once and apply to multiple positions with a single click. Track all your applications in one place.",
    },
    {
      icon: Rocket,
      title: "Land Your Dream Job",
      description:
        "Get hired by leading tech companies. Our platform connects talented professionals with employers looking for AI/ML expertise.",
    },
  ];

  const employerBenefits = [
    {
      icon: Shield,
      title: "Skills-Verified Talent",
      description:
        "Every candidate has completed our 60-minute proctored assessment. No guessing, no surprises—just proven expertise.",
    },
    {
      icon: Target,
      title: "Zero Risk",
      description:
        "Pay only when you hire. 15-20% success fee. No upfront costs, no retainers, no wasted budget on unqualified candidates.",
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description:
        "Qualified candidates are already waiting. Most employers start interviewing within 48 hours. Fill roles in weeks, not months.",
    },
    {
      icon: Briefcase,
      title: "Your Jobs May Already Be Listed",
      description:
        "We aggregate job postings from across the web. Your open roles might already be on our platform with qualified candidates waiting. Claim them now.",
    },
  ];

  const stats = [
    { label: "Active Jobs", value: "12,000+", icon: Briefcase },
    { label: "AI/ML Professionals", value: "85,000+", icon: Users },
    { label: "Successful Placements", value: "15,000+", icon: CheckCircle2 },
    { label: "Partner Companies", value: "2,500+", icon: Building2 },
  ];

  const specializations = [
    {
      id: "ai-ml",
      icon: Brain,
      title: "AI/ML Engineers",
      jobCount: "847 jobs available",
      salary: "$140k-200k",
      color: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      id: "healthcare",
      icon: Heart,
      title: "Healthcare IT",
      jobCount: "623 jobs available",
      salary: "$100k-160k",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      id: "fintech",
      icon: DollarSign,
      title: "Fintech Engineers",
      jobCount: "531 jobs available",
      salary: "$130k-200k",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: "cybersecurity",
      icon: Lock,
      title: "Cybersecurity",
      jobCount: "892 jobs available",
      salary: "$120k-180k",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20 md:py-28">
        {/* Modern gradient mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/20 via-transparent to-accent-100/20" />

        {/* Subtle dots pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #1d4ed8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Floating decorative elements with blur */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-primary-400/30 to-accent-400/30 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-accent-400/30 to-success-400/30 blur-3xl animate-pulse-slow" style={{ animationDelay: '1000ms' }} />
        <div className="absolute right-1/4 top-1/4 h-48 w-48 rounded-full bg-gradient-to-br from-primary-300/20 to-accent-300/20 blur-2xl animate-float" />

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="primary" size="lg" className="mb-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white border-none shadow-lg shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/60 transition-all animate-pulse-slow">
              🚀 #1 AI/ML Job Board
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-secondary-900 md:text-5xl lg:text-6xl">
              Land Your Dream{" "}
              <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-success-500 bg-clip-text text-transparent animate-gradient-x font-extrabold">
                Tech Job
              </span>{" "}
              in 30 Days
            </h1>
            <p className="mb-6 text-lg text-secondary-600 md:text-xl">
              We connect top AI/ML engineers with fast-growing companies. Every
              candidate is skills-verified. No spam, just perfect matches.
            </p>

            {/* Trust Signals */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success-50 border border-success-200">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-500">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-success-700">2,000+ candidates placed</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-primary-700">$18k avg. salary increase</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-50 border border-accent-200">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-accent-700">3,000+ verified jobs</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mx-auto mb-8 max-w-3xl">
              <Card className="border-0 shadow-xl shadow-primary-500/10 hover:shadow-2xl hover:shadow-primary-500/20 transition-all">
                <CardContent className="p-4 bg-white/95 backdrop-blur-sm">
                  <form onSubmit={handleSearch}>
                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="relative flex-1">
                        <label htmlFor="hero-job-search" className="sr-only">
                          Search for jobs by title, keywords, or company
                        </label>
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                        <input
                          id="hero-job-search"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Job title, keywords, or company"
                          className="h-12 w-full rounded-lg border-2 border-secondary-200 bg-white pl-11 pr-4 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 hover:border-secondary-300"
                        />
                      </div>
                      <div className="relative flex-1">
                        <label htmlFor="hero-location-search" className="sr-only">
                          Filter by location: city, state, or remote
                        </label>
                        <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                        <input
                          id="hero-location-search"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="City, state, or remote"
                          className="h-12 w-full rounded-lg border-2 border-secondary-200 bg-white pl-11 pr-4 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 hover:border-secondary-300"
                        />
                      </div>
                      <Button type="submit" size="lg" className="h-12 px-8 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                        <Search className="mr-2 h-5 w-5" />
                        Search Jobs
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="primary" size="lg" asChild className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300">
                <Link href="/jobs">
                  Browse Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="hover:bg-primary-50 hover:border-primary-600 hover:text-primary-700 transition-all duration-300">
                <Link href="/employers">For Employers</Link>
              </Button>
            </div>

            {/* Skills Verification Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-secondary-600">
              <span className="text-xl">⭐</span>
              <span>All candidates are skills-verified with proctored assessments</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-200/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent-200/20 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="border-y border-secondary-200 bg-gradient-to-r from-white via-primary-50/30 to-white py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-accent-100 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                    <Icon className="h-7 w-7 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-secondary-900 to-primary-700 bg-clip-text text-transparent md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-medium text-secondary-600">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="relative bg-gradient-to-br from-secondary-50 via-white to-secondary-50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white border-none shadow-lg hover:shadow-xl transition-all">
              Featured Opportunities
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Latest Tech Jobs
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Explore opportunities across AI/ML, Healthcare IT, Fintech, and Cybersecurity
            </p>
          </div>

          {/* Niche Selector - Desktop */}
          <div className="mb-8 hidden md:block">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {nicheCategories.map((niche) => (
                <button
                  key={niche.id}
                  onClick={() => setSelectedNiche(niche.id)}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                    selectedNiche === niche.id
                      ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5"
                      : "bg-white/80 backdrop-blur-sm text-secondary-700 hover:bg-white hover:shadow-md border border-secondary-200"
                  }`}
                >
                  {niche.label} ({niche.count})
                </button>
              ))}
            </div>
          </div>

          {/* Niche Selector - Mobile Dropdown */}
          <div className="mb-8 md:hidden">
            <label htmlFor="niche-select" className="sr-only">
              Select job category
            </label>
            <select
              id="niche-select"
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full rounded-lg border-2 border-secondary-300 bg-white px-4 py-3 text-sm font-medium text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 shadow-sm transition-all"
            >
              {nicheCategories.map((niche) => (
                <option key={niche.id} value={niche.id}>
                  {niche.label} ({niche.count})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="transition-all hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 text-2xl shadow-sm">
                        {job.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900 line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {job.company}
                        </p>
                        {job.skillsVerified && (
                          <p className="mt-1 text-xs text-amber-600">
                            Skills verified candidates preferred
                          </p>
                        )}
                      </div>
                    </div>
                    {job.skillsVerified && (
                      <Badge
                        variant="warning"
                        size="sm"
                        className="ml-2 flex-shrink-0 bg-amber-100 text-amber-700 border-amber-200"
                      >
                        ⭐ Verified Talent
                      </Badge>
                    )}
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant="secondary" size="sm">
                      {job.type}
                    </Badge>
                    {job.remote && (
                      <Badge variant="success" size="sm">
                        Remote
                      </Badge>
                    )}
                  </div>

                  <div className="mb-4 flex items-center gap-4 text-sm text-secondary-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{job.location}</span>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {job.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-secondary-200 pt-4">
                    <span className="text-sm font-semibold text-secondary-900">
                      {job.salary}
                    </span>
                    <Button variant="outline" size="sm" asChild className="hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:border-primary-300 transition-all">
                      <Link href={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                  </div>

                  <p className="mt-3 text-xs text-secondary-500">
                    Posted {job.posted}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="primary" size="lg" asChild className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all">
              <Link href="/jobs">
                View All Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white border-none shadow-lg hover:shadow-xl transition-all">
              Simple Process
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              How It Works for Candidates
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Find your dream job in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="mb-6 flex justify-center">
                        <div className="relative">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-accent-100 shadow-inner">
                            <Icon className="h-8 w-8 text-primary-600" />
                          </div>
                          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-600 text-sm font-bold text-white shadow-lg">
                            {index + 1}
                          </div>
                        </div>
                      </div>
                      <h3 className="mb-3 text-xl font-semibold text-secondary-900">
                        {step.title}
                      </h3>
                      <p className="text-secondary-600">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < howItWorksSteps.length - 1 && (
                    <div className="absolute right-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 translate-x-1/2 bg-gradient-to-r from-primary-400 via-accent-400 to-transparent md:block" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button variant="primary" size="lg" asChild className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Specializations Section */}
      <section className="bg-gradient-to-br from-secondary-50 to-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white border-none shadow-lg hover:shadow-xl transition-all">
              Our Specializations
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Find Jobs in Your Niche
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              We specialize in four high-demand tech sectors with verified employers and competitive salaries
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {specializations.map((spec) => {
              const Icon = spec.icon;
              return (
                <Card
                  key={spec.id}
                  className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    {/* Gradient Background */}
                    <div
                      className={`absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${spec.color} opacity-20 blur-2xl transition-all group-hover:scale-150 group-hover:opacity-30`}
                    />

                    {/* Icon */}
                    <div className={`relative mb-4 flex h-14 w-14 items-center justify-center rounded-lg ${spec.bgColor} shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-7 w-7 ${spec.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="mb-2 text-xl font-bold text-secondary-900">
                        {spec.title}
                      </h3>
                      <div className="mb-3 space-y-1">
                        <p className="text-sm font-medium text-secondary-700">
                          {spec.jobCount}
                        </p>
                        <p className="text-sm text-secondary-600">
                          Avg salary: <span className="font-semibold text-success-600">{spec.salary}</span>
                        </p>
                      </div>

                      {/* CTA Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-accent-600 group-hover:text-white group-hover:border-transparent transition-all"
                        asChild
                      >
                        <Link href={`/jobs?niche=${spec.id}`}>
                          Browse Jobs
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="mb-4 text-secondary-600">
              Not sure which niche is right for you?
            </p>
            <Button variant="primary" size="lg" asChild className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all">
              <Link href="/jobs">Browse All Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Skills Verification Section */}
      <section className="bg-gradient-to-br from-secondary-50 to-primary-50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white border-none shadow-lg hover:shadow-xl transition-all">
              ⭐ Skills Verification
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Stand Out with Verified Skills
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Take our 60-minute assessment to unlock exclusive opportunities
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Column - Benefits List */}
              <div className="flex flex-col justify-center">
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all">
                  <CardContent className="p-8">
                    <h3 className="mb-6 text-2xl font-bold text-secondary-900">
                      Benefits of Verification
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-success-600" />
                        <div>
                          <p className="font-semibold text-secondary-900">
                            Priority in employer searches
                          </p>
                          <p className="text-sm text-secondary-600">
                            Get noticed first when employers filter candidates
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-success-600" />
                        <div>
                          <p className="font-semibold text-secondary-900">
                            Access to 250+ exclusive jobs
                          </p>
                          <p className="text-sm text-secondary-600">
                            Only verified candidates can apply to premium roles
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-success-600" />
                        <div>
                          <p className="font-semibold text-secondary-900">
                            3x more likely to get interviews
                          </p>
                          <p className="text-sm text-secondary-600">
                            Verified candidates have higher response rates
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-success-600" />
                        <div>
                          <p className="font-semibold text-secondary-900">
                            +18% higher salary offers on average
                          </p>
                          <p className="text-sm text-secondary-600">
                            Prove your skills and command better compensation
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-success-600" />
                        <div>
                          <p className="font-semibold text-secondary-900">
                            See your skill percentile vs. other candidates
                          </p>
                          <p className="text-sm text-secondary-600">
                            Know where you stand in the market
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Skills Score Card Preview */}
              <div className="flex flex-col justify-center">
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all">
                  <CardContent className="p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-secondary-900">
                        Skills Score Card Preview
                      </h3>
                      <Badge variant="primary">Sample</Badge>
                    </div>

                    {/* Overall Score */}
                    <div className="mb-6 rounded-lg bg-gradient-to-br from-primary-50 to-accent-50 p-6">
                      <div className="mb-2 text-sm font-medium text-secondary-600">
                        Overall Score
                      </div>
                      <div className="mb-3 flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-primary-600">
                          88
                        </span>
                        <span className="text-2xl text-secondary-400">/100</span>
                      </div>
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="primary">Top 12%</Badge>
                        <span className="text-sm text-secondary-600">
                          of all candidates
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-secondary-700">
                          Performance Tier:
                        </span>
                        <span className="text-lg">⭐⭐⭐⭐⭐</span>
                        <span className="ml-1 text-sm font-semibold text-accent-600">
                          Advanced
                        </span>
                      </div>
                    </div>

                    {/* Top Strengths */}
                    <div>
                      <h4 className="mb-4 text-sm font-semibold text-secondary-900">
                        Top Strengths
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm font-medium text-secondary-700">
                              Python
                            </span>
                            <span className="text-sm font-bold text-primary-600">
                              95/100
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary-200">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600"
                              style={{ width: "95%" }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm font-medium text-secondary-700">
                              Problem-Solving
                            </span>
                            <span className="text-sm font-bold text-primary-600">
                              92/100
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary-200">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600"
                              style={{ width: "92%" }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm font-medium text-secondary-700">
                              Machine Learning
                            </span>
                            <span className="text-sm font-bold text-primary-600">
                              88/100
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary-200">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600"
                              style={{ width: "88%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Badge */}
                    <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border-2 border-success-200 bg-success-50 py-3">
                      <Shield className="h-5 w-5 text-success-600" />
                      <span className="text-sm font-semibold text-success-700">
                        Proctored & Verified
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <Button variant="primary" size="lg" asChild className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all">
                <Link href="/skills-assessment">
                  Learn More About Skills Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-4 text-sm text-secondary-600">
                Assessment takes 60 minutes • Valid for 12 months • Free for job seekers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 py-20 text-white">
        {/* Decorative elements */}
        <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-accent-400/10 blur-3xl" />

        <div className="container relative z-10">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30 shadow-lg">
              For Employers
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Hire Top AI/ML Engineers in Weeks, Not Months
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary-100">
              Pay only when you hire. 15-20% success fee. Every candidate is skills-verified.
            </p>
          </div>

          {/* Prominent Message */}
          <div className="mx-auto mb-12 max-w-3xl">
            <div className="rounded-lg border-2 border-white/30 bg-white/10 p-6 text-center backdrop-blur-sm shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all">
              <p className="text-lg font-semibold md:text-xl">
                💼 Your jobs may already be on our platform with qualified candidates waiting
              </p>
              <p className="mt-2 text-sm text-primary-100">
                We aggregate postings from across the web. Claim your listings now to connect with pre-vetted talent.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {employerBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={index}
                  className="border-0 bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:bg-white/15 hover:-translate-y-1 transition-all"
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 shadow-inner">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <h3 className="mb-3 text-lg font-semibold">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-primary-100">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              asChild
            >
              <Link href="/claim">
                Check If Your Jobs Are Listed
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              asChild
            >
              <Link href="/claim">
                <Phone className="mr-2 h-5 w-5" />
                Schedule a Call
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-secondary-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center md:p-12">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-accent-100 shadow-lg">
                    <TrendingUp className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h2 className="mb-4 text-2xl font-bold text-secondary-900 md:text-3xl">
                  Stay Updated with Latest Opportunities
                </h2>
                <p className="mb-8 text-lg text-secondary-600">
                  Get weekly updates on the newest AI/ML jobs, industry trends,
                  and career tips delivered to your inbox.
                </p>
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="mx-auto max-w-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address for newsletter subscription
                    </label>
                    <Input
                      id="newsletter-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isNewsletterLoading}
                      className="flex-1 h-12 border-2 focus:ring-4 focus:ring-primary-500/20 transition-all"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="sm:w-auto bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                      loading={isNewsletterLoading}
                      loadingText="Subscribing..."
                    >
                      Subscribe
                    </Button>
                  </div>
                  <p className="mt-3 text-xs text-secondary-500">
                    Join 50,000+ subscribers. Unsubscribe anytime.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 p-8 text-center text-white shadow-2xl md:p-16">
            {/* Decorative elements */}
            <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-10 bottom-10 h-40 w-40 rounded-full bg-accent-400/20 blur-2xl" />

            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Ready to Take the Next Step?
              </h2>
              <p className="mb-8 text-lg text-primary-100 md:text-xl">
                Whether you're looking for your next role or hiring top talent,
                we're here to help.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-primary-50 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                  asChild
                >
                  <Link href="/jobs">Find Jobs</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  asChild
                >
                  <Link href="/employer/jobs/new">Hire Talent</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
