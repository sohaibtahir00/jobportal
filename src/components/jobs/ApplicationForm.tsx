"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  Button,
  Input,
  useToast,
} from "@/components/ui";
import {
  jobApplicationSchema,
  JobApplicationFormData,
} from "@/lib/validations";

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  companyName: string;
}

export function ApplicationForm({
  isOpen,
  onClose,
  jobTitle,
  companyName,
}: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("resumeFile", file);
    }
  };

  const onSubmit = async (data: JobApplicationFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log the application data
      console.log("Application submitted:", {
        jobTitle,
        companyName,
        ...data,
        resumeFileName: fileName,
      });

      setIsSuccess(true);
      showToast("success", "Application submitted!", `Your application for ${jobTitle} has been sent.`);

      // Reset form after 3 seconds and close
      setTimeout(() => {
        reset();
        setFileName("");
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      showToast("error", "Submission failed", "There was a problem submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setFileName("");
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent showClose onClose={handleClose} className="max-w-2xl">
        {isSuccess ? (
          // Success State
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
              <CheckCircle2 className="h-12 w-12 text-success-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-secondary-900">
              Application Submitted!
            </h2>
            <p className="text-lg text-secondary-600">
              Your application for <strong>{jobTitle}</strong> at{" "}
              <strong>{companyName}</strong> has been received.
            </p>
            <p className="mt-4 text-sm text-secondary-500">
              We'll review your application and get back to you soon.
            </p>
          </div>
        ) : (
          // Application Form
          <>
            <DialogHeader>
              <DialogTitle>Apply for {jobTitle}</DialogTitle>
              <p className="text-sm text-secondary-600">{companyName}</p>
            </DialogHeader>

            <DialogBody>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.fullName?.message}
                  required
                  {...register("fullName")}
                />

                {/* Email */}
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john.doe@example.com"
                  error={errors.email?.message}
                  required
                  {...register("email")}
                />

                {/* Phone */}
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  helperText="Optional"
                  error={errors.phone?.message}
                  {...register("phone")}
                />

                {/* Resume Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Resume / CV
                    <span className="ml-1 text-danger-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-secondary-300 bg-secondary-50 transition-colors hover:border-primary-600 hover:bg-primary-50"
                    >
                      <Upload className="mb-2 h-8 w-8 text-secondary-400" />
                      {fileName ? (
                        <span className="text-sm font-medium text-secondary-900">
                          {fileName}
                        </span>
                      ) : (
                        <>
                          <span className="text-sm font-medium text-secondary-700">
                            Click to upload resume
                          </span>
                          <span className="mt-1 text-xs text-secondary-500">
                            PDF, DOC, or DOCX (max 5MB)
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                  {errors.resumeFile?.message && (
                    <p className="mt-1.5 text-xs text-danger-600">
                      {errors.resumeFile.message as string}
                    </p>
                  )}
                </div>

                {/* LinkedIn URL */}
                <Input
                  label="LinkedIn Profile"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  helperText="Optional"
                  error={errors.linkedinUrl?.message}
                  {...register("linkedinUrl")}
                />

                {/* Cover Letter */}
                <div>
                  <label
                    htmlFor="coverLetter"
                    className="mb-2 block text-sm font-medium text-secondary-700"
                  >
                    Cover Letter
                    <span className="ml-1 text-danger-600">*</span>
                  </label>
                  <textarea
                    id="coverLetter"
                    rows={5}
                    placeholder="Tell us about your background and why you're interested in this position..."
                    className="w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm ring-offset-white transition-colors placeholder:text-secondary-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                    {...register("coverLetter")}
                  />
                  {errors.coverLetter?.message ? (
                    <p className="mt-1.5 text-xs text-danger-600">
                      {errors.coverLetter.message}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-secondary-500">
                      Minimum 50 characters
                    </p>
                  )}
                </div>

                {/* Why Good Fit */}
                <div>
                  <label
                    htmlFor="whyGoodFit"
                    className="mb-2 block text-sm font-medium text-secondary-700"
                  >
                    Why are you a good fit for this role?
                    <span className="ml-1 text-danger-600">*</span>
                  </label>
                  <textarea
                    id="whyGoodFit"
                    rows={4}
                    placeholder="Highlight your relevant skills, experience, and what makes you uniquely qualified..."
                    className="w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm ring-offset-white transition-colors placeholder:text-secondary-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                    {...register("whyGoodFit")}
                  />
                  {errors.whyGoodFit?.message ? (
                    <p className="mt-1.5 text-xs text-danger-600">
                      {errors.whyGoodFit.message}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-secondary-500">
                      Minimum 50 characters
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 border-t border-secondary-200 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </DialogBody>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
