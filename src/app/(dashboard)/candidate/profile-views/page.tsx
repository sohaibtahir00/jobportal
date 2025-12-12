"use client";

import { useState, useEffect } from "react";
import { Eye, TrendingUp, TrendingDown, Users, Calendar, Loader2, Building2, MapPin, Briefcase, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { api } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";

interface ProfileView {
  id: string;
  viewedAt: string;
  source: string | null;
  employer: {
    id: string;
    companyName: string;
    companyLogo: string | null;
    industry: string | null;
    location: string | null;
  };
  job: {
    id: string;
    title: string;
    location: string;
  } | null;
}

interface ProfileViewsResponse {
  views: ProfileView[];
  stats: {
    totalViews: number;
    thisWeek: number;
    uniqueViewers: number;
    trend: number;
  };
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function ProfileViewsPage() {
  const [data, setData] = useState<ProfileViewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProfileViews();
  }, [currentPage]);

  const fetchProfileViews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<ProfileViewsResponse>(
        `/api/profile-views?page=${currentPage}&limit=20`
      );
      setData(response.data);
    } catch (err: any) {
      console.error("Failed to fetch profile views:", err);
      setError(err.response?.data?.error || "Failed to load profile views");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getSourceBadge = (source: string | null) => {
    const sourceMap: Record<string, { label: string; color: string }> = {
      search: { label: "Search", color: "bg-blue-100 text-blue-800" },
      application: { label: "Application", color: "bg-green-100 text-green-800" },
      recommendation: { label: "Recommendation", color: "bg-purple-100 text-purple-800" },
      job_post: { label: "Job Post", color: "bg-orange-100 text-orange-800" },
      direct: { label: "Direct", color: "bg-gray-100 text-gray-800" },
    };

    const sourceInfo = sourceMap[source || "direct"] || sourceMap.direct;
    return (
      <Badge className={`${sourceInfo.color} border-0`} size="sm">
        {sourceInfo.label}
      </Badge>
    );
  };

  if (isLoading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-600">Loading your profile views...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-900 mb-2">Failed to Load Profile Views</h2>
              <p className="text-red-700 mb-6">{error}</p>
              <Button onClick={fetchProfileViews} variant="primary">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stats = data?.stats || { totalViews: 0, thisWeek: 0, uniqueViewers: 0, trend: 0 };
  const views = data?.views || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Views</h1>
          <p className="text-gray-600">
            Track who's viewing your profile and how you're being discovered
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.totalViews}</p>
                </div>
                <Eye className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium mb-1">This Week</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.thisWeek}</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium mb-1">Unique Viewers</p>
                  <p className="text-3xl font-bold text-green-900">{stats.uniqueViewers}</p>
                </div>
                <Users className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium mb-1">Trend</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-orange-900">
                      {stats.trend > 0 ? "+" : ""}{stats.trend}%
                    </p>
                    {stats.trend > 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : stats.trend < 0 ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : null}
                  </div>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Views List */}
        {views.length === 0 ? (
          <Card variant="accent" className="bg-white">
            <CardContent className="p-12 text-center">
              <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Profile Views Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Employers haven't viewed your profile yet. Make sure your profile is complete and up-to-date to attract more views.
              </p>
              <Link
                href="/candidate/profile"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
              >
                Update Your Profile
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {views.map((view) => (
              <Card key={view.id} variant="accent" className="bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Company Logo */}
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {view.employer.companyLogo ? (
                          <img
                            src={resolveImageUrl(view.employer.companyLogo) || ''}
                            alt={view.employer.companyName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building2 className="w-8 h-8 text-purple-600" />
                        )}
                      </div>

                      {/* View Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {view.employer.companyName}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              {view.employer.industry && (
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {view.employer.industry}
                                </span>
                              )}
                              {view.employer.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {view.employer.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm text-gray-500 mb-1">{formatDate(view.viewedAt)}</p>
                            {getSourceBadge(view.source)}
                          </div>
                        </div>

                        {/* Job Context */}
                        {view.job && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              Viewed from job:{" "}
                              <Link
                                href={`/jobs/${view.job.id}`}
                                className="font-medium text-purple-600 hover:text-purple-700"
                              >
                                {view.job.title}
                              </Link>
                              {view.job.location && ` • ${view.job.location}`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!data.pagination.hasPrev || isLoading}
                >
                  Previous
                </Button>

                <span className="px-4 py-2 text-gray-700">
                  Page {data.pagination.page} of {data.pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!data.pagination.hasNext || isLoading}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
