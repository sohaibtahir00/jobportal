"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Filter,
  CheckCircle,
  X,
  Eye,
  Calendar,
  Award,
  MapPin,
  Briefcase,
  Trophy,
  AlertCircle,
  Download,
  Loader2,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  EmptyState,
  useToast,
} from "@/components/ui";
import api from "@/lib/api";

// Types
interface Application {
  id: string;
  status: string;
  appliedAt: string;
  reviewedAt: string | null;
  coverLetter: string | null;
  job: {
    id: string;
    title: string;
    location: string;
    type: string;
    skills: string[];
  };
  candidate: {
    id: string;
    experience: number | null;
    location: string | null;
    skills: string[];
    availability: string | null;
    hasTakenTest: boolean;
    testScore: number | null;
    testPercentile: number | null;
    testTier: string | null;
    currentTitle: string | null;
    currentCompany: string | null;
    user: {
      name: string;
      email: string;
      image: string | null;
    };
  };
  testResults: Array<{
    id: string;
    testName: string;
    score: number;
    maxScore: number;
    category: string | null;
  }>;
}

interface Stats {
  totalApplicants: number;
  skillsVerifiedCount: number;
  skillsVerifiedPercentage: number;
  averageSkillsScore: number;
  statusBreakdown: {
    total: number;
    pending: number;
    reviewed: number;
    shortlisted: number;
    interviewScheduled: number;
    interviewed: number;
    offered: number;
    accepted: number;
    rejected: number;
  };
}

const STATUS_OPTIONS = [
  { value: "all", label: "All", icon: "📋" },
  { value: "PENDING", label: "New", icon: "🆕" },
  { value: "REVIEWED", label: "Reviewing", icon: "👀" },
  { value: "SHORTLISTED", label: "Shortlisted", icon: "⭐" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled", icon: "📅" },
  { value: "INTERVIEWED", label: "Interviewed", icon: "💬" },
  { value: "OFFERED", label: "Offer", icon: "📧" },
  { value: "ACCEPTED", label: "Hired", icon: "🎉" },
  { value: "REJECTED", label: "Rejected", icon: "❌" },
  { value: "WITHDRAWN", label: "Withdrawn", icon: "🚪" },
];

// Status colors for badges
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-800 border-gray-300",
  REVIEWED: "bg-blue-100 text-blue-800 border-blue-300",
  SHORTLISTED: "bg-yellow-100 text-yellow-800 border-yellow-300",
  INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-800 border-purple-300",
  INTERVIEWED: "bg-purple-100 text-purple-800 border-purple-300",
  OFFERED: "bg-indigo-100 text-indigo-800 border-indigo-300",
  ACCEPTED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
  WITHDRAWN: "bg-gray-100 text-gray-600 border-gray-300",
};

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "skillsScore", label: "Highest Skills Score" },
  { value: "applicationDate", label: "Application Date" },
];

const SKILLS_FILTER_OPTIONS = [
  { value: "all", label: "All Candidates" },
  { value: "verified", label: "Verified Only" },
  { value: "80+", label: "Score 80+ (Expert/Advanced)" },
  { value: "60-79", label: "Score 60-79 (Proficient)" },
  { value: "<60", label: "Score <60 (Entry)" },
];

