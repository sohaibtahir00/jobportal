"use client";

import { useState, useEffect } from "react";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => Promise<void>;
  initialNotes?: string | null;
  interviewId: string;
}

export default function NotesModal({
  isOpen,
  onClose,
  onSave,
  initialNotes,
  interviewId,
}: NotesModalProps) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNotes(initialNotes || "");
      setError(null);
    }
  }, [isOpen, initialNotes]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await onSave(notes);
      onClose();
    } catch (err: any) {
      console.error("Failed to save notes:", err);
      setError(err.message || "Failed to save notes. Please try again.");
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
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-bold text-secondary-900">
              {initialNotes ? "Edit Interview Notes" : "Add Interview Notes"}
            </h2>
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
          <label
            htmlFor="interview-notes"
            className="block text-sm font-medium text-secondary-700 mb-2"
          >
            Notes
          </label>
          <textarea
            id="interview-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSaving}
            rows={8}
            placeholder="Add any notes about the interview (preparation, topics to cover, candidate information, etc.)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
            <span>{notes.length} characters</span>
            {notes.length > 1000 && (
              <span className="text-warning-600">
                Consider keeping notes concise
              </span>
            )}
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
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
            {isSaving ? "Saving..." : "Save Notes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
