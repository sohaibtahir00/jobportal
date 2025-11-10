"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Award, Lock, Loader2, Briefcase, AlertCircle } from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { JobCard } from "@/components/jobs/JobCard";
import Link from "next/link";

export default function ExclusiveJobsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [requiresAssessment, setRequiresAssessment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Redirect if not logged in or not candidate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/candidate/exclusive-jobs");
    }
    if (status === "authenticated" && session?.user?.role !== "CANDIDATE") {
      router.push("/");
    }
  }, [status, session, router]);

  // Fetch exclusive jobs
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "CANDIDATE") {
      fetchExclusiveJobs();
    }
  }, [status, session, currentPage]);

  const fetchExclusiveJobs = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/jobs/exclusive?page=${currentPage}&limit=12`
      );

      if (response.status === 403) {
        const data = await response.json();
        if (data.requiresAssessment) {
          setRequiresAssessment(true);
          setHasAccess(false);
        } else {
          setError(data.message || "Access denied");
        }
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch exclusive jobs");
      }

      const data = await response.json();
      setJobs(data.jobs || []);
      setHasAccess(data.hasAccess || false);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.totalCount || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load exclusive jobs");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading exclusive jobs...</p>
        </div>
      </div>
    );
  }

  // Assessment required screen
  if (requiresAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 mb-6">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                  Unlock Exclusive Jobs
                </h1>
                <p className="text-lg text-secondary-700 mb-8">
                  Complete your skills assessment to access premium job opportunities
                  from top AI/ML companies.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                    Why Exclusive Jobs?
                  </h2>
                  <div className="grid gap-4 text-left max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-secondary-900">
                          Higher Salaries
                        </p>
                        <p className="text-sm text-secondary-600">
                          Exclusive positions offer 20-40% higher compensation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-secondary-900">
                          Less Competition
                        </p>
                        <p className="text-sm text-secondary-600">
                          Only skills-verified candidates can apply
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-secondary-900">
                          Premium Companies
                        </p>
                        <p className="text-sm text-secondary-600">
                          Access to top-tier AI/ML companies and startups
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href="/skills-assessment">
                  <Button size="lg" className="px-8">
                    Start Skills Assessment
                  </Button>
                </Link>

                <p className="text-sm text-secondary-600 mt-6">
                  The assessment takes 30-45 minutes to complete
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Error screen
  if (error && !requiresAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                  Failed to Load Exclusive Jobs
                </h1>
                <p className="text-secondary-600 mb-6">{error}</p>
                <Button onClick={fetchExclusiveJobs}>Try Again</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-10 h-10" />
            <Badge variant="secondary" size="lg">
              Skills Verified
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Exclusive Job Opportunities
          </h1>
          <p className="text-xl text-primary-100 mb-2">
            Premium positions for skills-verified AI/ML professionals
          </p>
          <p className="text-primary-200">
            {totalCount} exclusive {totalCount === 1 ? "job" : "jobs"} available
          </p>
        </div>
      </section>

      <div className="container py-12">
        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-primary-200">
          <div className="flex items-start gap-4">
            <Award className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-secondary-900 mb-2">
                You have exclusive access!
              </h2>
              <p className="text-secondary-700">
                These positions are only visible to candidates who have completed
                their skills assessment. You're competing with a smaller, more
                qualified pool of candidates.
              </p>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
              No Exclusive Jobs Available
            </h2>
            <p className="text-secondary-600 mb-6">
              Check back soon! New exclusive opportunities are added regularly.
            </p>
            <Link href="/jobs">
              <Button variant="outline">Browse All Jobs</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "primary" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="flex min-w-[40px] items-center justify-center text-secondary-600"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
