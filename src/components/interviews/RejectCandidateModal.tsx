"use client";

import { useState } from "react";
import { X, AlertTriangle, MessageSquare, Loader2 } from "lucide-react";

interface RejectCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rejectionReason?: string) => Promise<void>;
  candidateName: string;
  jobTitle: string;
}

const REJECTION_TEMPLATES = [
  {
    id: "skills",
    label: "Skills Mismatch",
    message: "Thank you for your interest in this position. After careful review, we've determined that your skills and experience don't align closely enough with our current requirements for this role. We encourage you to apply for other positions that may be a better match.",
  },
  {
    id: "experience",
    label: "Experience Level",
    message: "Thank you for applying. While we were impressed with your background, we're looking for candidates with a different level of experience for this particular role. We encourage you to keep an eye on our other openings that might be a better fit.",
  },
  {
    id: "qualifications",
    label: "Qualifications",
    message: "Thank you for your application. After reviewing your qualifications, we've decided to move forward with candidates whose experience more closely matches our specific requirements for this position.",
  },
  {
    id: "position-filled",
    label: "Position Filled",
    message: "Thank you for your interest in this role. We've decided to move forward with another candidate whose qualifications more closely matched our needs at this time. We appreciate the time you invested in the application process.",
  },
  {
    id: "custom",
    label: "Custom Message",
    message: "",
  },
];

export default function RejectCandidateModal({
  isOpen,
  onClose,
  onConfirm,
  candidateName,
  jobTitle,
}: RejectCandidateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [includeMessage, setIncludeMessage] = useState(false);
  const [error, setError] = useState<string>("");

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedTemplate("");
      setCustomMessage("");
      setIncludeMessage(false);
      setError("");
      onClose();
    }
  };

  const handleConfirm = async () => {
    console.log("RejectCandidateModal: handleConfirm called");
    setIsSubmitting(true);
    setError("");

    try {
      let message: string | undefined = undefined;

      if (includeMessage) {
        if (selectedTemplate === "custom") {
          message = customMessage.trim() || undefined;
        } else if (selectedTemplate) {
          const template = REJECTION_TEMPLATES.find((t) => t.id === selectedTemplate);
          message = template?.message || undefined;
        }
      }

      console.log("RejectCandidateModal: Calling onConfirm with message:", message);
      await onConfirm(message);
      console.log("RejectCandidateModal: onConfirm succeeded, closing modal");
      handleClose();
    } catch (error: any) {
      console.error("RejectCandidateModal: Error during confirmation:", error);
      setError(error?.message || "Failed to reject candidate. Please try again.");
      setIsSubmitting(false);
    }
  };

  const getMessagePreview = () => {
    if (selectedTemplate === "custom") {
      return customMessage.trim() || "Enter your custom message above";
    }
    const template = REJECTION_TEMPLATES.find((t) => t.id === selectedTemplate);
    return template?.message || "Select a template to preview";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-md">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Reject Candidate
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
          {/* Warning */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-900">Permanent Action</p>
              <p className="text-xs text-red-700 mt-0.5">
                This action cannot be undone. The candidate will be notified via email.
              </p>
            </div>
          </div>

          {/* Include Message Toggle */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              id="include-message"
              checked={includeMessage}
              onChange={(e) => setIncludeMessage(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <label htmlFor="include-message" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Include personalized message
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Add a message to help the candidate understand the decision
              </p>
            </label>
          </div>

          {/* Message Templates */}
          {includeMessage && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Select Message Template
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {REJECTION_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      disabled={isSubmitting}
                      className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedTemplate === template.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      } disabled:opacity-50`}
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {template.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message Input */}
              {selectedTemplate === "custom" && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Custom Message
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Enter your personalized message to the candidate..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    rows={4}
                  />
                </div>
              )}

              {/* Message Preview */}
              {selectedTemplate && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    MESSAGE PREVIEW:
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {getMessagePreview()}
                  </p>
                </div>
              )}
            </>
          )}

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

          {/* Quick Rejection Info */}
          {!includeMessage && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Quick Rejection</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  The candidate will receive a standard rejection email without a personalized message.
                </p>
              </div>
            </div>
          )}
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
            disabled={isSubmitting || (includeMessage && selectedTemplate === "custom" && !customMessage.trim())}
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                Confirm Rejection
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
