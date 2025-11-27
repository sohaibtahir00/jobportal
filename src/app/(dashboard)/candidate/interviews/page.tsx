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
  Download,
  MessageSquare,
  Search,
  Filter,
  X,
  Briefcase,
  Target,
  ExternalLink,
  CalendarClock,
  RefreshCw,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";

// Extended Interview interface to handle all backend statuses
interface Interview {
  id: string;
  jobId?: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  type: "phone" | "video" | "onsite";
  status: string; // Will handle all 7 statuses
  displayStatus: "action-required" | "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";
  date: string;
  time: string;
  duration: string;
  location?: string;
  jobLocation?: string;
  meetingLink?: string;
  interviewerName: string;
  interviewerTitle: string;
  round: string;
  roundNumber?: number;
  notes?: string;
  rescheduleReason?: string;
  rescheduleRequested?: boolean;
  rescheduleRequestReason?: string;
  applicationStatus?: string;
  scheduledAt?: string;
}

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

// Helper function to get clean employer notes (without system markers)
const getCleanEmployerNotes = (notes: string | null | undefined): string | null => {
  if (!notes) return null;

  let cleanNotes = notes;

  // Remove [RESCHEDULE_REQUESTED] markers and their content
  cleanNotes = cleanNotes.replace(/\[RESCHEDULE_REQUESTED\]: [^\n]+(\n\n)?/g, '');

  // Remove [PENDING_RESCHEDULE] markers and their content
  cleanNotes = cleanNotes.replace(/\[PENDING_RESCHEDULE\][^\n]*(\n\n)?/g, '');

  // Remove [Rescheduled from previous interview] markers
  cleanNotes = cleanNotes.replace(/\[Rescheduled from previous interview\][^\n]*(\n\n)?/g, '');

  // Trim and return null if empty
  cleanNotes = cleanNotes.trim();
  return cleanNotes || null;
};

