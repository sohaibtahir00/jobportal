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
import WeeklyCalendarPicker from "@/components/interviews/WeeklyCalendarPicker";

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
  const interviewIdParam = searchParams.get("interviewId"); // Get interviewId for reschedule flow
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [oldInterview, setOldInterview] = useState<any>(null); // For reschedule flow
  const [isReschedule, setIsReschedule] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { date: "", startTime: "", endTime: "" },
  ]);
  const [error, setError] = useState("");

  // Calendar integration state
  const [calendarSlots, setCalendarSlots] = useState<{ startTime: Date; endTime: Date }[]>([]);
  const [busyTimes, setBusyTimes] = useState<{ start: string; end: string; title?: string }[]>([]);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [loadingBusyTimes, setLoadingBusyTimes] = useState(false);

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

  // Fetch old interview if this is a reschedule flow
  useEffect(() => {
    const fetchOldInterview = async () => {
      if (!interviewIdParam || status !== "authenticated") return;

      try {
        setIsReschedule(true);
        const response = await api.get(`/api/interviews/${interviewIdParam}`);
        setOldInterview(response.data.interview);
        console.log("Old interview loaded for reschedule:", response.data.interview);
      } catch (err) {
        console.error("Failed to load old interview:", err);
      }
    };

    fetchOldInterview();
  }, [interviewIdParam, status]);

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
            const rounds = roundsResponse.data.rounds || [];
            setJobRounds(rounds);

            // Only auto-load template if this applicant has existing interviews
            if (rounds.length > 0 && interviewsResponse.data.interviews?.length > 0) {
              setShowTemplateModal(false);

              // Create a "template" object from existing rounds for UI consistency
              setSelectedTemplate({
                id: 'existing',
                name: 'Interview Process',
                rounds: rounds.map((round: any) => ({
                  name: round.name,
                  duration: round.duration,
                  description: round.description,
                  order: round.order
                }))
              });
            } else {
              // No interviews yet - don't auto-load, let user select template
              setShowTemplateModal(rounds.length === 0); // Only show modal if no rounds at all
              const defaultTemplate = templatesResponse.data.templates?.find((t: any) => t.isDefault);
              if (defaultTemplate) {
                setSelectedTemplate(defaultTemplate);
              }
            }
          } catch (err) {
            console.log("No job rounds found, will use template");
            // Set default template if one exists
            const defaultTemplate = templatesResponse.data.templates?.find((t: any) => t.isDefault);
            if (defaultTemplate) {
              setSelectedTemplate(defaultTemplate);
            }
          }
        } else {
          // No jobId, set default template if one exists
          const defaultTemplate = templatesResponse.data.templates?.find((t: any) => t.isDefault);
          if (defaultTemplate) {
            setSelectedTemplate(defaultTemplate);
          }
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
    } else if (existingInterviews.length > 0) {
      // Only auto-select if applicant has existing interviews
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
    } else {
      // If no interviews exist yet, default to first round
      // This is the initial interview scheduling scenario
      if (rounds.length > 0) {
        roundToSchedule = rounds[0];
      }
    }

    if (roundToSchedule) {
      setSelectedRound(roundToSchedule);
    }
  }, [selectedTemplate, existingInterviews, jobRounds, roundParam]);

  // Check if Google Calendar is connected
  useEffect(() => {
    async function checkCalendar() {
      try {
        const res = await api.get("/api/employer/integrations/google-calendar/status");
        setCalendarConnected(res.data.connected);
      } catch (error) {
        console.error("Failed to check calendar status:", error);
      }
    }
    if (status === "authenticated") {
      checkCalendar();
    }
  }, [status]);

  // Fetch busy times if calendar connected
  useEffect(() => {
    if (!calendarConnected) return;

    async function fetchBusyTimes() {
      setLoadingBusyTimes(true);
      try {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 14); // 2 weeks ahead

        const params = new URLSearchParams({
          start: start.toISOString(),
          end: end.toISOString(),
        });

        const res = await api.get(`/api/employer/integrations/google-calendar/busy-times?${params}`);
        if (res.data.busyTimes) {
          setBusyTimes(res.data.busyTimes);
        }
      } catch (error) {
        console.error("Failed to fetch busy times:", error);
      } finally {
        setLoadingBusyTimes(false);
      }
    }

    fetchBusyTimes();
  }, [calendarConnected]);

  // Add old interview time to busy times if rescheduling
  useEffect(() => {
    if (isReschedule && oldInterview?.scheduledAt) {
      const oldStartTime = new Date(oldInterview.scheduledAt);
      const oldEndTime = new Date(oldStartTime.getTime() + (oldInterview.duration || 60) * 60000);

      // Add old time slot to busy times so it appears blocked
      const blockedSlot = {
        start: oldStartTime.toISOString(),
        end: oldEndTime.toISOString(),
        title: "Previously Scheduled (Blocked)",
      };

      setBusyTimes((prev) => [...prev, blockedSlot]);

      console.log("Blocked old interview time:", {
        start: blockedSlot.start,
        end: blockedSlot.end,
        oldInterview: {
          scheduledAt: oldInterview.scheduledAt,
          duration: oldInterview.duration,
        },
      });
    }
  }, [isReschedule, oldInterview]);

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

    // Check if we have slots selected
    if (calendarSlots.length === 0) {
      setError("Please select at least one time slot");
      return;
    }

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
        availabilitySlots: calendarSlots.map((slot) => ({
          startTime: slot.startTime.toISOString(),
          endTime: slot.endTime.toISOString(),
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

  // Debug logging before render
  console.log("[Availability Page] Render state:", {
    isReschedule,
    hasOldInterview: !!oldInterview,
    busyTimesCount: busyTimes.length,
    busyTimes,
  });

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

          {/* Reschedule Banner */}
          {isReschedule && oldInterview && (
            <Card className="mb-6 border-2 border-orange-300 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-200 text-orange-700">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-bold text-orange-900">
                      🔄 Rescheduling Interview
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="rounded-lg bg-white p-3 border border-orange-200">
                        <p className="font-semibold text-orange-900 mb-1">Previous Schedule:</p>
                        <p className="text-orange-800">
                          {oldInterview.scheduledAt && (
                            <>
                              {new Date(oldInterview.scheduledAt).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })} at {new Date(oldInterview.scheduledAt).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </>
                          )}
                        </p>
                      </div>
                      {oldInterview.notes?.includes('[PENDING_RESCHEDULE]') && (
                        <div className="rounded-lg bg-white p-3 border border-orange-200">
                          <p className="font-semibold text-orange-900 mb-1">Reschedule Reason:</p>
                          <p className="text-orange-800">
                            {oldInterview.notes.split('[PENDING_RESCHEDULE]')[1]?.trim() || 'Employer requested reschedule'}
                          </p>
                        </div>
                      )}
                      <div className="mt-3 rounded-lg bg-orange-100 p-3 border border-orange-300">
                        <p className="font-semibold text-orange-900">
                          ⚠️ Please select NEW time slots below (the previous time is blocked)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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

          {/* Google Calendar Connection Banner */}
          {!calendarConnected && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">
                    Connect Google Calendar
                  </h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Sync your calendar to automatically show busy times and
                    prevent double-booking.
                  </p>
                  <a
                    href="/api/employer/integrations/google-calendar/oauth"
                    className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Connect Google Calendar
                  </a>
                </div>
              </div>
            </div>
          )}

          {calendarConnected && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">
                  Google Calendar Connected
                </span>
                {loadingBusyTimes && (
                  <span className="text-sm text-green-700">• Syncing...</span>
                )}
              </div>
            </div>
          )}

          {/* Calendar Picker */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Select Your Available Time Slots
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                Click on time slots to select your availability. Each slot is{" "}
                {selectedRound?.duration || 60} minutes.
                {calendarConnected && " Red blocks show times you're already busy."}
              </p>

              <WeeklyCalendarPicker
                duration={selectedRound?.duration || 60}
                onSlotsChange={setCalendarSlots}
                busyTimes={busyTimes}
                initialSlots={[]}
              />
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
              disabled={calendarSlots.length === 0 || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Send to Candidate ({calendarSlots.length} slots)
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
