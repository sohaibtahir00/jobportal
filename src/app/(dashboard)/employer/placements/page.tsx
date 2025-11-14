"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Users, DollarSign, TrendingUp, Loader2, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/lib/api";

interface Placement {
  id: string;
  candidate: {
    user: {
      name: string;
      email: string;
    };
  };
  job: {
    title: string;
    niche: string;
  };
  status: string;
  placementFee: number;
  startDate: string;
  probationEndDate: string;
  createdAt: string;
}

export default function EmployerPlacementsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    completed: 0,
    totalRevenue: 0,
  });

  // Redirect if not logged in or not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/placements");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "EMPLOYER") {
      fetchPlacements();
    }
  }, [status, session]);

  const fetchPlacements = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/placements");
      const data = response.data;
      setPlacements(data.placements || []);

      // Calculate stats
      const total = data.placements?.length || 0;
      const pending = data.placements?.filter((p: Placement) => p.status === "PENDING").length || 0;
      const active = data.placements?.filter((p: Placement) => p.status === "ACTIVE").length || 0;
      const completed = data.placements?.filter((p: Placement) => p.status === "COMPLETED").length || 0;
      const totalRevenue = data.placements?.reduce((sum: number, p: Placement) =>
        p.status === "COMPLETED" ? sum + p.placementFee : sum, 0
      ) || 0;

      setStats({ total, pending, active, completed, totalRevenue });
    } catch (err: any) {
      setError(err.message || "Failed to load placements");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "ACTIVE":
        return <Badge variant="primary" size="sm"><TrendingUp className="w-3 h-3 mr-1" /> Active</Badge>;
      case "COMPLETED":
        return <Badge variant="success" size="sm"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
      case "FAILED":
        return <Badge variant="danger" size="sm"><AlertCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading placements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Successful Placements
          </h1>
          <p className="text-secondary-600">
            Track your successful hires and placement fees
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">Total Placements</p>
                  <p className="text-3xl font-bold text-secondary-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-secondary-900">{stats.active}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-secondary-900">{stats.completed}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">Total Fees</p>
                  <p className="text-3xl font-bold text-secondary-900">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-accent-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-accent-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Placements List */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">
              All Placements
            </h2>

            {placements.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  No Placements Yet
                </h3>
                <p className="text-secondary-600 mb-6">
                  Successful hires will appear here once candidates complete their probation period
                </p>
                <Link href="/employer/applicants">
                  <Button>View Applications</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                        Candidate
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                        Position
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                        Start Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                        Fee
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
                          <div>
                            <p className="font-medium text-secondary-900">
                              {placement.candidate.user.name}
                            </p>
                            <p className="text-sm text-secondary-600">
                              {placement.candidate.user.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-secondary-900">
                              {placement.job.title}
                            </p>
                            <p className="text-sm text-secondary-600">
                              {placement.job.niche}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-secondary-900">
                            {new Date(placement.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-secondary-600">
                            {formatDistanceToNow(new Date(placement.startDate), {
                              addSuffix: true,
                            })}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(placement.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-secondary-900">
                              ${placement.placementFee.toLocaleString()}
                            </p>
                            <p className="text-xs text-secondary-600">
                              {placement.feePercentage}% fee
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Link href={`/employer/placements/${placement.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
