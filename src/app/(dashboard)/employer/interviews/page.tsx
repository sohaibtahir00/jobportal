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
  FileText,
  AlertCircle,
  Target,
  Star,
  X,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, Button, Badge, Input } from "@/components/ui";
import { api } from "@/lib/api";
import NotesModal from "@/components/interviews/NotesModal";
import InterviewActionsDropdown from "@/components/interviews/InterviewActionsDropdown";
import DecisionModal from "@/components/interviews/DecisionModal";
import SendFeedbackModal from "@/components/interviews/SendFeedbackModal";
import ReviewCandidateModal from "@/components/interviews/ReviewCandidateModal";
import RejectCandidateModal from "@/components/interviews/RejectCandidateModal";
import RescheduleInterviewModal from "@/components/interviews/RescheduleInterviewModal";
import CompletedInterviewActionsDropdown from "@/components/interviews/CompletedInterviewActionsDropdown";

export default function EmployerInterviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all"); // all, upcoming, past
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [skillsFilter, setSkillsFilter] = useState<string>("all");
  const [roundFilter, setRoundFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [nextRoundInfo, setNextRoundInfo] = useState<string>("");
  const [pastSectionExpanded, setPastSectionExpanded] = useState(false);

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
      await api.patch(`/api/interviews/${interviewId}`, {
        status: "COMPLETED",
      });
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

  const handleOpenNotesModal = (interview: any) => {
    setSelectedInterview(interview);
    setNotesModalOpen(true);
  };

  const handleSaveNotes = async (notes: string) => {
    if (!selectedInterview) return;

    try {
      await api.patch(`/api/interviews/${selectedInterview.id}`, { notes });
      // Reload interviews
      const response = await api.get("/api/interviews");
      setInterviews(response.data.interviews || []);
    } catch (err) {
      console.error("Failed to save notes:", err);
      throw new Error("Failed to save notes. Please try again.");
    }
  };

  const handleOpenDecisionModal = async (interview: any) => {
    setSelectedInterview(interview);
    setDecisionModalOpen(true);

    // Calculate next round info
    try {
      // Get all interviews for this application
      const response = await api.get(
        `/api/interviews?applicationId=${interview.applicationId}`
      );
      const applicationInterviews = response.data.interviews || [];

      // Get interview rounds for this job
      const roundsResponse = await api.get(
        `/api/employer/jobs/${interview.application.job.id}/interview-rounds`
      );
      const interviewRounds = roundsResponse.data.rounds || [];

      // Calculate next round to schedule
      const completedRounds = applicationInterviews
        .filter((i: any) => i.status === "COMPLETED" && i.roundNumber)
        .map((i: any) => i.roundNumber);

      const scheduledRounds = applicationInterviews
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
        nextRound = Math.max(...scheduledRounds) + 1;
      }

      // Get the round name from interview rounds
      if (
        interviewRounds &&
        interviewRounds.length > 0 &&
        nextRound <= interviewRounds.length
      ) {
        const round = interviewRounds.find(
          (r: any) => r.roundNumber === nextRound
        );
        if (round) {
          setNextRoundInfo(`Round ${nextRound}: ${round.name}`);
        } else {
          setNextRoundInfo(`Round ${nextRound}`);
        }
      } else {
        setNextRoundInfo("Next Round");
      }
    } catch (err) {
      console.error("Failed to get next round info:", err);
      setNextRoundInfo("Next Round");
    }
  };

  const handleOpenFeedbackModal = (interview: any) => {
    setSelectedInterview(interview);
    setFeedbackModalOpen(true);
  };

  const handleSaveFeedback = async (feedback: string) => {
    if (!selectedInterview) return;

    try {
      await api.patch(`/api/interviews/${selectedInterview.id}`, { feedback });
      // Reload interviews
      const response = await api.get("/api/interviews");
      setInterviews(response.data.interviews || []);
    } catch (err) {
      console.error("Failed to save feedback:", err);
      throw new Error("Failed to save feedback. Please try again.");
    }
  };

  const handleOpenReviewModal = (interview: any) => {
    setSelectedInterview(interview);
    setReviewModalOpen(true);
  };

  const handleSaveReview = async (reviewData: any) => {
    if (!selectedInterview) return;

    try {
      await api.post(
        `/api/interviews/${selectedInterview.id}/review`,
        reviewData
      );

      // Reload interviews to show new review
      const response = await api.get("/api/interviews");
      setInterviews(response.data.interviews || []);

      setReviewModalOpen(false);
      setSelectedInterview(null);
    } catch (err) {
      console.error("Failed to save review:", err);
      throw new Error("Failed to save review. Please try again.");
    }
  };

  const handleScheduleNextRound = async (interview: any) => {
    try {
      // Get all interviews for this application
      const response = await api.get(
        `/api/interviews?applicationId=${interview.applicationId}`
      );
      const applicationInterviews = response.data.interviews || [];

      // Get interview rounds for this job
      const roundsResponse = await api.get(
        `/api/employer/jobs/${interview.application.job.id}/interview-rounds`
      );
      const interviewRounds = roundsResponse.data.rounds || [];

      // Calculate next round to schedule
      const completedRounds = applicationInterviews
        .filter((i: any) => i.status === "COMPLETED" && i.roundNumber)
        .map((i: any) => i.roundNumber);

      const scheduledRounds = applicationInterviews
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
          `/employer/interviews/availability/${interview.applicationId}?round=${nextRound}`
        );
      } else {
        router.push(
          `/employer/interviews/availability/${interview.applicationId}`
        );
      }
    } catch (err) {
      console.error("Failed to calculate next round:", err);
      // Fallback to basic navigation
      router.push(
        `/employer/interviews/availability/${interview.applicationId}`
      );
    }
  };

  const handleMoveToOffer = (interview: any) => {
    router.push(
      `/employer/offers/new?applicationId=${interview.applicationId}`
    );
  };

  const handleOpenRejectModal = (interview: any) => {
    setSelectedInterview(interview);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (rejectionReason?: string) => {
    console.log("handleConfirmReject called with:", {
      selectedInterview: selectedInterview?.id,
      applicationId: selectedInterview?.applicationId,
      rejectionReason,
    });

    if (!selectedInterview) {
      console.error("No selected interview");
      return;
    }

    try {
      console.log("Sending PATCH request to reject candidate...");
      await api.patch(
        `/api/applications/${selectedInterview.applicationId}/status`,
        {
          status: "REJECTED",
          rejectionReason,
        }
      );
      console.log("Rejection successful, reloading interviews...");

      // Reload interviews
      const response = await api.get("/api/interviews");
      setInterviews(response.data.interviews || []);
      console.log("Interviews reloaded successfully");
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
        alert("Failed to reject candidate");
      }
      throw err; // Re-throw to let modal handle loading state
    }
  };

  const handleOpenRescheduleModal = (interview: any) => {
    setSelectedInterview(interview);
    setRescheduleModalOpen(true);
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
      const interviewsResponse = await api.get("/api/interviews");
      setInterviews(interviewsResponse.data.interviews || []);
      console.log("Interviews reloaded successfully");

      // Redirect to availability page to set new availability
      const applicationId = response.data.applicationId;
      if (applicationId) {
        router.push(
          `/employer/interviews/availability/${applicationId}?interviewId=${selectedInterview.id}`
        );
      }
    } catch (err: any) {
      console.error("Failed to reschedule interview:", err);
      alert(err?.response?.data?.error || "Failed to reschedule interview");
      throw err; // Re-throw to let modal handle loading state
    }
  };

  // Extract unique jobs from interviews
  const uniqueJobs = Array.from(
    new Map(
      interviews
        .map((interview) => interview.application?.job)
        .filter((job) => job) // Remove null/undefined
        .map((job) => [job.id, job]) // Create [id, job] pairs for Map
    ).values()
  ).sort((a, b) => a.title.localeCompare(b.title));

  // Get count of interviews per job
  const getJobInterviewCount = (jobId: string) => {
    return interviews.filter((i) => i.application?.job?.id === jobId).length;
  };

  // Get filter counts
  const getStatusCount = (status: string) => {
    if (status === "action-required") {
      return interviews.filter((i) => i.status === "AWAITING_CONFIRMATION")
        .length;
    }
    if (status === "scheduled") {
      return interviews.filter((i) => i.status === "SCHEDULED").length;
    }
    if (status === "completed") {
      return interviews.filter((i) => i.status === "COMPLETED").length;
    }
    return interviews.length;
  };

  const getSkillsCount = (filter: string) => {
    if (filter === "verified") {
      return interviews.filter((i) => i.application?.candidate?.testTier)
        .length;
    }
    if (filter === "not-tested") {
      return interviews.filter((i) => !i.application?.candidate?.testTier)
        .length;
    }
    return interviews.length;
  };

  const getRoundCount = (round: string) => {
    if (round === "1") {
      return interviews.filter((i) => i.roundNumber === 1).length;
    }
    if (round === "2") {
      return interviews.filter((i) => i.roundNumber === 2).length;
    }
    if (round === "3+") {
      return interviews.filter((i) => i.roundNumber && i.roundNumber >= 3)
        .length;
    }
    return interviews.length;
  };

  const getRatingCount = (rating: string) => {
    const completedWithReview = interviews.filter(
      (i) => i.status === "COMPLETED" && i.review
    );

    if (rating === "not-reviewed") {
      return interviews.filter((i) => i.status === "COMPLETED" && !i.review)
        .length;
    }
    if (rating === "5") {
      return completedWithReview.filter((i) => i.review.overallRating === 5)
        .length;
    }
    if (rating === "4") {
      return completedWithReview.filter((i) => i.review.overallRating === 4)
        .length;
    }
    if (rating === "3") {
      return completedWithReview.filter((i) => i.review.overallRating === 3)
        .length;
    }
    if (rating === "2") {
      return completedWithReview.filter((i) => i.review.overallRating === 2)
        .length;
    }
    if (rating === "1") {
      return completedWithReview.filter((i) => i.review.overallRating === 1)
        .length;
    }
    if (rating === "0") {
      return completedWithReview.filter((i) => i.review.overallRating === 0)
        .length;
    }
    return interviews.filter((i) => i.status === "COMPLETED").length;
  };

  // Check if any interviews have round data
  const hasRoundData = interviews.some((i) => i.roundNumber);

  // Check if any filter is active
  const hasActiveFilters =
    statusFilter !== "all" ||
    skillsFilter !== "all" ||
    roundFilter !== "all" ||
    ratingFilter !== "all" ||
    selectedJobId !== "" ||
    searchQuery !== "";

  // Clear all filters and collapse past interviews
  const clearAllFilters = () => {
    setStatusFilter("all");
    setSkillsFilter("all");
    setRoundFilter("all");
    setRatingFilter("all");
    setSelectedJobId("");
    setSearchQuery("");
    setPastSectionExpanded(false);
  };

  // Helper function to parse interview notes and extract reschedule info
  const parseInterviewNotes = (notes: string | null) => {
    if (!notes)
      return {
        displayNotes: null,
        rescheduleReason: null,
        isPendingReschedule: false,
        candidateRescheduleRequest: null,
      };

    let workingNotes = notes;
    let candidateRescheduleRequest: string | null = null;
    let rescheduleReason: string | null = null;
    let isPendingReschedule = false;

    // Check for candidate reschedule request [RESCHEDULE_REQUESTED]: reason - Requested by candidate on date
    const rescheduleRequestMatch = workingNotes.match(/\[RESCHEDULE_REQUESTED\]: ([^-]+)(?:- Requested by candidate on ([^\n]+))?/);
    if (rescheduleRequestMatch) {
      candidateRescheduleRequest = rescheduleRequestMatch[1].trim();
      // Remove the entire reschedule request from notes
      workingNotes = workingNotes.replace(/\[RESCHEDULE_REQUESTED\]: [^\n]+(\n\n)?/g, '').trim();
    }

    // Check if this is a pending reschedule (not yet sent to candidate)
    if (workingNotes.includes("[PENDING_RESCHEDULE]")) {
      const parts = workingNotes.split("[PENDING_RESCHEDULE]");
      workingNotes = parts[0].trim();
      rescheduleReason = parts[1]?.trim() || null;
      isPendingReschedule = true;
    }

    // Check if this is a rescheduled interview (already sent to candidate)
    if (workingNotes.includes("[Rescheduled from previous interview]")) {
      const parts = workingNotes.split("[Rescheduled from previous interview]");
      workingNotes = parts[0].trim();
      rescheduleReason = parts[1]?.trim() || null;
      isPendingReschedule = false;
    }

    return {
      displayNotes: workingNotes || null,
      rescheduleReason,
      isPendingReschedule,
      candidateRescheduleRequest,
    };
  };

  // Filter and search interviews
  const filteredInterviews = interviews.filter((interview) => {
    const now = new Date();
    const interviewDate = interview.scheduledAt
      ? new Date(interview.scheduledAt)
      : null;

    // Filter by time (legacy - keep for backward compatibility)
    if (filter === "upcoming") {
      // Upcoming includes: awaiting responses, awaiting confirmation, and scheduled future interviews
      if (
        interview.status === "AWAITING_CANDIDATE" ||
        interview.status === "AWAITING_CONFIRMATION"
      ) {
        return true;
      }
      if (interviewDate && interviewDate < now) return false;
    }
    if (filter === "past") {
      // Past only includes completed or cancelled with dates in the past
      if (!interviewDate || interviewDate >= now) return false;
    }

    // Filter by status
    if (statusFilter === "action-required") {
      if (interview.status !== "AWAITING_CONFIRMATION") return false;
    }
    if (statusFilter === "scheduled") {
      if (interview.status !== "SCHEDULED") return false;
    }
    if (statusFilter === "completed") {
      if (interview.status !== "COMPLETED") return false;
    }

    // Filter by skills verification
    if (skillsFilter === "verified") {
      if (!interview.application?.candidate?.testTier) return false;
    }
    if (skillsFilter === "not-tested") {
      if (interview.application?.candidate?.testTier) return false;
    }

    // Filter by round
    if (roundFilter === "1") {
      if (interview.roundNumber !== 1) return false;
    }
    if (roundFilter === "2") {
      if (interview.roundNumber !== 2) return false;
    }
    if (roundFilter === "3+") {
      if (!interview.roundNumber || interview.roundNumber < 3) return false;
    }

    // Filter by review rating (only for completed interviews)
    if (ratingFilter !== "all") {
      if (interview.status !== "COMPLETED") return false;

      if (ratingFilter === "not-reviewed") {
        if (interview.review) return false;
      } else {
        const targetRating = parseInt(ratingFilter);
        if (
          !interview.review ||
          interview.review.overallRating !== targetRating
        ) {
          return false;
        }
      }
    }

    // Filter by job position
    if (selectedJobId) {
      if (interview.application?.job?.id !== selectedJobId) return false;
    }

    // Search by candidate name or job title
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const candidateName =
        interview.application?.candidate?.user?.name?.toLowerCase() || "";
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
    const aDate = a.scheduledAt
      ? new Date(a.scheduledAt)
      : new Date(a.createdAt);
    const bDate = b.scheduledAt
      ? new Date(b.scheduledAt)
      : new Date(b.createdAt);
    return aDate.getTime() - bDate.getTime();
  });

  // Categorize interviews into active and past
  const categorizeInterviews = (interviews: any[]) => {
    const active = interviews.filter(
      (i) =>
        i.status === "SCHEDULED" ||
        i.status === "AWAITING_CANDIDATE" ||
        i.status === "AWAITING_CONFIRMATION" ||
        i.status === "PENDING_AVAILABILITY"
    );

    const past = interviews.filter(
      (i) =>
        i.status === "COMPLETED" ||
        i.status === "CANCELLED" ||
        i.status === "RESCHEDULED"
    );

    return { active, past };
  };

  const { active: activeInterviews, past: pastInterviews } =
    categorizeInterviews(sortedInterviews);

  // Auto-expand Past Interviews section when filters are active and there are matching past interviews
  useEffect(() => {
    if (hasActiveFilters && pastInterviews.length > 0) {
      setPastSectionExpanded(true);
    }
  }, [hasActiveFilters, pastInterviews.length]);

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

  // Helper function to check if candidate requested reschedule
  const hasRescheduleRequest = (notes: string | null | undefined): boolean => {
    return notes?.includes("[RESCHEDULE_REQUESTED]") || false;
  };

  // Helper function to extract reschedule request reason from notes
  const getRescheduleRequestReason = (notes: string | null | undefined): string | null => {
    if (!notes) return null;
    const match = notes.match(/\[RESCHEDULE_REQUESTED\]: ([^-]+)/);
    return match ? match[1].trim() : null;
  };

  // Calculate stats based on job filter
  const statsInterviews = selectedJobId
    ? interviews.filter((i) => i.application?.job?.id === selectedJobId)
    : interviews;

  const stats = {
    total: statsInterviews.length,
    awaitingResponse: statsInterviews.filter(
      (i) =>
        i.status === "AWAITING_CANDIDATE" ||
        i.status === "AWAITING_CONFIRMATION"
    ).length,
    upcoming: statsInterviews.filter(
      (i) =>
        i.scheduledAt &&
        new Date(i.scheduledAt) >= new Date() &&
        i.status === "SCHEDULED"
    ).length,
    completed: statsInterviews.filter((i) => i.status === "COMPLETED").length,
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
                    <p className="text-sm font-medium text-secondary-600">
                      Upcoming
                    </p>
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
              <div className="space-y-4">
                {/* Row 1: Status Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-secondary-700">
                      Status:
                    </label>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 h-7 px-2"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={statusFilter === "all" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("all")}
                    >
                      All ({getStatusCount("all")})
                    </Button>
                    <Button
                      variant={
                        statusFilter === "action-required"
                          ? "primary"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setStatusFilter("action-required")}
                      className={
                        statusFilter === "action-required"
                          ? ""
                          : "border-warning-300 text-warning-600 hover:bg-warning-50"
                      }
                    >
                      <AlertCircle className="mr-1.5 h-4 w-4" />
                      Action Required ({getStatusCount("action-required")})
                    </Button>
                    <Button
                      variant={
                        statusFilter === "scheduled" ? "primary" : "outline"
                      }
                      size="sm"
                      onClick={() => setStatusFilter("scheduled")}
                    >
                      Scheduled ({getStatusCount("scheduled")})
                    </Button>
                    <Button
                      variant={
                        statusFilter === "completed" ? "primary" : "outline"
                      }
                      size="sm"
                      onClick={() => setStatusFilter("completed")}
                    >
                      Completed ({getStatusCount("completed")})
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-secondary-200"></div>

                {/* Row 2: Secondary Filters (Dropdowns) */}
                <div
                  className={`grid gap-4 ${
                    statusFilter === "completed" || statusFilter === "all"
                      ? "grid-cols-1 md:grid-cols-4"
                      : "grid-cols-1 md:grid-cols-3"
                  }`}
                >
                  {/* Skills Filter */}
                  <div>
                    <label className="text-sm font-medium text-secondary-700 mb-2 block">
                      Skills:
                    </label>
                    <select
                      value={skillsFilter}
                      onChange={(e) => setSkillsFilter(e.target.value)}
                      className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                    >
                      <option value="all">All</option>
                      <option value="verified">
                        ✓ Skills Verified ({getSkillsCount("verified")})
                      </option>
                      <option value="not-tested">
                        Not Tested ({getSkillsCount("not-tested")})
                      </option>
                    </select>
                  </div>

                  {/* Round Filter */}
                  {hasRoundData && (
                    <div>
                      <label className="text-sm font-medium text-secondary-700 mb-2 block">
                        Round:
                      </label>
                      <select
                        value={roundFilter}
                        onChange={(e) => setRoundFilter(e.target.value)}
                        className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                      >
                        <option value="all">All Rounds</option>
                        <option value="1">
                          Round 1 ({getRoundCount("1")})
                        </option>
                        <option value="2">
                          Round 2 ({getRoundCount("2")})
                        </option>
                        <option value="3+">
                          Round 3+ ({getRoundCount("3+")})
                        </option>
                      </select>
                    </div>
                  )}

                  {/* Position Filter */}
                  <div>
                    <label className="text-sm font-medium text-secondary-700 mb-2 block">
                      Position:
                    </label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                    >
                      <option value="">
                        All Positions ({interviews.length})
                      </option>
                      {uniqueJobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title} ({getJobInterviewCount(job.id)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter - Only show when viewing all or completed */}
                  {(statusFilter === "completed" || statusFilter === "all") && (
                    <div>
                      <label className="text-sm font-medium text-secondary-700 mb-2 block">
                        Rating:
                      </label>
                      <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                      >
                        <option value="all">
                          All ({getRatingCount("all")})
                        </option>
                        <option value="5">
                          ⭐⭐⭐⭐⭐ 5 Stars ({getRatingCount("5")})
                        </option>
                        <option value="4">
                          ⭐⭐⭐⭐ 4 Stars ({getRatingCount("4")})
                        </option>
                        <option value="3">
                          ⭐⭐⭐ 3 Stars ({getRatingCount("3")})
                        </option>
                        <option value="2">
                          ⭐⭐ 2 Stars ({getRatingCount("2")})
                        </option>
                        <option value="1">
                          ⭐ 1 Star ({getRatingCount("1")})
                        </option>
                        <option value="0">
                          0 Stars ({getRatingCount("0")})
                        </option>
                        <option value="not-reviewed">
                          Not Reviewed ({getRatingCount("not-reviewed")})
                        </option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-secondary-200"></div>

                {/* Row 3: Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                  <Input
                    type="text"
                    placeholder="Search by candidate or job..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                  <div className="flex items-center justify-between text-sm text-secondary-600 bg-blue-50 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        Showing {sortedInterviews.length} of {interviews.length}{" "}
                        interviews
                      </span>
                    </div>
                    <button
                      onClick={clearAllFilters}
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Interviews List */}
          {filteredInterviews.length === 0 ? (
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
            <div className="space-y-6">
              {/* Active Interviews Section - Always Visible */}
              {activeInterviews.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-secondary-900">
                      Active Interviews
                    </h2>
                    <Badge variant="primary">{activeInterviews.length}</Badge>
                  </div>
                  <div className="space-y-4">
                    {activeInterviews.map((interview) => {
                      const interviewDate = interview.scheduledAt
                        ? new Date(interview.scheduledAt)
                        : null;
                      const isUpcoming =
                        interviewDate && interviewDate >= new Date();
                      const candidate = interview.application?.candidate;
                      const candidateName =
                        candidate?.user?.name || "Unknown Candidate";
                      const candidateImage = candidate?.user?.image;
                      const jobTitle =
                        interview.application?.job?.title || "Unknown Position";
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
                                      <img
                                        src={candidateImage}
                                        alt={candidateName}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span>
                                        {candidateName.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                  </div>

                                  {/* Name, role, and badges */}
                                  <div className="flex-1">
                                    <div className="mb-2 flex items-center gap-2 flex-wrap">
                                      <Badge
                                        variant="primary"
                                        className="gap-1"
                                      >
                                        <Video className="h-3 w-3" />
                                        Video
                                      </Badge>
                                      {getStatusBadge(interview.status)}

                                      {/* Reschedule Requested Badge */}
                                      {hasRescheduleRequest(interview.notes) && (
                                        <Badge
                                          variant="warning"
                                          className="gap-1 bg-orange-50 text-orange-700 border-orange-200"
                                        >
                                          <RefreshCw className="h-3 w-3" />
                                          Reschedule Requested
                                        </Badge>
                                      )}

                                      {/* Round Badge */}
                                      {(interview.round ||
                                        interview.roundNumber) && (
                                        <Badge
                                          variant="secondary"
                                          className="gap-1 bg-purple-50 text-purple-700 border-purple-200"
                                        >
                                          <Target className="h-3 w-3" />
                                          {interview.round ||
                                            interview.roundName ||
                                            `Round ${interview.roundNumber}`}
                                        </Badge>
                                      )}

                                      {testTier ? (
                                        <Badge
                                          variant={
                                            testTier === "ELITE"
                                              ? "success"
                                              : testTier === "ADVANCED"
                                              ? "primary"
                                              : "secondary"
                                          }
                                          className="gap-1"
                                        >
                                          {testTier}
                                          {testScore && (
                                            <span className="ml-1">
                                              ({Math.round(testScore)}%)
                                            </span>
                                          )}
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="secondary"
                                          className="gap-1 bg-gray-100 text-gray-600 border-gray-300"
                                        >
                                          <svg
                                            className="h-3 w-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
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
                                        {currentRole.jobTitle} at{" "}
                                        {currentRole.companyName}
                                        {currentRole.isCurrent && (
                                          <span className="ml-1 text-xs text-green-600">
                                            (Current)
                                          </span>
                                        )}
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
                                          <svg
                                            className="h-3.5 w-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                          </svg>
                                          {candidateLocation}
                                        </span>
                                      )}
                                      {yearsOfExperience !== null &&
                                        yearsOfExperience !== undefined && (
                                          <span className="flex items-center gap-1">
                                            <svg
                                              className="h-3.5 w-3.5"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                              />
                                            </svg>
                                            {yearsOfExperience}{" "}
                                            {yearsOfExperience === 1
                                              ? "year"
                                              : "years"}{" "}
                                            exp
                                          </span>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    {candidateSkills.length > 0 && (
                                      <div className="mt-3 flex flex-wrap gap-1.5">
                                        {candidateSkills
                                          .slice(0, 5)
                                          .map((skill, idx) => (
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
                                    Waiting for candidate to select from your
                                    available time slots
                                  </p>
                                )}

                                {interview.status ===
                                  "AWAITING_CONFIRMATION" && (
                                  <p className="mb-3 text-sm font-medium text-warning-600">
                                    Candidate has selected time slots - please
                                    review and confirm
                                  </p>
                                )}

                                {interviewDate && (
                                  <>
                                    <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                                      <span className="flex items-center gap-1.5">
                                        <CalendarIcon className="h-4 w-4" />
                                        {interviewDate.toLocaleDateString(
                                          "en-US",
                                          {
                                            weekday: "long",
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                          }
                                        )}
                                      </span>
                                      <span className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        {interviewDate.toLocaleTimeString(
                                          "en-US",
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )}{" "}
                                        ({interview.duration} min)
                                      </span>
                                    </div>

                                    {/* Application Status Badge - Only show for non-cancelled, non-rescheduled interviews */}
                                    {interview.status !== "RESCHEDULED" &&
                                      interview.status !== "CANCELLED" && (
                                      <div className="mt-3">
                                        {interview.application?.status ===
                                        "REJECTED" ? (
                                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 border border-red-200">
                                            <svg
                                              className="h-4 w-4"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                            Rejected
                                          </span>
                                        ) : interview.application?.status ===
                                          "ACCEPTED" ? (
                                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 border border-green-200">
                                            <svg
                                              className="h-4 w-4"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                              />
                                            </svg>
                                            Hired
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 border border-blue-200">
                                            <svg
                                              className="h-4 w-4"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                              />
                                            </svg>
                                            In process
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}

                                {(() => {
                                  const {
                                    displayNotes,
                                    rescheduleReason,
                                    isPendingReschedule,
                                    candidateRescheduleRequest,
                                  } = parseInterviewNotes(interview.notes);

                                  return (
                                    <>
                                      {/* Candidate Reschedule Request */}
                                      {candidateRescheduleRequest && (
                                        <div className="mt-4 rounded-lg bg-orange-50 p-3 border border-orange-200">
                                          <div className="mb-1 flex items-center gap-2">
                                            <RefreshCw className="h-4 w-4 text-orange-600" />
                                            <span className="text-sm font-semibold text-orange-900">
                                              Candidate Reschedule Request:
                                            </span>
                                          </div>
                                          <p className="text-sm text-orange-800">
                                            {candidateRescheduleRequest}
                                          </p>
                                        </div>
                                      )}
                                      {/* Employer Notes */}
                                      {displayNotes &&
                                        interview.status !== "RESCHEDULED" && (
                                          <div className="mt-4 rounded-lg bg-yellow-50 p-3">
                                            <div className="mb-1 flex items-center gap-2">
                                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                                              <span className="text-sm font-semibold text-yellow-900">
                                                Notes from Employer:
                                              </span>
                                            </div>
                                            <p className="text-sm text-yellow-800">
                                              {displayNotes}
                                            </p>
                                          </div>
                                        )}
                                      {/* Reschedule Reason (from employer) */}
                                      {rescheduleReason && (
                                        <div
                                          className={`mt-4 rounded-lg p-3 ${
                                            isPendingReschedule
                                              ? "bg-orange-50"
                                              : "bg-blue-50"
                                          }`}
                                        >
                                          <div className="mb-1 flex items-center gap-2">
                                            <AlertCircle
                                              className={`h-4 w-4 ${
                                                isPendingReschedule
                                                  ? "text-orange-600"
                                                  : "text-blue-600"
                                              }`}
                                            />
                                            <span
                                              className={`text-sm font-semibold ${
                                                isPendingReschedule
                                                  ? "text-orange-900"
                                                  : "text-blue-900"
                                              }`}
                                            >
                                              {isPendingReschedule
                                                ? "⏳ Pending Reschedule Reason:"
                                                : "Reschedule Reason:"}
                                            </span>
                                          </div>
                                          <p
                                            className={`text-sm ${
                                              isPendingReschedule
                                                ? "text-orange-800"
                                                : "text-blue-800"
                                            }`}
                                          >
                                            {rescheduleReason}
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>

                              <div className="flex flex-wrap gap-2 lg:flex-col">
                                {interview.status ===
                                  "AWAITING_CONFIRMATION" && (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() =>
                                      router.push(
                                        `/employer/interviews/confirm/${interview.id}`
                                      )
                                    }
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Review & Confirm
                                  </Button>
                                )}

                                {interview.meetingLink &&
                                  isUpcoming &&
                                  interview.status !== "RESCHEDULED" && (
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

                                {interview.status === "COMPLETED" && (
                                  <button
                                    onClick={() =>
                                      handleOpenReviewModal(interview)
                                    }
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                      interview.review
                                        ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                                  >
                                    {interview.review ? (
                                      <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                          <CheckCircle className="h-4 w-4" />
                                          Reviewed
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                          <span className="font-semibold">
                                            {interview.review.overallRating}/5
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1.5">
                                        <AlertCircle className="h-4 w-4" />
                                        Not Reviewed
                                      </div>
                                    )}
                                  </button>
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

                                {interview.status === "SCHEDULED" &&
                                  isUpcoming && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleMarkCompleted(interview.id)
                                        }
                                        className="border-green-300 text-green-600 hover:bg-green-50"
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Mark Completed
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleOpenNotesModal(interview)
                                        }
                                      >
                                        <FileText className="mr-2 h-4 w-4" />
                                        {interview.notes
                                          ? "Edit Notes"
                                          : "Add Notes"}
                                      </Button>
                                      <InterviewActionsDropdown
                                        onMessage={() => {
                                          const candidateId =
                                            interview.application?.candidate
                                              ?.user?.id;
                                          if (candidateId) {
                                            router.push(
                                              `/employer/messages?candidateId=${candidateId}`
                                            );
                                          }
                                        }}
                                        onReschedule={() => {
                                          handleOpenRescheduleModal(interview);
                                        }}
                                        onCancel={() =>
                                          handleCancelInterview(interview.id)
                                        }
                                      />
                                    </>
                                  )}

                                {interview.status === "COMPLETED" && (
                                  <>
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        handleOpenDecisionModal(interview)
                                      }
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Make Decision
                                    </Button>
                                    <CompletedInterviewActionsDropdown
                                      onMessage={() => {
                                        const candidateId =
                                          interview.application?.candidate?.user
                                            ?.id;
                                        if (candidateId) {
                                          router.push(
                                            `/employer/messages?candidateId=${candidateId}`
                                          );
                                        }
                                      }}
                                      onReview={() =>
                                        handleOpenReviewModal(interview)
                                      }
                                      onSendFeedback={() =>
                                        handleOpenFeedbackModal(interview)
                                      }
                                    />
                                  </>
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

              {/* Past Interviews Section - Always visible when there are past interviews, collapsed by default */}
              {pastInterviews.length > 0 && (
                <div>
                  <button
                    onClick={() => setPastSectionExpanded(!pastSectionExpanded)}
                    className="mb-4 flex w-full items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-secondary-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-secondary-700">
                        Past Interviews
                      </h2>
                      <Badge variant="secondary">{pastInterviews.length}</Badge>
                    </div>
                    {pastSectionExpanded ? (
                      <svg
                        className="h-5 w-5 text-secondary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-secondary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  {pastSectionExpanded && (
                    <div className="space-y-4">
                      {pastInterviews.map((interview) => {
                        const interviewDate = interview.scheduledAt
                          ? new Date(interview.scheduledAt)
                          : null;
                        const isUpcoming =
                          interviewDate && interviewDate >= new Date();
                        const candidate = interview.application?.candidate;
                        const candidateName =
                          candidate?.user?.name || "Unknown Candidate";
                        const candidateImage = candidate?.user?.image;
                        const jobTitle =
                          interview.application?.job?.title ||
                          "Unknown Position";
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
                                        <img
                                          src={candidateImage}
                                          alt={candidateName}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <span>
                                          {candidateName
                                            .charAt(0)
                                            .toUpperCase()}
                                        </span>
                                      )}
                                    </div>

                                    {/* Name, role, and badges */}
                                    <div className="flex-1">
                                      <div className="mb-2 flex items-center gap-2 flex-wrap">
                                        <Badge
                                          variant="primary"
                                          className="gap-1"
                                        >
                                          <Video className="h-3 w-3" />
                                          Video
                                        </Badge>
                                        {getStatusBadge(interview.status)}

                                        {/* Reschedule Requested Badge */}
                                        {hasRescheduleRequest(interview.notes) && (
                                          <Badge
                                            variant="warning"
                                            className="gap-1 bg-orange-50 text-orange-700 border-orange-200"
                                          >
                                            <RefreshCw className="h-3 w-3" />
                                            Reschedule Requested
                                          </Badge>
                                        )}

                                        {/* Round Badge */}
                                        {(interview.round ||
                                          interview.roundNumber) && (
                                          <Badge
                                            variant="secondary"
                                            className="gap-1 bg-purple-50 text-purple-700 border-purple-200"
                                          >
                                            <Target className="h-3 w-3" />
                                            {interview.round ||
                                              interview.roundName ||
                                              `Round ${interview.roundNumber}`}
                                          </Badge>
                                        )}

                                        {testTier ? (
                                          <Badge
                                            variant={
                                              testTier === "ELITE"
                                                ? "success"
                                                : testTier === "ADVANCED"
                                                ? "primary"
                                                : "secondary"
                                            }
                                            className="gap-1"
                                          >
                                            {testTier}
                                            {testScore && (
                                              <span className="ml-1">
                                                ({Math.round(testScore)}%)
                                              </span>
                                            )}
                                          </Badge>
                                        ) : (
                                          <Badge
                                            variant="secondary"
                                            className="gap-1 bg-gray-100 text-gray-600 border-gray-300"
                                          >
                                            <svg
                                              className="h-3 w-3"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                              />
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
                                          {currentRole.jobTitle} at{" "}
                                          {currentRole.companyName}
                                          {currentRole.isCurrent && (
                                            <span className="ml-1 text-xs text-green-600">
                                              (Current)
                                            </span>
                                          )}
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
                                            <svg
                                              className="h-3.5 w-3.5"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                              />
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                              />
                                            </svg>
                                            {candidateLocation}
                                          </span>
                                        )}
                                        {yearsOfExperience !== null &&
                                          yearsOfExperience !== undefined && (
                                            <span className="flex items-center gap-1">
                                              <svg
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                              </svg>
                                              {yearsOfExperience}{" "}
                                              {yearsOfExperience === 1
                                                ? "year"
                                                : "years"}{" "}
                                              exp
                                            </span>
                                          )}
                                      </div>

                                      {/* Skills */}
                                      {candidateSkills.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                          {candidateSkills
                                            .slice(0, 5)
                                            .map((skill, idx) => (
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

                                  {interview.status ===
                                    "AWAITING_CANDIDATE" && (
                                    <p className="mb-3 text-sm text-secondary-600">
                                      Waiting for candidate to select from your
                                      available time slots
                                    </p>
                                  )}

                                  {interview.status ===
                                    "AWAITING_CONFIRMATION" && (
                                    <p className="mb-3 text-sm font-medium text-warning-600">
                                      Candidate has selected time slots - please
                                      review and confirm
                                    </p>
                                  )}

                                  {interviewDate && (
                                    <>
                                      <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                                        <span className="flex items-center gap-1.5">
                                          <CalendarIcon className="h-4 w-4" />
                                          {interviewDate.toLocaleDateString(
                                            "en-US",
                                            {
                                              weekday: "long",
                                              month: "long",
                                              day: "numeric",
                                              year: "numeric",
                                            }
                                          )}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                          <Clock className="h-4 w-4" />
                                          {interviewDate.toLocaleTimeString(
                                            "en-US",
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            }
                                          )}{" "}
                                          ({interview.duration} min)
                                        </span>
                                      </div>

                                      {/* Application Status Badge - Only show for non-cancelled, non-rescheduled interviews */}
                                      {interview.status !== "RESCHEDULED" &&
                                        interview.status !== "CANCELLED" && (
                                        <div className="mt-3">
                                          {interview.application?.status ===
                                          "REJECTED" ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 border border-red-200">
                                              <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"
                                                />
                                              </svg>
                                              Rejected
                                            </span>
                                          ) : interview.application?.status ===
                                            "ACCEPTED" ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 border border-green-200">
                                              <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M5 13l4 4L19 7"
                                                />
                                              </svg>
                                              Hired
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 border border-blue-200">
                                              <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                              </svg>
                                              In process
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </>
                                  )}

                                  {(() => {
                                    const {
                                      displayNotes,
                                      rescheduleReason,
                                      isPendingReschedule,
                                      candidateRescheduleRequest,
                                    } = parseInterviewNotes(interview.notes);

                                    return (
                                      <>
                                        {/* Candidate Reschedule Request */}
                                        {candidateRescheduleRequest && (
                                          <div className="mt-4 rounded-lg bg-orange-50 p-3 border border-orange-200">
                                            <div className="mb-1 flex items-center gap-2">
                                              <RefreshCw className="h-4 w-4 text-orange-600" />
                                              <span className="text-sm font-semibold text-orange-900">
                                                Candidate Reschedule Request:
                                              </span>
                                            </div>
                                            <p className="text-sm text-orange-800">
                                              {candidateRescheduleRequest}
                                            </p>
                                          </div>
                                        )}
                                        {/* Employer Notes */}
                                        {displayNotes &&
                                          interview.status !==
                                            "RESCHEDULED" && (
                                            <div className="mt-4 rounded-lg bg-yellow-50 p-3">
                                              <div className="mb-1 flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                <span className="text-sm font-semibold text-yellow-900">
                                                  Notes from Employer:
                                                </span>
                                              </div>
                                              <p className="text-sm text-yellow-800">
                                                {displayNotes}
                                              </p>
                                            </div>
                                          )}
                                        {/* Reschedule Reason (from employer) */}
                                        {rescheduleReason && (
                                          <div
                                            className={`mt-4 rounded-lg p-3 ${
                                              isPendingReschedule
                                                ? "bg-orange-50"
                                                : "bg-blue-50"
                                            }`}
                                          >
                                            <div className="mb-1 flex items-center gap-2">
                                              <AlertCircle
                                                className={`h-4 w-4 ${
                                                  isPendingReschedule
                                                    ? "text-orange-600"
                                                    : "text-blue-600"
                                                }`}
                                              />
                                              <span
                                                className={`text-sm font-semibold ${
                                                  isPendingReschedule
                                                    ? "text-orange-900"
                                                    : "text-blue-900"
                                                }`}
                                              >
                                                {isPendingReschedule
                                                  ? "⏳ Pending Reschedule Reason:"
                                                  : "Reschedule Reason:"}
                                              </span>
                                            </div>
                                            <p
                                              className={`text-sm ${
                                                isPendingReschedule
                                                  ? "text-orange-800"
                                                  : "text-blue-800"
                                              }`}
                                            >
                                              {rescheduleReason}
                                            </p>
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>

                                <div className="flex flex-wrap gap-2 lg:flex-col">
                                  {interview.status ===
                                    "AWAITING_CONFIRMATION" && (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        router.push(
                                          `/employer/interviews/confirm/${interview.id}`
                                        )
                                      }
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Review & Confirm
                                    </Button>
                                  )}

                                  {interview.meetingLink &&
                                    isUpcoming &&
                                    interview.status !== "RESCHEDULED" && (
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

                                  {interview.status === "COMPLETED" && (
                                    <button
                                      onClick={() =>
                                        handleOpenReviewModal(interview)
                                      }
                                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        interview.review
                                          ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                                      }`}
                                    >
                                      {interview.review ? (
                                        <div className="flex items-center justify-between">
                                          <span className="flex items-center gap-1.5">
                                            <CheckCircle className="h-4 w-4" />
                                            Reviewed
                                          </span>
                                          <div className="flex items-center gap-1">
                                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">
                                              {interview.review.overallRating}/5
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-1.5">
                                          <AlertCircle className="h-4 w-4" />
                                          Not Reviewed
                                        </div>
                                      )}
                                    </button>
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

                                  {interview.status === "SCHEDULED" &&
                                    isUpcoming && (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleMarkCompleted(interview.id)
                                          }
                                          className="border-green-300 text-green-600 hover:bg-green-50"
                                        >
                                          <CheckCircle className="mr-2 h-4 w-4" />
                                          Mark Completed
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleOpenNotesModal(interview)
                                          }
                                        >
                                          <FileText className="mr-2 h-4 w-4" />
                                          {interview.notes
                                            ? "Edit Notes"
                                            : "Add Notes"}
                                        </Button>
                                        <InterviewActionsDropdown
                                          onMessage={() => {
                                            const candidateId =
                                              interview.application?.candidate
                                                ?.user?.id;
                                            if (candidateId) {
                                              router.push(
                                                `/employer/messages?candidateId=${candidateId}`
                                              );
                                            }
                                          }}
                                          onReschedule={() => {
                                            handleOpenRescheduleModal(
                                              interview
                                            );
                                          }}
                                          onCancel={() =>
                                            handleCancelInterview(interview.id)
                                          }
                                        />
                                      </>
                                    )}

                                  {interview.status === "COMPLETED" && (
                                    <>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() =>
                                          handleOpenDecisionModal(interview)
                                        }
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Make Decision
                                      </Button>
                                      <CompletedInterviewActionsDropdown
                                        onMessage={() => {
                                          const candidateId =
                                            interview.application?.candidate
                                              ?.user?.id;
                                          if (candidateId) {
                                            router.push(
                                              `/employer/messages?candidateId=${candidateId}`
                                            );
                                          }
                                        }}
                                        onReview={() =>
                                          handleOpenReviewModal(interview)
                                        }
                                        onSendFeedback={() =>
                                          handleOpenFeedbackModal(interview)
                                        }
                                      />
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
              )}

              {/* Empty state when no active interviews */}
              {activeInterviews.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Video className="mx-auto mb-4 h-16 w-16 text-secondary-300" />
                    <h3 className="mb-2 text-xl font-bold text-secondary-900">
                      No Active Interviews
                    </h3>
                    <p className="text-secondary-600">
                      You don't have any active interviews scheduled at the
                      moment.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      <NotesModal
        isOpen={notesModalOpen}
        onClose={() => {
          setNotesModalOpen(false);
          setSelectedInterview(null);
        }}
        onSave={handleSaveNotes}
        initialNotes={selectedInterview?.notes}
        interviewId={selectedInterview?.id || ""}
      />

      {/* Decision Modal */}
      <DecisionModal
        isOpen={decisionModalOpen}
        onClose={() => {
          setDecisionModalOpen(false);
          setSelectedInterview(null);
        }}
        onScheduleNextRound={() => {
          if (selectedInterview) {
            handleScheduleNextRound(selectedInterview);
          }
        }}
        onSendOffer={() => {
          if (selectedInterview) {
            handleMoveToOffer(selectedInterview);
          }
        }}
        onRejectCandidate={() => {
          if (selectedInterview) {
            // Close decision modal first, but keep selectedInterview for reject modal
            setDecisionModalOpen(false);
            // Open reject modal with a slight delay to ensure decision modal is closed
            setTimeout(() => {
              handleOpenRejectModal(selectedInterview);
            }, 100);
          }
        }}
        candidateName={
          selectedInterview?.application?.candidate?.user?.name || ""
        }
        applicationId={
          selectedInterview?.applicationId || selectedInterview?.application?.id
        }
        jobTitle={selectedInterview?.application?.job?.title || ""}
        reviewRating={selectedInterview?.review?.overallRating}
        nextRoundInfo={nextRoundInfo}
      />

      {/* Send Feedback Modal */}
      <SendFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setSelectedInterview(null);
        }}
        onSave={handleSaveFeedback}
        initialFeedback={selectedInterview?.feedback}
        candidateName={
          selectedInterview?.application?.candidate?.user?.name || ""
        }
        jobTitle={selectedInterview?.application?.job?.title}
        companyName={selectedInterview?.application?.job?.employer?.companyName}
      />

      {/* Review Candidate Modal */}
      <ReviewCandidateModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedInterview(null);
        }}
        onSave={handleSaveReview}
        candidateName={
          selectedInterview?.application?.candidate?.user?.name || ""
        }
        jobTitle={selectedInterview?.application?.job?.title || ""}
        initialData={selectedInterview?.review || null}
      />

      {/* Reject Candidate Modal */}
      <RejectCandidateModal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedInterview(null);
        }}
        onConfirm={handleConfirmReject}
        candidateName={
          selectedInterview?.application?.candidate?.user?.name || ""
        }
        jobTitle={selectedInterview?.application?.job?.title || ""}
      />

      {/* Reschedule Interview Modal */}
      <RescheduleInterviewModal
        isOpen={rescheduleModalOpen}
        onClose={() => {
          setRescheduleModalOpen(false);
          setSelectedInterview(null);
        }}
        onConfirm={handleConfirmReschedule}
        candidateName={
          selectedInterview?.application?.candidate?.user?.name || ""
        }
        jobTitle={selectedInterview?.application?.job?.title || ""}
        scheduledDate={selectedInterview?.scheduledAt}
      />
    </div>
  );
}
