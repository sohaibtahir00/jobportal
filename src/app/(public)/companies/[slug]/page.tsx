"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Users,
  Globe,
  BadgeCheck,
  Briefcase,
  Clock,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { api } from "@/lib/api";
import { formatCurrency, resolveImageUrl } from "@/lib/utils";

interface CompanyDetails {
  id: string;
  slug: string | null;
  companyName: string;
  companyLogo: string | null;
  companyWebsite: string | null;
  industry: string | null;
  companySize: string | null;
  location: string | null;
  description: string | null;
  verified: boolean;
  createdAt: string;
}

interface CompanyStats {
  activeJobs: number;
  totalHires: number;
  avgTimeToHire: number;
  responseRate: number;
}

interface CompanyJob {
  id: string;
  title: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  nicheCategory: string | null;
  remote: boolean;
  type: string;
  experienceLevel: string;
  postedAt: string;
}

interface CompanyResponse {
  company: CompanyDetails;
  stats: CompanyStats;
  activeJobs: CompanyJob[];
}

export default function CompanyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<CompanyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<CompanyResponse>(`/api/companies/${slug}`);
        setData(response.data);
      } catch (err: any) {
        console.error("Failed to fetch company:", err);
        if (err.response?.status === 404) {
          setError("Company not found");
        } else {
          setError(err.response?.data?.error || "Failed to load company details");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCompany();
    }
  }, [slug]);

  // Helper functions
  const formatJobType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatExperienceLevel = (level: string) => {
    return level.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Generate initials for fallback logo
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Generate a consistent color based on company name
  const getBgColor = (name: string) => {
    const colors = [
      "bg-primary-500",
      "bg-accent-500",
      "bg-emerald-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-cyan-500",
      "bg-indigo-500",
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const getNicheBadgeColor = (niche: string | null) => {
    switch (niche) {
      case "AI_ML":
      case "AI/ML":
        return "primary";
      case "HEALTHCARE_IT":
      case "Healthcare IT":
        return "success";
      case "FINTECH":
      case "Fintech":
        return "warning";
      case "CYBERSECURITY":
      case "Cybersecurity":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-secondary-50 py-12">
        <div className="container">
          <Card className="max-w-lg mx-auto border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-900 mb-2">
                {error === "Company not found" ? "Company Not Found" : "Error"}
              </h1>
              <p className="text-red-700 mb-6">
                {error || "Failed to load company details"}
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/companies">Browse Companies</Link>
                </Button>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { company, stats, activeJobs } = data;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/companies"
              className="text-secondary-600 hover:text-primary-600"
            >
              Companies
            </Link>
            <span className="text-secondary-400">/</span>
            <span className="text-secondary-900 font-medium">
              {company.companyName}
            </span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <section className="bg-white border-b border-secondary-200 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <div
              className={`flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl overflow-hidden shadow-lg ${
                company.companyLogo ? "bg-white" : getBgColor(company.companyName)
              }`}
            >
              {company.companyLogo ? (
                <img
                  src={resolveImageUrl(company.companyLogo) || ''}
                  alt={company.companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {getInitials(company.companyName)}
                </span>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-secondary-900">
                  {company.companyName}
                </h1>
                {company.verified && (
                  <Badge variant="primary" className="flex items-center gap-1">
                    <BadgeCheck className="h-4 w-4" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-secondary-600 mb-4">
                {company.industry && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {company.industry}
                  </span>
                )}
                {company.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </span>
                )}
                {company.companySize && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {company.companySize} employees
                  </span>
                )}
              </div>

              {company.companyWebsite && (
                <a
                  href={company.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {company.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-secondary-900 mb-4">
                    About {company.companyName}
                  </h2>
                  <p className="text-secondary-600 whitespace-pre-line">
                    {company.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Open Positions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-secondary-900">
                    Open Positions ({stats.activeJobs})
                  </h2>
                  {stats.activeJobs > 5 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/jobs?employer=${company.id}`}>
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>

                {activeJobs.length > 0 ? (
                  <div className="space-y-4">
                    {activeJobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="block p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-secondary-900 mb-1">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-secondary-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </span>
                              {job.remote && (
                                <Badge variant="success" size="sm">
                                  Remote
                                </Badge>
                              )}
                              {job.nicheCategory && (
                                <Badge
                                  variant={getNicheBadgeColor(job.nicheCategory) as any}
                                  size="sm"
                                >
                                  {job.nicheCategory.replace(/_/g, "/")}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {job.salaryMin && job.salaryMax && (
                              <p className="font-semibold text-green-600 mb-1">
                                {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                              </p>
                            )}
                            <p className="text-xs text-secondary-500">
                              Posted {getRelativeTime(job.postedAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-secondary-400 mx-auto mb-3" />
                    <p className="text-secondary-600">
                      No open positions at the moment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Why Work Here - Placeholder */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">
                  Why Work Here
                </h2>
                <div className="text-center py-8 bg-secondary-50 rounded-lg border-2 border-dashed border-secondary-200">
                  <p className="text-secondary-600 mb-2">
                    Company culture information coming soon
                  </p>
                  <p className="text-sm text-secondary-500">
                    Team photos, employee reviews, and more
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">
                  Company Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <Briefcase className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-secondary-900">
                      {stats.activeJobs}
                    </p>
                    <p className="text-xs text-secondary-600">Active Jobs</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-secondary-900">
                      {stats.totalHires}
                    </p>
                    <p className="text-xs text-secondary-600">Total Hires</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-secondary-900">
                      {stats.avgTimeToHire}
                    </p>
                    <p className="text-xs text-secondary-600">Days to Hire</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-secondary-900">
                      {stats.responseRate}%
                    </p>
                    <p className="text-xs text-secondary-600">Response Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <Button variant="primary" className="w-full" asChild>
                    <Link href={`/jobs?search=${encodeURIComponent(company.companyName)}`}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      View All Jobs
                    </Link>
                  </Button>
                  {company.companyWebsite && (
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={company.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        Company Website
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Member Since */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-secondary-600">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="text-sm">Member since</p>
                    <p className="font-medium text-secondary-900">
                      {new Date(company.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
