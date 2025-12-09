"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Building,
  Award,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Loader2,
  ArrowUp,
  ArrowDown,
  Eye,
  Calendar,
  RefreshCw,
  AlertTriangle,
  Clock,
  Send,
  ChevronRight,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import {
  AnalyticsLineChart,
  AnalyticsBarChart,
  AnalyticsPieChart,
  AnalyticsAreaChart,
} from "@/components/charts";

// Types
interface OverviewStats {
  totalCandidates: number;
  candidatesChange: number;
  totalEmployers: number;
  employersChange: number;
  activeJobs: number;
  jobsChange: number;
  assessmentsTaken: number;
  assessmentsChange: number;
  totalRevenue: number;
  revenueChange: number;
  successfulHires: number;
  hiresChange: number;
}

interface Activity {
  id: string;
  type: "candidate" | "employer" | "job" | "assessment" | "hire";
  action: string;
  name: string;
  timestamp: string;
}

interface TopPerformer {
  name: string;
  score: number;
  tier: string;
}

interface TopEmployer {
  name: string;
  hires: number;
  revenue: string;
}

interface ChartData {
  monthlyPlacements: { month: string; placements: number; revenue: number }[];
  candidatesByNiche: { niche: string; count: number }[];
  applicationStatus: { status: string; count: number }[];
  weeklySignups: { week: string; candidates: number; employers: number }[];
}

interface ExpiringIntroduction {
  id: string;
  candidateName: string;
  employerCompanyName: string;
  jobTitle: string | null;
  protectionEndsAt: string;
  daysUntilExpiry: number;
}

interface ExpiryData {
  introductions: ExpiringIntroduction[];
  counts: {
    in7Days: number;
    in30Days: number;
    in90Days: number;
  };
}

