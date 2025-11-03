"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui";
import { FiltersSidebar, Filters } from "./FiltersSidebar";

interface MobileFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  resultsCount: number;
}

export function MobileFiltersDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  resultsCount,
}: MobileFiltersDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl lg:hidden">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-secondary-200 p-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Filters
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-secondary-600 transition-colors hover:bg-secondary-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <FiltersSidebar filters={filters} onFilterChange={onFilterChange} />
          </div>

          {/* Footer */}
          <div className="border-t border-secondary-200 p-4">
            <Button
              variant="primary"
              className="w-full"
              onClick={onClose}
            >
              Show {resultsCount} {resultsCount === 1 ? "Job" : "Jobs"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
