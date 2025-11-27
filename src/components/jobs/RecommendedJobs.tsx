"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Briefcase,
  DollarSign,
  Sparkles,
  AlertCircle,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Skeleton } from "@/components/ui";
import { MatchScoreBadge, MatchBreakdown } from "./MatchScoreCard";
import { api } from "@/lib/api";
import { formatCurrency, resolveImageUrl } from "@/lib/utils";

interface RecommendedJob {
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    remote: boolean;
    remoteType: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    nicheCategory: string | null;
    experienceLevel: string;
    type: string;
    skills: string[];
    createdAt: string;
    employer: {
      id: string;
      slug: string | null;
      companyName: string;
      companyLogo: string | null;
      industry: string | null;
      verified: boolean;
    };
  };
  matchScore: number;
  matchBreakdown: MatchBreakdown;
  reasons: string[];
  matchingSkills: string[];
  missingSkills: string[];
}

interface RecommendationsResponse {
  recommendations: RecommendedJob[];
  totalMatched: number;
  highMatchCount: number;
  candidateProfile: {
    hasSkills: boolean;
    hasLocation: boolean;
    hasExperience: boolean;
    hasSalaryExpectation: boolean;
    hasNiche: boolean;
    profileComplete: boolean;
  };
}

interface RecommendedJobsProps {
  limit?: number;
  showViewAll?: boolean;
  className?: string;
}

export function RecommendedJobs({
  limit = 6,
  showViewAll = true,
  className = "",
}: RecommendedJobsProps) {
  const [data, setData] = useState<RecommendationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<RecommendationsResponse>(
        `/api/candidates/recommendations?limit=${limit}`
      );
      setData(response.data);
    } catch (err: any) {
      console.error("Failed to fetch recommendations:", err);
      setError(err.response?.data?.error || "Failed to load recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [limit]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-secondary-900">
              Recommended for You
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`${className}`}>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
            <p className="text-amber-800 mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchRecommendations}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No recommendations or incomplete profile
  if (!data || data.recommendations.length === 0) {
    const profile = data?.candidateProfile;

    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900">
            Recommended for You
          </h3>
        </div>
        <Card className="border-dashed border-2 border-secondary-300">
          <CardContent className="p-8 text-center">
            <Briefcase className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-secondary-900 mb-2">
              {profile && !profile.profileComplete
                ? "Complete Your Profile"
                : "No Recommendations Yet"}
            </h4>
            <p className="text-secondary-600 mb-4">
              {profile && !profile.profileComplete
                ? "Add your skills, experience, and preferences to get personalized job recommendations."
                : "We couldn't find any matching jobs right now. Try updating your preferences or check back later."}
            </p>
            <Button variant="primary" asChild>
              <Link href="/candidate/profile">
                {profile && !profile.profileComplete
                  ? "Complete Profile"
                  : "Update Preferences"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900">
            Recommended for You
          </h3>
          {data.highMatchCount > 0 && (
            <Badge variant="success" size="sm">
              {data.highMatchCount} great {data.highMatchCount === 1 ? "match" : "matches"}
            </Badge>
          )}
        </div>
        {showViewAll && data.totalMatched > limit && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/candidate/recommendations">
              View All ({data.totalMatched})
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Job cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.recommendations.map((rec) => (
          <RecommendedJobCard key={rec.job.id} recommendation={rec} />
        ))}
      </div>
    </div>
  );
}

// Individual job card with match score
function RecommendedJobCard({ recommendation }: { recommendation: RecommendedJob }) {
  const { job, matchScore, reasons, matchingSkills } = recommendation;

  const formatJobType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Match score badge */}
        <div className="flex items-start justify-between mb-3">
          <MatchScoreBadge score={matchScore} />
          {job.employer.verified && (
            <Badge variant="outline" size="sm">
              Verified
            </Badge>
          )}
        </div>

        {/* Job info */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-lg">
            {job.employer.companyLogo ? (
              <img
                src={resolveImageUrl(job.employer.companyLogo) || ''}
                alt={job.employer.companyName}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              job.employer.companyName?.charAt(0) || "J"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-secondary-900 line-clamp-1">
              {job.title}
            </h4>
            <Link
              href={`/companies/${job.employer.slug || job.employer.id}`}
              className="text-sm text-secondary-600 hover:text-primary-600 truncate block"
            >
              {job.employer.companyName}
            </Link>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1 mb-3 text-sm text-secondary-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">
              {job.remote ? "Remote" : job.location}
            </span>
          </div>
          {job.salaryMin && job.salaryMax && (
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <DollarSign className="h-3.5 w-3.5" />
              <span>
                {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
              </span>
            </div>
          )}
        </div>

        {/* Top reason */}
        {reasons.length > 0 && (
          <p className="text-xs text-secondary-500 mb-3 line-clamp-1">
            {reasons[0]}
          </p>
        )}

        {/* Matching skills preview */}
        {matchingSkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {matchingSkills.slice(0, 3).map((skill, idx) => (
              <Badge key={idx} variant="success" size="sm" className="text-xs">
                {skill}
              </Badge>
            ))}
            {matchingSkills.length > 3 && (
              <Badge variant="secondary" size="sm" className="text-xs">
                +{matchingSkills.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-3 border-t border-secondary-200 flex gap-2">
          <Button variant="primary" size="sm" className="flex-1" asChild>
            <Link href={`/jobs/${job.id}`}>View Job</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Export the types for use elsewhere
export type { RecommendedJob, RecommendationsResponse };
