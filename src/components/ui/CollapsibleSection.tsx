"use client";

import { useState, useEffect, ReactNode } from "react";
import { ChevronDown, Check, AlertCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionStatus = "complete" | "incomplete" | "warning";
export type SectionVariant = "default" | "accent";

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
  /** Visual variant of the section */
  variant?: SectionVariant;
}

const statusIcons = {
  complete: <Check className="h-4 w-4 text-success-600" />,
  incomplete: <AlertCircle className="h-4 w-4 text-warning-600" />,
  warning: <AlertCircle className="h-4 w-4 text-warning-600" />,
};

const statusColors = {
  complete: "bg-success-100 border-success-200",
  incomplete: "bg-warning-100 border-warning-200",
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
  variant = "default",
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

  // Variant-specific styles
  const variantStyles = {
    default: {
      container: "border-secondary-200 bg-white",
      expandedRing: "ring-2 ring-primary-500/20",
      header: "hover:bg-secondary-50",
      contentBorder: "border-secondary-100",
    },
    accent: {
      container: "border-accent-200/60 bg-gradient-to-br from-white via-white to-accent-50/30",
      expandedRing: "ring-2 ring-accent-500/30 shadow-lg shadow-accent-500/10",
      header: "hover:bg-accent-50/50",
      contentBorder: "border-accent-100/60",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border shadow-sm transition-all duration-300",
        styles.container,
        isExpanded && styles.expandedRing,
        className
      )}
    >
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex w-full items-center justify-between p-5 text-left transition-colors",
          styles.header
        )}
        aria-expanded={isExpanded}
        aria-controls={`section-content-${id}`}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Status indicator */}
          <div
            className={cn(
              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border shadow-sm",
              statusColors[status]
            )}
          >
            {statusIcons[status]}
          </div>

          {/* Icon */}
          <div
            className={cn(
              "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl shadow-sm",
              iconBgColor
            )}
          >
            <div className={iconColor}>{icon}</div>
          </div>

          {/* Title and summary */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-secondary-900 text-base">{title}</h3>
            </div>
            {!isExpanded && summary ? (
              <p className="text-sm text-secondary-500 truncate mt-0.5">{summary}</p>
            ) : (
              <p className="text-sm text-secondary-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {/* Expand/collapse indicator */}
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ml-4",
          isExpanded ? "bg-primary-100" : "bg-secondary-100"
        )}>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isExpanded ? "rotate-180 text-primary-600" : "text-secondary-500"
            )}
          />
        </div>
      </button>

      {/* Content - Expandable */}
      <div
        id={`section-content-${id}`}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className={cn("border-t p-6", styles.contentBorder)}>{children}</div>
      </div>
    </div>
  );
}

// Progress header component
export interface SettingsProgressProps {
  sections: {
    id: string;
    name: string;
    status: SectionStatus;
  }[];
  onSectionClick?: (sectionId: string) => void;
  className?: string;
  /** Title for the settings page */
  title?: string;
  /** Description shown below the progress bar */
  description?: string;
}

export function SettingsProgress({ sections, onSectionClick, className, title = "Settings", description }: SettingsProgressProps) {
  const completedCount = sections.filter((s) => s.status === "complete").length;
  const totalCount = sections.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  // Get incomplete sections (status is "incomplete", not "warning" since warnings are optional)
  const incompleteSections = sections.filter((s) => s.status === "incomplete");

  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
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
      {description && (
        <p className="text-sm text-secondary-500 mt-2">
          {description}
        </p>
      )}

      {/* Incomplete sections notice - Modern card design */}
      {incompleteSections.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-secondary-50 to-secondary-100/50 border border-secondary-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                <AlertCircle className="h-4 w-4 text-primary-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 mb-2">
                Complete setup to unlock all features
              </p>
              <div className="flex flex-wrap gap-2">
                {incompleteSections.map((section) => (
                  onSectionClick ? (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => onSectionClick(section.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-secondary-200 text-secondary-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      {section.name}
                    </button>
                  ) : (
                    <span
                      key={section.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-secondary-200 text-secondary-700 shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      {section.name}
                    </span>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
