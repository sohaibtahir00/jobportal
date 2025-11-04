"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  MapPin,
  DollarSign,
  Sparkles,
  Calendar,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from "@/components/ui";
import {
  mockDashboardStats,
  mockUserProfile,
  mockApplications,
  mockRecommendedJobs,
  getStatusColor,
  type Application,
} from "@/lib/mock-dashboard";
import { getRelativeTime } from "@/lib/date-utils";
import { formatSalaryRange } from "@/lib/utils";

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

export default function CandidateDashboardPage() {
  const stats = mockDashboardStats;
  const profile = mockUserProfile;
  const applications = mockApplications;
  const recommendedJobs = mockRecommendedJobs;

  const isProfileIncomplete = profile.profileCompletion < 100;

  // Application activity data for chart
  const applicationData = [
    { date: "Jan 1", applications: 2, interviews: 0 },
    { date: "Jan 8", applications: 5, interviews: 1 },
    { date: "Jan 15", applications: 8, interviews: 2 },
    { date: "Jan 22", applications: 12, interviews: 3 },
    { date: "Jan 29", applications: 15, interviews: 4 },
    { date: "Feb 5", applications: 18, interviews: 5 },
    { date: "Feb 12", applications: stats.applicationsSent, interviews: 6 },
  ];

  // Stat cards data with gradients
  const statCards = [
    {
      icon: "📄",
      label: "Applications Sent",
      value: stats.applicationsSent,
      trend: "+3 this week",
      trendUp: true,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: "✓",
      label: "Tests Taken",
      value: stats.testsTaken,
      trend: "Avg. score: 87%",
      trendUp: true,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: "💬",
      label: "Unread Messages",
      value: stats.messages,
      trend: "2 from recruiters",
      trendUp: false,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: "📅",
      label: "Interviews",
      value: 6,
      trend: "+2 scheduled",
      trendUp: true,
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  // Recent activity timeline
  const recentActivity = [
    {
      type: "application",
      text: "Applied to Senior ML Engineer at TechCorp",
      time: "2 hours ago",
    },
    {
      type: "message",
      text: "New message from Google recruiter",
      time: "5 hours ago",
    },
    {
      type: "interview",
      text: "Interview scheduled with Amazon",
      time: "1 day ago",
    },
    {
      type: "test",
      text: "Completed Python Skills Assessment (92%)",
      time: "2 days ago",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-secondary-900 lg:text-3xl">
            Welcome back, {profile.name.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-secondary-600">
            Here's what's happening with your job search today
          </p>
        </motion.div>

        {/* Profile Completion Banner */}
        {isProfileIncomplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 shadow-md">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900">
                          Complete Your Profile
                        </h3>
                        <p className="mt-1 text-sm text-secondary-600">
                          Your profile is {profile.profileCompletion}% complete.
                          Add the following to increase your visibility to
                          employers:
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {profile.missingFields.map((field) => (
                            <Badge
                              key={field}
                              variant="secondary"
                              size="sm"
                              className="bg-white/80 backdrop-blur-sm shadow-sm"
                            >
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="mt-4">
                      <div className="h-3 w-full overflow-hidden rounded-full bg-white/60 shadow-inner">
                        <motion.div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: `${profile.profileCompletion}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                      <p className="mt-1 text-xs font-medium text-secondary-600">
                        {profile.profileCompletion}% Complete
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/candidate/profile"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-700 hover:to-amber-700 hover:shadow-xl hover:-translate-y-0.5 lg:flex-shrink-0"
                  >
                    Complete Profile
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-2xl shadow-md`}
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

        {/* Application Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary-600" />
                Application Activity
              </CardTitle>
              <CardDescription>
                Track your applications and interviews over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={applicationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    name="Applications"
                  />
                  <Line
                    type="monotone"
                    dataKey="interviews"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 4 }}
                    name="Interviews"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Two Column Layout: Applications Table + Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Applications Table - Takes 2 columns */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>
                      Track the status of your recent job applications
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary-200 text-left text-sm font-medium text-secondary-600">
                        <th className="pb-3 pr-4">Job Title</th>
                        <th className="pb-3 pr-4">Company</th>
                        <th className="hidden pb-3 pr-4 sm:table-cell">
                          Location
                        </th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="hidden pb-3 pr-4 lg:table-cell">
                          Applied
                        </th>
                        <th className="pb-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                      {applications.map((application, index) => {
                        const statusInfo = getStatusColor(application.status);
                        return (
                          <motion.tr
                            key={application.id}
                            className="text-sm transition-colors hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <td className="py-4 pr-4">
                              <Link
                                href={`/jobs/${application.id}`}
                                className="font-medium text-secondary-900 transition-colors hover:text-primary-600"
                              >
                                {application.jobTitle}
                              </Link>
                            </td>
                            <td className="py-4 pr-4 text-secondary-600">
                              {application.company}
                            </td>
                            <td className="hidden py-4 pr-4 text-secondary-600 sm:table-cell">
                              {application.location}
                            </td>
                            <td className="py-4 pr-4">
                              <Badge
                                className={`${statusInfo.bg} ${statusInfo.text} border-none shadow-sm`}
                              >
                                {statusInfo.label}
                              </Badge>
                            </td>
                            <td className="hidden py-4 pr-4 text-secondary-500 lg:table-cell">
                              {getRelativeTime(
                                new Date(application.dateApplied)
                              )}
                            </td>
                            <td className="py-4">
                              <Link
                                href={`/jobs/${application.id}`}
                                className="text-primary-600 transition-colors hover:text-primary-700"
                              >
                                <ChevronRight className="h-5 w-5" />
                              </Link>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity Timeline - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest job search actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    >
                      {/* Timeline Dot */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            activity.type === "application"
                              ? "bg-blue-500"
                              : activity.type === "message"
                              ? "bg-purple-500"
                              : activity.type === "interview"
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                        />
                        {index < recentActivity.length - 1 && (
                          <div className="h-full w-px bg-gray-200" />
                        )}
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.text}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recommended Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-secondary-900">
                Recommended for You
              </h2>
              <p className="text-sm text-secondary-600">
                Jobs matching your profile and preferences
              </p>
            </div>
            <Link
              href="/jobs"
              className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              View All Jobs
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {recommendedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="text-base font-semibold text-secondary-900 transition-colors hover:text-primary-600"
                        >
                          {job.title}
                        </Link>
                        <p className="mt-1 text-sm text-secondary-600">
                          {job.company}
                        </p>
                      </div>
                      {job.matchScore && (
                        <div className="ml-2 flex flex-col items-center rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 px-2 py-1 shadow-sm">
                          <Sparkles className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-bold text-green-700">
                            {job.matchScore}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-secondary-600">
                        <MapPin className="mr-1.5 h-4 w-4" />
                        <span>{job.location}</span>
                        <Badge
                          variant="secondary"
                          size="sm"
                          className="ml-2 bg-gradient-to-r from-primary-50 to-accent-50"
                        >
                          {job.remoteType}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-secondary-600">
                        <DollarSign className="mr-1.5 h-4 w-4" />
                        <span>
                          {formatSalaryRange(
                            job.salary.min,
                            job.salary.max,
                            job.salary.currency
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          size="sm"
                          className="bg-white/80 shadow-sm"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center text-xs text-secondary-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {getRelativeTime(new Date(job.postedDate))}
                      </span>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                      >
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