// Reschedule Request Modal Component
function RescheduleRequestModal({
  isOpen,
  onClose,
  onSubmit,
  interviewId,
  jobTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, message: string) => Promise<void>;
  interviewId: string;
  jobTitle: string;
}) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset all state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setReason("");
      setMessage("");
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const reasonOptions = [
    "Schedule conflict",
    "Medical emergency",
    "Family emergency",
    "Travel issues",
    "Technical difficulties",
    "Other",
  ];

  const handleSubmit = async () => {
    if (!reason || isSubmitting || isSuccess) return;
    setIsSubmitting(true);
    try {
      await onSubmit(reason, message);
      setIsSuccess(true);
      // Show success state for 1.5 seconds, then reload page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Failed to submit reschedule request:", error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Show success state
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" />
        <div className="relative z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-secondary-900">Request Sent!</h3>
          <p className="text-sm text-secondary-600">
            Your reschedule request has been sent to the employer. They will be notified and can respond with new available times.
          </p>
          <p className="mt-4 text-xs text-secondary-500">Refreshing page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={isSubmitting ? undefined : onClose} />
      <div className="relative z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-secondary-900">Request Reschedule</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-secondary-500 hover:bg-secondary-100"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-secondary-600">
          Request to reschedule your interview for <span className="font-medium">{jobTitle}</span>
        </p>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-secondary-700">
            Reason for rescheduling <span className="text-red-500">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:bg-gray-100"
          >
            <option value="">Select a reason...</option>
            {reasonOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-secondary-700">
            Additional message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide any additional details..."
            rows={3}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-secondary-300 px-4 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none disabled:bg-gray-100"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!reason || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Request Reschedule
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Cancel Interview Modal Component
function CancelInterviewModal({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  jobTitle: string;
}) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      onClose();
      setReason("");
    } catch (error) {
      console.error("Failed to cancel interview:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-secondary-900">Cancel Interview</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-secondary-500 hover:bg-secondary-100"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-red-50 p-3 border border-red-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">This action cannot be undone</p>
              <p className="text-sm text-red-700">
                The employer will be notified of your cancellation.
              </p>
            </div>
          </div>
        </div>

        <p className="mb-4 text-sm text-secondary-600">
          Are you sure you want to cancel your interview for{" "}
          <span className="font-medium">{jobTitle}</span>?
        </p>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-secondary-700">
            Reason (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Let the employer know why you're cancelling..."
            rows={3}
            className="w-full rounded-lg border border-secondary-300 px-4 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1">
            Keep Interview
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Interview
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CandidateInterviewsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [roundFilter, setRoundFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Interview data
  const [allInterviews, setAllInterviews] = useState<Interview[]>([]);
  const [pendingInterviews, setPendingInterviews] = useState<any[]>([]);

  // UI states
  const [pastSectionExpanded, setPastSectionExpanded] = useState(false);

  // Modal states
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  // Redirect if not logged in or not candidate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/candidate/interviews");
    }
    if (status === "authenticated" && session?.user?.role !== "CANDIDATE") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load all interviews
  useEffect(() => {
    const loadInterviews = async () => {
      if (status !== "authenticated") return;

      try {
        const { api } = await import("@/lib/api");
        const response = await api.get("/api/interviews");
        const backendInterviews = response.data.interviews || [];

        // Separate pending (action required) from scheduled interviews
        const pending = backendInterviews.filter(
          (i: any) =>
            i.status === "AWAITING_CANDIDATE" ||
            i.status === "AWAITING_CONFIRMATION" ||
            i.status === "PENDING_AVAILABILITY"
        );
        setPendingInterviews(pending);

        // Transform all interviews
        const transformed = backendInterviews.map((interview: any) => {
          const scheduledDate = interview.scheduledAt ? new Date(interview.scheduledAt) : null;
          const now = new Date();

          // Determine display status
          let displayStatus: Interview["displayStatus"] = "confirmed";
          if (interview.status === "AWAITING_CANDIDATE") {
            displayStatus = "action-required";
          } else if (interview.status === "AWAITING_CONFIRMATION" || interview.status === "PENDING_AVAILABILITY") {
            displayStatus = "pending";
          } else if (interview.status === "CANCELLED") {
            displayStatus = "cancelled";
          } else if (interview.status === "RESCHEDULED") {
            displayStatus = "rescheduled";
          } else if (interview.status === "COMPLETED") {
            displayStatus = "completed";
          } else if (scheduledDate && scheduledDate < now && interview.status === "SCHEDULED") {
            displayStatus = "completed";
          }

          // Parse notes for reschedule reason
          let rescheduleReason = null;
          if (interview.notes?.includes("[Rescheduled from previous interview]")) {
            const parts = interview.notes.split("[Rescheduled from previous interview]");
            rescheduleReason = parts[1]?.trim() || null;
          }

          return {
            id: interview.id,
            jobId: interview.application?.job?.id,
            jobTitle: interview.application?.job?.title || "Unknown Position",
            companyName: interview.application?.job?.employer?.companyName || "Company",
            companyLogo: interview.application?.job?.employer?.logo,
            type: (interview.type?.toLowerCase() || "video") as "phone" | "video" | "onsite",
            status: interview.status,
            displayStatus,
            date: scheduledDate?.toISOString().split("T")[0] || "",
            time: scheduledDate?.toTimeString().slice(0, 5) || "",
            duration: `${interview.duration} minutes`,
            location: interview.location,
            jobLocation: interview.application?.job?.location,
            meetingLink: interview.meetingLink,
            interviewerName: interview.interviewer?.name || "Hiring Manager",
            interviewerTitle: interview.interviewer?.title || "Employer",
            round: interview.round || interview.roundName || `Round ${interview.roundNumber || 1}`,
            roundNumber: interview.roundNumber || 1,
            notes: interview.notes,
            rescheduleReason,
            rescheduleRequested: hasRescheduleRequest(interview.notes),
            rescheduleRequestReason: getRescheduleRequestReason(interview.notes),
            applicationStatus: interview.application?.status,
            scheduledAt: interview.scheduledAt,
          };
        });

        setAllInterviews(transformed);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load interviews:", error);
        setIsLoading(false);
      }
    };

    loadInterviews();
  }, [status]);

  // Filter logic
  const filteredInterviews = allInterviews.filter((interview) => {
    // Status filter
    if (statusFilter === "action-required" && interview.displayStatus !== "action-required") return false;
    if (statusFilter === "confirmed" && interview.displayStatus !== "confirmed") return false;
    if (statusFilter === "completed" && interview.displayStatus !== "completed") return false;
    if (statusFilter === "cancelled" && interview.displayStatus !== "cancelled") return false;

    // Type filter
    if (typeFilter !== "all" && interview.type !== typeFilter) return false;

    // Round filter
    if (roundFilter === "1" && interview.roundNumber !== 1) return false;
    if (roundFilter === "2" && interview.roundNumber !== 2) return false;
    if (roundFilter === "3+" && (!interview.roundNumber || interview.roundNumber < 3)) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesCompany = interview.companyName.toLowerCase().includes(query);
      const matchesJob = interview.jobTitle.toLowerCase().includes(query);
      if (!matchesCompany && !matchesJob) return false;
    }

    return true;
  });

  // Categorize interviews
  const activeInterviews = filteredInterviews.filter(
    (i) =>
      i.displayStatus === "action-required" ||
      i.displayStatus === "pending" ||
      i.displayStatus === "confirmed"
  );

  const pastInterviews = filteredInterviews.filter(
    (i) =>
      i.displayStatus === "completed" ||
      i.displayStatus === "cancelled" ||
      i.displayStatus === "rescheduled"
  );

  // Sort active interviews by priority
  const sortedActiveInterviews = [...activeInterviews].sort((a, b) => {
    const priority: Record<string, number> = {
      "action-required": 1,
      pending: 2,
      confirmed: 3,
    };
    const aPriority = priority[a.displayStatus] || 99;
    const bPriority = priority[b.displayStatus] || 99;
    if (aPriority !== bPriority) return aPriority - bPriority;

    // Then by date
    const aDate = a.scheduledAt ? new Date(a.scheduledAt) : new Date();
    const bDate = b.scheduledAt ? new Date(b.scheduledAt) : new Date();
    return aDate.getTime() - bDate.getTime();
  });

  // Stats calculations
  const actionRequiredCount = allInterviews.filter((i) => i.displayStatus === "action-required").length;
  const upcomingCount = allInterviews.filter((i) => i.displayStatus === "confirmed" || i.displayStatus === "pending").length;
  const completedCount = allInterviews.filter((i) => i.displayStatus === "completed").length;

  // Check if any filter is active
  const hasActiveFilters =
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    roundFilter !== "all" ||
    searchQuery !== "";

  const clearAllFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setRoundFilter("all");
    setSearchQuery("");
    setPastSectionExpanded(false);
  };

  // Auto-expand past section when filters match past interviews
  useEffect(() => {
    if (hasActiveFilters && pastInterviews.length > 0) {
      setPastSectionExpanded(true);
    }
  }, [hasActiveFilters, pastInterviews.length]);

  // Helper functions
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "onsite":
        return <Building className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (displayStatus: string, status?: string) => {
    switch (displayStatus) {
      case "action-required":
        return <Badge variant="warning">Action Required</Badge>;
      case "pending":
        return <Badge variant="secondary">Awaiting Confirmation</Badge>;
      case "confirmed":
        return <Badge variant="primary">Confirmed</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "cancelled":
        return <Badge variant="danger">Cancelled</Badge>;
      case "rescheduled":
        return <Badge variant="warning">Rescheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getApplicationStatusBadge = (status?: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Offer Received
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 border border-red-200">
            <XCircle className="h-3.5 w-3.5" />
            Not Selected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
            <Clock className="h-3.5 w-3.5" />
            In Progress
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCountdown = (dateString: string, timeString: string) => {
    if (!dateString) return null;

    const interviewDate = new Date(`${dateString}T${timeString || "00:00"}`);
    const now = new Date();
    const diffMs = interviewDate.getTime() - now.getTime();

    if (diffMs < 0) return null;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return { text: `In ${diffMins} min`, urgent: true };
    }
    if (diffHours < 24) {
      return { text: `In ${diffHours} hours`, urgent: diffHours < 3 };
    }
    if (diffDays === 1) {
      return { text: "Tomorrow", urgent: false };
    }
    if (diffDays <= 7) {
      return { text: `In ${diffDays} days`, urgent: false };
    }
    return { text: `In ${diffDays} days`, urgent: false };
  };

  // Action handlers
  const handleRescheduleRequest = async (reason: string, message: string) => {
    if (!selectedInterview) return;

    try {
      const { api } = await import("@/lib/api");
      // Call the new candidate-specific request-reschedule endpoint
      await api.post(`/api/interviews/${selectedInterview.id}/request-reschedule`, {
        reason: `${reason}${message ? `: ${message}` : ""}`,
      });

      // Don't reload here - modal handles showing success state and reloading after delay
    } catch (error) {
      console.error("Failed to request reschedule:", error);
      throw error;
    }
  };

  const handleCancelInterview = async (reason: string) => {
    if (!selectedInterview) return;

    try {
      const { api } = await import("@/lib/api");
      await api.delete(`/api/interviews/${selectedInterview.id}`, {
        data: { reason, cancelledBy: "candidate" },
      });

      // Reload page
      window.location.reload();
    } catch (error) {
      console.error("Failed to cancel interview:", error);
      throw error;
    }
  };

  // Filter counts
  const getStatusCount = (status: string) => {
    if (status === "all") return allInterviews.length;
    if (status === "action-required") return actionRequiredCount;
    if (status === "confirmed") return allInterviews.filter((i) => i.displayStatus === "confirmed" || i.displayStatus === "pending").length;
    if (status === "completed") return completedCount;
    if (status === "cancelled") return allInterviews.filter((i) => i.displayStatus === "cancelled").length;
    return 0;
  };

  const getTypeCount = (type: string) => {
    if (type === "all") return allInterviews.length;
    return allInterviews.filter((i) => i.type === type).length;
  };

  const getRoundCount = (round: string) => {
    if (round === "all") return allInterviews.length;
    if (round === "1") return allInterviews.filter((i) => i.roundNumber === 1).length;
    if (round === "2") return allInterviews.filter((i) => i.roundNumber === 2).length;
    if (round === "3+") return allInterviews.filter((i) => i.roundNumber && i.roundNumber >= 3).length;
    return 0;
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
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">My Interviews</h1>
            <p className="text-secondary-600">
              Manage your upcoming and past interviews
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Total Interviews</p>
                    <p className="mt-2 text-3xl font-bold text-secondary-900">
                      {allInterviews.length}
                    </p>
                  </div>
                  <Calendar className="h-12 w-12 text-secondary-300" />
                </div>
              </CardContent>
            </Card>

            <Card className={actionRequiredCount > 0 ? "border-warning-200 bg-warning-50" : ""}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Action Required</p>
                    <p className={`mt-2 text-3xl font-bold ${actionRequiredCount > 0 ? "text-warning-600" : "text-secondary-900"}`}>
                      {actionRequiredCount}
                    </p>
                  </div>
                  <AlertCircle className={`h-12 w-12 ${actionRequiredCount > 0 ? "text-warning-400" : "text-secondary-300"}`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Upcoming</p>
                    <p className="mt-2 text-3xl font-bold text-primary-600">{upcomingCount}</p>
                  </div>
                  <CalendarClock className="h-12 w-12 text-primary-300" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Completed</p>
                    <p className="mt-2 text-3xl font-bold text-success-600">{completedCount}</p>
                  </div>
                  <CheckCircle2 className="h-12 w-12 text-success-300" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Row 1: Status Filter Buttons */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-secondary-700">Status:</label>
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
                      variant={statusFilter === "action-required" ? "primary" : "outline"}
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
                      variant={statusFilter === "confirmed" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("confirmed")}
                    >
                      Upcoming ({getStatusCount("confirmed")})
                    </Button>
                    <Button
                      variant={statusFilter === "completed" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("completed")}
                    >
                      Completed ({getStatusCount("completed")})
                    </Button>
                    <Button
                      variant={statusFilter === "cancelled" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("cancelled")}
                    >
                      Cancelled ({getStatusCount("cancelled")})
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-secondary-200"></div>

                {/* Row 2: Secondary Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="text-sm font-medium text-secondary-700 mb-2 block">
                      Interview Type:
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                    >
                      <option value="all">All Types ({getTypeCount("all")})</option>
                      <option value="video">Video ({getTypeCount("video")})</option>
                      <option value="phone">Phone ({getTypeCount("phone")})</option>
                      <option value="onsite">Onsite ({getTypeCount("onsite")})</option>
                    </select>
                  </div>

                  {/* Round Filter */}
                  <div>
                    <label className="text-sm font-medium text-secondary-700 mb-2 block">
                      Round:
                    </label>
                    <select
                      value={roundFilter}
                      onChange={(e) => setRoundFilter(e.target.value)}
                      className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                    >
                      <option value="all">All Rounds ({getRoundCount("all")})</option>
                      <option value="1">Round 1 ({getRoundCount("1")})</option>
                      <option value="2">Round 2 ({getRoundCount("2")})</option>
                      <option value="3+">Round 3+ ({getRoundCount("3+")})</option>
                    </select>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-secondary-200"></div>

                {/* Row 3: Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                  <Input
                    type="text"
                    placeholder="Search by company or job title..."
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
                        Showing {filteredInterviews.length} of {allInterviews.length} interviews
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

          {/* Interview Lists */}
          {filteredInterviews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="mx-auto mb-4 h-16 w-16 text-secondary-300" />
                <h3 className="mb-2 text-xl font-bold text-secondary-900">No interviews found</h3>
                <p className="mb-6 text-secondary-600">
                  {hasActiveFilters
                    ? "Try adjusting your filters to see more results."
                    : "You don't have any scheduled interviews yet."}
                </p>
                {hasActiveFilters ? (
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button variant="primary" asChild>
                    <Link href="/candidate/jobs">Browse Jobs</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Active Interviews Section */}
              {sortedActiveInterviews.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-secondary-900">Active Interviews</h2>
                    <Badge variant="primary">{sortedActiveInterviews.length}</Badge>
                  </div>
                  <div className="space-y-4">
                    {sortedActiveInterviews.map((interview) => {
                      const countdown = getCountdown(interview.date, interview.time);

                      return (
                        <Card
                          key={interview.id}
                          className={`transition-shadow hover:shadow-md ${
                            interview.displayStatus === "action-required"
                              ? "border-2 border-warning-200 bg-warning-50"
                              : ""
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="flex-1">
                                {/* Header with company logo */}
                                <div className="mb-3 flex items-start gap-4">
                                  {/* Company Logo */}
                                  <div className="relative h-14 w-14 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                    {interview.companyLogo ? (
                                      <img
                                        src={interview.companyLogo}
                                        alt={interview.companyName}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span>{interview.companyName.charAt(0).toUpperCase()}</span>
                                    )}
                                  </div>

                                  {/* Job info and badges */}
                                  <div className="flex-1">
                                    <div className="mb-2 flex items-center gap-2 flex-wrap">
                                      {getStatusBadge(interview.displayStatus, interview.status)}
                                      {interview.rescheduleRequested && (
                                        <Badge variant="warning" className="gap-1">
                                          <RefreshCw className="h-3 w-3" />
                                          Reschedule Requested
                                        </Badge>
                                      )}
                                      <Badge variant="secondary" className="gap-1">
                                        {getTypeIcon(interview.type)}
                                        <span className="capitalize">{interview.type}</span>
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="gap-1 bg-purple-50 text-purple-700 border-purple-200"
                                      >
                                        <Target className="h-3 w-3" />
                                        {interview.round}
                                      </Badge>
                                    </div>

                                    <h3 className="mb-1 text-lg font-bold text-secondary-900">
                                      {interview.jobTitle}
                                    </h3>
                                    <p className="text-sm text-secondary-600 flex items-center gap-1">
                                      <Building className="h-3.5 w-3.5" />
                                      {interview.companyName}
                                    </p>

                                    {/* Job Location */}
                                    {interview.jobLocation && (
                                      <p className="mt-1 text-sm text-secondary-500 flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {interview.jobLocation}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Status-specific message */}
                                {interview.displayStatus === "action-required" && (
                                  <p className="mb-3 text-sm font-medium text-warning-700">
                                    Employer has sent you available time slots - please select your preferred times
                                  </p>
                                )}
                                {interview.displayStatus === "pending" && (
                                  <p className="mb-3 text-sm text-secondary-600">
                                    You've selected your preferred times - waiting for employer to confirm
                                  </p>
                                )}
                                {interview.rescheduleRequested && interview.displayStatus === "confirmed" && (
                                  <p className="mb-3 text-sm text-warning-700">
                                    You've requested to reschedule this interview - waiting for employer to respond
                                  </p>
                                )}

                                {/* Date/Time info */}
                                {interview.date && (
                                  <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                                    <span className="flex items-center gap-1.5">
                                      <Calendar className="h-4 w-4" />
                                      {formatDate(interview.date)}
                                    </span>
                                    {interview.time && (
                                      <span className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        {interview.time} ({interview.duration})
                                      </span>
                                    )}
                                    {countdown && (
                                      <Badge
                                        variant={countdown.urgent ? "warning" : "primary"}
                                        size="sm"
                                      >
                                        {countdown.text}
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                {/* Interview Location (venue) */}
                                {interview.location && (
                                  <div className="mt-2 flex items-center gap-2 text-sm text-secondary-600">
                                    <MapPin className="h-4 w-4 text-secondary-500" />
                                    <span>{interview.location}</span>
                                  </div>
                                )}

                                {/* Interviewer info */}
                                <div className="mt-2 flex items-center gap-2 text-sm text-secondary-600">
                                  <User className="h-4 w-4 text-secondary-500" />
                                  <span>
                                    {interview.interviewerName} - {interview.interviewerTitle}
                                  </span>
                                </div>

                                {/* Application Status */}
                                <div className="mt-3">
                                  {getApplicationStatusBadge(interview.applicationStatus)}
                                </div>

                                {/* Notes (cleaned of system markers) */}
                                {(() => {
                                  const cleanNotes = getCleanEmployerNotes(interview.notes);
                                  return cleanNotes ? (
                                    <div className="mt-4 rounded-lg bg-yellow-50 p-3">
                                      <div className="mb-1 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm font-semibold text-yellow-900">
                                          Notes from Employer:
                                        </span>
                                      </div>
                                      <p className="text-sm text-yellow-800">{cleanNotes}</p>
                                    </div>
                                  ) : null;
                                })()}

                                {/* Reschedule reason */}
                                {interview.rescheduleReason && (
                                  <div className="mt-4 rounded-lg bg-blue-50 p-3">
                                    <div className="mb-1 flex items-center gap-2">
                                      <RefreshCw className="h-4 w-4 text-blue-600" />
                                      <span className="text-sm font-semibold text-blue-900">
                                        Rescheduled:
                                      </span>
                                    </div>
                                    <p className="text-sm text-blue-800">{interview.rescheduleReason}</p>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col gap-2 lg:w-48">
                                {interview.displayStatus === "action-required" && (
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
                                )}

                                {interview.displayStatus === "pending" && (
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

                                {interview.displayStatus === "confirmed" && (
                                  <>
                                    {interview.meetingLink && (
                                      <Button variant="primary" size="sm" className="w-full" asChild>
                                        <a
                                          href={interview.meetingLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <Video className="mr-2 h-4 w-4" />
                                          Join Meeting
                                        </a>
                                      </Button>
                                    )}
                                  </>
                                )}

                                {/* View Job button */}
                                {interview.jobId && (
                                  <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={`/jobs/${interview.jobId}`}>
                                      <Briefcase className="mr-2 h-4 w-4" />
                                      View Job
                                    </Link>
                                  </Button>
                                )}

                                {/* Prepare for Interview */}
                                {interview.displayStatus === "confirmed" && (
                                  <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href="/skills-assessment/prep">
                                      <BookOpen className="mr-2 h-4 w-4" />
                                      Prepare
                                    </Link>
                                  </Button>
                                )}

                                {/* Message button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => router.push("/candidate/messages")}
                                >
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Message
                                </Button>

                                {/* Reschedule & Cancel for confirmed interviews */}
                                {interview.displayStatus === "confirmed" && (
                                  <>
                                    {/* Only show Request Reschedule if not already requested */}
                                    {!interview.rescheduleRequested && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => {
                                          setSelectedInterview(interview);
                                          setRescheduleModalOpen(true);
                                        }}
                                      >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Request Reschedule
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => {
                                        setSelectedInterview(interview);
                                        setCancelModalOpen(true);
                                      }}
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
                </div>
              )}

              {/* Past Interviews Section - Collapsible */}
              {pastInterviews.length > 0 && (
                <div>
                  <button
                    onClick={() => setPastSectionExpanded(!pastSectionExpanded)}
                    className="mb-4 flex w-full items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-secondary-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-secondary-700">Past Interviews</h2>
                      <Badge variant="secondary">{pastInterviews.length}</Badge>
                    </div>
                    {pastSectionExpanded ? (
                      <ChevronUp className="h-5 w-5 text-secondary-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-secondary-600" />
                    )}
                  </button>

                  {pastSectionExpanded && (
                    <div className="space-y-4">
                      {pastInterviews.map((interview) => (
                        <Card key={interview.id} className="transition-shadow hover:shadow-md opacity-80">
                          <CardContent className="p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="flex-1">
                                {/* Header with company logo */}
                                <div className="mb-3 flex items-start gap-4">
                                  <div className="relative h-14 w-14 flex-shrink-0 rounded-lg bg-gradient-to-br from-secondary-300 to-secondary-400 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                    {interview.companyLogo ? (
                                      <img
                                        src={interview.companyLogo}
                                        alt={interview.companyName}
                                        className="h-full w-full object-cover grayscale"
                                      />
                                    ) : (
                                      <span>{interview.companyName.charAt(0).toUpperCase()}</span>
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <div className="mb-2 flex items-center gap-2 flex-wrap">
                                      {getStatusBadge(interview.displayStatus, interview.status)}
                                      <Badge variant="secondary" className="gap-1">
                                        {getTypeIcon(interview.type)}
                                        <span className="capitalize">{interview.type}</span>
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="gap-1 bg-purple-50 text-purple-700 border-purple-200"
                                      >
                                        <Target className="h-3 w-3" />
                                        {interview.round}
                                      </Badge>
                                    </div>

                                    <h3 className="mb-1 text-lg font-bold text-secondary-900">
                                      {interview.jobTitle}
                                    </h3>
                                    <p className="text-sm text-secondary-600 flex items-center gap-1">
                                      <Building className="h-3.5 w-3.5" />
                                      {interview.companyName}
                                    </p>
                                  </div>
                                </div>

                                {/* Date/Time info */}
                                {interview.date && (
                                  <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                                    <span className="flex items-center gap-1.5">
                                      <Calendar className="h-4 w-4" />
                                      {formatDate(interview.date)}
                                    </span>
                                    {interview.time && (
                                      <span className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        {interview.time} ({interview.duration})
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Interview Location */}
                                {interview.location && (
                                  <div className="mt-2 flex items-center gap-2 text-sm text-secondary-600">
                                    <MapPin className="h-4 w-4 text-secondary-500" />
                                    <span>{interview.location}</span>
                                  </div>
                                )}

                                {/* Interviewer info */}
                                <div className="mt-2 flex items-center gap-2 text-sm text-secondary-600">
                                  <User className="h-4 w-4 text-secondary-500" />
                                  <span>
                                    {interview.interviewerName} - {interview.interviewerTitle}
                                  </span>
                                </div>

                                {/* Application Status */}
                                <div className="mt-3">
                                  {getApplicationStatusBadge(interview.applicationStatus)}
                                </div>

                                {/* Notes (cleaned of system markers) */}
                                {(() => {
                                  const cleanNotes = getCleanEmployerNotes(interview.notes);
                                  return cleanNotes ? (
                                    <div className="mt-4 rounded-lg bg-yellow-50 p-3">
                                      <div className="mb-1 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm font-semibold text-yellow-900">
                                          Notes from Employer:
                                        </span>
                                      </div>
                                      <p className="text-sm text-yellow-800">{cleanNotes}</p>
                                    </div>
                                  ) : null;
                                })()}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col gap-2 lg:w-48">
                                {interview.jobId && (
                                  <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={`/jobs/${interview.jobId}`}>
                                      <Briefcase className="mr-2 h-4 w-4" />
                                      View Job
                                    </Link>
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => router.push("/candidate/messages")}
                                >
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Follow Up
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Empty state when no active interviews */}
              {sortedActiveInterviews.length === 0 && pastInterviews.length > 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="mx-auto mb-4 h-16 w-16 text-secondary-300" />
                    <h3 className="mb-2 text-xl font-bold text-secondary-900">
                      No Active Interviews
                    </h3>
                    <p className="mb-6 text-secondary-600">
                      You don't have any upcoming interviews at the moment.
                    </p>
                    <Button variant="primary" asChild>
                      <Link href="/candidate/jobs">Browse Jobs</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Interview Preparation Tips */}
          {upcomingCount > 0 && (
            <Card className="mt-8 bg-gradient-to-br from-primary-50 to-accent-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-bold text-secondary-900">
                    Interview Preparation Tips
                  </h3>
                </div>
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
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/skills-assessment/prep">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Full Preparation Guide
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <RescheduleRequestModal
        isOpen={rescheduleModalOpen}
        onClose={() => {
          setRescheduleModalOpen(false);
          setSelectedInterview(null);
        }}
        onSubmit={handleRescheduleRequest}
        interviewId={selectedInterview?.id || ""}
        jobTitle={selectedInterview?.jobTitle || ""}
      />

      <CancelInterviewModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedInterview(null);
        }}
        onConfirm={handleCancelInterview}
        jobTitle={selectedInterview?.jobTitle || ""}
      />
    </div>
  );
}
