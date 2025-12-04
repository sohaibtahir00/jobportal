"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Loader2,
  Briefcase,
  Building2,
  Mail,
  User,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import {
  registrationSchema,
  type RegistrationFormData,
} from "@/lib/validations";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { signup, isLoading, error: authError, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const selectedRole = watch("role");
  const password = watch("password");

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  }, [password]);

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return "Enter a password";
    if (passwordStrength === 1) return "Weak password";
    if (passwordStrength === 2) return "Fair password";
    if (passwordStrength === 3) return "Good password";
    return "Strong password";
  };

  const getPasswordStrengthColor = (level: number) => {
    if (passwordStrength >= level) {
      if (passwordStrength === 1) return "bg-red-500";
      if (passwordStrength === 2) return "bg-orange-500";
      if (passwordStrength === 3) return "bg-yellow-500";
      return "bg-green-500";
    }
    return "bg-gray-200";
  };

  const onSubmit = async (data: RegistrationFormData) => {
    // Clear any previous errors
    setApiError(null);
    clearError();

    try {
      // Call the real signup API
      await signup({
        email: data.email,
        password: data.password,
        fullName: data.name, // Map 'name' from form to 'fullName' for AuthContext
        role: data.role,
      });

      // Success toast
      showToast(
        "success",
        "Account created!",
        "Welcome to the platform. Let's get started."
      );

      // Redirect is handled automatically by AuthContext based on user role
      // No need to manually redirect here
    } catch (error: any) {
      // Extract error message
      const errorMessage = error.message || authError || "An unexpected error occurred. Please try again.";

      setApiError(errorMessage);

      // Show error toast
      showToast(
        "error",
        "Registration failed",
        errorMessage
      );

      // Log error for debugging
      console.error("Signup error:", error);
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSocialSignup = async (provider: "google" | "linkedin") => {
    if (provider === "linkedin") {
      showToast("info", "Coming soon", "LinkedIn signup will be available soon");
      return;
    }

    // For Google OAuth, require role selection first
    if (!selectedRole) {
      showToast(
        "error",
        "Role required",
        "Please select whether you want to find a job or hire talent before continuing with Google"
      );
      return;
    }

    try {
      setIsGoogleLoading(true);

      // Store role in sessionStorage for the callback page to use
      sessionStorage.setItem("oauth_pending_role", selectedRole.toUpperCase());
      sessionStorage.setItem("oauth_flow", "signup");

      // Redirect to Google OAuth
      await signIn("google", {
        callbackUrl: "/auth/oauth-callback",
      });
    } catch (error) {
      console.error("Google signup error:", error);
      showToast("error", "Sign up failed", "Something went wrong. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-y-auto">
        <motion.div
          className="w-full max-w-md my-8"
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
              Create your account
            </h1>
            <p className="text-gray-600">
              Join thousands of professionals in AI/ML
            </p>
          </div>

          {/* Social Signup */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialSignup("google")}
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
              onClick={() => handleSocialSignup("linkedin")}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="#0A66C2"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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
              <span className="px-4 bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-500">
                Or sign up with email
              </span>
            </div>
          </div>

          {/* API Error Alert */}
          {(apiError || authError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">
                  Registration Error
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
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                I am a <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`relative flex cursor-pointer flex-col items-center rounded-xl border-2 p-4 transition-all ${
                    selectedRole === "candidate"
                      ? "border-primary-600 bg-primary-50 ring-2 ring-primary-500/20"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    value="candidate"
                    className="sr-only"
                    {...register("role")}
                  />
                  <Briefcase
                    className={`mb-2 h-8 w-8 ${
                      selectedRole === "candidate"
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      selectedRole === "candidate"
                        ? "text-primary-900"
                        : "text-gray-700"
                    }`}
                  >
                    Candidate
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    Looking for jobs
                  </span>
                </label>

                <label
                  className={`relative flex cursor-pointer flex-col items-center rounded-xl border-2 p-4 transition-all ${
                    selectedRole === "employer"
                      ? "border-primary-600 bg-primary-50 ring-2 ring-primary-500/20"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    value="employer"
                    className="sr-only"
                    {...register("role")}
                  />
                  <Building2
                    className={`mb-2 h-8 w-8 ${
                      selectedRole === "employer"
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      selectedRole === "employer"
                        ? "text-primary-900"
                        : "text-gray-700"
                    }`}
                  >
                    Employer
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    Hiring talent
                  </span>
                </label>
              </div>
              {errors.role && (
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
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {selectedRole === "employer" ? "Company Name" : "Full Name"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    selectedRole === "employer"
                      ? "Your company name"
                      : "Your full name"
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                    errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-primary-500"
                  }`}
                  {...register("name")}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors.name && (
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
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
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

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${getPasswordStrengthColor(
                          level
                        )}`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {getPasswordStrengthLabel()}
                  </p>
                </div>
              )}

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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-primary-500"
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
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
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div>
              <div className="flex items-start">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  {...register("acceptTerms")}
                />
                <label
                  htmlFor="acceptTerms"
                  className="ml-2 text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-primary-600 hover:text-primary-700"
                    target="_blank"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-primary-600 hover:text-primary-700"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
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
                  {errors.acceptTerms.message}
                </p>
              )}
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
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>

            {/* Loading Indicator Text */}
            {isLoading && (
              <p className="text-xs text-center text-gray-500">
                Registering with backend server...
              </p>
            )}
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-accent-600 via-accent-700 to-primary-700 text-white relative overflow-hidden">
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
          <h2 className="text-3xl font-bold mb-8">
            Why join JobPortal?
          </h2>

          <div className="space-y-6">
            {[
              {
                title: "Access to 10,000+ AI/ML Jobs",
                description:
                  "Connect with top tech companies actively hiring AI/ML talent",
              },
              {
                title: "Skills Assessment Tools",
                description:
                  "Showcase your expertise with verified skill assessments",
              },
              {
                title: "Salary Insights",
                description:
                  "Know your worth with real-time market salary data",
              },
              {
                title: "Direct Employer Connections",
                description: "Skip the middleman and connect directly with hiring managers",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-primary-100">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <p className="text-sm mb-2">Trusted by professionals at</p>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="px-4 py-2 rounded-lg bg-white/20 text-sm font-semibold">
                Google
              </div>
              <div className="px-4 py-2 rounded-lg bg-white/20 text-sm font-semibold">
                Meta
              </div>
              <div className="px-4 py-2 rounded-lg bg-white/20 text-sm font-semibold">
                Amazon
              </div>
              <div className="px-4 py-2 rounded-lg bg-white/20 text-sm font-semibold">
                OpenAI
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
