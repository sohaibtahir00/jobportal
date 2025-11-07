"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  CheckCircle2,
  FileWarning,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  ChevronRight,
  Plus,
  Receipt,
  Sparkles,
  Calendar,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from "@/components/ui";
import { useEmployerDashboard } from "@/hooks/useDashboard";
import { getRelativeTime } from "@/lib/date-utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// CountUp Animation Component
function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
}

export default function EmployerDashboardPage() {
  const { data, isLoading, error } = useEmployerDashboard();

  // Helper functions for status colors
  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' };
      case 'REVIEWED':
        return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Reviewed' };
      case 'SHORTLISTED':
        return { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Shortlisted' };
      case 'REJECTED':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' };
      case 'HIRED':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Hired' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' };
      case 'CLOSED':
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' };
      case 'DRAFT':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' };
      case 'EXPIRED':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Expired' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">Failed to load dashboard data</p>
        <p className="text-sm text-secondary-600">{(error as any)?.message || 'Please try again later'}</p>
      </div>
    );
  }

  const stats = data?.stats || {
    activeJobs: 0,
    totalApplications: 0,
    filledPositions: 0,
    pendingInvoices: 0,
  };

  const activeJobs = data?.activeJobs || [];
  const recentApplications = data?.recentApplications || [];
  const chartData = data?.analytics?.applicationTrend || [];

  // Stat cards data with gradients
  const statCards = [
    {
      icon: <Briefcase className="h-6 w-6 text-white" />,
      label: "Active Jobs",
      value: stats.activeJobs,
      trend: "+2 this month",
      trendUp: true,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      label: "Total Applications",
      value: stats.totalApplications,
      trend: "New applications",
      trendUp: true,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-white" />,
      label: "Filled Positions",
      value: stats.filledPositions,
      trend: "Hired candidates",
      trendUp: true,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <FileWarning className="h-6 w-6 text-white" />,
      label: "Pending Invoices",
      value: stats.pendingInvoices,
      trend: "Awaiting payment",
      trendUp: false,
      gradient: "from-orange-500 to-amber-600",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 lg:text-3xl">
              Employer Dashboard
            </h1>
            <p className="mt-1 text-secondary-600">
              Manage your job postings and track applications
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/employer/jobs/new"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary-500/30 transition-all hover:from-primary-700 hover:to-accent-700 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="mr-2 h-4 w-4" />
              Post a Job
            </Link>
            <Link
              href="javascript:void(0)"
              className="inline-flex items-center justify-center rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 shadow-sm transition-all hover:bg-secondary-50 hover:shadow-md"
            >
              <Receipt className="mr-2 h-4 w-4" />
              View Invoices
            </Link>
          </div>
        </motion.div>

        {/* Animated Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative overflow-hidden rounded-xl border border-white/20 bg-white/80 p-6 shadow-md backdrop-blur-sm transition-all hover:shadow-xl group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Gradient Icon */}
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}
              >
                {stat.icon}
              </div>

              {/* Stats */}
              <div className="mb-1 text-3xl font-bold text-gray-900">
                <CountUp end={stat.value} />
              </div>
              <div className="mb-2 text-sm font-medium text-gray-600">
                {stat.label}
              </div>

              {/* Trend Indicator */}
              <div
                className={`flex items-center text-xs font-medium ${
                  stat.trendUp ? "text-green-600" : "text-gray-500"
                }`}
              >
                {stat.trendUp ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {stat.trend}
              </div>

              {/* Hover Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity group-hover:opacity-5`}
              />
            </motion.div>
          ))}
        </div>

        {/* Applications Over Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                Applications Over Time
              </CardTitle>
              <CardDescription>
                Track application trends and interview scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Applications"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-secondary-500">
                    No application data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active Jobs List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Jobs</CardTitle>
                    <CardDescription>
                      Your currently active job postings
                    </CardDescription>
                  </div>
                  <Link
                    href="/jobs"
                    className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                  >
                    View All
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeJobs.length > 0 ? (
                    activeJobs.map((job: any, index: number) => {
                      const statusInfo = getJobStatusColor(job.status);
                      return (
                        <motion.div
                          key={job.id}
                          className="flex flex-col gap-3 rounded-lg border border-white/50 bg-gradient-to-r from-white to-gray-50/50 p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Link
                                href={`/jobs/${job.id}`}
                                className="font-semibold text-secondary-900 transition-colors hover:text-primary-600"
                              >
                                {job.title}
                              </Link>
                              <p className="mt-1 text-sm text-secondary-600">
                                {job.location}
                              </p>
                            </div>
                            <Badge
                              className={`${(statusInfo as any).bg} ${(statusInfo as any).text} border-none shadow-sm`}
                            >
                              {(statusInfo as any).label}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                            <span className="flex items-center">
                              <Users className="mr-1.5 h-4 w-4" />
                              {job._count?.applications || 0} applications
                            </span>
                            <span className="flex items-center">
                              <Eye className="mr-1.5 h-4 w-4" />
                              {job.views?.toLocaleString() || 0} views
                            </span>
                            <span className="flex items-center">
                              <Calendar className="mr-1.5 h-4 w-4" />
                              {getRelativeTime(new Date(job.createdAt))}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-secondary-500">
                      No active jobs found. Create your first job posting!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>
                      Latest candidates who applied
                    </CardDescription>
                  </div>
                  <Link
                    href="javascript:void(0)"
                    className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                  >
                    View All
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentApplications.length > 0 ? (
                    recentApplications.map((application: any, index: number) => {
                      const statusInfo = getApplicationStatusColor(
                        application.status
                      );
                      return (
                        <motion.div
                          key={application.id}
                          className="flex items-center justify-between rounded-lg border border-white/50 bg-gradient-to-r from-white to-gray-50/50 p-3 shadow-sm transition-all hover:shadow-md"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-secondary-900 truncate">
                                {application.candidate?.user?.name || 'Unknown Candidate'}
                              </p>
                            </div>
                            <p className="mt-0.5 text-xs text-secondary-600 truncate">
                              {application.job?.title || 'Unknown Position'}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge
                                className={`${(statusInfo as any).bg} ${(statusInfo as any).text} border-none shadow-sm`}
                              >
                                {(statusInfo as any).label}
                              </Badge>
                              <span className="text-xs text-secondary-500">
                                {getRelativeTime(
                                  new Date(application.createdAt)
                                )}
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/employer/applications/${application.id}`}
                            className="ml-3 flex-shrink-0 text-primary-600 transition-colors hover:text-primary-700"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Link>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-secondary-500">
                      No recent applications
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions Cards */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="border-0 bg-gradient-to-br from-primary-50 to-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Ready to hire more talent?
                  </h3>
                  <p className="mt-2 text-sm text-secondary-600">
                    Post a new job opening and reach thousands of qualified
                    candidates in the AI/ML space.
                  </p>
                  <Link
                    href="/employer/jobs/new"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                  >
                    Post a Job
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-md">
                  <Plus className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-50 to-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Review your invoices
                  </h3>
                  <p className="mt-2 text-sm text-secondary-600">
                    You have {stats.pendingInvoices} pending invoices. Review
                    and manage your billing information.
                  </p>
                  <Link
                    href="javascript:void(0)"
                    className="mt-4 inline-flex items-center text-sm font-medium text-orange-600 transition-colors hover:text-orange-700"
                  >
                    View Invoices
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 shadow-md">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
