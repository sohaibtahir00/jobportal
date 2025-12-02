"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input, Button, useToast } from "@/components/ui";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations";
import api from "@/lib/api";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setTokenError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setTokenError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/auth/reset-password", {
        token,
        password: data.password,
      });

      setIsSuccess(true);
      showToast("success", "Password reset successful", "You can now sign in with your new password.");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to reset password. Please try again.";
      showToast("error", "Reset failed", errorMessage);

      // If token is invalid or expired, show specific error
      if (errorMessage.includes("expired") || errorMessage.includes("Invalid")) {
        setTokenError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Token error state
  if (tokenError) {
    return (
      <AuthLayout
        title="Reset link invalid"
        subtitle="This password reset link is invalid or has expired"
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>

          <div className="mb-8">
            <p className="text-secondary-700">{tokenError}</p>
          </div>

          <div className="space-y-4">
            <Link
              href="/forgot-password"
              className="inline-block w-full rounded-lg bg-primary-600 px-6 py-3 text-center font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Request new reset link
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <AuthLayout
        title="Password reset successful"
        subtitle="Your password has been changed"
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
            <CheckCircle2 className="h-8 w-8 text-success-600" />
          </div>

          <div className="mb-8">
            <p className="text-secondary-700">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-block w-full rounded-lg bg-primary-600 px-6 py-3 text-center font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-secondary-300 focus:border-primary-500"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-secondary-400 hover:text-secondary-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
          )}
          <p className="mt-2 text-xs text-secondary-500">
            Must be at least 8 characters with uppercase, lowercase, and a number
          </p>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm new password"
              autoComplete="new-password"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-secondary-300 focus:border-primary-500"
              }`}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-secondary-400 hover:text-secondary-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
          loadingText="Resetting password..."
        >
          Reset password
        </Button>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Loading..." subtitle="Please wait">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AuthLayout>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
