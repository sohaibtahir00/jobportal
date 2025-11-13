"use client";

import { useState, useEffect } from "react";
import {
  Gift,
  DollarSign,
  Calendar,
  Building2,
  MapPin,
  User,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { api } from "@/lib/api";
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
  candidate: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
  application: {
    id: string;
    status: string;
    appliedAt: string;
  };
}

export default function EmployerOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "declined">("all");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/offers");
      setOffers(response.data.offers || []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to load offers");
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
            Awaiting Response
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
          <h1 className="mb-2 text-3xl font-bold text-secondary-900">Job Offers Sent</h1>
          <p className="text-secondary-600">
            Track offers you've sent to candidates
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
                {filter === "all" ? "No Offers Sent" : `No ${filter} Offers`}
              </h3>
              <p className="text-secondary-600">
                {filter === "all"
                  ? "Offers you send to candidates will appear here"
                  : `You don't have any ${filter} offers at the moment`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOffers.map((offer) => {
              const daysLeft = getDaysUntilExpiry(offer.expiresAt);
              const isPending = offer.status === "PENDING" && daysLeft >= 0;

              return (
                <Card key={offer.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h3 className="text-xl font-bold text-secondary-900">
                              {offer.position}
                            </h3>
                            {getStatusBadge(offer)}
                          </div>
                          <div className="mb-3 flex items-center gap-2">
                            <User className="h-4 w-4 text-secondary-600" />
                            <span className="font-semibold text-primary-600">
                              {offer.candidate.user.name}
                            </span>
                            <span className="text-secondary-600">•</span>
                            <span className="text-sm text-secondary-600">
                              {offer.candidate.user.email}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {offer.job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {offer.job.title}
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

                      {/* Offer Details */}
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {offer.equity && (
                          <div className="flex items-center gap-2 rounded-lg bg-purple-50 p-3">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                            <div>
                              <p className="text-xs text-purple-700">Equity</p>
                              <p className="font-semibold text-purple-900">{offer.equity}%</p>
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

                        {isPending && (
                          <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <div>
                              <p className="text-xs text-yellow-700">Expires In</p>
                              <p className="font-semibold text-yellow-900">
                                {daysLeft} {daysLeft === 1 ? "day" : "days"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Benefits */}
                      {offer.benefits && offer.benefits.length > 0 && (
                        <div>
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

                      {/* Status Info */}
                      <div className="flex items-center justify-between border-t border-secondary-200 pt-4">
                        <p className="text-sm text-secondary-500">
                          Sent {format(new Date(offer.createdAt), "MMM d, yyyy")}
                        </p>
                        {offer.respondedAt && (
                          <p className="text-sm text-secondary-500">
                            Responded {format(new Date(offer.respondedAt), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
