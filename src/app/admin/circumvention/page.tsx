"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Search,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Eye,
  Loader2,
  RefreshCw,
  ChevronDown,
  X,
  Calendar,
  Building2,
  User,
  Briefcase,
  AlertCircle,
  Flag,
  TrendingUp,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://job-portal-backend-production-cd05.up.railway.app";

// Types
interface CircumventionFlag {
  id: string;
  status: string;
  detectedAt: string;
  detectionMethod: string;
  evidence: Record<string, unknown>;
  estimatedSalary: string | null;
  estimatedFeeOwed: string | null;
  feePercentage: string | null;
  resolvedAt: string | null;
  resolution: string | null;
  resolutionNotes: string | null;
  invoiceSentAt: string | null;
  invoiceAmount: string | null;
  invoicePaidAt: string | null;
  introduction: {
    id: string;
    introducedAt: string | null;
    status: string;
    protectionExpiry?: string | null;
    checkIns?: Array<{
      id: string;
      checkInNumber: number;
      respondedAt: string | null;
      responseType: string | null;
      responseParsed: Record<string, unknown> | null;
      riskLevel: string | null;
    }>;
  };
  candidate: {
    id?: string;
    name: string;
    email: string;
  };
  employer: {
    id: string;
    companyName: string;
    email?: string;
    contactName?: string;
    contactEmail?: string;
  };
  job: {
    id?: string;
    title: string;
    salaryMin: string | null;
    salaryMax: string | null;
    description?: string;
  } | null;
  createdAt: string;
}

interface Stats {
  byStatus: {
    open: number;
    investigating: number;
    invoiceSent: number;
    paid: number;
    disputed: number;
    falsePositive: number;
    wroteOff: number;
  };
  total: number;
  actionRequired: number;
  recentFlags: number;
  revenue: {
    potential: string;
    collected: string;
    pending: string;
  };
  detectionMethods: Array<{
    method: string;
    count: number;
  }>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  OPEN: { label: "Open", color: "text-red-700", bgColor: "bg-red-100", icon: AlertTriangle },
  INVESTIGATING: { label: "Investigating", color: "text-yellow-700", bgColor: "bg-yellow-100", icon: Search },
  INVOICE_SENT: { label: "Invoice Sent", color: "text-blue-700", bgColor: "bg-blue-100", icon: Send },
  PAID: { label: "Paid", color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle2 },
  DISPUTED: { label: "Disputed", color: "text-orange-700", bgColor: "bg-orange-100", icon: AlertCircle },
  FALSE_POSITIVE: { label: "False Positive", color: "text-gray-700", bgColor: "bg-gray-100", icon: XCircle },
  WROTE_OFF: { label: "Wrote Off", color: "text-gray-700", bgColor: "bg-gray-100", icon: FileText },
};

