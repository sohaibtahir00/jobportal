"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Phone, Globe, CheckCircle, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui";
import { useSession } from "next-auth/react";
import api from "@/lib/api";

const employerOnboardingSchema = z.object({
  companyWebsite: z
    .string()
    .url("Please enter a valid URL (e.g., https://example.com)")
    .min(1, "Company website is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
});

type EmployerOnboardingData = z.infer<typeof employerOnboardingSchema>;

export default function EmployerOnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployerOnboardingData>({
    resolver: zodResolver(employerOnboardingSchema),
  });

  const onSubmit = async (data: EmployerOnboardingData) => {
    setIsSubmitting(true);

    try {
      // Update employer profile via backend
      await api.patch("/api/employers/profile", {
        companyWebsite: data.companyWebsite,
        phone: data.phone,
      });

      showToast(
        "success",
        "Profile completed!",
        "Now let's complete your company settings."
      );

      // Redirect to employer settings to complete full profile
      router.push("/employer/settings");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      showToast(
        "error",
        "Failed to complete profile",
        error.response?.data?.error || "Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Company Profile
          </h1>
          <p className="text-gray-600">
            Help candidates learn more about your company
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step 2 of 2</span>
            <span>Almost there!</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full w-full"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Website <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://www.yourcompany.com"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                  errors.companyWebsite
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary-500"
                }`}
                {...register("companyWebsite")}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <Globe className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {errors.companyWebsite && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                {errors.companyWebsite.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Candidates will use this to learn more about your company
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+1234567890"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary-500"
                }`}
                {...register("phone")}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                {errors.phone.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              We'll use this for account-related communications
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Next steps:</strong> After completing your profile, you can post jobs,
              review applications, and access our skills-verified candidate pool.
            </p>
          </div>

          {/* Benefits Preview */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 space-y-3">
            <p className="font-semibold text-gray-900 mb-3">
              What you'll get access to:
            </p>
            <div className="space-y-2">
              {[
                "Post unlimited job listings",
                "Access to skills-verified candidates",
                "Application tracking system",
                "Direct messaging with candidates",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Saving profile...
              </span>
            ) : (
              "Complete Profile & Continue"
            )}
          </button>

          {/* Skip Link */}
          <button
            type="button"
            onClick={() => {
              // Mark onboarding as skipped in localStorage
              localStorage.setItem("employer_onboarding_skipped", "true");
              router.push("/employer/dashboard");
            }}
            className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
            disabled={isSubmitting}
          >
            Skip for now (you can complete this later)
          </button>
        </form>
      </motion.div>
    </div>
  );
}
