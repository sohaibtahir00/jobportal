"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, CheckCircle2, Loader2, FileText, X, TrendingUp, Zap, Award, Target } from "lucide-react";
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
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      showToast("error", "Invalid file type", "Please upload PDF or DOC files only");
      e.target.value = ""; // Reset input
      return;
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast("error", "File too large", "File size must be less than 5MB");
      e.target.value = ""; // Reset input
      return;
    }

    // File is valid - simulate upload progress
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20;
      });
    }, 100);

    // Set file and update form
    setResumeFile(file);
    setValue("resumeFile", file);
    showToast("success", "Resume uploaded", `${file.name} uploaded successfully`);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setUploadProgress(0);
    setValue("resumeFile", undefined);
    // Reset the file input
    const fileInput = document.getElementById("resume-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: JobApplicationFormData) => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
      showToast("success", "Application submitted!", `Your application for ${jobTitle} has been sent.`);

      // Reset form after 3 seconds and close
      setTimeout(() => {
        reset();
        setResumeFile(null);
        setUploadProgress(0);
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
      setResumeFile(null);
      setUploadProgress(0);
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent showClose onClose={handleClose} className="max-w-2xl">
        {isSuccess ? (
          // Post-Application Success Screen
          <div className="max-h-[80vh] overflow-y-auto py-8">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                  <CheckCircle2 className="h-10 w-10 text-success-600" />
                </div>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-secondary-900">
                Application submitted! ✓
              </h2>
              <p className="mb-8 text-secondary-600">
                Your application for <strong>{jobTitle}</strong> at <strong>{companyName}</strong> has been received.
              </p>
            </div>

            {/* Main Pitch */}
            <div className="mb-8 rounded-lg bg-gradient-to-br from-primary-50 to-accent-50 p-6 text-center">
              <h3 className="mb-2 text-xl font-bold text-secondary-900">
                Want to stand out from other candidates?
              </h3>
              <p className="text-lg font-semibold text-primary-700">
                Take our 60-minute Skills Assessment
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-primary-200 bg-white p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Priority Review</h4>
                  <p className="text-sm text-secondary-600">Your application goes to the top of employer's lists</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-primary-200 bg-white p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-100">
                  <Zap className="h-5 w-5 text-accent-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Exclusive Jobs</h4>
                  <p className="text-sm text-secondary-600">Unlock 250+ jobs only available to verified candidates (25% more roles)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-success-200 bg-white p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-success-100">
                  <Award className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Higher Salary</h4>
                  <p className="text-sm text-secondary-600">Verified candidates earn 18% more on average</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-secondary-200 bg-white p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary-100">
                  <Target className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Know Your Level</h4>
                  <p className="text-sm text-secondary-600">See your percentile ranking vs. other candidates</p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mb-8 rounded-lg bg-secondary-50 p-6 text-center">
              <p className="text-lg font-semibold text-secondary-900">
                Candidates with test scores get reviewed <span className="text-primary-600">5x faster</span> and are{" "}
                <span className="text-success-600">3x more likely</span> to get interviews.
              </p>
            </div>

            {/* Reassurance */}
            <p className="mb-8 text-center text-sm text-secondary-600">
              Don't worry - your application is already submitted. The assessment is optional but recommended.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/skills-assessment")}
                className="flex-1 sm:flex-initial"
              >
                Take Assessment Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleClose}
                className="flex-1 sm:flex-initial"
              >
                Maybe Later
              </Button>
            </div>
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

                  {!resumeFile ? (
                    // Upload Area
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
                        <span className="text-sm font-medium text-secondary-700">
                          Click to upload resume
                        </span>
                        <span className="mt-1 text-xs text-secondary-500">
                          PDF, DOC, or DOCX (max 5MB)
                        </span>
                      </label>
                    </div>
                  ) : (
                    // File Preview
                    <div className="rounded-md border border-secondary-300 bg-white p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-100">
                            <FileText className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary-900 truncate">
                              {resumeFile.name}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {formatFileSize(resumeFile.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-secondary-400 transition-colors hover:bg-secondary-100 hover:text-secondary-600"
                          aria-label="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Upload Progress Bar */}
                      {uploadProgress < 100 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-secondary-600">Uploading...</span>
                            <span className="text-xs text-secondary-600">{uploadProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-secondary-200 overflow-hidden">
                            <div
                              className="h-full bg-primary-600 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Upload Complete */}
                      {uploadProgress === 100 && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-success-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Upload complete</span>
                        </div>
                      )}
                    </div>
                  )}

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
                    loading={isSubmitting}
                    loadingText="Submitting..."
                    className="min-w-[120px]"
                  >
                    Submit Application
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
