import { useState } from "react";
import Link from "next/link";
import { Calendar, Building2, MapPin, Award, AlertCircle, Trash2, Home, Building, Laptop } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { useWithdrawApplication } from "@/hooks/useApplications";
import type { Application } from "@/types";
import { resolveImageUrl } from "@/lib/utils";

interface ApplicationCardProps {
  application: Application;
  onViewDetails: (application: Application) => void;
  onWithdrawSuccess?: () => void;
}

export function ApplicationCard({ application, onViewDetails, onWithdrawSuccess }: ApplicationCardProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const withdrawMutation = useWithdrawApplication();

  // Helper function to get status badge variant and label
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return { variant: "secondary" as const, label: "New", color: "bg-gray-100 text-gray-700" };
      case "REVIEWED":
        return { variant: "primary" as const, label: "Reviewing", color: "bg-blue-100 text-blue-700" };
      case "SHORTLISTED":
        return { variant: "success" as const, label: "Shortlisted", color: "bg-green-100 text-green-700" };
      case "INTERVIEW_SCHEDULED":
        return { variant: "primary" as const, label: "Interview Scheduled", color: "bg-purple-100 text-purple-700" };
      case "INTERVIEWED":
        return { variant: "primary" as const, label: "Interviewed", color: "bg-indigo-100 text-indigo-700" };
      case "OFFERED":
        return { variant: "success" as const, label: "Offer", color: "bg-yellow-100 text-yellow-700" };
      case "REJECTED":
        return { variant: "danger" as const, label: "Rejected", color: "bg-red-100 text-red-700" };
      case "WITHDRAWN":
        return { variant: "secondary" as const, label: "Withdrawn", color: "bg-gray-100 text-gray-700" };
      case "ACCEPTED":
        return { variant: "success" as const, label: "Accepted", color: "bg-green-100 text-green-700" };
      default:
        return { variant: "secondary" as const, label: status, color: "bg-gray-100 text-gray-700" };
    }
  };

  // Helper function to get job status badge (for inactive jobs)
  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case "CLOSED":
        return { label: "Job Closed", color: "bg-red-100 text-red-700 border border-red-200" };
      case "PAUSED":
        return { label: "Job Paused", color: "bg-yellow-100 text-yellow-700 border border-yellow-200" };
      case "FILLED":
        return { label: "Position Filled", color: "bg-gray-100 text-gray-700 border border-gray-200" };
      case "EXPIRED":
        return { label: "Job Expired", color: "bg-gray-100 text-gray-600 border border-gray-200" };
      default:
        return null;
    }
  };

  // Check if job is inactive (not ACTIVE or DRAFT)
  const jobStatus = application.job?.status;
  const isJobInactive = jobStatus && !["ACTIVE", "DRAFT"].includes(jobStatus);
  const jobStatusBadge = jobStatus ? getJobStatusBadge(jobStatus) : null;

  // Helper function to get remote type display
  const getRemoteTypeDisplay = () => {
    const job = application.job as any;
    const remoteType = job?.remoteType;
    const isRemote = job?.remote;

    if (remoteType === "REMOTE" || isRemote === true) {
      return { label: "Remote", icon: Home, color: "text-green-600" };
    } else if (remoteType === "HYBRID") {
      return { label: "Hybrid", icon: Laptop, color: "text-blue-600" };
    } else if (remoteType === "ONSITE") {
      return { label: "On-site", icon: Building, color: "text-orange-600" };
    }
    return null;
  };

  const remoteTypeDisplay = getRemoteTypeDisplay();

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if application can be withdrawn
  const canWithdraw = !["REJECTED", "WITHDRAWN", "ACCEPTED"].includes(application.status);

  const handleWithdraw = async () => {
    if (!canWithdraw) return;

    setIsWithdrawing(true);
    try {
      await withdrawMutation.mutateAsync(application.id);
      setShowConfirm(false);
      onWithdrawSuccess?.();
    } catch (error) {
      console.error("Failed to withdraw application:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const statusBadge = getStatusBadge(application.status);
  const hasTestResults = application.testResults && application.testResults.length > 0;

  return (
    <Card variant="accent" className="transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {application.job?.employer?.companyLogo ? (
                <img
                  src={resolveImageUrl(application.job.employer.companyLogo) || ''}
                  alt={application.job.employer.companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </div>

          {/* Application Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {application.job?.title || "Job Title"}
                </h3>
                <p className="text-gray-600 mb-2">
                  {application.job?.employer?.companyName || "Company"}
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={`${statusBadge.color} border-0`}>
                  {statusBadge.label}
                </Badge>
                {isJobInactive && jobStatusBadge && (
                  <Badge className={jobStatusBadge.color}>
                    {jobStatusBadge.label}
                  </Badge>
                )}
              </div>
            </div>

            {/* Job Info */}
            <div className="space-y-1 mb-4 text-sm text-gray-600">
              {/* Location and Remote Type */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{application.job?.location || "Location not specified"}</span>
                </div>
                {remoteTypeDisplay && (
                  <>
                    <span className="text-gray-400">•</span>
                    <div className={`flex items-center gap-1 ${remoteTypeDisplay.color}`}>
                      <remoteTypeDisplay.icon className="h-4 w-4" />
                      <span>{remoteTypeDisplay.label}</span>
                    </div>
                  </>
                )}
              </div>
              {/* Applied Date */}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Applied {formatDate(application.appliedAt)}</span>
              </div>
            </div>

            {/* Badges and Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {hasTestResults && (
                <Badge variant="primary" size="sm" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Skills Assessment Taken
                </Badge>
              )}
              {application.job?.type && (
                <Badge variant="outline" size="sm" className="capitalize">
                  {application.job.type.replace(/_/g, " ").toLowerCase()}
                </Badge>
              )}
              {remoteTypeDisplay && (
                <Badge variant="outline" size="sm" className={`flex items-center gap-1 ${remoteTypeDisplay.color}`}>
                  <remoteTypeDisplay.icon className="h-3 w-3" />
                  {remoteTypeDisplay.label}
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onViewDetails(application)}
              >
                View Details
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={`/jobs/${application.jobId}`}>
                  View Job
                </Link>
              </Button>

              {canWithdraw && !showConfirm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirm(true)}
                  className="text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Withdraw
                </Button>
              )}

              {showConfirm && (
                <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">Withdraw this application?</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? "Withdrawing..." : "Yes"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConfirm(false)}
                    disabled={isWithdrawing}
                  >
                    No
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
