"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  Loader2,
  Check,
  X,
  User,
  Briefcase,
  Video,
  ExternalLink,
  Users,
  Settings,
} from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { api } from "@/lib/api";

export default function ConfirmInterviewPage() {
  const params = useParams();
  const interviewId = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [interview, setInterview] = useState<any>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [meetingPlatform, setMeetingPlatform] = useState<"zoom" | "google_meet">("zoom");
  const [error, setError] = useState("");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [selectedInterviewerId, setSelectedInterviewerId] = useState<string | null>(null);

  // Redirect if not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/interviews");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load interview with selected slots
  useEffect(() => {
    const loadData = async () => {
      if (status !== "authenticated") return;

      try {
        setIsLoading(true);
        const response = await api.get(`/api/interviews/${interviewId}`);
        setInterview(response.data.interview);
      } catch (err) {
        console.error("Failed to load interview:", err);
        setError("Failed to load interview details");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [interviewId, status]);

  // Load team members
  useEffect(() => {
    const loadTeamMembers = async () => {
      if (status !== "authenticated") return;

      try {
        setIsLoadingMembers(true);
        const response = await api.get("/api/employer/team-members");
        setTeamMembers(response.data.members || []);
      } catch (err) {
        console.error("Failed to load team members:", err);
        // Don't show error - just show empty state
        setTeamMembers([]);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    loadTeamMembers();
  }, [status]);

  const handleConfirm = async () => {
    if (!selectedSlotId) {
      setError("Please select a time slot to confirm");
      return;
    }

    if (!selectedInterviewerId) {
      setError("Please select an interviewer");
      return;
    }

    try {
      setIsConfirming(true);
      setError("");

      await api.post(`/api/interviews/${interviewId}/confirm`, {
        slotId: selectedSlotId,
        meetingPlatform,
        interviewerId: selectedInterviewerId,
      });

      router.push("/employer/interviews");
    } catch (err: any) {
      console.error("Failed to confirm interview:", err);
      setError(err.response?.data?.error || "Failed to confirm interview");
    } finally {
      setIsConfirming(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !interview) {
    return null;
  }

  const candidateName = interview.application?.candidate?.user?.name || "Unknown Candidate";
  const jobTitle = interview.application?.job?.title || "Unknown Position";

  // Group selected slots by date
  const selectedSlots = interview.selectedSlots || [];
  const groupedSlots = selectedSlots.reduce((acc: any, selection: any) => {
    const slot = selection.availability;
    const date = new Date(slot.startTime).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({ ...slot, selectionId: selection.id });
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Interviews
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">
              Confirm Interview Time
            </h1>
            <p className="text-secondary-600">
              Review the candidate's selected times and confirm the final interview slot
            </p>
          </div>

          {/* Candidate Info */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <User className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-xl font-bold text-secondary-900">{candidateName}</h3>
                  <p className="mb-2 text-secondary-600">Applied for: {jobTitle}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary" size="sm" className="gap-1">
                      <Video className="h-3 w-3" />
                      Video Interview
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      {interview.duration} minutes
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidate's Selected Times */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="mb-6 text-xl font-bold text-secondary-900">
                Candidate's Preferred Times
              </h3>

              {Object.keys(groupedSlots).length === 0 ? (
                <p className="py-8 text-center text-secondary-600">
                  No time slots selected by candidate
                </p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedSlots).map(([date, slots]: [string, any]) => (
                    <div key={date}>
                      <h4 className="mb-3 flex items-center gap-2 font-semibold text-secondary-900">
                        <CalendarIcon className="h-5 w-5 text-primary-600" />
                        {formatDate(slots[0].startTime)}
                      </h4>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {slots.map((slot: any) => {
                          const isSelected = selectedSlotId === slot.id;
                          return (
                            <button
                              key={slot.id}
                              onClick={() => setSelectedSlotId(slot.id)}
                              disabled={isConfirming}
                              className={`relative flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all disabled:opacity-50 ${
                                isSelected
                                  ? "border-primary-600 bg-primary-50"
                                  : "border-secondary-200 bg-white hover:border-primary-300"
                              }`}
                            >
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                                  isSelected
                                    ? "border-primary-600 bg-primary-600"
                                    : "border-secondary-300"
                                }`}
                              >
                                {isSelected && <Check className="h-5 w-5 text-white" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 font-semibold text-secondary-900">
                                  <Clock className="h-4 w-4 text-secondary-500" />
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interviewer Selection */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold text-secondary-900">
                Select Interviewer
              </h3>
              <p className="mb-4 text-sm text-secondary-600">
                Choose who will conduct this interview
              </p>

              {isLoadingMembers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-secondary-200 bg-secondary-50 p-6 text-center">
                  <Users className="mx-auto mb-3 h-12 w-12 text-secondary-400" />
                  <h4 className="mb-2 text-lg font-semibold text-secondary-900">
                    No Team Members
                  </h4>
                  <p className="mb-4 text-sm text-secondary-600">
                    Add team members to assign them as interviewers
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push("/employer/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Go to Settings
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.map((member) => {
                    const isSelected = selectedInterviewerId === member.id;
                    return (
                      <button
                        key={member.id}
                        onClick={() => setSelectedInterviewerId(member.id)}
                        disabled={isConfirming}
                        className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all disabled:opacity-50 ${
                          isSelected
                            ? "border-primary-600 bg-primary-50"
                            : "border-secondary-200 bg-white hover:border-primary-300"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-primary-600 bg-primary-600"
                              : "border-secondary-300"
                          }`}
                        >
                          {isSelected && <Check className="h-5 w-5 text-white" />}
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-200 text-secondary-600">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-secondary-900 truncate">
                            {member.name}
                          </h4>
                          <p className="text-sm text-secondary-600 truncate">
                            {member.email}
                          </p>
                          {member.title && (
                            <p className="text-xs text-secondary-500 truncate">
                              {member.title}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meeting Platform Selection */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold text-secondary-900">
                Choose Meeting Platform
              </h3>
              <p className="mb-4 text-sm text-secondary-600">
                Select which platform you'd like to use for the video interview
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setMeetingPlatform("zoom")}
                  disabled={isConfirming}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                    meetingPlatform === "zoom"
                      ? "border-primary-600 bg-primary-50"
                      : "border-secondary-200 bg-white hover:border-primary-300"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded ${
                      meetingPlatform === "zoom" ? "bg-blue-600" : "bg-blue-500"
                    }`}
                  >
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-secondary-900">Zoom</p>
                    <p className="text-xs text-secondary-600">Professional video conferencing</p>
                  </div>
                </button>

                <button
                  onClick={() => setMeetingPlatform("google_meet")}
                  disabled={isConfirming}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                    meetingPlatform === "google_meet"
                      ? "border-primary-600 bg-primary-50"
                      : "border-secondary-200 bg-white hover:border-primary-300"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded ${
                      meetingPlatform === "google_meet" ? "bg-green-600" : "bg-green-500"
                    }`}
                  >
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-secondary-900">Google Meet</p>
                    <p className="text-xs text-secondary-600">Easy browser-based meetings</p>
                  </div>
                </button>
              </div>
              <p className="mt-3 text-xs text-secondary-500">
                Note: You'll be redirected to {meetingPlatform === "zoom" ? "Zoom" : "Google Meet"}{" "}
                to create the meeting. The link will be shared with the candidate automatically.
              </p>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.back()} disabled={isConfirming}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={isConfirming || !selectedSlotId || !selectedInterviewerId}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm & Create Meeting
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
