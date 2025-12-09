"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Send,
  RefreshCw,
  Loader2,
  Play,
  Eye,
  X,
  Calendar,
  User,
  Building2,
  Briefcase,
  MessageSquare,
  AlertCircle,
  FileText,
  Bot,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://job-portal-backend-production-cd05.up.railway.app";

// Types
interface CheckIn {
  id: string;
  checkInNumber: number;
  scheduledFor: string;
  sentAt: string | null;
  respondedAt: string | null;
  responseType: string | null;
  responseRaw: string | null;
  responseParsed: Record<string, unknown> | null;
  riskLevel: string | null;
  riskReason: string | null;
  flaggedForReview: boolean;
  reviewedAt: string | null;
  reviewNotes: string | null;
  candidateName: string;
  candidateEmail: string;
  employerCompanyName: string;
  jobTitle: string | null;
  introductionId: string;
  createdAt: string;
}

interface Stats {
  overview: {
    sent: number;
    responded: number;
    pending: number;
    noReply: number;
    flagged: number;
  };
  last30Days: {
    sent: number;
    responded: number;
    responseRate: number;
  };
  risk: {
    high: number;
    medium: number;
  };
  needsAttention: {
    pendingOlderThan7Days: number;
    flaggedForReview: number;
    upcoming: number;
  };
  byCheckInNumber: Array<{
    checkInNumber: number;
    label: string;
    sent: number;
    responded: number;
    responseRate: number;
  }>;
  responseRate: {
    overall: number;
    last30Days: number;
  };
}

const CHECK_IN_LABELS: Record<number, string> = {
  1: "30-day",
  2: "60-day",
  3: "90-day",
  4: "180-day",
  5: "365-day",
};

const RISK_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  HIGH: { label: "High", color: "text-red-700", bgColor: "bg-red-100" },
  MEDIUM: { label: "Medium", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  LOW: { label: "Low", color: "text-blue-700", bgColor: "bg-blue-100" },
  CLEAR: { label: "Clear", color: "text-green-700", bgColor: "bg-green-100" },
};

type TabType = "all" | "pending" | "flagged" | "responded";

interface ParsedCheckInResponse {
  status: "STILL_EMPLOYED" | "LEFT_JOB" | "NOT_HIRED" | "UNCLEAR";
  riskLevel: "HIGH" | "MEDIUM" | "LOW" | "CLEAR";
  confidence: number;
  companyMentioned: string | null;
  hireDate: string | null;
  separationDate: string | null;
  summary: string;
  suggestedAction: string;
}

