"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Users,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Share2,
  Bookmark,
} from "lucide-react";
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { getJobDetails } from "@/lib/job-details";
import { mockJobs } from "@/lib/mock-jobs";
import { formatCurrency } from "@/lib/utils";
import { JobCard } from "@/components/jobs/JobCard";
import { ApplicationForm } from "@/components/jobs/ApplicationForm";
import { getJobById } from "@/lib/mockData";
import { generateJobPostingJsonLd } from "@/lib/seo";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = parseInt(params.id as string);
  const job = getJobDetails(jobId);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [jsonLd, setJsonLd] = useState<Record<string, unknown> | null>(null);

  // Generate JSON-LD structured data for the job
  useEffect(() => {
    const jobData = getJobById(`job-${jobId}`);
    if (jobData) {
      const structuredData = generateJobPostingJsonLd(jobData);
      setJsonLd(structuredData);
    }
  }, [jobId]);

  if (!job) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-secondary-900">
            Job Not Found
          </h1>
          <p className="mb-8 text-lg text-secondary-600">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" asChild>
            <Link href="/jobs">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get similar jobs (same niche, excluding current job)
  const similarJobs = mockJobs
    .filter((j) => j.niche === job.niche && j.id !== job.id)
    .slice(0, 3);

  return (
    <>
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <Script
          id="job-posting-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <ErrorBoundary>
        <div className="bg-secondary-50 py-8">
          <div className="container">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/jobs">
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-3xl">
                    {job.logo}
                  </div>
                  <div className="flex-1">
                    <h1 className="mb-2 text-3xl font-bold text-secondary-900">
                      {job.title}
                    </h1>
                    <p className="mb-4 text-xl text-secondary-600">
                      {job.company}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-secondary-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <span className="text-secondary-400">•</span>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                      <span className="text-secondary-400">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Posted {job.posted}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-6 flex flex-wrap gap-2">
                  <Badge
                    variant={
                      job.remote === "Remote"
                        ? "success"
                        : job.remote === "Hybrid"
                        ? "primary"
                        : "secondary"
                    }
                  >
                    {job.remote}
                  </Badge>
                  <Badge variant="outline">{job.niche}</Badge>
                  <Badge variant="secondary">{job.experienceLevel}</Badge>
                </div>

                {/* Salary */}
                <div className="mb-6 flex items-center gap-2 text-2xl font-bold text-secondary-900">
                  <DollarSign className="h-6 w-6 text-success-600" />
                  <span>
                    {formatCurrency(job.salary.min)} -{" "}
                    {formatCurrency(job.salary.max)}
                  </span>
                  <span className="text-base font-normal text-secondary-600">
                    / year
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 sm:flex-initial"
                    onClick={() => setIsApplicationFormOpen(true)}
                  >
                    Apply Now
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Bookmark className="h-4 w-4" />
                    Save Job
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About the Role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed">
                  {job.fullDescription}
                </p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-600" />
                      <span className="text-secondary-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-danger-600" />
                      <span className="text-secondary-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Nice to Haves */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Nice to Haves</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.niceToHaves.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-success-600" />
                      <span className="text-secondary-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" size="lg">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success-100">
                        <div className="h-2 w-2 rounded-full bg-success-600" />
                      </div>
                      <span className="text-sm text-secondary-700">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About {job.company}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center rounded-lg bg-primary-50 p-8">
                    <div className="text-6xl">{job.logo}</div>
                  </div>

                  <p className="text-sm text-secondary-700">
                    {job.companyInfo.description}
                  </p>

                  <div className="space-y-3 border-t border-secondary-200 pt-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-secondary-400" />
                      <div>
                        <div className="text-secondary-500">Industry</div>
                        <div className="font-medium text-secondary-900">
                          {job.companyInfo.industry}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-secondary-400" />
                      <div>
                        <div className="text-secondary-500">Company Size</div>
                        <div className="font-medium text-secondary-900">
                          {job.companyInfo.size}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-secondary-400" />
                      <div>
                        <div className="text-secondary-500">Founded</div>
                        <div className="font-medium text-secondary-900">
                          {job.companyInfo.founded}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    asChild
                  >
                    <a
                      href={job.companyInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Apply CTA */}
              <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 text-lg font-semibold">
                    Ready to Apply?
                  </h3>
                  <p className="mb-4 text-sm text-primary-100">
                    Join {job.company} and make an impact
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-primary-600 hover:bg-primary-50"
                    onClick={() => setIsApplicationFormOpen(true)}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-secondary-900">
                Similar Jobs
              </h2>
              <p className="text-secondary-600">
                Other opportunities in {job.niche}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similarJobs.map((similarJob) => (
                <JobCard key={similarJob.id} job={similarJob} />
              ))}
            </div>
          </div>
        )}

        {/* Application Form Modal */}
        <ApplicationForm
          isOpen={isApplicationFormOpen}
          onClose={() => setIsApplicationFormOpen(false)}
          jobTitle={job.title}
          companyName={job.company}
        />
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
}
