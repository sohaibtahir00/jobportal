"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Phone, Briefcase, TrendingUp, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui";
import { useSession } from "next-auth/react";
import api from "@/lib/api";

const candidateOnboardingSchema = z.object({
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  currentRole: z
    .string()
    .min(2, "Current role must be at least 2 characters")
    .max(100, "Current role must not exceed 100 characters"),
  experience: z.enum(["0-1", "1-3", "3-5", "5-10", "10+"], {
    message: "Please select your years of experience",
  }),
});

type CandidateOnboardingData = z.infer<typeof candidateOnboardingSchema>;

const experienceOptions = [
  { value: "0-1", label: "0-1 years", description: "Entry level" },
  { value: "1-3", label: "1-3 years", description: "Junior" },
  { value: "3-5", label: "3-5 years", description: "Mid-level" },
  { value: "5-10", label: "5-10 years", description: "Senior" },
  { value: "10+", label: "10+ years", description: "Expert/Lead" },
];

export default function CandidateOnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CandidateOnboardingData>({
    resolver: zodResolver(candidateOnboardingSchema),
  });

  const selectedExperience = watch("experience");

  const onSubmit = async (data: CandidateOnboardingData) => {
    setIsSubmitting(true);

    try {
      // Convert experience range to numeric value (use midpoint)
      const experienceMap: Record<string, number> = {
        "0-1": 0,
        "1-3": 2,
        "3-5": 4,
        "5-10": 7,
        "10+": 12,
      };

      // Update candidate profile via backend
      await api.patch("/api/candidates/profile", {
        phone: data.phone || undefined,
        currentRole: data.currentRole,
        experience: experienceMap[data.experience],
      });

      showToast(
        "success",
        "Profile completed!",
        "Welcome to your dashboard."
      );

      // Redirect to profile page
      router.push("/candidate/profile");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Just a few more details to personalize your job search
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
          {/* Phone (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
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
              We'll use this for important job updates
            </p>
          </div>

          {/* Current Role/Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Role/Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., Machine Learning Engineer, Data Scientist"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                  errors.currentRole
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary-500"
                }`}
                {...register("currentRole")}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <Briefcase className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {errors.currentRole && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                {errors.currentRole.message}
              </p>
            )}
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experienceOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${
                    selectedExperience === option.value
                      ? "border-primary-600 bg-primary-50 ring-2 ring-primary-500/20"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    className="sr-only"
                    {...register("experience")}
                  />
                  <div className="flex items-center gap-3">
                    <TrendingUp
                      className={`w-5 h-5 ${
                        selectedExperience === option.value
                          ? "text-primary-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1">
                      <span
                        className={`font-semibold ${
                          selectedExperience === option.value
                            ? "text-primary-900"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.experience && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Why we ask:</strong> This helps us recommend the most relevant jobs and
              match you with employers looking for your level of expertise.
            </p>
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
              localStorage.setItem("candidate_onboarding_skipped", "true");
              router.push("/candidate/dashboard");
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
