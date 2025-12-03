"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Briefcase, X } from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { JobCard } from "@/components/jobs/JobCard";
import { Filters } from "@/components/jobs/FiltersSidebar";
import { useJobs } from "@/hooks/useJobs";
import type { GetJobsParams } from "@/lib/api/jobs";
import type { Job } from "@/types";

const ITEMS_PER_PAGE = 12;

// Filter options
const NICHES = ["AI/ML", "Healthcare IT", "FinTech", "Cybersecurity"];
const REMOTE_TYPES = ["Remote", "Hybrid", "On-site"];
const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior", "Lead"];
const LOCATIONS = ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Boston, MA", "Remote"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const DATE_POSTED_OPTIONS = [
  { value: "any", label: "Any Time" },
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
];
const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "salary_high", label: "Salary: High to Low" },
  { value: "salary_low", label: "Salary: Low to High" },
];

// Helper function to filter jobs by posted date
const filterByDatePosted = (job: Job, filter: string): boolean => {
  if (filter === "any") return true;
  const posted = new Date(job.createdAt);
  const now = new Date();
  const diffMs = now.getTime() - posted.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  switch (filter) {
    case "24h":
      return diffDays < 1;
    case "7d":
      return diffDays <= 7;
    case "30d":
      return diffDays <= 30;
    default:
      return true;
  }
};

