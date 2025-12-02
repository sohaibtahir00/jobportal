"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Search,
  Filter,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  useToast,
} from "@/components/ui";
import { useEmployerDashboard } from "@/hooks/useDashboard";

// Job status color mapping
const jobStatusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 border-green-300",
  DRAFT: "bg-yellow-100 text-yellow-800 border-yellow-300",
  CLOSED: "bg-gray-100 text-gray-800 border-gray-300",
  FILLED: "bg-blue-100 text-blue-800 border-blue-300",
  EXPIRED: "bg-red-100 text-red-800 border-red-300",
};

// Helper function to format date
function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Helper function to format salary
function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "Not specified";
  if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  if (min) return `From $${(min / 1000).toFixed(0)}k`;
  if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
  return "Not specified";
}

export default function EmployerJobsPage() {
  const { showToast } = useToast();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch employer dashboard data which includes all jobs
  const { data, isLoading, error, refetch } = useEmployerDashboard();

  // Refetch data when returning from edit page with updated=true
  useEffect(() => {
    if (searchParams.get("updated") === "true") {
      refetch();
      showToast("success", "Job Updated", "Your job posting has been updated successfully.");
    }
  }, [searchParams, refetch, showToast]);

  // Get all jobs from employer data (backend includes jobs array via Prisma include)
  // TypeScript interface doesn't include it, so we cast to any to access it
  const allJobs = (data as any)?.employer?.jobs || [];

  // Transform jobs to include applicationsCount
  const jobs = allJobs.map((job: any) => ({
    ...job,
    applicationsCount: job._count?.applications || 0,
  }));

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = false;
    if (statusFilter === "all") {
      matchesStatus = true;
    } else if (statusFilter === "AWAITING_CLAIM") {
      matchesStatus = job.isClaimed === false;
    } else {
      matchesStatus = job.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  // Count jobs by status
  const jobCounts = {
    all: jobs.length,
    ACTIVE: jobs.filter((j: any) => j.status === "ACTIVE").length,
    AWAITING_CLAIM: jobs.filter((j: any) => j.isClaimed === false).length,
    CLOSED: jobs.filter((j: any) => j.status === "CLOSED").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto" />
          <p className="mt-4 text-secondary-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
        <p className="text-red-600 mb-2 text-lg font-semibold">Failed to load jobs</p>
        <p className="text-sm text-secondary-600">{(error as any)?.message || "Please try again later"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="space-y-6 pb-12">
        {/* Header */}
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
                  Your Job Postings
                </h1>
                <p className="text-blue-100 text-lg">
                  Manage and track all your job listings
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-white text-primary-600 hover:bg-blue-50"
              >
                <Link href="/employer/jobs/new">
                  <Plus className="mr-2 h-5 w-5" />
                  Post New Job
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">Total Jobs</p>
                    <p className="text-3xl font-bold text-secondary-900">{jobCounts.all}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">Active</p>
                    <p className="text-3xl font-bold text-green-600">{jobCounts.ACTIVE}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">Awaiting Claim</p>
                    <p className="text-3xl font-bold text-yellow-600">{jobCounts.AWAITING_CLAIM}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">Closed</p>
                    <p className="text-3xl font-bold text-gray-600">{jobCounts.CLOSED}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 shadow-lg">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                    <input
                      type="text"
                      placeholder="Search jobs by title or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="lg:w-64">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                    >
                      <option value="all">All Jobs ({jobCounts.all})</option>
                      <option value="ACTIVE">Active ({jobCounts.ACTIVE})</option>
                      <option value="AWAITING_CLAIM">Awaiting Claim ({jobCounts.AWAITING_CLAIM})</option>
                      <option value="CLOSED">Closed ({jobCounts.CLOSED})</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Jobs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
                <p className="text-secondary-600 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "No jobs match your filters"
                    : "No jobs posted yet"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button asChild size="sm">
                    <Link href="/employer/jobs/new">Post Your First Job</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job: any, index: number) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Job Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Link
                                href={`/jobs/${job.id}`}
                                className="text-xl font-bold text-secondary-900 hover:text-primary-600 transition-colors"
                              >
                                {job.title}
                              </Link>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-secondary-600">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {formatSalary(job.salaryMin, job.salaryMax)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Posted {formatDate(job.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {job.applicationsCount || 0} applicants
                                </span>
                              </div>
                            </div>
                            <Badge className={jobStatusColors[job.status]}>
                              {job.status}
                            </Badge>
                          </div>

                          {/* Job Type & Experience Level */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline">{job.type}</Badge>
                            <Badge variant="outline">{job.experienceLevel}</Badge>
                            {job.remote && <Badge variant="outline">Remote</Badge>}
                          </div>

                          {/* Description Preview */}
                          <p className="text-secondary-600 text-sm line-clamp-2 mb-4">
                            {job.description}
                          </p>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="primary" asChild>
                              <Link href={`/employer/jobs/${job.id}/applicants`}>
                                <Users className="mr-2 h-4 w-4" />
                                View Applicants
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/employer/jobs/${job.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/jobs/${job.id}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
