"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Award,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";

export default function AdminAssessmentsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/assessments");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchAssessments();
    }
  }, [status, session, activeTab]);

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      const endpoint = activeTab === "flagged"
        ? "/api/admin/tests/flagged"
        : "/api/admin/tests/flagged?status=all";

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch assessments");

      const data = await response.json();
      setAssessments(data.tests || []);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (testId: string) => {
    if (!confirm("Verify this assessment as legitimate?")) return;

    try {
      const response = await fetch(`/api/admin/tests/${testId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify" }),
      });

      if (response.ok) {
        fetchAssessments();
      }
    } catch (error) {
      console.error("Failed to verify assessment:", error);
    }
  };

  const handleReject = async (testId: string) => {
    const note = prompt("Enter review note (optional):");

    try {
      const response = await fetch(`/api/admin/tests/${testId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", note, resetTest: true }),
      });

      if (response.ok) {
        fetchAssessments();
      }
    } catch (error) {
      console.error("Failed to reject assessment:", error);
    }
  };

  const getTierBadge = (tier: string) => {
    const colors: any = {
      EXPERT: "danger",
      ADVANCED: "primary",
      PROFICIENT: "success",
      COMPETENT: "warning",
      ENTRY: "secondary",
    };
    return <Badge variant={colors[tier] || "secondary"} size="sm">{tier}</Badge>;
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
            Skills Assessments
          </h1>
          <p className="text-secondary-600">
            Review and verify candidate skills assessments
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-secondary-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-4 font-medium ${
              activeTab === "all"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-secondary-600 hover:text-secondary-900"
            }`}
          >
            All Assessments
          </button>
          <button
            onClick={() => setActiveTab("flagged")}
            className={`pb-3 px-4 font-medium flex items-center gap-2 ${
              activeTab === "flagged"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-secondary-600 hover:text-secondary-900"
            }`}
          >
            Flagged for Review
            {stats?.flagged > 0 && (
              <Badge variant="danger" size="sm">{stats.flagged}</Badge>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Total Assessments</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {stats.total || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Flagged</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.flagged || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Verified</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.verified || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Avg Score</p>
                <p className="text-3xl font-bold text-primary-600">
                  {stats.avgScore || 0}%
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Assessments Table */}
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
                      Niche
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Score
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Tier
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {assessments.map((test) => (
                    <tr key={test.id} className="hover:bg-secondary-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-secondary-900">
                          {test.candidate?.user?.name}
                        </p>
                        <p className="text-sm text-secondary-600">
                          {test.candidate?.user?.email}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-secondary-900">
                          {test.testNiche || "General"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-semibold text-secondary-900">
                          {test.testScore}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {getTierBadge(test.testTier)}
                      </td>
                      <td className="py-4 px-4">
                        {test.reviewStatus === "pending" && (
                          <Badge variant="warning" size="sm">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Needs Review
                          </Badge>
                        )}
                        {test.reviewStatus === "verified" && (
                          <Badge variant="success" size="sm">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {test.reviewStatus === "rejected" && (
                          <Badge variant="danger" size="sm">
                            <XCircle className="w-3 h-3 mr-1" />
                            Rejected
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-secondary-900">
                          {new Date(test.completedAt || test.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {test.reviewStatus === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVerify(test.id)}
                                className="text-green-600"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(test.id)}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