export default function CircumventionPage() {
  const [flags, setFlags] = useState<CircumventionFlag[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState<CircumventionFlag | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Detail modal states
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailFlag, setDetailFlag] = useState<CircumventionFlag | null>(null);

  // Action states
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);

      const [flagsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/circumvention?${params}`, { credentials: "include" }),
        fetch(`${API_URL}/api/admin/circumvention/stats`, { credentials: "include" }),
      ]);

      if (flagsRes.ok) {
        const flagsData = await flagsRes.json();
        setFlags(flagsData.flags || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
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

  const openFlagDetail = async (flag: CircumventionFlag) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    setDetailFlag(null);
    setNotes(flag.resolutionNotes || "");
    setInvoiceAmount(flag.estimatedFeeOwed || "");

    try {
      const res = await fetch(`${API_URL}/api/admin/circumvention/${flag.id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setDetailFlag(data.flag);
        setNotes(data.flag.resolutionNotes || "");
        setInvoiceAmount(data.flag.estimatedFeeOwed || "");
      }
    } catch (error) {
      console.error("Error fetching flag detail:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const updateFlagStatus = async (flagId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/circumvention/${flagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus, resolutionNotes: notes }),
      });

      if (res.ok) {
        fetchData();
        if (detailFlag) {
          setDetailFlag({ ...detailFlag, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Error updating flag:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateFeeCalculation = async (flagId: string, salary: string, percentage: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/circumvention/${flagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          estimatedSalary: salary,
          feePercentage: percentage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        fetchData();
        if (detailFlag) {
          setDetailFlag({
            ...detailFlag,
            estimatedSalary: data.flag.estimatedSalary,
            estimatedFeeOwed: data.flag.estimatedFeeOwed,
            feePercentage: data.flag.feePercentage,
          });
          setInvoiceAmount(data.flag.estimatedFeeOwed || "");
        }
      }
    } catch (error) {
      console.error("Error updating fee:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const sendInvoice = async (flagId: string) => {
    if (!invoiceAmount || parseFloat(invoiceAmount) <= 0) {
      alert("Please enter a valid invoice amount");
      return;
    }

    setIsSendingInvoice(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/circumvention/${flagId}/send-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ invoiceAmount }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Invoice ${data.invoice.number} sent successfully for ${data.invoice.amount}`);
        fetchData();
        setIsDetailOpen(false);
      } else {
        const error = await res.json();
        alert(`Failed to send invoice: ${error.error}`);
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      alert("Failed to send invoice");
    } finally {
      setIsSendingInvoice(false);
    }
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return "N/A";
    const num = parseFloat(value);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.OPEN;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
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
          <h1 className="text-2xl font-bold text-secondary-900">Circumvention Monitoring</h1>
          <p className="text-secondary-600">Track potential fee circumvention and manage flags</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{stats.byStatus.open}</p>
                  <p className="text-sm text-secondary-600">Open Flags</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Search className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{stats.byStatus.investigating}</p>
                  <p className="text-sm text-secondary-600">Investigating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Send className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{stats.byStatus.invoiceSent}</p>
                  <p className="text-sm text-secondary-600">Invoice Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{formatCurrency(stats.revenue.potential)}</p>
                  <p className="text-sm text-secondary-600">Potential Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-secondary-700">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-secondary-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="INVOICE_SENT">Invoice Sent</option>
                <option value="PAID">Paid</option>
                <option value="DISPUTED">Disputed</option>
                <option value="FALSE_POSITIVE">False Positive</option>
                <option value="WROTE_OFF">Wrote Off</option>
              </select>
            </div>

            {stats && (
              <div className="ml-auto text-sm text-secondary-600">
                Showing {flags.length} of {stats.total} flags
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Flags List */}
      <div className="space-y-4">
        {flags.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Flag className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No flags found</h3>
              <p className="text-secondary-600">
                {statusFilter ? "Try changing the filter" : "No circumvention flags have been detected yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          flags.map((flag) => (
            <Card key={flag.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusBadge(flag.status)}
                      <span className="text-xs text-secondary-500">
                        Detected {formatDate(flag.detectedAt)} via {flag.detectionMethod.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                      {flag.candidate.name} → {flag.employer.companyName}
                    </h3>

                    {flag.job && (
                      <p className="text-sm text-secondary-600 mb-2">
                        Position: {flag.job.title}
                      </p>
                    )}

                    {flag.evidence && (
                      <div className="bg-secondary-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-secondary-700">
                          <strong>Evidence:</strong>{" "}
                          {typeof flag.evidence === "object" && flag.evidence.candidateResponse
                            ? String(flag.evidence.candidateResponse)
                            : typeof flag.evidence === "object" && flag.evidence.parsedResponse
                              ? `AI detected: ${(flag.evidence.parsedResponse as Record<string, unknown>).status}`
                              : "View details for more info"}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm">
                      {flag.estimatedFeeOwed && (
                        <span className="text-green-600 font-medium">
                          Est. Fee: {formatCurrency(flag.estimatedFeeOwed)}
                        </span>
                      )}
                      {flag.invoiceAmount && flag.invoiceSentAt && (
                        <span className="text-blue-600">
                          Invoiced: {formatCurrency(flag.invoiceAmount)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => openFlagDetail(flag)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {flag.status === "OPEN" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFlagStatus(flag.id, "INVESTIGATING")}
                        disabled={isUpdating}
                      >
                        <Search className="h-4 w-4 mr-1" />
                        Investigate
                      </Button>
                    )}
                    {(flag.status === "OPEN" || flag.status === "INVESTIGATING") && flag.estimatedFeeOwed && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setInvoiceAmount(flag.estimatedFeeOwed || "");
                          openFlagDetail(flag);
                        }}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send Invoice
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsDetailOpen(false)} />

            <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-secondary-900">Flag Details</h2>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="text-secondary-500 hover:text-secondary-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {detailLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                  </div>
                ) : detailFlag ? (
                  <div className="space-y-6">
                    {/* Status & Overview */}
                    <div className="flex items-center justify-between">
                      {getStatusBadge(detailFlag.status)}
                      <span className="text-sm text-secondary-500">
                        Flag ID: {detailFlag.id.slice(-8)}
                      </span>
                    </div>

                    {/* Candidate & Employer Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-secondary-500" />
                          <span className="text-sm font-medium text-secondary-700">Candidate</span>
                        </div>
                        <p className="font-semibold text-secondary-900">{detailFlag.candidate.name}</p>
                        <p className="text-sm text-secondary-600">{detailFlag.candidate.email}</p>
                      </div>

                      <div className="bg-secondary-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-4 w-4 text-secondary-500" />
                          <span className="text-sm font-medium text-secondary-700">Employer</span>
                        </div>
                        <p className="font-semibold text-secondary-900">{detailFlag.employer.companyName}</p>
                        <p className="text-sm text-secondary-600">{detailFlag.employer.contactEmail || detailFlag.employer.email}</p>
                      </div>
                    </div>

                    {/* Job Info */}
                    {detailFlag.job && (
                      <div className="bg-secondary-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-4 w-4 text-secondary-500" />
                          <span className="text-sm font-medium text-secondary-700">Position</span>
                        </div>
                        <p className="font-semibold text-secondary-900">{detailFlag.job.title}</p>
                        {(detailFlag.job.salaryMin || detailFlag.job.salaryMax) && (
                          <p className="text-sm text-secondary-600">
                            Salary: {formatCurrency(detailFlag.job.salaryMin)} - {formatCurrency(detailFlag.job.salaryMax)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Timeline
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary-600">Introduction Date:</span>
                          <span className="font-medium">{formatDate(detailFlag.introduction.introducedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-600">Detection Date:</span>
                          <span className="font-medium">{formatDate(detailFlag.detectedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-600">Protection Expires:</span>
                          <span className="font-medium">{formatDate(detailFlag.introduction.protectionExpiry || null)}</span>
                        </div>
                        {detailFlag.invoiceSentAt && (
                          <div className="flex justify-between">
                            <span className="text-secondary-600">Invoice Sent:</span>
                            <span className="font-medium">{formatDate(detailFlag.invoiceSentAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Evidence */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Evidence
                      </h3>
                      <div className="bg-secondary-50 rounded-lg p-3">
                        <p className="text-sm text-secondary-500 mb-2">
                          Detection Method: <span className="font-medium">{detailFlag.detectionMethod.replace(/_/g, " ")}</span>
                        </p>
                        <pre className="text-xs text-secondary-700 whitespace-pre-wrap overflow-auto max-h-40">
                          {JSON.stringify(detailFlag.evidence, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Fee Calculation */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Fee Calculation
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-secondary-600 mb-1">Estimated Salary</label>
                          <Input
                            type="number"
                            value={detailFlag.estimatedSalary || ""}
                            onChange={(e) =>
                              setDetailFlag({ ...detailFlag, estimatedSalary: e.target.value })
                            }
                            placeholder="e.g., 150000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-secondary-600 mb-1">Fee %</label>
                          <Input
                            type="number"
                            value={detailFlag.feePercentage || "18"}
                            onChange={(e) =>
                              setDetailFlag({ ...detailFlag, feePercentage: e.target.value })
                            }
                            placeholder="e.g., 18"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-secondary-600 mb-1">Estimated Fee</label>
                          <div className="px-3 py-2 bg-green-50 rounded-lg text-green-700 font-semibold">
                            {formatCurrency(detailFlag.estimatedFeeOwed)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() =>
                          updateFeeCalculation(
                            detailFlag.id,
                            detailFlag.estimatedSalary || "",
                            detailFlag.feePercentage || "18"
                          )
                        }
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                        Recalculate
                      </Button>
                    </div>

                    {/* Notes */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-secondary-900 mb-3">Notes</h3>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full h-24 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        placeholder="Add investigation notes..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          updateFlagStatus(detailFlag.id, detailFlag.status)
                        }
                        disabled={isUpdating}
                      >
                        Save Notes
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-secondary-900 mb-3">Actions</h3>
                      <div className="flex flex-wrap gap-3">
                        {detailFlag.status === "OPEN" && (
                          <Button
                            variant="outline"
                            onClick={() => updateFlagStatus(detailFlag.id, "INVESTIGATING")}
                            disabled={isUpdating}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Mark Investigating
                          </Button>
                        )}

                        {(detailFlag.status === "OPEN" || detailFlag.status === "INVESTIGATING") && (
                          <>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={invoiceAmount}
                                onChange={(e) => setInvoiceAmount(e.target.value)}
                                placeholder="Invoice amount"
                                className="w-32"
                              />
                              <Button
                                variant="primary"
                                onClick={() => sendInvoice(detailFlag.id)}
                                disabled={isSendingInvoice || !invoiceAmount}
                              >
                                {isSendingInvoice ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Send className="h-4 w-4 mr-2" />
                                )}
                                Send Invoice
                              </Button>
                            </div>

                            <Button
                              variant="outline"
                              onClick={() => updateFlagStatus(detailFlag.id, "FALSE_POSITIVE")}
                              disabled={isUpdating}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              False Positive
                            </Button>
                          </>
                        )}

                        {detailFlag.status === "INVOICE_SENT" && (
                          <>
                            <Button
                              variant="primary"
                              onClick={() => updateFlagStatus(detailFlag.id, "PAID")}
                              disabled={isUpdating}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Mark Paid
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateFlagStatus(detailFlag.id, "DISPUTED")}
                              disabled={isUpdating}
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Mark Disputed
                            </Button>
                          </>
                        )}

                        {detailFlag.status === "DISPUTED" && (
                          <>
                            <Button
                              variant="primary"
                              onClick={() => updateFlagStatus(detailFlag.id, "PAID")}
                              disabled={isUpdating}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Resolved - Paid
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateFlagStatus(detailFlag.id, "WROTE_OFF")}
                              disabled={isUpdating}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Write Off
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600">Failed to load flag details</p>
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
