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
  Loader2,
} from "lucide-react";
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { JobCard } from "@/components/jobs/JobCard";
import ApplicationForm from "@/components/jobs/ApplicationForm";
import { generateJobPostingJsonLd } from "@/lib/seo";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useJob, useJobs } from "@/hooks/useJobs";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [jsonLd, setJsonLd] = useState<Record<string, unknown> | null>(null);

  // Fetch job from API
  const { data: job, isLoading, error } = useJob(jobId);

  // Fetch similar jobs (same niche)
  const { data: similarJobsData } = useJobs({
    niche: job?.niche,
    limit: 3,
  });

  // Generate JSON-LD structured data for the job
  useEffect(() => {
    if (job) {
      const structuredData = generateJobPostingJsonLd(job);
      setJsonLd(structuredData);
    }
  }, [job]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary-600" />
          <p className="text-lg text-secondary-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error or Not Found state
  if (error || !job) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-secondary-900">
            Job Not Found
          </h1>
          <p className="mb-8 text-lg text-secondary-600">
            {error
              ? (error as any)?.response?.data?.message || "Failed to load job details"
              : "The job you're looking for doesn't exist or has been removed."}
          </p>
          <Button variant="primary" asChild>
            <Link href="/jobs">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get similar jobs (excluding current job)
  const similarJobs = similarJobsData?.jobs?.filter((j) => j.id !== jobId) || [];

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
        {/* Company Banner */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary-600 to-accent-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          <div className="container relative h-full flex items-end pb-6 md:pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 w-full">
              {/* Company Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-xl md:rounded-2xl shadow-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-primary-600 border-2 md:border-4 border-white flex-shrink-0">
                {(job as any).logo || (job as any).employer?.companyName?.charAt(0) || 'J'}
              </div>

              <div className="text-white flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-white/90">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{job.employer?.companyName || 'Company'}</span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="truncate max-w-[120px] sm:max-w-none">{job.location}</span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                    {job.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Metadata Bar - RESPONSIVE */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="container py-3 md:py-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                {/* Salary - PROMINENT */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Salary Range</div>
                    <div className="text-base sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {job.salaryMin && job.salaryMax ? (
                        `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}`
                      ) : (
                        'Competitive'
                      )}
                    </div>
                  </div>
                </div>

                {/* Posted Date */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Posted</div>
                    <div className="text-sm sm:text-lg font-bold text-gray-900">
                      {new Date(job.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="primary"
                  onClick={() => setIsApplicationFormOpen(true)}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-sm sm:text-base"
                >
                  Apply Now
                </Button>
                <Button variant="outline" className="gap-2 px-3 sm:px-4">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
                <Button variant="outline" className="gap-2 px-3 sm:px-4">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
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
            {/* Verified Employer Badge */}
            {job.employer?.verified && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-4 py-2">
                <span className="text-success-600">✓</span>
                <span className="font-semibold text-success-900">Verified Employer</span>
              </div>
            )}

            {/* Job Header */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-3xl">
                    {job.employer?.companyLogo ? (
                      <img src={job.employer.companyLogo} alt={job.employer.companyName} className="h-full w-full rounded-lg object-cover" />
                    ) : (
                      job.employer?.companyName?.charAt(0) || 'J'
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="mb-2 text-3xl font-bold text-secondary-900">
                      {job.title}
                    </h1>
                    <p className="mb-4 text-xl text-secondary-600">
                      {job.employer?.companyName || 'Company'}
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
                        <span>Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-6 flex flex-wrap gap-2">
                  <Badge variant={job.remote ? "success" : "secondary"}>
                    {job.remote ? 'Remote' : 'On-site'}
                  </Badge>
                  <Badge variant="outline">{job.niche}</Badge>
                  <Badge variant="secondary">{job.experienceLevel}</Badge>
                </div>

                {/* Salary */}
                {job.salaryMin && job.salaryMax && (
                  <div className="mb-6 flex items-center gap-2 text-2xl font-bold text-secondary-900">
                    <DollarSign className="h-6 w-6 text-success-600" />
                    <span>
                      {formatCurrency(job.salaryMin)} -{" "}
                      {formatCurrency(job.salaryMax)}
                    </span>
                    <span className="text-base font-normal text-secondary-600">
                      / year
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div>
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
                  <p className="mt-2 text-sm text-secondary-600">
                    Application takes 2 minutes
                  </p>
                </div>

                {/* Skills Assessment CTA - Always show for now */}
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About the Role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
                  {job.responsibilities}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
                  {job.requirements}
                </p>
              </CardContent>
            </Card>


            {/* Tech Stack */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills && job.skills.map((tag, index) => (
                    <Badge key={index} variant="secondary" size="lg">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            {job.benefits && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
                    {job.benefits}
                  </p>
                </CardContent>
              </Card>
            )}
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
