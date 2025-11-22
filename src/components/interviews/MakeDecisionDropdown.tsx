"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle, ChevronDown, Calendar, FileCheck, XCircle } from "lucide-react";

interface MakeDecisionDropdownProps {
  onScheduleNextRound: () => void;
  onSendOffer: () => void;
  onRejectCandidate: () => void;
}

export default function MakeDecisionDropdown({
  onScheduleNextRound,
  onSendOffer,
  onRejectCandidate,
}: MakeDecisionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-primary-600 bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        <CheckCircle className="h-4 w-4" />
        Make Decision
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
          {/* Schedule Next Round */}
          <button
            onClick={() => handleMenuItemClick(onScheduleNextRound)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Schedule Next Round
          </button>

          {/* Send Offer */}
          <button
            onClick={() => handleMenuItemClick(onSendOffer)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors"
          >
            <FileCheck className="h-4 w-4" />
            Send Offer
          </button>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200"></div>

          {/* Reject Candidate */}
          <button
            onClick={() => handleMenuItemClick(onRejectCandidate)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            Reject Candidate
          </button>
        </div>
      )}
    </div>
  );
}
