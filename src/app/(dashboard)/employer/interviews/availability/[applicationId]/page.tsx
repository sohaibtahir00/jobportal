"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  X,
  Loader2,
  ArrowLeft,
  Save,
  User,
  Briefcase,
} from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { api } from "@/lib/api";

interface TimeSlot {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export default function SetAvailabilityPage() {
  const params = useParams();
  const applicationId = params.applicationId as string;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { date: "", startTime: "", endTime: "" },
  ]);
  const [error, setError] = useState("");

  // Redirect if not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/interviews");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load application data
  useEffect(() => {
    const loadData = async () => {
      if (status !== "authenticated") return;

      try {
        setIsLoading(true);
        const response = await api.get(`/api/employer/applications/${applicationId}`);
        setApplicationData(response.data.application);
      } catch (err) {
        console.error("Failed to load application:", err);
        setError("Failed to load application details");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [applicationId, status]);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { date: "", startTime: "", endTime: "" }]);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length === 1) return;
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const updated = [...timeSlots];
    updated[index] = { ...updated[index], [field]: value };
    setTimeSlots(updated);
  };

  const validateSlots = (): boolean => {
    // Check all slots are filled
    for (const slot of timeSlots) {
      if (!slot.date || !slot.startTime || !slot.endTime) {
        setError("Please fill in all time slots");
        return false;
      }

      // Check end time is after start time
      if (slot.endTime <= slot.startTime) {
        setError("End time must be after start time");
        return false;
      }

      // Check date is in the future
      const slotDate = new Date(`${slot.date}T${slot.startTime}`);
      if (slotDate <= new Date()) {
        setError("All time slots must be in the future");
        return false;
      }
    }

    // Check for overlapping slots
    for (let i = 0; i < timeSlots.length; i++) {
      for (let j = i + 1; j < timeSlots.length; j++) {
        const slot1 = timeSlots[i];
        const slot2 = timeSlots[j];

        if (slot1.date === slot2.date) {
          const start1 = new Date(`${slot1.date}T${slot1.startTime}`);
          const end1 = new Date(`${slot1.date}T${slot1.endTime}`);
          const start2 = new Date(`${slot2.date}T${slot2.startTime}`);
          const end2 = new Date(`${slot2.date}T${slot2.endTime}`);

          if (
            (start1 < end2 && end1 > start2) ||
            (start2 < end1 && end2 > start1)
          ) {
            setError("Time slots cannot overlap");
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSave = async () => {
    setError("");

    if (!validateSlots()) return;

    try {
      setIsSaving(true);

      // Create interview with availability slots
      const response = await api.post("/api/interviews/availability", {
        applicationId,
        type: "VIDEO",
        duration: 60, // Default 1 hour
        availabilitySlots: timeSlots.map((slot) => ({
          startTime: new Date(`${slot.date}T${slot.startTime}`).toISOString(),
          endTime: new Date(`${slot.date}T${slot.endTime}`).toISOString(),
        })),
      });

      // Redirect to interviews page
      router.push("/employer/interviews");
    } catch (err: any) {
      console.error("Failed to save availability:", err);
      setError(
        err.response?.data?.error || "Failed to save availability"
      );
    } finally {
      setIsSaving(false);
    }
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

  if (!session || !applicationData) {
    return null;
  }

  const candidate = applicationData.candidate?.user;
  const job = applicationData.job;

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
            Back
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">
              Set Your Availability
            </h1>
            <p className="text-secondary-600">
              Choose time slots when you're available to interview{" "}
              <span className="font-medium">{candidate?.name}</span> for the{" "}
              <span className="font-medium">{job?.title}</span> position
            </p>
          </div>

          {/* Candidate Info */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <User className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-secondary-900">
                    {candidate?.name}
                  </h3>
                  <p className="text-sm text-secondary-600">{candidate?.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="primary" size="sm" className="gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job?.title}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="mb-3 font-bold text-secondary-900">
                How this works:
              </h3>
              <ol className="space-y-2 text-sm text-secondary-700">
                <li className="flex items-start">
                  <span className="mr-2 font-bold text-primary-600">1.</span>
                  Add multiple time slots when you're available
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold text-primary-600">2.</span>
                  The candidate will receive these options and select their
                  preferred times
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold text-primary-600">3.</span>
                  You'll be notified to confirm the final time and generate the
                  meeting link
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Time Slots Form */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-secondary-900">
                  Your Available Time Slots
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTimeSlot}
                  disabled={isSaving}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slot
                </Button>
              </div>

              <div className="space-y-4">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-lg border border-secondary-200 bg-secondary-50 p-4"
                  >
                    <div className="flex-1 space-y-4">
                      {/* Date */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-secondary-700">
                          Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={slot.date}
                            onChange={(e) =>
                              updateTimeSlot(index, "date", e.target.value)
                            }
                            min={new Date().toISOString().split("T")[0]}
                            disabled={isSaving}
                            className="w-full rounded-lg border-2 border-secondary-300 px-4 py-2.5 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 disabled:opacity-50"
                          />
                          <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                        </div>
                      </div>

                      {/* Time Range */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-secondary-700">
                            Start Time
                          </label>
                          <div className="relative">
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateTimeSlot(index, "startTime", e.target.value)
                              }
                              disabled={isSaving}
                              className="w-full rounded-lg border-2 border-secondary-300 px-4 py-2.5 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 disabled:opacity-50"
                            />
                            <Clock className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-secondary-700">
                            End Time
                          </label>
                          <div className="relative">
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateTimeSlot(index, "endTime", e.target.value)
                              }
                              disabled={isSaving}
                              className="w-full rounded-lg border-2 border-secondary-300 px-4 py-2.5 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 disabled:opacity-50"
                            />
                            <Clock className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    {timeSlots.length > 1 && (
                      <button
                        onClick={() => removeTimeSlot(index)}
                        disabled={isSaving}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                        title="Remove slot"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

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
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Send to Candidate
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