// Helper function to sort jobs
const sortJobs = (jobs: Job[], sortBy: string, isCandidate: boolean): Job[] => {
  const sorted = [...jobs];
  switch (sortBy) {
    case "best_match":
      if (isCandidate) {
        return sorted.sort((a, b) => ((b as any).matchScore || 0) - ((a as any).matchScore || 0));
      }
      return sorted;
    case "salary_high":
      return sorted.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    case "salary_low":
      return sorted.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
    case "recent":
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

function JobsContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const isCandidate = session?.user?.role === "CANDIDATE";

  const [searchQuery, setSearchQuery] = useState("");
  const [employerId, setEmployerId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobType, setJobType] = useState<string>("all");
  const [datePosted, setDatePosted] = useState<string>("any");
  const [sortBy, setSortBy] = useState<string>("recent");
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

  // Apply client-side filters (job type and date posted) and sorting
  const filteredAndSortedJobs = useMemo(() => {
    let result = data?.jobs || [];

    // Filter by job type (client-side)
    if (jobType !== "all") {
      const typeMapping: Record<string, string> = {
        "Full-time": "FULL_TIME",
        "Part-time": "PART_TIME",
        "Contract": "CONTRACT",
        "Internship": "INTERNSHIP",
      };
      result = result.filter((job) => job.type === typeMapping[jobType]);
    }

    // Filter by date posted (client-side)
    if (datePosted !== "any") {
      result = result.filter((job) => filterByDatePosted(job, datePosted));
    }

    // Sort jobs
    result = sortJobs(result, sortBy, isCandidate);

    return result;
  }, [data?.jobs, jobType, datePosted, sortBy, isCandidate]);

  const jobs = filteredAndSortedJobs;
  const totalPages = data?.pagination?.totalPages || 1;
  const totalCount = data?.pagination?.totalCount || 0;
  const filteredCount = jobs.length;
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

  // Check if any filter is active
  const hasActiveFilters =
    filters.niches.length > 0 ||
    filters.remoteTypes.length > 0 ||
    filters.experienceLevels.length > 0 ||
    filters.locations.length > 0 ||
    filters.salaryMin > 0 ||
    filters.salaryMax < 300000 ||
    jobType !== "all" ||
    datePosted !== "any" ||
    searchQuery !== "";

  const clearAllFilters = () => {
    setSearchQuery("");
    setEmployerId(null);
    setJobType("all");
    setDatePosted("any");
    setSortBy("recent");
    handleFilterChange({
      niches: [],
      locations: [],
      remoteTypes: [],
      experienceLevels: [],
      salaryMin: 0,
      salaryMax: 300000,
    });
  };

  // Build active filters list for chips display
  const activeFiltersList: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.niches.length > 0) {
    filters.niches.forEach((niche) => {
      activeFiltersList.push({
        key: `niche-${niche}`,
        label: niche,
        onRemove: () => handleFilterChange({ ...filters, niches: filters.niches.filter((n) => n !== niche) }),
      });
    });
  }

  if (filters.remoteTypes.length > 0) {
    filters.remoteTypes.forEach((type) => {
      activeFiltersList.push({
        key: `remote-${type}`,
        label: type,
        onRemove: () => handleFilterChange({ ...filters, remoteTypes: filters.remoteTypes.filter((t) => t !== type) }),
      });
    });
  }

  if (filters.experienceLevels.length > 0) {
    filters.experienceLevels.forEach((level) => {
      activeFiltersList.push({
        key: `exp-${level}`,
        label: `${level} Level`,
        onRemove: () => handleFilterChange({ ...filters, experienceLevels: filters.experienceLevels.filter((l) => l !== level) }),
      });
    });
  }

  if (filters.locations.length > 0) {
    filters.locations.forEach((loc) => {
      activeFiltersList.push({
        key: `loc-${loc}`,
        label: loc,
        onRemove: () => handleFilterChange({ ...filters, locations: filters.locations.filter((l) => l !== loc) }),
      });
    });
  }

  if (filters.salaryMin > 0) {
    activeFiltersList.push({
      key: "salary-min",
      label: `$${(filters.salaryMin / 1000).toFixed(0)}k+`,
      onRemove: () => handleFilterChange({ ...filters, salaryMin: 0 }),
    });
  }

  if (jobType !== "all") {
    activeFiltersList.push({
      key: "job-type",
      label: jobType,
      onRemove: () => setJobType("all"),
    });
  }

  if (datePosted !== "any") {
    const dateLabel = DATE_POSTED_OPTIONS.find((d) => d.value === datePosted)?.label || datePosted;
    activeFiltersList.push({
      key: "date-posted",
      label: dateLabel,
      onRemove: () => setDatePosted("any"),
    });
  }

  if (searchQuery) {
    activeFiltersList.push({
      key: "search",
      label: `"${searchQuery}"`,
      onRemove: () => setSearchQuery(""),
    });
  }

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
        {/* Horizontal Filters Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Row 1: Niche Filter Buttons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-secondary-700">Category:</label>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 h-7 px-2"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filters.niches.length === 0 ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange({ ...filters, niches: [] })}
                  >
                    All Categories
                  </Button>
                  {NICHES.map((niche) => (
                    <Button
                      key={niche}
                      variant={filters.niches.includes(niche) ? "primary" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newNiches = filters.niches.includes(niche)
                          ? filters.niches.filter(n => n !== niche)
                          : [niche];
                        handleFilterChange({ ...filters, niches: newNiches });
                      }}
                    >
                      {niche}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-secondary-200"></div>

              {/* Row 2: Secondary Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Work Location Filter */}
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-2 block">
                    Work Location:
                  </label>
                  <select
                    value={filters.remoteTypes.length > 0 ? filters.remoteTypes[0] : "all"}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange({
                        ...filters,
                        remoteTypes: value === "all" ? [] : [value],
                      });
                    }}
                    className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="all">All</option>
                    {REMOTE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-2 block">
                    Experience:
                  </label>
                  <select
                    value={filters.experienceLevels.length > 0 ? filters.experienceLevels[0] : "all"}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange({
                        ...filters,
                        experienceLevels: value === "all" ? [] : [value],
                      });
                    }}
                    className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="all">All Levels</option>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-2 block">
                    City:
                  </label>
                  <select
                    value={filters.locations.length > 0 ? filters.locations[0] : "all"}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange({
                        ...filters,
                        locations: value === "all" ? [] : [value],
                      });
                    }}
                    className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="all">All Cities</option>
                    {LOCATIONS.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Salary Filter */}
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-2 block">
                    Min Salary:
                  </label>
                  <select
                    value={filters.salaryMin > 0 ? filters.salaryMin.toString() : "all"}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange({
                        ...filters,
                        salaryMin: value === "all" ? 0 : parseInt(value),
                      });
                    }}
                    className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="all">Any Salary</option>
                    <option value="50000">$50k+</option>
                    <option value="75000">$75k+</option>
                    <option value="100000">$100k+</option>
                    <option value="150000">$150k+</option>
                    <option value="200000">$200k+</option>
                  </select>
                </div>

                {/* Job Type Filter */}
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-2 block">
                    Job Type:
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => {
                      setJobType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="all">All Types</option>
                    {JOB_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Date Posted Filter */}
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-2 block">
                    Date Posted:
                  </label>
                  <select
                    value={datePosted}
                    onChange={(e) => {
                      setDatePosted(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                  >
                    {DATE_POSTED_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-secondary-200"></div>

              {/* Row 3: Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or skills..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-lg border border-secondary-300 bg-white pl-10 pr-4 py-2.5 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Active Filters Chips */}
              {activeFiltersList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-secondary-600">Active:</span>
                  {activeFiltersList.map((filter) => (
                    <Badge
                      key={filter.key}
                      variant="secondary"
                      className="gap-1 pl-3 pr-1 py-1 cursor-pointer hover:bg-secondary-200 transition-colors"
                      onClick={filter.onRemove}
                    >
                      {filter.label}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Header with Sort */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm font-medium text-secondary-700">
            {isLoading ? (
              "Loading jobs..."
            ) : filteredCount > 0 ? (
              `${filteredCount} ${filteredCount === 1 ? "job" : "jobs"} found`
            ) : (
              "No jobs match your filters"
            )}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-secondary-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-secondary-300 bg-white px-3 py-1.5 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
            >
              {isCandidate && (
                <option value="best_match">Best Match</option>
              )}
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
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
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              onClick={clearAllFilters}
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
