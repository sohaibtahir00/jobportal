"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import api from "@/lib/api";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const { showToast } = useToast();
  const { login, isLoading, error: authError, clearError } = useAuth();

  // Check for URL params from email verification redirect
  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (error && message) {
      setApiError(decodeURIComponent(message));
    }

    // Check for successful verification
    if (searchParams.get("verified") === "true") {
      setVerificationSuccess(true);
      showToast("success", "Email verified!", "You can now sign in to your account.");
    }
  }, [searchParams, showToast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // Clear any previous errors
    setApiError(null);
    setEmailNotVerified(false);
    setVerificationSuccess(false);
    clearError();

    try {
      // Check if user just verified their email (redirect to onboarding after login)
      const justVerified = searchParams.get("verified") === "true";

      // Pre-validate credentials to get proper error messages (including EMAIL_NOT_VERIFIED)
      const validateRes = await api.post("/api/auth/validate", {
        email: data.email,
        password: data.password,
      });

      // If validation passed, proceed with NextAuth login
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        redirectToOnboarding: justVerified,
      });

      // Success toast
      if (justVerified) {
        showToast("success", "Welcome!", "Let's complete your profile setup.");
      } else {
        showToast("success", "Welcome back!", "You've successfully logged in.");
      }

      // Redirect is handled automatically by AuthContext based on user role
      // No need to manually redirect here
    } catch (error: any) {
      // Extract error message - check axios error response first
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        authError ||
        "An unexpected error occurred. Please try again.";

      // Check if the error is email not verified
      if (errorMessage === "EMAIL_NOT_VERIFIED" || errorMessage.includes("EMAIL_NOT_VERIFIED")) {
        setEmailNotVerified(true);
        setUnverifiedEmail(data.email);
        showToast("warning", "Email not verified", "Please verify your email to continue.");
      } else {
        setApiError(errorMessage);
        showToast("error", "Login failed", errorMessage);
      }

      // Log error for debugging
      console.error("Login error:", error);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail || isResending) return;

    setIsResending(true);
    try {
      await api.post("/api/auth/send-verification", { email: unverifiedEmail });
      showToast("success", "Email sent!", "Please check your inbox for the verification link.");
    } catch (error: any) {
      showToast("error", "Failed to send", error.response?.data?.error || "Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSocialLogin = async (provider: "google" | "linkedin") => {
    if (provider === "linkedin") {
      showToast("info", "Coming soon", "LinkedIn login will be available soon");
      return;
    }

    try {
      setIsGoogleLoading(true);

      // Store login flow indicator for the callback page
      sessionStorage.setItem("oauth_flow", "login");

      // Redirect to Google OAuth
      await signIn("google", {
        callbackUrl: "/auth/oauth-callback",
      });
    } catch (error) {
      console.error("Google login error:", error);
      showToast("error", "Login failed", "Something went wrong. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="mb-8">
            <img
              src="/logo.png"
              alt="Job Portal"
              className="h-20 md:h-24 w-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("linkedin")}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Continue with LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Verification Success Alert */}
          {verificationSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-green-800">
                  Email Verified!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your email has been verified. You can now sign in to your account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVerificationSuccess(false)}
                className="text-green-600 hover:text-green-800"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}

          {/* Email Not Verified Alert */}
          {emailNotVerified && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-800">
                    Email Not Verified
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Please verify your email address before signing in. Check your inbox for a verification link.
                  </p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="mt-3 text-sm font-semibold text-amber-700 hover:text-amber-900 underline flex items-center gap-1"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Resend verification email"
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotVerified(false)}
                  className="text-amber-600 hover:text-amber-800"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* API Error Alert */}
          {(apiError || authError) && !emailNotVerified && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">
                  Authentication Error
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {apiError || authError}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setApiError(null);
                  clearError();
                }}
                className="text-red-600 hover:text-red-800"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          )}

          {/* Form - using method="post" and action="#" helps Chrome detect login forms */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" method="post" action="#">
            {/* Email Input - react-hook-form's register adds name attribute automatically */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-primary-500"
                  }`}
                  {...register("email")}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input - react-hook-form's register adds name attribute automatically */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-primary-500"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  {...register("rememberMe")}
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Loading Indicator Text */}
            {isLoading && (
              <p className="text-xs text-center text-gray-500">
                Authenticating with backend server...
              </p>
            )}
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Testimonial */}
      <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <motion.div
          className="relative z-10 max-w-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8">
            <svg
              className="w-12 h-12 mb-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-xl mb-6 leading-relaxed">
              JobPortal helped me land my dream role as an ML Engineer at a top
              tech company. The platform is intuitive and the quality of
              opportunities is unmatched.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg">
                SM
              </div>
              <div>
                <div className="font-semibold">Sarah Martinez</div>
                <div className="text-primary-200 text-sm">
                  ML Engineer at TechCorp
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div>
              <div className="text-3xl font-bold mb-1">10k+</div>
              <div className="text-primary-200 text-sm">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">5k+</div>
              <div className="text-primary-200 text-sm">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">95%</div>
              <div className="text-primary-200 text-sm">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
