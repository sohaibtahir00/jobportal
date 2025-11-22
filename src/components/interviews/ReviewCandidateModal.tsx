"use client";

import { useState, useEffect } from "react";
import { X, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui";

interface ReviewData {
  overallRating: number;
  technicalSkills: "strong" | "weak" | null;
  communication: "strong" | "weak" | null;
  cultureFit: "strong" | "weak" | null;
  problemSolving: "strong" | "weak" | null;
  notes: string;
}

interface ReviewCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reviewData: ReviewData) => Promise<void>;
  candidateName: string;
  jobTitle: string;
  initialData?: ReviewData | null;
}

export default function ReviewCandidateModal({
  isOpen,
  onClose,
  onSave,
  candidateName,
  jobTitle,
  initialData,
}: ReviewCandidateModalProps) {
  const [technicalSkills, setTechnicalSkills] = useState<"strong" | "weak" | null>(null);
  const [communication, setCommunication] = useState<"strong" | "weak" | null>(null);
  const [cultureFit, setCultureFit] = useState<"strong" | "weak" | null>(null);
  const [problemSolving, setProblemSolving] = useState<"strong" | "weak" | null>(null);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculate overall rating based on skills
  const calculateOverallRating = (): number => {
    const scores = [technicalSkills, communication, cultureFit, problemSolving];
    const total = scores.reduce((sum, skill) => {
      if (skill === "strong") return sum + 1.25;
      if (skill === "weak") return sum + 0;
      return sum; // null = 0 (no contribution)
    }, 0);
    return Math.round(total); // Returns 0-5
  };

  const overallRating = calculateOverallRating();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Load existing review data
        setTechnicalSkills((initialData.technicalSkills as "strong" | "weak" | null) || null);
        setCommunication((initialData.communication as "strong" | "weak" | null) || null);
        setCultureFit((initialData.cultureFit as "strong" | "weak" | null) || null);
        setProblemSolving((initialData.problemSolving as "strong" | "weak" | null) || null);
        setNotes(initialData.notes || "");
      } else {
        // Reset form for new review
        setTechnicalSkills(null);
        setCommunication(null);
        setCultureFit(null);
        setProblemSolving(null);
        setNotes("");
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      setError(null);

      await onSave({
        overallRating: overallRating, // Use calculated value
        technicalSkills,
        communication,
        cultureFit,
        problemSolving,
        notes,
      });

      onClose();
    } catch (err: any) {
      console.error("Failed to save review:", err);
      setError(err.message || "Failed to save review. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const toggleSkillAssessment = (
    skill: "technicalSkills" | "communication" | "cultureFit" | "problemSolving",
    value: "strong" | "weak"
  ) => {
    const setter = {
      technicalSkills: setTechnicalSkills,
      communication: setCommunication,
      cultureFit: setCultureFit,
      problemSolving: setProblemSolving,
    }[skill];

    const currentValue = {
      technicalSkills,
      communication,
      cultureFit,
      problemSolving,
    }[skill];

    setter(currentValue === value ? null : value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-secondary-900">
              {initialData ? "Edit Review" : "Review Candidate"}
            </h2>
            <p className="text-sm text-secondary-600 mt-1">
              {candidateName} • {jobTitle}
            </p>
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
        <div className="px-6 py-4 space-y-6">
          {/* Overall Rating - Auto Calculated */}
          <div>
            <label className="text-sm font-medium text-secondary-900 mb-2 block">
              Overall Rating (Auto-calculated)
            </label>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= overallRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-bold text-blue-900">
                {overallRating}/5
              </span>
            </div>
            <p className="text-xs text-secondary-600 mt-2">
              Rating is calculated based on your skill assessments below
            </p>
          </div>

          {/* Skills Assessment */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-secondary-700">
              Skills Assessment
            </h3>

            {/* Technical Skills */}
            <div>
              <label className="block text-sm text-secondary-600 mb-2">
                Technical Skills
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    toggleSkillAssessment("technicalSkills", "strong")
                  }
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    technicalSkills === "strong"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 text-gray-700 hover:border-green-300"
                  } disabled:opacity-50`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Strong
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toggleSkillAssessment("technicalSkills", "weak")
                  }
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    technicalSkills === "weak"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-300 text-gray-700 hover:border-red-300"
                  } disabled:opacity-50`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  Weak
                </button>
              </div>
            </div>

            {/* Communication */}
            <div>
              <label className="block text-sm text-secondary-600 mb-2">
                Communication
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    toggleSkillAssessment("communication", "strong")
                  }
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    communication === "strong"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 text-gray-700 hover:border-green-300"
                  } disabled:opacity-50`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Strong
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toggleSkillAssessment("communication", "weak")
                  }
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    communication === "weak"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-300 text-gray-700 hover:border-red-300"
                  } disabled:opacity-50`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  Weak
                </button>
              </div>
            </div>

            {/* Culture Fit */}
            <div>
              <label className="block text-sm text-secondary-600 mb-2">
                Culture Fit
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleSkillAssessment("cultureFit", "strong")}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    cultureFit === "strong"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 text-gray-700 hover:border-green-300"
                  } disabled:opacity-50`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Strong
                </button>
                <button
                  type="button"
                  onClick={() => toggleSkillAssessment("cultureFit", "weak")}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    cultureFit === "weak"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-300 text-gray-700 hover:border-red-300"
                  } disabled:opacity-50`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  Weak
                </button>
              </div>
            </div>

            {/* Problem Solving */}
            <div>
              <label className="block text-sm text-secondary-600 mb-2">
                Problem Solving
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    toggleSkillAssessment("problemSolving", "strong")
                  }
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    problemSolving === "strong"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 text-gray-700 hover:border-green-300"
                  } disabled:opacity-50`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Strong
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toggleSkillAssessment("problemSolving", "weak")
                  }
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    problemSolving === "weak"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-300 text-gray-700 hover:border-red-300"
                  } disabled:opacity-50`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  Weak
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="review-notes"
              className="block text-sm font-medium text-secondary-700 mb-2"
            >
              Additional Notes
            </label>
            <textarea
              id="review-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSaving}
              rows={4}
              placeholder="Add your interview notes here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This review is for internal use only and will not be shared with the candidate.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 rounded-b-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
