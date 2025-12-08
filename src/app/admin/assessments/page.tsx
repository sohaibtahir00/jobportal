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
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input, ConfirmationModal, useToast } from "@/components/ui";

interface Assessment {
  id: string;
  score: number;
  tier: string;
  duration: number;
  durationFormatted: string;
  completedAt: string;
  sectionScores: Array<{ section: string; score: number }>;
  candidate: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    headline: string | null;
  };
}

interface Summary {
  total: number;
  averageScore: number;
  tierDistribution: {
    elite: number;
    advanced: number;
    proficient: number;
    intermediate: number;
    beginner: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminAssessmentsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [activeTab, setActiveTab] = useState<"list" | "analytics">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

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
  }, [status, session, currentPage, selectedTier]);

  useEffect(() => {
    if (activeTab === "analytics" && !analytics) {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      let url = `/api/admin/assessments?page=${currentPage}&limit=20`;
      if (selectedTier) url += `&tier=${selectedTier}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch assessments");

      const data = await response.json();
      setAssessments(data.assessments || []);
      setSummary(data.summary || null);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
      showToast("error", "Error", "Failed to fetch assessments");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await fetch("/api/admin/assessments/analytics");
      if (!response.ok) throw new Error("Failed to fetch analytics");

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      showToast("error", "Error", "Failed to fetch analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAssessments();
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    try {
      const response = await fetch(`/api/admin/assessments/${deleteModal.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("success", "Deleted", "Assessment deleted successfully");
        fetchAssessments();
      } else {
        showToast("error", "Error", "Failed to delete assessment");
      }
    } catch (error) {
      console.error("Failed to delete assessment:", error);
      showToast("error", "Error", "Failed to delete assessment");
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const getTierBadge = (tier: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      Elite: { variant: "danger", label: "Elite" },
      Advanced: { variant: "primary", label: "Advanced" },
      Proficient: { variant: "success", label: "Proficient" },
      Intermediate: { variant: "warning", label: "Intermediate" },
      Beginner: { variant: "secondary", label: "Beginner" },
    };
    const tierConfig = config[tier] || { variant: "secondary", label: tier };
    return <Badge variant={tierConfig.variant} size="sm">{tierConfig.label}</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-red-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-gray-600";
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Skills Assessments
          </h1>
          <p className="text-secondary-600">
            View and manage candidate skills assessments
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-secondary-200">
          <button
            onClick={() => setActiveTab("list")}
            className={`pb-3 px-4 font-medium flex items-center gap-2 ${
              activeTab === "list"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-secondary-600 hover:text-secondary-900"
            }`}
          >
            <Award className="w-4 h-4" />
            All Assessments
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`pb-3 px-4 font-medium flex items-center gap-2 ${
              activeTab === "analytics"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-secondary-600 hover:text-secondary-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>

        {activeTab === "list" && (
          <>
            {/* Summary Cards */}
            {summary && (
              <div className="mb-6 grid gap-4 md:grid-cols-5">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Award className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-secondary-900">{summary.total}</p>
                        <p className="text-xs text-secondary-600">Total Assessments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-secondary-900">{summary.averageScore}%</p>
                        <p className="text-xs text-secondary-600">Avg Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <Award className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-secondary-900">{summary.tierDistribution.elite}</p>
                        <p className="text-xs text-secondary-600">Elite</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Award className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-secondary-900">{summary.tierDistribution.advanced}</p>
                        <p className="text-xs text-secondary-600">Advanced</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-secondary-900">{summary.tierDistribution.proficient}</p>
                        <p className="text-xs text-secondary-600">Proficient</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select
                value={selectedTier}
                onChange={(e) => {
                  setSelectedTier(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Tiers</option>
                <option value="Elite">Elite</option>
                <option value="Advanced">Advanced</option>
                <option value="Proficient">Proficient</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Beginner">Beginner</option>
              </select>
              <Button variant="outline" onClick={() => fetchAssessments()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Assessments Table */}
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                  </div>
                ) : assessments.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Assessments Found</h3>
                    <p className="text-secondary-600">No assessments match your filters.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-secondary-200 bg-secondary-50">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Candidate</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Score</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Tier</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Duration</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-secondary-100">
                        {assessments.map((assessment) => (
                          <tr key={assessment.id} className="hover:bg-secondary-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                {assessment.candidate.image ? (
                                  <img
                                    src={assessment.candidate.image}
                                    alt={assessment.candidate.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                                    {assessment.candidate.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-secondary-900">{assessment.candidate.name}</p>
                                  <p className="text-sm text-secondary-600">{assessment.candidate.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`text-lg font-bold ${getScoreColor(assessment.score)}`}>
                                {assessment.score}%
                              </span>
                            </td>
                            <td className="py-4 px-4">{getTierBadge(assessment.tier)}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1 text-secondary-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{assessment.durationFormatted}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-secondary-900">
                                {new Date(assessment.completedAt).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-secondary-500">
                                {new Date(assessment.completedAt).toLocaleTimeString()}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedAssessment(assessment)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteModal({ isOpen: true, id: assessment.id })}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-200">
                    <p className="text-sm text-secondary-600">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-secondary-600">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "analytics" && (
          <>
            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : analytics ? (
              <>
                {/* Analytics Summary */}
                <div className="mb-6 grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Award className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-secondary-900">{analytics.summary.totalAssessments}</p>
                          <p className="text-xs text-secondary-600">Total Assessments</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-secondary-900">{analytics.summary.averageScore}%</p>
                          <p className="text-xs text-secondary-600">Average Score</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-secondary-900">{analytics.summary.testedCandidates}</p>
                          <p className="text-xs text-secondary-600">Tested Candidates</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-secondary-900">{analytics.summary.averageDurationFormatted}</p>
                          <p className="text-xs text-secondary-600">Avg Duration</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Tier Distribution */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Tier Distribution</h3>
                      <div className="space-y-3">
                        {Object.entries(analytics.tierDistribution).map(([tier, count]: [string, any]) => (
                          <div key={tier} className="flex items-center gap-3">
                            <span className="w-24 text-sm text-secondary-600 capitalize">{tier}</span>
                            <div className="flex-1 h-6 bg-secondary-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  tier === "Elite" ? "bg-red-500" :
                                  tier === "Advanced" ? "bg-blue-500" :
                                  tier === "Proficient" ? "bg-green-500" :
                                  tier === "Intermediate" ? "bg-yellow-500" :
                                  "bg-gray-500"
                                }`}
                                style={{ width: `${analytics.summary.totalAssessments > 0 ? (count / analytics.summary.totalAssessments) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="w-12 text-sm font-medium text-secondary-900 text-right">{count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Score Distribution */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Score Distribution</h3>
                      <div className="space-y-2">
                        {analytics.scoreDistribution.map((bucket: any) => (
                          <div key={bucket.range} className="flex items-center gap-3">
                            <span className="w-16 text-xs text-secondary-600">{bucket.range}</span>
                            <div className="flex-1 h-4 bg-secondary-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-500"
                                style={{ width: `${analytics.summary.totalAssessments > 0 ? (bucket.count / analytics.summary.totalAssessments) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="w-8 text-xs text-secondary-600 text-right">{bucket.count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Trend */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Monthly Assessments</h3>
                      <div className="space-y-2">
                        {analytics.monthlyBreakdown.map((month: any) => (
                          <div key={month.month} className="flex items-center justify-between">
                            <span className="text-sm text-secondary-600">{month.month}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium text-secondary-900">{month.assessments} tests</span>
                              <span className="text-sm text-secondary-600">Avg: {month.averageScore}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Performers */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Performers (Elite)</h3>
                      {analytics.topPerformers.length === 0 ? (
                        <p className="text-secondary-600 text-center py-4">No elite performers yet</p>
                      ) : (
                        <div className="space-y-3">
                          {analytics.topPerformers.slice(0, 5).map((performer: any, index: number) => (
                            <div key={performer.id} className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                                {index + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-secondary-900 truncate">{performer.candidate.name}</p>
                                <p className="text-xs text-secondary-600 truncate">{performer.candidate.email}</p>
                              </div>
                              <span className="text-lg font-bold text-red-600">{performer.score}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <BarChart3 className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Analytics Data</h3>
                  <p className="text-secondary-600">Analytics data will appear once assessments are completed.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-secondary-900 mb-4">Assessment Details</h2>

            <div className="mb-4">
              <div className="flex items-center gap-3 mb-4">
                {selectedAssessment.candidate.image ? (
                  <img
                    src={selectedAssessment.candidate.image}
                    alt={selectedAssessment.candidate.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                    {selectedAssessment.candidate.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-secondary-900">{selectedAssessment.candidate.name}</p>
                  <p className="text-sm text-secondary-600">{selectedAssessment.candidate.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-secondary-50 p-3 rounded-lg text-center">
                  <p className={`text-2xl font-bold ${getScoreColor(selectedAssessment.score)}`}>
                    {selectedAssessment.score}%
                  </p>
                  <p className="text-xs text-secondary-600">Score</p>
                </div>
                <div className="bg-secondary-50 p-3 rounded-lg text-center">
                  {getTierBadge(selectedAssessment.tier)}
                  <p className="text-xs text-secondary-600 mt-1">Tier</p>
                </div>
                <div className="bg-secondary-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-semibold text-secondary-900">{selectedAssessment.durationFormatted}</p>
                  <p className="text-xs text-secondary-600">Duration</p>
                </div>
              </div>

              <h3 className="font-semibold text-secondary-900 mb-2">Section Scores</h3>
              <div className="space-y-2">
                {selectedAssessment.sectionScores.map((section, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-32 text-sm text-secondary-600">{section.section}</span>
                    <div className="flex-1 h-4 bg-secondary-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500"
                        style={{ width: `${section.score}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm font-medium text-secondary-900 text-right">{section.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedAssessment(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Assessment"
        message="Are you sure you want to delete this assessment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
