"use client";

import { useState, useEffect } from "react";
import {
  X,
  Star,
  ThumbsUp,
  ThumbsDown,
  Code,
  MessageCircle,
  Users,
  Lightbulb,
  FileText,
  Lock,
  Save,
  Loader2,
  ClipboardCheck,
} from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Candidate Info Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {candidateName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {initialData ? "Edit Review" : "Interview Review"}
                </h2>
                <p className="text-sm text-gray-600">
                  {candidateName} • {jobTitle}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSaving}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Overall Rating with Visual Progress */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Overall Rating
            </label>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 transition-all duration-200 ${
                        star <= overallRating
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">{overallRating}/5</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {overallRating >= 5 ? "Excellent" : overallRating >= 4 ? "Good" : overallRating >= 3 ? "Average" : overallRating >= 2 ? "Below Average" : overallRating >= 1 ? "Poor" : "Not Rated"}
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300"
                  style={{ width: `${(overallRating / 5) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Auto-calculated based on your skill assessments below
            </p>
          </div>

          {/* Skills Assessment Grid */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-gray-700 mb-4 block flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-blue-500" />
              Skills Assessment
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Technical Skills */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Code className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Technical Skills</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSkillAssessment("technicalSkills", "strong")}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      technicalSkills === "strong"
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Strong
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSkillAssessment("technicalSkills", "weak")}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      technicalSkills === "weak"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Weak
                  </button>
                </div>
              </div>

              {/* Communication */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">Communication</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSkillAssessment("communication", "strong")}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      communication === "strong"
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Strong
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSkillAssessment("communication", "weak")}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      communication === "weak"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Weak
                  </button>
                </div>
              </div>

              {/* Culture Fit */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-pink-600" />
                  </div>
                  <span className="font-medium text-gray-900">Culture Fit</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSkillAssessment("cultureFit", "strong")}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      cultureFit === "strong"
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Strong
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSkillAssessment("cultureFit", "weak")}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      cultureFit === "weak"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Weak
                  </button>
                </div>
              </div>

              {/* Problem Solving */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="font-medium text-gray-900">Problem Solving</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSkillAssessment("problemSolving", "strong")}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      problemSolving === "strong"
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Strong
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSkillAssessment("problemSolving", "weak")}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      problemSolving === "weak"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Weak
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSaving}
              placeholder="Add your interview observations, key takeaways, concerns, or anything notable..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={4}
            />
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Lock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Internal Use Only</p>
              <p className="text-xs text-blue-700 mt-0.5">This review will not be shared with the candidate.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Review
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
