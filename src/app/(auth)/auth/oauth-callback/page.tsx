"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-portal-backend-production-cd05.up.railway.app';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Completing authentication...");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Wait for session to load
      if (status === "loading") {
        return;
      }

      // If no session, something went wrong
      if (status === "unauthenticated" || !session?.user?.email) {
        setError("Authentication failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      try {
        // Get OAuth flow type and pending role from sessionStorage
        const oauthFlow = sessionStorage.getItem("oauth_flow");
        const pendingRole = sessionStorage.getItem("oauth_pending_role");

        // Clear sessionStorage immediately
        sessionStorage.removeItem("oauth_flow");
        sessionStorage.removeItem("oauth_pending_role");

        // Check if this is a new OAuth user (doesn't exist in our DB yet)
        const isNewOAuthUser = (session as any).isNewOAuthUser;

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

            // Redirect to onboarding based on role (same as regular signup)
            const redirectUrl = createData.user.role === "EMPLOYER"
              ? "/onboarding/employer"
              : "/onboarding/candidate";

            setTimeout(() => {
              router.push(redirectUrl);
            }, 1000);
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
          // Existing user - just redirect to their dashboard
          setStatusMessage("Welcome back! Redirecting...");

          const role = session.user.role;
          let redirectUrl = "/candidate/dashboard";

          if (role === "ADMIN") {
            redirectUrl = "/admin";
          } else if (role === "EMPLOYER") {
            redirectUrl = "/employer/dashboard";
          }

          setTimeout(() => {
            router.push(redirectUrl);
          }, 500);
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError("Something went wrong. Please try again.");
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [session, status, router, update]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {isProcessing && !error ? (
          <>
            <div className="mb-6">
              <Loader2 className="w-12 h-12 mx-auto text-primary-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {statusMessage}
            </h1>
            <p className="text-gray-600">
              Please wait while we set up your account.
            </p>
          </>
        ) : error ? (
          <>
            <div className="mb-6">
              <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Failed
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              {error.includes("sign up first") && (
                <Link
                  href="/signup"
                  className="block w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all"
                >
                  Go to Sign Up
                </Link>
              )}
              {error.includes("log in instead") && (
                <Link
                  href="/login"
                  className="block w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all"
                >
                  Go to Login
                </Link>
              )}
              {error.includes("select a role") && (
                <Link
                  href="/signup"
                  className="block w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all"
                >
                  Go to Sign Up
                </Link>
              )}
              <Link
                href="/"
                className="block w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Go to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Success!
            </h1>
            <p className="text-gray-600">Redirecting you now...</p>
          </>
        )}
      </div>
    </div>
  );
}
