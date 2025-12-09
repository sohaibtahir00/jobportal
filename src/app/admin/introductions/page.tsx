"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Users,
  Loader2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquare,
  Briefcase,
  Calendar,
  Shield,
  X,
  UserCheck,
  Send,
  AlertCircle,
  PartyPopper,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";
import { api } from "@/lib/api";

interface Introduction {
  id: string;
  status: string;
  profileViewedAt: string;
  introRequestedAt: string | null;
  candidateRespondedAt: string | null;
  candidateResponse: string | null;
  introducedAt: string | null;
  protectionStartsAt: string;
  protectionEndsAt: string;
  profileViews: number;
  resumeDownloads: number;
  createdAt: string;
  updatedAt: string;
  candidate: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    userId: string;
  };
  employer: {
    id: string;
    companyName: string;
    logo: string | null;
    contactName: string;
    contactEmail: string;
    userId: string;
  };
  job: {
    id: string;
    title: string;
  } | null;
}

interface Stats {
  total: number;
  active: number;
  byStatus: {
    profileViewed: number;
    requested: number;
    introduced: number;
    interviewing: number;
    offerExtended: number;
    hired: number;
    declined: number;
    closedNoHire: number;
    expired: number;
  };
  expiringSoon: number;
  recentActivity: {
    introductions: number;
    requests: number;
  };
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "PROFILE_VIEWED", label: "Profile Viewed" },
  { value: "INTRO_REQUESTED", label: "Requested" },
  { value: "INTRODUCED", label: "Introduced" },
  { value: "INTERVIEWING", label: "Interviewing" },
  { value: "OFFER_EXTENDED", label: "Offer Extended" },
  { value: "HIRED", label: "Hired" },
  { value: "CANDIDATE_DECLINED", label: "Declined" },
  { value: "CLOSED_NO_HIRE", label: "Closed" },
  { value: "EXPIRED", label: "Expired" },
];

