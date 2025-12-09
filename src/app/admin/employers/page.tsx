"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Building,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Briefcase,
  Globe,
  MapPin,
} from "lucide-react";
import { Button, Badge, Card, CardContent, ConfirmationModal, useToast } from "@/components/ui";

interface Employer {
  id: string;
  companyName: string;
  industry: string | null;
  companySize: string | null;
  website: string | null;
  location: string | null;
  description: string | null;
  logo: string | null;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  jobsCount: number;
}

interface Summary {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminEmployersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();

  const [employers, setEmployers] = useState<Employer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED" | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/employers");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchEmployers();
    }
  }, [status, session, activeTab, currentPage]);

  const fetchEmployers = async () => {
    setIsLoading(true);
    try {
      let url = `/api/admin/employers/pending?page=${currentPage}&limit=20&status=${activeTab}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch employers");

      const data = await response.json();
      setEmployers(data.employers || []);
      setSummary(data.summary || null);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Failed to fetch employers:", error);
      showToast("error", "Error", "Failed to fetch employers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchEmployers();
  };

  const handleApprove = async () => {
    if (!approveModal.id) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/employers/${approveModal.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        showToast("success", "Approved", "Employer has been approved");
        fetchEmployers();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve");
      }
    } catch (error: any) {
      showToast("error", "Error", error.message);
    } finally {
      setIsProcessing(false);
      setApproveModal({ isOpen: false, id: null });
    }
  };

  const handleReject = async () => {
    if (!rejectModal.id || !rejectReason.trim()) {
      showToast("error", "Error", "Please provide a rejection reason");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/employers/${rejectModal.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });

      if (response.ok) {
        showToast("success", "Rejected", "Employer has been rejected");
        fetchEmployers();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject");
      }
    } catch (error: any) {
      showToast("error", "Error", error.message);
    } finally {
      setIsProcessing(false);
      setRejectModal({ isOpen: false, id: null });
      setRejectReason("");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success" size="sm"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case "REJECTED":
        return <Badge variant="danger" size="sm"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "PENDING":
      default:
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Employer Management</h1>
          <p className="text-secondary-600">Approve, reject, and manage employer registrations</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card className={`cursor-pointer ${activeTab === "all" ? "ring-2 ring-primary-500" : ""}`} onClick={() => { setActiveTab("all"); setCurrentPage(1); }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.total}</p>
                    <p className="text-xs text-secondary-600">Total Employers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${activeTab === "PENDING" ? "ring-2 ring-yellow-500" : ""}`} onClick={() => { setActiveTab("PENDING"); setCurrentPage(1); }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.pending}</p>
                    <p className="text-xs text-secondary-600">Pending Approval</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${activeTab === "APPROVED" ? "ring-2 ring-green-500" : ""}`} onClick={() => { setActiveTab("APPROVED"); setCurrentPage(1); }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.approved}</p>
                    <p className="text-xs text-secondary-600">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${activeTab === "REJECTED" ? "ring-2 ring-red-500" : ""}`} onClick={() => { setActiveTab("REJECTED"); setCurrentPage(1); }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.rejected}</p>
                    <p className="text-xs text-secondary-600">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search by company name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <Button variant="outline" onClick={() => fetchEmployers()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Employers Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : employers.length === 0 ? (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Employers Found</h3>
                <p className="text-secondary-600">No employers match your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200 bg-secondary-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Company</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Contact</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Industry</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Jobs</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-100">
                    {employers.map((employer) => (
                      <tr key={employer.id} className="hover:bg-secondary-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {employer.logo ? (
                              <img src={employer.logo} alt={employer.companyName} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                                {employer.companyName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-secondary-900">{employer.companyName}</p>
                              {employer.location && (
                                <p className="text-xs text-secondary-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />{employer.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-secondary-900">{employer.user.name}</p>
                          <p className="text-xs text-secondary-500">{employer.user.email}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-secondary-700">{employer.industry || "Not specified"}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-secondary-700">
                            <Briefcase className="w-4 h-4" />
                            <span className="text-sm">{employer.jobsCount}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(employer.approvalStatus)}</td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-secondary-700">{new Date(employer.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedEmployer(employer)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {employer.approvalStatus === "PENDING" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600"
                                  onClick={() => setApproveModal({ isOpen: true, id: employer.id })}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => setRejectModal({ isOpen: true, id: employer.id })}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-200">
                <p className="text-sm text-secondary-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-secondary-600">Page {pagination.page} of {pagination.totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pagination.totalPages}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Employer Detail Modal */}
      {selectedEmployer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {selectedEmployer.logo ? (
                  <img src={selectedEmployer.logo} alt={selectedEmployer.companyName} className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
                    {selectedEmployer.companyName.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">{selectedEmployer.companyName}</h2>
                  {getStatusBadge(selectedEmployer.approvalStatus)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-secondary-500">Contact Person</p>
                <p className="text-sm font-medium text-secondary-900">{selectedEmployer.user.name}</p>
                <p className="text-sm text-secondary-600">{selectedEmployer.user.email}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-500">Industry</p>
                <p className="text-sm font-medium text-secondary-900">{selectedEmployer.industry || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-500">Company Size</p>
                <p className="text-sm font-medium text-secondary-900">{selectedEmployer.companySize || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-500">Location</p>
                <p className="text-sm font-medium text-secondary-900">{selectedEmployer.location || "Not specified"}</p>
              </div>
              {selectedEmployer.website && (
                <div className="col-span-2">
                  <p className="text-xs text-secondary-500">Website</p>
                  <a href={selectedEmployer.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                    <Globe className="w-4 h-4" />{selectedEmployer.website}
                  </a>
                </div>
              )}
            </div>

            {selectedEmployer.description && (
              <div className="mb-4">
                <p className="text-xs text-secondary-500 mb-1">Description</p>
                <p className="text-sm text-secondary-700">{selectedEmployer.description}</p>
              </div>
            )}

            {selectedEmployer.rejectionReason && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600 mb-1">Rejection Reason</p>
                <p className="text-sm text-red-700">{selectedEmployer.rejectionReason}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              {selectedEmployer.approvalStatus === "PENDING" && (
                <>
                  <Button variant="outline" className="text-red-600" onClick={() => { setSelectedEmployer(null); setRejectModal({ isOpen: true, id: selectedEmployer.id }); }}>
                    <XCircle className="w-4 h-4 mr-2" />Reject
                  </Button>
                  <Button variant="primary" onClick={() => { setSelectedEmployer(null); setApproveModal({ isOpen: true, id: selectedEmployer.id }); }}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />Approve
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => setSelectedEmployer(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      <ConfirmationModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ isOpen: false, id: null })}
        onConfirm={handleApprove}
        title="Approve Employer"
        message="Are you sure you want to approve this employer? They will be able to post jobs and access all employer features."
        confirmText={isProcessing ? "Processing..." : "Approve"}
        cancelText="Cancel"
        variant="success"
      />

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-4">Reject Employer</h2>
            <p className="text-secondary-600 mb-4">Please provide a reason for rejecting this employer registration.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Enter rejection reason..."
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setRejectModal({ isOpen: false, id: null }); setRejectReason(""); }}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleReject} disabled={isProcessing || !rejectReason.trim()}>
                {isProcessing ? "Processing..." : "Reject"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
