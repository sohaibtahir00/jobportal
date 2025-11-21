"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Calendar, XCircle } from "lucide-react";

interface InterviewActionsDropdownProps {
  onReschedule: () => void;
  onCancel: () => void;
}

export default function InterviewActionsDropdown({
  onReschedule,
  onCancel,
}: InterviewActionsDropdownProps) {
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
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-gray-50 transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
        More
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
          {/* Reschedule - Disabled */}
          <button
            disabled
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
            title="Coming soon"
          >
            <Calendar className="h-4 w-4" />
            Reschedule
            <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded">Soon</span>
          </button>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200"></div>

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
