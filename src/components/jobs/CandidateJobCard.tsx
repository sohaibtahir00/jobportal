"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Briefcase, DollarSign, Clock, Heart, CheckCircle, Star } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { Job } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface CandidateJobCardProps {
  job: Job & {
    hasApplied?: boolean;
    isSaved?: boolean;
    applicationStatus?: string | null;
    matchScore?: number;
    matchFactors?: string[];
  };
  onSaveToggle?: (jobId: string, currentlySaved: boolean) => Promise<void>;
}

export function CandidateJobCard({ job, onSaveToggle }: CandidateJobCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  // Helper function to format job type for display
  const formatJobType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper function to format experience level
  const formatExperienceLevel = (level: string) => {
    return level.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper function to get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Handle save/unsave toggle
  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onSaveToggle || isSaving) return;

    setIsSaving(true);
    try {
      await onSaveToggle(job.id, isSaved);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Failed to toggle save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Get match score color
  const getMatchColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-blue-600 bg-blue-100';
    if (score >= 25) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden relative">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Save Button (top right) */}
        {onSaveToggle && (
          <button
            onClick={handleSaveToggle}
            disabled={isSaving}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            title={isSaved ? "Unsave job" : "Save job"}
          >
            <Heart
              className={`h-5 w-5 ${
                isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'
              } ${isSaving ? 'opacity-50' : ''}`}
            />
          </button>
        )}

        {/* Header with Logo and Title */}
        <div className="mb-4 flex items-start gap-3 pr-10">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-2xl">
            {job.employer?.companyLogo ? (
              <img src={job.employer.companyLogo} alt={job.employer.companyName} className="h-full w-full rounded-lg object-cover" />
            ) : (
              job.employer?.companyName?.charAt(0) || 'J'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 font-semibold text-secondary-900 line-clamp-2 text-base">
              {job.title}
            </h3>
            <p className="text-sm text-secondary-600 truncate">{job.employer?.companyName || 'Company'}</p>
          </div>
        </div>

        {/* Badges Row (Applied, Match Score, Exclusive) */}
        <div className="mb-3 flex flex-wrap gap-2">
          {job.hasApplied && (
            <Badge variant="success" size="sm" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Applied
            </Badge>
          )}

          {job.matchScore !== undefined && job.matchScore > 0 && (
            <Badge
              size="sm"
              className={`flex items-center gap-1 ${getMatchColor(job.matchScore)}`}
            >
              <Star className="h-3 w-3" />
              {job.matchScore}% Match
            </Badge>
          )}

          {job.isClaimed && (
            <Badge variant="primary" size="sm">
              Exclusive
            </Badge>
          )}
        </div>

        {/* Job Details */}
        <div className="mb-4 space-y-2 flex-grow">
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            <span>{formatJobType(job.type)}</span>
            <span className="text-secondary-400">•</span>
            <span className="truncate">{formatExperienceLevel(job.experienceLevel)}</span>
          </div>
          {job.salaryMin && job.salaryMax && (
            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span>
                {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
              </span>
            </div>
          )}
        </div>

        {/* Remote & Type Badges */}
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge
            variant={job.remote ? "success" : "secondary"}
            size="sm"
          >
            {job.remote ? 'Remote' : 'On-site'}
          </Badge>
          <Badge variant="outline" size="sm" className="capitalize">
            {formatJobType(job.type)}
          </Badge>
        </div>

        {/* Skills Tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {job.skills.slice(0, 3).map((tag: string, idx: number) => (
              <Badge key={idx} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{job.skills.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Match Factors (if high match) */}
        {job.matchFactors && job.matchFactors.length > 0 && job.matchScore && job.matchScore >= 50 && (
          <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-900 mb-1">Why this matches:</p>
            <ul className="text-xs text-blue-700 space-y-0.5">
              {job.matchFactors.slice(0, 2).map((factor, idx) => (
                <li key={idx}>• {factor}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-secondary-200 pt-4 mt-auto">
          <div className="flex items-center gap-1 text-xs text-secondary-500">
            <Clock className="h-3 w-3" />
            <span>{getRelativeTime(job.createdAt)}</span>
          </div>
          <Button
            variant={job.hasApplied ? "outline" : "primary"}
            size="sm"
            asChild
          >
            <Link href={`/jobs/${job.id}`}>
              {job.hasApplied ? 'View Status' : 'View Details'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
