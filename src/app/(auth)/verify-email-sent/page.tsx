"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, RefreshCw, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui";
import api from "@/lib/api";

function VerifyEmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { showToast } = useToast();

  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || !email) return;

    setIsResending(true);
    try {
      await api.post("/api/auth/send-verification", { email });
      showToast("success", "Email sent!", "A new verification link has been sent to your email.");
      setResendCooldown(60); // 60 second cooldown
    } catch (error: any) {
      console.error("Resend error:", error);
      showToast(
        "error",
        "Failed to resend",
        error.response?.data?.error || "Please try again later."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="SkillProof"
                className="h-10 w-auto mx-auto"
              />
            </Link>
          </div>

          {/* Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full">
              <Mail className="w-10 h-10 text-primary-600" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Check your email
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-center mb-2">
            We sent a verification link to
          </p>
          {email && (
            <p className="text-primary-600 font-semibold text-center mb-6 break-all">
              {email}
            </p>
          )}
          <p className="text-gray-600 text-center mb-8">
            Click the link in the email to verify your account and continue setting up your profile.
          </p>

          {/* Resend Button */}
          <button
            onClick={handleResendEmail}
            disabled={isResending || resendCooldown > 0 || !email}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isResending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Resend verification email
              </>
            )}
          </button>

          {/* Help Text */}
          <div className="mt-8 space-y-3 text-sm text-gray-500 text-center">
            <div className="flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Didn't receive it? Check your spam folder</span>
            </div>
            <p>The link expires in 24 hours</p>
          </div>

          {/* Back to Login */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>

        {/* Support link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{" "}
          <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
            Contact support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function VerifyEmailSentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailSentContent />
    </Suspense>
  );
}
