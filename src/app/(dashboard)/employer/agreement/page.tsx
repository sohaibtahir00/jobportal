"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FileText,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ScrollText,
  ChevronDown,
  Calendar,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  useToast,
} from "@/components/ui";
import { api } from "@/lib/api";

// Agreement text - same as backend
const AGREEMENT_TEXT = `HIREHUB AI SERVICE AGREEMENT

Effective Date: Upon Electronic Acceptance

This Service Agreement ("Agreement") is entered into between HireHub AI ("Company", "we", "us", "our") and the employer organization ("Employer", "you", "your") identified during registration.

1. SERVICES PROVIDED

1.1 HireHub AI provides a technology-enabled recruitment platform connecting Employers with pre-vetted technology professionals ("Candidates").

1.2 Our services include:
- Access to our curated database of technology professionals
- Candidate skills assessment and verification
- Profile matching and recommendations
- Interview scheduling and coordination
- Placement facilitation

2. FEE STRUCTURE

2.1 Success Fee: You agree to pay a placement fee equal to 15-20% of the Candidate's first-year base salary upon successful hiring of any Candidate introduced through our platform.

2.2 Payment Terms:
- 50% of the placement fee is due upon signed offer acceptance
- Remaining 50% is due upon the Candidate's start date
- All fees are non-refundable except as specified in Section 4

2.3 Fee Calculation: The placement fee is calculated based on the Candidate's annual base salary (excluding bonuses, equity, or other compensation).

3. CANDIDATE INTRODUCTION & PROTECTION PERIOD

3.1 Introduction Definition: A Candidate is considered "introduced" when you:
- View the Candidate's full profile (including contact information)
- Receive Candidate information via email or direct communication
- Interview the Candidate through any channel
- Receive the Candidate's resume or application materials

3.2 Protection Period: Once a Candidate is introduced, a 12-month protection period begins. If you hire the introduced Candidate within this period, whether directly or indirectly, the placement fee applies.

3.3 Prior Relationship Exception: If you have documented evidence of a prior relationship with the Candidate (employment, interview, or formal contact within 6 months before introduction), you must notify us within 48 hours of receiving the introduction. We will review and may waive the fee if substantiated.

4. GUARANTEE PERIOD

4.1 90-Day Guarantee: If a placed Candidate leaves or is terminated within 90 days of their start date, we will:
- Provide one replacement candidate at no additional fee, OR
- Issue a prorated refund based on days worked

4.2 Refund Calculation:
- 0-30 days: 100% refund
- 31-60 days: 50% refund
- 61-90 days: 25% refund

4.3 Exclusions: The guarantee does not apply if:
- Termination is due to company layoffs, restructuring, or budget cuts
- The Candidate leaves due to material changes in job duties, location, or compensation
- You fail to provide reasonable onboarding and support

5. CANDIDATE HIRING OBLIGATIONS

5.1 Exclusive Engagement: While actively interviewing a Candidate introduced through our platform, you agree not to engage with the same Candidate through other recruitment channels.

5.2 Offer Notification: You must notify us within 24 hours of extending an offer to any introduced Candidate.

5.3 Circumvention: You agree not to circumvent our services by:
- Contacting Candidates directly after their profiles are removed from our platform
- Hiring Candidates through another agency who were first introduced by HireHub AI
- Encouraging Candidates to apply directly to avoid fees

6. DATA PRIVACY & CONFIDENTIALITY

6.1 Candidate Information: All Candidate information is confidential and may only be used for legitimate hiring purposes.

6.2 Data Protection: You agree to handle Candidate data in compliance with applicable privacy laws.

6.3 Non-Disclosure: You will not share Candidate profiles or information with third parties without our written consent.

7. TERM & TERMINATION

7.1 This Agreement remains in effect for as long as you maintain an active employer account.

7.2 Either party may terminate with 30 days written notice, but termination does not affect:
- Outstanding fee obligations for already-introduced Candidates
- Protection periods already in effect

8. LIMITATION OF LIABILITY

8.1 HireHub AI's total liability shall not exceed the fees paid by you in the 12 months preceding any claim.

8.2 We are not liable for:
- Candidate performance or conduct
- Your hiring decisions
- Indirect or consequential damages

9. DISPUTE RESOLUTION

9.1 Any disputes will first be addressed through good-faith negotiation.

9.2 If unresolved, disputes will be submitted to binding arbitration under AAA Commercial Arbitration Rules.

10. GENERAL PROVISIONS

10.1 This Agreement constitutes the entire agreement between the parties.

10.2 We may update these terms with 30 days notice. Continued use of services constitutes acceptance.

10.3 This Agreement is governed by the laws of Delaware, USA.

BY SIGNING BELOW, YOU CONFIRM THAT:
- You have authority to bind your organization to this Agreement
- You have read and understood all terms
- You agree to be bound by this Agreement

Electronic Signature Acknowledgment:
Your electronic signature below has the same legal effect as a handwritten signature.`;

