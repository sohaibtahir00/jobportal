"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, MessageCircle, Eye, Send } from "lucide-react";

interface CompletedInterviewActionsDropdownProps {
  onMessage: () => void;
  onReview: () => void;
  onSendFeedback: () => void;
}

export default function CompletedInterviewActionsDropdown({
  onMessage,
  onReview,
  onSendFeedback,
}: CompletedInterviewActionsDropdownProps) {
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
          {/* Message Candidate */}
          <button
            onClick={() => handleMenuItemClick(onMessage)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Message Candidate
          </button>

          {/* Review Candidate */}
          <button
            onClick={() => handleMenuItemClick(onReview)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Review Candidate
          </button>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200"></div>

          {/* Send Feedback */}
          <button
            onClick={() => handleMenuItemClick(onSendFeedback)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors"
          >
            <Send className="h-4 w-4" />
            Send Feedback
          </button>
        </div>
      )}
    </div>
  );
}