type DateRange = "7days" | "30days" | "90days" | "6months" | "year";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>("6months");

  // Dashboard data
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [topEmployers, setTopEmployers] = useState<TopEmployer[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [expiryData, setExpiryData] = useState<ExpiryData | null>(null);
  const [isSendingFinalCheckIn, setIsSendingFinalCheckIn] = useState<string | null>(null);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load dashboard data
  const loadDashboard = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      }
      setError(null);

      // Fetch main analytics, chart data, and expiry data in parallel
      // Use fetch() to call frontend proxy routes (which handle auth via cookies)
      const [analyticsRes, chartsRes, expiryRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch(`/api/admin/analytics/charts?range=${dateRange}`),
        fetch("/api/admin/introductions/expiring?withinDays=30&limit=5"),
      ]);

      if (!analyticsRes.ok) {
        const err = await analyticsRes.json().catch(() => ({ error: "Failed to fetch analytics" }));
        throw new Error(err.error || "Failed to fetch analytics");
      }
      if (!chartsRes.ok) {
        const err = await chartsRes.json().catch(() => ({ error: "Failed to fetch charts" }));
        throw new Error(err.error || "Failed to fetch charts");
      }

      const analyticsData = await analyticsRes.json();
      const chartsData = await chartsRes.json();

      // Parse expiry data (don't fail if this errors)
      let expiryDataParsed: ExpiryData | null = null;
      if (expiryRes.ok) {
        expiryDataParsed = await expiryRes.json();
      }

      // Map analytics data to overview stats
      setOverview({
        totalCandidates: analyticsData.overview?.totalCandidates || 0,
        candidatesChange: analyticsData.overview?.candidatesChange || 0,
        totalEmployers: analyticsData.overview?.totalEmployers || 0,
        employersChange: analyticsData.overview?.employersChange || 0,
        activeJobs: analyticsData.overview?.activeJobs || 0,
        jobsChange: analyticsData.overview?.jobsChange || 0,
        assessmentsTaken: analyticsData.overview?.assessmentsTaken || 0,
        assessmentsChange: analyticsData.overview?.assessmentsChange || 0,
        totalRevenue: analyticsData.overview?.totalRevenue || 0,
        revenueChange: analyticsData.overview?.revenueChange || 0,
        successfulHires: analyticsData.overview?.successfulHires || 0,
        hiresChange: analyticsData.overview?.hiresChange || 0,
      });

      // Set recent activity
      setRecentActivity(analyticsData.recentActivity || []);

      // Set top performers
      setTopPerformers(analyticsData.topPerformers || []);

      // Set top employers
      setTopEmployers(analyticsData.topEmployers || []);

      // Set chart data
      setChartData({
        monthlyPlacements: chartsData.monthlyPlacements || [],
        candidatesByNiche: chartsData.candidatesByNiche || [],
        applicationStatus: chartsData.applicationStatus || [],
        weeklySignups: chartsData.weeklySignups || [],
      });

      // Set expiry data
      if (expiryDataParsed) {
        setExpiryData(expiryDataParsed);
      }
    } catch (err: any) {
      console.error("Failed to load dashboard:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadDashboard();
    }
  }, [status, dateRange]);

  const handleRefresh = () => {
    loadDashboard(true);
  };

  const handleSendFinalCheckIn = async (introductionId: string) => {
    if (!confirm("Send final check-in email to this candidate?")) return;

    setIsSendingFinalCheckIn(introductionId);
    try {
      const res = await fetch(`/api/admin/introductions/${introductionId}/final-check-in`, {
        method: "POST",
      });

      if (res.ok) {
        alert("Final check-in email sent successfully!");
        loadDashboard(true);
      } else {
        const err = await res.json();
        alert(`Failed to send: ${err.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending final check-in:", error);
      alert("Failed to send final check-in email");
    } finally {
      setIsSendingFinalCheckIn(null);
    }
  };

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "6months", label: "Last 6 Months" },
    { value: "year", label: "Last Year" },
  ];

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-secondary-900">
              Error Loading Dashboard
            </h2>
            <p className="mb-6 text-secondary-600">{error}</p>
            <Button onClick={() => loadDashboard()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || !overview) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-secondary-900">
                Admin Dashboard
              </h1>
              <p className="text-secondary-600">Platform overview and analytics</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Date Range Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-secondary-500" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as DateRange)}
                  className="rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {dateRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Candidates */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Total Candidates</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      {overview.totalCandidates.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      {overview.candidatesChange >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-success-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`font-semibold ${
                          overview.candidatesChange >= 0
                            ? "text-success-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.abs(overview.candidatesChange)}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Employers */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Total Employers</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      {overview.totalEmployers.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      {overview.employersChange >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-success-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`font-semibold ${
                          overview.employersChange >= 0
                            ? "text-success-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.abs(overview.employersChange)}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                    <Building className="h-6 w-6 text-accent-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Jobs */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Active Jobs</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      {overview.activeJobs.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      {overview.jobsChange >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-success-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`font-semibold ${
                          overview.jobsChange >= 0 ? "text-success-600" : "text-red-600"
                        }`}
                      >
                        {Math.abs(overview.jobsChange)}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                    <Briefcase className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessments Taken */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Assessments Taken</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      {overview.assessmentsTaken.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      {overview.assessmentsChange >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-success-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`font-semibold ${
                          overview.assessmentsChange >= 0
                            ? "text-success-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.abs(overview.assessmentsChange)}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
                    <Award className="h-6 w-6 text-success-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Total Revenue</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      ${overview.totalRevenue > 0 ? (overview.totalRevenue / 1000).toFixed(0) + "k" : "0"}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      {overview.revenueChange >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-success-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`font-semibold ${
                          overview.revenueChange >= 0
                            ? "text-success-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.abs(overview.revenueChange)}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Successful Hires */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Successful Hires</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      {overview.successfulHires}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      {overview.hiresChange >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-success-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`font-semibold ${
                          overview.hiresChange >= 0 ? "text-success-600" : "text-red-600"
                        }`}
                      >
                        {Math.abs(overview.hiresChange)}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <CheckCircle2 className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          {chartData && (
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Monthly Placements & Revenue Chart */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold text-secondary-900">
                    Monthly Placements & Revenue
                  </h2>
                  <AnalyticsLineChart data={chartData.monthlyPlacements} />
                </CardContent>
              </Card>

              {/* Candidates by Niche Chart */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold text-secondary-900">
                    Candidates by Niche
                  </h2>
                  <AnalyticsBarChart data={chartData.candidatesByNiche} />
                </CardContent>
              </Card>

              {/* Application Status Chart */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold text-secondary-900">
                    Application Status Distribution
                  </h2>
                  <AnalyticsPieChart data={chartData.applicationStatus} />
                </CardContent>
              </Card>

              {/* Weekly Signups Chart */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold text-secondary-900">
                    Weekly Signups
                  </h2>
                  <AnalyticsAreaChart data={chartData.weeklySignups} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Protection Periods Expiring Widget */}
          {expiryData && (expiryData.counts.in7Days > 0 || expiryData.counts.in30Days > 0) && (
            <Card className="mb-8 border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Protection Periods Expiring Soon
                  </h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/introductions?filter=expiring">
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>

                {/* Counts Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${expiryData.counts.in7Days > 0 ? 'bg-red-50 border border-red-200' : 'bg-secondary-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className={`h-4 w-4 ${expiryData.counts.in7Days > 0 ? 'text-red-600' : 'text-secondary-400'}`} />
                      <span className="text-sm font-medium text-secondary-600">7 Days</span>
                    </div>
                    <p className={`text-2xl font-bold ${expiryData.counts.in7Days > 0 ? 'text-red-600' : 'text-secondary-400'}`}>
                      {expiryData.counts.in7Days}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${expiryData.counts.in30Days > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-secondary-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className={`h-4 w-4 ${expiryData.counts.in30Days > 0 ? 'text-yellow-600' : 'text-secondary-400'}`} />
                      <span className="text-sm font-medium text-secondary-600">30 Days</span>
                    </div>
                    <p className={`text-2xl font-bold ${expiryData.counts.in30Days > 0 ? 'text-yellow-600' : 'text-secondary-400'}`}>
                      {expiryData.counts.in30Days}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-secondary-400" />
                      <span className="text-sm font-medium text-secondary-600">90 Days</span>
                    </div>
                    <p className="text-2xl font-bold text-secondary-600">
                      {expiryData.counts.in90Days}
                    </p>
                  </div>
                </div>

                {/* Expiring Soon List */}
                {expiryData.introductions.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-secondary-50 px-4 py-2 border-b">
                      <span className="text-sm font-medium text-secondary-700">
                        Expiring Soon - Action Required
                      </span>
                    </div>
                    <div className="divide-y divide-secondary-100">
                      {expiryData.introductions.slice(0, 5).map((intro) => (
                        <div key={intro.id} className="flex items-center justify-between p-4 hover:bg-secondary-50">
                          <div className="flex-1">
                            <p className="font-medium text-secondary-900">
                              {intro.candidateName}
                              <span className="text-secondary-500 mx-2">→</span>
                              {intro.employerCompanyName}
                            </p>
                            <p className="text-sm text-secondary-600">
                              {intro.jobTitle || "Position not specified"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={intro.daysUntilExpiry <= 7 ? "danger" : "warning"}
                              size="sm"
                            >
                              {intro.daysUntilExpiry} days left
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendFinalCheckIn(intro.id)}
                              disabled={isSendingFinalCheckIn === intro.id}
                            >
                              {isSendingFinalCheckIn === intro.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-1" />
                                  Final Check
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {expiryData.introductions.length === 0 && (
                  <p className="text-secondary-500 text-center py-4">
                    No introductions expiring in the next 30 days.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-bold text-secondary-900">
                  Recent Activity
                </h2>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 border-b border-secondary-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                            activity.type === "candidate"
                              ? "bg-primary-100"
                              : activity.type === "employer"
                                ? "bg-accent-100"
                                : activity.type === "job"
                                  ? "bg-yellow-100"
                                  : activity.type === "assessment"
                                    ? "bg-success-100"
                                    : "bg-green-100"
                          }`}
                        >
                          {activity.type === "candidate" && (
                            <Users className="h-5 w-5 text-primary-600" />
                          )}
                          {activity.type === "employer" && (
                            <Building className="h-5 w-5 text-accent-600" />
                          )}
                          {activity.type === "job" && (
                            <Briefcase className="h-5 w-5 text-yellow-600" />
                          )}
                          {activity.type === "assessment" && (
                            <Award className="h-5 w-5 text-success-600" />
                          )}
                          {activity.type === "hire" && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-secondary-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-secondary-600">{activity.name}</p>
                          <p className="mt-1 text-xs text-secondary-500">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-500">No recent activity</p>
                )}
                <Button variant="outline" className="mt-6 w-full" size="sm" asChild>
                  <Link href="/admin/reports">View All Activity</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-bold text-secondary-900">
                  Top Performing Candidates
                </h2>
                {topPerformers.length > 0 ? (
                  <div className="space-y-3">
                    {topPerformers.map((performer, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg bg-secondary-50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-secondary-900">
                              {performer.name}
                            </p>
                            <Badge variant="secondary" size="sm">
                              {performer.tier}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">
                            {performer.score}
                          </p>
                          <p className="text-xs text-secondary-600">Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-500">No performers data available</p>
                )}
                <Button variant="outline" className="mt-6 w-full" size="sm" asChild>
                  <Link href="/admin/candidates">View All Candidates</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Top Employers */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="mb-6 text-xl font-bold text-secondary-900">
                Top Employers by Revenue
              </h2>
              {topEmployers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary-200 text-left">
                        <th className="pb-3 text-sm font-semibold text-secondary-700">
                          Rank
                        </th>
                        <th className="pb-3 text-sm font-semibold text-secondary-700">
                          Company
                        </th>
                        <th className="pb-3 text-sm font-semibold text-secondary-700">
                          Hires
                        </th>
                        <th className="pb-3 text-sm font-semibold text-secondary-700">
                          Revenue
                        </th>
                        <th className="pb-3 text-sm font-semibold text-secondary-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topEmployers.map((employer, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-secondary-100 last:border-0"
                        >
                          <td className="py-3 text-secondary-900">{idx + 1}</td>
                          <td className="py-3 font-semibold text-secondary-900">
                            {employer.name}
                          </td>
                          <td className="py-3 text-secondary-700">{employer.hires}</td>
                          <td className="py-3 font-semibold text-green-600">
                            {employer.revenue}
                          </td>
                          <td className="py-3">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-secondary-500">No employer data available</p>
              )}
              <Button variant="outline" className="mt-6 w-full" size="sm" asChild>
                <Link href="/admin/employers">View All Employers</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Button variant="primary" asChild>
              <Link href="/admin/jobs">Manage Jobs</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/candidates">Manage Candidates</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/employers">Manage Employers</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/assessments">View Assessments</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
