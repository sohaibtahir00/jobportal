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
  Briefcase,
  Building2,
} from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { api } from "@/lib/api";

export default function SelectInterviewTimePage() {
  const params = useParams();
  const interviewId = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [interview, setInterview] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  // Redirect if not candidate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/candidate/interviews");
    }
    if (status === "authenticated" && session?.user?.role !== "CANDIDATE") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load interview and availability slots
  useEffect(() => {
    const loadData = async () => {
      if (status !== "authenticated") return;

      try {
        setIsLoading(true);
        // Fetch interview with availability slots
        const response = await api.get(`/api/interviews/${interviewId}`);
        setInterview(response.data.interview);

        // The interview should have availabilitySlots included
        if (response.data.interview?.availabilitySlots) {
          setAvailableSlots(response.data.interview.availabilitySlots);
        }
      } catch (err) {
        console.error("Failed to load interview:", err);
        setError("Failed to load interview details");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [interviewId, status]);

  const toggleSlot = (slotId: string) => {
    const newSelected = new Set(selectedSlots);
    if (newSelected.has(slotId)) {
      newSelected.delete(slotId);
    } else {
      newSelected.add(slotId);
    }
    setSelectedSlots(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedSlots.size === 0) {
      setError("Please select at least one time slot");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await api.post(`/api/interviews/${interviewId}/select-slots`, {
        slotIds: Array.from(selectedSlots),
      });

      router.push("/candidate/interviews");
    } catch (err: any) {
      console.error("Failed to submit selection:", err);
      setError(err.response?.data?.error || "Failed to submit your selection");
    } finally {
      setIsSaving(false);
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

  // Group slots by date
  const groupedSlots = availableSlots.reduce((acc: any, slot: any) => {
    const date = new Date(slot.startTime).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {});

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

  const jobTitle = interview.application?.job?.title || "Unknown Position";
  const jobType = interview.application?.job?.type || "";
  const jobLocation = interview.application?.job?.location || "";

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Interviews
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">
              Select Your Available Times
            </h1>
            <p className="text-secondary-600">
              Choose one or more time slots when you're available for the interview
            </p>
          </div>

          {/* Job Info */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <Briefcase className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-xl font-bold text-secondary-900">
                    {jobTitle}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {jobType && (
                      <Badge variant="secondary" size="sm">
                        {jobType}
                      </Badge>
                    )}
                    {jobLocation && (
                      <Badge variant="secondary" size="sm" className="gap-1">
                        <Building2 className="h-3 w-3" />
                        {jobLocation}
                      </Badge>
                    )}
                    <Badge variant="primary" size="sm">
                      {interview.duration} minutes
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mb-6 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="mb-3 font-bold text-secondary-900">
                How to select times:
              </h3>
              <ol className="space-y-2 text-sm text-secondary-700">
                <li className="flex items-start">
                  <span className="mr-2 font-bold text-primary-600">1.</span>
                  Select one or multiple time slots that work for you
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold text-primary-600">2.</span>
                  The employer will review your selections and confirm the final time
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold text-primary-600">3.</span>
                  You'll receive a calendar invite with the meeting link once confirmed
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Available Time Slots */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6 text-xl font-bold text-secondary-900">
                Employer's Available Times
              </h3>

              {Object.keys(groupedSlots).length === 0 ? (
                <p className="py-8 text-center text-secondary-600">
                  No available time slots found
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
                          const isSelected = selectedSlots.has(slot.id);
                          return (
                            <button
                              key={slot.id}
                              onClick={() => toggleSlot(slot.id)}
                              disabled={!slot.isAvailable || isSaving}
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

              {/* Selected Count */}
              {selectedSlots.size > 0 && (
                <div className="mt-6 rounded-lg bg-primary-50 p-4">
                  <p className="text-sm font-medium text-primary-900">
                    {selectedSlots.size} time slot{selectedSlots.size !== 1 ? "s" : ""} selected
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSaving || selectedSlots.size === 0}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Submit Selection ({selectedSlots.size})
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
