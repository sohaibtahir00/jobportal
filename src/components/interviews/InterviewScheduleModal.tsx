"use client";

import { useState, useEffect } from "react";
import { X, Video, Loader2, Calendar as CalendarIcon, Clock, ListOrdered } from "lucide-react";
import { Button, Input, Badge } from "@/components/ui";
import { api } from "@/lib/api";

// Interview round templates
export const INTERVIEW_TEMPLATES = {
  standard: [
    {
      name: "Phone Screen",
      description: "Initial conversation with recruiter to discuss background and fit",
      duration: 30,
      order: 1,
    },
    {
      name: "Technical Interview",
      description: "In-depth technical assessment with the hiring team",
      duration: 60,
      order: 2,
    },
    {
      name: "Behavioral Interview",
      description: "Culture fit and soft skills evaluation",
      duration: 45,
      order: 3,
    },
    {
      name: "Final Interview",
      description: "Meeting with senior leadership and final decision",
      duration: 60,
      order: 4,
    },
  ],
  fastTrack: [
    {
      name: "Combined Screening",
      description: "Single round covering technical and behavioral assessment",
      duration: 90,
      order: 1,
    },
    {
      name: "Final Round",
      description: "Quick decision meeting with hiring manager",
      duration: 45,
      order: 2,
    },
  ],
  executive: [
    {
      name: "Executive Screening",
      description: "Initial conversation with senior leadership",
      duration: 45,
      order: 1,
    },
    {
      name: "Leadership Panel",
      description: "Panel interview with executive team",
      duration: 90,
      order: 2,
    },
    {
      name: "Strategic Discussion",
      description: "Deep dive into vision, strategy, and cultural alignment",
      duration: 120,
      order: 3,
    },
    {
      name: "Board Meeting",
      description: "Final presentation to board members or C-suite",
      duration: 60,
      order: 4,
    },
  ],
};

interface InterviewRound {
  id?: string;
  name: string;
  description?: string | null;
  duration: number;
  order: number;
}

interface InterviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  jobId: string;
  onSuccess?: () => void;
}

