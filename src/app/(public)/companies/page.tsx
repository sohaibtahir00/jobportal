"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Building2,
  Filter,
  BadgeCheck,
  Loader2,
  X,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";
import { CompanyCard, PublicCompany } from "@/components/companies";
import { api } from "@/lib/api";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Cybersecurity",
  "AI & Machine Learning",
  "Fintech",
  "Healthtech",
  "Enterprise Software",
  "Startup",
  "Consulting",
];

const companySizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
];

const ITEMS_PER_PAGE = 12;

interface CompaniesResponse {
  companies: PublicCompany[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<PublicCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append("page", currentPage.toString());
        params.append("limit", ITEMS_PER_PAGE.toString());

        if (searchQuery) params.append("search", searchQuery);
        if (selectedIndustry) params.append("industry", selectedIndustry);
        if (selectedSize) params.append("size", selectedSize);
        if (selectedLocation) params.append("location", selectedLocation);
        if (verifiedOnly) params.append("verified", "true");

        const response = await api.get<CompaniesResponse>(
          `/api/companies?${params.toString()}`
        );

        setCompanies(response.data.companies);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCount(response.data.pagination.total);
      } catch (err: any) {
        console.error("Failed to fetch companies:", err);
        setError(err.response?.data?.error || "Failed to load companies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [currentPage, searchQuery, selectedIndustry, selectedSize, selectedLocation, verifiedOnly]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedIndustry, selectedSize, selectedLocation, verifiedOnly]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedIndustry("");
    setSelectedSize("");
    setSelectedLocation("");
    setVerifiedOnly(false);
    setCurrentPage(1);
  };

  const activeFiltersCount =
    (selectedIndustry ? 1 : 0) +
    (selectedSize ? 1 : 0) +
    (selectedLocation ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Top Companies Hiring in Tech
            </h1>
            <p className="text-xl text-primary-100 mb-6">
              Explore {totalCount > 0 ? `${totalCount}+` : ""} companies actively hiring AI/ML, Healthcare IT, Fintech, and Cybersecurity talent
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl bg-white rounded-xl p-2 shadow-2xl">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companies by name..."
                    className="flex-1 outline-none text-gray-900 py-3"
                  />
                </div>
                <Button className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        {/* Filters Bar */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Desktop Filters */}
            <div className="hidden md:flex flex-wrap items-center gap-3">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="h-10 w-48 rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              >
                <option value="">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>

              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="h-10 w-48 rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              >
                <option value="">Company Size</option>
                {companySizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Location..."
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="h-10 w-40 rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              />

              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  verifiedOnly
                    ? "bg-primary-50 border-primary-300 text-primary-700"
                    : "bg-white border-secondary-300 text-secondary-700 hover:bg-secondary-50"
                }`}
              >
                <BadgeCheck className="h-4 w-4" />
                Verified Only
              </button>
            </div>

            {/* Mobile Filters Button */}
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="primary" size="sm" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <Card className="md:hidden mb-4">
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Industry
                  </label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                  >
                    <option value="">All Industries</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Company Size
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                  >
                    <option value="">Any Size</option>
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Location..."
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                  />
                </div>

                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    verifiedOnly
                      ? "bg-primary-50 border-primary-300 text-primary-700"
                      : "bg-white border-secondary-300 text-secondary-700"
                  }`}
                >
                  <BadgeCheck className="h-4 w-4" />
                  Verified Companies Only
                </button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-secondary-600">
            {isLoading ? (
              "Loading companies..."
            ) : (
              `${totalCount} ${totalCount === 1 ? "company" : "companies"} found`
            )}
          </p>
        </div>

        {/* Companies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-lg bg-secondary-200"
              />
            ))}
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Failed to load companies
              </h3>
              <p className="text-red-700 mb-6">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : companies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
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
        ) : (
          <Card className="border-dashed border-2 border-secondary-300">
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                No companies found
              </h3>
              <p className="text-secondary-600 mb-6">
                Try adjusting your search or filters to find more results
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
