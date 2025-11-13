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
import { Button, Badge, Card, CardContent, Progress } from "@/components/ui";
import { api } from "@/lib/api";

export default function ApplicantDetailPage() {
  const params = useParams();
  const applicantId = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [applicantData, setApplicantData] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(false);

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
        const response = await api.get(`/api/employer/applications/${applicantId}`);
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
          experience: app.candidate.experience ? `${app.candidate.experience} years` : "Not specified",
          currentRole: app.candidate.currentTitle || "Not specified",
          currentCompany: app.candidate.currentCompany,
          education: "Not specified", // TODO: Add if available in schema
          resume: app.candidate.resume,
          linkedin: null, // TODO: Add if available
          github: null, // TODO: Add if available
          portfolio: null, // TODO: Add if available

          // Skills Assessment
          skillsScore: app.candidate.testScore || 0,
          tier: app.candidate.testTier || "Not Assessed",
          percentile: app.candidate.testPercentile,
          assessmentDate: null, // TODO: Add if available
          hasTakenTest: app.candidate.hasTakenTest,

          sectionScores: app.testResults || [],

          skills: app.candidate.skills ? app.candidate.skills.map((skill: string) => ({
            name: skill,
            level: 0, // TODO: Add if skill levels available
          })) : [],

          // Work Experience - would need separate API or schema update
          workExperience: [],

          // Application Status
          applicationStatus: app.status.toLowerCase(),
          appliedFor: app.job.title,
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
          console.error("⚠️ [Applicant Detail] Failed to record profile view:", viewErr);
        }
      } catch (err: any) {
        console.error("❌ [Applicant Detail] Error:", err);
        setError(err.response?.data?.error || err.message || "Failed to load applicant details");
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
      const response = await api.get(`/api/interviews?applicationId=${applicantId}`);
      setInterviews(response.data.interviews || []);
    } catch (err) {
      console.error("Failed to load interviews:", err);
    } finally {
      setIsLoadingInterviews(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && applicantId) {
      loadInterviews();
    }
  }, [applicantId, status]);

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

  const handleMarkCompleted = async (interviewId: string) => {
    try {
      await api.patch(`/api/interviews/${interviewId}`, { status: "COMPLETED" });
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
      const expirationDate = offerData.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

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

      alert("Offer sent successfully!");
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
          <p className="mt-4 text-secondary-600">Loading applicant details...</p>
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
                        Applied {new Date(applicantData.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className={`flex items-center gap-1 rounded-lg px-3 py-2 font-bold ${getTierColor(applicantData.tier)}`}>
                      <Star className="h-5 w-5" />
                      <span>{applicantData.skillsScore}</span>
                    </div>
                    <Badge variant="secondary">{applicantData.tier}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-secondary-600" />
                    <a href={`mailto:${applicantData.email}`} className="text-primary-600 hover:underline">
                      {applicantData.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-secondary-600" />
                    <a href={`tel:${applicantData.phone}`} className="text-primary-600 hover:underline">
                      {applicantData.phone}
                    </a>
                  </div>
                  {applicantData.linkedin && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-5 w-5 text-secondary-600" />
                      <a href={applicantData.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
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
                    onClick={() => router.push(`/employer/interviews/availability/${applicantId}`)}
                  >
                    <Video className="mr-2 h-5 w-5" />
                    Schedule Interview
                  </Button>
                  {(applicantData.applicationStatus === "shortlisted" ||
                    interviews.some((interview) => interview.status === "COMPLETED")) && (
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
                    onClick={() => router.push(`/employer/messages?candidateId=${applicantData.candidateUserId}`)}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-5 w-5" />
                    Download Resume
                  </Button>
                  <Button variant="outline" className="w-full border-green-300 text-green-600 hover:bg-green-50">
                    <Check className="mr-2 h-5 w-5" />
                    Move to Interview
                  </Button>
                  <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
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
                    Completed on {new Date(applicantData.assessmentDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="mb-1 text-4xl font-bold text-success-600">
                    {applicantData.skillsScore}
                  </div>
                  <Badge variant="success">Top {applicantData.percentile}%</Badge>
                </div>
              </div>

              {/* Section Breakdown */}
              <div className="mb-6 space-y-4">
                {applicantData.sectionScores.map((section: any, idx: number) => (
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
                ))}
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
                      <div className="text-sm text-secondary-700">{skill.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="mb-6 text-2xl font-bold text-secondary-900">
                Work Experience
              </h2>
              <div className="space-y-6">
                {applicantData.workExperience.map((job: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-primary-200 pl-6">
                    <h3 className="mb-1 text-lg font-bold text-secondary-900">
                      {job.title}
                    </h3>
                    <div className="mb-2 flex items-center gap-3 text-sm text-secondary-600">
                      <span className="font-medium">{job.company}</span>
                      <span>•</span>
                      <span>{job.duration}</span>
                    </div>
                    <p className="text-secondary-700">{job.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interviews Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-secondary-900">
                  Scheduled Interviews
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/employer/interviews/availability/${applicantId}`)}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Schedule New
                </Button>
              </div>

              {isLoadingInterviews ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : interviews.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-secondary-200 bg-secondary-50 p-8 text-center">
                  <Video className="mx-auto mb-3 h-12 w-12 text-secondary-400" />
                  <h3 className="mb-2 text-lg font-semibold text-secondary-900">
                    No Interviews Scheduled
                  </h3>
                  <p className="mb-4 text-sm text-secondary-600">
                    Schedule a video interview with this candidate to discuss the position
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/employer/interviews/availability/${applicantId}`)}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Schedule Interview
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary-200 text-left text-sm font-semibold text-secondary-700">
                        <th className="pb-3">Date & Time</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Duration</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interviews.map((interview) => (
                        <tr
                          key={interview.id}
                          className="border-b border-secondary-100 last:border-0"
                        >
                          <td className="py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-secondary-900">
                                {new Date(interview.scheduledAt).toLocaleDateString()}
                              </span>
                              <span className="text-sm text-secondary-600">
                                {new Date(interview.scheduledAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant="primary" size="sm" className="gap-1">
                              <Video className="h-3 w-3" />
                              Video
                            </Badge>
                          </td>
                          <td className="py-4 text-sm text-secondary-700">
                            {interview.duration} min
                          </td>
                          <td className="py-4">
                            {getInterviewStatusBadge(interview.status)}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-end gap-2">
                              {interview.meetingLink && (
                                <a
                                  href={interview.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-lg border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100"
                                >
                                  Join Meeting
                                </a>
                              )}
                              {interview.status === "SCHEDULED" && (
                                <>
                                  <button
                                    onClick={() => handleMarkCompleted(interview.id)}
                                    className="rounded-lg border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                                    title="Mark as Completed"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleCancelInterview(interview.id)}
                                    className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                                    title="Cancel Interview"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <h2 className="text-2xl font-bold text-secondary-900">Make Job Offer</h2>
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
                    onChange={(e) => setOfferData({ ...offerData, position: e.target.value })}
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
                      onChange={(e) => setOfferData({ ...offerData, salary: e.target.value })}
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
                      onChange={(e) => setOfferData({ ...offerData, equity: e.target.value })}
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
                          setOfferData({ ...offerData, signingBonus: e.target.value })
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
                        <span className="text-sm text-secondary-700">{benefit}</span>
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
                      onChange={(e) => setOfferData({ ...offerData, startDate: e.target.value })}
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
                      onChange={(e) => setOfferData({ ...offerData, expiresAt: e.target.value })}
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
                      setOfferData({ ...offerData, customMessage: e.target.value })
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
    </div>
  );
}
