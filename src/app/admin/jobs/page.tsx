"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  Search,
  Filter,
  Loader2,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Building2,
  MapPin,
  DollarSign,
  Clock,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input, useToast, ConfirmationModal, InputModal } from "@/components/ui";

export default function AdminJobsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Confirmation modal states
  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; jobId: string | null }>({ isOpen: false, jobId: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; jobId: string | null }>({ isOpen: false, jobId: null });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; jobId: string | null }>({ isOpen: false, jobId: null });

  // Redirect if not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/jobs");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchJobs();
    }
  }, [status, session, currentPage, statusFilter, searchQuery]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/jobs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobs(data.jobs || []);
      setStats(data.stats);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (jobId: string) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      if (response.ok) {
        fetchJobs();
        showToast("success", "Job Approved", "The job has been approved successfully.");
      }
    } catch (error) {
      console.error("Failed to approve job:", error);
      showToast("error", "Approval Failed", "Failed to approve the job.");
    }
  };

  const handleReject = async (jobId: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason }),
      });

      if (response.ok) {
        fetchJobs();
        showToast("success", "Job Rejected", "The job has been rejected.");
      } else {
        showToast("error", "Rejection Failed", "Failed to reject the job.");
      }
    } catch (error) {
      console.error("Failed to reject job:", error);
      showToast("error", "Rejection Failed", "An error occurred while rejecting the job.");
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchJobs();
        showToast("success", "Job Deleted", "The job has been deleted successfully.");
      } else {
        const data = await response.json();
        showToast("error", "Delete Failed", data.error || "Failed to delete job");
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
      showToast("error", "Delete Failed", "An error occurred while deleting the job.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success" size="sm">Active</Badge>;
      case "PENDING_APPROVAL":
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case "DRAFT":
        return <Badge variant="secondary" size="sm">Draft</Badge>;
      case "EXPIRED":
        return <Badge variant="danger" size="sm">Expired</Badge>;
      case "CLOSED":
        return <Badge variant="secondary" size="sm">Closed</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Jobs Management
          </h1>
          <p className="text-secondary-600">
            Manage all job postings across the platform
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Total Jobs</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {(stats.ACTIVE || 0) + (stats.PENDING_APPROVAL || 0) + (stats.DRAFT || 0) + (stats.CLOSED || 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Active Jobs</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.ACTIVE || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.PENDING_APPROVAL || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Closed Jobs</p>
                <p className="text-3xl font-bold text-secondary-600">
                  {stats.CLOSED || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <Input
                    placeholder="Search by job title or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="DRAFT">Draft</option>
                <option value="EXPIRED">Expired</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Job Title
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Company
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Applications
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Posted
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-secondary-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-secondary-900">
                            {job.title}
                          </p>
                          <p className="text-sm text-secondary-600">
                            {job.niche}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-secondary-400" />
                          <span className="text-sm text-secondary-900">
                            {job.employer?.companyName || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-secondary-400" />
                          <span className="text-sm text-secondary-900">
                            {job.location}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(job.status)}</td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-secondary-900">
                          {job._count?.applications || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-secondary-900">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {job.status === "PENDING_APPROVAL" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setApproveModal({ isOpen: true, jobId: job.id })}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRejectModal({ isOpen: true, jobId: job.id })}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/jobs/${job.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {job._count?.applications === 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteModal({ isOpen: true, jobId: job.id })}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-secondary-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ isOpen: false, jobId: null })}
        onConfirm={() => { if (approveModal.jobId) handleApprove(approveModal.jobId); }}
        title="Approve Job"
        message="Are you sure you want to approve this job? It will become visible to all candidates."
        confirmText="Approve"
        cancelText="Cancel"
        variant="success"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, jobId: null })}
        onConfirm={() => { if (deleteModal.jobId) handleDelete(deleteModal.jobId); }}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Reject Job Input Modal */}
      <InputModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, jobId: null })}
        onSubmit={(reason) => { if (rejectModal.jobId) handleReject(rejectModal.jobId, reason); }}
        title="Reject Job"
        message="Please provide a reason for rejecting this job posting. This will be sent to the employer."
        inputLabel="Rejection Reason"
        inputPlaceholder="Enter the reason for rejection..."
        submitText="Reject Job"
        cancelText="Cancel"
        variant="danger"
        required
        multiline
      />
    </div>
  );
}
