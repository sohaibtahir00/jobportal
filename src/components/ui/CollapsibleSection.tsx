"use client";

import { useState, useEffect, ReactNode } from "react";
import { ChevronDown, Check, AlertCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionStatus = "complete" | "incomplete" | "warning";

export interface CollapsibleSectionProps {
  /** Unique identifier for the section */
  id: string;
  /** Icon to display in the section header */
  icon: ReactNode;
  /** Icon background color class */
  iconBgColor?: string;
  /** Icon color class */
  iconColor?: string;
  /** Section title */
  title: string;
  /** Section description */
  description: string;
  /** Summary text shown when collapsed */
  summary?: string;
  /** Status of the section */
  status?: SectionStatus;
  /** Whether the section is expanded by default */
  defaultExpanded?: boolean;
  /** Controlled expanded state */
  isExpanded?: boolean;
  /** Callback when expanded state changes */
  onToggle?: (expanded: boolean) => void;
  /** Content to render inside the section */
  children: ReactNode;
  /** Additional className for the container */
  className?: string;
}

const statusIcons = {
  complete: <Check className="h-4 w-4 text-success-600" />,
  incomplete: <Circle className="h-4 w-4 text-secondary-400" />,
  warning: <AlertCircle className="h-4 w-4 text-warning-600" />,
};

const statusColors = {
  complete: "bg-success-100 border-success-200",
  incomplete: "bg-secondary-100 border-secondary-200",
  warning: "bg-warning-100 border-warning-200",
};

export function CollapsibleSection({
  id,
  icon,
  iconBgColor = "bg-primary-100",
  iconColor = "text-primary-600",
  title,
  description,
  summary,
  status = "incomplete",
  defaultExpanded = false,
  isExpanded: controlledExpanded,
  onToggle,
  children,
  className,
}: CollapsibleSectionProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // Use controlled or uncontrolled state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    onToggle?.(newExpanded);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-sm transition-all duration-200",
        isExpanded && "ring-2 ring-primary-500/20",
        className
      )}
    >
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`section-content-${id}`}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Status indicator */}
          <div
            className={cn(
              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border",
              statusColors[status]
            )}
          >
            {statusIcons[status]}
          </div>

          {/* Icon */}
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
              iconBgColor
            )}
          >
            <div className={iconColor}>{icon}</div>
          </div>

          {/* Title and summary */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-secondary-900">{title}</h3>
            </div>
            {!isExpanded && summary ? (
              <p className="text-sm text-secondary-500 truncate">{summary}</p>
            ) : (
              <p className="text-sm text-secondary-500">{description}</p>
            )}
          </div>
        </div>

        {/* Expand/collapse indicator */}
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-shrink-0 text-secondary-400 transition-transform duration-200 ml-4",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Content - Expandable */}
      <div
        id={`section-content-${id}`}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="border-t border-secondary-100 p-6">{children}</div>
      </div>
    </div>
  );
}

// Progress header component
export interface SettingsProgressProps {
  sections: {
    id: string;
    status: SectionStatus;
  }[];
  className?: string;
}

export function SettingsProgress({ sections, className }: SettingsProgressProps) {
  const completedCount = sections.filter((s) => s.status === "complete").length;
  const totalCount = sections.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-secondary-900">Company Settings</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-secondary-600">
            {completedCount}/{totalCount} Complete
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold",
              percentage === 100
                ? "bg-success-100 text-success-700"
                : percentage >= 50
                ? "bg-warning-100 text-warning-700"
                : "bg-secondary-100 text-secondary-700"
            )}
          >
            {percentage}%
          </span>
        </div>
      </div>
      <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            percentage === 100
              ? "bg-success-500"
              : percentage >= 50
              ? "bg-primary-500"
              : "bg-warning-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-secondary-500 mt-2">
        Manage your company profile and account preferences
      </p>
    </div>
  );
}
