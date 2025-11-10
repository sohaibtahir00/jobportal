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
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function AdminPlacementsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [placements, setPlacements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

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
  }, [status, session]);

  const fetchPlacements = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/placements");
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
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
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
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {placements.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600">No placements yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
