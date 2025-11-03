"use client";

import Link from "next/link";
import {
  FileText,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  MapPin,
  DollarSign,
  Sparkles,
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
  mockDashboardStats,
  mockUserProfile,
  mockApplications,
  mockRecommendedJobs,
  getStatusColor,
  type Application,
} from "@/lib/mock-dashboard";
import { getRelativeTime } from "@/lib/date-utils";
import { formatSalaryRange } from "@/lib/utils";

export default function CandidateDashboardPage() {
  const stats = mockDashboardStats;
  const profile = mockUserProfile;
  const applications = mockApplications;
  const recommendedJobs = mockRecommendedJobs;

  const isProfileIncomplete = profile.profileCompletion < 100;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 lg:text-3xl">
          Welcome back, {profile.name.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-secondary-600">
          Here's what's happening with your job search today
        </p>
      </div>

      {/* Profile Completion Banner */}
      {isProfileIncomplete && (
        <Card className="border-accent-200 bg-accent-50">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600" />
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
                        <Badge key={field} variant="secondary" size="sm">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary-200">
                    <div
                      className="h-full bg-accent-600 transition-all duration-500"
                      style={{ width: `${profile.profileCompletion}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-secondary-600">
                    {profile.profileCompletion}% Complete
                  </p>
                </div>
              </div>
              <Link
                href="/candidate/profile"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700 lg:flex-shrink-0"
              >
                Complete Profile
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Applications Sent */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  Applications Sent
                </p>
                <p className="mt-2 text-3xl font-bold text-secondary-900">
                  {stats.applicationsSent}
                </p>
                <p className="mt-1 text-xs text-secondary-500">
                  +3 this week
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tests Taken */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  Tests Taken
                </p>
                <p className="mt-2 text-3xl font-bold text-secondary-900">
                  {stats.testsTaken}
                </p>
                <p className="mt-1 text-xs text-success-600">
                  <span className="inline-flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Avg. score: 87%
                  </span>
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
                <CheckCircle2 className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  Unread Messages
                </p>
                <p className="mt-2 text-3xl font-bold text-secondary-900">
                  {stats.messages}
                </p>
                <p className="mt-1 text-xs text-secondary-500">
                  2 from recruiters
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                <MessageSquare className="h-6 w-6 text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications Table */}
      <Card>
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
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
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
                  <th className="hidden pb-3 pr-4 sm:table-cell">Location</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="hidden pb-3 pr-4 lg:table-cell">Applied</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {applications.map((application) => {
                  const statusInfo = getStatusColor(application.status);
                  return (
                    <tr
                      key={application.id}
                      className="text-sm hover:bg-secondary-50"
                    >
                      <td className="py-4 pr-4">
                        <Link
                          href={`/jobs/${application.id}`}
                          className="font-medium text-secondary-900 hover:text-primary-600"
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
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="hidden py-4 pr-4 text-secondary-500 lg:table-cell">
                        {getRelativeTime(new Date(application.dateApplied))}
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/jobs/${application.id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Jobs */}
      <div>
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
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All Jobs
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {recommendedJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-base font-semibold text-secondary-900 hover:text-primary-600"
                    >
                      {job.title}
                    </Link>
                    <p className="mt-1 text-sm text-secondary-600">
                      {job.company}
                    </p>
                  </div>
                  {job.matchScore && (
                    <div className="ml-2 flex flex-col items-center rounded-lg bg-success-50 px-2 py-1">
                      <Sparkles className="h-3 w-3 text-success-600" />
                      <span className="text-xs font-bold text-success-700">
                        {job.matchScore}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-secondary-600">
                    <MapPin className="mr-1.5 h-4 w-4" />
                    <span>{job.location}</span>
                    <Badge variant="secondary" size="sm" className="ml-2">
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
                    <Badge key={skill} variant="secondary" size="sm">
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
                    className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
