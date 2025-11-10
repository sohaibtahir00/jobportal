"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Users,
  ChevronRight,
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Eye,
  MessageSquare,
  Check,
  X,
  Loader2,
  Filter,
  Search,
  AlertCircle,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";

interface ApplicantsPipelinePageProps {
  params: Promise<{ id: string }>; // ✅ FIXED: params is now a Promise
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  appliedAt: string;
  skillsScore: number | null;
  testTier: string | null;
  experience: number | null;
  status: string;
  coverLetter: string | null;
  candidate: {
    user: {
      name: string;
      email: string;
    };
    phone: string | null;
    location: string | null;
    experience: number | null;
    testScore: number | null;
    testTier: string | null;
  };
}

export default function ApplicantsPipelinePage({
  params,
}: ApplicantsPipelinePageProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterScore, setFilterScore] = useState("all");
  const [jobTitle, setJobTitle] = useState("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobId, setJobId] = useState<string>(""); // ✅ ADDED: Store resolved jobId

  // ✅ ADDED: Resolve params on mount
  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setJobId(resolved.id);
    }
    resolveParams();
  }, [params]);

  // Pipeline stages mapped to application statuses
  const stages = [
    { id: "PENDING", label: "Applied", color: "bg-secondary-100" },
    { id: "REVIEWED", label: "Screening", color: "bg-blue-100" },
    {
      id: "INTERVIEW_SCHEDULED,INTERVIEWED",
      label: "Interview",
      color: "bg-yellow-100",
    },
    { id: "OFFERED,ACCEPTED", label: "Offer", color: "bg-green-100" },
    { id: "REJECTED,WITHDRAWN", label: "Rejected", color: "bg-red-100" },
  ];

  // Redirect if not logged in or not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/dashboard");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load applicants from API
  useEffect(() => {
    const loadApplicants = async () => {
      if (!jobId) return; // ✅ FIXED: Wait for jobId to be resolved

      try {
        setIsLoading(true);
        setError("");

        // Fetch job details
        const jobResponse = await fetch(`/api/jobs/${jobId}`);
        if (!jobResponse.ok) {
          throw new Error("Failed to load job details");
        }
        const jobData = await jobResponse.json();
        const job = jobData.job || jobData;
        setJobTitle(job.title);

        // Fetch applications for this job
        const appsResponse = await fetch(`/api/applications?jobId=${jobId}`);
        if (!appsResponse.ok) {
          throw new Error("Failed to load applications");
        }
        const appsData = await appsResponse.json();
        setApplicants(appsData.applications || []);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error loading applicants:", err);
        setError(err.message || "Failed to load applicants");
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && jobId) {
      loadApplicants();
    }
  }, [jobId, status]); // ✅ FIXED: Depend on jobId instead of params.id

  const updateApplicantStatus = async (
    applicantId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/applications/${applicantId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === applicantId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update applicant status");
    }
  };

  const getStageApplicants = (stageStatuses: string) => {
    const statusList = stageStatuses.split(",");
    return applicants.filter((app) => {
      const matchesStage = statusList.includes(app.status);
      const matchesSearch =
        searchQuery === "" ||
        app.candidate.user.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        app.candidate.user.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const score = app.candidate.testScore || 0;
      const matchesScore =
        filterScore === "all" ||
        (filterScore === "elite" && score >= 90) ||
        (filterScore === "advanced" && score >= 80 && score < 90) ||
        (filterScore === "proficient" && score >= 70 && score < 80);

      return matchesStage && matchesSearch && matchesScore;
    });
  };

  const getTierColor = (tier: string | null) => {
    switch (tier) {
      case "ELITE":
        return "text-yellow-600 bg-yellow-50";
      case "ADVANCED":
        return "text-accent-600 bg-accent-50";
      case "INTERMEDIATE":
        return "text-primary-600 bg-primary-50";
      case "BEGINNER":
        return "text-secondary-600 bg-secondary-50";
      default:
        return "text-secondary-600 bg-secondary-50";
    }
  };

  if (status === "loading" || isLoading || !jobId) {
    // ✅ FIXED: Also check for jobId
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <p className="text-red-600 mb-2 text-lg font-semibold">
            Failed to load applicants
          </p>
          <p className="text-sm text-secondary-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-secondary-600">
            <Link href="/employer/dashboard" className="hover:text-primary-600">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/employer/jobs" className="hover:text-primary-600">
              Jobs
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Applicants</span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-secondary-900">
                {jobTitle}
              </h1>
              <div className="flex items-center gap-4 text-sm text-secondary-600">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {applicants.length} Total Applicants
                </span>
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  {
                    applicants.filter((a) => (a.candidate.testScore || 0) >= 80)
                      .length
                  }{" "}
                  Verified
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href={`/employer/jobs/${jobId}/edit`}>Edit Job</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
            >
              <option value="all">All Scores</option>
              <option value="elite">Elite (90+)</option>
              <option value="advanced">Advanced (80-89)</option>
              <option value="proficient">Proficient (70-79)</option>
            </select>
          </div>
        </div>

        {/* Pipeline Kanban */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {stages.map((stage) => {
            const stageApplicants = getStageApplicants(stage.id);

            return (
              <div key={stage.id} className="flex flex-col">
                {/* Stage Header */}
                <div className={`mb-4 rounded-lg ${stage.color} p-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-secondary-900">
                      {stage.label}
                    </h3>
                    <Badge variant="secondary" size="sm">
                      {stageApplicants.length}
                    </Badge>
                  </div>
                </div>

                {/* Applicant Cards */}
                <div className="space-y-3">
                  {stageApplicants.map((applicant) => (
                    <Card
                      key={applicant.id}
                      className="cursor-pointer transition-shadow hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="mb-3">
                          <Link
                            href={`/employer/applicants/${applicant.id}`}
                            className="mb-1 font-bold text-secondary-900 hover:text-primary-600"
                          >
                            {applicant.candidate.user.name}
                          </Link>
                          {applicant.candidate.testScore !== null && (
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${getTierColor(
                                  applicant.candidate.testTier
                                )}`}
                              >
                                <Star className="h-3 w-3" />
                                {applicant.candidate.testScore}
                              </div>
                              {applicant.candidate.testTier && (
                                <Badge variant="secondary" size="sm">
                                  {applicant.candidate.testTier}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mb-3 space-y-1 text-xs text-secondary-600">
                          {applicant.candidate.location && (
                            <p className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {applicant.candidate.location}
                            </p>
                          )}
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Applied{" "}
                            {new Date(applicant.appliedAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            asChild
                          >
                            <Link href={`/employer/applicants/${applicant.id}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {stageApplicants.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-secondary-200 p-6 text-center">
                      <p className="text-sm text-secondary-500">
                        No applicants
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="mb-4 font-bold text-secondary-900">
              Pipeline Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <div>
                <p className="mb-1 text-2xl font-bold text-primary-600">
                  {applicants.length}
                </p>
                <p className="text-sm text-secondary-600">Total Applicants</p>
              </div>
              <div>
                <p className="mb-1 text-2xl font-bold text-yellow-600">
                  {
                    applicants.filter((a) => (a.candidate.testScore || 0) >= 90)
                      .length
                  }
                </p>
                <p className="text-sm text-secondary-600">Elite Candidates</p>
              </div>
              <div>
                <p className="mb-1 text-2xl font-bold text-green-600">
                  {getStageApplicants("OFFERED,ACCEPTED").length}
                </p>
                <p className="text-sm text-secondary-600">Offers Extended</p>
              </div>
              <div>
                <p className="mb-1 text-2xl font-bold text-blue-600">
                  {getStageApplicants("INTERVIEW_SCHEDULED,INTERVIEWED").length}
                </p>
                <p className="text-sm text-secondary-600">In Interview</p>
              </div>
              <div>
                <p className="mb-1 text-2xl font-bold text-secondary-600">
                  {Math.round(
                    applicants.reduce(
                      (sum, a) => sum + (a.candidate.testScore || 0),
                      0
                    ) / applicants.length
                  ) || 0}
                </p>
                <p className="text-sm text-secondary-600">Avg Skills Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
