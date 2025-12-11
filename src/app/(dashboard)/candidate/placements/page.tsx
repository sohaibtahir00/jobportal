"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  DollarSign,
  Calendar,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Building2,
  Award,
  ExternalLink,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import Link from "next/link";
import { formatDistanceToNow, differenceInDays, format } from "date-fns";
import { api } from "@/lib/api";

interface Placement {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  salary?: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  paymentStatus: string;
  guaranteePeriodDays: number;
  guaranteeEndDate?: string;
  createdAt: string;
}

export default function CandidatePlacementsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not logged in or not candidate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/candidate/placements");
    }
    if (status === "authenticated" && session?.user?.role !== "CANDIDATE") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "CANDIDATE") {
      fetchPlacements();
    }
  }, [status, session]);

  const fetchPlacements = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/placements");
      const data = response.data;
      setPlacements(data.placements || []);
    } catch (err: any) {
      console.error("Failed to load placements:", err);
      setError(err.message || "Failed to load placements");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="warning" size="sm">
            <Clock className="mr-1 h-3 w-3" /> Pending Confirmation
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge variant="primary" size="sm">
            <TrendingUp className="mr-1 h-3 w-3" /> Active
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="secondary" size="sm">
            <AlertCircle className="mr-1 h-3 w-3" /> Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  const calculateGuaranteeProgress = (startDate: string, guaranteeEndDate?: string) => {
    if (!guaranteeEndDate) return 0;

    const start = new Date(startDate);
    const end = new Date(guaranteeEndDate);
    const now = new Date();

    const totalDays = differenceInDays(end, start);
    const daysPassed = differenceInDays(now, start);

    const progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
    return Math.round(progress);
  };

  const getDaysRemaining = (guaranteeEndDate?: string) => {
    if (!guaranteeEndDate) return null;
    const daysLeft = differenceInDays(new Date(guaranteeEndDate), new Date());
    return Math.max(daysLeft, 0);
  };

  const formatSalary = (salary?: number) => {
    if (!salary) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(salary / 100); // Convert from cents
  };

  const getTimelineMilestone = (startDate: string, days: number) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + days);
    return start;
  };

  const isMilestoneReached = (milestoneDate: Date) => {
    return new Date() >= milestoneDate;
  };

  // Separate active and past placements
  const activePlacements = placements.filter(
    (p) => p.status === "PENDING" || p.status === "CONFIRMED"
  );
  const pastPlacements = placements.filter(
    (p) => p.status === "COMPLETED" || p.status === "CANCELLED"
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading placements...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-secondary-900">My Placements</h1>
          <p className="text-secondary-600">
            Track your job placements and guarantee periods
          </p>
        </div>

        {/* Active Placements */}
        {activePlacements.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-secondary-900">
              <Award className="h-6 w-6 text-primary-600" />
              Active Placements
            </h2>
            <div className="space-y-6">
              {activePlacements.map((placement) => {
                const progress = calculateGuaranteeProgress(
                  placement.startDate,
                  placement.guaranteeEndDate
                );
                const daysRemaining = getDaysRemaining(placement.guaranteeEndDate);
                const thirtyDayMilestone = getTimelineMilestone(placement.startDate, 30);
                const ninetyDayMilestone = getTimelineMilestone(placement.startDate, 90);

                return (
                  <Card key={placement.id} variant="accent" className="border-2 border-primary-200">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                              <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="mb-1 text-xl font-bold text-secondary-900">
                                {placement.jobTitle}
                              </h3>
                              <p className="text-secondary-600">{placement.companyName}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getStatusBadge(placement.status)}
                            <Badge variant="secondary" size="sm">
                              <Calendar className="mr-1 h-3 w-3" />
                              Started {format(new Date(placement.startDate), "MMM d, yyyy")}
                            </Badge>
                            {placement.salary && (
                              <Badge variant="secondary" size="sm">
                                <DollarSign className="mr-1 h-3 w-3" />
                                {formatSalary(placement.salary)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Guarantee Progress */}
                      {placement.guaranteeEndDate && (
                        <div className="mb-6">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-secondary-900">
                              Guarantee Period Progress
                            </span>
                            <span className="text-sm font-semibold text-primary-600">
                              {daysRemaining} days remaining
                            </span>
                          </div>
                          <div className="h-3 w-full overflow-hidden rounded-full bg-secondary-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="mt-1 flex justify-between text-xs text-secondary-500">
                            <span>Start Date</span>
                            <span>{placement.guaranteePeriodDays}-Day Guarantee</span>
                          </div>
                        </div>
                      )}

                      {/* Timeline */}
                      <div className="mb-6">
                        <h4 className="mb-4 text-sm font-semibold text-secondary-900">
                          Placement Timeline
                        </h4>
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-[15px] top-4 h-[calc(100%-2rem)] w-0.5 bg-secondary-300" />

                          {/* Milestones */}
                          <div className="space-y-6">
                            {/* Start Date */}
                            <div className="relative flex gap-4">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-600 text-white ring-4 ring-white">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                              <div className="flex-1 pb-2">
                                <p className="font-semibold text-secondary-900">Start Date</p>
                                <p className="text-sm text-secondary-600">
                                  {format(new Date(placement.startDate), "MMMM d, yyyy")}
                                </p>
                              </div>
                            </div>

                            {/* 30-day mark */}
                            <div className="relative flex gap-4">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${
                                  isMilestoneReached(thirtyDayMilestone)
                                    ? "bg-success-600 text-white"
                                    : "bg-secondary-300 text-secondary-600"
                                }`}
                              >
                                {isMilestoneReached(thirtyDayMilestone) ? (
                                  <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                  <Clock className="h-5 w-5" />
                                )}
                              </div>
                              <div className="flex-1 pb-2">
                                <p className="font-semibold text-secondary-900">
                                  30-Day Probation Complete
                                </p>
                                <p className="text-sm text-secondary-600">
                                  {format(thirtyDayMilestone, "MMMM d, yyyy")}
                                </p>
                              </div>
                            </div>

                            {/* 90-day mark */}
                            <div className="relative flex gap-4">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${
                                  isMilestoneReached(ninetyDayMilestone)
                                    ? "bg-success-600 text-white"
                                    : "bg-secondary-300 text-secondary-600"
                                }`}
                              >
                                {isMilestoneReached(ninetyDayMilestone) ? (
                                  <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                  <Award className="h-5 w-5" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-secondary-900">
                                  Guarantee Period Ends
                                </p>
                                <p className="text-sm text-secondary-600">
                                  {format(ninetyDayMilestone, "MMMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Guarantee Info */}
                      <div className="rounded-lg bg-blue-50 p-4">
                        <div className="mb-1 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-900">
                            {placement.guaranteePeriodDays}-Day Guarantee Period
                          </span>
                        </div>
                        <p className="text-sm text-blue-800">
                          You are covered under our {placement.guaranteePeriodDays}-day guarantee
                          period. If you leave within this period, the employer can request a
                          replacement candidate at no additional cost.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Past Placements */}
        {pastPlacements.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-secondary-900">Past Placements</h2>
            <Card variant="accent">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-secondary-200 bg-secondary-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-secondary-600">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-secondary-600">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-secondary-600">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-secondary-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 bg-white">
                      {pastPlacements.map((placement) => {
                        const startDate = new Date(placement.startDate);
                        const endDate = placement.endDate
                          ? new Date(placement.endDate)
                          : new Date();
                        const durationDays = differenceInDays(endDate, startDate);

                        return (
                          <tr key={placement.id} className="hover:bg-secondary-50">
                            <td className="px-6 py-4">
                              <div className="font-medium text-secondary-900">
                                {placement.jobTitle}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-secondary-600">{placement.companyName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-secondary-600">
                                {format(startDate, "MMM yyyy")} -{" "}
                                {placement.endDate
                                  ? format(endDate, "MMM yyyy")
                                  : "Present"}
                                <div className="text-xs text-secondary-500">
                                  {durationDays} days
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">{getStatusBadge(placement.status)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {placements.length === 0 && !error && (
          <Card variant="accent">
            <CardContent className="p-12 text-center">
              <Briefcase className="mx-auto mb-4 h-16 w-16 text-secondary-300" />
              <h3 className="mb-2 text-xl font-bold text-secondary-900">
                No Placements Yet
              </h3>
              <p className="mb-6 text-secondary-600">
                You don't have any job placements yet. Start applying for jobs to get hired!
              </p>
              <Button variant="primary" asChild>
                <Link href="/candidate/jobs">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Browse Jobs
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">Failed to load placements</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={fetchPlacements}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