export default function InterviewScheduleModal({
  isOpen,
  onClose,
  applicationId,
  candidateName,
  jobTitle,
  jobId,
  onSuccess,
}: InterviewScheduleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");

  // Interview rounds state
  const [interviewRounds, setInterviewRounds] = useState<InterviewRound[]>([]);
  const [selectedRound, setSelectedRound] = useState<string>("");
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"standard" | "fastTrack" | "executive" | null>(null);
  const [isSettingUpRounds, setIsSettingUpRounds] = useState(false);

  // Fetch interview rounds when modal opens
  useEffect(() => {
    if (isOpen && jobId) {
      fetchInterviewRounds();
    }
  }, [isOpen, jobId]);

  const fetchInterviewRounds = async () => {
    try {
      const response = await api.get(`/api/employer/jobs/${jobId}/interview-rounds`);
      const rounds = response.data.rounds || [];
      setInterviewRounds(rounds);

      // If no rounds exist, show setup modal
      if (rounds.length === 0) {
        setShowSetupModal(true);
      } else {
        // Auto-select first round
        setSelectedRound(rounds[0]?.id || "");
        setDuration(rounds[0]?.duration?.toString() || "60");
      }
    } catch (err) {
      console.error("Failed to fetch interview rounds:", err);
      // If fetching fails, show setup modal
      setShowSetupModal(true);
    }
  };

  const setupInterviewRounds = async () => {
    if (!selectedTemplate) return;

    setIsSettingUpRounds(true);
    try {
      const templateRounds = INTERVIEW_TEMPLATES[selectedTemplate];
      await api.post(`/api/employer/jobs/${jobId}/interview-rounds`, {
        rounds: templateRounds,
      });

      // Refresh rounds
      await fetchInterviewRounds();
      setShowSetupModal(false);
      setSelectedTemplate(null);
    } catch (err) {
      console.error("Failed to setup interview rounds:", err);
      setError("Failed to setup interview rounds. Please try again.");
    } finally {
      setIsSettingUpRounds(false);
    }
  };

  const skipSetup = () => {
    setShowSetupModal(false);
    setSelectedTemplate(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Combine date and time
      const scheduledAt = new Date(`${date}T${time}`);

      // Validate future date
      if (scheduledAt <= new Date()) {
        throw new Error("Interview must be scheduled in the future");
      }

      // Find selected round details
      const round = interviewRounds.find((r) => r.id === selectedRound);

      // Create interview
      const response = await api.post("/api/interviews", {
        applicationId,
        type: "VIDEO", // Always VIDEO as per requirement
        scheduledAt: scheduledAt.toISOString(),
        duration: parseInt(duration),
        meetingLink,
        notes,
        round: round ? round.name : undefined, // Include round name if available
      });

      console.log("✅ Interview scheduled:", response.data);

      // Success
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err: any) {
      console.error("❌ Failed to schedule interview:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to schedule interview"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle round selection
  const handleRoundChange = (roundId: string) => {
    setSelectedRound(roundId);
    const round = interviewRounds.find((r) => r.id === roundId);
    if (round) {
      setDuration(round.duration.toString());
    }
  };

  const handleClose = () => {
    // Reset form
    setDate("");
    setTime("");
    setDuration("60");
    setMeetingLink("");
    setNotes("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-secondary-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">
              Schedule Interview
            </h2>
            <p className="mt-1 text-sm text-secondary-600">
              {candidateName} • {jobTitle}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-full p-2 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Interview Type Badge */}
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Interview Type
            </label>
            <Badge variant="primary" size="lg" className="gap-2">
              <Video className="h-4 w-4" />
              Video Interview
            </Badge>
          </div>

          {/* Interview Round Selector */}
          {interviewRounds.length > 0 && (
            <div>
              <label
                htmlFor="round"
                className="block text-sm font-semibold text-secondary-700 mb-2"
              >
                Interview Round <span className="text-red-500">*</span>
              </label>
              <select
                id="round"
                value={selectedRound}
                onChange={(e) => handleRoundChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 border-2 border-secondary-300 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none"
              >
                {interviewRounds.map((round) => (
                  <option key={round.id} value={round.id}>
                    Round {round.order}: {round.name} ({round.duration} min)
                    {round.description && ` - ${round.description}`}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-secondary-500">
                Select which interview round this is for
              </p>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-secondary-700 mb-2"
              >
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full px-4 py-2.5 border-2 border-secondary-300 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-sm font-semibold text-secondary-700 mb-2"
              >
                Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border-2 border-secondary-300 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none"
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-semibold text-secondary-700 mb-2"
            >
              Duration <span className="text-red-500">*</span>
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="w-full px-4 py-2.5 border-2 border-secondary-300 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none"
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {/* Meeting Link */}
          <div>
            <label
              htmlFor="meetingLink"
              className="block text-sm font-semibold text-secondary-700 mb-2"
            >
              Video Meeting Link <span className="text-red-500">*</span>
            </label>
            <Input
              id="meetingLink"
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://zoom.us/j/... or Google Meet link"
              required
              className="w-full"
            />
            <p className="mt-1.5 text-xs text-secondary-500">
              Provide a Zoom, Google Meet, or Microsoft Teams link
            </p>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-semibold text-secondary-700 mb-2"
            >
              Notes for Candidate (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add any preparation instructions or what to expect..."
              className="w-full px-4 py-2.5 border-2 border-secondary-300 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Interview"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* First-Time Setup Modal */}
      {showSetupModal && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-2xl m-4">
            {/* Setup Header */}
            <div className="border-b border-secondary-200 p-6">
              <h3 className="text-xl font-bold text-secondary-900">
                Setup Interview Process
              </h3>
              <p className="mt-2 text-sm text-secondary-600">
                Choose a template to structure your interview rounds, or skip to schedule without rounds.
              </p>
            </div>

            {/* Template Options */}
            <div className="p-6 space-y-4">
              {/* Standard Template */}
              <button
                type="button"
                onClick={() => setSelectedTemplate("standard")}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedTemplate === "standard"
                    ? "border-primary-500 bg-primary-50"
                    : "border-secondary-200 hover:border-secondary-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-secondary-900 flex items-center gap-2">
                      <ListOrdered className="h-4 w-4" />
                      Standard Process
                    </h4>
                    <p className="mt-1 text-sm text-secondary-600">
                      4 rounds: Phone Screen → Technical → Behavioral → Final Interview
                    </p>
                    <p className="mt-2 text-xs text-secondary-500">
                      Best for most positions with comprehensive evaluation
                    </p>
                  </div>
                  {selectedTemplate === "standard" && (
                    <div className="ml-4 h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              {/* Fast-Track Template */}
              <button
                type="button"
                onClick={() => setSelectedTemplate("fastTrack")}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedTemplate === "fastTrack"
                    ? "border-primary-500 bg-primary-50"
                    : "border-secondary-200 hover:border-secondary-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-secondary-900 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Fast-Track Process
                    </h4>
                    <p className="mt-1 text-sm text-secondary-600">
                      2 rounds: Combined Screening → Final Round
                    </p>
                    <p className="mt-2 text-xs text-secondary-500">
                      Ideal for urgent hires or entry-level positions
                    </p>
                  </div>
                  {selectedTemplate === "fastTrack" && (
                    <div className="ml-4 h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              {/* Executive Template */}
              <button
                type="button"
                onClick={() => setSelectedTemplate("executive")}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedTemplate === "executive"
                    ? "border-primary-500 bg-primary-50"
                    : "border-secondary-200 hover:border-secondary-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-secondary-900 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Executive Process
                    </h4>
                    <p className="mt-1 text-sm text-secondary-600">
                      4 rounds: Executive Screening → Leadership Panel → Strategic Discussion → Board Meeting
                    </p>
                    <p className="mt-2 text-xs text-secondary-500">
                      Comprehensive process for senior leadership roles
                    </p>
                  </div>
                  {selectedTemplate === "executive" && (
                    <div className="ml-4 h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Setup Actions */}
            <div className="border-t border-secondary-200 p-6 flex justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={skipSetup}
                disabled={isSettingUpRounds}
              >
                Skip for Now
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={setupInterviewRounds}
                disabled={!selectedTemplate || isSettingUpRounds}
              >
                {isSettingUpRounds ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting Up...
                  </>
                ) : (
                  "Use This Template"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
