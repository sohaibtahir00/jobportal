"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ChevronLeft,
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  Download,
  MessageSquare,
  Check,
  X,
  Loader2,
  FileText,
  ExternalLink,
  TrendingUp,
  Code,
  Database,
  Shield,
  Video,
  Edit,
  Trash2,
  CheckCircle,
  Gift,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/components/ui";
import { Button, Badge, Card, CardContent, Progress } from "@/components/ui";
import { api } from "@/lib/api";
import RejectCandidateModal from "@/components/interviews/RejectCandidateModal";
import RescheduleInterviewModal from "@/components/interviews/RescheduleInterviewModal";

// Backend URL for file downloads
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://job-portal-backend-production-cd05.up.railway.app";

// Helper function to get full resume URL
const getResumeUrl = (resumePath: string | null): string | null => {
  if (!resumePath) return null;
  // If it's already a full URL, return as is
  if (resumePath.startsWith("http://") || resumePath.startsWith("https://")) {
    return resumePath;
  }
  // Convert /uploads/... to /api/uploads/... for backend serving
  const apiPath = resumePath.startsWith("/uploads/")
    ? resumePath.replace("/uploads/", "/api/uploads/")
    : resumePath;
  // Prepend backend URL
  return `${BACKEND_URL}${apiPath}`;
};

