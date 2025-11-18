"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Building,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Plus,
  Download,
  MessageSquare,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

interface Interview {
  id: string;
  jobTitle: string;
  companyName: string;
  type: "phone" | "video" | "onsite";
  status: "upcoming" | "completed" | "cancelled";
  date: string;
  time: string;
  duration: string;
  location?: string;
  meetingLink?: string;
  interviewerName: string;
  interviewerTitle: string;
  round: string;
  notes?: string;
}

export default function CandidateInterviewsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [pendingInterviews, setPendingInterviews] = useState<any[]>([]);

  // Redirect if not logged in or not candidate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/candidate/interviews");
    }
    if (status === "authenticated" && session?.user?.role !== "CANDIDATE") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load pending interview requests (awaiting candidate selection OR employer confirmation)
  useEffect(() => {
    const loadPendingInterviews = async () => {
      if (status !== "authenticated") return;

      try {
        const { api } = await import("@/lib/api");
        // Fetch both AWAITING_CANDIDATE and AWAITING_CONFIRMATION interviews
        const [awaitingCandidate, awaitingConfirmation] = await Promise.all([
          api.get("/api/interviews?status=AWAITING_CANDIDATE"),
          api.get("/api/interviews?status=AWAITING_CONFIRMATION"),
        ]);

        const allPending = [
          ...(awaitingCandidate.data.interviews || []),
          ...(awaitingConfirmation.data.interviews || []),
        ];
        setPendingInterviews(allPending);
      } catch (error) {
        console.error("Failed to load pending interviews:", error);
      }
    };

    loadPendingInterviews();
  }, [status]);

  // Load interviews (both scheduled from backend and mock data)
  useEffect(() => {
    const loadInterviews = async () => {
      if (status !== "authenticated") return;

      try {
        // Load all interviews from backend (all statuses)
        const { api } = await import("@/lib/api");
        const response = await api.get("/api/interviews");
        const allBackendInterviews = response.data.interviews || [];

        // Transform backend interviews to match mock format
        // Include both SCHEDULED and COMPLETED interviews
        const scheduledInterviews = allBackendInterviews.filter((interview: any) =>
          interview.status === "SCHEDULED" || interview.status === "COMPLETED"
        );

        const transformedInterviews = scheduledInterviews.map((interview: any) => {
          const scheduledDate = new Date(interview.scheduledAt);
          const now = new Date();

          // Determine status: if marked as COMPLETED in DB, show completed regardless of date
          let displayStatus = "upcoming";
          if (interview.status === "COMPLETED") {
            displayStatus = "completed";
          } else if (scheduledDate < now) {
            displayStatus = "completed";
          }

          return {
            id: interview.id,
            jobTitle: interview.application?.job?.title || "Unknown Position",
            companyName: interview.application?.job?.employer?.companyName || "Company Name",
            type: interview.type?.toLowerCase() || "video",
            status: displayStatus,
            date: scheduledDate.toISOString().split("T")[0],
            time: scheduledDate.toTimeString().slice(0, 5),
            duration: `${interview.duration} minutes`,
            meetingLink: interview.meetingLink,
            interviewerName: "Hiring Manager",
            interviewerTitle: "Employer",
            round: interview.round || "Interview Round",
            notes: interview.notes,
          };
        });

        // Mock data
        const mockInterviews: Interview[] = [
          {
            id: "1",
            jobTitle: "Senior ML Engineer",
            companyName: "TechCorp AI",
            type: "video",
            status: "upcoming",
            date: "2025-01-15",
            time: "14:00",
            duration: "60 minutes",
            meetingLink: "https://zoom.us/j/123456789",
            interviewerName: "Jane Smith",
            interviewerTitle: "Engineering Manager",
            round: "Technical Round (Round 2 of 3)",
            notes: "Please prepare to discuss your experience with PyTorch and model deployment.",
          },
          {
            id: "2",
            jobTitle: "Backend Engineer",
            companyName: "DataStart Inc",
            type: "phone",
            status: "upcoming",
            date: "2025-01-12",
            time: "10:30",
            duration: "30 minutes",
            interviewerName: "Mike Johnson",
            interviewerTitle: "Tech Lead",
            round: "Screening Call (Round 1 of 3)",
          },
          {
            id: "3",
            jobTitle: "Full Stack Developer",
            companyName: "FinTech Solutions",
            type: "onsite",
            status: "upcoming",
            date: "2025-01-18",
            time: "09:00",
            duration: "4 hours",
            location: "123 Market St, San Francisco, CA 94103",
            interviewerName: "Sarah Lee",
            interviewerTitle: "CTO",
            round: "Onsite Interview (Final Round)",
            notes: "Full day interview including lunch with the team. Bring portfolio and be prepared for live coding.",
          },
          {
            id: "4",
            jobTitle: "DevOps Engineer",
            companyName: "CloudTech Inc",
            type: "video",
            status: "completed",
            date: "2025-01-08",
            time: "15:00",
            duration: "45 minutes",
            meetingLink: "https://meet.google.com/abc-defg-hij",
            interviewerName: "Robert Brown",
            interviewerTitle: "DevOps Lead",
            round: "Technical Round (Round 2 of 2)",
          },
          {
            id: "5",
            jobTitle: "Frontend Developer",
            companyName: "StartupXYZ",
            type: "phone",
            status: "cancelled",
            date: "2025-01-10",
            time: "11:00",
            duration: "30 minutes",
            interviewerName: "Emily Davis",
            interviewerTitle: "Hiring Manager",
            round: "Initial Screening",
          },
        ];

        // Combine backend interviews with mock data
        const allInterviews = [...transformedInterviews, ...mockInterviews];
        setInterviews(allInterviews);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load interviews:", error);
        setIsLoading(false);
      }
    };

    loadInterviews();
  }, [status]);

  const filteredInterviews = interviews.filter((interview) => {
    if (filter === "all") return true;
    return interview.status === filter;
  });

  const upcomingCount = interviews.filter((i) => i.status === "upcoming").length;
  const completedCount = interviews.filter((i) => i.status === "completed").length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "phone":
        return <Phone className="h-5 w-5" />;
      case "onsite":
        return <Building className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="primary">Upcoming</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 0) return `In ${diffDays} days`;
    return "";
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading interviews...</p>
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
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-secondary-900">Interviews</h1>
              <p className="text-secondary-600">Manage your upcoming and past interviews</p>
            </div>
            <Button variant="primary" asChild>
              <Link href="/candidate/dashboard">
                <Calendar className="mr-2 h-5 w-5" />
                View Calendar
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="mx-auto mb-3 h-8 w-8 text-primary-600" />
                <div className="mb-1 text-3xl font-bold text-secondary-900">
                  {upcomingCount}
                </div>
                <div className="text-sm text-secondary-600">Upcoming Interviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-success-600" />
                <div className="mb-1 text-3xl font-bold text-secondary-900">
                  {completedCount}
                </div>
                <div className="text-sm text-secondary-600">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="mx-auto mb-3 h-8 w-8 text-accent-600" />
                <div className="mb-1 text-3xl font-bold text-secondary-900">
                  {interviews.length}
                </div>
                <div className="text-sm text-secondary-600">Total Interviews</div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Interview Requests - Awaiting Time Selection or Employer Confirmation */}
          {pendingInterviews.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-warning-600" />
                <h2 className="text-2xl font-bold text-secondary-900">
                  Interview Requests In Progress
                </h2>
                <Badge variant="warning">{pendingInterviews.length}</Badge>
              </div>
              <div className="space-y-4">
                {pendingInterviews.map((interview) => {
                  const isAwaitingCandidate = interview.status === "AWAITING_CANDIDATE";
                  const isAwaitingConfirmation = interview.status === "AWAITING_CONFIRMATION";

                  return (
                    <Card
                      key={interview.id}
                      className={`border-2 ${
                        isAwaitingCandidate
                          ? "border-warning-200 bg-warning-50"
                          : "border-blue-200 bg-blue-50"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            <h3 className="mb-1 text-xl font-bold text-secondary-900">
                              {interview.application?.job?.title || "Unknown Position"}
                            </h3>
                            <p className="mb-3 text-secondary-600">
                              {isAwaitingCandidate
                                ? "Employer has sent you available time slots for an interview"
                                : "You've selected your preferred times - waiting for employer to confirm"}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {isAwaitingCandidate ? (
                                <Badge variant="warning">Action Required</Badge>
                              ) : (
                                <Badge variant="primary">Awaiting Employer Confirmation</Badge>
                              )}
                              <Badge variant="secondary" size="sm">
                                <Video className="mr-1 h-3 w-3" />
                                {interview.type === "VIDEO" ? "Video Interview" : interview.type}
                              </Badge>
                              <Badge variant="secondary" size="sm">
                                {interview.duration} minutes
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {isAwaitingCandidate ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  router.push(`/candidate/interviews/select/${interview.id}`)
                                }
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Select Time Slots
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(`/candidate/interviews/select/${interview.id}`)
                                }
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Change Selection
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-secondary-700 hover:bg-secondary-100"
              }`}
            >
              All ({interviews.length})
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === "upcoming"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-secondary-700 hover:bg-secondary-100"
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === "completed"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-secondary-700 hover:bg-secondary-100"
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === "cancelled"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-secondary-700 hover:bg-secondary-100"
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Interview List */}
          <div className="space-y-4">
            {filteredInterviews.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="mx-auto mb-4 h-16 w-16 text-secondary-300" />
                  <h3 className="mb-2 text-xl font-bold text-secondary-900">
                    No interviews found
                  </h3>
                  <p className="mb-6 text-secondary-600">
                    {filter === "all"
                      ? "You don't have any scheduled interviews yet."
                      : `You don't have any ${filter} interviews.`}
                  </p>
                  <Button variant="primary" asChild>
                    <Link href="/candidate/jobs">Browse Jobs</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredInterviews.map((interview) => (
                <Card key={interview.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="mb-1 text-xl font-bold text-secondary-900">
                              {interview.jobTitle}
                            </h3>
                            <p className="mb-2 text-secondary-600">{interview.companyName}</p>
                            <div className="flex flex-wrap gap-2">
                              {getStatusBadge(interview.status)}
                              <Badge variant="secondary" size="sm">
                                {getTypeIcon(interview.type)}
                                <span className="ml-1 capitalize">{interview.type}</span>
                              </Badge>
                              <Badge variant="secondary" size="sm">
                                {interview.round}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4 space-y-2 text-sm text-secondary-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-secondary-500" />
                            <span>{formatDate(interview.date)}</span>
                            {interview.status === "upcoming" && (
                              <Badge variant="primary" size="sm">
                                {getDaysUntil(interview.date)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-secondary-500" />
                            <span>
                              {interview.time} ({interview.duration})
                            </span>
                          </div>
                          {interview.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-secondary-500" />
                              <span>{interview.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-secondary-500" />
                            <span>
                              {interview.interviewerName} - {interview.interviewerTitle}
                            </span>
                          </div>
                        </div>

                        {interview.notes && (
                          <div className="rounded-lg bg-yellow-50 p-3">
                            <div className="mb-1 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-semibold text-yellow-900">
                                Notes
                              </span>
                            </div>
                            <p className="text-sm text-yellow-800">{interview.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 lg:w-48">
                        {interview.status === "upcoming" && (
                          <>
                            {interview.meetingLink && (
                              <Button variant="primary" size="sm" className="w-full" asChild>
                                <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <Video className="mr-2 h-4 w-4" />
                                  Join Meeting
                                </a>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" className="w-full">
                              <Download className="mr-2 h-4 w-4" />
                              Add to Calendar
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Message
                            </Button>
                          </>
                        )}
                        {interview.status === "completed" && (
                          <Button variant="outline" size="sm" className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Follow Up
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Preparation Tips */}
          {upcomingCount > 0 && (
            <Card className="mt-8 bg-gradient-to-br from-primary-50 to-accent-50">
              <CardContent className="p-8">
                <h3 className="mb-4 text-xl font-bold text-secondary-900">
                  Interview Preparation Tips
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600" />
                    <div>
                      <p className="font-semibold text-secondary-900">Research the Company</p>
                      <p className="text-sm text-secondary-600">
                        Learn about their products, culture, and recent news
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600" />
                    <div>
                      <p className="font-semibold text-secondary-900">Review the Job Description</p>
                      <p className="text-sm text-secondary-600">
                        Match your experience to key requirements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600" />
                    <div>
                      <p className="font-semibold text-secondary-900">Prepare Questions</p>
                      <p className="text-sm text-secondary-600">
                        Have thoughtful questions ready for the interviewer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600" />
                    <div>
                      <p className="font-semibold text-secondary-900">Test Your Setup</p>
                      <p className="text-sm text-secondary-600">
                        For video interviews, check camera, mic, and internet
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
