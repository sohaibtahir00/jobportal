"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  FileText,
  CheckCircle2,
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
  const searchParams = useSearchParams();
  const applicationId = params.applicationId as string;
  const roundParam = searchParams.get("round"); // Get round from URL (e.g., ?round=1)
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

  // Template selection
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedRound, setSelectedRound] = useState<any>(null); // The specific round being scheduled
  const [existingInterviews, setExistingInterviews] = useState<any[]>([]); // For auto-select logic
  const [jobRounds, setJobRounds] = useState<any[]>([]); // Job-level interview rounds

  // Redirect if not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/interviews");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load application data and templates
  useEffect(() => {
    const loadData = async () => {
      if (status !== "authenticated") return;

      try {
        setIsLoading(true);
        const response = await api.get(`/api/employer/applications/${applicationId}`);
        setApplicationData(response.data.application);

        const jobId = response.data.application?.jobId;

        // Load templates
        const templatesResponse = await api.get("/api/employer/interview-templates");
        setTemplates(templatesResponse.data.templates || []);

        // Load existing interviews for this application
        const interviewsResponse = await api.get(`/api/interviews?applicationId=${applicationId}`);
        setExistingInterviews(interviewsResponse.data.interviews || []);

        // Load job-level interview rounds
        if (jobId) {
          try {
            const roundsResponse = await api.get(`/api/employer/jobs/${jobId}/interview-rounds`);
            setJobRounds(roundsResponse.data.rounds || []);
          } catch (err) {
            console.log("No job rounds found, will use template");
          }
        }

        // Set default template if one exists
        const defaultTemplate = templatesResponse.data.templates?.find((t: any) => t.isDefault);
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate);
        }
      } catch (err) {
        console.error("Failed to load application:", err);
        setError("Failed to load application details");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [applicationId, status]);

  // Auto-select round based on URL parameter or next available round
  useEffect(() => {
    if (!selectedTemplate || !existingInterviews) return;

    // Use jobRounds if available, otherwise use template rounds
    const rounds = jobRounds.length > 0 ? jobRounds : selectedTemplate.rounds;
    if (!rounds || rounds.length === 0) return;

    let roundToSchedule = null;

    if (roundParam) {
      // If round specified in URL, use that
      const roundNumber = parseInt(roundParam);
      roundToSchedule = rounds.find((r: any) => r.order === roundNumber);
    } else {
      // Auto-select next round based on completed interviews
      const completedRounds = existingInterviews
        .filter((i: any) => i.status === "COMPLETED" && i.roundNumber)
        .map((i: any) => i.roundNumber);

      // Find the first round that hasn't been completed
      for (const round of rounds) {
        if (!completedRounds.includes(round.order)) {
          roundToSchedule = round;
          break;
        }
      }

      // If all rounds completed, default to first round (reschedule scenario)
      if (!roundToSchedule && rounds.length > 0) {
        roundToSchedule = rounds[0];
      }
    }

    if (roundToSchedule) {
      setSelectedRound(roundToSchedule);
    }
  }, [selectedTemplate, existingInterviews, jobRounds, roundParam]);

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

  const handleTemplateSelect = async (template: any) => {
    setSelectedTemplate(template);
    setShowTemplateModal(false);

    // Create InterviewRounds in database for this job
    if (applicationData?.jobId && template.rounds) {
      try {
        await api.post(`/api/employer/jobs/${applicationData.jobId}/interview-rounds`, {
          rounds: template.rounds.map((round: any, index: number) => ({
            name: round.name,
            description: round.description || null,
            duration: round.duration,
            order: round.order || index + 1,
          })),
        });

        // Reload job rounds
        const roundsResponse = await api.get(`/api/employer/jobs/${applicationData.jobId}/interview-rounds`);
        setJobRounds(roundsResponse.data.rounds || []);
      } catch (err) {
        console.error("Failed to create interview rounds:", err);
        // Don't fail the template selection if this fails
      }
    }
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

    // Check if we have a selected round
    if (!selectedRound) {
      setError("Please select an interview template first");
      return;
    }

    try {
      setIsSaving(true);

      // Create interview with availability slots
      const response = await api.post("/api/interviews/availability", {
        applicationId,
        type: "VIDEO",
        duration: selectedRound.duration, // Use template duration
        roundNumber: selectedRound.order, // Send round number for unlocking logic
        round: selectedRound.name, // Send round name
        roundName: selectedRound.name, // Send round name for clarity
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
            {selectedRound && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-100 px-4 py-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary-600" />
                <span className="font-semibold text-primary-900">
                  Scheduling: Round {selectedRound.order} - {selectedRound.name}
                </span>
                <span className="text-primary-700">
                  ({selectedRound.duration} minutes)
                </span>
              </div>
            )}
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

          {/* Interview Template Selection */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary-900">
                      Interview Template
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {selectedTemplate
                        ? `Using: ${selectedTemplate.name} (${selectedTemplate.rounds.length} rounds)`
                        : "Choose a template for the interview process"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateModal(true)}
                  disabled={isSaving}
                >
                  {selectedTemplate ? "Change Template" : "Select Template"}
                </Button>
              </div>

              {selectedTemplate && (
                <div className="mt-4 rounded-lg border border-secondary-200 bg-secondary-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-secondary-700">
                    Interview Rounds:
                  </p>
                  <ol className="space-y-2">
                    {selectedTemplate.rounds.map((round: any, index: number) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="mr-2 font-bold text-primary-600">
                          {index + 1}.
                        </span>
                        <div>
                          <span className="font-medium">{round.name}</span>
                          <span className="text-secondary-600">
                            {" "}
                            ({round.duration} minutes)
                          </span>
                          {round.description && (
                            <p className="text-secondary-600">
                              {round.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Template Selection Modal */}
          {showTemplateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="mx-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-secondary-900">
                    Choose Interview Template
                  </h3>
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="text-secondary-400 hover:text-secondary-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        selectedTemplate?.id === template.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-secondary-200 hover:border-primary-300 hover:bg-secondary-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-secondary-900">
                              {template.name}
                            </h4>
                            {template.isDefault && (
                              <Badge variant="success" size="sm">
                                Default
                              </Badge>
                            )}
                            {template.isBuiltIn && (
                              <Badge variant="secondary" size="sm">
                                Built-in
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-secondary-600">
                            {template.rounds.length} round
                            {template.rounds.length !== 1 ? "s" : ""}
                          </p>
                          <ol className="mt-2 space-y-1">
                            {template.rounds.map((round: any, index: number) => (
                              <li
                                key={index}
                                className="text-sm text-secondary-700"
                              >
                                <span className="font-medium">{index + 1}.</span>{" "}
                                {round.name} ({round.duration} min)
                                {round.description && (
                                  <span className="text-secondary-600">
                                    {" "}
                                    - {round.description}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ol>
                        </div>
                        {selectedTemplate?.id === template.id && (
                          <CheckCircle2 className="h-6 w-6 text-primary-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

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