export default function ApplicantDetailPage() {
  const { showToast } = useToast();
  const params = useParams();
  const applicantId = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [applicantData, setApplicantData] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(false);
  const [interviewRounds, setInterviewRounds] = useState<any[]>([]);

  // Offer modal state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [offerData, setOfferData] = useState({
    position: "",
    salary: "",
    equity: "",
    signingBonus: "",
    benefits: [] as string[],
    startDate: "",
    expiresAt: "",
    customMessage: "",
  });

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Reschedule modal state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);

  // Redirect if not logged in or not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/dashboard");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load applicant data
  useEffect(() => {
    const loadApplicant = async () => {
      if (!applicantId) {
        console.log("⚠️ [Applicant Detail] No applicant ID yet");
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        console.log("🔍 [Applicant Detail] Fetching application:", applicantId);

        // Fetch real data from API using the same pattern as other pages
        // Use the new employer-specific endpoint that has proper ownership validation
        const response = await api.get(
          `/api/employer/applications/${applicantId}`
        );
        console.log("📦 [Applicant Detail] Response:", response.data);

        const app = response.data.application;

        if (!app) {
          throw new Error("Application not found");
        }

        // Transform API data to match the UI structure
        const transformedData = {
          id: app.id,
          candidateId: app.candidate.id,
          candidateUserId: app.candidate.userId,
          name: app.candidate.user.name || app.candidate.user.email,
          email: app.candidate.user.email,
          phone: app.candidate.phone || "Not provided",
          location: app.candidate.location || "Not specified",
          appliedDate: app.appliedAt,
          experience: app.candidate.experience
            ? `${app.candidate.experience} years`
            : "Not specified",
          currentRole: app.candidate.currentTitle || "Not specified",
          currentCompany: app.candidate.currentCompany,
          education: app.candidate.education || "Not specified",
          resume: app.candidate.resume,
          linkedin: app.candidate.linkedIn,
          github: app.candidate.github,
          portfolio: app.candidate.portfolio,
          personalWebsite: app.candidate.personalWebsite,
          bio: app.candidate.bio,

          // Skills Assessment
          skillsScore: app.candidate.testScore || 0,
          tier: app.candidate.testTier || "Not Assessed",
          percentile: app.candidate.testPercentile,
          assessmentDate: app.candidate.lastTestDate,
          hasTakenTest: app.candidate.hasTakenTest,

          sectionScores: app.testResults || [],

          skills: app.candidate.skills
            ? app.candidate.skills.map((skill: string) => ({
                name: skill,
                level: 0, // TODO: Add if skill levels available
              }))
            : [],

          // Work Experience & Education from relations
          workExperience: app.candidate.workExperiences || [],
          educationEntries: app.candidate.educationEntries || [],

          // Compensation & Availability
          expectedSalary: app.candidate.expectedSalary,
          availability: app.candidate.availability,
          startDateAvailability: app.candidate.startDateAvailability,
          remotePreference: app.candidate.remotePreference,
          openToContract: app.candidate.openToContract,
          willingToRelocate: app.candidate.willingToRelocate,

          // Application Status
          applicationStatus: app.status.toLowerCase(),
          appliedFor: app.job.title,
          jobId: app.jobId,
          coverLetter: app.coverLetter || "No cover letter provided",
        };

        console.log("✅ [Applicant Detail] Transformed data:", transformedData);
        setApplicantData(transformedData);
        setIsLoading(false);

        // Record profile view
        try {
          await api.post("/api/profile-views", {
            candidateId: app.candidate.id,
            source: "application",
            jobId: app.jobId,
          });
          console.log("✅ [Applicant Detail] Profile view recorded");
        } catch (viewErr) {
          // Don't block the page if profile view recording fails
          console.error(
            "⚠️ [Applicant Detail] Failed to record profile view:",
            viewErr
          );
        }
      } catch (err: any) {
        console.error("❌ [Applicant Detail] Error:", err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to load applicant details"
        );
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      loadApplicant();
    }
  }, [applicantId, status]);

  // Load interviews for this application
  const loadInterviews = async () => {
    if (!applicantId) return;

    try {
      setIsLoadingInterviews(true);
      const response = await api.get(
        `/api/interviews?applicationId=${applicantId}`
      );
      const fetchedInterviews = response.data.interviews || [];
      setInterviews(fetchedInterviews);
    } catch (err) {
      console.error("Failed to load interviews:", err);
    } finally {
      setIsLoadingInterviews(false);
    }
  };

  // Load interview rounds for this job
  const loadInterviewRounds = async () => {
    if (!applicantData?.jobId) return;

    try {
      const response = await api.get(
        `/api/employer/jobs/${applicantData.jobId}/interview-rounds`
      );
      setInterviewRounds(response.data.rounds || []);
    } catch (err) {
      console.error("Failed to load interview rounds:", err);
      setInterviewRounds([]);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && applicantId) {
      loadInterviews();
    }
  }, [applicantId, status]);

  useEffect(() => {
    if (applicantData?.jobId) {
      loadInterviewRounds();
    }
  }, [applicantData?.jobId]);

  const handleInterviewSuccess = () => {
    loadInterviews(); // Reload interviews after scheduling
  };

  const handleCancelInterview = async (interviewId: string) => {
    if (!confirm("Are you sure you want to cancel this interview?")) return;

    try {
      await api.delete(`/api/interviews/${interviewId}`);
      loadInterviews();
    } catch (err) {
      console.error("Failed to cancel interview:", err);
      alert("Failed to cancel interview");
    }
  };

  const rescheduleInterview = (interviewId: string) => {
    // Find the interview from the interviews list
    const interview = interviews.find((i) => i.id === interviewId);
    if (interview) {
      setSelectedInterview(interview);
      setRescheduleModalOpen(true);
    }
  };

  const handleConfirmReschedule = async (reason?: string) => {
    console.log("handleConfirmReschedule called with:", {
      interviewId: selectedInterview?.id,
      reason,
    });

    if (!selectedInterview) {
      console.error("No selected interview");
      return;
    }

    try {
      console.log("Sending POST request to reschedule interview...");
      const response = await api.post(
        `/api/interviews/${selectedInterview.id}/reschedule`,
        { reason }
      );
      console.log("Reschedule successful:", response.data);

      // Reload interviews
      await loadInterviews();
      console.log("Interviews reloaded successfully");

      // Close modal
      setRescheduleModalOpen(false);
      setSelectedInterview(null);

      // Redirect to availability page to set new availability
      const applicationId = response.data.applicationId;
      if (applicationId) {
        router.push(
          `/employer/interviews/availability/${applicationId}`
        );
      }
    } catch (err: any) {
      console.error("Failed to reschedule interview:", err);
      alert(
        err?.response?.data?.error || "Failed to reschedule interview"
      );
      throw err; // Re-throw to let modal handle loading state
    }
  };

  const cancelInterview = async (interviewId: string) => {
    if (!confirm("Are you sure you want to cancel this interview?")) return;

    try {
      await api.patch(`/api/interviews/${interviewId}`, {
        status: "CANCELLED",
      });

      // Refresh interviews
      loadInterviews();
    } catch (error) {
      alert("Failed to cancel interview");
    }
  };

  const handleMarkCompleted = async (interviewId: string) => {
    try {
      await api.patch(`/api/interviews/${interviewId}`, {
        status: "COMPLETED",
      });
      loadInterviews();
      // Reload applicant data to show updated UI
      window.location.reload();
    } catch (err) {
      console.error("Failed to mark interview as completed:", err);
      alert("Failed to update interview status");
    }
  };

  const handleMakeOffer = async () => {
    setIsCreatingOffer(true);
    try {
      // Convert salary from string to cents (multiply by 100)
      const salaryInCents = Math.round(parseFloat(offerData.salary) * 100);
      const signingBonusInCents = offerData.signingBonus
        ? Math.round(parseFloat(offerData.signingBonus) * 100)
        : null;

      // Set expiration date to 7 days from now if not provided
      const expirationDate =
        offerData.expiresAt ||
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await api.post("/api/offers", {
        applicationId: applicantId,
        position: offerData.position,
        salary: salaryInCents,
        equity: offerData.equity ? parseFloat(offerData.equity) : null,
        signingBonus: signingBonusInCents,
        benefits: offerData.benefits,
        startDate: offerData.startDate,
        expiresAt: expirationDate,
        customMessage: offerData.customMessage,
      });

      // Success toast
      showToast("success", "Offer sent successfully!");

      setShowOfferModal(false);
      // Reset form
      setOfferData({
        position: "",
        salary: "",
        equity: "",
        signingBonus: "",
        benefits: [],
        startDate: "",
        expiresAt: "",
        customMessage: "",
      });
      // Reload applicant data to reflect new status
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to create offer:", err);
      alert(err.response?.data?.error || "Failed to create offer");
    } finally {
      setIsCreatingOffer(false);
    }
  };

  const handleBenefitToggle = (benefit: string) => {
    setOfferData((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const handleConfirmReject = async (rejectionReason?: string) => {
    console.log("handleConfirmReject called with:", {
      applicantId,
      rejectionReason,
    });

    if (!applicantId) {
      console.error("No applicant ID");
      return;
    }

    try {
      console.log("Sending PATCH request to reject candidate...");
      await api.patch(`/api/applications/${applicantId}/status`, {
        status: "REJECTED",
        rejectionReason,
      });
      console.log("Rejection successful, reloading page...");

      // Show success toast
      showToast("success", "Candidate rejected successfully");

      // Reload the page to show updated status
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to reject candidate:", err);
      const debugInfo = err?.response?.data?.debug;
      if (debugInfo) {
        alert(
          `Failed to reject candidate\n\n` +
            `Debug Info:\n` +
            `Your User ID: ${debugInfo.yourUserId}\n` +
            `Required User ID: ${debugInfo.requiredUserId}\n\n` +
            `Error: ${err?.response?.data?.error}`
        );
      } else {
        alert(err?.response?.data?.error || "Failed to reject candidate");
      }
      throw err;
    }
  };

  const getInterviewStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Badge variant="primary">Scheduled</Badge>;
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Cancelled</Badge>;
      case "RESCHEDULED":
        return <Badge variant="warning">Rescheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">
            Loading applicant details...
          </p>
        </div>
      </div>
    );
  }

  if (!applicantData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <p className="text-secondary-600">Applicant not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Back to Applicants
          </Button>

          {/* Header */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Info */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h1 className="mb-2 text-3xl font-bold text-secondary-900">
                      {applicantData.name}
                    </h1>
                    <p className="mb-4 text-lg text-secondary-600">
                      {applicantData.currentRole}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-secondary-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {applicantData.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {applicantData.experience} experience
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Applied{" "}
                        {new Date(
                          applicantData.appliedDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div
                      className={`flex items-center gap-1 rounded-lg px-3 py-2 font-bold ${getTierColor(
                        applicantData.tier
                      )}`}
                    >
                      <Star className="h-5 w-5" />
                      <span>{applicantData.skillsScore}</span>
                    </div>
                    <Badge variant="secondary">{applicantData.tier}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-secondary-600" />
                    <a
                      href={`mailto:${applicantData.email}`}
                      className="text-primary-600 hover:underline"
                    >
                      {applicantData.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-secondary-600" />
                    <a
                      href={`tel:${applicantData.phone}`}
                      className="text-primary-600 hover:underline"
                    >
                      {applicantData.phone}
                    </a>
                  </div>
                  {applicantData.linkedin && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-5 w-5 text-secondary-600" />
                      <a
                        href={applicantData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-bold text-secondary-900">Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      // Calculate next round to schedule
                      const completedRounds = interviews
                        .filter(
                          (i: any) => i.status === "COMPLETED" && i.roundNumber
                        )
                        .map((i: any) => i.roundNumber);

                      const scheduledRounds = interviews
                        .filter(
                          (i: any) =>
                            i.status !== "CANCELLED" &&
                            i.status !== "COMPLETED" &&
                            i.roundNumber
                        )
                        .map((i: any) => i.roundNumber);

                      // Next round is highest completed + 1, or first available
                      let nextRound = 1;
                      if (completedRounds.length > 0) {
                        nextRound = Math.max(...completedRounds) + 1;
                      } else if (scheduledRounds.length > 0) {
                        // If there's already a scheduled interview, go to next after that
                        nextRound = Math.max(...scheduledRounds) + 1;
                      }

                      // Make sure we don't exceed total rounds
                      if (
                        interviewRounds &&
                        interviewRounds.length > 0 &&
                        nextRound <= interviewRounds.length
                      ) {
                        router.push(
                          `/employer/interviews/availability/${applicantId}?round=${nextRound}`
                        );
                      } else {
                        router.push(
                          `/employer/interviews/availability/${applicantId}`
                        );
                      }
                    }}
                  >
                    <Video className="mr-2 h-5 w-5" />
                    Schedule Interview
                  </Button>
                  {(applicantData.applicationStatus === "shortlisted" ||
                    interviews.some(
                      (interview) => interview.status === "COMPLETED"
                    )) && (
                    <Button
                      variant="primary"
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        // Pre-fill position with job title
                        setOfferData((prev) => ({
                          ...prev,
                          position: applicantData.appliedFor || "",
                        }));
                        setShowOfferModal(true);
                      }}
                    >
                      <Gift className="mr-2 h-5 w-5" />
                      Make Job Offer
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      router.push(
                        `/employer/messages?candidateId=${applicantData.candidateUserId}`
                      )
                    }
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                  {applicantData.resume && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const resumeUrl = getResumeUrl(applicantData.resume);
                        if (resumeUrl) {
                          // Create a temporary link element to trigger download
                          const link = document.createElement("a");
                          link.href = resumeUrl;
                          link.download = `${applicantData.candidateName.replace(
                            /\s+/g,
                            "_"
                          )}_Resume.pdf`;
                          link.target = "_blank";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Resume
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => setRejectModalOpen(true)}
                  >
                    <X className="mr-2 h-5 w-5" />
                    Reject
                  </Button>
                </div>

                <div className="mt-6 border-t border-secondary-200 pt-6">
                  <h4 className="mb-3 text-sm font-semibold text-secondary-700">
                    Application Status
                  </h4>
                  <Badge variant="primary" className="capitalize">
                    {applicantData.applicationStatus}
                  </Badge>
                  <p className="mt-2 text-sm text-secondary-600">
                    Applied for: {applicantData.appliedFor}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Assessment Results */}
          <Card className="mb-6 border-2 border-success-200">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-secondary-900">
                    Skills Assessment Results
                  </h2>
                  <p className="text-secondary-600">
                    Completed on{" "}
                    {new Date(
                      applicantData.assessmentDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="mb-1 text-4xl font-bold text-success-600">
                    {applicantData.skillsScore}
                  </div>
                  <Badge variant="success">
                    Top {applicantData.percentile}%
                  </Badge>
                </div>
              </div>

              {/* Section Breakdown */}
              <div className="mb-6 space-y-4">
                {applicantData.sectionScores.map(
                  (section: any, idx: number) => (
                    <div key={idx}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-secondary-700">
                          {section.name}
                        </span>
                        <span className="font-bold text-primary-600">
                          {section.score}/{section.maxScore}
                        </span>
                      </div>
                      <Progress value={section.score} className="h-3" />
                    </div>
                  )
                )}
              </div>

              {/* Skills Breakdown */}
              <div>
                <h3 className="mb-4 font-bold text-secondary-900">
                  Technical Skills
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {applicantData.skills.map((skill: any, idx: number) => (
                    <div key={idx} className="text-center">
                      <div className="mb-2 text-2xl font-bold text-primary-600">
                        {skill.level}
                      </div>
                      <div className="text-sm text-secondary-700">
                        {skill.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Links */}
          {(applicantData.linkedin ||
            applicantData.github ||
            applicantData.portfolio ||
            applicantData.personalWebsite) && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-secondary-900">
                  <ExternalLink className="h-5 w-5" />
                  Professional Links
                </h2>
                <div className="space-y-2">
                  {applicantData.linkedin && (
                    <a
                      href={applicantData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      💼 LinkedIn
                    </a>
                  )}
                  {applicantData.github && (
                    <a
                      href={applicantData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      💻 GitHub
                    </a>
                  )}
                  {applicantData.portfolio && (
                    <a
                      href={applicantData.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      🌐 Portfolio
                    </a>
                  )}
                  {applicantData.personalWebsite && (
                    <a
                      href={applicantData.personalWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Work Experience - Full Details */}
          {applicantData.workExperience &&
            applicantData.workExperience.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-secondary-900">
                    <Briefcase className="h-6 w-6" />
                    Work Experience
                  </h2>
                  <div className="space-y-6">
                    {applicantData.workExperience.map(
                      (exp: any, idx: number) => (
                        <div
                          key={idx}
                          className="border-l-4 border-green-500 pl-4"
                        >
                          <h3 className="text-lg font-semibold">{exp.title}</h3>
                          <p className="text-secondary-700">{exp.company}</p>
                          <p className="mb-2 text-sm text-secondary-500">
                            {new Date(exp.startDate).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            )}{" "}
                            -
                            {exp.current
                              ? " Present"
                              : ` ${new Date(exp.endDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", year: "numeric" }
                                )}`}
                            {exp.location && ` • ${exp.location}`}
                          </p>
                          {exp.description && (
                            <p className="whitespace-pre-line text-sm text-secondary-600">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Education - Full Details */}
          {applicantData.educationEntries &&
            applicantData.educationEntries.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-secondary-900">
                    🎓 Education
                  </h2>
                  <div className="space-y-4">
                    {applicantData.educationEntries.map(
                      (edu: any, idx: number) => (
                        <div
                          key={idx}
                          className="border-l-4 border-blue-500 pl-4"
                        >
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-secondary-600">
                            {edu.institution}
                          </p>
                          <p className="text-sm text-secondary-500">
                            {edu.graduationYear}{" "}
                            {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                          </p>
                          {edu.description && (
                            <p className="mt-2 text-sm text-secondary-600">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Compensation & Availability */}
          {(applicantData.expectedSalary ||
            applicantData.availability !== null ||
            applicantData.startDateAvailability ||
            applicantData.remotePreference) && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-secondary-900">
                  <DollarSign className="h-5 w-5" />
                  Compensation & Availability
                </h2>
                <div className="space-y-3">
                  {applicantData.expectedSalary && (
                    <div className="flex items-start gap-2">
                      <span className="text-secondary-600">
                        Expected Salary:
                      </span>
                      <span className="font-medium">
                        ${(applicantData.expectedSalary / 100).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {applicantData.availability !== null && (
                    <div className="flex items-start gap-2">
                      <span className="text-secondary-600">Availability:</span>
                      <span className="font-medium">
                        {applicantData.availability
                          ? "Available"
                          : "Not Available"}
                      </span>
                    </div>
                  )}
                  {applicantData.startDateAvailability && (
                    <div className="flex items-start gap-2">
                      <span className="text-secondary-600">Can Start:</span>
                      <span className="font-medium">
                        {new Date(
                          applicantData.startDateAvailability
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {applicantData.remotePreference && (
                    <div className="flex items-start gap-2">
                      <span className="text-secondary-600">
                        Remote Preference:
                      </span>
                      <span className="font-medium capitalize">
                        {applicantData.remotePreference
                          .toLowerCase()
                          .replace("_", " ")}
                      </span>
                    </div>
                  )}
                  {applicantData.openToContract !== null &&
                    applicantData.openToContract !== undefined && (
                      <div className="flex items-start gap-2">
                        <span className="text-secondary-600">
                          Open to Contract:
                        </span>
                        <span className="font-medium">
                          {applicantData.openToContract ? "Yes" : "No"}
                        </span>
                      </div>
                    )}
                  {applicantData.willingToRelocate !== null &&
                    applicantData.willingToRelocate !== undefined && (
                      <div className="flex items-start gap-2">
                        <span className="text-secondary-600">
                          Willing to Relocate:
                        </span>
                        <span className="font-medium">
                          {applicantData.willingToRelocate ? "Yes" : "No"}
                        </span>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bio */}
          {applicantData.bio && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold text-secondary-900">
                  About
                </h2>
                <p className="whitespace-pre-line text-secondary-700">
                  {applicantData.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Interview Process Section */}
          {interviewRounds &&
            interviewRounds.length > 0 &&
            interviews.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-2xl font-bold text-secondary-900">
                    Interview Process
                  </h2>

                  {interviewRounds && interviewRounds.length > 0 ? (
                    <div className="space-y-3">
                      {interviewRounds.map((round: any, idx: number) => {
                        const roundInterview = interviews.find(
                          (i) =>
                            i.roundNumber === round.order &&
                            i.status !== "CANCELLED"
                        );

                        // Check if previous round is completed
                        const previousRound =
                          idx === 0
                            ? { status: "COMPLETED" } // First round is always unlocked
                            : interviews.find(
                                (i) =>
                                  i.roundNumber === round.order - 1 &&
                                  i.status === "COMPLETED"
                              );

                        const canSchedule =
                          !roundInterview &&
                          (idx === 0 || previousRound?.status === "COMPLETED");

                        // Check if interview is happening soon (within 15 minutes)
                        const isHappeningSoon =
                          roundInterview &&
                          new Date(roundInterview.scheduledAt).getTime() -
                            Date.now() <
                            15 * 60 * 1000 &&
                          new Date(roundInterview.scheduledAt).getTime() >
                            Date.now();

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg border border-secondary-200 p-4"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">
                                {roundInterview?.status === "COMPLETED"
                                  ? "✅"
                                  : roundInterview
                                  ? "📅"
                                  : canSchedule
                                  ? "⏳"
                                  : "🔒"}
                              </span>
                              <div>
                                <h3 className="font-medium text-secondary-900">
                                  Round {round.order}: {round.name}
                                </h3>
                                <p className="text-sm text-secondary-600">
                                  {round.duration} minutes
                                </p>
                                {roundInterview && (
                                  <>
                                    <p className="text-sm text-secondary-500">
                                      {new Date(
                                        roundInterview.scheduledAt
                                      ).toLocaleDateString()}{" "}
                                      at{" "}
                                      {new Date(
                                        roundInterview.scheduledAt
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                    {roundInterview.interviewer && (
                                      <p className="text-xs text-secondary-500">
                                        Interviewer:{" "}
                                        {roundInterview.interviewer.name}
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {/* Completed */}
                              {roundInterview?.status === "COMPLETED" && (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                                  ✓ Completed
                                </span>
                              )}

                              {/* Schedule in Progress - Awaiting Response */}
                              {(roundInterview?.status === "AWAITING_CANDIDATE" ||
                                roundInterview?.status === "AWAITING_CONFIRMATION") && (
                                <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                                  ⏳ Schedule in progress
                                </span>
                              )}

                              {/* Scheduled - Happening Soon */}
                              {roundInterview?.status === "SCHEDULED" &&
                                isHappeningSoon && (
                                  <>
                                    {roundInterview.meetingLink && (
                                      <a
                                        href={roundInterview.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                      >
                                        🎥 Join Meeting
                                      </a>
                                    )}
                                    <button
                                      onClick={() =>
                                        rescheduleInterview(roundInterview.id)
                                      }
                                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                                    >
                                      Reschedule
                                    </button>
                                  </>
                                )}

                              {/* Scheduled - Future */}
                              {roundInterview?.status === "SCHEDULED" &&
                                !isHappeningSoon && (
                                  <>
                                    <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                                      📅 Scheduled
                                    </span>
                                    <button
                                      onClick={() =>
                                        rescheduleInterview(roundInterview.id)
                                      }
                                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                                    >
                                      Reschedule
                                    </button>
                                    <button
                                      onClick={() =>
                                        cancelInterview(roundInterview.id)
                                      }
                                      className="rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                )}

                              {/* Can Schedule */}
                              {canSchedule && !roundInterview && (
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/employer/interviews/availability/${applicantId}?round=${round.order}`
                                    )
                                  }
                                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                  Schedule
                                </button>
                              )}

                              {/* Locked */}
                              {!canSchedule && !roundInterview && (
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                                  🔒 Complete Round {round.order - 1} first
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      <div className="mt-4 text-sm text-secondary-600">
                        Progress:{" "}
                        {
                          interviews.filter((i) => i.status === "COMPLETED")
                            .length
                        }
                        /{interviewRounds.length} rounds completed
                      </div>
                    </div>
                  ) : (
                    <p className="text-secondary-500">
                      No interview process defined for this job
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">
                Interview History
              </h2>

              {isLoadingInterviews ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : interviews && interviews.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-secondary-200">
                      <tr className="text-left">
                        <th className="px-4 py-2 text-sm font-semibold text-secondary-700">
                          Date & Time
                        </th>
                        <th className="px-4 py-2 text-sm font-semibold text-secondary-700">
                          Round
                        </th>
                        <th className="px-4 py-2 text-sm font-semibold text-secondary-700">
                          Status
                        </th>
                        <th className="px-4 py-2 text-sm font-semibold text-secondary-700">
                          Duration
                        </th>
                        <th className="px-4 py-2 text-sm font-semibold text-secondary-700">
                          Interviewer
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {interviews
                        .sort(
                          (a: any, b: any) =>
                            new Date(b.scheduledAt).getTime() -
                            new Date(a.scheduledAt).getTime()
                        )
                        .map((interview: any) => (
                          <tr
                            key={interview.id}
                            className="border-b border-secondary-100 hover:bg-secondary-50 last:border-0"
                          >
                            <td className="px-4 py-3 text-sm text-secondary-900">
                              {new Date(
                                interview.scheduledAt
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(
                                interview.scheduledAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-4 py-3 text-sm text-secondary-900">
                              {interview.roundName ||
                                interview.round ||
                                "Interview Round"}
                            </td>
                            <td className="px-4 py-3">
                              {getInterviewStatusBadge(interview.status)}
                            </td>
                            <td className="px-4 py-3 text-sm text-secondary-700">
                              {interview.duration || 30} min
                            </td>
                            <td className="px-4 py-3 text-sm text-secondary-700">
                              {interview.interviewer?.name || "-"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-secondary-200 bg-secondary-50 p-8 text-center">
                  <Video className="mx-auto mb-3 h-12 w-12 text-secondary-400" />
                  <h3 className="mb-2 text-lg font-semibold text-secondary-900">
                    No Interviews Scheduled
                  </h3>
                  <p className="mb-4 text-sm text-secondary-600">
                    Schedule a video interview with this candidate to discuss
                    the position
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      // Calculate next round to schedule
                      const completedRounds = interviews
                        .filter(
                          (i: any) => i.status === "COMPLETED" && i.roundNumber
                        )
                        .map((i: any) => i.roundNumber);

                      const scheduledRounds = interviews
                        .filter(
                          (i: any) =>
                            i.status !== "CANCELLED" &&
                            i.status !== "COMPLETED" &&
                            i.roundNumber
                        )
                        .map((i: any) => i.roundNumber);

                      // Next round is highest completed + 1, or first available
                      let nextRound = 1;
                      if (completedRounds.length > 0) {
                        nextRound = Math.max(...completedRounds) + 1;
                      } else if (scheduledRounds.length > 0) {
                        // If there's already a scheduled interview, go to next after that
                        nextRound = Math.max(...scheduledRounds) + 1;
                      }

                      // Make sure we don't exceed total rounds
                      if (
                        interviewRounds &&
                        interviewRounds.length > 0 &&
                        nextRound <= interviewRounds.length
                      ) {
                        router.push(
                          `/employer/interviews/availability/${applicantId}?round=${nextRound}`
                        );
                      } else {
                        router.push(
                          `/employer/interviews/availability/${applicantId}`
                        );
                      }
                    }}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Schedule Interview
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cover Letter */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">
                Cover Letter
              </h2>
              <p className="whitespace-pre-line text-secondary-700">
                {applicantData.coverLetter}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Make Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-secondary-900">
                  Make Job Offer
                </h2>
                <button
                  onClick={() => setShowOfferModal(false)}
                  disabled={isCreatingOffer}
                  className="rounded-lg p-2 hover:bg-secondary-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Position */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={offerData.position}
                    onChange={(e) =>
                      setOfferData({ ...offerData, position: e.target.value })
                    }
                    className="w-full rounded-lg border border-secondary-300 p-3 focus:border-primary-500 focus:outline-none"
                    placeholder="e.g., Senior Software Engineer"
                    disabled={isCreatingOffer}
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Annual Salary (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-secondary-400" />
                    <input
                      type="number"
                      value={offerData.salary}
                      onChange={(e) =>
                        setOfferData({ ...offerData, salary: e.target.value })
                      }
                      className="w-full rounded-lg border border-secondary-300 p-3 pl-10 focus:border-primary-500 focus:outline-none"
                      placeholder="100000"
                      disabled={isCreatingOffer}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Equity */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Equity (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={offerData.equity}
                      onChange={(e) =>
                        setOfferData({ ...offerData, equity: e.target.value })
                      }
                      className="w-full rounded-lg border border-secondary-300 p-3 focus:border-primary-500 focus:outline-none"
                      placeholder="0.5"
                      disabled={isCreatingOffer}
                    />
                  </div>

                  {/* Signing Bonus */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Signing Bonus (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-secondary-400" />
                      <input
                        type="number"
                        value={offerData.signingBonus}
                        onChange={(e) =>
                          setOfferData({
                            ...offerData,
                            signingBonus: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-secondary-300 p-3 pl-10 focus:border-primary-500 focus:outline-none"
                        placeholder="10000"
                        disabled={isCreatingOffer}
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Benefits
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {[
                      "Health Insurance",
                      "Dental Insurance",
                      "Vision Insurance",
                      "401(k)",
                      "PTO",
                      "Remote Work",
                      "Gym Membership",
                      "Learning Budget",
                      "Stock Options",
                    ].map((benefit) => (
                      <label
                        key={benefit}
                        className="flex items-center gap-2 rounded-lg border border-secondary-300 p-2 hover:bg-secondary-50"
                      >
                        <input
                          type="checkbox"
                          checked={offerData.benefits.includes(benefit)}
                          onChange={() => handleBenefitToggle(benefit)}
                          disabled={isCreatingOffer}
                          className="h-4 w-4"
                        />
                        <span className="text-sm text-secondary-700">
                          {benefit}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Start Date */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={offerData.startDate}
                      onChange={(e) =>
                        setOfferData({
                          ...offerData,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-secondary-300 p-3 focus:border-primary-500 focus:outline-none"
                      disabled={isCreatingOffer}
                    />
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Offer Expires On
                    </label>
                    <input
                      type="date"
                      value={offerData.expiresAt}
                      onChange={(e) =>
                        setOfferData({
                          ...offerData,
                          expiresAt: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-secondary-300 p-3 focus:border-primary-500 focus:outline-none"
                      placeholder="Defaults to 7 days"
                      disabled={isCreatingOffer}
                    />
                    <p className="mt-1 text-xs text-secondary-500">
                      Defaults to 7 days if not specified
                    </p>
                  </div>
                </div>

                {/* Custom Message */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Personal Message
                  </label>
                  <textarea
                    value={offerData.customMessage}
                    onChange={(e) =>
                      setOfferData({
                        ...offerData,
                        customMessage: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-secondary-300 p-3 focus:border-primary-500 focus:outline-none"
                    rows={4}
                    placeholder="Add a personal message to the candidate..."
                    disabled={isCreatingOffer}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowOfferModal(false)}
                  disabled={isCreatingOffer}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleMakeOffer}
                  disabled={
                    isCreatingOffer ||
                    !offerData.position ||
                    !offerData.salary ||
                    !offerData.startDate
                  }
                  className="flex-1"
                >
                  {isCreatingOffer ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Offer...
                    </>
                  ) : (
                    <>
                      <Gift className="mr-2 h-4 w-4" />
                      Send Offer
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reject Candidate Modal */}
      <RejectCandidateModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        candidateName={applicantData?.name || ""}
        jobTitle={applicantData?.appliedFor || ""}
      />

      {/* Reschedule Interview Modal */}
      <RescheduleInterviewModal
        isOpen={rescheduleModalOpen}
        onClose={() => {
          setRescheduleModalOpen(false);
          setSelectedInterview(null);
        }}
        onConfirm={handleConfirmReschedule}
        candidateName={applicantData?.name || ""}
        jobTitle={applicantData?.appliedFor || ""}
        scheduledDate={selectedInterview?.scheduledAt}
      />
    </div>
  );
}
