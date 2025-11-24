"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Calendar, XCircle, MessageCircle } from "lucide-react";

interface InterviewActionsDropdownProps {
  onMessage: () => void;
  onReschedule: () => void;
  onCancel: () => void;
}

export default function InterviewActionsDropdown({
  onMessage,
  onReschedule,
  onCancel,
}: InterviewActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-gray-50 transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
        More
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
          {/* Message Candidate */}
          <button
            onClick={() => handleMenuItemClick(onMessage)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Message Candidate
          </button>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200"></div>

          {/* Reschedule */}
          <button
            onClick={() => handleMenuItemClick(onReschedule)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-orange-50 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Reschedule
          </button>

          {/* Cancel Interview */}
          <button
            onClick={() => handleMenuItemClick(onCancel)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            Cancel Interview
          </button>
        </div>
      )}
    </div>
  );
}
