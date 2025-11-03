"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary-50 px-4">
      <div className="text-center">
        {/* Error Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-danger-100">
            <AlertTriangle className="h-16 w-16 text-danger-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="mb-4 text-4xl font-bold text-secondary-900">
          Oops! Something went wrong
        </h1>
        <p className="mb-8 max-w-md text-secondary-600">
          We encountered an unexpected error. Don't worry, our team has been
          notified and we're working on fixing it.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button variant="primary" size="lg" onClick={reset}>
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </a>
          </Button>
        </div>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-12 rounded-lg border border-danger-200 bg-danger-50 p-6 text-left">
            <p className="mb-2 font-medium text-danger-900">
              Error Details (Development Mode):
            </p>
            <pre className="overflow-x-auto text-xs text-danger-800">
              {error.message}
            </pre>
            {error.digest && (
              <p className="mt-2 text-xs text-danger-700">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
