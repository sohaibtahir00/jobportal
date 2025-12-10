"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Mail,
  Phone,
  Linkedin,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { resolveImageUrl } from "@/lib/utils";

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://job-portal-backend-production-cd05.up.railway.app";

interface IntroductionData {
  id: string;
  status: string;
  requestedAt: string;
  employer: {
    companyName: string;
    logo: string | null;
    website: string | null;
    industry: string | null;
    description: string | null;
    location: string | null;
  };
  job: {
    title: string;
    location: string;
    type: string;
    remote: boolean;
    salaryRange: string | null;
    description: string;
  } | null;
  candidateName: string;
}

type PageState =
  | "loading"
  | "pending"
  | "already_accepted"
  | "already_declined"
  | "already_questions"
  | "expired"
  | "invalid"
  | "submitting"
  | "success_accepted"
  | "success_declined"
  | "success_questions";

export default function IntroductionRespondPage() {
  const params = useParams();
  const token = params?.token as string;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [introduction, setIntroduction] = useState<IntroductionData | null>(null);
  const [error, setError] = useState<string>("");
  const [showQuestionsForm, setShowQuestionsForm] = useState(false);
  const [questionsMessage, setQuestionsMessage] = useState("");
  const [previousResponse, setPreviousResponse] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchIntroduction();
    }
  }, [token]);

  const fetchIntroduction = async () => {
    try {
      const response = await fetch(`${API_URL}/api/introductions/respond/${token}`);
      const data = await response.json();

      if (!response.ok) {
        if (data.code === "INVALID_TOKEN") {
          setPageState("invalid");
        } else if (data.code === "TOKEN_EXPIRED") {
          setPageState("expired");
        } else if (data.code === "ALREADY_RESPONDED") {
          setPreviousResponse(data.response);
          if (data.response === "ACCEPTED") {
            setPageState("already_accepted");
          } else if (data.response === "DECLINED") {
            setPageState("already_declined");
          } else if (data.response === "QUESTIONS") {
            setPageState("already_questions");
          }
        } else {
          setError(data.error || "Something went wrong");
          setPageState("invalid");
        }
        return;
      }

      setIntroduction(data.introduction);
      setPageState("pending");
    } catch (err) {
      console.error("Error fetching introduction:", err);
      setError("Failed to load introduction details");
      setPageState("invalid");
    }
  };

  const handleResponse = async (response: "ACCEPTED" | "DECLINED" | "QUESTIONS") => {
    if (response === "QUESTIONS" && !showQuestionsForm) {
      setShowQuestionsForm(true);
      return;
    }

    if (response === "QUESTIONS" && !questionsMessage.trim()) {
      setError("Please enter your questions before submitting");
      return;
    }

    setPageState("submitting");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/introductions/respond/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response,
          message: response === "QUESTIONS" ? questionsMessage : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit response");
        setPageState("pending");
        return;
      }

      // Set success state based on response
      if (response === "ACCEPTED") {
        setPageState("success_accepted");
      } else if (response === "DECLINED") {
        setPageState("success_declined");
      } else {
        setPageState("success_questions");
      }
    } catch (err) {
      console.error("Error submitting response:", err);
      setError("Failed to submit response. Please try again.");
      setPageState("pending");
    }
  };

  const formatJobType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get first name for personalization
  const firstName = introduction?.candidateName?.split(" ")[0] || "there";

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
              <p className="text-secondary-600">Loading introduction details...</p>
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
                This link is not valid. If you received this from SkillProof, please contact us.
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
                Introduction requests are valid for 7 days. If you're still interested in this opportunity, please contact us.
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

        {/* Already Accepted State */}
        {pageState === "already_accepted" && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-success-600" />
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                You've Already Accepted This Introduction
              </h1>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                The employer has your contact information and should reach out soon about this opportunity.
              </p>
              <p className="text-secondary-500 text-sm">
                If you haven't heard from them in a few days, let us know:{" "}
                <a href="mailto:contact@getskillproof.com" className="text-primary-600 hover:text-primary-700">
                  contact@getskillproof.com
                </a>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Already Declined State */}
        {pageState === "already_declined" && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-secondary-600" />
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                You've Declined This Introduction
              </h1>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                No worries! Your information was not shared with the employer.
              </p>
              <p className="text-secondary-500 text-sm">
                Changed your mind? Contact us:{" "}
                <a href="mailto:contact@getskillproof.com" className="text-primary-600 hover:text-primary-700">
                  contact@getskillproof.com
                </a>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Already Questions State */}
        {pageState === "already_questions" && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                We've Received Your Questions
              </h1>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                Our team is reviewing your questions and will get back to you within 24 hours.
              </p>
              <p className="text-secondary-500 text-sm">
                Need to add more details?{" "}
                <a href="mailto:contact@getskillproof.com" className="text-primary-600 hover:text-primary-700">
                  contact@getskillproof.com
                </a>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Success States */}
        {pageState === "success_accepted" && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-success-600" />
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">Response Recorded!</h1>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                Great! <strong>{introduction?.employer.companyName}</strong> will receive your contact information and should reach out soon about the{" "}
                <strong>{introduction?.job?.title}</strong> role.
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

        {pageState === "success_declined" && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-secondary-600" />
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">Response Recorded</h1>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                No problem. Your information will not be shared with {introduction?.employer.companyName}.
              </p>
              <p className="text-secondary-500 text-sm">
                We'll keep you in mind for future opportunities that might be a better fit!
              </p>
            </CardContent>
          </Card>
        )}

        {pageState === "success_questions" && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">Questions Sent!</h1>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                Thanks! We'll review your questions and get back to you within 24 hours.
              </p>
              <p className="text-secondary-500 text-sm">
                Need to add more?{" "}
                <a href="mailto:contact@getskillproof.com" className="text-primary-600 hover:text-primary-700">
                  contact@getskillproof.com
                </a>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pending Response - Main Form */}
        {(pageState === "pending" || pageState === "submitting") && introduction && (
          <div className="space-y-6">
            {/* Greeting */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Hi {firstName}!
              </h1>
              <p className="text-xl text-secondary-600">
                <strong className="text-primary-600">{introduction.employer.companyName}</strong> wants to connect with you!
              </p>
            </div>

            {/* Company & Job Card */}
            <Card>
              <CardContent className="p-6">
                {/* Company Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {introduction.employer.logo ? (
                      <img
                        src={resolveImageUrl(introduction.employer.logo) || ''}
                        alt={introduction.employer.companyName}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-secondary-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-secondary-900">
                      {introduction.employer.companyName}
                    </h2>
                    {introduction.employer.industry && (
                      <p className="text-secondary-600">{introduction.employer.industry}</p>
                    )}
                    {introduction.employer.website && (
                      <a
                        href={introduction.employer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm inline-flex items-center gap-1 mt-1"
                      >
                        Visit website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                {introduction.job && (
                  <div className="bg-secondary-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary-600" />
                      <span className="font-semibold text-secondary-900">
                        {introduction.job.title}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {introduction.job.location && (
                        <div className="flex items-center gap-2 text-secondary-600">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {introduction.job.location}
                            {introduction.job.remote && " (Remote)"}
                          </span>
                        </div>
                      )}
                      {introduction.job.type && (
                        <div className="flex items-center gap-2 text-secondary-600">
                          <Clock className="h-4 w-4" />
                          <span>{formatJobType(introduction.job.type)}</span>
                        </div>
                      )}
                      {introduction.job.salaryRange && (
                        <div className="flex items-center gap-2 text-secondary-600">
                          <DollarSign className="h-4 w-4" />
                          <span>{introduction.job.salaryRange}</span>
                        </div>
                      )}
                    </div>

                    {introduction.job.description && (
                      <div className="pt-3 border-t border-secondary-200">
                        <p className="text-sm text-secondary-700 line-clamp-4">
                          {introduction.job.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Company Description */}
                {introduction.employer.description && (
                  <div className="mt-4 pt-4 border-t border-secondary-200">
                    <h3 className="text-sm font-semibold text-secondary-700 mb-2">About {introduction.employer.companyName}</h3>
                    <p className="text-sm text-secondary-600 line-clamp-3">
                      {introduction.employer.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* What Happens Next */}
            <Card>
              <CardContent className="p-6">
                <p className="text-secondary-700">
                  If you accept, we'll share your contact information with {introduction.employer.companyName} so they can reach out about next steps.
                </p>
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

            {/* Questions Form */}
            {showQuestionsForm && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                    What would you like to know?
                  </h3>
                  <textarea
                    value={questionsMessage}
                    onChange={(e) => setQuestionsMessage(e.target.value)}
                    placeholder="Type your questions here..."
                    className="w-full h-32 px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    disabled={pageState === "submitting"}
                  />
                  <p className="text-sm text-secondary-500 mt-2">
                    We'll get back to you within 24 hours.
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowQuestionsForm(false);
                        setQuestionsMessage("");
                      }}
                      disabled={pageState === "submitting"}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleResponse("QUESTIONS")}
                      disabled={!questionsMessage.trim() || pageState === "submitting"}
                      loading={pageState === "submitting"}
                      loadingText="Sending..."
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Questions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Response Buttons */}
            {!showQuestionsForm && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleResponse("ACCEPTED")}
                  disabled={pageState === "submitting"}
                  className="flex flex-col items-center gap-3 p-6 bg-success-50 hover:bg-success-100 border-2 border-success-200 hover:border-success-400 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-14 h-14 bg-success-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 text-success-600" />
                  </div>
                  <span className="font-semibold text-success-700">I'm Interested</span>
                </button>

                <button
                  onClick={() => handleResponse("DECLINED")}
                  disabled={pageState === "submitting"}
                  className="flex flex-col items-center gap-3 p-6 bg-secondary-50 hover:bg-secondary-100 border-2 border-secondary-200 hover:border-secondary-400 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-7 w-7 text-secondary-600" />
                  </div>
                  <span className="font-semibold text-secondary-700">Not Interested</span>
                </button>

                <button
                  onClick={() => handleResponse("QUESTIONS")}
                  disabled={pageState === "submitting"}
                  className="flex flex-col items-center gap-3 p-6 bg-primary-50 hover:bg-primary-100 border-2 border-primary-200 hover:border-primary-400 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="h-7 w-7 text-primary-600" />
                  </div>
                  <span className="font-semibold text-primary-700">I Have Questions</span>
                </button>
              </div>
            )}

            {/* Info Shared Section */}
            <Card className="bg-secondary-50 border-secondary-200">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-secondary-700 mb-3">
                  Information that will be shared if you accept:
                </h3>
                <ul className="space-y-2 text-sm text-secondary-600">
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-secondary-400" />
                    <span>Your email address</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-secondary-400" />
                    <span>Your phone number (if provided)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-secondary-400" />
                    <span>Your LinkedIn profile (if provided)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-secondary-400" />
                    <span>Your resume will be accessible</span>
                  </li>
                </ul>
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
