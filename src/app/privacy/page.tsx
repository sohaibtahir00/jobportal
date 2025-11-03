import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy and how we handle your data.",
};

export default function PrivacyPage() {
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
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-secondary-900">
            Privacy Policy
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
              This is a demo job portal application. This privacy policy page is
              a placeholder for when the application is deployed in production.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              Information We Collect
            </h2>
            <p className="text-secondary-700">
              When this application is in production, we will collect and
              process personal information in accordance with applicable data
              protection laws including GDPR and CCPA.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              How We Use Your Information
            </h2>
            <p className="text-secondary-700">
              Your information will be used to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-secondary-700">
              <li>Provide and maintain our job portal services</li>
              <li>Match candidates with relevant job opportunities</li>
              <li>Communicate with you about jobs and updates</li>
              <li>Improve our platform and user experience</li>
              <li>Ensure security and prevent fraud</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              Data Security
            </h2>
            <p className="text-secondary-700">
              We implement industry-standard security measures to protect your
              personal information from unauthorized access, disclosure,
              alteration, or destruction.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              Your Rights
            </h2>
            <p className="text-secondary-700">
              You have the right to access, correct, delete, or export your
              personal data. Contact us to exercise these rights.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-secondary-900">
              Contact Us
            </h2>
            <p className="text-secondary-700">
              If you have questions about this privacy policy, please contact us
              at privacy@example.com
            </p>

            <div className="mt-8 rounded-lg bg-secondary-50 p-6">
              <p className="text-sm text-secondary-600">
                <strong>Note:</strong> This is a demo application. In
                production, this page would contain a comprehensive privacy
                policy drafted by legal counsel and compliant with all
                applicable laws.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
