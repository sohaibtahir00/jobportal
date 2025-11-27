"use client";

import { useState, useEffect } from "react";
import {
  Gift,
  DollarSign,
  Calendar,
  Building2,
  MapPin,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  X,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";
import { format } from "date-fns";

interface Offer {
  id: string;
  position: string;
  salary: number;
  equity?: number;
  signingBonus?: number;
  benefits: string[];
  startDate: string;
  expiresAt: string;
  status: string;
  customMessage?: string;
  offerLetter?: string;
  respondedAt?: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    type: string;
  };
  employer: {
    companyName: string;
    companyLogo?: string;
  };
  application: {
    id: string;
    appliedAt: string;
  };
}

export default function CandidateOffersPage() {
  const { showToast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter states
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "declined">("all");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      console.log("🎯 [Offers] Fetching offers from API...");
      const response = await api.get("/api/offers");
      console.log("✅ [Offers] Received response:", response.data);
      setOffers(response.data.offers || []);
      setError("");
    } catch (err: any) {
      console.error("❌ [Offers] Error fetching offers:", err);
      console.error("❌ [Offers] Error response:", err.response?.data);
      console.error("❌ [Offers] Error status:", err.response?.status);
      const errorMessage = err.response?.data?.error || err.message || "Failed to load offers";
      setError(errorMessage);
      showToast("error", "Error Loading Offers", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  const getStatusBadge = (offer: Offer) => {
    const isExpired = new Date(offer.expiresAt) < new Date() && offer.status === "PENDING";

    if (isExpired) {
      return (
        <Badge variant="secondary" size="sm">
          <Clock className="mr-1 h-3 w-3" />
          Expired
        </Badge>
      );
    }

    switch (offer.status) {
      case "PENDING":
        return (
          <Badge variant="warning" size="sm">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pending Response
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        );
      case "DECLINED":
        return (
          <Badge variant="secondary" size="sm">
            <XCircle className="mr-1 h-3 w-3" />
            Declined
          </Badge>
        );
      case "WITHDRAWN":
        return (
          <Badge variant="secondary" size="sm">
            <XCircle className="mr-1 h-3 w-3" />
            Withdrawn
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge variant="secondary" size="sm">
            <Clock className="mr-1 h-3 w-3" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAcceptOffer = async (offerId: string) => {
    setIsProcessing(true);
    try {
      await api.post(`/api/offers/${offerId}/accept`);
      await fetchOffers();
      setError("");
      showToast(
        "success",
        "Offer Accepted!",
        "Congratulations! You've accepted the offer. A placement has been created."
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to accept offer";
      showToast("error", "Error", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineOffer = async () => {
    if (!selectedOffer) return;

    setIsProcessing(true);
    try {
      await api.post(`/api/offers/${selectedOffer.id}/decline`, {
        declineReason: declineReason || "No reason provided",
      });
      await fetchOffers();
      setShowDeclineModal(false);
      setSelectedOffer(null);
      setDeclineReason("");
      setError("");
      showToast(
        "success",
        "Offer Declined",
        "You have successfully declined the offer."
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to decline offer";
      showToast("error", "Error", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    if (filter === "all") return true;
    if (filter === "pending") return offer.status === "PENDING";
    if (filter === "accepted") return offer.status === "ACCEPTED";
    if (filter === "declined")
      return ["DECLINED", "WITHDRAWN", "EXPIRED"].includes(offer.status);
    return true;
  });

  const stats = {
    total: offers.length,
    pending: offers.filter((o) => o.status === "PENDING").length,
    accepted: offers.filter((o) => o.status === "ACCEPTED").length,
    declined: offers.filter((o) =>
      ["DECLINED", "WITHDRAWN", "EXPIRED"].includes(o.status)
    ).length,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary-600" />
          <p className="text-secondary-600">Loading offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-secondary-900">Job Offers</h1>
          <p className="text-secondary-600">
            Review and respond to job offers from employers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card className={filter === "all" ? "ring-2 ring-primary-500" : ""}>
            <CardContent className="p-6">
              <button
                onClick={() => setFilter("all")}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Total Offers</p>
                    <p className="text-3xl font-bold text-secondary-900">{stats.total}</p>
                  </div>
                  <div className="rounded-lg bg-primary-100 p-3">
                    <Gift className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className={filter === "pending" ? "ring-2 ring-yellow-500" : ""}>
            <CardContent className="p-6">
              <button
                onClick={() => setFilter("pending")}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Pending</p>
                    <p className="text-3xl font-bold text-secondary-900">{stats.pending}</p>
                  </div>
                  <div className="rounded-lg bg-yellow-100 p-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className={filter === "accepted" ? "ring-2 ring-green-500" : ""}>
            <CardContent className="p-6">
              <button
                onClick={() => setFilter("accepted")}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Accepted</p>
                    <p className="text-3xl font-bold text-secondary-900">{stats.accepted}</p>
                  </div>
                  <div className="rounded-lg bg-green-100 p-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className={filter === "declined" ? "ring-2 ring-secondary-500" : ""}>
            <CardContent className="p-6">
              <button
                onClick={() => setFilter("declined")}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Declined</p>
                    <p className="text-3xl font-bold text-secondary-900">{stats.declined}</p>
                  </div>
                  <div className="rounded-lg bg-secondary-100 p-3">
                    <XCircle className="h-6 w-6 text-secondary-600" />
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Offers List */}
        {filteredOffers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Gift className="mx-auto mb-4 h-16 w-16 text-secondary-300" />
              <h3 className="mb-2 text-lg font-semibold text-secondary-900">
                {filter === "all" ? "No Offers Yet" : `No ${filter} Offers`}
              </h3>
              <p className="text-secondary-600">
                {filter === "all"
                  ? "Job offers will appear here once employers extend offers to you"
                  : `You don't have any ${filter} offers at the moment`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOffers.map((offer) => {
              const daysLeft = getDaysUntilExpiry(offer.expiresAt);
              const isExpired = daysLeft < 0;
              const isPending = offer.status === "PENDING" && !isExpired;

              return (
                <Card
                  key={offer.id}
                  className={isPending ? "border-l-4 border-l-yellow-500" : ""}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 lg:flex-row">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        {offer.employer.companyLogo ? (
                          <img
                            src={resolveImageUrl(offer.employer.companyLogo) || ''}
                            alt={offer.employer.companyName}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary-100">
                            <Building2 className="h-10 w-10 text-primary-600" />
                          </div>
                        )}
                      </div>

                      {/* Offer Details */}
                      <div className="flex-1">
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="mb-2 flex items-center gap-2">
                              <h3 className="text-xl font-bold text-secondary-900">
                                {offer.position}
                              </h3>
                              {getStatusBadge(offer)}
                            </div>
                            <p className="mb-2 text-lg font-semibold text-primary-600">
                              {offer.employer.companyName}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {offer.job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                {offer.job.type.replace("_", " ")}
                              </span>
                            </div>
                          </div>

                          {/* Salary Badge */}
                          <div className="rounded-lg bg-green-50 p-4">
                            <p className="mb-1 text-sm text-green-700">Annual Salary</p>
                            <p className="text-2xl font-bold text-green-900">
                              {formatCurrency(offer.salary)}
                            </p>
                          </div>
                        </div>

                        {/* Offer Benefits */}
                        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {offer.equity && (
                            <div className="flex items-center gap-2 rounded-lg bg-purple-50 p-3">
                              <TrendingUp className="h-5 w-5 text-purple-600" />
                              <div>
                                <p className="text-xs text-purple-700">Equity</p>
                                <p className="font-semibold text-purple-900">
                                  {offer.equity}%
                                </p>
                              </div>
                            </div>
                          )}

                          {offer.signingBonus && (
                            <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
                              <DollarSign className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-xs text-blue-700">Signing Bonus</p>
                                <p className="font-semibold text-blue-900">
                                  {formatCurrency(offer.signingBonus)}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 rounded-lg bg-indigo-50 p-3">
                            <Calendar className="h-5 w-5 text-indigo-600" />
                            <div>
                              <p className="text-xs text-indigo-700">Start Date</p>
                              <p className="font-semibold text-indigo-900">
                                {format(new Date(offer.startDate), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Benefits */}
                        {offer.benefits && offer.benefits.length > 0 && (
                          <div className="mb-4">
                            <p className="mb-2 text-sm font-semibold text-secondary-700">
                              Benefits:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {offer.benefits.map((benefit, index) => (
                                <Badge key={index} variant="secondary" size="sm">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Custom Message */}
                        {offer.customMessage && (
                          <div className="mb-4 rounded-lg bg-secondary-50 p-4">
                            <p className="mb-1 text-sm font-semibold text-secondary-700">
                              Message from Employer:
                            </p>
                            <p className="text-sm text-secondary-600">{offer.customMessage}</p>
                          </div>
                        )}

                        {/* Expiry Warning */}
                        {isPending && daysLeft <= 3 && (
                          <div className="mb-4 flex items-center gap-2 rounded-lg bg-yellow-50 p-3">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <p className="text-sm text-yellow-800">
                              <strong>Expiring soon!</strong> This offer expires in {daysLeft}{" "}
                              {daysLeft === 1 ? "day" : "days"}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          {isPending && (
                            <>
                              <Button
                                variant="primary"
                                onClick={() => handleAcceptOffer(offer.id)}
                                disabled={isProcessing}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Accept Offer
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedOffer(offer);
                                  setShowDeclineModal(true);
                                }}
                                disabled={isProcessing}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Decline Offer
                              </Button>
                            </>
                          )}

                          {offer.offerLetter && (
                            <Button
                              variant="outline"
                              onClick={() => window.open(offer.offerLetter, "_blank")}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Offer Letter
                            </Button>
                          )}

                          <p className="ml-auto text-xs text-secondary-500">
                            Received {format(new Date(offer.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {showDeclineModal && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-secondary-900">Decline Offer</h3>
                <button
                  onClick={() => {
                    setShowDeclineModal(false);
                    setSelectedOffer(null);
                    setDeclineReason("");
                  }}
                  disabled={isProcessing}
                  className="rounded-lg p-2 hover:bg-secondary-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-4 text-sm text-secondary-600">
                Are you sure you want to decline the offer from{" "}
                <strong>{selectedOffer.employer.companyName}</strong> for{" "}
                <strong>{selectedOffer.position}</strong>?
              </p>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Reason for declining (optional)
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full rounded-lg border border-secondary-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                  rows={4}
                  placeholder="Let the employer know why you're declining..."
                  disabled={isProcessing}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeclineModal(false);
                    setSelectedOffer(null);
                    setDeclineReason("");
                  }}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDeclineOffer}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Declining...
                    </>
                  ) : (
                    "Confirm Decline"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
