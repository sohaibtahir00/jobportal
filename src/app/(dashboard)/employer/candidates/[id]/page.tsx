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
  Briefcase,
  Download,
  MessageSquare,
  Loader2,
  ExternalLink,
  Video,
  Award,
  FileText,
  Building,
  GraduationCap,
  Clock,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { api } from "@/lib/api";

// Backend URL for file downloads
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://job-portal-backend-production-cd05.up.railway.app";

// Helper function to get full resume URL
const getResumeUrl = (resumePath: string | null): string | null => {
  if (!resumePath) return null;
  if (resumePath.startsWith("http://") || resumePath.startsWith("https://")) {
    return resumePath;
  }

  // Normalize path: handle both /uploads/resume/ and /uploads/resumes/
  let normalizedPath = resumePath;
  // Convert /uploads/resume/ (without s) to /uploads/resumes/ (with s)
  if (normalizedPath.includes("/uploads/resume/") && !normalizedPath.includes("/uploads/resumes/")) {
    normalizedPath = normalizedPath.replace("/uploads/resume/", "/uploads/resumes/");
  }

  const apiPath = normalizedPath.startsWith("/uploads/")
    ? normalizedPath.replace("/uploads/", "/api/uploads/")
    : normalizedPath;
  return `${BACKEND_URL}${apiPath}`;
};

