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
  Mail,
  RefreshCw,
  HelpCircle,
  Check,
  Phone,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface Introduction {
  id: string;
  status: string;
  profileViewedAt: string;
  introRequestedAt: string | null;
  candidateRespondedAt: string | null;
  candidateResponse: string | null;
  candidateMessage: string | null;
  introducedAt: string | null;
  protectionStartsAt: string;
  protectionEndsAt: string;
  profileViews: number;
  resumeDownloads: number;
  adminNotes: string | null;
  lastEmailSentAt: string | null;
  emailResendCount: number;
  responseTokenExpiry: string | null;
  createdAt: string;
  updatedAt: string;
  candidate: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    phone: string | null;
    userId: string;
    location: string | null;
    currentRole: string | null;
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
    location?: string;
    type?: string;
  } | null;
  timeline?: Array<{
    date: string;
    event: string;
    type: string;
  }>;
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

const STATUS_UPDATE_OPTIONS = [
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
  const { showToast } = useToast();
  const [introductions, setIntroductions] = useState<Introduction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail modal state
  const [selectedIntroduction, setSelectedIntroduction] = useState<Introduction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Action states
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isManualAction, setIsManualAction] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

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
      setNewNote("");
    } catch (error) {
      console.error("Failed to fetch introduction detail:", error);
      showToast("error", "Failed to load details");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const updateIntroductionStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      await api.patch(`/api/admin/introductions/${id}`, { status: newStatus });
      showToast("success", "Status updated");
      fetchIntroductions();
      fetchStats();
      if (selectedIntroduction?.id === id) {
        fetchIntroductionDetail(id);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("error", "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const resendEmail = async (id: string) => {
    setIsResending(true);
    try {
      const response = await api.post(`/api/admin/introductions/${id}/resend-email`);
      showToast(
        "success",
        "Email sent",
        response.data.tokenRegenerated
          ? "New link generated and email sent"
          : "Email resent to candidate"
      );
      if (selectedIntroduction?.id === id) {
        fetchIntroductionDetail(id);
      }
    } catch (error) {
      console.error("Failed to resend email:", error);
      showToast("error", "Failed to resend email");
    } finally {
      setIsResending(false);
    }
  };

  const handleManualResponse = async (id: string, response: "ACCEPT" | "DECLINE", note?: string) => {
    setIsManualAction(true);
    try {
      await api.post(`/api/admin/introductions/${id}/manual-response`, {
        response,
        note,
      });
      showToast(
        "success",
        response === "ACCEPT" ? "Introduction accepted" : "Introduction declined",
        "Employer has been notified"
      );
      fetchIntroductions();
      fetchStats();
      if (selectedIntroduction?.id === id) {
        fetchIntroductionDetail(id);
      }
    } catch (error) {
      console.error("Failed to process manual response:", error);
      showToast("error", "Failed to process response");
    } finally {
      setIsManualAction(false);
    }
  };

  const handleMarkAsAnswered = async (id: string) => {
    setIsManualAction(true);
    try {
      await api.patch(`/api/admin/introductions/${id}`, {
        resetToRequested: true,
        note: "Questions answered by admin, resending to candidate",
      });
      showToast("success", "Status reset", "New email sent to candidate");
      fetchIntroductions();
      fetchStats();
      if (selectedIntroduction?.id === id) {
        fetchIntroductionDetail(id);
      }
    } catch (error) {
      console.error("Failed to mark as answered:", error);
      showToast("error", "Failed to update");
    } finally {
      setIsManualAction(false);
    }
  };

  const saveNote = async (id: string) => {
    if (!newNote.trim()) return;

    setIsSavingNote(true);
    try {
      await api.patch(`/api/admin/introductions/${id}`, { note: newNote });
      showToast("success", "Note saved");
      setNewNote("");
      if (selectedIntroduction?.id === id) {
        fetchIntroductionDetail(id);
      }
    } catch (error) {
      console.error("Failed to save note:", error);
      showToast("error", "Failed to save note");
    } finally {
      setIsSavingNote(false);
    }
  };

  const getStatusBadge = (status: string, candidateResponse?: string | null) => {
    // Show QUESTIONS badge if candidateResponse is QUESTIONS
    if (candidateResponse === "QUESTIONS") {
      return (
        <Badge variant="warning" size="sm">
          <HelpCircle className="w-3 h-3 mr-1" />
          Questions
        </Badge>
      );
    }

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
      "Candidate Response",
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
      intro.candidateResponse || "",
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

  const isQuestionsResponse = selectedIntroduction?.candidateResponse === "QUESTIONS";
  const hasExpiredToken = selectedIntroduction?.responseTokenExpiry
    ? new Date(selectedIntroduction.responseTokenExpiry) < new Date()
    : false;

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
                      <tr
                        key={intro.id}
                        className={`hover:bg-gray-50 ${
                          intro.candidateResponse === "QUESTIONS"
                            ? "bg-amber-50"
                            : ""
                        }`}
                      >
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
                          {getStatusBadge(intro.status, intro.candidateResponse)}
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

            <div className="relative inline-block w-full max-w-3xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
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
                  {/* Candidate & Employer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Candidate</h4>
                      <div className="flex items-center gap-3">
                        {selectedIntroduction.candidate.image ? (
                          <img
                            src={selectedIntroduction.candidate.image}
                            alt=""
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="font-medium text-primary-600 text-lg">
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
                          {selectedIntroduction.candidate.phone && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {selectedIntroduction.candidate.phone}
                            </p>
                          )}
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
                        <p className="text-sm text-gray-500">
                          {selectedIntroduction.employer.contactEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Job */}
                  {selectedIntroduction.job && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Job</h4>
                      <p className="font-medium text-gray-900">{selectedIntroduction.job.title}</p>
                      {selectedIntroduction.job.location && (
                        <p className="text-sm text-gray-500">{selectedIntroduction.job.location}</p>
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                      {getStatusBadge(selectedIntroduction.status, selectedIntroduction.candidateResponse)}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Update Status
                      </label>
                      <select
                        value={selectedIntroduction.status}
                        onChange={(e) =>
                          updateIntroductionStatus(selectedIntroduction.id, e.target.value)
                        }
                        disabled={isUpdating}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                      >
                        {STATUS_UPDATE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Candidate Questions Section */}
                  {isQuestionsResponse && selectedIntroduction.candidateMessage && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Candidate&apos;s Questions
                      </h4>
                      <blockquote className="text-gray-800 italic whitespace-pre-wrap border-l-4 border-amber-400 pl-4 my-3">
                        &ldquo;{selectedIntroduction.candidateMessage}&rdquo;
                      </blockquote>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsAnswered(selectedIntroduction.id)}
                          disabled={isManualAction}
                        >
                          {isManualAction ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4 mr-2" />
                          )}
                          Answer & Resend to Candidate
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleManualResponse(selectedIntroduction.id, "ACCEPT")}
                          disabled={isManualAction}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Manually Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManualResponse(selectedIntroduction.id, "DECLINE")}
                          disabled={isManualAction}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Manually Decline
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Actions for INTRO_REQUESTED status */}
                  {selectedIntroduction.status === "INTRO_REQUESTED" && !isQuestionsResponse && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800 mb-3">
                        Introduction Actions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resendEmail(selectedIntroduction.id)}
                          disabled={isResending}
                        >
                          {isResending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4 mr-2" />
                          )}
                          Resend Candidate Email
                          {hasExpiredToken && (
                            <span className="ml-1 text-xs text-amber-600">(token expired)</span>
                          )}
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleManualResponse(
                              selectedIntroduction.id,
                              "ACCEPT",
                              "Verbally confirmed by admin"
                            )
                          }
                          disabled={isManualAction}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Manually Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleManualResponse(
                              selectedIntroduction.id,
                              "DECLINE",
                              "Declined by admin on behalf of candidate"
                            )
                          }
                          disabled={isManualAction}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Manually Decline
                        </Button>
                      </div>
                      {selectedIntroduction.emailResendCount > 0 && (
                        <p className="mt-2 text-xs text-gray-500">
                          Email resent {selectedIntroduction.emailResendCount} time(s).
                          Last sent: {selectedIntroduction.lastEmailSentAt
                            ? formatDateTime(selectedIntroduction.lastEmailSentAt)
                            : "N/A"}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Timeline</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {selectedIntroduction.timeline?.map((event, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                              event.type === "response"
                                ? "bg-green-500"
                                : event.type === "request"
                                ? "bg-yellow-500"
                                : event.type === "system"
                                ? "bg-purple-500"
                                : "bg-primary-500"
                            }`}
                          />
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

                  {/* Internal Notes */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Internal Notes
                    </h4>

                    {/* Existing notes */}
                    {selectedIntroduction.adminNotes && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto font-mono">
                        {selectedIntroduction.adminNotes}
                      </div>
                    )}

                    {/* Add new note */}
                    <div className="flex gap-2">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note..."
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 resize-none"
                        rows={2}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveNote(selectedIntroduction.id)}
                        disabled={!newNote.trim() || isSavingNote}
                        className="self-end"
                      >
                        {isSavingNote ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save Note"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <a
                        href={`/admin/candidates/${selectedIntroduction.candidate.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        View Candidate <ExternalLink className="h-3 w-3" />
                      </a>
                      <span className="text-gray-300">|</span>
                      <a
                        href={`/admin/employers/${selectedIntroduction.employer.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        View Employer <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
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
