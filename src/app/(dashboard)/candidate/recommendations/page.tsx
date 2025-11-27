"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  MapPin,
  DollarSign,
  Briefcase,
  Filter,
  SortAsc,
  ArrowRight,
  Heart,
  Loader2,
  AlertCircle,
  RefreshCcw,
  CheckCircle2,
  Target,
  Brain,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Skeleton } from "@/components/ui";
import { MatchScoreCard, MatchBreakdown } from "@/components/jobs";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

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

type SortOption = "match" | "salary" | "date";
type NicheFilter = "all" | "AI_ML" | "HEALTHCARE_IT" | "FINTECH" | "CYBERSECURITY";

export default function RecommendationsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<RecommendationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [minScore, setMinScore] = useState(30);
  const [nicheFilter, setNicheFilter] = useState<NicheFilter>("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [showFilters, setShowFilters] = useState(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("limit", "50");
      params.append("minScore", minScore.toString());
      if (nicheFilter !== "all") params.append("niche", nicheFilter);
      if (remoteOnly) params.append("remoteOnly", "true");

      const response = await api.get<RecommendationsResponse>(
        `/api/candidates/recommendations?${params.toString()}`
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
  }, [minScore, nicheFilter, remoteOnly]);

  // Sort recommendations
  const sortedRecommendations = useMemo(() => {
    if (!data?.recommendations) return [];

    const sorted = [...data.recommendations];

    switch (sortBy) {
      case "salary":
        return sorted.sort((a, b) => {
          const salaryA = a.job.salaryMax || a.job.salaryMin || 0;
          const salaryB = b.job.salaryMax || b.job.salaryMin || 0;
          return salaryB - salaryA;
        });
      case "date":
        return sorted.sort(
          (a, b) =>
            new Date(b.job.createdAt).getTime() -
            new Date(a.job.createdAt).getTime()
        );
      case "match":
      default:
        return sorted.sort((a, b) => b.matchScore - a.matchScore);
    }
  }, [data?.recommendations, sortBy]);

  const formatJobType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatNiche = (niche: string | null) => {
    if (!niche) return "";
    return niche.replace(/_/g, "/");
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Jobs Recommended for You
            </h1>
            <p className="text-secondary-600">
              Finding your best matches based on your profile...
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Jobs Recommended for You
            </h1>
          </div>
        </div>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-amber-800 mb-4">{error}</p>
            <Button variant="outline" onClick={fetchRecommendations}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Incomplete profile state
  if (data?.candidateProfile && !data.candidateProfile.profileComplete) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Jobs Recommended for You
            </h1>
            <p className="text-secondary-600">
              Based on your skills, experience, and preferences
            </p>
          </div>
        </div>

        {/* Profile completion prompt */}
        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Target className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-secondary-900 mb-2">
                  Complete Your Profile for Better Matches
                </h3>
                <p className="text-secondary-600 mb-4">
                  Add more information to your profile to get more accurate job
                  recommendations:
                </p>
                <div className="grid gap-2 sm:grid-cols-2 mb-4">
                  <ProfileCheckItem
                    complete={data.candidateProfile.hasSkills}
                    label="Add your skills"
                  />
                  <ProfileCheckItem
                    complete={data.candidateProfile.hasExperience}
                    label="Years of experience"
                  />
                  <ProfileCheckItem
                    complete={data.candidateProfile.hasLocation}
                    label="Preferred location"
                  />
                  <ProfileCheckItem
                    complete={data.candidateProfile.hasSalaryExpectation}
                    label="Salary expectations"
                  />
                </div>
                <Button asChild>
                  <Link href="/candidate/profile">Complete Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Still show recommendations if any */}
        {sortedRecommendations.length > 0 && (
          <RecommendationsList
            recommendations={sortedRecommendations}
            formatJobType={formatJobType}
            formatNiche={formatNiche}
            getRelativeTime={getRelativeTime}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Jobs Recommended for You
            </h1>
            <p className="text-secondary-600">
              {data?.totalMatched || 0} jobs match your profile
              {data?.highMatchCount ? ` (${data.highMatchCount} great matches)` : ""}
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/candidate/profile">
            <Target className="h-4 w-4 mr-2" />
            Update Preferences
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-secondary-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-9 rounded-md border border-secondary-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="match">Best Match</option>
                <option value="salary">Highest Salary</option>
                <option value="date">Most Recent</option>
              </select>
            </div>

            {/* Min score */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-600">Min Match:</span>
              <select
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value))}
                className="h-9 rounded-md border border-secondary-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="0">Any</option>
                <option value="30">30%+</option>
                <option value="50">50%+</option>
                <option value="60">60%+</option>
                <option value="70">70%+</option>
                <option value="80">80%+</option>
              </select>
            </div>

            {/* Niche filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-600">Niche:</span>
              <select
                value={nicheFilter}
                onChange={(e) => setNicheFilter(e.target.value as NicheFilter)}
                className="h-9 rounded-md border border-secondary-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="all">All Niches</option>
                <option value="AI_ML">AI/ML</option>
                <option value="HEALTHCARE_IT">Healthcare IT</option>
                <option value="FINTECH">Fintech</option>
                <option value="CYBERSECURITY">Cybersecurity</option>
              </select>
            </div>

            {/* Remote toggle */}
            <button
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-all ${
                remoteOnly
                  ? "bg-primary-50 border-primary-300 text-primary-700"
                  : "bg-white border-secondary-300 text-secondary-600 hover:bg-secondary-50"
              }`}
            >
              <MapPin className="h-4 w-4" />
              Remote Only
            </button>

            {/* Refresh */}
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchRecommendations}
              disabled={isLoading}
            >
              <RefreshCcw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {sortedRecommendations.length === 0 ? (
        <Card className="border-dashed border-2 border-secondary-300">
          <CardContent className="p-12 text-center">
            <Briefcase className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              No Matching Jobs Found
            </h3>
            <p className="text-secondary-600 mb-4">
              Try lowering your minimum match score or adjusting your filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setMinScore(0);
                setNicheFilter("all");
                setRemoteOnly(false);
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <RecommendationsList
          recommendations={sortedRecommendations}
          formatJobType={formatJobType}
          formatNiche={formatNiche}
          getRelativeTime={getRelativeTime}
        />
      )}
    </div>
  );
}

// Profile check item
function ProfileCheckItem({
  complete,
  label,
}: {
  complete: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {complete ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <div className="h-4 w-4 rounded-full border-2 border-secondary-300" />
      )}
      <span className={complete ? "text-secondary-600" : "text-secondary-800"}>
        {label}
      </span>
    </div>
  );
}

// Recommendations list component
function RecommendationsList({
  recommendations,
  formatJobType,
  formatNiche,
  getRelativeTime,
}: {
  recommendations: RecommendedJob[];
  formatJobType: (type: string) => string;
  formatNiche: (niche: string | null) => string;
  getRelativeTime: (date: string) => string;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <Card
          key={rec.job.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Main job info */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    {/* Company logo */}
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-xl">
                      {rec.job.employer.companyLogo ? (
                        <img
                          src={rec.job.employer.companyLogo}
                          alt={rec.job.employer.companyName}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        rec.job.employer.companyName?.charAt(0) || "J"
                      )}
                    </div>

                    {/* Job details */}
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                        {rec.job.title}
                      </h3>
                      <Link
                        href={`/companies/${
                          rec.job.employer.slug || rec.job.employer.id
                        }`}
                        className="text-secondary-600 hover:text-primary-600 text-sm"
                      >
                        {rec.job.employer.companyName}
                        {rec.job.employer.verified && (
                          <Badge variant="outline" size="sm" className="ml-2">
                            Verified
                          </Badge>
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* Match score badge */}
                  <div className="text-right flex-shrink-0">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                        rec.matchScore >= 80
                          ? "bg-green-100"
                          : rec.matchScore >= 60
                          ? "bg-amber-100"
                          : "bg-secondary-100"
                      }`}
                    >
                      <span
                        className={`text-xl font-bold ${
                          rec.matchScore >= 80
                            ? "text-green-600"
                            : rec.matchScore >= 60
                            ? "text-amber-600"
                            : "text-secondary-500"
                        }`}
                      >
                        {rec.matchScore}%
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500 mt-1">Match</p>
                  </div>
                </div>

                {/* Job meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                  <span className="flex items-center gap-1 text-secondary-600">
                    <MapPin className="h-4 w-4" />
                    {rec.job.remote ? "Remote" : rec.job.location}
                  </span>
                  {rec.job.salaryMin && rec.job.salaryMax && (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(rec.job.salaryMin)} -{" "}
                      {formatCurrency(rec.job.salaryMax)}
                    </span>
                  )}
                  <Badge variant="secondary" size="sm">
                    {formatJobType(rec.job.type)}
                  </Badge>
                  {rec.job.nicheCategory && (
                    <Badge variant="outline" size="sm">
                      {formatNiche(rec.job.nicheCategory)}
                    </Badge>
                  )}
                  <span className="text-xs text-secondary-500">
                    Posted {getRelativeTime(rec.job.createdAt)}
                  </span>
                </div>

                {/* Reasons */}
                {rec.reasons.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-secondary-500 uppercase mb-2">
                      Why This Match
                    </p>
                    <ul className="space-y-1">
                      {rec.reasons
                        .slice(0, expandedId === rec.job.id ? rec.reasons.length : 2)
                        .map((reason, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-secondary-700"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                    </ul>
                    {rec.reasons.length > 2 && (
                      <button
                        onClick={() =>
                          setExpandedId(
                            expandedId === rec.job.id ? null : rec.job.id
                          )
                        }
                        className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                      >
                        {expandedId === rec.job.id ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                )}

                {/* Skills */}
                {rec.matchingSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {rec.matchingSkills.slice(0, 5).map((skill, idx) => (
                      <Badge key={idx} variant="success" size="sm">
                        {skill}
                      </Badge>
                    ))}
                    {rec.matchingSkills.length > 5 && (
                      <Badge variant="secondary" size="sm">
                        +{rec.matchingSkills.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Expanded breakdown */}
                {expandedId === rec.job.id && (
                  <div className="mb-4 p-4 bg-secondary-50 rounded-lg">
                    <p className="text-xs font-medium text-secondary-500 uppercase mb-3">
                      Score Breakdown
                    </p>
                    <div className="grid grid-cols-5 gap-3 text-center">
                      <BreakdownItem
                        label="Skills"
                        score={rec.matchBreakdown.skills}
                      />
                      <BreakdownItem
                        label="Niche"
                        score={rec.matchBreakdown.niche}
                      />
                      <BreakdownItem
                        label="Experience"
                        score={rec.matchBreakdown.experience}
                      />
                      <BreakdownItem
                        label="Salary"
                        score={rec.matchBreakdown.salary}
                      />
                      <BreakdownItem
                        label="Location"
                        score={rec.matchBreakdown.location}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button asChild>
                    <Link href={`/jobs/${rec.job.id}`}>
                      View Job
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setExpandedId(
                        expandedId === rec.job.id ? null : rec.job.id
                      )
                    }
                  >
                    {expandedId === rec.job.id ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Less Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        More Details
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Score breakdown item
function BreakdownItem({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div
        className={`text-lg font-bold ${
          score >= 80
            ? "text-green-600"
            : score >= 60
            ? "text-amber-600"
            : "text-secondary-500"
        }`}
      >
        {score}%
      </div>
      <div className="text-xs text-secondary-500">{label}</div>
    </div>
  );
}
