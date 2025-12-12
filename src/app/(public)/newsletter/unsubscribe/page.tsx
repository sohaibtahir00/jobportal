"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      setMessage("Invalid unsubscribe link. No token provided.");
      return;
    }

    const unsubscribe = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter?token=${token}`,
          { method: "DELETE" }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to unsubscribe");
        }

        setStatus("success");
        setMessage(data.message || "You have been successfully unsubscribed from our newsletter.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "An error occurred while unsubscribing. Please try again."
        );
      }
    };

    unsubscribe();
  }, [token]);

  return (
    <div className="max-w-md w-full text-center">
      {status === "loading" && (
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Processing...
          </h1>
          <p className="text-secondary-600">
            Please wait while we process your unsubscribe request.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-success-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Unsubscribed Successfully
          </h1>
          <p className="text-secondary-600">{message}</p>
          <p className="text-sm text-secondary-500">
            We&apos;re sorry to see you go. You can always resubscribe from our homepage.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white font-medium hover:from-primary-700 hover:to-accent-700 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-error-100 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-error-600" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Unsubscribe Failed
          </h1>
          <p className="text-secondary-600">{message}</p>
          <div className="pt-4 space-y-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white font-medium hover:from-primary-700 hover:to-accent-700 transition-colors"
            >
              Return to Homepage
            </Link>
            <p className="text-sm text-secondary-500">
              If you continue to have issues, please{" "}
              <Link href="/contact" className="text-primary-600 hover:underline">
                contact support
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      {status === "no-token" && (
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-warning-100 flex items-center justify-center">
            <Mail className="w-8 h-8 text-warning-600" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Invalid Link
          </h1>
          <p className="text-secondary-600">{message}</p>
          <p className="text-sm text-secondary-500">
            Please use the unsubscribe link from your newsletter email.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white font-medium hover:from-primary-700 hover:to-accent-700 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-md w-full text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
      <h1 className="text-2xl font-bold text-secondary-900">
        Loading...
      </h1>
      <p className="text-secondary-600">
        Please wait...
      </p>
    </div>
  );
}

export default function NewsletterUnsubscribePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Suspense fallback={<LoadingFallback />}>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
