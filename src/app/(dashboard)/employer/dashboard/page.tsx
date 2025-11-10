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
} from "@/components/ui";
import { useEmployerDashboard } from "@/hooks/useDashboard";

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
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return past.toLocaleDateString();
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  REVIEWED: "bg-blue-100 text-blue-800 border-blue-300",
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EmployerDashboardPage() {
  const { data: session } = useSession();
  const { data, isLoading, error } = useEmployerDashboard();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showClaimReminder, setShowClaimReminder] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
        <p className="text-red-600 mb-2 text-lg font-semibold">Failed to load dashboard</p>
        <p className="text-sm text-secondary-600">{(error as any)?.message || "Please try again later"}</p>
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
    reviewed: 0,
    shortlisted: 0,
    interviewScheduled: 0,
    interviewed: 0,
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
  const totalApplicantsWithTests = candidateQualityMetrics.totalCandidatesWithTests || 0;
  const skillsVerificationPercentage = summary.totalApplications > 0
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
      badge: summary.pendingReviews > 0 ? `${summary.pendingReviews} new` : null,
      gradient: "from-purple-500 to-purple-600",
      link: "/employer/applicants",
    },
    {
      icon: Users,
      label: "Candidates Interviewed",
      value: (applicationStats.interviewed || 0) + (applicationStats.interviewScheduled || 0),
      gradient: "from-green-500 to-emerald-600",
      link: "/employer/applicants?status=INTERVIEWED,INTERVIEW_SCHEDULED",
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
                        <Badge variant="danger" className="bg-red-100 text-red-700 border-red-300">
                          {stat.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stat.formatted || <CountUp end={stat.value} duration={2} />}
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
              <h3 className="text-xl font-bold text-secondary-900 mb-4">Quick Actions</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Post New Job */}
                <Button
                  asChild
                  size="lg"
                  className="h-auto py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700"
                >
                  <Link href="/employer/jobs/new" className="flex flex-col items-center gap-2">
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
                    <Link href="/employer/claim-jobs" className="flex flex-col items-center gap-2">
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
                  <Link href="/employer/search-candidates" className="flex flex-col items-center gap-2">
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
                  <Link href="/contact" className="flex flex-col items-center gap-2">
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
                        You have {unclaimedJobs} unclaimed job{unclaimedJobs > 1 ? "s" : ""} with applicants
                      </h3>
                      <p className="text-sm text-secondary-600 mb-4">
                        These jobs are publicly listed but not officially claimed by your company. Claim them to manage applications.
                      </p>
                      <Button asChild className="bg-orange-600 hover:bg-orange-700">
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
                  <h3 className="text-xl font-bold text-secondary-900">Active Jobs</h3>
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
                    <p className="text-secondary-600 mb-4">No active jobs yet</p>
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
                            <p className="text-sm text-secondary-600 mt-1">{job.location}</p>
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
                              <Badge variant="danger" size="sm" className="ml-1">New</Badge>
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
                          <Button size="sm" variant="outline" asChild className="flex-1">
                            <Link href={`/employer/jobs/${job.id}/applicants`}>
                              View Applicants
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild className="flex-1">
                            <Link href={`/employer/jobs/${job.id}/edit`}>Edit</Link>
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
                  <h3 className="text-xl font-bold text-secondary-900">Recent Applications</h3>
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
                          <p className="text-sm text-secondary-600 truncate">{app.jobTitle}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge className={statusColors[app.status]}>
                              {app.status.replace(/_/g, " ")}
                            </Badge>
                            {app.candidateTestTier && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
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
                          <Link href={`/employer/applicants/${app.id}`}>View</Link>
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
                        {skillsVerificationPercentage}% of your applicants have verified skills
                      </p>
                    </div>
                  </div>

                  <Progress value={skillsVerificationPercentage} className="h-3 mb-4" />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/80 rounded-lg p-3 border border-green-100">
                      <p className="text-sm text-secondary-600">Total Verified</p>
                      <p className="text-2xl font-bold text-green-700">
                        {totalApplicantsWithTests}
                      </p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-3 border border-green-100">
                      <p className="text-sm text-secondary-600">Total Applicants</p>
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
                        <p className="text-xs text-secondary-600">Intermediate</p>
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
                    Candidates with Skills Scores are 3x more likely to be good fits
                  </p>
                  <p className="text-xs text-secondary-600">
                    Verified candidates have completed our comprehensive skills assessment.
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
              <h3 className="text-xl font-bold text-secondary-900 mb-6">Pipeline Overview</h3>
              <div className="space-y-3">
                {[
                  { label: "New Applications", count: applicationStats.pending || 0, color: "bg-yellow-500" },
                  { label: "Under Review", count: applicationStats.reviewed || 0, color: "bg-blue-500" },
                  { label: "Shortlisted", count: applicationStats.shortlisted || 0, color: "bg-purple-500" },
                  { label: "Interview Scheduled", count: applicationStats.interviewScheduled || 0, color: "bg-indigo-500" },
                  { label: "Offer Extended", count: applicationStats.offered || 0, color: "bg-green-500" },
                  { label: "Hired", count: applicationStats.accepted || 0, color: "bg-emerald-500" },
                ].map((stage, index) => {
                  const maxCount = Math.max(...[
                    applicationStats.pending || 0,
                    applicationStats.reviewed || 0,
                    applicationStats.shortlisted || 0,
                    applicationStats.interviewScheduled || 0,
                    applicationStats.offered || 0,
                    applicationStats.accepted || 0,
                  ]);
                  const percentage = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;

                  return (
                    <div key={stage.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary-700">{stage.label}</span>
                        <span className="text-sm font-bold text-secondary-900">{stage.count}</span>
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
