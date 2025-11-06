"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Briefcase } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { JobCard } from "@/components/jobs/JobCard";
import { FiltersSidebar, Filters } from "@/components/jobs/FiltersSidebar";
import { MobileFiltersDrawer } from "@/components/jobs/MobileFiltersDrawer";
import { mockJobs } from "@/lib/mock-jobs";

const ITEMS_PER_PAGE = 9;

function JobsContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
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

    if (search) {
      setSearchQuery(search);
    }

    if (location) {
      setFilters(prev => ({
        ...prev,
        locations: [location],
      }));
    }
  }, [searchParams]);

  // Filter and search jobs
  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          job.title.toLowerCase().includes(query) ||
          ((job as any).company?.toLowerCase() || '').includes(query) ||
          (job.skills || []).some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Niche filter (using type instead of niche which doesn't exist)
      if (filters.niches.length > 0 && !filters.niches.includes((job as any).niche || job.type)) {
        return false;
      }

      // Location filter
      if (filters.locations.length > 0) {
        const matchesLocation = filters.locations.some((filterLoc) => {
          const filterLower = filterLoc.toLowerCase();
          const jobLocLower = job.location.toLowerCase();
          // Check if job location contains the filter location or vice versa
          return (
            jobLocLower.includes(filterLower) ||
            filterLower.includes(jobLocLower) ||
            filterLower === "remote" && job.location.toLowerCase() === "remote"
          );
        });
        if (!matchesLocation) return false;
      }

      // Remote type filter
      if (
        filters.remoteTypes.length > 0 &&
        !filters.remoteTypes.includes(job.remote ? 'remote' : 'onsite')
      ) {
        return false;
      }

      // Experience level filter
      if (
        filters.experienceLevels.length > 0 &&
        !filters.experienceLevels.includes(job.experienceLevel)
      ) {
        return false;
      }

      // Salary filter
      if (job.salaryMax && job.salaryMax < filters.salaryMin) {
        return false;
      }
      if (filters.salaryMax < 300000 && job.salaryMin && job.salaryMin > filters.salaryMax) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

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
            Browse {mockJobs.length}+ AI/ML Jobs
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
            {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}{" "}
            found
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
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredJobs.length)} of{" "}
                {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
              </p>
            </div>

            {/* Job Cards Grid */}
            {paginatedJobs.length > 0 ? (
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {paginatedJobs.map((job) => (
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
        resultsCount={filteredJobs.length}
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
