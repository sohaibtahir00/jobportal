"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Users,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Share2,
  Bookmark,
  Loader2,
  Info,
  CheckCircle,
  AlertCircle,
  Heart,
  Sparkles,
} from "lucide-react";
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, useToast } from "@/components/ui";
import { formatCurrency, resolveImageUrl } from "@/lib/utils";
import { JobCard } from "@/components/jobs/JobCard";
import { MatchScoreCard } from "@/components/jobs/MatchScoreCard";
import ApplicationForm from "@/components/jobs/ApplicationForm";
import { ApplicationSuccessModal } from "@/components/jobs/ApplicationSuccessModal";
import { generateJobPostingJsonLd } from "@/lib/seo";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useJob, useJobs } from "@/hooks/useJobs";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [jsonLd, setJsonLd] = useState<Record<string, unknown> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch job from API (now includes candidateInfo if authenticated)
  const { data, isLoading, error } = useJob(jobId);
  const job = data?.job;
  const candidateInfo = data?.candidateInfo;

  // Fetch similar jobs (same niche)
  const { data: similarJobsData } = useJobs({
    niche: job?.niche,
    limit: 3,
  });

  // Fetch match score for logged-in candidates
  const { data: matchData, isLoading: isMatchLoading } = useQuery({
    queryKey: ['job-match', jobId],
    queryFn: async () => {
      const response = await api.get(`/api/jobs/${jobId}/match`);
      return response.data;
    },
    enabled: !!session && !!jobId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Save/Unsave job handler
  const handleSaveToggle = async () => {
    if (!session || isSaving) return;

    setIsSaving(true);
    try {
      if (candidateInfo?.isSaved) {
        await api.delete(`/api/jobs/${jobId}/save`);
        showToast("info", "Job Removed", "Job removed from your saved list.");
      } else {
        await api.post(`/api/jobs/${jobId}/save`);
        showToast("success", "Job Saved", "Job added to your saved list.");
      }
      // Refetch job to update candidateInfo
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
    } catch (error) {
      console.error('Failed to toggle save:', error);
      showToast("error", "Error", "Failed to save job. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Share job handler
  const handleShare = async () => {
    const shareData = {
      title: job?.title || 'Job Opportunity',
      text: `Check out this job: ${job?.title} at ${job?.employer?.companyName || 'Company'}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("success", "Link Copied", "Job link copied to clipboard!");
      }
    } catch (error) {
      // User cancelled share or error occurred
      if ((error as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href);
        showToast("success", "Link Copied", "Job link copied to clipboard!");
      }
    }
  };

  // Generate JSON-LD structured data for the job
  useEffect(() => {
    if (job) {
      const structuredData = generateJobPostingJsonLd(job);
      setJsonLd(structuredData);
    }
  }, [job]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary-600" />
          <p className="text-lg text-secondary-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error or Not Found state
  if (error || !job) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-secondary-900">
            Job Not Found
          </h1>
          <p className="mb-8 text-lg text-secondary-600">
            {error
              ? (error as any)?.response?.data?.message || "Failed to load job details"
              : "The job you're looking for doesn't exist or has been removed."}
          </p>
          <Button variant="primary" asChild>
            <Link href="/jobs">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get similar jobs (excluding current job)
  const similarJobs = similarJobsData?.jobs?.filter((j) => j.id !== jobId) || [];

  return (
    <>
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <Script
          id="job-posting-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <ErrorBoundary>
        {/* Company Banner */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary-600 to-accent-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          <div className="container relative h-full flex items-end pb-6 md:pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 w-full">
              {/* Company Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-xl md:rounded-2xl shadow-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-primary-600 border-2 md:border-4 border-white flex-shrink-0">
                {(job as any).logo || (job as any).employer?.companyName?.charAt(0) || 'J'}
              </div>

              <div className="text-white flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-white/90">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{job.employer?.companyName || 'Company'}</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-white/90 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="truncate max-w-[200px] sm:max-w-none">{job.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                    {job.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Metadata Bar - RESPONSIVE */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="container py-3 md:py-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                {/* Salary - PROMINENT */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Salary Range</div>
                    <div className="text-base sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {job.salaryMin && job.salaryMax ? (
                        `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}`
                      ) : (
                        'Competitive'
                      )}
                    </div>
                  </div>
                </div>

                {/* Posted Date */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Posted</div>
                    <div className="text-sm sm:text-lg font-bold text-gray-900">
                      {new Date(job.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Apply Button - Show different states based on authentication and application status */}
                {/* For employers, show job status instead of apply button */}
                {session?.user?.role === 'EMPLOYER' ? (
                  <Badge
                    className={`flex-1 sm:flex-none text-sm sm:text-base px-4 py-2 ${
                      job.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : job.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : job.status === 'CLOSED'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-secondary-100 text-secondary-800 border-secondary-200'
                    }`}
                  >
                    {job.status === 'ACTIVE' ? 'Active Job' : job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                  </Badge>
                ) : !session ? (
                  <Button
                    variant="primary"
                    asChild
                    className="flex-1 sm:flex-none bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-sm sm:text-base"
                  >
                    <Link href="/login?redirect=/jobs/[jobId]">Sign in to Apply</Link>
                  </Button>
                ) : candidateInfo?.hasApplied ? (
                  <Button
                    variant="outline"
                    disabled
                    className="flex-1 sm:flex-none gap-2 text-sm sm:text-base border-green-300 bg-green-50 text-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Applied
                  </Button>
                ) : !candidateInfo?.profileComplete ? (
                  <Button
                    variant="primary"
                    asChild
                    className="flex-1 sm:flex-none bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-sm sm:text-base gap-2"
                  >
                    <Link href="/candidate/profile">
                      <AlertCircle className="h-4 w-4" />
                      Complete Profile to Apply
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setIsApplicationFormOpen(true)}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-sm sm:text-base"
                  >
                    Apply Now
                  </Button>
                )}

                {/* Save Button - Only show for authenticated candidates (not employers) */}
                {session && session.user?.role !== 'EMPLOYER' && (
                  <Button
                    variant="outline"
                    onClick={handleSaveToggle}
                    disabled={isSaving}
                    className="gap-2 px-3 sm:px-4"
                  >
                    {candidateInfo?.isSaved ? (
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    ) : (
                      <Heart className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {candidateInfo?.isSaved ? 'Saved' : 'Save'}
                    </span>
                  </Button>
                )}

                {/* Share button - Hide for employers */}
                {session?.user?.role !== 'EMPLOYER' && (
                  <Button
                    variant="outline"
                    className="gap-2 px-3 sm:px-4"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
          <div className="container">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/jobs">
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Application Status Card - Show if already applied */}
            {candidateInfo?.hasApplied && candidateInfo.application && (
              <Card className="mb-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-900 mb-1">
                        You applied to this position
                      </h3>
                      <p className="text-sm text-green-700 mb-3">
                        Applied on {new Date(candidateInfo.application.appliedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-900">Application Status:</span>
                        <Badge
                          variant={candidateInfo.application.status === 'PENDING' ? 'secondary' : 'primary'}
                          className="capitalize"
                        >
                          {candidateInfo.application.status.toLowerCase().replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Why This Job Matches You - For logged in candidates with match data */}
            {session && matchData?.matchScore !== undefined && matchData.matchScore >= 50 && (
              <Card className="mb-6 border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-accent-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <Sparkles className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-primary-900">
                          Why This Job Matches You
                        </h3>
                        <Badge variant="primary" className="text-sm">
                          {matchData.matchScore}% Match
                        </Badge>
                      </div>
                      {matchData.reasons && matchData.reasons.length > 0 && (
                        <ul className="space-y-1 text-sm text-primary-700">
                          {matchData.reasons.slice(0, 3).map((reason: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary-500" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {matchData.matchingSkills && matchData.matchingSkills.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-primary-200">
                          <p className="text-xs font-medium text-primary-800 mb-2">Matching Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {matchData.matchingSkills.slice(0, 6).map((skill: string, idx: number) => (
                              <Badge key={idx} variant="secondary" size="sm" className="bg-primary-100 text-primary-700">
                                {skill}
                              </Badge>
                            ))}
                            {matchData.matchingSkills.length > 6 && (
                              <Badge variant="secondary" size="sm" className="bg-primary-100 text-primary-700">
                                +{matchData.matchingSkills.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Verified Employer Badge */}
            {job.employer?.verified && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-4 py-2">
                <span className="text-success-600">✓</span>
                <span className="font-semibold text-success-900">Verified Employer</span>
              </div>
            )}

            {/* Unclaimed Job Notice */}
            {!(job as any).isClaimed && (
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="flex items-start gap-2 text-sm text-blue-800">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>
                    This job is publicly listed. Apply to get priority when the employer claims it.
                  </span>
                </p>
              </div>
            )}

            {/* Job Header */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-3xl">
                    {job.employer?.companyLogo ? (
                      <img src={resolveImageUrl(job.employer.companyLogo) || ''} alt={job.employer.companyName} className="h-full w-full rounded-lg object-cover" />
                    ) : (
                      job.employer?.companyName?.charAt(0) || 'J'
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="mb-2 text-3xl font-bold text-secondary-900">
                      {job.title}
                    </h1>
                    <p className="mb-4 text-xl text-secondary-600">
                      {job.employer?.companyName || 'Company'}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-secondary-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <span className="text-secondary-400">•</span>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                      </div>
                      <span className="text-secondary-400">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-6 flex flex-wrap gap-2">
                  <Badge variant={job.remote ? "success" : "secondary"}>
                    {job.remote ? 'Remote' : 'On-site'}
                  </Badge>
                  <Badge variant="outline">{job.niche}</Badge>
                  <Badge variant="secondary">
                    {job.experienceLevel.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Badge>
                </div>

                {/* Salary */}
                {job.salaryMin && job.salaryMax && (
                  <div className="mb-6 flex items-center gap-2 text-2xl font-bold text-secondary-900">
                    <DollarSign className="h-6 w-6 text-success-600" />
                    <span>
                      {formatCurrency(job.salaryMin)} -{" "}
                      {formatCurrency(job.salaryMax)}
                    </span>
                    <span className="text-base font-normal text-secondary-600">
                      / year
                    </span>
                  </div>
                )}

                {/* Action Buttons - Hide for employers */}
                {session?.user?.role !== 'EMPLOYER' && (
                  <div>
                    <div className="flex flex-wrap gap-3">
                      {candidateInfo?.hasApplied ? (
                        <Button
                          variant="outline"
                          size="lg"
                          disabled
                          className="flex-1 sm:flex-initial gap-2 border-green-300 bg-green-50 text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Applied
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="lg"
                          className="flex-1 sm:flex-initial"
                          onClick={() => setIsApplicationFormOpen(true)}
                        >
                          Apply Now
                        </Button>
                      )}
                      {session && (
                        <Button
                          variant="outline"
                          size="lg"
                          className="gap-2"
                          onClick={handleSaveToggle}
                          disabled={isSaving}
                        >
                          {candidateInfo?.isSaved ? (
                            <Bookmark className="h-4 w-4 fill-primary-500 text-primary-500" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                          {candidateInfo?.isSaved ? 'Saved' : 'Save Job'}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="lg"
                        className="gap-2"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                    {!candidateInfo?.hasApplied && (
                      <p className="mt-2 text-sm text-secondary-600">
                        Application takes 2 minutes
                      </p>
                    )}
                  </div>
                )}

                {/* Skills Assessment CTA - Always show for now */}
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About the Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-secondary-700 leading-relaxed space-y-4">
                  {job.description
                    .split(/\n\n|\n|(?<=\.)\s+(?=[A-Z])/)
                    .filter((p: string) => p.trim() && p.trim().length > 20)
                    .map((paragraph: string, idx: number) => (
                      <p key={idx}>{paragraph.trim()}</p>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities
                    .split(/\n|(?<=\.)\s+(?=[A-Z•\-\d])/)
                    .filter((item: string) => item.trim() && item.trim().length > 5)
                    .map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-secondary-700">
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary-500" />
                        <span>{item.trim().replace(/^[-•\d.]+\s*/, '')}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(() => {
                    const text = job.requirements;
                    // Check if it's comma-separated (no newlines and has commas)
                    const hasNewlines = /\n/.test(text);
                    const hasCommas = /,/.test(text);
                    let items: string[];
                    if (!hasNewlines && hasCommas) {
                      // Split by comma for comma-separated lists
                      items = text.split(/,\s*/);
                    } else {
                      // Split by newlines or sentence boundaries
                      items = text.split(/\n|(?<=\.)\s+(?=[A-Z•\-\d])/);
                    }
                    return items
                      .filter((item: string) => item.trim() && item.trim().length > 3)
                      .map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-secondary-700">
                          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary-500" />
                          <span>{item.trim().replace(/^[-•\d.]+\s*/, '')}</span>
                        </li>
                      ));
                  })()}
                </ul>
              </CardContent>
            </Card>


            {/* Required Skills */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills && job.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" size="lg">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            {(job as any).techStack && (job as any).techStack.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Tech Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(job as any).techStack.map((tech: string, index: number) => (
                      <Badge key={index} className="bg-primary-100 text-primary-700 border-primary-200" size="lg">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(() => {
                      const text = job.benefits;
                      // Check if it's comma-separated (no newlines and has commas)
                      const hasNewlines = /\n/.test(text);
                      const hasCommas = /,/.test(text);
                      let items: string[];
                      if (!hasNewlines && hasCommas) {
                        // Split by comma for comma-separated lists
                        items = text.split(/,\s*/);
                      } else {
                        // Split by newlines or sentence boundaries
                        items = text.split(/\n|(?<=\.)\s+(?=[A-Z•\-\d])/);
                      }
                      return items
                        .filter((item: string) => item.trim() && item.trim().length > 3)
                        .map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-secondary-700">
                            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-500" />
                            <span>{item.trim().replace(/^[-•\d.]+\s*/, '').replace(/^and\s+/i, '')}</span>
                          </li>
                        ));
                    })()}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Match Score Card - Only show for logged-in candidates */}
              {session && matchData?.matchScore !== undefined && matchData.matchScore !== null && (
                <MatchScoreCard
                  score={matchData.matchScore}
                  breakdown={matchData.breakdown}
                  reasons={matchData.reasons}
                  matchingSkills={matchData.matchingSkills}
                  missingSkills={matchData.missingSkills}
                  variant="full"
                />
              )}

              {/* Sign in prompt for match score */}
              {!session && (
                <Card className="border-2 border-dashed border-primary-200 bg-gradient-to-br from-primary-50 to-accent-50">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                    <h3 className="mb-2 font-semibold text-secondary-900">
                      See How You Match
                    </h3>
                    <p className="mb-4 text-sm text-secondary-600">
                      Sign in to see your personalized match score for this job
                    </p>
                    <Button variant="primary" size="sm" asChild>
                      <Link href={`/login?redirect=/jobs/${jobId}`}>
                        Sign In
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Company Info */}
              {job.employer && (
                <Card>
                  <CardHeader>
                    <CardTitle>About {job.employer.companyName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link
                      href={`/companies/${(job.employer as any).slug || job.employer.id}`}
                      className="block"
                    >
                      <div className={`flex items-center justify-center rounded-lg p-6 transition-colors ${job.employer.companyLogo ? 'bg-white hover:bg-secondary-50' : 'bg-primary-50 hover:bg-primary-100'}`}>
                        {job.employer.companyLogo ? (
                          <img src={resolveImageUrl(job.employer.companyLogo) || ''} alt={job.employer.companyName} className="h-32 w-auto max-w-full object-contain" />
                        ) : (
                          <div className="text-6xl">{job.employer.companyName.charAt(0)}</div>
                        )}
                      </div>
                    </Link>

                    {job.employer.description && (
                      <p className="text-sm text-secondary-700">
                        {job.employer.description}
                      </p>
                    )}

                    <div className="space-y-3 border-t border-secondary-200 pt-4">
                      {job.employer.industry && (
                        <div className="flex items-center gap-3 text-sm">
                          <Building2 className="h-4 w-4 text-secondary-400" />
                          <div>
                            <div className="text-secondary-500">Industry</div>
                            <div className="font-medium text-secondary-900">
                              {job.employer.industry}
                            </div>
                          </div>
                        </div>
                      )}

                      {job.employer.companySize && (
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="h-4 w-4 text-secondary-400" />
                          <div>
                            <div className="text-secondary-500">Company Size</div>
                            <div className="font-medium text-secondary-900">
                              {job.employer.companySize}
                            </div>
                          </div>
                        </div>
                      )}

                      {job.employer.location && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-secondary-400" />
                          <div>
                            <div className="text-secondary-500">Location</div>
                            <div className="font-medium text-secondary-900">
                              {job.employer.location}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        asChild
                      >
                        <Link href={`/companies/${(job.employer as any).slug || job.employer.id}`}>
                          View Company Profile
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Link>
                      </Button>

                      {job.employer.companyWebsite && (
                        <Button
                          variant="ghost"
                          className="w-full gap-2 text-secondary-600"
                          asChild
                        >
                          <a
                            href={job.employer.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Website
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Apply CTA - Hide for employers, show different state if already applied */}
              {session?.user?.role !== 'EMPLOYER' && (
                candidateInfo?.hasApplied ? (
                  <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="mx-auto mb-3 h-10 w-10" />
                      <h3 className="mb-2 text-lg font-semibold">
                        Already Applied
                      </h3>
                      <p className="text-sm text-green-100">
                        Application is under review
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                    <CardContent className="p-6 text-center">
                      <h3 className="mb-2 text-lg font-semibold">
                        Ready to Apply?
                      </h3>
                      <p className="mb-4 text-sm text-primary-100">
                        Join {job.employer?.companyName || 'our team'} and make an impact
                      </p>
                      <Button
                        variant="secondary"
                        className="w-full bg-white text-primary-600 hover:bg-primary-50"
                        onClick={() => setIsApplicationFormOpen(true)}
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-secondary-900">
                Similar Jobs
              </h2>
              <p className="text-secondary-600">
                Other opportunities in {job.niche}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similarJobs.map((similarJob) => (
                <JobCard key={similarJob.id} job={similarJob} />
              ))}
            </div>
          </div>
        )}

        {/* Application Form Modal */}
        <ApplicationForm
          isOpen={isApplicationFormOpen}
          onClose={() => setIsApplicationFormOpen(false)}
          jobTitle={job.title}
          companyName={job.employer?.companyName || 'Company'}
          jobId={job.id}
          onSuccess={() => setShowSuccessModal(true)}
        />

        {/* Application Success Modal with Skills Assessment Promotion */}
        <ApplicationSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          jobTitle={job.title}
          niche={job.niche || 'Tech'}
        />
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
}
