"use client";

import { useState } from "react";
import { useSubmitApplication } from "@/hooks/useApplications";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui";

interface ApplicationFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  jobTitle?: string;
  companyName?: string;
  jobId?: string;
}

export default function ApplicationForm(props: ApplicationFormProps) {
  const { data: session } = useSession();
  const [coverLetter, setCoverLetter] = useState("");
  const [availability, setAvailability] = useState("");
  const submitApplication = useSubmitApplication();

  if (!props.isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!props.jobId) {
      alert("Job ID is missing");
      return;
    }

    if (!session) {
      alert("Please login to apply");
      return;
    }

    try {
      await submitApplication.mutateAsync({
        jobId: props.jobId,
        coverLetter: coverLetter || undefined,
        availability: availability || undefined,
      });

      // Success - show message and close after delay
      setTimeout(() => {
        props.onClose?.();
        setCoverLetter("");
        setAvailability("");
      }, 2000);
    } catch (error: any) {
      console.error("Application submission failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-2">Apply for {props.jobTitle}</h2>
          <p className="text-secondary-600 mb-6">at {props.companyName}</p>

          {submitApplication.isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                Application Submitted!
              </h3>
              <p className="text-secondary-600 text-center">
                Your application has been sent to the employer. Good luck!
              </p>
            </div>
          ) : submitApplication.isError ? (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-red-900 mb-2">
                Application Failed
              </h3>
              <p className="text-red-700 text-center mb-4">
                {(submitApplication.error as any)?.response?.data?.message ||
                  "Failed to submit application. Please try again."}
              </p>
              <Button
                variant="outline"
                onClick={() => submitApplication.reset()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Cover Letter <span className="text-secondary-500">(Optional)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell the employer why you're a great fit for this role..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Availability <span className="text-secondary-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Immediate, 2 weeks notice, etc."
                />
              </div>

              <div className="bg-secondary-50 p-4 rounded-lg">
                <p className="text-sm text-secondary-700">
                  <strong>Note:</strong> Your resume and profile information will be automatically included with this application.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={props.onClose}
                  disabled={submitApplication.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitApplication.isPending}
                  className="min-w-[120px]"
                >
                  {submitApplication.isPending ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
