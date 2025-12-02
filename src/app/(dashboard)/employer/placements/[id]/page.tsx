"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import Link from "next/link";
import { api } from "@/lib/api";

export default function PlacementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [placement, setPlacement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [replacementData, setReplacementData] = useState({
    lastDayWorked: "",
    reason: "",
  });
  const [isSubmittingReplacement, setIsSubmittingReplacement] = useState(false);
  const [replacementError, setReplacementError] = useState("");

  const placementId = params.id as string;

  // Redirect if not logged in or not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/placements/" + placementId);
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router, placementId]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "EMPLOYER") {
      fetchPlacement();
    }
  }, [status, session, placementId]);

  const fetchPlacement = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/placements/${placementId}`);
      // The backend returns { placement: { ...placementData } }
      setPlacement(response.data.placement);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to load placement details");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="warning" size="lg">
            <Clock className="w-4 h-4 mr-2" />
            Pending Probation
          </Badge>
        );
      case "ACTIVE":
        return (
          <Badge variant="primary" size="lg">
            <TrendingUp className="w-4 h-4 mr-2" />
            Active Placement
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="success" size="lg">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completed
          </Badge>
        );
      case "REPLACEMENT_REQUESTED":
        return (
          <Badge variant="warning" size="lg">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Replacement Requested
          </Badge>
        );
      case "SEEKING_REPLACEMENT":
        return (
          <Badge variant="warning" size="lg">
            <Clock className="w-4 h-4 mr-2" />
            Seeking Replacement
          </Badge>
        );
      default:
        return <Badge variant="secondary" size="lg">{status}</Badge>;
    }
  };

  const isWithinGuaranteePeriod = () => {
    if (!placement?.guaranteeEndDate) return false;
    return new Date() <= new Date(placement.guaranteeEndDate);
  };

  const canRequestReplacement = () => {
    return (
      placement &&
      isWithinGuaranteePeriod() &&
      !placement.replacementRequested &&
      (placement.status === "ACTIVE" || placement.status === "PENDING")
    );
  };

  const handleReplacementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplacementError("");
    setIsSubmittingReplacement(true);

    try {
      const response = await fetch(`/api/placements/${placementId}/replacement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastDayWorked: replacementData.lastDayWorked,
          reason: replacementData.reason,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit replacement request");
      }

      // Refresh placement data
      await fetchPlacement();
      setShowReplacementModal(false);
      setReplacementData({ lastDayWorked: "", reason: "" });
    } catch (err: any) {
      setReplacementError(err.message || "Failed to submit replacement request");
    } finally {
      setIsSubmittingReplacement(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading placement details...</p>
        </div>
      </div>
    );
  }

  if (error || !placement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Placement Not Found
              </h1>
              <p className="text-secondary-600 mb-6">{error}</p>
              <Link href="/employer/placements">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Placements
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container">
        {/* Back Button */}
        <Link href="/employer/placements" className="inline-block mb-6">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Placements
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Placement Details
              </h1>
              <p className="text-secondary-600">
                Placement ID: {placement.id.slice(0, 8)}
              </p>
            </div>
            {getStatusBadge(placement.status)}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Candidate Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary-600 mb-1">Full Name</p>
                    <p className="text-lg font-medium text-secondary-900">
                      {placement.candidate.user.name}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-secondary-600 mb-1 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </p>
                      <p className="text-secondary-900">
                        {placement.candidate.user.email}
                      </p>
                    </div>

                    {placement.candidate.phone && (
                      <div>
                        <p className="text-sm text-secondary-600 mb-1 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone
                        </p>
                        <p className="text-secondary-900">
                          {placement.candidate.phone}
                        </p>
                      </div>
                    )}

                    {placement.candidate.location && (
                      <div>
                        <p className="text-sm text-secondary-600 mb-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </p>
                        <p className="text-secondary-900">
                          {placement.candidate.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Job Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary-600 mb-1">Position</p>
                    <p className="text-lg font-medium text-secondary-900">
                      {placement.job.title}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-secondary-600 mb-1">Niche</p>
                      <Badge variant="secondary">{placement.job.niche}</Badge>
                    </div>

                    <div>
                      <p className="text-sm text-secondary-600 mb-1">
                        Experience Level
                      </p>
                      <Badge variant="secondary">
                        {placement.job.experienceLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-accent-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-accent-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Timeline
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-secondary-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">
                        Placement Created
                      </p>
                      <p className="text-sm text-secondary-600">
                        {new Date(placement.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-4 border-b border-secondary-200">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">Start Date</p>
                      <p className="text-sm text-secondary-600">
                        {new Date(placement.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">
                        Probation End Date
                      </p>
                      <p className="text-sm text-secondary-600">
                        {new Date(placement.probationEndDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Financial Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Financial Details
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <p className="text-sm text-secondary-600 mb-1">
                      Placement Fee
                    </p>
                    <p className="text-3xl font-bold text-secondary-900">
                      ${(placement.placementFee / 100).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Fee Type:</span>
                      <span className="font-medium text-secondary-900">
                        Success-Based
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Fee %:</span>
                      <span className="font-medium text-secondary-900">
                        {placement.feePercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guarantee Period Info */}
            {placement.guaranteeEndDate && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-secondary-900 mb-4">
                    Guarantee Period
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-secondary-600 mb-1">
                        Ends On
                      </p>
                      <p className="text-sm font-medium text-secondary-900">
                        {new Date(placement.guaranteeEndDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    {isWithinGuaranteePeriod() && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-800 font-medium">
                          ✓ Guarantee Active
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          You can request a replacement if needed
                        </p>
                      </div>
                    )}
                    {!isWithinGuaranteePeriod() && (
                      <div className="p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                        <p className="text-xs text-secondary-600">
                          Guarantee period has expired
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-secondary-900 mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  {canRequestReplacement() && (
                    <Button
                      variant="danger"
                      className="w-full"
                      onClick={() => setShowReplacementModal(true)}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Report Early Termination
                    </Button>
                  )}
                  {placement.replacementRequested && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-xs text-yellow-800 font-medium mb-1">
                        ⏳ Replacement Requested
                      </p>
                      <p className="text-xs text-yellow-600">
                        Your request is under review
                      </p>
                    </div>
                  )}
                  <Link href="/employer/invoices" className="block">
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      View Invoices
                    </Button>
                  </Link>
                  <Link
                    href={`/employer/jobs/${placement.job.id}`}
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      <Briefcase className="w-4 h-4 mr-2" />
                      View Job Posting
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Replacement Request Modal */}
        {showReplacementModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                      Request Replacement
                    </h2>
                    <p className="text-sm text-secondary-600">
                      Report early termination and request a replacement candidate
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReplacementModal(false)}
                    className="text-secondary-400 hover:text-secondary-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Warning */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900 mb-1">
                        Important Information
                      </p>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>• Refund eligibility depends on days worked</li>
                        <li>• 0-30 days: 100% refund + free replacement</li>
                        <li>• 31-60 days: 50% refund + free replacement</li>
                        <li>• 61-90 days: Free replacement only</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {replacementError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{replacementError}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleReplacementSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-2">
                      Last Day Worked <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={replacementData.lastDayWorked}
                      onChange={(e) =>
                        setReplacementData({
                          ...replacementData,
                          lastDayWorked: e.target.value,
                        })
                      }
                      max={new Date().toISOString().split("T")[0]}
                      min={
                        placement?.startDate
                          ? new Date(placement.startDate)
                              .toISOString()
                              .split("T")[0]
                          : undefined
                      }
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-secondary-500 mt-1">
                      Enter the candidate's last working day
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-2">
                      Reason for Termination <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={replacementData.reason}
                      onChange={(e) =>
                        setReplacementData({
                          ...replacementData,
                          reason: e.target.value,
                        })
                      }
                      rows={6}
                      placeholder="Please provide detailed information about why the placement didn't work out..."
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-secondary-500 mt-1">
                      This information helps us find a better match for your next candidate
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReplacementModal(false)}
                      disabled={isSubmittingReplacement}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="danger"
                      disabled={isSubmittingReplacement}
                    >
                      {isSubmittingReplacement ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Submit Request
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
