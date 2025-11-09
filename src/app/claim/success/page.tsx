"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  Users,
  ArrowRight,
  Download,
  MessageSquare,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function ClaimSuccessPage() {
  // Mock data - would come from URL params or session
  const claimData = {
    jobTitle: "Senior Machine Learning Engineer",
    applicantCount: 23,
    verifiedCount: 18,
    company: "TechCorp AI",
    contactEmail: "hiring@techcorp.ai",
    contactPhone: "+1 (555) 123-4567",
  };

  const nextSteps = [
    {
      icon: Mail,
      title: "Check Your Email",
      description: "We've sent confirmation and next steps to your inbox",
      time: "Immediate",
    },
    {
      icon: Phone,
      title: "Expect Our Call",
      description: "Our team will call you within 24 hours to discuss candidates",
      time: "Within 24 hours",
    },
    {
      icon: Users,
      title: "Review Candidate Profiles",
      description: "Access full profiles with Skills Score Cards in your dashboard",
      time: "Now available",
    },
    {
      icon: Calendar,
      title: "Schedule Interviews",
      description: "We'll help coordinate interviews with your top picks",
      time: "This week",
    },
  ];

  const benefits = [
    "Full access to all {applicantCount} candidate profiles",
    "Skills Score Cards with detailed breakdowns",
    "Direct contact information for verified candidates",
    "Personal candidate matching consultation",
    "Interview coordination support",
    "90-day replacement guarantee",
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Success Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
              <CheckCircle2 className="h-10 w-10 text-success-600" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-secondary-900">
              Job Claimed Successfully!
            </h1>
            <p className="text-xl text-secondary-600">
              You now have access to {claimData.verifiedCount} skills-verified
              candidates for your {claimData.jobTitle} role
            </p>
          </div>

          {/* Confirmation Details */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-secondary-900">
                    {claimData.jobTitle}
                  </h2>
                  <p className="text-secondary-600">{claimData.company}</p>
                </div>
                <Badge variant="success" size="lg">
                  Active
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-primary-50 p-4">
                  <p className="mb-1 text-sm text-secondary-600">
                    Total Applicants
                  </p>
                  <p className="text-3xl font-bold text-primary-600">
                    {claimData.applicantCount}
                  </p>
                </div>
                <div className="rounded-lg bg-success-50 p-4">
                  <p className="mb-1 text-sm text-secondary-600">
                    Skills Verified
                  </p>
                  <p className="text-3xl font-bold text-success-600">
                    {claimData.verifiedCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What You Get */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="mb-6 text-2xl font-bold text-secondary-900">
                What You Get
              </h3>
              <div className="space-y-3">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600" />
                    <p className="text-secondary-700">
                      {benefit.replace(
                        "{applicantCount}",
                        claimData.applicantCount.toString()
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="mb-6 text-2xl font-bold text-secondary-900">
                What Happens Next
              </h3>

              <div className="space-y-6">
                {nextSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-3">
                          <h4 className="font-bold text-secondary-900">
                            {step.title}
                          </h4>
                          <Badge variant="secondary" size="sm">
                            {step.time}
                          </Badge>
                        </div>
                        <p className="text-sm text-secondary-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="mb-8 bg-gradient-to-br from-primary-50 to-accent-50">
            <CardContent className="p-8">
              <h3 className="mb-4 text-xl font-bold text-secondary-900">
                We'll Contact You At
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary-600" />
                  <span className="text-secondary-900">
                    {claimData.contactEmail}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary-600" />
                  <span className="text-secondary-900">
                    {claimData.contactPhone}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-white p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600" />
                  <div className="text-sm text-secondary-700">
                    <p className="font-semibold">Questions?</p>
                    <p className="mt-1">
                      Email us at{" "}
                      <a
                        href="mailto:support@jobportal.com"
                        className="text-primary-600 hover:underline"
                      >
                        support@jobportal.com
                      </a>{" "}
                      or call{" "}
                      <a
                        href="tel:+15551234567"
                        className="text-primary-600 hover:underline"
                      >
                        (555) 123-4567
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button variant="primary" size="lg" className="w-full" asChild>
              <Link href="/employer/applicants">
                <Users className="mr-2 h-5 w-5" />
                View All Candidates
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/employer/dashboard">
                Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Download Confirmation
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 rounded-lg bg-yellow-50 p-6">
            <h4 className="mb-2 font-bold text-yellow-900">
              Important Reminder
            </h4>
            <p className="text-sm text-yellow-800">
              <strong>No upfront payment required.</strong> You only pay our
              success fee (15-20% of first-year salary) after you successfully
              hire a candidate. Our team will discuss pricing details during your
              consultation call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
