"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

interface ApplicationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  niche: string;
}

export function ApplicationSuccessModal({
  isOpen,
  onClose,
  jobTitle,
  niche,
}: ApplicationSuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleTakeAssessment = () => {
    router.push("/skills-assessment");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-[600px] w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          {/* Success Checkmark */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-center text-2xl font-bold mb-6">
            Application Submitted! ✓
          </h2>

          {/* Call to Action */}
          <div className="my-6 text-center">
            <h3 className="text-xl font-semibold mb-4">
              Want to stand out from other candidates?
            </h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <h4 className="font-bold text-lg mb-3">
                Take our 60-minute {niche} Skills Assessment
              </h4>

              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Show your technical abilities</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Get priority review (top of employer&apos;s inbox)</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Unlock 250+ exclusive jobs (25% more roles)</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>See your skill percentile vs. other candidates</span>
                </li>
              </ul>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleTakeAssessment}
                  variant="primary"
                  className="flex-1"
                  size="lg"
                >
                  Take Assessment Now
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Maybe Later
                </Button>
              </div>
            </div>

            {/* Reassurance Text */}
            <div className="mt-6 text-sm text-secondary-600 space-y-2">
              <p className="font-medium text-secondary-900">
                Don&apos;t worry - your application is already submitted.
              </p>
              <p>The assessment is optional but recommended.</p>
              <p className="font-semibold text-secondary-800">
                Candidates with test scores get reviewed 5x faster and are 3x
                more likely to get interviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
