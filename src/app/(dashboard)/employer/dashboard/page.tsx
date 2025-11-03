"use client";

import Link from "next/link";
import {
  Briefcase,
  FileText,
  CheckCircle2,
  FileWarning,
  TrendingUp,
  Eye,
  Users,
  ChevronRight,
  Plus,
  Receipt,
  Sparkles,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from "@/components/ui";
import {
  mockEmployerStats,
  mockActiveJobs,
  mockRecentApplications,
  mockApplicationsOverTime,
  getApplicationStatusColor,
  getJobStatusColor,
} from "@/lib/mock-employer-dashboard";
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

export default function EmployerDashboardPage() {
  const stats = mockEmployerStats;
  const activeJobs = mockActiveJobs;
  const recentApplications = mockRecentApplications;
  const chartData = mockApplicationsOverTime;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
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
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Post a Job
          </Link>
          <Link
            href="javascript:void(0)"
            className="inline-flex items-center justify-center rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50"
          >
            <Receipt className="mr-2 h-4 w-4" />
            View Invoices
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Jobs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  Active Jobs
                </p>
                <p className="mt-2 text-3xl font-bold text-secondary-900">
                  {stats.activeJobs}
                </p>
                <p className="mt-1 text-xs text-success-600">
                  <span className="inline-flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +2 this month
                  </span>
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Briefcase className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Applications */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  Total Applications
                </p>
                <p className="mt-2 text-3xl font-bold text-secondary-900">
                  {stats.totalApplications}
                </p>
                <p className="mt-1 text-xs text-secondary-500">
                  46 new this week
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                <FileText className="h-6 w-6 text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filled Positions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  Filled Positions
                </p>
                <p className="mt-2 text-3xl font-bold text-secondary-900">
                  {stats.filledPositions}
                </p>
                <p className="mt-1 text-xs text-success-600">
                  <span className="inline-flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    83% hire rate
                  </span>
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
                <CheckCircle2 className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Invoices */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  Pending Invoices
                </p>
                <p className="mt-2 text-3xl font-bold text-secondary-900">
                  {stats.pendingInvoices}
                </p>
                <p className="mt-1 text-xs text-secondary-500">$48,600 total</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-100">
                <FileWarning className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Applications Over Time</CardTitle>
          <CardDescription>
            Track application trends and interview scheduling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: "#2563eb", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Applications"
                />
                <Line
                  type="monotone"
                  dataKey="interviews"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ fill: "#7c3aed", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Interviews"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Jobs List */}
        <Card>
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
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeJobs.map((job) => {
                const statusInfo = getJobStatusColor(job.status);
                return (
                  <div
                    key={job.id}
                    className="flex flex-col gap-3 rounded-lg border border-secondary-200 p-4 transition-colors hover:bg-secondary-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/employer/jobs/${job.id}`}
                          className="font-semibold text-secondary-900 hover:text-primary-600"
                        >
                          {job.title}
                        </Link>
                        <p className="mt-1 text-sm text-secondary-600">
                          {job.department}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                      <span className="flex items-center">
                        <Users className="mr-1.5 h-4 w-4" />
                        {job.applicationsCount} applications
                        {job.newApplications > 0 && (
                          <Badge
                            variant="primary"
                            size="sm"
                            className="ml-2"
                          >
                            +{job.newApplications} new
                          </Badge>
                        )}
                      </span>
                      <span className="flex items-center">
                        <Eye className="mr-1.5 h-4 w-4" />
                        {job.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center">
                        <Calendar className="mr-1.5 h-4 w-4" />
                        {getRelativeTime(new Date(job.postedDate))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
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
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentApplications.map((application) => {
                const statusInfo = getApplicationStatusColor(
                  application.status
                );
                return (
                  <div
                    key={application.id}
                    className="flex items-center justify-between rounded-lg border border-secondary-200 p-3 transition-colors hover:bg-secondary-50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-secondary-900 truncate">
                          {application.candidateName}
                        </p>
                        {application.matchScore && application.matchScore >= 85 && (
                          <div className="flex items-center gap-1 rounded bg-success-50 px-1.5 py-0.5">
                            <Sparkles className="h-3 w-3 text-success-600" />
                            <span className="text-xs font-semibold text-success-700">
                              {application.matchScore}%
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-secondary-600 truncate">
                        {application.jobTitle}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          {statusInfo.label}
                        </span>
                        <span className="text-xs text-secondary-500">
                          {getRelativeTime(new Date(application.appliedDate))}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/employer/applications/${application.id}`}
                      className="ml-3 flex-shrink-0 text-primary-600 hover:text-primary-700"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
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
                  className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Post a Job
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                <Plus className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent-200 bg-gradient-to-br from-accent-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  Review your invoices
                </h3>
                <p className="mt-2 text-sm text-secondary-600">
                  You have {stats.pendingInvoices} pending invoices. Review and
                  manage your billing information.
                </p>
                <Link
                  href="javascript:void(0)"
                  className="mt-4 inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700"
                >
                  View Invoices
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent-100">
                <Receipt className="h-6 w-6 text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
