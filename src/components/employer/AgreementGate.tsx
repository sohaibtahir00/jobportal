"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, FileText } from "lucide-react";
import { useServiceAgreement } from "@/hooks/useServiceAgreement";

interface AgreementGateProps {
  children: React.ReactNode;
}

/**
 * AgreementGate Component
 * Wraps protected employer pages that require a signed service agreement.
 * Redirects to /employer/agreement if the employer hasn't signed.
 *
 * Usage:
 * ```tsx
 * export default function ProtectedPage() {
 *   return (
 *     <AgreementGate>
 *       <YourPageContent />
 *     </AgreementGate>
 *   );
 * }
 * ```
 */
export function AgreementGate({ children }: AgreementGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: agreementStatus, isLoading, isError } = useServiceAgreement();

  useEffect(() => {
    // Skip if still loading or if there's an error (let the page handle errors)
    if (isLoading || isError) return;

    // If employer hasn't signed the agreement, redirect to agreement page
    if (agreementStatus && !agreementStatus.hasSigned) {
      const redirectUrl = encodeURIComponent(pathname);
      router.push(`/employer/agreement?redirect=${redirectUrl}`);
    }
  }, [agreementStatus, isLoading, isError, pathname, router]);

  // Show loading state while checking agreement status
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600 mb-4" />
        <p className="text-secondary-600">Checking access permissions...</p>
      </div>
    );
  }

  // If agreement hasn't been signed, show a brief message while redirecting
  if (agreementStatus && !agreementStatus.hasSigned) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-secondary-900 mb-2">
          Service Agreement Required
        </h2>
        <p className="text-secondary-600 text-center max-w-md">
          Please sign our service agreement to access this feature.
          Redirecting...
        </p>
      </div>
    );
  }

  // Agreement is signed or there was an error (let child handle errors)
  return <>{children}</>;
}

export default AgreementGate;
