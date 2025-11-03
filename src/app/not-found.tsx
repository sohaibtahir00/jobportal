import Link from "next/link";
import { FileQuestion, Home, Search } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary-50 px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary-100">
              <FileQuestion className="h-16 w-16 text-primary-600" />
            </div>
            <div className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
              <span className="text-xl font-bold text-accent-600">?</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="mb-4 text-6xl font-bold text-secondary-900">404</h1>
        <h2 className="mb-2 text-2xl font-semibold text-secondary-900">
          Page Not Found
        </h2>
        <p className="mb-8 text-secondary-600">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button variant="primary" size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/jobs">
              <Search className="mr-2 h-5 w-5" />
              Browse Jobs
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-12 rounded-lg border border-secondary-200 bg-white p-6 text-left">
          <p className="mb-2 font-medium text-secondary-900">
            Looking for something specific?
          </p>
          <ul className="space-y-2 text-sm text-secondary-600">
            <li>
              • <Link href="/jobs" className="text-primary-600 hover:underline">Browse job listings</Link>
            </li>
            <li>
              • <Link href="/employers" className="text-primary-600 hover:underline">Learn about posting jobs</Link>
            </li>
            <li>
              • <Link href="/candidate/dashboard" className="text-primary-600 hover:underline">Go to your dashboard</Link>
            </li>
            <li>
              • <Link href="/" className="text-primary-600 hover:underline">Return to homepage</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
