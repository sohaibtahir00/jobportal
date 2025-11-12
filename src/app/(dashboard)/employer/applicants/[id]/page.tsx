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
          <p className="mt-4 text-secondary-600">Loading applicant details...</p>
        </div>
      </div>
    );
  }

  if (!session || !applicantData) {
    return null;
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
                  <Button variant="primary" className="w-full">
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
    </div>
  );
}
