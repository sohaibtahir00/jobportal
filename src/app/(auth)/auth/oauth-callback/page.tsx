"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-portal-backend-production-cd05.up.railway.app';

export default function OAuthCallbackPage() {
  const { data: session, status, update } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Completing authentication...");

  // Use ref to track if we've already started processing to prevent double execution
  const hasProcessedRef = useRef(false);
  // Store sessionStorage values in refs before they get cleared
  const oauthFlowRef = useRef<string | null>(null);
  const pendingRoleRef = useRef<string | null>(null);

  // Capture sessionStorage values on mount (before any re-renders clear them)
  useEffect(() => {
    if (typeof window !== 'undefined' && !oauthFlowRef.current) {
      oauthFlowRef.current = sessionStorage.getItem("oauth_flow");
      pendingRoleRef.current = sessionStorage.getItem("oauth_pending_role");
      // Clear immediately after capturing
      sessionStorage.removeItem("oauth_flow");
      sessionStorage.removeItem("oauth_pending_role");
    }
  }, []);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Wait for session to load
      if (status === "loading") {
        return;
      }

      // Prevent double execution
      if (hasProcessedRef.current) {
        return;
      }

      // If no session, something went wrong
      if (status === "unauthenticated" || !session?.user?.email) {
        setError("Authentication failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Mark as processing
      hasProcessedRef.current = true;

      try {
        const oauthFlow = oauthFlowRef.current;
        const pendingRole = pendingRoleRef.current;

        // Check if this is a new OAuth user (doesn't exist in our DB yet)
        const isNewOAuthUser = (session as any).isNewOAuthUser;

        console.log("OAuth Callback Debug:", {
          isNewOAuthUser,
          oauthFlow,
          pendingRole,
          sessionRole: session.user.role,
          email: session.user.email
        });

        if (isNewOAuthUser) {
          // This is a new user from OAuth
          if (oauthFlow === "signup" && pendingRole) {
            // Coming from signup page with a role - create the user
            setStatusMessage("Creating your account...");

            const createRes = await fetch(`${BACKEND_URL}/api/auth/oauth/create`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
                role: pendingRole,
                provider: "google",
              }),
            });

            const createData = await createRes.json();

            if (!createRes.ok) {
              if (createData.exists) {
                setError("An account with this email already exists. Please log in instead.");
              } else {
                setError(createData.error || "Failed to create account. Please try again.");
              }
              setIsProcessing(false);
              return;
            }

            // Update the session with the new user data
            await update({
              id: createData.user.id,
              role: createData.user.role,
              isNewOAuthUser: false,
            });

            setStatusMessage("Account created! Redirecting to onboarding...");

            // Redirect to onboarding based on role
            const redirectUrl = createData.user.role === "EMPLOYER"
              ? "/onboarding/employer"
              : "/onboarding/candidate";

            // Small delay to show success message, then redirect
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 500);
          } else if (oauthFlow === "login") {
            // Coming from login page but user doesn't exist
            setError("No account found with this email. Please sign up first.");
            setIsProcessing(false);
            return;
          } else {
            // No role provided on signup - shouldn't happen but handle gracefully
            setError("Please select a role (Candidate or Employer) before signing up with Google.");
            setIsProcessing(false);
            return;
          }
        } else {
          // Existing user - check if onboarding is completed
          const onboardingCompleted = (session as any).onboardingCompleted ?? false;
          const role = session.user.role;

          // If onboarding not completed, redirect to onboarding
          if (!onboardingCompleted && role !== "ADMIN") {
            setStatusMessage("Redirecting to complete your profile...");
            const redirectUrl = role === "EMPLOYER"
              ? "/onboarding/employer"
              : "/onboarding/candidate";

            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 300);
            return;
          }

          // Onboarding completed - redirect to dashboard
          setStatusMessage("Welcome back! Redirecting...");

          let redirectUrl = "/candidate/dashboard";

          if (role === "ADMIN") {
            redirectUrl = "/admin";
          } else if (role === "EMPLOYER") {
            redirectUrl = "/employer/dashboard";
          }

          // Small delay to show message, then redirect
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 300);
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError("Something went wrong. Please try again.");
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [session, status, update]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-purple-50 p-4">
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

          {isProcessing && !error ? (
            <div className="text-center">
              {/* Loading Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full">
                  <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {statusMessage}
              </h1>
              <p className="text-gray-600">
                Please wait while we set up your account.
              </p>
            </div>
          ) : error ? (
            <div className="text-center">
              {/* Error Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Authentication Failed
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                {error.includes("sign up first") && (
                  <Link
                    href="/signup"
                    className="block w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg text-center"
                  >
                    Go to Sign Up
                  </Link>
                )}
                {error.includes("log in instead") && (
                  <Link
                    href="/login"
                    className="block w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg text-center"
                  >
                    Go to Login
                  </Link>
                )}
                {error.includes("select a role") && (
                  <Link
                    href="/signup"
                    className="block w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg text-center"
                  >
                    Go to Sign Up
                  </Link>
                )}
                <Link
                  href="/"
                  className="block w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-center"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {/* Success Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Success!
              </h1>
              <p className="text-gray-600">Redirecting you now...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
