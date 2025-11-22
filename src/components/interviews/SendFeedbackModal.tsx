"use client";

import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui";

const FEEDBACK_TEMPLATES = [
  {
    id: "positive-continue",
    label: "Positive - Moving Forward",
    preview: "Thank you for your time. We're excited to continue the process...",
    template: `Dear {candidateName},

Thank you for taking the time to interview with us for the {jobTitle} position. We were impressed with your background and experience.

We're excited to inform you that we'd like to move forward with your application to the next stage of our hiring process.

You'll hear from us within the next 2-3 business days with details about the next steps.

Best regards,
{companyName} Team`
  },
  {
    id: "positive-not-selected",
    label: "Positive - Not Selected",
    preview: "We were impressed by your skills but have decided to move forward with other candidates...",
    template: `Dear {candidateName},

Thank you for taking the time to interview with us for the {jobTitle} position. We appreciate your interest in joining our team.

After careful consideration, we have decided to move forward with other candidates whose experience more closely aligns with our current needs.

We were impressed by your skills and encourage you to apply for future opportunities that match your background.

We wish you all the best in your job search.

Best regards,
{companyName} Team`
  },
  {
    id: "needs-improvement",
    label: "Needs Improvement",
    preview: "Thank you for interviewing. We're looking for candidates with more experience in...",
    template: `Dear {candidateName},

Thank you for your interest in the {jobTitle} position and for taking the time to interview with us.

After reviewing your qualifications, we have decided to move forward with candidates who have more extensive experience in the specific areas we're focusing on for this role.

We appreciate the time you invested in the interview process and wish you success in your job search.

Best regards,
{companyName} Team`
  },
  {
    id: "custom",
    label: "Custom Message",
    preview: "Write your own feedback message",
    template: ""
  }
];

interface SendFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feedback: string) => Promise<void>;
  initialFeedback?: string | null;
  candidateName: string;
  jobTitle?: string;
}

export default function SendFeedbackModal({
  isOpen,
  onClose,
  onSave,
  initialFeedback,
  candidateName,
  jobTitle,
}: SendFeedbackModalProps) {
  const [feedback, setFeedback] = useState(initialFeedback || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("positive-continue");

  const applyTemplate = (templateId: string) => {
    const template = FEEDBACK_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    if (templateId === "custom") {
      setFeedback(initialFeedback || "");
    } else {
      // Replace placeholders
      let filledTemplate = template.template
        .replace(/{candidateName}/g, candidateName)
        .replace(/{jobTitle}/g, jobTitle || "this position")
        .replace(/{companyName}/g, "Our");

      setFeedback(filledTemplate);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialFeedback) {
        setFeedback(initialFeedback);
        setSelectedTemplate("custom");
      } else {
        setSelectedTemplate("positive-continue");
        applyTemplate("positive-continue");
      }
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, initialFeedback, candidateName, jobTitle]);

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
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
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
          {/* Template Selection */}
          <div className="mb-4">
            <label className="text-sm font-medium text-secondary-900 mb-3 block">
              Choose Feedback Template:
            </label>
            <div className="space-y-2">
              {FEEDBACK_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    applyTemplate(template.id);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="template"
                      checked={selectedTemplate === template.id}
                      onChange={() => {
                        setSelectedTemplate(template.id);
                        applyTemplate(template.id);
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {template.label}
                      </div>
                      <div className="text-sm text-gray-600 italic">
                        {template.preview}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Message */}
          <div className="mb-4">
            <label className="text-sm font-medium text-secondary-900 mb-2 block">
              {selectedTemplate === "custom" ? "Custom Feedback Message:" : "Feedback Preview & Edit:"}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={selectedTemplate === "custom" ? "Write your custom feedback message here..." : "You can edit this message before sending..."}
              className="w-full rounded-lg border border-secondary-300 px-4 py-3 text-sm text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
              rows={12}
              disabled={isSaving || success}
            />
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-secondary-500">{feedback.length} characters</span>
              {feedback.length > 2000 && (
                <span className="text-warning-600">
                  Consider keeping feedback concise
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 font-medium">
                ✓ Feedback sent successfully! An email has been sent to the candidate.
              </p>
            </div>
          )}

          {/* Info Note */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Note:</span> This feedback will be saved to the interview record and emailed to the candidate.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg sticky bottom-0">
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
