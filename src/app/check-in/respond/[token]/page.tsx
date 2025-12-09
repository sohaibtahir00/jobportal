"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  Clock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  PartyPopper,
  Search,
  XCircle,
  ThumbsDown,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui";

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://job-portal-backend-production-cd05.up.railway.app";

/**
 * Valid check-in response statuses
 */
const STATUS_OPTIONS = [
  {
    id: "hired_there",
    label: "I was hired!",
    sublabel: "At this company",
    icon: PartyPopper,
    color: "success",
    bgClass: "bg-success-50 hover:bg-success-100 border-success-200 hover:border-success-400",
    textClass: "text-success-700",
    iconBgClass: "bg-success-100",
    iconClass: "text-success-600",
  },
  {
    id: "hired_elsewhere",
    label: "Hired elsewhere",
    sublabel: "At a different company",
    icon: Briefcase,
    color: "primary",
    bgClass: "bg-primary-50 hover:bg-primary-100 border-primary-200 hover:border-primary-400",
    textClass: "text-primary-700",
    iconBgClass: "bg-primary-100",
    iconClass: "text-primary-600",
  },
  {
    id: "interviewing",
    label: "Interviewing",
    sublabel: "Still in the process",
    icon: MessageSquare,
    color: "accent",
    bgClass: "bg-accent-50 hover:bg-accent-100 border-accent-200 hover:border-accent-400",
    textClass: "text-accent-700",
    iconBgClass: "bg-accent-100",
    iconClass: "text-accent-600",
  },
  {
    id: "still_looking",
    label: "Still looking",
    sublabel: "Waiting to hear back",
    icon: Search,
    color: "secondary",
    bgClass: "bg-secondary-50 hover:bg-secondary-100 border-secondary-200 hover:border-secondary-400",
    textClass: "text-secondary-700",
    iconBgClass: "bg-secondary-100",
    iconClass: "text-secondary-600",
  },
  {
    id: "offer",
    label: "Got an offer",
    sublabel: "Considering options",
    icon: CheckCircle2,
    color: "warning",
    bgClass: "bg-amber-50 hover:bg-amber-100 border-amber-200 hover:border-amber-400",
    textClass: "text-amber-700",
    iconBgClass: "bg-amber-100",
    iconClass: "text-amber-600",
  },
  {
    id: "rejected",
    label: "Not selected",
    sublabel: "Company passed",
    icon: XCircle,
    color: "secondary",
    bgClass: "bg-secondary-50 hover:bg-secondary-100 border-secondary-200 hover:border-secondary-400",
    textClass: "text-secondary-700",
    iconBgClass: "bg-secondary-100",
    iconClass: "text-secondary-600",
  },
  {
    id: "withdrew",
    label: "I withdrew",
    sublabel: "No longer interested",
    icon: ThumbsDown,
    color: "secondary",
    bgClass: "bg-secondary-50 hover:bg-secondary-100 border-secondary-200 hover:border-secondary-400",
    textClass: "text-secondary-700",
    iconBgClass: "bg-secondary-100",
    iconClass: "text-secondary-600",
  },
  {
    id: "no_response",
    label: "No response",
    sublabel: "Never heard back",
    icon: HelpCircle,
    color: "secondary",
    bgClass: "bg-secondary-50 hover:bg-secondary-100 border-secondary-200 hover:border-secondary-400",
    textClass: "text-secondary-700",
    iconBgClass: "bg-secondary-100",
    iconClass: "text-secondary-600",
  },
] as const;

interface CheckInData {
  id: string;
  candidateName: string;
  employerCompanyName: string;
  jobTitle: string;
  introductionDate: string;
  daysSinceIntro: number;
  checkInNumber: number;
  status: "pending" | "responded" | "expired";
  previousResponse: string | null;
}

type PageState =
  | "loading"
  | "ready"
  | "submitting"
  | "success"
  | "already_responded"
  | "expired"
  | "invalid";

