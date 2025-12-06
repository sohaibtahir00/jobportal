"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Search,
  Star,
  MapPin,
  Briefcase,
  Award,
  Eye,
  Users,
  TrendingUp,
  Lock,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";
import { api } from "@/lib/api";

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  experienceYears: number;
  skillsScore: number;
  tier: string;
  skills: string[];
  seeking: string;
  available: boolean;
}

const CANDIDATES_PER_PAGE = 12;

export default function EmployerSearchPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    minScore: 0,
    location: "",
    experience: "all",
    tier: "all",
    skills: [] as string[],
    availability: "all",
  });

  // Sorting and pagination
  const [sortBy, setSortBy] = useState("score-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Load candidates with debouncing
  useEffect(() => {
    if (status !== "authenticated") return;

    const debounceTimer = setTimeout(() => {
      const loadCandidates = async () => {
        try {
          setIsLoading(true);

          const params = new URLSearchParams();
          if (searchQuery) params.append("q", searchQuery);
          if (filters.location) params.append("location", filters.location);
          if (filters.minScore && filters.minScore > 0) params.append("testScoreMin", filters.minScore.toString());
          if (filters.tier !== "all") params.append("testTier", filters.tier.toUpperCase());
          if (filters.availability !== "all") {
            params.append("availability", filters.availability === "available" ? "true" : "false");
          }

          if (filters.experience !== "all") {
            if (filters.experience === "junior") {
              params.append("experienceMax", "2");
            } else if (filters.experience === "mid") {
              params.append("experienceMin", "3");
              params.append("experienceMax", "6");
            } else if (filters.experience === "senior") {
              params.append("experienceMin", "7");
            }
          }

          const response = await api.get(`/api/candidates/search?${params.toString()}`);
          const apiCandidates = response.data.candidates || [];

          const transformedCandidates: Candidate[] = apiCandidates.map((c: any) => ({
            id: c.id,
            name: c.user.name || c.user.email,
            title: c.currentTitle || "Not specified",
            location: c.location || "Not specified",
            experience: c.experience ? `${c.experience} years` : "Not specified",
            experienceYears: c.experience || 0,
            skillsScore: c.testScore || 0,
            tier: c.testTier || "Not Assessed",
            skills: c.skills || [],
            seeking: c.preferredJobType || "Not specified",
            available: c.availability || false,
          }));

          setCandidates(transformedCandidates);
          setIsLoading(false);
        } catch (err: any) {
          console.error("Failed to load candidates:", err);
          setCandidates([]);
          setIsLoading(false);
        }
      };

      loadCandidates();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [status, searchQuery, filters]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  // Sort candidates
  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return b.skillsScore - a.skillsScore;
        case "score-asc":
          return a.skillsScore - b.skillsScore;
        case "experience-desc":
          return b.experienceYears - a.experienceYears;
        case "experience-asc":
          return a.experienceYears - b.experienceYears;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [candidates, sortBy]);

  // Paginate candidates
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * CANDIDATES_PER_PAGE;
    return sortedCandidates.slice(start, start + CANDIDATES_PER_PAGE);
  }, [sortedCandidates, currentPage]);

  const totalPages = Math.ceil(sortedCandidates.length / CANDIDATES_PER_PAGE);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Elite":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Advanced":
        return "text-accent-600 bg-accent-50 border-accent-200";
      case "Proficient":
        return "text-primary-600 bg-primary-50 border-primary-200";
      default:
        return "text-secondary-600 bg-secondary-50 border-secondary-200";
    }
  };

  // Quick filter style
  const quickFilterStyle = (isActive: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all ${
      isActive
        ? "bg-white text-primary-600 shadow-md"
        : "bg-white/20 text-white hover:bg-white/30"
    }`;

  // Handle quick filters
  const handleQuickFilter = (filterType: string) => {
    if (activeQuickFilter === filterType) {
      setActiveQuickFilter(null);
      resetFilters();
      return;
    }

    setActiveQuickFilter(filterType);
    switch (filterType) {
      case "available":
        setFilters({ ...filters, availability: "available" });
        break;
      case "elite":
        setFilters({ ...filters, tier: "Elite" });
        break;
      case "senior":
        setFilters({ ...filters, experience: "senior" });
        break;
      case "high-score":
        setFilters({ ...filters, minScore: 80 });
        break;
    }
  };

  // Check if any filter is active
  const hasActiveFilters =
    filters.minScore > 0 ||
    filters.location !== "" ||
    filters.experience !== "all" ||
    filters.tier !== "all" ||
    filters.availability !== "all" ||
    searchQuery !== "";

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minScore: 0,
      location: "",
      experience: "all",
      tier: "all",
      skills: [],
      availability: "all",
    });
    setSearchQuery("");
    setActiveQuickFilter(null);
  };

  // Build active filters list
  const activeFiltersList: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.experience !== "all") {
    const expLabels: Record<string, string> = {
      junior: "Junior (0-2 yrs)",
      mid: "Mid (3-6 yrs)",
      senior: "Senior (7+ yrs)",
    };
    activeFiltersList.push({
      key: "experience",
      label: expLabels[filters.experience] || filters.experience,
      onRemove: () => setFilters({ ...filters, experience: "all" }),
    });
  }

  if (filters.tier !== "all") {
    activeFiltersList.push({
      key: "tier",
      label: filters.tier,
      onRemove: () => setFilters({ ...filters, tier: "all" }),
    });
  }

  if (filters.availability !== "all") {
    activeFiltersList.push({
      key: "availability",
      label: filters.availability === "available" ? "Available Now" : "Not Available",
      onRemove: () => setFilters({ ...filters, availability: "all" }),
    });
  }

  if (filters.location) {
    activeFiltersList.push({
      key: "location",
      label: filters.location,
      onRemove: () => setFilters({ ...filters, location: "" }),
    });
  }

  if (filters.minScore > 0) {
    activeFiltersList.push({
      key: "minScore",
      label: `Score ≥ ${filters.minScore}%`,
      onRemove: () => setFilters({ ...filters, minScore: 0 }),
    });
  }

  if (searchQuery) {
    activeFiltersList.push({
      key: "search",
      label: `"${searchQuery}"`,
      onRemove: () => setSearchQuery(""),
    });
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12">
        <div className="container">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            {isLoading ? "Finding Top Candidates" : `Browse ${candidates.length}+ Verified Candidates`}
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Pre-vetted talent across AI/ML, Healthcare IT, FinTech & Cybersecurity
          </p>

          {/* Search Bar in Hero */}
          <div className="max-w-3xl bg-white rounded-xl p-2 shadow-2xl mb-6">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, title, or skills..."
                  className="flex-1 outline-none text-gray-900 py-3"
                />
              </div>
              <button className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-md">
                Search
              </button>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              className={quickFilterStyle(activeQuickFilter === null && !hasActiveFilters)}
              onClick={() => {
                setActiveQuickFilter(null);
                resetFilters();
              }}
            >
              All Candidates
            </button>
            <button
              className={quickFilterStyle(activeQuickFilter === "available")}
              onClick={() => handleQuickFilter("available")}
            >
              Available Now
            </button>
            <button
              className={quickFilterStyle(activeQuickFilter === "elite")}
              onClick={() => handleQuickFilter("elite")}
            >
              Elite Tier
            </button>
            <button
              className={quickFilterStyle(activeQuickFilter === "senior")}
              onClick={() => handleQuickFilter("senior")}
            >
              Senior Level
            </button>
            <button
              className={quickFilterStyle(activeQuickFilter === "high-score")}
              onClick={() => handleQuickFilter("high-score")}
            >
              Score 80+
            </button>
          </div>
        </div>
      </section>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="mx-auto mb-2 h-6 w-6 text-primary-600" />
              <div className="text-2xl font-bold text-secondary-900">
                {sortedCandidates.length}
              </div>
              <div className="text-xs text-secondary-600">Matches Found</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="mx-auto mb-2 h-6 w-6 text-yellow-600" />
              <div className="text-2xl font-bold text-secondary-900">
                {sortedCandidates.filter((c) => c.tier === "Elite").length}
              </div>
              <div className="text-xs text-secondary-600">Elite Candidates</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="mx-auto mb-2 h-6 w-6 text-success-600" />
              <div className="text-2xl font-bold text-secondary-900">
                {sortedCandidates.filter((c) => c.available).length}
              </div>
              <div className="text-xs text-secondary-600">Available Now</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="mx-auto mb-2 h-6 w-6 text-accent-600" />
              <div className="text-2xl font-bold text-secondary-900">
                {sortedCandidates.length > 0
                  ? Math.round(
                      sortedCandidates.reduce((sum, c) => sum + c.skillsScore, 0) /
                        sortedCandidates.length
                    )
                  : 0}
              </div>
              <div className="text-xs text-secondary-600">Avg Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Horizontal Filters Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Row 1: Main Filters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
              {/* Experience Level */}
              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Experience
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Levels</option>
                  <option value="junior">Junior (0-2 yrs)</option>
                  <option value="mid">Mid (3-6 yrs)</option>
                  <option value="senior">Senior (7+ yrs)</option>
                </select>
              </div>

              {/* Performance Tier */}
              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Performance Tier
                </label>
                <select
                  value={filters.tier}
                  onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
                  className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Tiers</option>
                  <option value="Elite">Elite (90+)</option>
                  <option value="Advanced">Advanced (80-89)</option>
                  <option value="Proficient">Proficient (70-79)</option>
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                  className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                >
                  <option value="all">Any</option>
                  <option value="available">Available Now</option>
                  <option value="not-available">Not Available</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                  <Input
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    placeholder="Any location"
                    className="pl-9 h-[38px] text-sm"
                  />
                </div>
              </div>

              {/* Min Score */}
              <div className="col-span-2 sm:col-span-1 lg:col-span-2">
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  Minimum Score: {filters.minScore}%
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={filters.minScore}
                    onChange={(e) => setFilters({ ...filters, minScore: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <span className="text-sm font-medium text-secondary-900 w-12 text-right">
                    {filters.minScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFiltersList.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-secondary-200">
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
                  onClick={resetFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium ml-2"
                >
                  Clear All
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Header with Count and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <p className="text-sm font-medium text-secondary-700">
            {isLoading
              ? "Loading candidates..."
              : sortedCandidates.length > 0
              ? `${sortedCandidates.length} candidate${sortedCandidates.length !== 1 ? "s" : ""} found`
              : "No candidates match your filters"}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-secondary-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-secondary-300 bg-white px-3 py-1.5 text-sm text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
            >
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
              <option value="experience-desc">Most Experience</option>
              <option value="experience-asc">Least Experience</option>
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Loading State - Skeleton Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-5 bg-secondary-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-secondary-200 rounded w-1/2" />
                    </div>
                    <div className="h-8 w-16 bg-secondary-200 rounded" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-secondary-200 rounded w-full" />
                    <div className="h-3 bg-secondary-200 rounded w-2/3" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-secondary-200 rounded-full w-16" />
                    <div className="h-6 bg-secondary-200 rounded-full w-16" />
                    <div className="h-6 bg-secondary-200 rounded-full w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : paginatedCandidates.length > 0 ? (
          <>
            {/* Candidate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedCandidates.map((candidate) => (
                <Card key={candidate.id} className="transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    {/* Header with Name and Score */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-secondary-900 truncate">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-secondary-600 truncate">{candidate.title}</p>
                      </div>
                      <div className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-bold border ${getTierColor(candidate.tier)}`}>
                        <Star className="h-4 w-4" />
                        {candidate.skillsScore}
                      </div>
                    </div>

                    {/* Tier Badge */}
                    <div className="mb-3">
                      <Badge variant="secondary" size="sm" className={getTierColor(candidate.tier)}>
                        {candidate.tier}
                      </Badge>
                      {candidate.available && (
                        <Badge variant="success" size="sm" className="ml-2">
                          Available
                        </Badge>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-1.5 mb-4 text-sm text-secondary-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{candidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 flex-shrink-0" />
                        <span>{candidate.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 flex-shrink-0" />
                        <span>Seeking: {candidate.seeking}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {candidate.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" size="sm" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="secondary" size="sm" className="text-xs">
                          +{candidate.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button variant="primary" size="sm" className="w-full" asChild>
                        <Link href={`/employer/candidates/${candidate.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </Link>
                      </Button>
                      <div className="flex gap-2">
                        <span className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-amber-50 text-amber-700 text-xs rounded-md border border-amber-200">
                          <Lock className="h-3 w-3" />
                          Protected
                        </span>
                        <span className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-secondary-50 text-secondary-600 text-xs rounded-md border border-secondary-200">
                          <FileText className="h-3 w-3" />
                          Resume
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
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
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-16 w-16 text-secondary-400 mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                No candidates found
              </h3>
              <p className="text-secondary-600 text-center mb-6 max-w-md">
                Try adjusting your search criteria or filters to find more candidates
              </p>
              <Button variant="outline" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
