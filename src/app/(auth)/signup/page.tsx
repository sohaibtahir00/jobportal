"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Briefcase, Building2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input, Button, useToast } from "@/components/ui";
import { registrationSchema, type RegistrationFormData } from "@/lib/validations";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Registration data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast("success", "Account created!", "Welcome to the platform. Let's get started.");
      // Mock redirect based on role
      if (data.role === "employer") {
        router.push("/employer/dashboard");
      } else {
        router.push("/candidate/dashboard");
      }
    } catch (error) {
      showToast("error", "Registration failed", "There was a problem creating your account. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: "google" | "linkedin") => {
    // TODO: Implement social signup
    console.log(`Sign up with ${provider}`);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of professionals in AI/ML"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="mb-3 block text-sm font-medium text-secondary-700">
            I am a <span className="text-danger-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`relative flex cursor-pointer flex-col items-center rounded-lg border-2 p-4 transition-all ${
                selectedRole === "candidate"
                  ? "border-primary-600 bg-primary-50"
                  : "border-secondary-200 bg-white hover:border-secondary-300"
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
                    : "text-secondary-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  selectedRole === "candidate"
                    ? "text-primary-900"
                    : "text-secondary-700"
                }`}
              >
                Candidate
              </span>
              <span className="mt-1 text-xs text-secondary-500">
                Looking for jobs
              </span>
            </label>

            <label
              className={`relative flex cursor-pointer flex-col items-center rounded-lg border-2 p-4 transition-all ${
                selectedRole === "employer"
                  ? "border-primary-600 bg-primary-50"
                  : "border-secondary-200 bg-white hover:border-secondary-300"
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
                    : "text-secondary-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  selectedRole === "employer"
                    ? "text-primary-900"
                    : "text-secondary-700"
                }`}
              >
                Employer
              </span>
              <span className="mt-1 text-xs text-secondary-500">
                Hiring talent
              </span>
            </label>
          </div>
          {errors.role && (
            <p className="mt-2 text-sm text-danger-600">{errors.role.message}</p>
          )}
        </div>

        {/* Full Name Input */}
        <Input
          label="Full name"
          type="text"
          placeholder={
            selectedRole === "employer"
              ? "Company name"
              : "Your full name"
          }
          error={errors.fullName?.message}
          required
          {...register("fullName")}
        />

        {/* Email Input */}
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          required
          {...register("email")}
        />

        {/* Password Input */}
        <div>
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            error={errors.password?.message}
            helperText="Must be at least 8 characters with uppercase, lowercase, and number"
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            {...register("password")}
          />
        </div>

        {/* Confirm Password Input */}
        <div>
          <Input
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            {...register("confirmPassword")}
          />
        </div>

        {/* Terms and Conditions */}
        <div>
          <div className="flex items-start">
            <input
              id="acceptTerms"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              {...register("acceptTerms")}
            />
            <label
              htmlFor="acceptTerms"
              className="ml-2 text-sm text-secondary-700"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-primary-600 hover:text-primary-700"
                target="_blank"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-primary-600 hover:text-primary-700"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="mt-2 text-sm text-danger-600">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-secondary-500">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Social Signup Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialSignup("google")}
            className="flex items-center justify-center rounded-lg border border-secondary-300 bg-white px-4 py-2.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
            Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignup("linkedin")}
            className="flex items-center justify-center rounded-lg border border-secondary-300 bg-white px-4 py-2.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="#0A66C2"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-secondary-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
