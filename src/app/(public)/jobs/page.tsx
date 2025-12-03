"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Briefcase } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { JobCard } from "@/components/jobs/JobCard";
import { FiltersSidebar, Filters } from "@/components/jobs/FiltersSidebar";
import { MobileFiltersDrawer } from "@/components/jobs/MobileFiltersDrawer";
import { useJobs } from "@/hooks/useJobs";
import type { GetJobsParams } from "@/lib/api/jobs";

const ITEMS_PER_PAGE = 12;

function JobsContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [employerId, setEmployerId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    niches: [],
    locations: [],
    remoteTypes: [],
    experienceLevels: [],
    salaryMin: 0,
    salaryMax: 300000,
  });

  // Initialize search from URL parameters
  useEffect(() => {
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const employer = searchParams.get("employerId");

    if (search) {
      setSearchQuery(search);
    }

    if (location) {
      setFilters(prev => ({
        ...prev,
        locations: [location],
      }));
    }

    if (employer) {
      setEmployerId(employer);
    }
  }, [searchParams]);

  // Build API query params from filters
  const queryParams: GetJobsParams = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery || undefined,
    employerId: employerId || undefined,
    niche: filters.niches.length > 0 ? filters.niches[0] : undefined,
    location: filters.locations.length > 0 ? filters.locations[0] : undefined,
    remoteType: filters.remoteTypes.length > 0
      ? (filters.remoteTypes[0].toUpperCase() as 'REMOTE' | 'HYBRID' | 'ONSITE')
      : undefined,
    experienceLevel: filters.experienceLevels.length > 0
      ? (filters.experienceLevels[0].toUpperCase() as 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD')
      : undefined,
    salaryMin: filters.salaryMin > 0 ? filters.salaryMin : undefined,
    salaryMax: filters.salaryMax < 300000 ? filters.salaryMax : undefined,
  };

  // Fetch jobs from API
  const { data, isLoading, error } = useJobs(queryParams);

  const jobs = data?.jobs || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalCount = data?.pagination?.totalCount || 0;
  const startIndex = ((data?.pagination?.page || 1) - 1) * ITEMS_PER_PAGE;

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isLoading ? (
              "Browsing AI/ML Jobs"
            ) : (
              `Browse ${totalCount}+ AI/ML Jobs`
            )}
          </h1>
          <p className="text-xl text-primary-100 mb-6">
            Find your dream role from top companies hiring AI/ML talent
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl bg-white rounded-xl p-2 shadow-2xl">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  id="jobs-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search jobs, companies, or skills..."
                  className="flex-1 outline-none text-gray-900 py-3"
                />
              </div>
              <button className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-md">
                Search
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            {['All Jobs', 'Remote', 'Senior Level', '$150k+', 'AI/ML', 'Full-time'].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-sm font-medium transition-all"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-8">

        {/* Mobile Filter Button */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <p className="text-sm text-secondary-600">
            {isLoading ? (
              "Loading..."
            ) : (
              `${totalCount} ${totalCount === 1 ? "job" : "jobs"} found`
            )}
          </p>
          <Button
            variant="outline"
            onClick={() => setMobileFiltersOpen(true)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {(filters.niches.length +
              filters.remoteTypes.length +
              filters.experienceLevels.length +
              filters.locations.length) >
              0 && (
              <Badge variant="primary" size="sm">
                {filters.niches.length +
                  filters.remoteTypes.length +
                  filters.experienceLevels.length +
                  filters.locations.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden w-80 flex-shrink-0 lg:block">
            <div className="sticky top-24">
              <FiltersSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Job Listings */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-secondary-600">
                {isLoading ? (
                  "Loading jobs..."
                ) : jobs.length > 0 ? (
                  `Showing ${startIndex + 1}-${Math.min(startIndex + jobs.length, totalCount)} of ${totalCount} ${totalCount === 1 ? "job" : "jobs"}`
                ) : (
                  "No jobs found"
                )}
              </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-lg bg-secondary-200"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-red-300 bg-red-50 py-16">
                <h3 className="mb-2 text-lg font-semibold text-red-900">
                  Failed to load jobs
                </h3>
                <p className="mb-6 text-center text-red-700">
                  {(error as any)?.response?.data?.message || "Please try again later"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : jobs.length > 0 ? (
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary-300 bg-white py-16">
                <Briefcase className="mb-4 h-16 w-16 text-secondary-400" />
                <h3 className="mb-2 text-lg font-semibold text-secondary-900">
                  No jobs found
                </h3>
                <p className="mb-6 text-center text-secondary-600">
                  Try adjusting your search or filters to find more results
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setEmployerId(null);
                    handleFilterChange({
                      niches: [],
                      locations: [],
                      remoteTypes: [],
                      experienceLevels: [],
                      salaryMin: 0,
                      salaryMax: 300000,
                    });
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}

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
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              page === currentPage ? "primary" : "outline"
                            }
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <MobileFiltersDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultsCount={totalCount}
      />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="container py-12">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent" />
            <p className="text-secondary-600">Loading jobs...</p>
          </div>
        </div>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}