export default function CheckInRespondPage() {
  const params = useParams();
  const token = params?.token as string;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [checkIn, setCheckIn] = useState<CheckInData | null>(null);
  const [error, setError] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  // Form fields for "hired_there" status
  const [showHiredForm, setShowHiredForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      fetchCheckIn();
    }
  }, [token]);

  const fetchCheckIn = async () => {
    try {
      const response = await fetch(`${API_URL}/api/check-in/respond/${token}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setPageState("invalid");
        } else {
          setError(data.error || "Something went wrong");
          setPageState("invalid");
        }
        return;
      }

      setCheckIn(data.checkIn);

      if (data.checkIn.status === "responded") {
        setPageState("already_responded");
      } else if (data.checkIn.status === "expired") {
        setPageState("expired");
      } else {
        setPageState("ready");
      }
    } catch (err) {
      console.error("Error fetching check-in:", err);
      setError("Failed to load check-in details");
      setPageState("invalid");
    }
  };

  const handleStatusSelect = (statusId: string) => {
    setSelectedStatus(statusId);
    setError("");

    if (statusId === "hired_there") {
      setShowHiredForm(true);
    } else {
      setShowHiredForm(false);
      // Auto-submit for non-hired statuses
      submitResponse(statusId);
    }
  };

  const submitResponse = async (status: string) => {
    setPageState("submitting");
    setError("");

    try {
      const body: Record<string, string> = { status };

      // Include additional fields for "hired_there"
      if (status === "hired_there") {
        if (startDate) body.startDate = startDate;
        if (roleTitle) body.roleTitle = roleTitle;
        if (message) body.message = message;
      }

      const res = await fetch(`${API_URL}/api/check-in/respond/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit response");
        setPageState("ready");
        return;
      }

      setSubmittedStatus(status);
      setPageState("success");
    } catch (err) {
      console.error("Error submitting response:", err);
      setError("Failed to submit response. Please try again.");
      setPageState("ready");
    }
  };

  const handleHiredFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitResponse("hired_there");
  };

  // Get first name for personalization
  const firstName = checkIn?.candidateName?.split(" ")[0] || "there";

  // Get check-in milestone text
  const getMilestoneText = (checkInNumber: number): string => {
    const milestones: Record<number, string> = {
      1: "30-day",
      2: "60-day",
      3: "90-day",
      4: "6-month",
      5: "1-year",
    };
    return milestones[checkInNumber] || "";
  };

  // Get success message based on status
  const getSuccessMessage = (status: string): { title: string; message: string } => {
    switch (status) {
      case "hired_there":
        return {
          title: "Congratulations on your new role!",
          message: `We're thrilled to hear you were hired at ${checkIn?.employerCompanyName}! Someone from our team will be in touch.`,
        };
      case "hired_elsewhere":
        return {
          title: "Congratulations!",
          message: "That's great news! Best of luck in your new position.",
        };
      case "interviewing":
        return {
          title: "Good luck with your interviews!",
          message: "We hope the process goes well. Let us know how it turns out!",
        };
      case "offer":
        return {
          title: "That's exciting!",
          message: "Congratulations on receiving an offer. Take your time making the right decision.",
        };
      case "rejected":
      case "no_response":
      case "withdrew":
        return {
          title: "Thanks for the update",
          message: "We appreciate you letting us know. We'll keep you in mind for other opportunities.",
        };
      case "still_looking":
        return {
          title: "Hang in there!",
          message: "Job searching takes time. We'll continue checking in to see how things progress.",
        };
      default:
        return {
          title: "Response recorded",
          message: "Thank you for the update!",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 py-4">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">SkillProof</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Loading State */}
        {pageState === "loading" && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-secondary-600">Loading check-in details...</p>
            </CardContent>
          </Card>
        )}

        {/* Invalid Token State */}
        {pageState === "invalid" && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-danger-600" />
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">Invalid Link</h1>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                This check-in link is not valid or has expired. If you believe this is an error, please contact us.
              </p>
              <a
                href="mailto:contact@getskillproof.com"
                className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                contact@getskillproof.com
              </a>
            </CardContent>
          </Card>
        )}

        {/* Expired Token State */}
        {pageState === "expired" && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">This Link Has Expired</h1>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                Check-in links are valid for 14 days. If you'd like to provide an update, please contact us.
              </p>
              <a
                href="mailto:contact@getskillproof.com"
                className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                contact@getskillproof.com
              </a>
            </CardContent>
          </Card>
        )}

        {/* Already Responded State */}
        {pageState === "already_responded" && checkIn && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-success-600" />
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                You've Already Responded
              </h1>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                Thanks for your earlier update about your experience with {checkIn.employerCompanyName}.
              </p>
              <p className="text-secondary-500 text-sm">
                Have more to share?{" "}
                <a href="mailto:contact@getskillproof.com" className="text-primary-600 hover:text-primary-700">
                  contact@getskillproof.com
                </a>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {pageState === "success" && checkIn && submittedStatus && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {submittedStatus === "hired_there" || submittedStatus === "hired_elsewhere" ? (
                  <PartyPopper className="h-8 w-8 text-success-600" />
                ) : (
                  <CheckCircle2 className="h-8 w-8 text-success-600" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                {getSuccessMessage(submittedStatus).title}
              </h1>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                {getSuccessMessage(submittedStatus).message}
              </p>
              <p className="text-secondary-500 text-sm">
                Questions?{" "}
                <a href="mailto:contact@getskillproof.com" className="text-primary-600 hover:text-primary-700">
                  contact@getskillproof.com
                </a>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Ready State - Main Form */}
        {(pageState === "ready" || pageState === "submitting") && checkIn && (
          <div className="space-y-6">
            {/* Greeting */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Hi {firstName}!
              </h1>
              <p className="text-xl text-secondary-600">
                {getMilestoneText(checkIn.checkInNumber)} check-in
              </p>
            </div>

            {/* Context Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-secondary-700">
                      It's been <strong>{checkIn.daysSinceIntro} days</strong> since we introduced you to{" "}
                      <strong className="text-primary-600">{checkIn.employerCompanyName}</strong>{" "}
                      for the <strong>{checkIn.jobTitle}</strong> position.
                    </p>
                    <p className="text-secondary-600 mt-2">
                      How did it go? Your feedback helps us improve our service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-danger-700">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Hired Form - shown after selecting "hired_there" */}
            {showHiredForm && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                      <PartyPopper className="h-5 w-5 text-success-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        Congratulations on your new role!
                      </h3>
                      <p className="text-sm text-secondary-600">
                        Please share a few details (optional)
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleHiredFormSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-secondary-700 mb-1">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Start Date
                      </label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={pageState === "submitting"}
                      />
                    </div>

                    <div>
                      <label htmlFor="roleTitle" className="block text-sm font-medium text-secondary-700 mb-1">
                        <Briefcase className="h-4 w-4 inline mr-1" />
                        Job Title
                      </label>
                      <Input
                        id="roleTitle"
                        type="text"
                        placeholder="e.g., Senior Software Engineer"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        disabled={pageState === "submitting"}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-1">
                        <MessageSquare className="h-4 w-4 inline mr-1" />
                        Anything else you'd like to share?
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Optional message..."
                        className="w-full h-24 px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        disabled={pageState === "submitting"}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowHiredForm(false);
                          setSelectedStatus(null);
                        }}
                        disabled={pageState === "submitting"}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={pageState === "submitting"}
                        loading={pageState === "submitting"}
                        loadingText="Submitting..."
                        className="flex-1"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Status Selection - hidden when showing hired form */}
            {!showHiredForm && (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-lg font-semibold text-secondary-900">
                    What's your current status?
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STATUS_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleStatusSelect(option.id)}
                        disabled={pageState === "submitting"}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${option.bgClass}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${option.iconBgClass}`}>
                          <Icon className={`h-5 w-5 ${option.iconClass}`} />
                        </div>
                        <div className="text-center">
                          <span className={`font-semibold text-sm block ${option.textClass}`}>
                            {option.label}
                          </span>
                          <span className="text-xs text-secondary-500">
                            {option.sublabel}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {pageState === "submitting" && (
                  <div className="text-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-600 mx-auto" />
                    <p className="text-secondary-600 mt-2">Submitting your response...</p>
                  </div>
                )}
              </>
            )}

            {/* Privacy Note */}
            <Card className="bg-secondary-50 border-secondary-200">
              <CardContent className="p-4">
                <p className="text-sm text-secondary-600 text-center">
                  Your response helps us improve our matching process. We take your privacy seriously and will only use this information to provide better job opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary-200 py-6 mt-12">
        <div className="max-w-3xl mx-auto px-4 text-center text-sm text-secondary-500">
          <p>&copy; {new Date().getFullYear()} SkillProof. All rights reserved.</p>
          <p className="mt-1">
            Questions?{" "}
            <a href="mailto:contact@getskillproof.com" className="text-primary-600 hover:text-primary-700">
              contact@getskillproof.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
