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
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function AdminPlacementsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [placements, setPlacements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      fetchStats();
    }
  }, [status, session, statusFilter]);

  const fetchPlacements = async () => {
    setIsLoading(true);
    try {
      const url = statusFilter === "all"
        ? "/api/placements"
        : `/api/placements?status=${statusFilter}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch placements");

      const data = await response.json();
      setPlacements(data.placements || []);
    } catch (error) {
      console.error("Failed to fetch placements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/placements/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
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

  const openReviewModal = (placement: any) => {
    setSelectedPlacement(placement);
    setShowReviewModal(true);
    setReviewAction("approve");
    setReviewNotes("");
    setReviewError("");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    setIsSubmittingReview(true);

    try {
      const response = await fetch(`/api/placements/${selectedPlacement.id}/replacement`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: reviewAction,
          notes: reviewNotes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to process replacement request");
      }

      // Refresh placements
      await fetchPlacements();
      setShowReviewModal(false);
      setSelectedPlacement(null);
    } catch (err: any) {
      setReviewError(err.message || "Failed to process replacement request");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const calculateRefund = (placement: any) => {
    if (!placement?.replacementDaysWorked || !placement?.placementFee) return 0;
    const daysWorked = placement.replacementDaysWorked;
    const fee = placement.placementFee;

    if (daysWorked <= 30) {
      return fee / 100; // 100% refund
    } else if (daysWorked <= 60) {
      return Math.round(fee * 0.5) / 100; // 50% refund
    }
    return 0; // No refund, free replacement only
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
            Track successful placements and financial performance
          </p>

          {/* Status Filter Tabs */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All Placements
            </Button>
            <Button
              variant={statusFilter === "REPLACEMENT_REQUESTED" ? "primary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("REPLACEMENT_REQUESTED")}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Replacement Requests
            </Button>
            <Button
              variant={statusFilter === "SEEKING_REPLACEMENT" ? "primary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("SEEKING_REPLACEMENT")}
            >
              Seeking Replacement
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
          </div>
        </div>

        {/* Financial Stats */}
        {stats && (
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Total Placements</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {stats.totalPlacements || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Total Fees</p>
                <p className="text-3xl font-bold text-primary-600">
                  ${(stats.totalFees || 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Paid Fees</p>
                <p className="text-3xl font-bold text-green-600">
                  ${(stats.paidFees || 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Pending Payments</p>
                <p className="text-3xl font-bold text-yellow-600">
                  ${(stats.pendingFees || 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Monthly Revenue</p>
                <p className="text-3xl font-bold text-accent-600">
                  ${(stats.monthlyRevenue || 0).toLocaleString()}
                </p>
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Candidate
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Employer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Job Title
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Salary
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Fee Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Start Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {placements.map((placement) => (
                    <tr key={placement.id} className="hover:bg-secondary-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-secondary-900">
                          {placement.candidate?.user?.name}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-secondary-900">
                          {placement.employer?.companyName}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-secondary-900">
                          {placement.job?.title}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold text-secondary-900">
                          ${placement.salary?.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-bold text-primary-600">
                          ${placement.placementFee?.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(placement.status)}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-secondary-900">
                          {placement.startDate
                            ? new Date(placement.startDate).toLocaleDateString()
                            : "TBD"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        {placement.replacementRequested && !placement.replacementApproved && placement.replacementApproved !== false ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openReviewModal(placement)}
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {placements.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600">
                  {statusFilter === "all" ? "No placements yet" : `No ${statusFilter.toLowerCase().replace(/_/g, ' ')} placements`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Replacement Review Modal */}
        {showReviewModal && selectedPlacement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                      Review Replacement Request
                    </h2>
                    <p className="text-sm text-secondary-600">
                      Approve or reject the replacement request and calculate refund
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="text-secondary-400 hover:text-secondary-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Placement Details */}
                <div className="mb-6 grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-secondary-600 mb-1">Candidate</p>
                    <p className="font-medium text-secondary-900">
                      {selectedPlacement.candidate?.user?.name}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-secondary-600 mb-1">Employer</p>
                    <p className="font-medium text-secondary-900">
                      {selectedPlacement.employer?.companyName}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-secondary-600 mb-1">Position</p>
                    <p className="font-medium text-secondary-900">
                      {selectedPlacement.job?.title}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-secondary-600 mb-1">Days Worked</p>
                    <p className="font-medium text-secondary-900">
                      {selectedPlacement.replacementDaysWorked || 0} days
                    </p>
                  </div>
                </div>

                {/* Replacement Details */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900 mb-2">
                    Termination Details
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-yellow-700">Last Day Worked:</span>
                      <span className="font-medium text-yellow-900">
                        {selectedPlacement.replacementLastDayWorked
                          ? new Date(selectedPlacement.replacementLastDayWorked).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-700">Requested:</span>
                      <span className="font-medium text-yellow-900">
                        {selectedPlacement.replacementRequestedAt
                          ? new Date(selectedPlacement.replacementRequestedAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-yellow-300">
                    <p className="text-xs text-yellow-700 mb-1">Reason:</p>
                    <p className="text-sm text-yellow-900">
                      {selectedPlacement.replacementReason || "No reason provided"}
                    </p>
                  </div>
                </div>

                {/* Refund Calculation */}
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-3">
                    Refund Calculation
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Original Placement Fee:</span>
                      <span className="font-medium text-green-900">
                        ${((selectedPlacement.placementFee || 0) / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Days Worked:</span>
                      <span className="font-medium text-green-900">
                        {selectedPlacement.replacementDaysWorked || 0} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Refund %:</span>
                      <span className="font-medium text-green-900">
                        {selectedPlacement.replacementDaysWorked <= 30
                          ? "100%"
                          : selectedPlacement.replacementDaysWorked <= 60
                          ? "50%"
                          : "0%"}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-green-300 flex justify-between">
                      <span className="font-semibold text-green-800">Refund Amount:</span>
                      <span className="text-lg font-bold text-green-900">
                        ${calculateRefund(selectedPlacement).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {reviewError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{reviewError}</p>
                  </div>
                )}

                {/* Review Form */}
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-3">
                      Decision <span className="text-red-500">*</span>
                    </label>
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
                        <div className="p-4 border-2 border-secondary-200 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-secondary-50 transition-colors">
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
                        <div className="p-4 border-2 border-secondary-200 rounded-lg cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-50 hover:bg-secondary-50 transition-colors">
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
                      rows={4}
                      placeholder={
                        reviewAction === "approve"
                          ? "Optional notes about the approval..."
                          : "Please provide a reason for rejection..."
                      }
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReviewModal(false)}
                      disabled={isSubmittingReview}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant={reviewAction === "approve" ? "primary" : "danger"}
                      disabled={isSubmittingReview}
                    >
                      {isSubmittingReview ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {reviewAction === "approve" ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Approve Request
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject Request
                            </>
                          )}
                        </>
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
