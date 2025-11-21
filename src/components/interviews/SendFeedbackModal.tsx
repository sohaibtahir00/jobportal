"use client";

import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui";

interface SendFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feedback: string) => Promise<void>;
  initialFeedback?: string | null;
  candidateName: string;
}

export default function SendFeedbackModal({
  isOpen,
  onClose,
  onSave,
  initialFeedback,
  candidateName,
}: SendFeedbackModalProps) {
  const [feedback, setFeedback] = useState(initialFeedback || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFeedback(initialFeedback || "");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, initialFeedback]);

  const handleSave = async () => {
    if (!feedback.trim()) {
      setError("Please enter feedback before sending");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave(feedback);
      setSuccess(true);

      // Close modal after success message shows for 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Failed to save feedback:", err);
      setError(err.message || "Failed to save feedback. Please try again.");
      setSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary-600" />
            <div>
              <h2 className="text-xl font-bold text-secondary-900">
                Send Feedback to Candidate
              </h2>
              <p className="text-sm text-secondary-600 mt-1">
                Provide constructive feedback for {candidateName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <label
            htmlFor="interview-feedback"
            className="block text-sm font-medium text-secondary-700 mb-2"
          >
            Feedback Message
          </label>
          <textarea
            id="interview-feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isSaving || success}
            rows={10}
            placeholder="Share constructive feedback about the candidate's interview performance, strengths, and areas for improvement..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
            <span>{feedback.length} characters</span>
            {feedback.length > 2000 && (
              <span className="text-warning-600">
                Consider keeping feedback concise
              </span>
            )}
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 font-medium">
                ✓ Feedback saved successfully!
              </p>
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This feedback will be saved to the interview record. Email functionality will be available soon.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSaving || success}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || success}
          >
            {isSaving ? "Saving..." : success ? "Saved!" : "Save Feedback"}
          </Button>
        </div>
      </div>
    </div>
  );
}
