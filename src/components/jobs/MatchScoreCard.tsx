"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Target,
  Briefcase,
  MapPin,
  DollarSign,
  Brain,
} from "lucide-react";
import { Badge, Card, CardContent, Progress } from "@/components/ui";

export interface MatchBreakdown {
  skills: number;
  niche: number;
  experience: number;
  salary: number;
  location: number;
}

export interface MatchScoreCardProps {
  score: number;
  breakdown: MatchBreakdown;
  reasons: string[];
  matchingSkills?: string[];
  missingSkills?: string[];
  variant?: "full" | "compact" | "mini";
  className?: string;
}

// Get color based on score
function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-secondary-500";
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-amber-100";
  return "bg-secondary-100";
}

function getProgressColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-secondary-400";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent Match";
  if (score >= 80) return "Great Match";
  if (score >= 70) return "Good Match";
  if (score >= 60) return "Fair Match";
  if (score >= 50) return "Partial Match";
  return "Low Match";
}

// Mini variant - just the score badge
function MiniScore({ score }: { score: number }) {
  return (
    <Badge
      variant={score >= 80 ? "success" : score >= 60 ? "warning" : "secondary"}
      className="font-semibold"
    >
      {score}% Match
    </Badge>
  );
}

// Compact variant - score + label
function CompactScore({ score, className }: { score: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full ${getScoreBgColor(
          score
        )}`}
      >
        <span className={`text-lg font-bold ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>
      <div>
        <p className={`text-sm font-medium ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </p>
        <p className="text-xs text-secondary-500">based on your profile</p>
      </div>
    </div>
  );
}

// Full variant - complete breakdown
export function MatchScoreCard({
  score,
  breakdown,
  reasons,
  matchingSkills = [],
  missingSkills = [],
  variant = "full",
  className = "",
}: MatchScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (variant === "mini") {
    return <MiniScore score={score} />;
  }

  if (variant === "compact") {
    return <CompactScore score={score} className={className} />;
  }

  // Full variant
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        {/* Header with score */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-full ${getScoreBgColor(
                score
              )}`}
            >
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </span>
            </div>
            <div>
              <p className={`text-lg font-semibold ${getScoreColor(score)}`}>
                {getScoreLabel(score)}
              </p>
              <p className="text-sm text-secondary-500">Match Score</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-secondary-500 hover:text-secondary-700 p-1"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Why recommended reasons */}
        {reasons.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-secondary-500 uppercase mb-2">
              Why This Match
            </p>
            <ul className="space-y-1">
              {reasons.slice(0, isExpanded ? reasons.length : 3).map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-secondary-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <>
            {/* Score breakdown */}
            <div className="mb-4 pt-4 border-t border-secondary-200">
              <p className="text-xs font-medium text-secondary-500 uppercase mb-3">
                Score Breakdown
              </p>
              <div className="space-y-3">
                <BreakdownRow
                  icon={<Brain className="h-4 w-4" />}
                  label="Skills"
                  score={breakdown.skills}
                  weight="40%"
                />
                <BreakdownRow
                  icon={<Target className="h-4 w-4" />}
                  label="Niche"
                  score={breakdown.niche}
                  weight="25%"
                />
                <BreakdownRow
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Experience"
                  score={breakdown.experience}
                  weight="15%"
                />
                <BreakdownRow
                  icon={<DollarSign className="h-4 w-4" />}
                  label="Salary"
                  score={breakdown.salary}
                  weight="10%"
                />
                <BreakdownRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  score={breakdown.location}
                  weight="10%"
                />
              </div>
            </div>

            {/* Matching skills */}
            {matchingSkills.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-secondary-500 uppercase mb-2">
                  Matching Skills ({matchingSkills.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {matchingSkills.map((skill, idx) => (
                    <Badge key={idx} variant="success" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing skills */}
            {missingSkills.length > 0 && (
              <div>
                <p className="text-xs font-medium text-secondary-500 uppercase mb-2">
                  Skills to Develop ({missingSkills.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {missingSkills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            See details
          </button>
        )}
      </CardContent>
    </Card>
  );
}

// Breakdown row component
function BreakdownRow({
  icon,
  label,
  score,
  weight,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
  weight: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-secondary-400">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-secondary-700">{label}</span>
          <span className="text-xs text-secondary-500">
            {score}% <span className="text-secondary-400">({weight})</span>
          </span>
        </div>
        <div className="h-1.5 bg-secondary-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getProgressColor(
              score
            )}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Export mini badge component separately for convenience
export function MatchScoreBadge({ score }: { score: number }) {
  return <MiniScore score={score} />;
}

// Export compact score component
export function MatchScoreCompact({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return <CompactScore score={score} className={className} />;
}