interface AgreementStatus {
  hasSigned: boolean;
  signedAt: string | null;
  agreementVersion: string | null;
}

export default function ServiceAgreementPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { showToast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [loading, setLoading] = useState(true);
  const [agreementStatus, setAgreementStatus] = useState<AgreementStatus | null>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    signerName?: string;
    signerTitle?: string;
    agreedToTerms?: string;
  }>({});

  // Check agreement status on mount
  useEffect(() => {
    const checkAgreementStatus = async () => {
      try {
        const response = await api.get("/api/employer/service-agreement");
        setAgreementStatus(response.data);
      } catch (error: any) {
        console.error("Failed to check agreement status:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        } else if (error.response?.status === 403) {
          router.push("/employer/dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    if (sessionStatus === "authenticated") {
      checkAgreementStatus();
    } else if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [sessionStatus, router]);

  // Scroll detection
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Consider "scrolled to bottom" when within 20px of the bottom
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
      }
    }
  }, [hasScrolledToBottom]);

  // Validate form
  const validateForm = (): boolean => {
    const errors: typeof formErrors = {};

    if (!signerName.trim() || signerName.trim().length < 2) {
      errors.signerName = "Full name is required (minimum 2 characters)";
    }

    if (!signerTitle.trim() || signerTitle.trim().length < 2) {
      errors.signerTitle = "Job title is required (minimum 2 characters)";
    }

    if (!agreedToTerms) {
      errors.agreedToTerms = "You must agree to the terms to proceed";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit agreement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasScrolledToBottom) {
      showToast("error", "Please Read Agreement", "You must scroll through the entire agreement before signing.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/api/employer/service-agreement", {
        signerName: signerName.trim(),
        signerTitle: signerTitle.trim(),
        agreedToTerms: true,
      });

      showToast("success", "Agreement Signed", "Thank you for signing the service agreement.");

      // Check if there's a redirect URL in query params
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirect") || "/employer/dashboard";

      router.push(redirectTo);
    } catch (error: any) {
      console.error("Failed to sign agreement:", error);
      showToast(
        "error",
        "Failed to Sign",
        error.response?.data?.error || "Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading || sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto" />
          <p className="mt-4 text-secondary-600">Loading agreement...</p>
        </div>
      </div>
    );
  }

  // Already signed state
  if (agreementStatus?.hasSigned) {
    const signedDate = agreementStatus.signedAt
      ? new Date(agreementStatus.signedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Unknown date";

    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Agreement Signed
              </h1>

              <p className="text-secondary-600 mb-6">
                You signed the HireHub AI Service Agreement on{" "}
                <span className="font-semibold">{signedDate}</span>
              </p>

              <div className="bg-white/80 rounded-lg p-4 mb-6 inline-block">
                <p className="text-sm text-secondary-500">
                  Agreement Version: <span className="font-medium">{agreementStatus.agreementVersion || "v1.0"}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    const modal = document.getElementById("agreementModal");
                    if (modal) modal.classList.remove("hidden");
                  }}
                >
                  <ScrollText className="h-4 w-4 mr-2" />
                  View Agreement
                </Button>
                <Button asChild>
                  <Link href="/employer/dashboard">
                    Continue to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* View Agreement Modal */}
          <div
            id="agreementModal"
            className="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                e.currentTarget.classList.add("hidden");
              }
            }}
          >
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Service Agreement</h2>
                <button
                  onClick={() => document.getElementById("agreementModal")?.classList.add("hidden")}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                <pre className="whitespace-pre-wrap font-sans text-sm text-secondary-700 leading-relaxed">
                  {AGREEMENT_TEXT}
                </pre>
              </div>
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("agreementModal")?.classList.add("hidden")}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Sign agreement form
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            HireHub AI Service Agreement
          </h1>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Before accessing candidate profiles, please review and sign our service agreement.
          </p>
        </div>

        {/* Agreement Text Card */}
        <Card variant="accent" className="mb-6 border-2 border-secondary-200">
          <CardHeader className="bg-secondary-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-secondary-600" />
                Service Agreement Terms
              </CardTitle>
              {!hasScrolledToBottom && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <ChevronDown className="h-4 w-4 animate-bounce" />
                  <span>Scroll to read all terms</span>
                </div>
              )}
              {hasScrolledToBottom && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Check className="h-4 w-4" />
                  <span>Agreement reviewed</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="h-[400px] overflow-y-auto p-6 bg-gray-50"
            >
              <pre className="whitespace-pre-wrap font-sans text-sm text-secondary-700 leading-relaxed">
                {AGREEMENT_TEXT}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Signature Form */}
        <Card variant="accent" className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Your Information</CardTitle>
            <CardDescription>
              Please provide your details to sign this agreement electronically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="John Smith"
                  value={signerName}
                  onChange={(e) => {
                    setSignerName(e.target.value);
                    if (formErrors.signerName) {
                      setFormErrors((prev) => ({ ...prev, signerName: undefined }));
                    }
                  }}
                  error={formErrors.signerName}
                  required
                  disabled={!hasScrolledToBottom}
                />

                <Input
                  label="Job Title"
                  placeholder="HR Director"
                  value={signerTitle}
                  onChange={(e) => {
                    setSignerTitle(e.target.value);
                    if (formErrors.signerTitle) {
                      setFormErrors((prev) => ({ ...prev, signerTitle: undefined }));
                    }
                  }}
                  error={formErrors.signerTitle}
                  required
                  disabled={!hasScrolledToBottom}
                />
              </div>

              {/* Checkbox */}
              <div className="mt-4">
                <label
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                    agreedToTerms
                      ? "border-green-300 bg-green-50"
                      : formErrors.agreedToTerms
                      ? "border-red-300 bg-red-50"
                      : "border-secondary-200 hover:border-primary-300"
                  } ${!hasScrolledToBottom ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (formErrors.agreedToTerms) {
                        setFormErrors((prev) => ({ ...prev, agreedToTerms: undefined }));
                      }
                    }}
                    disabled={!hasScrolledToBottom}
                    className="mt-1 h-5 w-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                  />
                  <div>
                    <span className="text-sm font-medium text-secondary-900">
                      I have read and agree to the terms of this Service Agreement
                    </span>
                    <p className="text-xs text-secondary-500 mt-1">
                      By signing, I confirm I am authorized to bind{" "}
                      <span className="font-medium">my organization</span> to this agreement.
                    </p>
                  </div>
                </label>
                {formErrors.agreedToTerms && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.agreedToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={!hasScrolledToBottom || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing Agreement...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Sign Agreement
                  </>
                )}
              </Button>

              {!hasScrolledToBottom && (
                <p className="text-center text-sm text-amber-600">
                  Please scroll through the entire agreement to enable signing
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Key Terms Summary */}
        <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Summary of Key Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white/80 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold text-sm">%</span>
                </div>
                <div>
                  <p className="font-medium text-secondary-900">15-20% Placement Fee</p>
                  <p className="text-sm text-secondary-600">Based on candidate's first-year base salary</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/80 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">12-Month Protection</p>
                  <p className="text-sm text-secondary-600">From when you first view a candidate</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/80 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">90-Day Guarantee</p>
                  <p className="text-sm text-secondary-600">Replacement or prorated refund</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/80 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">Fee Applies Regardless</p>
                  <p className="text-sm text-secondary-600">Of how the hire occurs within protection period</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
