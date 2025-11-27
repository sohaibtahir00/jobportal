import { useState } from "react";
import Link from "next/link";
import {
  X,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  FileText,
  Award,
  Clock,
  CheckCircle,
  Circle,
  Trash2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { useWithdrawApplication } from "@/hooks/useApplications";
import type { Application } from "@/types";
import { formatCurrency, resolveImageUrl } from "@/lib/utils";

interface ApplicationDetailModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onWithdrawSuccess?: () => void;
}

export function ApplicationDetailModal({
  application,
  isOpen,
  onClose,
  onWithdrawSuccess,
}: ApplicationDetailModalProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const withdrawMutation = useWithdrawApplication();

  if (!isOpen) return null;

  // Helper function to get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Application Submitted", icon: Circle, color: "text-gray-500" };
      case "REVIEWED":
        return { label: "Application Reviewed", icon: CheckCircle, color: "text-blue-500" };
      case "SHORTLISTED":
        return { label: "Shortlisted", icon: CheckCircle, color: "text-green-500" };
      case "INTERVIEW_SCHEDULED":
        return { label: "Interview Scheduled", icon: CheckCircle, color: "text-purple-500" };
      case "INTERVIEWED":
        return { label: "Interview Completed", icon: CheckCircle, color: "text-indigo-500" };
      case "OFFERED":
        return { label: "Offer Received", icon: CheckCircle, color: "text-yellow-500" };
      case "REJECTED":
        return { label: "Application Rejected", icon: X, color: "text-red-500" };
      case "WITHDRAWN":
        return { label: "Application Withdrawn", icon: X, color: "text-gray-500" };
      case "ACCEPTED":
        return { label: "Offer Accepted", icon: CheckCircle, color: "text-green-600" };
      default:
        return { label: status, icon: Circle, color: "text-gray-500" };
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Build status timeline (simulated - in production this would come from status history)
  const getStatusTimeline = () => {
    const timeline = [
      {
        status: "Applied",
        date: application.appliedAt,
        completed: true,
      },
    ];

    const statusOrder = [
      "REVIEWED",
      "SHORTLISTED",
      "INTERVIEW_SCHEDULED",
      "INTERVIEWED",
      "OFFERED",
    ];

    const currentStatusIndex = statusOrder.indexOf(application.status);

    statusOrder.forEach((status, index) => {
      if (index <= currentStatusIndex) {
        timeline.push({
          status: getStatusInfo(status).label,
          date: application.reviewedAt || application.updatedAt,
          completed: true,
        });
      }
    });

    if (application.status === "REJECTED") {
      timeline.push({
        status: "Rejected",
        date: application.updatedAt,
        completed: true,
      });
    } else if (application.status === "WITHDRAWN") {
      timeline.push({
        status: "Withdrawn",
        date: application.updatedAt,
        completed: true,
      });
    } else if (application.status === "ACCEPTED") {
      timeline.push({
        status: "Offer Accepted",
        date: application.updatedAt,
        completed: true,
      });
    }

    return timeline;
  };

  const statusTimeline = getStatusTimeline();
  const canWithdraw = !["REJECTED", "WITHDRAWN", "ACCEPTED"].includes(application.status);
  const hasTestResults = application.testResults && application.testResults.length > 0;

  const handleWithdraw = async () => {
    if (!canWithdraw) return;

    setIsWithdrawing(true);
    try {
      await withdrawMutation.mutateAsync(application.id);
      setShowConfirm(false);
      onWithdrawSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to withdraw application:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const currentStatusInfo = getStatusInfo(application.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Job Header */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
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
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {application.job?.title || "Job Title"}
                  </h3>
                  <p className="text-gray-700 font-medium mb-3">
                    {application.job?.employer?.companyName || "Company"}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{application.job?.location || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="capitalize">
                        {application.job?.type?.replace(/_/g, " ").toLowerCase() || "N/A"}
                      </span>
                    </div>
                    {application.job?.salaryMin && application.job?.salaryMax && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {formatCurrency(application.job.salaryMin)} -{" "}
                          {formatCurrency(application.job.salaryMax)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Info */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Application Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Applied on:</span>
                  <span className="font-medium text-gray-900">{formatDate(application.appliedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <currentStatusInfo.icon className={`h-5 w-5 ${currentStatusInfo.color}`} />
                  <span className="text-gray-600">Current Status:</span>
                  <Badge className={`${currentStatusInfo.color} bg-opacity-10`}>
                    {currentStatusInfo.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Application Timeline
              </h4>
              <div className="space-y-4">
                {statusTimeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                      {index < statusTimeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-900">{item.status}</p>
                      <p className="text-sm text-gray-500">{formatDateTime(item.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Cover Letter
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                  {application.coverLetter}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skills Assessment */}
          {hasTestResults && (
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills Assessment Results
                </h4>
                <div className="space-y-3">
                  {application.testResults?.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{test.testName}</p>
                        <p className="text-sm text-gray-600">
                          Completed {formatDate(test.completedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">Score: {test.score}</p>
                        <Badge variant="success" size="sm">
                          {test.tier || "Completed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Job Description */}
          {application.job?.description && (
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h4>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {application.job.description}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" asChild>
              <Link href={`/jobs/${application.jobId}`} className="flex items-center gap-2">
                View Full Job Posting
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>

            {canWithdraw && !showConfirm && (
              <Button
                variant="outline"
                onClick={() => setShowConfirm(true)}
                className="text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Withdraw Application
              </Button>
            )}

            {showConfirm && (
              <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm text-red-700 font-medium">
                  Are you sure you want to withdraw this application?
                </span>
                <Button variant="danger" size="sm" onClick={handleWithdraw} disabled={isWithdrawing}>
                  {isWithdrawing ? "Withdrawing..." : "Yes, Withdraw"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirm(false)}
                  disabled={isWithdrawing}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
