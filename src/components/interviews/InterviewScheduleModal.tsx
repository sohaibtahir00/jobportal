"use client";

import { useState } from "react";
import { X, Video, Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button, Input, Badge } from "@/components/ui";
import { api } from "@/lib/api";

interface InterviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  onSuccess?: () => void;
}

export default function InterviewScheduleModal({
  isOpen,
  onClose,
  applicationId,
  candidateName,
  jobTitle,
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

      // Create interview
      const response = await api.post("/api/interviews", {
        applicationId,
        type: "VIDEO", // Always VIDEO as per requirement
        scheduledAt: scheduledAt.toISOString(),
        duration: parseInt(duration),
        meetingLink,
        notes,
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
    </div>
  );
}
