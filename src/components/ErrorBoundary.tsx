"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error("Error Boundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send error to error reporting service (e.g., Sentry)
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      const isDevelopment = process.env.NODE_ENV === "development";

      return (
        <div className="flex min-h-screen items-center justify-center bg-secondary-50 px-4 py-12">
          <div className="w-full max-w-2xl">
            {/* Error Card */}
            <div className="rounded-lg border border-danger-200 bg-white p-8 shadow-sm">
              {/* Icon and Title */}
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-100">
                  <AlertCircle className="h-8 w-8 text-danger-600" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-secondary-900">
                  Something went wrong
                </h1>
                <p className="text-secondary-600">
                  We're sorry for the inconvenience. An unexpected error has
                  occurred.
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {isDevelopment && this.state.error && (
                <div className="mb-6 rounded-md bg-secondary-50 p-4">
                  <h2 className="mb-2 text-sm font-semibold text-secondary-900">
                    Error Details (Development Only)
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-secondary-700">
                        Error Message:
                      </p>
                      <p className="mt-1 text-xs text-danger-600">
                        {this.state.error.toString()}
                      </p>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <p className="text-xs font-medium text-secondary-700">
                          Component Stack:
                        </p>
                        <pre className="mt-1 max-h-48 overflow-auto rounded bg-secondary-900 p-2 text-xs text-white">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={this.handleReload}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:from-primary-700 hover:to-accent-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </button>
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-secondary-300 bg-white px-6 py-2.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-secondary-300 bg-white px-6 py-2.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Link>
              </div>

              {/* Help Text */}
              <div className="mt-6 rounded-md border border-secondary-200 bg-secondary-50 p-4">
                <p className="text-xs text-secondary-600">
                  <strong>What you can do:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-xs text-secondary-600">
                  <li>• Try reloading the page</li>
                  <li>• Clear your browser cache and cookies</li>
                  <li>• Return to the home page and try again</li>
                  <li>
                    • If the problem persists, please contact support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