export default function AdminIntroductionsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [introductions, setIntroductions] = useState<Introduction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail modal state
  const [selectedIntroduction, setSelectedIntroduction] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Status update
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/introductions");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchStats();
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchIntroductions();
    }
  }, [status, session, statusFilter, searchQuery, currentPage]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/admin/introductions/stats");
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchIntroductions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("page", currentPage.toString());
      params.append("limit", "20");

      const response = await api.get(`/api/admin/introductions?${params.toString()}`);
      setIntroductions(response.data.introductions || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalCount(response.data.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to fetch introductions:", error);
      setIntroductions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIntroductionDetail = async (id: string) => {
    setIsLoadingDetail(true);
    try {
      const response = await api.get(`/api/admin/introductions/${id}`);
      setSelectedIntroduction(response.data.introduction);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Failed to fetch introduction detail:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const updateIntroductionStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      await api.patch(`/api/admin/introductions/${id}`, { status: newStatus });
      // Refresh data
      fetchIntroductions();
      fetchStats();
      // Update detail modal if open
      if (selectedIntroduction?.id === id) {
        fetchIntroductionDetail(id);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PROFILE_VIEWED":
        return (
          <Badge variant="secondary" size="sm">
            <Eye className="w-3 h-3 mr-1" />
            Viewed
          </Badge>
        );
      case "INTRO_REQUESTED":
        return (
          <Badge variant="warning" size="sm">
            <Send className="w-3 h-3 mr-1" />
            Requested
          </Badge>
        );
      case "INTRODUCED":
        return (
          <Badge variant="primary" size="sm">
            <UserCheck className="w-3 h-3 mr-1" />
            Introduced
          </Badge>
        );
      case "INTERVIEWING":
        return (
          <Badge variant="primary" size="sm">
            <MessageSquare className="w-3 h-3 mr-1" />
            Interviewing
          </Badge>
        );
      case "OFFER_EXTENDED":
        return (
          <Badge variant="success" size="sm">
            <Briefcase className="w-3 h-3 mr-1" />
            Offer Extended
          </Badge>
        );
      case "HIRED":
        return (
          <Badge variant="success" size="sm">
            <PartyPopper className="w-3 h-3 mr-1" />
            Hired
          </Badge>
        );
      case "CANDIDATE_DECLINED":
        return (
          <Badge variant="danger" size="sm">
            <XCircle className="w-3 h-3 mr-1" />
            Declined
          </Badge>
        );
      case "CLOSED_NO_HIRE":
        return (
          <Badge variant="secondary" size="sm">
            <X className="w-3 h-3 mr-1" />
            Closed
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge variant="secondary" size="sm">
            <AlertCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const exportCSV = () => {
    if (!introductions.length) return;

    const headers = [
      "Candidate",
      "Candidate Email",
      "Employer",
      "Status",
      "Profile Viewed",
      "Intro Requested",
      "Introduced",
      "Protection Expires",
      "Profile Views",
    ];

    const rows = introductions.map((intro) => [
      intro.candidate.name,
      intro.candidate.email,
      intro.employer.companyName,
      intro.status,
      formatDate(intro.profileViewedAt),
      intro.introRequestedAt ? formatDate(intro.introRequestedAt) : "",
      intro.introducedAt ? formatDate(intro.introducedAt) : "",
      formatDate(intro.protectionEndsAt),
      intro.profileViews.toString(),
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `introductions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (status === "loading" || (status === "authenticated" && isLoading && !introductions.length)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (status === "authenticated" && session?.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Candidate Introductions</h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage employer-candidate introductions
            </p>
          </div>
          <Button variant="outline" onClick={exportCSV} disabled={!introductions.length}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="mx-auto mb-2 h-6 w-6 text-gray-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs text-gray-600">Total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Send className="mx-auto mb-2 h-6 w-6 text-yellow-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.byStatus.requested}</div>
                <div className="text-xs text-gray-600">Requested</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <UserCheck className="mx-auto mb-2 h-6 w-6 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.byStatus.introduced}</div>
                <div className="text-xs text-gray-600">Introduced</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <PartyPopper className="mx-auto mb-2 h-6 w-6 text-green-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.byStatus.hired}</div>
                <div className="text-xs text-gray-600">Hired</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="mx-auto mb-2 h-6 w-6 text-orange-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</div>
                <div className="text-xs text-gray-600">Expiring (30d)</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by candidate or employer name..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {introductions.length} of {totalCount} introductions
        </div>

        {/* Table */}
        <Card className="mb-6">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : introductions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No introductions found</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Introductions will appear here when employers view candidate profiles"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employer
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Viewed
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expires
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {introductions.map((intro) => (
                      <tr key={intro.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {intro.candidate.image ? (
                              <img
                                src={intro.candidate.image}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-primary-600">
                                  {intro.candidate.name?.charAt(0) || "?"}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {intro.candidate.name}
                              </div>
                              <div className="text-xs text-gray-500">{intro.candidate.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {intro.employer.companyName}
                          </div>
                          {intro.job && (
                            <div className="text-xs text-gray-500">{intro.job.title}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(intro.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(intro.profileViewedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(intro.protectionEndsAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchIntroductionDetail(intro.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedIntroduction && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowDetailModal(false)}
            />

            <div className="relative inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Introduction Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isLoadingDetail ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <>
                  {/* Candidate & Employer */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Candidate</h4>
                      <div className="flex items-center gap-3">
                        {selectedIntroduction.candidate.image ? (
                          <img
                            src={selectedIntroduction.candidate.image}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="font-medium text-primary-600">
                              {selectedIntroduction.candidate.name?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {selectedIntroduction.candidate.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedIntroduction.candidate.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Employer</h4>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedIntroduction.employer.companyName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedIntroduction.employer.contactName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Job */}
                  {selectedIntroduction.job && (
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Original Job</h4>
                      <p className="font-medium text-gray-900">{selectedIntroduction.job.title}</p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Timeline</h4>
                    <div className="space-y-3">
                      {selectedIntroduction.timeline?.map((event: any, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500" />
                          <div>
                            <p className="text-sm text-gray-900">{event.event}</p>
                            <p className="text-xs text-gray-500">{formatDateTime(event.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedIntroduction.profileViews}
                      </p>
                      <p className="text-xs text-gray-500">Profile Views</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedIntroduction.resumeDownloads}
                      </p>
                      <p className="text-xs text-gray-500">Resume Downloads</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(selectedIntroduction.protectionEndsAt)}
                      </div>
                      <p className="text-xs text-gray-500">Protection Expires</p>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Current Status</h4>
                      {getStatusBadge(selectedIntroduction.status)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Update Status</h4>
                      <select
                        value={selectedIntroduction.status}
                        onChange={(e) =>
                          updateIntroductionStatus(selectedIntroduction.id, e.target.value)
                        }
                        disabled={isUpdating}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                      >
                        {STATUS_OPTIONS.slice(1).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                      Close
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
