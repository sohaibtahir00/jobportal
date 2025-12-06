"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  FileText,
  CheckCircle2,
  Users,
  DollarSign,
  Plus,
  Calendar,
  Loader2,
  Eye,
  Clock,
  Award,
  AlertCircle,
  TrendingUp,
  Phone,
  Target,
  X,
  Building2,
  AlertTriangle,
  Globe,
  Edit,
} from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Progress,
  useToast,
} from "@/components/ui";
import { useEmployerDashboard } from "@/hooks/useDashboard";
import { api } from "@/lib/api";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return past.toLocaleDateString();
}

function formatCurrency(amountInCents: number): string {
  const dollars = amountInCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars);
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  SHORTLISTED: "bg-purple-100 text-purple-800 border-purple-300",
  INTERVIEW_SCHEDULED: "bg-indigo-100 text-indigo-800 border-indigo-300",
  INTERVIEWED: "bg-cyan-100 text-cyan-800 border-cyan-300",
  OFFERED: "bg-green-100 text-green-800 border-green-300",
  ACCEPTED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
  WITHDRAWN: "bg-gray-100 text-gray-800 border-gray-300",
};

const jobStatusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 border-green-300",
  DRAFT: "bg-yellow-100 text-yellow-800 border-yellow-300",
  CLOSED: "bg-gray-100 text-gray-800 border-gray-300",
  FILLED: "bg-blue-100 text-blue-800 border-blue-300",
  EXPIRED: "bg-red-100 text-red-800 border-red-300",
};

// Helper to get formatted application status label
const getApplicationStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "New",
    SHORTLISTED: "Shortlisted",
    INTERVIEW_SCHEDULED: "In Interview Process",
    INTERVIEWED: "In Interview Process",
    OFFERED: "Offer",
    ACCEPTED: "Hired",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
  };
  return statusMap[status] || status.replace(/_/g, " ");
};

// Format employer field names for display
const formatFieldName = (field: string): string => {
  const fieldLabels: Record<string, string> = {
    companyName: "Company Name",
    companyLogo: "Company Logo",
    companyWebsite: "Website",
    industry: "Industry",
    location: "Location",
    description: "Description",
    companySize: "Company Size",
    phone: "Phone Number",
  };
  return fieldLabels[field] || field;
};

// Calculate employer profile completeness
const calculateProfileCompleteness = (employer: any) => {
  if (!employer) {
    return { percentage: 0, missingFields: [], completedFields: 0, totalFields: 8 };
  }

  const fields: Record<string, boolean> = {
    companyName: !!employer.companyName,
    companyLogo: !!employer.companyLogo,
    companyWebsite: !!employer.companyWebsite,
    industry: !!employer.industry,
    location: !!employer.location,
    description: !!employer.description,
    companySize: !!employer.companySize,
    phone: !!employer.phone,
  };

  const completedFields = Object.values(fields).filter(Boolean).length;
  const totalFields = Object.keys(fields).length;
  const percentage = Math.round((completedFields / totalFields) * 100);

  const missingFields = Object.entries(fields)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  return { percentage, missingFields, completedFields, totalFields };
};