export default function EmployerApplicantsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Filters
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSkillsFilter, setSelectedSkillsFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);

  // Read URL parameters on mount
  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam) {
      // Handle single status or first status from comma-separated list
      const firstStatus = statusParam.split(",")[0];
      if (firstStatus && firstStatus !== "all") {
        setSelectedStatus(firstStatus);
      }
    }
  }, [searchParams]);

  // Fetch applications using the new simple endpoint
  const { data, isLoading } = useQuery({
    queryKey: ["applications", selectedJob, selectedStatus, selectedSkillsFilter, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedJob !== "all") params.append("jobId", selectedJob);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedSkillsFilter !== "all") params.append("skillsFilter", selectedSkillsFilter);
      params.append("sortBy", sortBy);

      // Use the new endpoint that matches the pattern of /api/jobs/[id]/applications
      const response = await api.get(`/api/employer/applications?${params.toString()}`);
      return response.data;
    },
    staleTime: 30 * 1000,
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ applicationIds, newStatus }: { applicationIds: string[]; newStatus: string }) => {
      const response = await api.post("/api/applications/bulk", {
        applicationIds,
        newStatus,
      });
      return response.data;
    },
    onSuccess: (data) => {
      showToast("success", "Success", data.message);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setSelectedApplicants([]);
    },
    onError: (error: any) => {
      showToast("error", "Error", error.response?.data?.message || "Failed to update applications");
    },
  });

  const applications: Application[] = data?.applications || [];
  const stats: Stats | null = data?.stats || null;
  const jobs = data?.jobs || []; // Jobs now come from the same endpoint

  // Calculate match score (simple version based on skills overlap)
  const calculateMatchScore = (app: Application): number => {
    const jobSkills = app.job.skills || [];
    const candidateSkills = app.candidate.skills || [];
    if (jobSkills.length === 0) return 0;

    const matchingSkills = jobSkills.filter(skill =>
      candidateSkills.some(cSkill => cSkill.toLowerCase().includes(skill.toLowerCase()))
    );

    return Math.round((matchingSkills.length / jobSkills.length) * 100);
  };

  // Get tier badge color
  const getTierColor = (tier: string | null): string => {
    switch (tier) {
      case "ELITE": return "bg-purple-100 text-purple-700 border-purple-300";
      case "ADVANCED": return "bg-blue-100 text-blue-700 border-blue-300";
      case "INTERMEDIATE": return "bg-green-100 text-green-700 border-green-300";
      case "BEGINNER": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-secondary-100 text-secondary-700 border-secondary-300";
    }
  };

  // Get status label with icon
  const getStatusLabel = (status: string): string => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status);
    return option ? `${option.icon} ${option.label}` : status;
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedApplicants.length === applications.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(applications.map(app => app.id));
    }
  };

  // Handle bulk action
  const handleBulkAction = (newStatus: string) => {
    if (selectedApplicants.length === 0) {
      showToast("error", "Error", "Please select at least one applicant");
      return;
    }

    bulkUpdateMutation.mutate({
      applicationIds: selectedApplicants,
      newStatus,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">All Applicants</h1>
        <p className="text-secondary-600 mt-2">
          {stats ? `${stats.totalApplicants} total applicants` : "Loading..."}
        </p>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Total Applicants</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.totalApplicants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Skills-Verified</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {stats.skillsVerifiedCount} ({stats.skillsVerifiedPercentage}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Avg Skills Score</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.averageSkillsScore}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Shortlisted</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.statusBreakdown.shortlisted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters & Bulk Actions */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Job Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Filter by Job
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Jobs</option>
                {jobs.map((job: any) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Filter by Skills Score
              </label>
              <select
                value={selectedSkillsFilter}
                onChange={(e) => setSelectedSkillsFilter(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {SKILLS_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedApplicants.length > 0 && (
            <div className="flex items-center gap-3 pt-4 border-t">
              <span className="text-sm font-medium text-secondary-700">
                {selectedApplicants.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("SHORTLISTED")}
                disabled={bulkUpdateMutation.isPending}
              >
                Move to Shortlist
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("REJECTED")}
                disabled={bulkUpdateMutation.isPending}
              >
                Reject Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedApplicants.length === applications.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applicants List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
            <p className="text-secondary-600 mt-4">Loading applicants...</p>
          </CardContent>
        </Card>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants found"
          description="No applications match your current filters. Try adjusting your filters or wait for more candidates to apply."
          action={{
            label: "View All Applicants",
            onClick: () => {
              setSelectedJob("all");
              setSelectedStatus("all");
              setSelectedSkillsFilter("all");
            },
          }}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const matchScore = calculateMatchScore(app);
            const isSelected = selectedApplicants.includes(app.id);

            return (
              <Card key={app.id} className={`${isSelected ? "ring-2 ring-primary-500" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            setSelectedApplicants(selectedApplicants.filter(id => id !== app.id));
                          } else {
                            setSelectedApplicants([...selectedApplicants, app.id]);
                          }
                        }}
                        className="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      />
                    </div>

                    {/* Photo */}
                    <div className="flex-shrink-0">
                      {app.candidate.user.image ? (
                        <img
                          src={app.candidate.user.image}
                          alt={app.candidate.user.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary-600">
                            {app.candidate.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-900">
                            {app.candidate.user.name}
                          </h3>
                          {app.candidate.currentTitle && app.candidate.currentCompany && (
                            <p className="text-sm text-secondary-600">
                              {app.candidate.currentTitle} at {app.candidate.currentCompany}
                            </p>
                          )}
                        </div>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-800 border-gray-300"}`}>
                          {getStatusLabel(app.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {app.candidate.location && (
                          <div className="flex items-center gap-2 text-sm text-secondary-600">
                            <MapPin className="h-4 w-4" />
                            {app.candidate.location}
                          </div>
                        )}
                        {app.candidate.experience !== null && (
                          <div className="flex items-center gap-2 text-sm text-secondary-600">
                            <Briefcase className="h-4 w-4" />
                            {app.candidate.experience} years exp
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-secondary-600">
                          <Calendar className="h-4 w-4" />
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-secondary-600">
                          <TrendingUp className="h-4 w-4" />
                          {matchScore}% match
                        </div>
                      </div>

                      {/* Skills Score Card */}
                      {app.candidate.hasTakenTest ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="font-semibold text-green-900">Skills Verified</span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-xs text-green-700 mb-1">Score</p>
                                  <p className="text-2xl font-bold text-green-900">
                                    {app.candidate.testScore || 0}/100
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-green-700 mb-1">Tier</p>
                                  <Badge className={getTierColor(app.candidate.testTier)} size="sm">
                                    {app.candidate.testTier || "N/A"}
                                  </Badge>
                                </div>
                                {app.candidate.testPercentile !== null && (
                                  <div>
                                    <p className="text-xs text-green-700 mb-1">Percentile</p>
                                    <p className="text-sm font-semibold text-green-900">
                                      Top {Math.round(100 - app.candidate.testPercentile)}%
                                    </p>
                                  </div>
                                )}
                                {app.testResults.length > 0 && (
                                  <div>
                                    <p className="text-xs text-green-700 mb-1">Top Skills</p>
                                    <div className="space-y-1">
                                      {app.testResults.slice(0, 3).map((test) => (
                                        <p key={test.id} className="text-xs text-green-900">
                                          {test.testName}: {test.score}/{test.maxScore}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                            <span className="text-yellow-900 font-medium">Skills Not Verified</span>
                            <Button variant="outline" size="sm" className="ml-auto">
                              Invite to Take Assessment
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => router.push(`/employer/applicants/${app.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Profile
                        </Button>
                        {app.status !== "SHORTLISTED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              bulkUpdateMutation.mutate({
                                applicationIds: [app.id],
                                newStatus: "SHORTLISTED",
                              });
                            }}
                            disabled={bulkUpdateMutation.isPending}
                          >
                            Shortlist
                          </Button>
                        )}
                        {app.status !== "REJECTED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              bulkUpdateMutation.mutate({
                                applicationIds: [app.id],
                                newStatus: "REJECTED",
                              });
                            }}
                            disabled={bulkUpdateMutation.isPending}
                          >
                            Reject
                          </Button>
                        )}
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
  );
}
