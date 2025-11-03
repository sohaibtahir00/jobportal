"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Briefcase } from "lucide-react";
import { Button, Badge, EmptyState } from "@/components/ui";
import { JobCard } from "@/components/jobs/JobCard";
import { FiltersSidebar, Filters } from "@/components/jobs/FiltersSidebar";
import { MobileFiltersDrawer } from "@/components/jobs/MobileFiltersDrawer";
import { mockJobs } from "@/lib/mock-jobs";

const ITEMS_PER_PAGE = 9;

export default function JobsPage() {
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

  // Filter and search jobs
  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Niche filter
      if (filters.niches.length > 0 && !filters.niches.includes(job.niche)) {
        return false;
      }

      // Location filter
      if (
        filters.locations.length > 0 &&
        !filters.locations.includes(job.location)
      ) {
        return false;
      }

      // Remote type filter
      if (
        filters.remoteTypes.length > 0 &&
        !filters.remoteTypes.includes(job.remote)
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
      if (job.salary.max < filters.salaryMin) {
        return false;
      }
      if (filters.salaryMax < 300000 && job.salary.min > filters.salaryMax) {
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
    <div className="bg-secondary-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-secondary-900 md:text-4xl">
            Find Your Next Opportunity
          </h1>
          <p className="text-lg text-secondary-600">
            Browse {mockJobs.length} available positions
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by job title, company, or skills..."
              className="h-14 w-full rounded-lg border border-secondary-300 bg-white pl-12 pr-4 text-base shadow-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
            />
          </div>
        </div>

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
