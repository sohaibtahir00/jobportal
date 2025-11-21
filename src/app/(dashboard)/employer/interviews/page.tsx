"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Video,
  Calendar as CalendarIcon,
  Clock,
  User,
  Briefcase,
  Loader2,
  Filter,
  Search,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, Button, Badge, Input } from "@/components/ui";
import { api } from "@/lib/api";

export default function EmployerInterviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all"); // all, upcoming, past
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect if not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/interviews");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load interviews
  useEffect(() => {
    const loadInterviews = async () => {
      if (status !== "authenticated") return;

      try {
        setIsLoading(true);
        const response = await api.get("/api/interviews");
        setInterviews(response.data.interviews || []);
      } catch (err) {
        console.error("Failed to load interviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInterviews();
  }, [status]);

  const handleMarkCompleted = async (interviewId: string) => {
    try {
      await api.patch(`/api/interviews/${interviewId}`, { status: "COMPLETED" });
      // Reload interviews
      const response = await api.get("/api/interviews");
      setInterviews(response.data.interviews || []);
    } catch (err) {
      console.error("Failed to mark interview as completed:", err);
      alert("Failed to update interview status");
    }
  };

  const handleCancelInterview = async (interviewId: string) => {
    if (!confirm("Are you sure you want to cancel this interview?")) return;

    try {
      await api.delete(`/api/interviews/${interviewId}`);
      // Reload interviews
      const response = await api.get("/api/interviews");
      setInterviews(response.data.interviews || []);
    } catch (err) {
      console.error("Failed to cancel interview:", err);
      alert("Failed to cancel interview");
    }
  };

  // Filter and search interviews
  const filteredInterviews = interviews.filter((interview) => {
    const now = new Date();
    const interviewDate = interview.scheduledAt ? new Date(interview.scheduledAt) : null;

    // Filter by time
    if (filter === "upcoming") {
      // Upcoming includes: awaiting responses, awaiting confirmation, and scheduled future interviews
      if (interview.status === "AWAITING_CANDIDATE" || interview.status === "AWAITING_CONFIRMATION") {
        return true;
      }
      if (interviewDate && interviewDate < now) return false;
    }
    if (filter === "past") {
      // Past only includes completed or cancelled with dates in the past
      if (!interviewDate || interviewDate >= now) return false;
    }

    // Search by candidate name or job title
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const candidateName = interview.application?.candidate?.user?.name?.toLowerCase() || "";
      const jobTitle = interview.application?.job?.title?.toLowerCase() || "";
      return candidateName.includes(query) || jobTitle.includes(query);
    }

    return true;
  });

  // Sort by status priority, then by date
  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    // Priority order for statuses
    const statusPriority: Record<string, number> = {
      AWAITING_CONFIRMATION: 1,
      AWAITING_CANDIDATE: 2,
      SCHEDULED: 3,
      COMPLETED: 4,
      CANCELLED: 5,
    };

    const aPriority = statusPriority[a.status] || 99;
    const bPriority = statusPriority[b.status] || 99;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // If same priority, sort by date (or createdAt if no scheduledAt)
    const aDate = a.scheduledAt ? new Date(a.scheduledAt) : new Date(a.createdAt);
    const bDate = b.scheduledAt ? new Date(b.scheduledAt) : new Date(b.createdAt);
    return aDate.getTime() - bDate.getTime();
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_AVAILABILITY":
        return <Badge variant="secondary">Pending</Badge>;
      case "AWAITING_CANDIDATE":
        return <Badge variant="warning">Awaiting Candidate</Badge>;
      case "AWAITING_CONFIRMATION":
        return <Badge variant="warning">Awaiting Your Confirmation</Badge>;
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

  const stats = {
    total: interviews.length,
    awaitingResponse: interviews.filter((i) => i.status === "AWAITING_CANDIDATE" || i.status === "AWAITING_CONFIRMATION").length,
    upcoming: interviews.filter((i) => i.scheduledAt && new Date(i.scheduledAt) >= new Date() && i.status === "SCHEDULED").length,
    completed: interviews.filter((i) => i.status === "COMPLETED").length,
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
          <p className="mt-4 text-secondary-600">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">
              Interview Schedule
            </h1>
            <p className="text-secondary-600">
              Manage all your candidate interviews in one place
            </p>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">
                      Total Interviews
                    </p>
                    <p className="mt-2 text-3xl font-bold text-secondary-900">
                      {stats.total}
                    </p>
                  </div>
                  <CalendarIcon className="h-12 w-12 text-secondary-300" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">
                      Awaiting Response
                    </p>
                    <p className="mt-2 text-3xl font-bold text-warning-600">
                      {stats.awaitingResponse}
                    </p>
                  </div>
                  <Clock className="h-12 w-12 text-warning-300" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Upcoming</p>
                    <p className="mt-2 text-3xl font-bold text-primary-600">
                      {stats.upcoming}
                    </p>
                  </div>
                  <Video className="h-12 w-12 text-primary-300" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">
                      Completed
                    </p>
                    <p className="mt-2 text-3xl font-bold text-success-600">
                      {stats.completed}
                    </p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-success-300" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button
                    variant={filter === "all" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "upcoming" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilter("upcoming")}
                  >
                    Upcoming
                  </Button>
                  <Button
                    variant={filter === "past" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilter("past")}
                  >
                    Past
                  </Button>
                </div>

                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                  <Input
                    type="text"
                    placeholder="Search by candidate or job..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interviews List */}
          {sortedInterviews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="mx-auto mb-4 h-16 w-16 text-secondary-300" />
                <h3 className="mb-2 text-xl font-bold text-secondary-900">
                  No Interviews Found
                </h3>
                <p className="text-secondary-600">
                  {filter === "upcoming"
                    ? "You don't have any upcoming interviews scheduled"
                    : filter === "past"
                    ? "You don't have any past interviews"
                    : "You haven't scheduled any interviews yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedInterviews.map((interview) => {
                const interviewDate = interview.scheduledAt ? new Date(interview.scheduledAt) : null;
                const isUpcoming = interviewDate && interviewDate >= new Date();
                const candidate = interview.application?.candidate;
                const candidateName = candidate?.user?.name || "Unknown Candidate";
                const candidateImage = candidate?.user?.image;
                const jobTitle = interview.application?.job?.title || "Unknown Position";
                const candidateLocation = candidate?.location;
                const candidateSkills = candidate?.skills || [];
                const yearsOfExperience = candidate?.experience;
                const testTier = candidate?.testTier;
                const testScore = candidate?.testScore;
                const currentRole = candidate?.workExperiences?.[0];

                return (
                  <Card key={interview.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          {/* Header with avatar and badges */}
                          <div className="mb-3 flex items-start gap-4">
                            {/* Avatar */}
                            <div className="relative h-14 w-14 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                              {candidateImage ? (
                                <img src={candidateImage} alt={candidateName} className="h-full w-full object-cover" />
                              ) : (
                                <span>{candidateName.charAt(0).toUpperCase()}</span>
                              )}
                            </div>

                            {/* Name, role, and badges */}
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2 flex-wrap">
                                <Badge variant="primary" className="gap-1">
                                  <Video className="h-3 w-3" />
                                  Video
                                </Badge>
                                {getStatusBadge(interview.status)}
                                {testTier ? (
                                  <Badge
                                    variant={testTier === 'ELITE' ? 'success' : testTier === 'ADVANCED' ? 'primary' : 'secondary'}
                                    className="gap-1"
                                  >
                                    {testTier}
                                    {testScore && <span className="ml-1">({Math.round(testScore)}%)</span>}
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="gap-1 bg-gray-100 text-gray-600 border-gray-300">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    No assessment taken
                                  </Badge>
                                )}
                              </div>

                              <h3 className="mb-1 text-lg font-bold text-secondary-900">
                                {candidateName}
                              </h3>

                              {/* Current role/company */}
                              {currentRole && (
                                <p className="text-sm text-secondary-700 mb-1">
                                  {currentRole.jobTitle} at {currentRole.companyName}
                                  {currentRole.isCurrent && <span className="ml-1 text-xs text-green-600">(Current)</span>}
                                </p>
                              )}

                              {/* Job title */}
                              <p className="text-sm text-secondary-600 flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5" />
                                {jobTitle}
                              </p>

                              {/* Location and experience */}
                              <div className="mt-2 flex items-center gap-4 text-sm text-secondary-600">
                                {candidateLocation && (
                                  <span className="flex items-center gap-1">
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {candidateLocation}
                                  </span>
                                )}
                                {yearsOfExperience !== null && yearsOfExperience !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {yearsOfExperience} {yearsOfExperience === 1 ? 'year' : 'years'} exp
                                  </span>
                                )}
                              </div>

                              {/* Skills */}
                              {candidateSkills.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {candidateSkills.slice(0, 5).map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {candidateSkills.length > 5 && (
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                      +{candidateSkills.length - 5} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {interview.status === "AWAITING_CANDIDATE" && (
                            <p className="mb-3 text-sm text-secondary-600">
                              Waiting for candidate to select from your available time slots
                            </p>
                          )}

                          {interview.status === "AWAITING_CONFIRMATION" && (
                            <p className="mb-3 text-sm font-medium text-warning-600">
                              Candidate has selected time slots - please review and confirm
                            </p>
                          )}

                          {interviewDate && (
                            <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                              <span className="flex items-center gap-1.5">
                                <CalendarIcon className="h-4 w-4" />
                                {interviewDate.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {interviewDate.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })} ({interview.duration} min)
                              </span>
                            </div>
                          )}

                          {interview.notes && (
                            <p className="mt-3 text-sm text-secondary-700">
                              <span className="font-medium">Notes:</span> {interview.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 lg:flex-col">
                          {interview.status === "AWAITING_CONFIRMATION" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                router.push(`/employer/interviews/confirm/${interview.id}`)
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Review & Confirm
                            </Button>
                          )}

                          {interview.meetingLink && isUpcoming && (
                            <a
                              href={interview.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-lg border border-primary-600 bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Join Meeting
                            </a>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/employer/applicants/${interview.applicationId}`
                              )
                            }
                          >
                            <User className="mr-2 h-4 w-4" />
                            View Candidate
                          </Button>

                          {interview.status === "SCHEDULED" && isUpcoming && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkCompleted(interview.id)}
                                className="border-green-300 text-green-600 hover:bg-green-50"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Completed
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelInterview(interview.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
