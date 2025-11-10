"use client";

import { use, useState, useEffect } from "react";
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
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";

interface ApplicantsPipelinePageProps {
  params: Promise<{ id: string }>;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  appliedDate: string;
  skillsScore: number;
  tier: string;
  experience: string;
  status: string;
  avatar?: string;
}

export default function ApplicantsPipelinePage({ params }: ApplicantsPipelinePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterScore, setFilterScore] = useState("all");

  const [jobTitle, setJobTitle] = useState("Senior Machine Learning Engineer");

  // Pipeline stages
  const stages = [
    { id: "applied", label: "Applied", count: 0, color: "bg-secondary-100" },
    { id: "screening", label: "Screening", count: 0, color: "bg-blue-100" },
    { id: "interview", label: "Interview", count: 0, color: "bg-yellow-100" },
    { id: "offer", label: "Offer", count: 0, color: "bg-green-100" },
    { id: "rejected", label: "Rejected", count: 0, color: "bg-red-100" },
  ];

  const [applicants, setApplicants] = useState<Applicant[]>([]);

  // Redirect if not logged in or not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/dashboard");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load applicants
  useEffect(() => {
    const loadApplicants = async () => {
      try {
        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockApplicants: Applicant[] = [
          {
            id: "1",
            name: "Sarah Chen",
            email: "sarah.chen@email.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            appliedDate: "2025-01-05",
            skillsScore: 92,
            tier: "Elite",
            experience: "7 years",
            status: "applied",
          },
          {
            id: "2",
            name: "Michael Rodriguez",
            email: "m.rodriguez@email.com",
            phone: "+1 (555) 234-5678",
            location: "Austin, TX",
            appliedDate: "2025-01-06",
            skillsScore: 85,
            tier: "Advanced",
            experience: "5 years",
            status: "screening",
          },
          {
            id: "3",
            name: "Emily Watson",
            email: "emily.w@email.com",
            phone: "+1 (555) 345-6789",
            location: "Seattle, WA",
            appliedDate: "2025-01-07",
            skillsScore: 88,
            tier: "Advanced",
            experience: "6 years",
            status: "interview",
          },
          {
            id: "4",
            name: "David Kim",
            email: "dkim@email.com",
            phone: "+1 (555) 456-7890",
            location: "New York, NY",
            appliedDate: "2025-01-04",
            skillsScore: 78,
            tier: "Proficient",
            experience: "4 years",
            status: "applied",
          },
          {
            id: "5",
            name: "Lisa Patel",
            email: "lisa.patel@email.com",
            phone: "+1 (555) 567-8901",
            location: "Boston, MA",
            appliedDate: "2025-01-08",
            skillsScore: 95,
            tier: "Elite",
            experience: "8 years",
            status: "offer",
          },
        ];

        setApplicants(mockApplicants);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      loadApplicants();
    }
  }, [resolvedParams.id, status]);

  const moveApplicant = (applicantId: string, newStatus: string) => {
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === applicantId ? { ...app, status: newStatus } : app
      )
    );
  };

  const getStageApplicants = (stageId: string) => {
    return applicants.filter((app) => {
      const matchesStage = app.status === stageId;
      const matchesSearch =
        searchQuery === "" ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesScore =
        filterScore === "all" ||
        (filterScore === "elite" && app.skillsScore >= 90) ||
        (filterScore === "advanced" && app.skillsScore >= 80 && app.skillsScore < 90) ||
        (filterScore === "proficient" && app.skillsScore >= 70 && app.skillsScore < 80);

      return matchesStage && matchesSearch && matchesScore;
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Elite":
        return "text-yellow-600 bg-yellow-50";
      case "Advanced":
        return "text-accent-600 bg-accent-50";
      case "Proficient":
        return "text-primary-600 bg-primary-50";
      default:
        return "text-secondary-600 bg-secondary-50";
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Update stage counts
  stages.forEach((stage) => {
    stage.count = getStageApplicants(stage.id).length;
  });

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
            <span>Applicants Pipeline</span>
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
                  {applicants.filter((a) => a.skillsScore >= 80).length} Verified
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href={`/employer/jobs/${resolvedParams.id}/edit`}>
                  Edit Job
                </Link>
              </Button>
              <Button variant="primary">
                <MessageSquare className="mr-2 h-5 w-5" />
                Message All
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
                    <h3 className="font-bold text-secondary-900">{stage.label}</h3>
                    <Badge variant="secondary" size="sm">
                      {stage.count}
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
                            {applicant.name}
                          </Link>
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${getTierColor(applicant.tier)}`}>
                              <Star className="h-3 w-3" />
                              {applicant.skillsScore}
                            </div>
                            <Badge variant="secondary" size="sm">
                              {applicant.tier}
                            </Badge>
                          </div>
                        </div>

                        <div className="mb-3 space-y-1 text-xs text-secondary-600">
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {applicant.location}
                          </p>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Applied {new Date(applicant.appliedDate).toLocaleDateString()}
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

                          {stage.id !== "rejected" && stage.id !== "offer" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                const nextStage =
                                  stage.id === "applied"
                                    ? "screening"
                                    : stage.id === "screening"
                                    ? "interview"
                                    : "offer";
                                moveApplicant(applicant.id, nextStage);
                              }}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}

                          {stage.id !== "rejected" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-xs text-red-600 hover:bg-red-50"
                              onClick={() => moveApplicant(applicant.id, "rejected")}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {stageApplicants.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-secondary-200 p-6 text-center">
                      <p className="text-sm text-secondary-500">No applicants</p>
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
            <h3 className="mb-4 font-bold text-secondary-900">Pipeline Summary</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <div>
                <p className="mb-1 text-2xl font-bold text-primary-600">
                  {applicants.length}
                </p>
                <p className="text-sm text-secondary-600">Total Applicants</p>
              </div>
              <div>
                <p className="mb-1 text-2xl font-bold text-yellow-600">
                  {applicants.filter((a) => a.skillsScore >= 90).length}
                </p>
                <p className="text-sm text-secondary-600">Elite Candidates</p>
              </div>
              <div>
                <p className="mb-1 text-2xl font-bold text-green-600">
                  {getStageApplicants("offer").length}
                </p>
                <p className="text-sm text-secondary-600">Offers Extended</p>
              </div>
              <div>
                <p className="mb-1 text-2xl font-bold text-blue-600">
                  {getStageApplicants("interview").length}
                </p>
                <p className="text-sm text-secondary-600">In Interview</p>
              </div>
              <div>
                <p className="mb-1 text-2xl font-bold text-secondary-600">
                  {Math.round((applicants.reduce((sum, a) => sum + a.skillsScore, 0) / applicants.length) || 0)}
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
