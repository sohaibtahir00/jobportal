"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input, Button, useToast } from "@/components/ui";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const emailValue = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
    } catch (error) {
      showToast("error", "Request failed", "There was a problem sending the reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent you a password reset link"
      >
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
            <CheckCircle2 className="h-8 w-8 text-success-600" />
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <p className="text-secondary-700">
              We've sent a password reset link to
            </p>
            <p className="mt-1 font-medium text-secondary-900">{emailValue}</p>
          </div>

          {/* Instructions */}
          <div className="mb-8 rounded-lg bg-secondary-50 p-4 text-left">
            <p className="mb-2 font-medium text-secondary-900">Next steps:</p>
            <ol className="list-inside list-decimal space-y-2 text-sm text-secondary-700">
              <li>Check your email inbox for the reset link</li>
              <li>Click the link to reset your password</li>
              <li>Create a new strong password</li>
              <li>Sign in with your new password</li>
            </ol>
          </div>

          {/* Resend Link */}
          <div className="mb-6">
            <p className="text-sm text-secondary-600">
              Didn't receive the email?{" "}
              <button
                onClick={() => setIsSuccess(false)}
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Resend
              </button>
            </p>
          </div>

          {/* Back to Login */}
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Input */}
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          helperText="Enter the email address associated with your account"
          required
          {...register("email")}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
          loadingText="Sending reset link..."
        >
          Send reset link
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

      {/* Help Text */}
      <div className="mt-8 rounded-lg border border-secondary-200 bg-secondary-50 p-4">
        <p className="mb-2 text-sm font-medium text-secondary-900">
          Need help?
        </p>
        <p className="text-sm text-secondary-600">
          If you're having trouble resetting your password, please{" "}
          <Link
            href="/about"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            contact support
          </Link>{" "}
          for assistance.
        </p>
      </div>
    </AuthLayout>
  );
}
