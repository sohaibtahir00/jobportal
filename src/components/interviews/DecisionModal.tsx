"use client";

import { X, Calendar, FileCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui";

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleNextRound: () => void;
  onSendOffer: () => void;
  onRejectCandidate: () => void;
  candidateName: string;
}

export default function DecisionModal({
  isOpen,
  onClose,
  onScheduleNextRound,
  onSendOffer,
  onRejectCandidate,
  candidateName,
}: DecisionModalProps) {
  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-secondary-900">
              Make Decision
            </h2>
            <p className="text-sm text-secondary-600 mt-1">
              Choose the next step for {candidateName}
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
        <div className="px-6 py-6 space-y-3">
          {/* Schedule Next Round */}
          <button
            onClick={() => handleAction(onScheduleNextRound)}
            className="w-full flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-secondary-900 mb-1">
                Schedule Next Round
              </h3>
              <p className="text-sm text-secondary-600">
                Move the candidate to the next interview round in the hiring process
              </p>
            </div>
          </button>

          {/* Send Offer */}
          <button
            onClick={() => handleAction(onSendOffer)}
            className="w-full flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <FileCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-secondary-900 mb-1">
                Send Offer
              </h3>
              <p className="text-sm text-secondary-600">
                Create and send a job offer to the candidate
              </p>
            </div>
          </button>

          {/* Reject Candidate */}
          <button
            onClick={() => handleAction(onRejectCandidate)}
            className="w-full flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all group"
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-secondary-900 mb-1">
                Reject Candidate
              </h3>
              <p className="text-sm text-secondary-600">
                Update application status to rejected and notify the candidate
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