export default function CandidateProfilePage() {
  const params = useParams();
  const candidateId = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [candidateData, setCandidateData] = useState<any>(null);

  // Redirect if not logged in or not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/search");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load candidate data
  useEffect(() => {
    const loadCandidate = async () => {
      if (!candidateId) return;

      try {
        setIsLoading(true);
        setError("");

        console.log("🔍 [Candidate Profile] Fetching candidate:", candidateId);

        const response = await api.get(`/api/employer/candidates/${candidateId}`);
        console.log("📦 [Candidate Profile] Response:", response.data);

        const candidate = response.data.candidate;

        if (!candidate) {
          throw new Error("Candidate not found");
        }

        setCandidateData(candidate);
        setIsLoading(false);
      } catch (err: any) {
        console.error("❌ [Candidate Profile] Error:", err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to load candidate profile"
        );
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      loadCandidate();
    }
  }, [candidateId, status]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "ELITE":
        return "text-yellow-600 bg-yellow-50";
      case "ADVANCED":
        return "text-accent-600 bg-accent-50";
      case "PROFICIENT":
        return "text-primary-600 bg-primary-50";
      default:
        return "text-secondary-600 bg-secondary-50";
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending Review</Badge>;
      case "SHORTLISTED":
        return <Badge variant="success">Shortlisted</Badge>;
      case "INTERVIEW_SCHEDULED":
        return <Badge variant="primary">Interview Scheduled</Badge>;
      case "INTERVIEWED":
        return <Badge variant="primary">Interviewed</Badge>;
      case "OFFERED":
        return <Badge variant="primary">Offer Extended</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Rejected</Badge>;
      case "ACCEPTED":
        return <Badge variant="success">Hired</Badge>;
      case "WITHDRAWN":
        return <Badge variant="secondary">Withdrawn</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
      case "AWAITING_CANDIDATE":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
            Awaiting Candidate
          </span>
        );
      case "AWAITING_CONFIRMATION":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
            Action Required
          </span>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <p className="text-secondary-600">Candidate not found</p>
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
            Back to Search
          </Button>

          {/* Header */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Info */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                      {candidateData.user?.image ? (
                        <img
                          src={candidateData.user.image}
                          alt={candidateData.user?.name || "Candidate"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>
                          {(candidateData.user?.name || "C").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div>
                      <h1 className="mb-2 text-3xl font-bold text-secondary-900">
                        {candidateData.user?.name || "Unknown Candidate"}
                      </h1>
                      <p className="mb-4 text-lg text-secondary-600">
                        {candidateData.currentTitle || "No title specified"}
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm text-secondary-600">
                        {candidateData.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {candidateData.location}
                          </span>
                        )}
                        {candidateData.experience && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {candidateData.experience} years experience
                          </span>
                        )}
                        {candidateData.availability && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {candidateData.availability}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {candidateData.testTier && (
                    <div className="flex flex-col items-end gap-2">
                      <div
                        className={`flex items-center gap-1 rounded-lg px-3 py-2 font-bold ${getTierColor(
                          candidateData.testTier
                        )}`}
                      >
                        <Star className="h-5 w-5" />
                        <span>{Math.round(candidateData.testScore || 0)}%</span>
                      </div>
                      <Badge variant="secondary">{candidateData.testTier}</Badge>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3 border-t border-secondary-200 pt-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-secondary-600" />
                    <a
                      href={`mailto:${candidateData.user?.email}`}
                      className="text-primary-600 hover:underline"
                    >
                      {candidateData.user?.email}
                    </a>
                  </div>
                  {candidateData.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-secondary-600" />
                      <a
                        href={`tel:${candidateData.phone}`}
                        className="text-primary-600 hover:underline"
                      >
                        {candidateData.phone}
                      </a>
                    </div>
                  )}
                  {candidateData.linkedIn && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-5 w-5 text-secondary-600" />
                      <a
                        href={candidateData.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {candidateData.github && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-5 w-5 text-secondary-600" />
                      <a
                        href={candidateData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        GitHub Profile
                      </a>
                    </div>
                  )}
                  {candidateData.portfolio && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-5 w-5 text-secondary-600" />
                      <a
                        href={candidateData.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        Portfolio
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
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      router.push(
                        `/employer/messages?candidateId=${candidateData.user?.id}`
                      )
                    }
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                  {candidateData.resume && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const resumeUrl = getResumeUrl(candidateData.resume);
                        if (resumeUrl) {
                          const link = document.createElement("a");
                          link.href = resumeUrl;
                          link.download = `${(candidateData.user?.name || "Candidate").replace(
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
                </div>

                {/* Applications to Your Jobs */}
                {candidateData.applications && candidateData.applications.length > 0 && (
                  <div className="mt-6 border-t border-secondary-200 pt-6">
                    <h4 className="mb-3 text-sm font-semibold text-secondary-700">
                      Applications to Your Jobs
                    </h4>
                    <div className="space-y-2">
                      {candidateData.applications.map((app: any) => (
                        <Link
                          key={app.id}
                          href={`/employer/applicants/${app.id}`}
                          className="block rounded-lg border border-secondary-200 p-3 hover:bg-secondary-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-secondary-900 text-sm">
                              {app.job?.title}
                            </span>
                            {getApplicationStatusBadge(app.status)}
                          </div>
                          <p className="text-xs text-secondary-500">
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bio */}
          {candidateData.bio && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-secondary-900">About</h2>
                <p className="text-secondary-700 whitespace-pre-line">
                  {candidateData.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {candidateData.skills && candidateData.skills.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-secondary-900">
                  <Award className="inline mr-2 h-5 w-5" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {candidateData.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 border border-primary-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Work Experience */}
          {candidateData.workExperiences && candidateData.workExperiences.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-secondary-900">
                  <Building className="inline mr-2 h-5 w-5" />
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {candidateData.workExperiences.map((exp: any, idx: number) => (
                    <div
                      key={idx}
                      className={`${
                        idx !== candidateData.workExperiences.length - 1
                          ? "border-b border-secondary-200 pb-6"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-secondary-900">
                            {exp.jobTitle}
                          </h3>
                          <p className="text-secondary-600">{exp.companyName}</p>
                        </div>
                        {exp.isCurrent && (
                          <Badge variant="success">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-secondary-500 mb-2">
                        {new Date(exp.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {exp.isCurrent
                          ? "Present"
                          : exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "Present"}
                      </p>
                      {exp.description && (
                        <p className="text-secondary-700 text-sm whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {candidateData.educationEntries && candidateData.educationEntries.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-secondary-900">
                  <GraduationCap className="inline mr-2 h-5 w-5" />
                  Education
                </h2>
                <div className="space-y-4">
                  {candidateData.educationEntries.map((edu: any, idx: number) => (
                    <div
                      key={idx}
                      className={`${
                        idx !== candidateData.educationEntries.length - 1
                          ? "border-b border-secondary-200 pb-4"
                          : ""
                      }`}
                    >
                      <h3 className="font-bold text-secondary-900">
                        {edu.degree} in {edu.fieldOfStudy}
                      </h3>
                      <p className="text-secondary-600">{edu.institution}</p>
                      <p className="text-sm text-secondary-500">
                        Graduated {edu.graduationYear}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interview History for Applications */}
          {candidateData.applications && candidateData.applications.some((app: any) => app.interviews?.length > 0) && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-secondary-900">
                  <Video className="inline mr-2 h-5 w-5" />
                  Interview History
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-secondary-200">
                      <tr className="text-left">
                        <th className="px-4 py-2 text-sm font-semibold text-secondary-700">
                          Job
                        </th>
                        <th className="px-4 py-2 text-sm font-semibold text-secondary-700">
                          Date & Time
                        </th>
                        <th className="px-4 py-2 text-sm font-semibold text-secondary-700">
                          Round
                        </th>
                        <th className="px-4 py-2 text-sm font-semibold text-secondary-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidateData.applications
                        .flatMap((app: any) =>
                          (app.interviews || []).map((interview: any) => ({
                            ...interview,
                            jobTitle: app.job?.title,
                            applicationId: app.id,
                          }))
                        )
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
                              <Link
                                href={`/employer/applicants/${interview.applicationId}`}
                                className="hover:text-primary-600 hover:underline"
                              >
                                {interview.jobTitle}
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-sm text-secondary-900">
                              {interview.scheduledAt
                                ? `${new Date(
                                    interview.scheduledAt
                                  ).toLocaleDateString()} at ${new Date(
                                    interview.scheduledAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}`
                                : "Not scheduled"}
                            </td>
                            <td className="px-4 py-3 text-sm text-secondary-900">
                              {interview.roundName ||
                                (interview.roundNumber
                                  ? `Round ${interview.roundNumber}`
                                  : "Interview")}
                            </td>
                            <td className="px-4 py-3">
                              {getInterviewStatusBadge(interview.status)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
