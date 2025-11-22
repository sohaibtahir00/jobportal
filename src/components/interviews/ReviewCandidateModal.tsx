"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui";

interface ReviewCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
}

export default function ReviewCandidateModal({
  isOpen,
  onClose,
  candidateName,
}: ReviewCandidateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-secondary-900">
              Review Candidate
            </h2>
            <p className="text-sm text-secondary-600 mt-1">
              {candidateName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-secondary-600 mb-4">
            Candidate review functionality coming soon.
          </p>
          <p className="text-sm text-secondary-500">
            This will allow you to add internal notes and ratings about the candidate's interview performance.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
