"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Loader2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  X,
  Check,
  XCircle,
  Shield,
  CreditCard,
  Calendar,
  Timer,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function AdminPlacementsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [placements, setPlacements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [guaranteeFilter, setGuaranteeFilter] = useState("all");

  // Payment modal state
  const [paymentType, setPaymentType] = useState<"upfront" | "remaining" | "full">("upfront");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [transactionId, setTransactionId] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/placements");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchPlacements();
    }
  }, [status, session, statusFilter, guaranteeFilter]);

  const fetchPlacements = async () => {
    setIsLoading(true);
    try {
      let url = "/api/admin/placements?";
      if (statusFilter !== "all") url += `status=${statusFilter}&`;
      if (guaranteeFilter !== "all") url += `guaranteeStatus=${guaranteeFilter}&`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch placements");

      const data = await response.json();
      setPlacements(data.placements || []);
      setSummary(data.summary || null);
    } catch (error) {
      console.error("Failed to fetch placements:", error);
      // Fallback to old endpoint
      try {
        const fallbackResponse = await fetch("/api/placements");
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          setPlacements(data.placements || []);
        }
      } catch (e) {
        console.error("Fallback also failed:", e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "CONFIRMED":
        return <Badge variant="primary" size="sm"><TrendingUp className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case "COMPLETED":
        return <Badge variant="success" size="sm"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="danger" size="sm"><AlertCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      case "REPLACEMENT_REQUESTED":
        return <Badge variant="warning" size="sm"><AlertTriangle className="w-3 h-3 mr-1" />Replacement Requested</Badge>;
      case "SEEKING_REPLACEMENT":
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3 mr-1" />Seeking Replacement</Badge>;
      case "REPLACED":
        return <Badge variant="secondary" size="sm">Replaced</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  const getPaymentBadge = (payment: any) => {
    if (!payment) return null;
    switch (payment.status) {
      case "FULLY_PAID":
        return <Badge variant="success" size="sm"><CheckCircle2 className="w-3 h-3 mr-1" />Paid</Badge>;
      case "UPFRONT_PAID":
        return <Badge variant="primary" size="sm"><CreditCard className="w-3 h-3 mr-1" />{payment.progress}%</Badge>;
      case "PENDING":
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "FAILED":
        return <Badge variant="danger" size="sm"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{payment.status}</Badge>;
    }
  };

  const getGuaranteeBadge = (guarantee: any) => {
    if (!guarantee) return null;
    switch (guarantee.status) {
      case "active":
        return (
          <Badge variant="primary" size="sm">
            <Shield className="w-3 h-3 mr-1" />{guarantee.daysRemaining}d left
          </Badge>
        );
      case "expiring_soon":
        return (
          <Badge variant="warning" size="sm">
            <Timer className="w-3 h-3 mr-1" />{guarantee.daysRemaining}d left!
          </Badge>
        );
      case "expired":
        return <Badge variant="danger" size="sm"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      case "completed":
        return <Badge variant="success" size="sm"><CheckCircle2 className="w-3 h-3 mr-1" />Complete</Badge>;
      default:
        return null;
    }
  };

  const openReviewModal = (placement: any) => {
    setSelectedPlacement(placement);
    setShowReviewModal(true);
    setReviewAction("approve");
    setReviewNotes("");
    setReviewError("");
  };

  const openPaymentModal = (placement: any) => {
    setSelectedPlacement(placement);
    setShowPaymentModal(true);
    setPaymentError("");
    setTransactionId("");
    setPaymentNotes("");

    // Set default payment type based on current status
    if (placement.payment?.status === "PENDING") {
      setPaymentType("upfront");
    } else if (placement.payment?.status === "UPFRONT_PAID") {
      setPaymentType("remaining");
    } else {
      setPaymentType("full");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    setIsSubmittingReview(true);

    try {
      const response = await fetch(`/api/placements/${selectedPlacement.id}/replacement`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: reviewAction,
          notes: reviewNotes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to process replacement request");
      }

      await fetchPlacements();
      setShowReviewModal(false);
      setSelectedPlacement(null);
    } catch (err: any) {
      setReviewError(err.message || "Failed to process replacement request");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");
    setIsRecordingPayment(true);

    try {
      const response = await fetch(`/api/admin/placements/${selectedPlacement.id}/record-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentType,
          paymentMethod,
          transactionId: transactionId || undefined,
          notes: paymentNotes || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to record payment");
      }

      await fetchPlacements();
      setShowPaymentModal(false);
      setSelectedPlacement(null);
    } catch (err: any) {
      setPaymentError(err.message || "Failed to record payment");
    } finally {
      setIsRecordingPayment(false);
    }
  };

  const calculateRefund = (placement: any) => {
    const daysWorked = placement?.replacement?.daysWorked || placement?.replacementDaysWorked || 0;
    const fee = placement?.payment?.placementFee || placement?.placementFee || 0;

    if (daysWorked <= 30) return fee / 100;
    if (daysWorked <= 60) return Math.round(fee * 0.5) / 100;
    return 0;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Placements & Revenue
          </h1>
          <p className="text-secondary-600">
            Track successful placements, guarantee periods, and financial performance
          </p>

          {/* Filter Tabs */}
          <div className="mt-4 space-y-3">
            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-secondary-600 py-1">Status:</span>
              <Button
                variant={statusFilter === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "PENDING" ? "primary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("PENDING")}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "CONFIRMED" ? "primary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("CONFIRMED")}
              >
                Confirmed
              </Button>
              <Button
                variant={statusFilter === "COMPLETED" ? "primary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("COMPLETED")}
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === "REPLACEMENT_REQUESTED" ? "primary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("REPLACEMENT_REQUESTED")}
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Replacements
              </Button>
            </div>

            {/* Guarantee Filters */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-secondary-600 py-1">Guarantee:</span>
              <Button
                variant={guaranteeFilter === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setGuaranteeFilter("all")}
              >
                All
              </Button>
              <Button
                variant={guaranteeFilter === "active" ? "primary" : "outline"}
                size="sm"
                onClick={() => setGuaranteeFilter("active")}
              >
                <Shield className="w-4 h-4 mr-1" />
                Active
              </Button>
              <Button
                variant={guaranteeFilter === "expiring_soon" ? "primary" : "outline"}
                size="sm"
                onClick={() => setGuaranteeFilter("expiring_soon")}
              >
                <Timer className="w-4 h-4 mr-1" />
                Expiring Soon
              </Button>
              <Button
                variant={guaranteeFilter === "completed" ? "primary" : "outline"}
                size="sm"
                onClick={() => setGuaranteeFilter("completed")}
              >
                Completed
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-secondary-600 mb-1">Total Placements</p>
                <p className="text-2xl font-bold text-secondary-900">{summary.total || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-secondary-600 mb-1">Revenue Collected</p>
                <p className="text-2xl font-bold text-green-600">{summary.revenue?.collectedFormatted || "$0"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-secondary-600 mb-1">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.revenue?.pendingFormatted || "$0"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-secondary-600 mb-1">Active Guarantees</p>
                <p className="text-2xl font-bold text-primary-600">{summary.guarantee?.active || 0}</p>
              </CardContent>
            </Card>
            <Card className={summary.guarantee?.expiringSoon > 0 ? "border-yellow-300 bg-yellow-50" : ""}>
              <CardContent className="p-4">
                <p className="text-xs text-secondary-600 mb-1">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.guarantee?.expiringSoon || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-secondary-600 mb-1">Fully Paid</p>
                <p className="text-2xl font-bold text-green-600">{summary.byPayment?.fullyPaid || 0}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Placements Table */}
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-3 text-sm font-semibold text-secondary-900">Candidate</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-secondary-900">Company</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-secondary-900">Position</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-secondary-900">Fee</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-secondary-900">Status</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-secondary-900">Payment</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-secondary-900">Guarantee</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-secondary-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {placements.map((placement) => (
                    <tr key={placement.id} className="hover:bg-secondary-50">
                      <td className="py-3 px-3">
                        <p className="font-medium text-secondary-900 text-sm">
                          {placement.candidate?.name || placement.candidate?.user?.name}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-sm text-secondary-700">{placement.companyName}</p>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-sm text-secondary-700">{placement.jobTitle}</p>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-sm font-bold text-primary-600">
                          {placement.payment?.placementFeeFormatted || `$${(placement.placementFee / 100).toLocaleString()}`}
                        </p>
                      </td>
                      <td className="py-3 px-3">{getStatusBadge(placement.status)}</td>
                      <td className="py-3 px-3">{getPaymentBadge(placement.payment || { status: placement.paymentStatus })}</td>
                      <td className="py-3 px-3">{getGuaranteeBadge(placement.guarantee)}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          {/* Record Payment Button */}
                          {(placement.payment?.status !== "FULLY_PAID" && placement.paymentStatus !== "FULLY_PAID") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openPaymentModal(placement)}
                              title="Record Payment"
                            >
                              <CreditCard className="w-4 h-4" />
                            </Button>
                          )}
                          {/* Review Replacement Button */}
                          {(placement.replacement?.requested || placement.replacementRequested) &&
                            placement.replacement?.approved === null &&
                            placement.replacementApproved === null && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => openReviewModal(placement)}
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </Button>
                          )}
                          {/* View Details Button */}
                          <Button variant="ghost" size="sm" title="View Details">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {placements.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600">No placements found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Recording Modal */}
        {showPaymentModal && selectedPlacement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-secondary-900 mb-1">Record Payment</h2>
                    <p className="text-sm text-secondary-600">
                      {selectedPlacement.candidate?.name} - {selectedPlacement.jobTitle}
                    </p>
                  </div>
                  <button onClick={() => setShowPaymentModal(false)} className="text-secondary-400 hover:text-secondary-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Payment Summary */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-secondary-600">Total Fee</p>
                      <p className="font-bold text-secondary-900">
                        {selectedPlacement.payment?.placementFeeFormatted || `$${((selectedPlacement.placementFee || 0) / 100).toLocaleString()}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-600">Upfront ({selectedPlacement.payment?.upfront?.percentage || 50}%)</p>
                      <p className="font-bold text-secondary-900">
                        {selectedPlacement.payment?.upfront?.amountFormatted || `$${((selectedPlacement.upfrontAmount || 0) / 100).toLocaleString()}`}
                        {selectedPlacement.payment?.upfront?.paid && " (Paid)"}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-600">Remaining ({selectedPlacement.payment?.remaining?.percentage || 50}%)</p>
                      <p className="font-bold text-secondary-900">
                        {selectedPlacement.payment?.remaining?.amountFormatted || `$${((selectedPlacement.remainingAmount || 0) / 100).toLocaleString()}`}
                        {selectedPlacement.payment?.remaining?.paid && " (Paid)"}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-600">Current Status</p>
                      <p className="font-bold text-secondary-900">
                        {selectedPlacement.payment?.status || selectedPlacement.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>

                {paymentError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{paymentError}</p>
                  </div>
                )}

                <form onSubmit={handleRecordPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-2">Payment Type</label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="upfront" disabled={selectedPlacement.payment?.upfront?.paid}>
                        Upfront Payment ({selectedPlacement.payment?.upfront?.amountFormatted || `$${((selectedPlacement.upfrontAmount || 0) / 100).toLocaleString()}`})
                      </option>
                      <option value="remaining" disabled={!selectedPlacement.payment?.upfront?.paid || selectedPlacement.payment?.remaining?.paid}>
                        Remaining Payment ({selectedPlacement.payment?.remaining?.amountFormatted || `$${((selectedPlacement.remainingAmount || 0) / 100).toLocaleString()}`})
                      </option>
                      <option value="full" disabled={selectedPlacement.payment?.status === "FULLY_PAID"}>
                        Full Payment ({selectedPlacement.payment?.placementFeeFormatted || `$${((selectedPlacement.placementFee || 0) / 100).toLocaleString()}`})
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-2">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="wire">Wire Transfer</option>
                      <option value="check">Check</option>
                      <option value="stripe">Stripe</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-2">Transaction ID (Optional)</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g., TXN123456"
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-2">Notes (Optional)</label>
                    <textarea
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      rows={2}
                      placeholder="Any additional notes..."
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setShowPaymentModal(false)} disabled={isRecordingPayment}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isRecordingPayment}>
                      {isRecordingPayment ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Recording...</>
                      ) : (
                        <><CreditCard className="w-4 h-4 mr-2" />Record Payment</>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Replacement Review Modal */}
        {showReviewModal && selectedPlacement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">Review Replacement Request</h2>
                    <p className="text-sm text-secondary-600">Approve or reject the replacement request</p>
                  </div>
                  <button onClick={() => setShowReviewModal(false)} className="text-secondary-400 hover:text-secondary-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Placement Details */}
                <div className="mb-6 grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-secondary-600 mb-1">Candidate</p>
                    <p className="font-medium text-secondary-900">
                      {selectedPlacement.candidate?.name || selectedPlacement.candidate?.user?.name}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-secondary-600 mb-1">Company</p>
                    <p className="font-medium text-secondary-900">{selectedPlacement.companyName}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-secondary-600 mb-1">Position</p>
                    <p className="font-medium text-secondary-900">{selectedPlacement.jobTitle}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-secondary-600 mb-1">Days Worked</p>
                    <p className="font-medium text-secondary-900">
                      {selectedPlacement.replacement?.daysWorked || selectedPlacement.replacementDaysWorked || 0} days
                    </p>
                  </div>
                </div>

                {/* Replacement Details */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900 mb-2">Termination Details</p>
                  <div className="text-sm space-y-1">
                    <p className="text-yellow-800">
                      <strong>Reason:</strong> {selectedPlacement.replacement?.reason || selectedPlacement.replacementReason || "No reason provided"}
                    </p>
                  </div>
                </div>

                {/* Refund Calculation */}
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-2">Refund Calculation</p>
                  <div className="text-sm">
                    <p className="text-green-800">
                      <strong>Estimated Refund:</strong> ${calculateRefund(selectedPlacement).toLocaleString()}
                    </p>
                  </div>
                </div>

                {reviewError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{reviewError}</p>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-3">Decision</label>
                    <div className="flex gap-4">
                      <label className="flex-1">
                        <input
                          type="radio"
                          name="decision"
                          value="approve"
                          checked={reviewAction === "approve"}
                          onChange={(e) => setReviewAction(e.target.value as "approve")}
                          className="sr-only peer"
                        />
                        <div className="p-4 border-2 border-secondary-200 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50">
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-secondary-900">Approve</p>
                              <p className="text-xs text-secondary-600">Process refund and seek replacement</p>
                            </div>
                          </div>
                        </div>
                      </label>
                      <label className="flex-1">
                        <input
                          type="radio"
                          name="decision"
                          value="reject"
                          checked={reviewAction === "reject"}
                          onChange={(e) => setReviewAction(e.target.value as "reject")}
                          className="sr-only peer"
                        />
                        <div className="p-4 border-2 border-secondary-200 rounded-lg cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-50">
                          <div className="flex items-center gap-3">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="font-medium text-secondary-900">Reject</p>
                              <p className="text-xs text-secondary-600">Deny replacement request</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-2">
                      Admin Notes {reviewAction === "reject" && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      required={reviewAction === "reject"}
                      rows={3}
                      placeholder={reviewAction === "approve" ? "Optional notes..." : "Reason for rejection..."}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setShowReviewModal(false)} disabled={isSubmittingReview}>
                      Cancel
                    </Button>
                    <Button type="submit" variant={reviewAction === "approve" ? "primary" : "danger"} disabled={isSubmittingReview}>
                      {isSubmittingReview ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                      ) : reviewAction === "approve" ? (
                        <><Check className="w-4 h-4 mr-2" />Approve</>
                      ) : (
                        <><XCircle className="w-4 h-4 mr-2" />Reject</>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
