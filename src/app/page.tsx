"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button, Input, Badge, Card, CardContent } from "@/components/ui";

export default function Home() {
  const [email, setEmail] = useState("");

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
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "Analytics Co",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$120k - $160k",
      remote: false,
      logo: "📊",
      tags: ["Python", "SQL", "Statistics"],
      posted: "3 days ago",
    },
    {
      id: 4,
      title: "ML Operations Engineer",
      company: "CloudScale",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$140k - $180k",
      remote: true,
      logo: "☁️",
      tags: ["MLOps", "Kubernetes", "AWS"],
      posted: "1 week ago",
    },
    {
      id: 5,
      title: "Computer Vision Engineer",
      company: "VisionTech",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$130k - $190k",
      remote: true,
      logo: "👁️",
      tags: ["OpenCV", "YOLO", "PyTorch"],
      posted: "4 days ago",
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
    },
  ];

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
      icon: Users,
      title: "Access Top Talent",
      description:
        "Connect with pre-vetted AI/ML professionals with proven expertise in cutting-edge technologies.",
    },
    {
      icon: Zap,
      title: "Fast Hiring Process",
      description:
        "Post jobs in minutes and start receiving qualified applications within hours. Streamlined hiring workflow.",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "All candidates are verified and screened. Get access to portfolios, GitHub profiles, and project showcases.",
    },
    {
      icon: Clock,
      title: "Save Time & Money",
      description:
        "Reduce time-to-hire by 50%. No agency fees, just direct access to the best AI/ML talent in the market.",
    },
  ];

  const stats = [
    { label: "Active Jobs", value: "12,000+", icon: Briefcase },
    { label: "AI/ML Professionals", value: "85,000+", icon: Users },
    { label: "Successful Placements", value: "15,000+", icon: CheckCircle2 },
    { label: "Partner Companies", value: "2,500+", icon: Building2 },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-28">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="primary" size="lg" className="mb-6">
              🚀 #1 AI/ML Job Board
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-secondary-900 md:text-5xl lg:text-6xl">
              Find Your Next{" "}
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                AI/ML Role
              </span>
            </h1>
            <p className="mb-8 text-lg text-secondary-600 md:text-xl">
              Connect with top companies hiring AI and Machine Learning talent.
              Discover thousands of opportunities in artificial intelligence,
              data science, and deep learning.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mb-8 max-w-3xl">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                      <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        className="h-12 w-full rounded-md border border-secondary-300 bg-white pl-11 pr-4 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                      />
                    </div>
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                      <input
                        type="text"
                        placeholder="City, state, or remote"
                        className="h-12 w-full rounded-md border border-secondary-300 bg-white pl-11 pr-4 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                      />
                    </div>
                    <Button size="lg" className="h-12 px-8">
                      <Search className="mr-2 h-5 w-5" />
                      Search Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="primary" size="lg" asChild>
                <Link href="/jobs">
                  Browse All Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/post-job">Post a Job</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-secondary-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success-600" />
                <span>500+ new jobs this week</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success-600" />
                <span>Average salary: $165k</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success-600" />
                <span>70% remote positions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-200/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent-200/20 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="border-y border-secondary-200 bg-white py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
                    <Icon className="h-7 w-7 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-secondary-900 md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-secondary-600">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="bg-secondary-50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4">
              Featured Opportunities
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Latest AI/ML Jobs
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Explore hand-picked opportunities from leading companies in AI and
              machine learning
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <Card
                key={job.id}
                className="transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-2xl">
                        {job.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-900 line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {job.company}
                        </p>
                      </div>
                    </div>
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
                    <Button variant="outline" size="sm" asChild>
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
            <Button variant="primary" size="lg" asChild>
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
            <Badge variant="primary" className="mb-4">
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
                  <Card className="h-full">
                    <CardContent className="p-8 text-center">
                      <div className="mb-6 flex justify-center">
                        <div className="relative">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                            <Icon className="h-8 w-8 text-primary-600" />
                          </div>
                          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
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
                    <div className="absolute right-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 translate-x-1/2 bg-gradient-to-r from-primary-300 to-transparent md:block" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              For Employers
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Hire Top AI/ML Talent Faster
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary-100">
              Access the largest pool of qualified AI and machine learning
              professionals
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {employerBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={index}
                  className="border-primary-400/20 bg-white/10 backdrop-blur-sm"
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
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
              className="bg-white text-primary-600 hover:bg-primary-50"
              asChild
            >
              <Link href="/post-job">
                Post a Job
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/employers">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-secondary-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Card className="border-2 border-primary-200">
              <CardContent className="p-8 text-center md:p-12">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
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
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Newsletter signup:", email);
                  }}
                  className="mx-auto max-w-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button type="submit" size="lg" className="sm:w-auto">
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
          <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 p-8 text-center text-white md:p-16">
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
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/jobs">Find Jobs</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/post-job">Hire Talent</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