// Get banner styling based on completion percentage
const getBannerStyle = (percentage: number) => {
  if (percentage < 30) {
    return {
      bg: "from-red-50 to-orange-50",
      border: "border-red-500",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
      progressBg: "bg-red-200",
      tagBg: "bg-red-100/60",
      tagText: "text-red-700",
      dismissColor: "text-red-400 hover:text-red-600",
      message: "Your company profile needs attention to attract candidates",
    };
  } else if (percentage < 70) {
    return {
      bg: "from-orange-50 to-amber-50",
      border: "border-orange-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      button: "bg-orange-600 hover:bg-orange-700",
      progressBg: "bg-orange-200",
      tagBg: "bg-white/60",
      tagText: "text-secondary-700",
      dismissColor: "text-orange-400 hover:text-orange-600",
      message: "Add more details to boost your visibility to candidates",
    };
  } else {
    return {
      bg: "from-yellow-50 to-green-50",
      border: "border-yellow-500",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700",
      progressBg: "bg-yellow-200",
      tagBg: "bg-green-100/60",
      tagText: "text-green-700",
      dismissColor: "text-yellow-500 hover:text-yellow-700",
      message: "Almost there! Just a few more fields to complete",
    };
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EmployerDashboardPage() {
  const { data: session } = useSession();
  const { data, isLoading, error, refetch: refetchDashboard } = useEmployerDashboard();
  const { showToast } = useToast();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showClaimReminder, setShowClaimReminder] = useState(true);
  const [profileBannerDismissed, setProfileBannerDismissed] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isImportingWebsite, setIsImportingWebsite] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if banner was dismissed (reappears after 24 hours)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("employerProfileBannerDismissed");
      const dismissedAt = localStorage.getItem("employerProfileBannerDismissedAt");

      if (dismissed && dismissedAt) {
        const dismissedTime = new Date(dismissedAt).getTime();
        const now = new Date().getTime();
        const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60);

        if (hoursSinceDismissed < 24) {
          setProfileBannerDismissed(true);
        } else {
          localStorage.removeItem("employerProfileBannerDismissed");
          localStorage.removeItem("employerProfileBannerDismissedAt");
        }
      }
    }
  }, []);

  const handleDismissBanner = () => {
    setProfileBannerDismissed(true);
    localStorage.setItem("employerProfileBannerDismissed", "true");
    localStorage.setItem("employerProfileBannerDismissedAt", new Date().toISOString());
  };

  // Handle website import
  const handleWebsiteImport = async () => {
    if (!websiteUrl) return;

    // Basic URL validation and normalization
    let url = websiteUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      showToast("error", "Invalid URL", "Please enter a valid website URL");
      return;
    }

    setIsImportingWebsite(true);

    try {
      const response = await api.post("/api/employers/parse-website", { url });

      if (response.data.success && response.data.data) {
        const parsedData = response.data.data;

        // Update profile with parsed data
        await api.patch("/api/employers/profile", {
          companyName: parsedData.companyName || undefined,
          companyWebsite: url,
          description: parsedData.description || undefined,
          industry: parsedData.industry || undefined,
          location: parsedData.location || undefined,
          companySize: parsedData.companySize || undefined,
          phone: parsedData.phone || undefined,
          companyLogo: parsedData.logo || undefined,
        });

        showToast("success", "Company Info Imported", "Your company profile has been updated!");
        setWebsiteUrl("");

        // Refresh dashboard data
        refetchDashboard();
      } else {
        throw new Error(response.data.error || "Failed to import from website");
      }
    } catch (error: any) {
      console.error("Website import error:", error);
      showToast("error", "Import Failed", error.response?.data?.error || error.message || "Failed to import from website. Please try again or edit manually.");
    } finally {
      setIsImportingWebsite(false);
    }
  };

  // Calculate profile completeness (8 fields total)
  const profileCompletionData = calculateProfileCompleteness(data?.employer);
  const isProfileIncomplete = profileCompletionData.percentage < 100;
  const bannerStyle = getBannerStyle(profileCompletionData.percentage);

  const showProfileBanner = isProfileIncomplete && !profileBannerDismissed;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto" />
          <p className="mt-4 text-secondary-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
        <p className="text-red-600 mb-2 text-lg font-semibold">
          Failed to load dashboard
        </p>
        <p className="text-sm text-secondary-600">
          {(error as any)?.message || "Please try again later"}
        </p>
      </div>
    );
  }

  // Extract data from API response
  const employer = data?.employer || { companyName: "Your Company" };
  const summary = data?.summary || {
    activeJobs: 0,
    totalApplications: 0,
    pendingReviews: 0,
    activePlacements: 0,
    totalSpent: 0,
    pendingPayments: 0,
  };
  const applicationStats = data?.applicationStats || {
    total: 0,
    pending: 0,
    shortlisted: 0,
    inInterview: 0,
    offered: 0,
    accepted: 0,
    rejected: 0,
  };
  const topJobs = data?.topJobs || [];
  const recentApplications = data?.recentApplications || [];
  const candidateQualityMetrics = data?.candidateQualityMetrics || {
    totalCandidatesWithTests: 0,
    elite: 0,
    advanced: 0,
    intermediate: 0,
    beginner: 0,
  };
  const quickActions = data?.quickActions || [];
  const applicationsByJob = data?.applicationsByJob || [];

  // Calculate successful hires (accepted applications)
  const successfulHires = applicationStats.accepted || 0;

  // Calculate skills verification percentage
  const totalApplicantsWithTests =
    candidateQualityMetrics.totalCandidatesWithTests || 0;
  const skillsVerificationPercentage =
    summary.totalApplications > 0
      ? Math.round((totalApplicantsWithTests / summary.totalApplications) * 100)
      : 0;

  // Check for unclaimed jobs (placeholder - would need backend support)
  const unclaimedJobs = 0;

  // ============================================================================
  // STAT CARDS DATA
  // ============================================================================

  const statCards = [
    {
      icon: Briefcase,
      label: "Active Job Postings",
      value: summary.activeJobs || 0,
      gradient: "from-blue-500 to-blue-600",
      link: "/employer/jobs",
    },
    {
      icon: FileText,
      label: "Total Applications",
      value: summary.totalApplications || 0,
      badge:
        summary.pendingReviews > 0 ? `${summary.pendingReviews} new` : null,
      gradient: "from-purple-500 to-purple-600",
      link: "/employer/applicants",
    },
    {
      icon: Users,
      label: "In Interview Process",
      value: applicationStats.inInterview || 0,
      gradient: "from-green-500 to-emerald-600",
      link: "/employer/applicants?status=INTERVIEW",
    },
    {
      icon: CheckCircle2,
      label: "Successful Hires",
      value: successfulHires,
      gradient: "from-emerald-500 to-teal-600",
      link: "/employer/placements",
    },
    {
      icon: DollarSign,
      label: "Pending Invoices",
      value: summary.pendingPayments || 0,
      formatted: formatCurrency(summary.pendingPayments || 0),
      gradient: "from-orange-500 to-amber-600",
      link: "/employer/invoices",
    },
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="space-y-6 pb-12">
        {/* ====================================================================== */}
        {/* INCOMPLETE PROFILE BANNER */}
        {/* ====================================================================== */}
        {showProfileBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className={`relative border-0 bg-gradient-to-r ${bannerStyle.bg} shadow-lg border-l-4 ${bannerStyle.border}`}>
              {/* Dismiss button */}
              <button
                onClick={handleDismissBanner}
                className={`absolute top-3 right-3 ${bannerStyle.dismissColor} z-10 p-1 rounded-full hover:bg-white/50 transition-colors`}
                aria-label="Dismiss for now"
              >
                <X className="h-5 w-5" />
              </button>

              <CardContent className="p-6 pr-12">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bannerStyle.iconBg}`}>
                        {profileCompletionData.percentage < 30 ? (
                          <AlertTriangle className={`h-6 w-6 ${bannerStyle.iconColor}`} />
                        ) : (
                          <Building2 className={`h-6 w-6 ${bannerStyle.iconColor}`} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-secondary-900">
                          Complete Your Company Profile
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {profileCompletionData.percentage}% complete ({profileCompletionData.completedFields}/{profileCompletionData.totalFields} fields) • {bannerStyle.message}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <Progress
                      value={profileCompletionData.percentage}
                      className={`h-3 ${bannerStyle.progressBg} mb-3`}
                    />

                    {/* Missing fields */}
                    {profileCompletionData.missingFields.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-secondary-500">Missing:</span>
                        {profileCompletionData.missingFields.slice(0, 4).map((field: string) => (
                          <span
                            key={field}
                            className={`px-2 py-0.5 ${bannerStyle.tagBg} ${bannerStyle.tagText} text-xs rounded-full`}
                          >
                            {formatFieldName(field)}
                          </span>
                        ))}
                        {profileCompletionData.missingFields.length > 4 && (
                          <span className="text-xs text-secondary-500">
                            +{profileCompletionData.missingFields.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Manual Edit Button */}
                  <Button
                    asChild
                    size="lg"
                    className={`${bannerStyle.button} text-white shrink-0`}
                  >
                    <Link href="/employer/settings">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Manually
                    </Link>
                  </Button>
                </div>

                {/* Website Import Section */}
                <div className="flex flex-col sm:flex-row gap-2 items-center pt-4 mt-4 border-t border-orange-200/50">
                  <span className="text-sm text-secondary-600 whitespace-nowrap">Quick import:</span>
                  <div className="flex flex-1 gap-2 w-full sm:w-auto">
                    <input
                      type="url"
                      placeholder="https://yourcompany.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && websiteUrl) {
                          e.preventDefault();
                          handleWebsiteImport();
                        }
                      }}
                      className="flex-1 px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/80"
                      disabled={isImportingWebsite}
                    />
                    <Button
                      onClick={handleWebsiteImport}
                      disabled={!websiteUrl || isImportingWebsite}
                      variant="outline"
                      className="shrink-0 bg-white/80"
                    >
                      {isImportingWebsite ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-2" />
                          Import
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ====================================================================== */}
        {/* WELCOME HEADER */}
        {/* ====================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary-600 to-blue-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-6 py-8 lg:px-10 lg:py-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Welcome back, {employer.companyName}!
                </h1>
                <p className="text-blue-100 text-lg">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ====================================================================== */}
        {/* QUICK STATS CARDS */}
        {/* ====================================================================== */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-200 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {stat.badge && (
                        <Badge
                          variant="danger"
                          className="bg-red-100 text-red-700 border-red-300"
                        >
                          {stat.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stat.formatted || (
                        <CountUp end={stat.value} duration={2} />
                      )}
                    </p>
                    {stat.link && (
                      <Link
                        href={stat.link}
                        className="text-xs text-primary-600 hover:text-primary-700 mt-2 inline-block"
                      >
                        View details →
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* ====================================================================== */}
        {/* QUICK ACTIONS */}
        {/* ====================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 border-primary-100 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Post New Job */}
                <Button
                  asChild
                  size="lg"
                  className="h-auto py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700"
                >
                  <Link
                    href="/employer/jobs/new"
                    className="flex flex-col items-center gap-2"
                  >
                    <Plus className="h-6 w-6" />
                    <span>Post New Job</span>
                  </Link>
                </Button>

                {/* Claim Your Jobs (if unclaimed exist) */}
                {unclaimedJobs > 0 && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-auto py-4 border-2 border-orange-300 hover:bg-orange-50"
                  >
                    <Link
                      href="/employer/claim-jobs"
                      className="flex flex-col items-center gap-2"
                    >
                      <Target className="h-6 w-6 text-orange-600" />
                      <span>Claim Your Jobs</span>
                    </Link>
                  </Button>
                )}

                {/* Search Candidates (if premium) */}
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-auto py-4 border-2 border-purple-300 hover:bg-purple-50"
                >
                  <Link
                    href="/employer/search"
                    className="flex flex-col items-center gap-2"
                  >
                    <Users className="h-6 w-6 text-purple-600" />
                    <span>Search Candidates</span>
                  </Link>
                </Button>

                {/* Schedule Call */}
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-auto py-4 border-2 border-green-300 hover:bg-green-50"
                >
                  <Link
                    href="/contact"
                    className="flex flex-col items-center gap-2"
                  >
                    <Phone className="h-6 w-6 text-green-600" />
                    <span>Schedule Call</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ====================================================================== */}
        {/* CLAIM REMINDER (if unclaimed jobs exist) */}
        {/* ====================================================================== */}
        {unclaimedJobs > 0 && showClaimReminder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 shrink-0">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-secondary-900 mb-2">
                        You have {unclaimedJobs} unclaimed job
                        {unclaimedJobs > 1 ? "s" : ""} with applicants
                      </h3>
                      <p className="text-sm text-secondary-600 mb-4">
                        These jobs are publicly listed but not officially
                        claimed by your company. Claim them to manage
                        applications.
                      </p>
                      <Button
                        asChild
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Link href="/employer/claim-jobs">Claim Now</Link>
                      </Button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowClaimReminder(false)}
                    className="text-secondary-400 hover:text-secondary-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ====================================================================== */}
        {/* TWO COLUMN LAYOUT: ACTIVE JOBS + RECENT APPLICATIONS */}
        {/* ====================================================================== */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ACTIVE JOBS SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="shadow-lg h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-secondary-900">
                    Active Jobs
                  </h3>
                  <Link
                    href="/employer/jobs"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All →
                  </Link>
                </div>

                {topJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
                    <p className="text-secondary-600 mb-4">
                      No active jobs yet
                    </p>
                    <Button asChild size="sm">
                      <Link href="/employer/jobs/new">Post Your First Job</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topJobs.slice(0, 5).map((job: any) => (
                      <div
                        key={job.id}
                        className="flex flex-col gap-3 rounded-lg border-2 border-gray-200 bg-white p-4 hover:border-primary-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/employer/jobs/${job.id}`}
                              className="font-semibold text-secondary-900 hover:text-primary-600 truncate block"
                            >
                              {job.title}
                            </Link>
                            <p className="text-sm text-secondary-600 mt-1">
                              {job.location}
                            </p>
                          </div>
                          <Badge className={jobStatusColors[job.status]}>
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-secondary-600">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {job.applicationsCount} applications
                            {job.applicationsCount > 0 && (
                              <Badge
                                variant="danger"
                                size="sm"
                                className="ml-1"
                              >
                                New
                              </Badge>
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {job.views || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            {/* Skills-verified count would come from backend */}
                            0 verified
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-secondary-500">
                          <Calendar className="h-3 w-3" />
                          Posted {formatRelativeTime(job.postedAt)}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="flex-1"
                          >
                            <Link href={`/employer/jobs/${job.id}/applicants`}>
                              View Applicants
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="flex-1"
                          >
                            <Link href={`/employer/jobs/${job.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* RECENT APPLICATIONS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="shadow-lg h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-secondary-900">
                    Recent Applications
                  </h3>
                  <Link
                    href="/employer/applicants"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All →
                  </Link>
                </div>

                {recentApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
                    <p className="text-secondary-600">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.slice(0, 10).map((app: any) => (
                      <div
                        key={app.id}
                        className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 bg-white hover:border-primary-300 hover:shadow-md transition-all"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 shrink-0">
                          <Users className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-secondary-900 truncate">
                            {app.candidateName || "Candidate"}
                          </p>
                          <p className="text-sm text-secondary-600 truncate">
                            {app.jobTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge className={statusColors[app.status]}>
                              {getApplicationStatusLabel(app.status)}
                            </Badge>
                            {app.candidateTestTier && (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-300"
                              >
                                <Award className="h-3 w-3 mr-1" />
                                {app.candidateTestTier}
                              </Badge>
                            )}
                            <span className="text-xs text-secondary-500">
                              {formatRelativeTime(app.appliedAt)}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/employer/applicants/${app.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ====================================================================== */}
        {/* SKILLS VERIFICATION STATS */}
        {/* ====================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-secondary-900">
                        Skills Verification Stats
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {skillsVerificationPercentage}% of your applicants have
                        verified skills
                      </p>
                    </div>
                  </div>

                  <Progress
                    value={skillsVerificationPercentage}
                    className="h-3 mb-4"
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/80 rounded-lg p-3 border border-green-100">
                      <p className="text-sm text-secondary-600">
                        Total Verified
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {totalApplicantsWithTests}
                      </p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-3 border border-green-100">
                      <p className="text-sm text-secondary-600">
                        Total Applicants
                      </p>
                      <p className="text-2xl font-bold text-secondary-900">
                        {summary.totalApplications}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-lg p-4 border border-green-100">
                    <p className="text-sm font-semibold text-secondary-900 mb-2">
                      Tier Distribution:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="text-center">
                        <p className="text-xs text-secondary-600">Elite</p>
                        <p className="text-lg font-bold text-purple-600">
                          {candidateQualityMetrics.elite || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-secondary-600">Advanced</p>
                        <p className="text-lg font-bold text-blue-600">
                          {candidateQualityMetrics.advanced || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-secondary-600">
                          Intermediate
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {candidateQualityMetrics.intermediate || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-secondary-600">Beginner</p>
                        <p className="text-lg font-bold text-yellow-600">
                          {candidateQualityMetrics.beginner || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-64 bg-white/80 rounded-lg p-4 border border-green-200">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mb-3" />
                  <p className="text-sm font-semibold text-secondary-900 mb-2">
                    Candidates with Skills Scores are 3x more likely to be good
                    fits
                  </p>
                  <p className="text-xs text-secondary-600">
                    Verified candidates have completed our comprehensive skills
                    assessment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ====================================================================== */}
        {/* PIPELINE OVERVIEW */}
        {/* ====================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-6">
                Pipeline Overview
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "New Applications",
                    count: applicationStats.pending || 0,
                    color: "bg-yellow-500",
                  },
                  {
                    label: "Shortlisted",
                    count: applicationStats.shortlisted || 0,
                    color: "bg-purple-500",
                  },
                  {
                    label: "In Interview Process",
                    count: applicationStats.inInterview || 0,
                    color: "bg-indigo-500",
                  },
                  {
                    label: "Offer Extended",
                    count: applicationStats.offered || 0,
                    color: "bg-green-500",
                  },
                  {
                    label: "Hired",
                    count: applicationStats.accepted || 0,
                    color: "bg-emerald-500",
                  },
                ].map((stage, index) => {
                  const maxCount = Math.max(
                    ...[
                      applicationStats.pending || 0,
                      applicationStats.shortlisted || 0,
                      applicationStats.inInterview || 0,
                      applicationStats.offered || 0,
                      applicationStats.accepted || 0,
                    ]
                  );
                  const percentage =
                    maxCount > 0 ? (stage.count / maxCount) * 100 : 0;

                  return (
                    <div key={stage.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary-700">
                          {stage.label}
                        </span>
                        <span className="text-sm font-bold text-secondary-900">
                          {stage.count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${stage.color} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
