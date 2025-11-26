"use client";

import { Award, Shield, TrendingUp, Star, Download, Share2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, Badge, Button } from "@/components/ui";

export interface SkillsScoreData {
  overallScore: number;
  percentile: number;
  tier: string;
  completedAt: string;
  sectionScores?: {
    technicalSkills?: number;
    problemSolving?: number;
    codeQuality?: number;
    systemDesign?: number;
  };
  detailedBreakdown?: {
    [key: string]: number;
  };
  strengths?: string[];
  growthAreas?: string[];
  proctored?: boolean;
}

interface SkillsScoreCardProps {
  data: SkillsScoreData;
  variant?: "full" | "compact" | "mini";
  showActions?: boolean;
  className?: string;
}

const getTierInfo = (tier: string) => {
  const tiers: Record<string, { stars: number; color: string; bgColor: string; label: string }> = {
    ELITE: { stars: 5, color: "text-yellow-600", bgColor: "bg-yellow-50", label: "Elite" },
    ADVANCED: { stars: 4, color: "text-primary-600", bgColor: "bg-primary-50", label: "Advanced" },
    PROFICIENT: { stars: 3, color: "text-accent-600", bgColor: "bg-accent-50", label: "Proficient" },
    INTERMEDIATE: { stars: 2, color: "text-secondary-600", bgColor: "bg-secondary-100", label: "Intermediate" },
    BEGINNER: { stars: 1, color: "text-secondary-500", bgColor: "bg-secondary-50", label: "Beginner" },
  };
  return tiers[tier?.toUpperCase()] || tiers.INTERMEDIATE;
};

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-yellow-600";
  if (score >= 80) return "text-success-600";
  if (score >= 70) return "text-primary-600";
  if (score >= 60) return "text-accent-600";
  return "text-secondary-600";
};

const getProgressColor = (score: number) => {
  if (score >= 90) return "from-yellow-500 to-yellow-600";
  if (score >= 80) return "from-success-500 to-success-600";
  if (score >= 70) return "from-primary-500 to-primary-600";
  if (score >= 60) return "from-accent-500 to-accent-600";
  return "from-secondary-400 to-secondary-500";
};

export function SkillsScoreCard({
  data,
  variant = "full",
  showActions = true,
  className = "",
}: SkillsScoreCardProps) {
  const tierInfo = getTierInfo(data.tier);
  const scoreColor = getScoreColor(data.overallScore);

  // Mini variant - just score and tier badge
  if (variant === "mini") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <Award className="h-4 w-4 text-primary-600" />
          <span className={`font-bold ${scoreColor}`}>{data.overallScore}</span>
        </div>
        <Badge variant="secondary" size="sm">
          {tierInfo.label}
        </Badge>
        {data.proctored && (
          <span title="Verified & Proctored">
            <Shield className="h-3.5 w-3.5 text-success-600" />
          </span>
        )}
      </div>
    );
  }

  // Compact variant - score, tier, and percentile
  if (variant === "compact") {
    return (
      <Card className={`border-2 border-primary-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${scoreColor}`}>
                  {data.overallScore}
                </div>
                <div className="text-xs text-secondary-600">Score</div>
              </div>
              <div className="h-12 w-px bg-secondary-200" />
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < tierInfo.stars
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-secondary-300"
                      }`}
                    />
                  ))}
                </div>
                <Badge variant="secondary" size="sm" className={tierInfo.bgColor}>
                  {tierInfo.label}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-success-600">
                <TrendingUp className="h-4 w-4" />
                <span className="font-bold">Top {100 - Math.round(data.percentile)}%</span>
              </div>
              {data.proctored && (
                <div className="mt-1 flex items-center justify-end gap-1 text-xs text-success-600">
                  <Shield className="h-3 w-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant - complete score card with all details
  return (
    <Card className={`border-2 border-accent-200 bg-white shadow-xl ${className}`}>
      <CardContent className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-bold text-secondary-900">Skills Score Card</h3>
          </div>
          <Badge variant="secondary" size="sm">
            {new Date(data.completedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Badge>
        </div>

        {/* Overall Score */}
        <div className="mb-6 text-center">
          <div className="mb-2">
            <span className={`text-6xl font-bold ${scoreColor}`}>
              {data.overallScore}
            </span>
            <span className="text-3xl text-secondary-400">/100</span>
          </div>
          <Badge variant="success" size="lg" className="mb-2">
            Top {100 - Math.round(data.percentile)}%
          </Badge>
          <p className="text-sm text-secondary-600">Overall Performance</p>
        </div>

        {/* Performance Tier */}
        <div className={`mb-6 rounded-lg ${tierInfo.bgColor} p-4 text-center`}>
          <p className="mb-1 text-sm font-medium text-secondary-700">
            Performance Tier
          </p>
          <div className="mb-1 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < tierInfo.stars
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-secondary-300"
                }`}
              />
            ))}
          </div>
          <p className={`font-bold ${tierInfo.color}`}>{tierInfo.label}</p>
        </div>

        {/* Section Scores */}
        {data.sectionScores && (
          <div className="mb-6">
            <h4 className="mb-4 font-bold text-secondary-900">Skill Breakdown</h4>
            <div className="space-y-3">
              {data.sectionScores.technicalSkills !== undefined && (
                <ProgressBar
                  label="Technical Skills"
                  score={data.sectionScores.technicalSkills}
                />
              )}
              {data.sectionScores.problemSolving !== undefined && (
                <ProgressBar
                  label="Problem Solving"
                  score={data.sectionScores.problemSolving}
                />
              )}
              {data.sectionScores.codeQuality !== undefined && (
                <ProgressBar
                  label="Code Quality"
                  score={data.sectionScores.codeQuality}
                />
              )}
              {data.sectionScores.systemDesign !== undefined && (
                <ProgressBar
                  label="System Design"
                  score={data.sectionScores.systemDesign}
                />
              )}
            </div>
          </div>
        )}

        {/* Strengths */}
        {data.strengths && data.strengths.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 font-bold text-secondary-900">Top Strengths</h4>
            <div className="flex flex-wrap gap-2">
              {data.strengths.map((strength, idx) => (
                <Badge key={idx} variant="success" size="sm">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Growth Areas */}
        {data.growthAreas && data.growthAreas.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 font-bold text-secondary-900">Areas for Growth</h4>
            <div className="flex flex-wrap gap-2">
              {data.growthAreas.map((area, idx) => (
                <Badge key={idx} variant="secondary" size="sm">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Verification Badge */}
        {data.proctored && (
          <div className="mb-6 flex items-center justify-center gap-2 rounded-lg border-2 border-success-200 bg-success-50 py-3">
            <Shield className="h-5 w-5 text-success-600" />
            <span className="font-semibold text-success-700">
              Skills Verified & Proctored
            </span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share on LinkedIn
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Progress Bar Component
function ProgressBar({ label, score }: { label: string; score: number }) {
  const progressColor = getProgressColor(score);
  const scoreColor = getScoreColor(score);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-secondary-700">{label}</span>
        <span className={`font-bold ${scoreColor}`}>{score}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary-200">
        <div
          className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default SkillsScoreCard;
