"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { useCandidateDashboard } from "@/hooks/useDashboard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import {
  Send,
  Eye,
  Bookmark,
  Calendar,
  CheckCircle,
  Briefcase,
  Lock,
  Unlock,
  MapPin,
  DollarSign,
  Star,
  Award,
  Target,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { RecommendedJobs } from "@/components/jobs";

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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CandidateDashboardPage() {
  const { data: session } = useSession();
  const { profile, profileCompletion, isLoading: profileLoading } = useCandidateProfile();
  const { data: dashboardData, isLoading: dashboardLoading } = useCandidateDashboard();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileViewsCount, setProfileViewsCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch profile views count
  useEffect(() => {
    const fetchProfileViewsCount = async () => {
      try {
        const response = await api.get('/api/profile-views?limit=1');
        if (response.data.stats) {
          setProfileViewsCount(response.data.stats.totalViews);
        }
      } catch (error) {
        console.error('Failed to fetch profile views count:', error);
      }
    };

    fetchProfileViewsCount();
  }, []);

  const isLoading = profileLoading || dashboardLoading;

  // Extract data from dashboard response
  const stats = dashboardData?.applicationStats || {
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    interviewScheduled: 0,
    interviewed: 0,
    offered: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
  };

  const recentApplications = dashboardData?.recentApplications || [];
  const recommendedJobs = dashboardData?.recommendedJobs || [];
  const testInfo = dashboardData?.testInfo;
  const profileCompletionData = dashboardData?.profileCompleteness || {
    percentage: 0,
    missingFields: [],
  };
  const recentActivity = dashboardData?.recentActivity;

  const isProfileIncomplete = (profileCompletionData?.percentage || 0) < 100;
  const hasSkillsAssessment = testInfo?.hasTaken || false;

  // Calculate job counts (placeholder for now)
  const publicJobsCount = recommendedJobs.length;
  const exclusiveJobsCount = 250; // Placeholder

  // ============================================================================
  // STAT CARDS DATA
  // ============================================================================

  const statCards = [
    {
      icon: Send,
      label: "Applications Sent",
      value: stats.total || 0,
      gradient: "from-blue-500 to-blue-600",
      link: "/candidate/applications",
    },
    {
      icon: Eye,
      label: "Profile Views",
      value: profileViewsCount,
      gradient: "from-purple-500 to-purple-600",
      link: "/candidate/profile-views",
    },
    {
      icon: Bookmark,
      label: "Saved Jobs",
      value: 0, // TODO: Add saved jobs feature
      gradient: "from-green-500 to-emerald-600",
      link: "/candidate/saved",
    },
    {
      icon: Calendar,
      label: "Interview Invites",
      value: stats.interviewScheduled || 0,
      gradient: "from-orange-500 to-orange-600",
      link: "/candidate/applications?filter=interview",
    },
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="space-y-6 pb-12">
        {/* ====================================================================== */}
        {/* WELCOME SECTION */}
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
                  Welcome back, {session?.user?.name?.split(" ")[0] || "there"}!
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
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="bg-white hover:bg-gray-50 text-primary-700 font-semibold shadow-lg"
                >
                  <Link href="/candidate/jobs">Browse Jobs</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ====================================================================== */}
        {/* PROFILE COMPLETION BANNER */}
        {/* ====================================================================== */}
        {isProfileIncomplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg border-l-4 border-orange-500">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                        <Target className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-secondary-900">
                          Complete Your Profile
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {profileCompletionData.percentage}% complete - Add missing information to
                          boost your visibility
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={profileCompletionData.percentage}
                      className="h-3 bg-orange-200"
                    />
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
                  >
                    <Link href="/candidate/profile">Complete Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ====================================================================== */}
        {/* SKILLS ASSESSMENT WIDGET */}
        {/* ====================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!hasSkillsAssessment ? (
            // NOT TAKEN - Large CTA Card
            <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-blue-50 shadow-xl">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 shadow-lg shrink-0">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                      ⚠️ Take Skills Assessment to Unlock Benefits
                    </h2>
                    <p className="text-secondary-600 mb-6">
                      Complete our comprehensive skills assessment to unlock exclusive job
                      opportunities and increase your visibility to top employers.
                    </p>

                    {/* Benefits Grid */}
                    <div className="grid gap-3 sm:grid-cols-2 mb-6">
                      <div className="flex items-start gap-3 rounded-lg bg-white/80 p-4 shadow-sm border border-primary-100">
                        <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-secondary-900">
                            Priority in employer searches
                          </p>
                          <p className="text-sm text-secondary-600">
                            Appear first in search results
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-lg bg-white/80 p-4 shadow-sm border border-primary-100">
                        <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-secondary-900">
                            Access to 250+ exclusive jobs
                          </p>
                          <p className="text-sm text-secondary-600">
                            Jobs not visible to non-assessed candidates
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-lg bg-white/80 p-4 shadow-sm border border-primary-100">
                        <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-secondary-900">
                            3x more likely to get interviews
                          </p>
                          <p className="text-sm text-secondary-600">
                            Verified skills build employer confidence
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-lg bg-white/80 p-4 shadow-sm border border-primary-100">
                        <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-secondary-900">
                            +18% higher salary offers on average
                          </p>
                          <p className="text-sm text-secondary-600">
                            Stand out with verified expertise
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        asChild
                        size="lg"
                        className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg"
                      >
                        <Link href="/skills-assessment">
                          <Award className="mr-2 h-5 w-5" />
                          Start Assessment
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="border-primary-300 text-primary-700 hover:bg-primary-50"
                      >
                        <Link href="/skills-assessment/about">Learn More</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // TAKEN - Score Card
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 shadow-lg shrink-0">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                      ✅ Skills Assessment Completed
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-3 mb-6">
                      {/* Score */}
                      <div className="rounded-lg bg-white/80 p-4 shadow-sm border border-green-100">
                        <p className="text-sm text-secondary-600 mb-1">Overall Score</p>
                        <p className="text-3xl font-bold text-green-700">
                          {testInfo?.score || 0}/100
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          Top {testInfo?.percentile || 0}%
                        </p>
                      </div>

                      {/* Tier */}
                      <div className="rounded-lg bg-white/80 p-4 shadow-sm border border-green-100">
                        <p className="text-sm text-secondary-600 mb-1">Performance Tier</p>
                        <p className="text-xl font-bold" style={{ color: testInfo?.tier?.color || "#000" }}>
                          {testInfo?.tier?.emoji || ""} {testInfo?.tier?.name || "N/A"}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const tierStars =
                              testInfo?.tier?.name === "EXPERT"
                                ? 5
                                : testInfo?.tier?.name === "ADVANCED"
                                ? 4
                                : 3;
                            return (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < tierStars
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="rounded-lg bg-white/80 p-4 shadow-sm border border-green-100">
                        <p className="text-sm text-secondary-600 mb-1">Test Date</p>
                        <p className="text-sm font-semibold text-secondary-900">
                          {testInfo?.lastTestDate ? new Date(testInfo.lastTestDate).toLocaleDateString() : "N/A"}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          {testInfo?.lastTestDate ? formatRelativeTime(testInfo.lastTestDate) : ""}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        asChild
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Link href="/candidate/skills-report">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          View Full Report
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <Link
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                            window.location.origin + "/candidate/skills-report"
                          )}`}
                          target="_blank"
                        >
                          Share on LinkedIn
                        </Link>
                      </Button>
                    </div>

                    {testInfo?.nextTier && (
                      <p className="text-sm text-secondary-600 mt-4">
                        💡 You can retake the assessment in 30 days to improve your tier
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* ====================================================================== */}
        {/* JOB MATCH STATUS */}
        {/* ====================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg border-2 border-primary-100">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 shrink-0">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-3">
                      Job Matches for You
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Unlock className="h-4 w-4 text-green-600" />
                        <p className="text-sm">
                          <span className="font-semibold text-secondary-900">
                            {publicJobsCount} public jobs
                          </span>{" "}
                          <span className="text-secondary-600">available based on your skills</span>
                        </p>
                      </div>
                      {!hasSkillsAssessment && (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-orange-600" />
                          <p className="text-sm">
                            <span className="font-semibold text-orange-700">
                              {exclusiveJobsCount} exclusive jobs
                            </span>{" "}
                            <span className="text-secondary-600">
                              locked - complete skills assessment to unlock
                            </span>
                          </p>
                        </div>
                      )}
                      {hasSkillsAssessment && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <p className="text-sm">
                            <span className="font-semibold text-green-700">
                              {exclusiveJobsCount} exclusive jobs
                            </span>{" "}
                            <span className="text-secondary-600">available to you!</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary-600 hover:bg-primary-700 text-white shrink-0"
                >
                  <Link href="/candidate/jobs">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Jobs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ====================================================================== */}
        {/* STAT CARDS */}
        {/* ====================================================================== */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-secondary-900">
                      <CountUp end={stat.value} duration={2} />
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
        {/* APPLICATION STATUS BREAKDOWN */}
        {/* ====================================================================== */}
        {stats.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-secondary-900 mb-4">
                  Application Status Overview
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Pending */}
                  <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <p className="text-sm font-medium text-secondary-700">Pending Review</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-700">{stats.pending || 0}</p>
                  </div>

                  {/* Shortlisted */}
                  <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <p className="text-sm font-medium text-secondary-700">Shortlisted</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-700">{stats.shortlisted || 0}</p>
                  </div>

                  {/* Interviews */}
                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <p className="text-sm font-medium text-secondary-700">Interviews</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">
                      {(stats.interviewScheduled || 0) + (stats.interviewed || 0)}
                    </p>
                  </div>

                  {/* Offers */}
                  <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <p className="text-sm font-medium text-secondary-700">Offers</p>
                    </div>
                    <p className="text-3xl font-bold text-green-700">{stats.offered || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ====================================================================== */}
        {/* TWO COLUMN LAYOUT: RECENT ACTIVITY + RECOMMENDED JOBS */}
        {/* ====================================================================== */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* RECENT ACTIVITY */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card className="shadow-lg h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-secondary-900">Recent Activity</h3>
                  <Link
                    href="/candidate/applications"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All →
                  </Link>
                </div>

                {recentApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
                    <p className="text-secondary-600">No recent activity yet</p>
                    <Button asChild className="mt-4" size="sm">
                      <Link href="/candidate/jobs">Browse Jobs</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.slice(0, 5).map((app: any) => (
                      <div
                        key={app.id}
                        className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 shrink-0">
                          <Send className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-secondary-900 truncate">
                            Applied to {app.jobTitle}
                          </p>
                          <p className="text-xs text-secondary-600 truncate">{app.companyName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${statusColors[app.status]}`}
                            >
                              {app.status.replace(/_/g, " ")}
                            </Badge>
                            <span className="text-xs text-secondary-500">
                              {formatRelativeTime(app.appliedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* RECOMMENDED JOBS - Using RecommendedJobs component */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card className="shadow-lg h-full">
              <CardContent className="p-6">
                <RecommendedJobsCompact />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Compact recommendations for dashboard sidebar
function RecommendedJobsCompact() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/api/candidates/recommendations?limit=4');
        setData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch recommendations:', err);
        setError(err.response?.data?.error || 'Failed to load recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <h3 className="text-xl font-bold text-secondary-900">Recommended Jobs</h3>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse p-4 rounded-lg bg-secondary-100 h-24" />
        ))}
      </div>
    );
  }

  if (error || !data?.recommendations?.length) {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <h3 className="text-xl font-bold text-secondary-900">Recommended Jobs</h3>
          </div>
          <Link
            href="/candidate/recommendations"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
          <p className="text-secondary-600 mb-2">No recommendations yet</p>
          <p className="text-xs text-secondary-500 mb-4">
            Complete your profile and add skills to get personalized job recommendations
          </p>
          <Button asChild size="sm">
            <Link href="/candidate/profile">Complete Profile</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <h3 className="text-xl font-bold text-secondary-900">Recommended Jobs</h3>
          {data.highMatchCount > 0 && (
            <Badge variant="success" size="sm">
              {data.highMatchCount} great matches
            </Badge>
          )}
        </div>
        <Link
          href="/candidate/recommendations"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All →
        </Link>
      </div>
      <div className="space-y-3">
        {data.recommendations.map((rec: any) => (
          <Link
            key={rec.job.id}
            href={`/jobs/${rec.job.id}`}
            className="block p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-semibold text-secondary-900 truncate flex-1">
                {rec.job.title}
              </h4>
              <Badge
                variant={rec.matchScore >= 80 ? "success" : rec.matchScore >= 60 ? "warning" : "secondary"}
                size="sm"
                className="ml-2 flex-shrink-0"
              >
                {rec.matchScore}%
              </Badge>
            </div>
            <p className="text-sm text-secondary-600 truncate mb-2">
              {rec.job.employer?.companyName || 'Company'}
            </p>
            <div className="flex items-center gap-3 flex-wrap text-xs text-secondary-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {rec.job.remote ? 'Remote' : rec.job.location}
              </span>
              {rec.job.salaryMin && rec.job.salaryMax && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ${Math.floor(rec.job.salaryMin / 1000)}k-$
                  {Math.floor(rec.job.salaryMax / 1000)}k
                </span>
              )}
              {rec.matchingSkills && rec.matchingSkills.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-300 text-xs"
                >
                  {rec.matchingSkills.length} skills match
                </Badge>
              )}
            </div>
            {rec.reasons && rec.reasons[0] && (
              <p className="text-xs text-secondary-500 mt-2 line-clamp-1">
                {rec.reasons[0]}
              </p>
            )}
          </Link>
        ))}
      </div>
    </>
  );
}
