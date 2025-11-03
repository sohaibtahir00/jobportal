import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using our job portal.",
};

export default function TermsPage() {
  return (
    <div className="bg-secondary-50 py-12">
      <div className="container">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-secondary-900">
            Terms of Service
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600">
            Last updated: January 2025
          </p>
        </div>

        {/* Content */}
        <Card className="mx-auto max-w-4xl">
          <CardContent className="prose prose-secondary max-w-none p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-secondary-900">
              Introduction
            </h2>
            <p className="text-secondary-700">
              This is a demo job portal application. These terms of service are
              a placeholder for when the application is deployed in production.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              Acceptance of Terms
            </h2>
            <p className="text-secondary-700">
              By accessing and using this job portal, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              Use of Service
            </h2>
            <p className="text-secondary-700">
              This platform is intended for:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-secondary-700">
              <li>Job seekers looking for AI/ML and tech opportunities</li>
              <li>Employers posting legitimate job openings</li>
              <li>Professional networking and career advancement</li>
              <li>Lawful purposes only</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              User Accounts
            </h2>
            <p className="text-secondary-700">
              When you create an account, you are responsible for maintaining
              the security of your account and password. You are fully
              responsible for all activities that occur under your account.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              Prohibited Activities
            </h2>
            <p className="text-secondary-700">
              You may not use this service to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-secondary-700">
              <li>Post false or misleading job listings</li>
              <li>Spam or harass other users</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to the platform</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              Intellectual Property
            </h2>
            <p className="text-secondary-700">
              The service and its original content, features, and functionality
              are owned by the platform and are protected by international
              copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              Termination
            </h2>
            <p className="text-secondary-700">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason, including breach of
              these Terms.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              Limitation of Liability
            </h2>
            <p className="text-secondary-700">
              In no event shall the platform be liable for any indirect,
              incidental, special, consequential or punitive damages resulting
              from your use of the service.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              Contact Us
            </h2>
            <p className="text-secondary-700">
              If you have questions about these terms, please contact us at
              legal@example.com
            </p>

            <div className="mt-8 rounded-lg bg-secondary-50 p-6">
              <p className="text-sm text-secondary-600">
                <strong>Note:</strong> This is a demo application. In
                production, these terms would be drafted by legal counsel and
                tailored to the specific business model and jurisdiction.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
