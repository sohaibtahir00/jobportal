import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Briefcase, DollarSign, Calendar, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { useUnsaveJob } from "@/hooks/useSavedJobs";
import { useSubmitApplication } from "@/hooks/useApplications";
import type { SavedJob } from "@/lib/api/saved-jobs";
import { formatCurrency } from "@/lib/utils";

interface SavedJobCardProps {
  savedJob: SavedJob;
  onUnsaveSuccess?: () => void;
}

export function SavedJobCard({ savedJob, onUnsaveSuccess }: SavedJobCardProps) {
  const [isUnsaving, setIsUnsaving] = useState(false);
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const unsaveMutation = useUnsaveJob();
  const applyMutation = useSubmitApplication();

  const { job, hasApplied, application } = savedJob;

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to get relative time
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

  // Helper function to format job type
  const formatJobType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper function to get job status badge
  const getJobStatusBadge = () => {
    if (job.status === "CLOSED") {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
          <XCircle className="h-3 w-3 mr-1" />
          Closed
        </Badge>
      );
    }
    if (job.status === "FILLED") {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Position Filled
        </Badge>
      );
    }
    return null;
  };

  const handleUnsave = async () => {
    setIsUnsaving(true);
    try {
      await unsaveMutation.mutateAsync(job.id);
      onUnsaveSuccess?.();
    } catch (error) {
      console.error("Failed to unsave job:", error);
    } finally {
      setIsUnsaving(false);
    }
  };

  const handleQuickApply = async () => {
    if (hasApplied) return;

    try {
      await applyMutation.mutateAsync({
        jobId: job.id,
      });
      setShowApplyConfirm(false);
      onUnsaveSuccess?.();
    } catch (error) {
      console.error("Failed to apply:", error);
    }
  };

  const statusBadge = getJobStatusBadge();
  const isJobActive = job.status === "ACTIVE";

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {job.employer?.companyLogo ? (
                <img
                  src={job.employer.companyLogo}
                  alt={job.employer.companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Briefcase className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.employer?.companyName || "Company"}</p>
              </div>

              {/* Status and Badges */}
              <div className="flex flex-wrap gap-2">
                {hasApplied && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Applied
                  </Badge>
                )}
                {statusBadge}
                {job.isClaimed && (
                  <Badge variant="primary" className="bg-purple-100 text-purple-700">
                    Exclusive
                  </Badge>
                )}
              </div>
            </div>

            {/* Job Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{formatJobType(job.type)}</span>
              </div>
              {job.salaryMin && job.salaryMax && (
                <div className="flex items-center gap-1 font-semibold text-green-600">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                  </span>
                </div>
              )}
            </div>

            {/* Remote & Type Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={job.remote ? "success" : "secondary"} size="sm">
                {job.remote ? "Remote" : "On-site"}
              </Badge>
              {job.skills?.slice(0, 3).map((skill: string, idx: number) => (
                <Badge key={idx} variant="outline" size="sm">
                  {skill}
                </Badge>
              ))}
              {job.skills && job.skills.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{job.skills.length - 3}
                </Badge>
              )}
            </div>

            {/* Saved Info */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
              <Calendar className="h-3 w-3" />
              <span>Saved {getRelativeTime(savedJob.savedAt)}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/jobs/${job.id}`}>View Details</Link>
              </Button>

              {isJobActive && !hasApplied && !showApplyConfirm && (
                <Button variant="primary" size="sm" onClick={() => setShowApplyConfirm(true)}>
                  Apply Now
                </Button>
              )}

              {hasApplied && application && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/candidate/applications">
                    View Application
                  </Link>
                </Button>
              )}

              {!isJobActive && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>This position is no longer active</span>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleUnsave}
                disabled={isUnsaving}
                className="text-red-600 hover:bg-red-50 hover:border-red-300 ml-auto"
              >
                <Heart className="h-4 w-4 mr-1 fill-current" />
                {isUnsaving ? "Removing..." : "Remove"}
              </Button>

              {showApplyConfirm && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 w-full md:w-auto">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Apply to this position?</span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleQuickApply}
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending ? "Applying..." : "Yes, Apply"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApplyConfirm(false)}
                    disabled={applyMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
