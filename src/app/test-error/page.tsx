"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import ErrorBoundary from "@/components/ErrorBoundary";

// Component that throws an error when button is clicked
function ErrorThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("This is a test error thrown by the ErrorThrowingComponent!");
  }

  return (
    <div className="rounded-lg border border-secondary-200 bg-white p-6">
      <h2 className="mb-2 text-lg font-semibold text-secondary-900">
        Component is working correctly
      </h2>
      <p className="text-secondary-600">
        Click the button below to trigger an error and see the error boundary in action.
      </p>
    </div>
  );
}

export default function TestErrorPage() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [key, setKey] = useState(0);

  const handleTriggerError = () => {
    setShouldThrow(true);
  };

  const handleReset = () => {
    setShouldThrow(false);
    setKey((prev) => prev + 1); // Force remount
  };

  return (
    <div className="bg-secondary-50 py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-secondary-900">
            Error Boundary Test Page
          </h1>
          <p className="text-secondary-600">
            This page demonstrates how the error boundary catches and handles errors
            in React components. This page is for development testing only.
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
            <h3 className="mb-2 font-semibold text-primary-900">How it works:</h3>
            <ul className="space-y-1 text-sm text-primary-800">
              <li>• Click "Trigger Error" to make the component throw an error</li>
              <li>• The error boundary will catch it and display a friendly error UI</li>
              <li>• In development, you'll see detailed error information</li>
              <li>• In production, technical details are hidden from users</li>
              <li>• Users can reload, try again, or go home</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" onClick={handleTriggerError}>
              Trigger Error
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset Component
            </Button>
          </div>
        </div>

        {/* Component wrapped in error boundary */}
        <ErrorBoundary key={key}>
          <ErrorThrowingComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>

        <div className="mt-8 rounded-lg border border-secondary-200 bg-white p-6">
          <h3 className="mb-3 font-semibold text-secondary-900">
            Error Boundary Locations:
          </h3>
          <ul className="space-y-2 text-sm text-secondary-700">
            <li>
              <strong>Root Layout:</strong> Wraps entire application in{" "}
              <code className="rounded bg-secondary-100 px-1 py-0.5 text-xs">
                src/app/layout.tsx
              </code>
            </li>
            <li>
              <strong>Dashboard Layout:</strong> Wraps dashboard content in{" "}
              <code className="rounded bg-secondary-100 px-1 py-0.5 text-xs">
                src/app/(dashboard)/layout.tsx
              </code>
            </li>
            <li>
              <strong>Job Detail Page:</strong> Wraps job detail content in{" "}
              <code className="rounded bg-secondary-100 px-1 py-0.5 text-xs">
                src/app/jobs/[id]/page.tsx
              </code>
            </li>
          </ul>
        </div>

        <div className="mt-6 rounded-lg border border-warning-200 bg-warning-50 p-4">
          <p className="text-sm text-warning-800">
            <strong>Note:</strong> This test page should be removed or protected in
            production. It's only meant for development testing.
          </p>
        </div>
      </div>
    </div>
  );
}
