"use client";

import { useState } from "react";
import {
  Lock,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  FileText,
  ExternalLink,
  Clock,
  CheckCircle,
  Loader2,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Button, Badge, Card, CardContent, useToast } from "@/components/ui";
import { api } from "@/lib/api";

// Backend URL for file downloads
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://job-portal-backend-production-cd05.up.railway.app";

// Helper function to get full resume URL
const getResumeUrl = (resumePath: string | null): string | null => {
  if (!resumePath) return null;
  if (resumePath.startsWith("http://") || resumePath.startsWith("https://")) {
    return resumePath;
  }
  let normalizedPath = resumePath;
  if (normalizedPath.includes("/uploads/resume/") && !normalizedPath.includes("/uploads/resumes/")) {
    normalizedPath = normalizedPath.replace("/uploads/resume/", "/uploads/resumes/");
  }
  const apiPath = normalizedPath.startsWith("/uploads/")
    ? normalizedPath.replace("/uploads/", "/api/uploads/")
    : normalizedPath;
  return `${BACKEND_URL}${apiPath}`;
};

export type IntroductionStatus =
  | "NONE"
  | "PROFILE_VIEWED"
  | "INTRO_REQUESTED"
  | "CANDIDATE_DECLINED"
  | "INTRODUCED"
  | "INTERVIEWING"
  | "OFFER_EXTENDED"
  | "HIRED"
  | "CLOSED_NO_HIRE"
  | "EXPIRED";

interface ContactInfoGateProps {
  candidateId: string;
  candidateName: string;
  // Contact fields - will be null if gated
  email: string | null;
  phone: string | null;
  linkedIn: string | null;
  github: string | null;
  portfolio: string | null;
  personalWebsite?: string | null;
  resume: string | null;
  // Gating info from API response
  isContactGated: boolean;
  introductionStatus: IntroductionStatus | string;
  introductionId: string | null;
  protectionEndsAt: string | null;
  introRequestedAt?: string | null;
  // Callbacks
  onIntroductionRequested?: () => void;
}

