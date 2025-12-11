"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Video,
  Headphones,
  Download,
  TrendingUp,
  Briefcase,
  Code,
  Users,
  Target,
  ArrowRight,
  Search,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, Badge, Input, Button } from "@/components/ui";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Resources", icon: null },
    { id: "guides", label: "Guides", icon: BookOpen },
    { id: "videos", label: "Videos", icon: Video },
    { id: "podcasts", label: "Podcasts", icon: Headphones },
    { id: "templates", label: "Templates", icon: Download },
  ];

  const resources = [
    // Guides
    {
      category: "guides",
      title: "Complete Guide to Acing Technical Interviews",
      description:
        "Everything you need to know about preparing for technical interviews, from data structures to system design.",
      type: "Guide",
      readTime: "15 min read",
      icon: BookOpen,
      link: "/blog/technical-interview-guide",
      featured: true,
    },
    {
      category: "guides",
      title: "How to Write a Resume That Gets You Hired",
      description:
        "Expert tips on crafting a resume that stands out to recruiters and passes ATS systems.",
      type: "Guide",
      readTime: "10 min read",
      icon: FileText,
      link: "/blog/resume-guide",
    },
    {
      category: "guides",
      title: "Salary Negotiation Tactics for Engineers",
      description:
        "Learn how to negotiate a higher salary with confidence and data-backed strategies.",
      type: "Guide",
      readTime: "12 min read",
      icon: TrendingUp,
      link: "/blog/salary-negotiation",
    },
    {
      category: "guides",
      title: "Remote Work Best Practices for Tech Teams",
      description:
        "How to excel in remote work environments and stay productive while working from home.",
      type: "Guide",
      readTime: "8 min read",
      icon: Users,
      link: "/blog/remote-work-guide",
    },

    // Videos
    {
      category: "videos",
      title: "How to Take the Skills Assessment",
      description:
        "A walkthrough of our skills assessment process and tips to maximize your score.",
      type: "Video",
      readTime: "8 min watch",
      icon: Video,
      link: "#",
      featured: true,
    },
    {
      category: "videos",
      title: "System Design Interview Masterclass",
      description:
        "Learn how to approach system design questions with real examples from top companies.",
      type: "Video",
      readTime: "45 min watch",
      icon: Code,
      link: "#",
    },
    {
      category: "videos",
      title: "Building a Strong LinkedIn Profile",
      description:
        "Optimize your LinkedIn profile to attract recruiters and showcase your skills.",
      type: "Video",
      readTime: "12 min watch",
      icon: Users,
      link: "#",
    },

    // Podcasts
    {
      category: "podcasts",
      title: "Career Growth in Tech: Strategies for 2025",
      description:
        "Industry experts discuss the latest trends in tech hiring and career advancement.",
      type: "Podcast",
      readTime: "35 min listen",
      icon: Headphones,
      link: "#",
    },
    {
      category: "podcasts",
      title: "Inside the Mind of a Tech Recruiter",
      description:
        "A recruiter shares what they look for in candidates and how to stand out.",
      type: "Podcast",
      readTime: "28 min listen",
      icon: Headphones,
      link: "#",
    },
    {
      category: "podcasts",
      title: "From Bootcamp to Big Tech",
      description:
        "Inspiring stories from developers who transitioned into top tech companies.",
      type: "Podcast",
      readTime: "42 min listen",
      icon: Headphones,
      link: "#",
    },

    // Templates
    {
      category: "templates",
      title: "Software Engineer Resume Template",
      description:
        "ATS-friendly resume template specifically designed for software engineers.",
      type: "Template",
      readTime: "Download PDF",
      icon: Download,
      link: "#",
      featured: true,
    },
    {
      category: "templates",
      title: "Interview Preparation Checklist",
      description:
        "A comprehensive checklist to prepare for any technical interview.",
      type: "Template",
      readTime: "Download PDF",
      icon: Download,
      link: "#",
    },
    {
      category: "templates",
      title: "30-60-90 Day Plan for New Jobs",
      description:
        "Template to help you succeed in your first 90 days at a new company.",
      type: "Template",
      readTime: "Download PDF",
      icon: Download,
      link: "#",
    },
    {
      category: "templates",
      title: "Offer Negotiation Email Templates",
      description:
        "Professional email templates for negotiating job offers and salary.",
      type: "Template",
      readTime: "Download PDF",
      icon: Download,
      link: "#",
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      activeCategory === "all" || resource.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredResources = resources.filter((r) => r.featured);

  const upcomingWebinars = [
    {
      title: "Mastering Behavioral Interviews",
      date: "Jan 25, 2025",
      time: "2:00 PM EST",
      spots: "47 spots left",
    },
    {
      title: "Tech Salary Trends for 2025",
      date: "Feb 1, 2025",
      time: "3:00 PM EST",
      spots: "32 spots left",
    },
    {
      title: "Building Your Personal Brand",
      date: "Feb 8, 2025",
      time: "1:00 PM EST",
      spots: "61 spots left",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-secondary-900 md:text-5xl">
            Career Resources
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-secondary-600">
            Free guides, templates, and tools to help you land your dream job
            and grow your career
          </p>
        </div>

        {/* Featured Resources */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-secondary-900">
            Featured Resources
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredResources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <Card
                  key={idx}
                  className="border-2 border-primary-200 transition-shadow hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <Badge variant="primary">{resource.type}</Badge>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-secondary-900">
                      {resource.title}
                    </h3>
                    <p className="mb-4 text-sm text-secondary-600">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-500">
                        {resource.readTime}
                      </span>
                      <Link
                        href={resource.link}
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        View →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
              <Input
                type="text"
                placeholder="Search resources..."
                className="pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-primary-600 text-white"
                      : "bg-white text-secondary-700 hover:bg-secondary-100"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* All Resources */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-secondary-900">
            {activeCategory === "all"
              ? "All Resources"
              : categories.find((c) => c.id === activeCategory)?.label}
          </h2>

          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource, idx) => {
                const Icon = resource.icon;
                return (
                  <Card key={idx} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100">
                          <Icon className="h-5 w-5 text-secondary-600" />
                        </div>
                        <Badge variant="secondary" size="sm">
                          {resource.type}
                        </Badge>
                      </div>
                      <h3 className="mb-2 font-bold text-secondary-900">
                        {resource.title}
                      </h3>
                      <p className="mb-4 text-sm text-secondary-600">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-secondary-500">
                          {resource.readTime}
                        </span>
                        <Link
                          href={resource.link}
                          className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                        >
                          Access →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-secondary-600">
                No resources found. Try a different search or category.
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Webinars */}
        <Card className="mb-12 bg-gradient-to-br from-primary-50 to-accent-50">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-secondary-900">
                  Upcoming Free Webinars
                </h2>
                <p className="text-secondary-600">
                  Join live sessions with industry experts
                </p>
              </div>
              <Calendar className="h-10 w-10 text-primary-600" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {upcomingWebinars.map((webinar, idx) => (
                <div key={idx} className="rounded-lg bg-white p-4 shadow-sm">
                  <h3 className="mb-2 font-bold text-secondary-900">
                    {webinar.title}
                  </h3>
                  <div className="mb-3 space-y-1 text-sm text-secondary-600">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {webinar.date} at {webinar.time}
                    </p>
                    <p className="text-xs text-success-600">{webinar.spots}</p>
                  </div>
                  <Button variant="primary" size="sm" className="w-full">
                    Register Free
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Target className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-secondary-900">
                For Candidates
              </h3>
              <p className="mb-6 text-secondary-600">
                Take the next step in your career with our comprehensive
                resources and tools.
              </p>
              <div className="space-y-3">
                <Link
                  href="/skills-assessment"
                  className="flex items-center justify-between rounded-lg bg-secondary-50 p-3 text-sm font-medium text-secondary-900 transition-colors hover:bg-secondary-100"
                >
                  <span>Take Skills Assessment</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/jobs"
                  className="flex items-center justify-between rounded-lg bg-secondary-50 p-3 text-sm font-medium text-secondary-900 transition-colors hover:bg-secondary-100"
                >
                  <span>Browse Jobs</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center justify-between rounded-lg bg-secondary-50 p-3 text-sm font-medium text-secondary-900 transition-colors hover:bg-secondary-100"
                >
                  <span>Read Career Blog</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                <Briefcase className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-secondary-900">
                For Employers
              </h3>
              <p className="mb-6 text-secondary-600">
                Find the best talent faster with our hiring resources and tools.
              </p>
              <div className="space-y-3">
                <Link
                  href="/employer/post-job"
                  className="flex items-center justify-between rounded-lg bg-secondary-50 p-3 text-sm font-medium text-secondary-900 transition-colors hover:bg-secondary-100"
                >
                  <span>Post a Job</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/employer/claim"
                  className="flex items-center justify-between rounded-lg bg-secondary-50 p-3 text-sm font-medium text-secondary-900 transition-colors hover:bg-secondary-100"
                >
                  <span>Claim Existing Job</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center justify-between rounded-lg bg-secondary-50 p-3 text-sm font-medium text-secondary-900 transition-colors hover:bg-secondary-100"
                >
                  <span>View Pricing</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Newsletter CTA */}
        <Card className="mt-12 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">
              Stay Updated with Career Tips
            </h2>
            <p className="mb-6 text-lg opacity-90">
              Get weekly career advice, industry trends, and job opportunities
              delivered to your inbox
            </p>
            <div className="mx-auto flex max-w-md gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-secondary-900"
              />
              <Button
                variant="secondary"
                className="whitespace-nowrap bg-white text-primary-600 hover:bg-primary-50"
              >
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
