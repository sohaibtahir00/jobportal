"use client";

import { useState } from "react";
import { X, Calendar, AlertTriangle, Loader2 } from "lucide-react";

interface RescheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void>;
  candidateName: string;
  jobTitle: string;
  scheduledDate?: string;
}

export default function RescheduleInterviewModal({
  isOpen,
  onClose,
  onConfirm,
  candidateName,
  jobTitle,
  scheduledDate,
}: RescheduleInterviewModalProps) {
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleClose = () => {
    if (!isSubmitting) {
      setReason("");
      setError("");
      onClose();
    }
  };

  const handleConfirm = async () => {
    console.log("RescheduleInterviewModal: handleConfirm called");
    setIsSubmitting(true);
    setError("");

    try {
      console.log("RescheduleInterviewModal: Calling onConfirm with reason:", reason);
      await onConfirm(reason.trim() || undefined);
      console.log("RescheduleInterviewModal: onConfirm succeeded, closing modal");
      handleClose();
    } catch (error: any) {
      console.error("RescheduleInterviewModal: Error during confirmation:", error);
      setError(error?.message || "Failed to reschedule interview. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formattedDate = scheduledDate
    ? new Date(scheduledDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not scheduled";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Reschedule Interview
                </h2>
                <p className="text-sm text-gray-600">
                  {candidateName} • {jobTitle}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Current Schedule Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Current Schedule</p>
              <p className="text-xs text-blue-700 mt-0.5">{formattedDate}</p>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-900">Important</p>
              <p className="text-xs text-orange-700 mt-0.5">
                The current interview will be cancelled and you'll need to set new availability slots. The candidate will be notified about this change.
              </p>
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Reason for Rescheduling (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter a reason for rescheduling (e.g., 'Schedule conflict', 'Need more time to review application', etc.)"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none resize-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              This reason will be shared with the candidate to help them understand the change.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Next Steps Info */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Next Steps</p>
              <p className="text-xs text-green-700 mt-0.5">
                After confirming, you'll be redirected to set new availability slots for this interview.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Rescheduling...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                Confirm Reschedule
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