export function ContactInfoGate({
  candidateId,
  candidateName,
  email,
  phone,
  linkedIn,
  github,
  portfolio,
  personalWebsite,
  resume,
  isContactGated,
  introductionStatus,
  introductionId,
  protectionEndsAt,
  introRequestedAt,
  onIntroductionRequested,
}: ContactInfoGateProps) {
  const { showToast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);
  const [localIntroStatus, setLocalIntroStatus] = useState(introductionStatus);
  const [localIntroRequestedAt, setLocalIntroRequestedAt] = useState(introRequestedAt);

  // Check if introduction has been requested
  const isIntroRequested = localIntroStatus === "INTRO_REQUESTED";

  // Check if full access is granted (introduced or beyond)
  const hasFullAccess = [
    "INTRODUCED",
    "INTERVIEWING",
    "OFFER_EXTENDED",
    "HIRED",
  ].includes(localIntroStatus as string);

  // Handle request introduction
  const handleRequestIntroduction = async () => {
    setIsRequesting(true);
    try {
      const response = await api.post("/api/employer/introductions/request", {
        candidateId,
      });

      if (response.data.success) {
        setLocalIntroStatus("INTRO_REQUESTED");
        setLocalIntroRequestedAt(new Date().toISOString());
        showToast(
          "success",
          "Introduction Requested",
          "We'll notify you when the candidate responds."
        );
        onIntroductionRequested?.();
      }
    } catch (error: any) {
      console.error("Failed to request introduction:", error);
      showToast(
        "error",
        "Request Failed",
        error.response?.data?.error || "Please try again later."
      );
    } finally {
      setIsRequesting(false);
    }
  };

  // Format protection end date
  const formatProtectionDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // If contact info is not gated or has full access, show full contact details
  if (!isContactGated || hasFullAccess) {
    const resumeUrl = getResumeUrl(resume);
    const hasAnyContact = email || phone || linkedIn || github || portfolio || personalWebsite;

    if (!hasAnyContact && !resume) {
      return (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-secondary-600" />
              Contact Information
            </h3>
            <p className="text-secondary-500 text-sm">
              No contact information provided by this candidate.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-secondary-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-secondary-600" />
              Contact Information
            </h3>
            <Badge variant="success" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Full Access
            </Badge>
          </div>

          <div className="space-y-3">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors group"
              >
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500">Email</p>
                  <p className="text-sm font-medium text-secondary-900 truncate group-hover:text-primary-600">
                    {email}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-secondary-400 group-hover:text-primary-600" />
              </a>
            )}

            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors group"
              >
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500">Phone</p>
                  <p className="text-sm font-medium text-secondary-900 truncate group-hover:text-primary-600">
                    {phone}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-secondary-400 group-hover:text-primary-600" />
              </a>
            )}

            {linkedIn && (
              <a
                href={linkedIn.startsWith("http") ? linkedIn : `https://${linkedIn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors group"
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500">LinkedIn</p>
                  <p className="text-sm font-medium text-secondary-900 truncate group-hover:text-primary-600">
                    View Profile
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-secondary-400 group-hover:text-primary-600" />
              </a>
            )}

            {github && (
              <a
                href={github.startsWith("http") ? github : `https://${github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors group"
              >
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Github className="h-5 w-5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500">GitHub</p>
                  <p className="text-sm font-medium text-secondary-900 truncate group-hover:text-primary-600">
                    View Profile
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-secondary-400 group-hover:text-primary-600" />
              </a>
            )}

            {(portfolio || personalWebsite) && (
              <a
                href={(portfolio || personalWebsite)!.startsWith("http") ? (portfolio || personalWebsite)! : `https://${portfolio || personalWebsite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors group"
              >
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-secondary-500">Portfolio / Website</p>
                  <p className="text-sm font-medium text-secondary-900 truncate group-hover:text-primary-600">
                    View Website
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-secondary-400 group-hover:text-primary-600" />
              </a>
            )}

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors group border border-primary-200"
              >
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-primary-600">Resume</p>
                  <p className="text-sm font-medium text-primary-700 truncate">
                    Download Resume
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-primary-500 group-hover:text-primary-700" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // If introduction has been requested but not yet accepted
  if (isIntroRequested) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-secondary-600" />
            Contact Information
          </h3>

          <div className="bg-white/80 rounded-xl p-6 border border-blue-200">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <h4 className="text-lg font-semibold text-center text-secondary-900 mb-2">
              Introduction Requested
            </h4>

            <p className="text-secondary-600 text-center text-sm mb-4">
              We've notified {candidateName.split(" ")[0]} of your interest.
              <br />
              You'll receive their contact details once they accept.
            </p>

            {localIntroRequestedAt && (
              <p className="text-xs text-secondary-500 text-center">
                Requested on:{" "}
                {new Date(localIntroRequestedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex items-center gap-2 justify-center text-sm text-blue-700">
                <Clock className="h-4 w-4" />
                <span>Typically responds within 24-48 hours</span>
              </div>
            </div>
          </div>

          {/* Protection period notice */}
          {protectionEndsAt && (
            <div className="mt-4 flex items-start gap-2 text-xs text-secondary-500">
              <Shield className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                This candidate is covered under your Service Agreement.
                Protection period: Until {formatProtectionDate(protectionEndsAt)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Contact info is gated - show request introduction UI
  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardContent className="p-6">
        <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-secondary-600" />
          Contact Information
        </h3>

        <div className="bg-white/80 rounded-xl p-6 border border-amber-200">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
          </div>

          <h4 className="text-lg font-semibold text-center text-secondary-900 mb-2">
            Contact details are protected
          </h4>

          <p className="text-secondary-600 text-center text-sm mb-6">
            Request an introduction to view contact information, download resume,
            and connect directly with this candidate.
          </p>

          <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
            <h5 className="font-medium text-amber-900 mb-3">What happens next:</h5>
            <ol className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800">
                  1
                </span>
                <span>We'll notify the candidate of your interest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800">
                  2
                </span>
                <span>If they're interested, we'll facilitate an introduction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800">
                  3
                </span>
                <span>You'll receive their full contact details</span>
              </li>
            </ol>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleRequestIntroduction}
            disabled={isRequesting}
          >
            {isRequesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Requesting...
              </>
            ) : (
              <>
                Request Introduction
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Protection period notice */}
        {protectionEndsAt && (
          <div className="mt-4 flex items-start gap-2 text-xs text-secondary-500">
            <Shield className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              This candidate is covered under your Service Agreement.
              Protection period: Until {formatProtectionDate(protectionEndsAt)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ContactInfoGate;