export default function CheckInsPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail modal
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailCheckIn, setDetailCheckIn] = useState<CheckIn | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Parse email modal
  const [isParseOpen, setIsParseOpen] = useState(false);
  const [parseCheckIn, setParseCheckIn] = useState<CheckIn | null>(null);
  const [emailContent, setEmailContent] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParsedCheckInResponse | null>(null);

  // Action states
  const [isRunningScheduler, setIsRunningScheduler] = useState(false);
  const [isResending, setIsResending] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchData();
  }, [activeTab, page]);

  const fetchData = async () => {
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "20");

      if (activeTab === "pending") {
        params.append("responded", "false");
      } else if (activeTab === "flagged") {
        params.append("flaggedOnly", "true");
      } else if (activeTab === "responded") {
        params.append("responded", "true");
      }

      const [checkInsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/check-ins?${params}`, { credentials: "include" }),
        fetch(`${API_URL}/api/admin/check-ins/stats`, { credentials: "include" }),
      ]);

      if (checkInsRes.ok) {
        const data = await checkInsRes.json();
        setCheckIns(data.checkIns || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const runScheduler = async () => {
    setIsRunningScheduler(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/check-ins/run-scheduler`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        alert(
          `Scheduler completed!\nCheck-ins created: ${data.result.checkInsCreated}\nEmails sent: ${data.result.emailsSent}`
        );
        fetchData();
      } else {
        const error = await res.json();
        alert(`Failed to run scheduler: ${error.error}`);
      }
    } catch (error) {
      console.error("Error running scheduler:", error);
      alert("Failed to run scheduler");
    } finally {
      setIsRunningScheduler(false);
    }
  };

  const resendCheckIn = async (checkInId: string) => {
    setIsResending(checkInId);
    try {
      const res = await fetch(`${API_URL}/api/admin/check-ins/${checkInId}/resend`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Email resent to ${data.checkIn.sentTo}`);
        fetchData();
      } else {
        const error = await res.json();
        alert(`Failed to resend: ${error.error}`);
      }
    } catch (error) {
      console.error("Error resending:", error);
      alert("Failed to resend email");
    } finally {
      setIsResending(null);
    }
  };

  const updateCheckIn = async (checkInId: string, updates: Record<string, unknown>) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/check-ins/${checkInId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        fetchData();
        if (detailCheckIn && detailCheckIn.id === checkInId) {
          const data = await res.json();
          setDetailCheckIn({ ...detailCheckIn, ...data.checkIn });
        }
      }
    } catch (error) {
      console.error("Error updating:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openDetail = (checkIn: CheckIn) => {
    setDetailCheckIn(checkIn);
    setNotes(checkIn.reviewNotes || "");
    setIsDetailOpen(true);
  };

  const openParseModal = (checkIn: CheckIn) => {
    setParseCheckIn(checkIn);
    setEmailContent("");
    setParseResult(null);
    setIsParseOpen(true);
  };

  const parseEmailReply = async () => {
    if (!parseCheckIn || !emailContent.trim()) return;

    setIsParsing(true);
    setParseResult(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/check-ins/parse-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          checkInId: parseCheckIn.id,
          emailContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setParseResult(data.parsed as ParsedCheckInResponse);
        fetchData();
      } else {
        const error = await res.json();
        alert(`Parse failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error parsing:", error);
      alert("Failed to parse email");
    } finally {
      setIsParsing(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getResponseStatus = (checkIn: CheckIn) => {
    if (checkIn.respondedAt) {
      if (checkIn.riskLevel === "HIGH") {
        return { label: "Hired", color: "text-red-700", bgColor: "bg-red-100", icon: AlertTriangle };
      }
      if (checkIn.riskLevel === "MEDIUM") {
        return { label: "Review", color: "text-yellow-700", bgColor: "bg-yellow-100", icon: AlertCircle };
      }
      return { label: "Responded", color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle2 };
    }
    if (checkIn.sentAt) {
      const sentDate = new Date(checkIn.sentAt);
      const daysSinceSent = Math.floor((Date.now() - sentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceSent > 14) {
        return { label: "No Reply", color: "text-gray-700", bgColor: "bg-gray-100", icon: Clock };
      }
      return { label: "Pending", color: "text-blue-700", bgColor: "bg-blue-100", icon: Clock };
    }
    return { label: "Scheduled", color: "text-gray-500", bgColor: "bg-gray-50", icon: Calendar };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Check-in Management</h1>
          <p className="text-secondary-600">Monitor candidate check-in emails and responses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="primary" onClick={runScheduler} disabled={isRunningScheduler}>
            {isRunningScheduler ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run Scheduler
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Send className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{stats.last30Days.sent}</p>
                  <p className="text-sm text-secondary-600">Sent (30d)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">
                    {stats.last30Days.responded}
                    <span className="text-sm font-normal text-secondary-500 ml-1">
                      ({stats.last30Days.responseRate}%)
                    </span>
                  </p>
                  <p className="text-sm text-secondary-600">Responded</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{stats.overview.pending}</p>
                  <p className="text-sm text-secondary-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{stats.overview.noReply}</p>
                  <p className="text-sm text-secondary-600">No Reply</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{stats.overview.flagged}</p>
                  <p className="text-sm text-secondary-600">Flagged</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="flex gap-4">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending Response" },
            { id: "flagged", label: "Needs Review" },
            { id: "responded", label: "Responded" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                setPage(1);
              }}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-secondary-600 hover:text-secondary-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Check-ins Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-700">Candidate</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-700">Employer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-700">Check-in</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-700">Sent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-700">Response</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-secondary-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {checkIns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-secondary-500">
                    No check-ins found
                  </td>
                </tr>
              ) : (
                checkIns.map((checkIn) => {
                  const status = getResponseStatus(checkIn);
                  const StatusIcon = status.icon;
                  return (
                    <tr key={checkIn.id} className="hover:bg-secondary-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-secondary-900">{checkIn.candidateName}</p>
                          <p className="text-sm text-secondary-500">{checkIn.candidateEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-secondary-900">{checkIn.employerCompanyName}</p>
                          {checkIn.jobTitle && (
                            <p className="text-sm text-secondary-500">{checkIn.jobTitle}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">
                          {CHECK_IN_LABELS[checkIn.checkInNumber] || `#${checkIn.checkInNumber}`}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-600">
                        {formatDate(checkIn.sentAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                        {checkIn.flaggedForReview && (
                          <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-700">
                            Flagged
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDetail(checkIn)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {checkIn.sentAt && !checkIn.respondedAt && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => resendCheckIn(checkIn.id)}
                                disabled={isResending === checkIn.id}
                              >
                                {isResending === checkIn.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openParseModal(checkIn)}
                              >
                                <Bot className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-secondary-200 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-secondary-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {isDetailOpen && detailCheckIn && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsDetailOpen(false)} />

            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-secondary-900">Check-in Details</h2>
                <button onClick={() => setIsDetailOpen(false)} className="text-secondary-500 hover:text-secondary-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm font-medium text-secondary-700">Candidate</span>
                    </div>
                    <p className="font-semibold">{detailCheckIn.candidateName}</p>
                    <p className="text-sm text-secondary-600">{detailCheckIn.candidateEmail}</p>
                  </div>

                  <div className="bg-secondary-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm font-medium text-secondary-700">Employer</span>
                    </div>
                    <p className="font-semibold">{detailCheckIn.employerCompanyName}</p>
                    {detailCheckIn.jobTitle && (
                      <p className="text-sm text-secondary-600">{detailCheckIn.jobTitle}</p>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Check-in Type:</span>
                      <Badge variant="secondary">
                        {CHECK_IN_LABELS[detailCheckIn.checkInNumber]}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Scheduled For:</span>
                      <span>{formatDate(detailCheckIn.scheduledFor)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Sent At:</span>
                      <span>{formatDate(detailCheckIn.sentAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Responded At:</span>
                      <span>{formatDate(detailCheckIn.respondedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Response */}
                {detailCheckIn.respondedAt && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Response
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-secondary-600">Type:</span>
                        <Badge variant="secondary">{detailCheckIn.responseType || "Unknown"}</Badge>
                      </div>

                      {detailCheckIn.riskLevel && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-secondary-600">Risk Level:</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              RISK_CONFIG[detailCheckIn.riskLevel]?.bgColor || "bg-gray-100"
                            } ${RISK_CONFIG[detailCheckIn.riskLevel]?.color || "text-gray-700"}`}
                          >
                            {RISK_CONFIG[detailCheckIn.riskLevel]?.label || detailCheckIn.riskLevel}
                          </span>
                        </div>
                      )}

                      {detailCheckIn.riskReason && (
                        <div>
                          <span className="text-sm text-secondary-600">Risk Reason:</span>
                          <p className="mt-1 text-sm">{detailCheckIn.riskReason}</p>
                        </div>
                      )}

                      {detailCheckIn.responseParsed && (
                        <div>
                          <span className="text-sm text-secondary-600">Parsed Response:</span>
                          <pre className="mt-1 p-2 bg-secondary-50 rounded text-xs overflow-auto">
                            {JSON.stringify(detailCheckIn.responseParsed, null, 2)}
                          </pre>
                        </div>
                      )}

                      {detailCheckIn.responseRaw && (
                        <div>
                          <span className="text-sm text-secondary-600">Raw Response:</span>
                          <pre className="mt-1 p-2 bg-secondary-50 rounded text-xs overflow-auto max-h-32">
                            {detailCheckIn.responseRaw}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Admin Notes
                  </h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-20 px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Add notes..."
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => updateCheckIn(detailCheckIn.id, { reviewNotes: notes, markReviewed: true })}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Save & Mark Reviewed
                  </Button>
                </div>

                {/* Actions */}
                <div className="border-t pt-4 flex flex-wrap gap-2">
                  {!detailCheckIn.respondedAt && detailCheckIn.sentAt && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => resendCheckIn(detailCheckIn.id)}
                        disabled={isResending === detailCheckIn.id}
                      >
                        {isResending === detailCheckIn.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Resend Email
                      </Button>
                      <Button variant="outline" onClick={() => openParseModal(detailCheckIn)}>
                        <Bot className="h-4 w-4 mr-2" />
                        Parse Email Reply
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateCheckIn(detailCheckIn.id, { responseType: "no_response" })}
                        disabled={isUpdating}
                      >
                        Mark No Response
                      </Button>
                    </>
                  )}
                  {detailCheckIn.flaggedForReview && (
                    <Button
                      variant="outline"
                      onClick={() => updateCheckIn(detailCheckIn.id, { flaggedForReview: false })}
                      disabled={isUpdating}
                    >
                      Clear Flag
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parse Email Modal */}
      {isParseOpen && parseCheckIn && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsParseOpen(false)} />

            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-secondary-900">Parse Email Reply</h2>
                <button onClick={() => setIsParseOpen(false)} className="text-secondary-500 hover:text-secondary-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-secondary-50 rounded-lg p-3">
                  <p className="text-sm">
                    <strong>{parseCheckIn.candidateName}</strong> → {parseCheckIn.employerCompanyName}
                    <Badge variant="secondary" className="ml-2">
                      {CHECK_IN_LABELS[parseCheckIn.checkInNumber]}
                    </Badge>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Paste the candidate's email reply:
                  </label>
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    className="w-full h-40 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Paste email content here..."
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={parseEmailReply}
                  disabled={isParsing || !emailContent.trim()}
                  className="w-full"
                >
                  {isParsing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Bot className="h-4 w-4 mr-2" />
                  )}
                  Parse with AI
                </Button>

                {parseResult && (
                  <div className="border rounded-lg p-4 mt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      AI Analysis Result
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-secondary-600">Status:</span>
                        <Badge variant="secondary">{parseResult.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-secondary-600">Risk Level:</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            RISK_CONFIG[parseResult.riskLevel]?.bgColor || "bg-gray-100"
                          } ${RISK_CONFIG[parseResult.riskLevel]?.color || "text-gray-700"}`}
                        >
                          {RISK_CONFIG[parseResult.riskLevel]?.label || parseResult.riskLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-secondary-600">Confidence:</span>
                        <span>{Math.round(parseResult.confidence * 100)}%</span>
                      </div>
                      {parseResult.companyMentioned && (
                        <div className="flex items-center gap-2">
                          <span className="text-secondary-600">Company:</span>
                          <span>{parseResult.companyMentioned}</span>
                        </div>
                      )}
                      <div className="mt-2">
                        <span className="text-secondary-600">Summary:</span>
                        <p className="mt-1">{parseResult.summary}</p>
                      </div>
                      <div className="mt-2">
                        <span className="text-secondary-600">Suggested Action:</span>
                        <p className="mt-1 font-medium">{parseResult.suggestedAction}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setIsParseOpen(false);
                          fetchData();
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
