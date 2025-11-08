"use client";

import { useState } from "react";
import { Briefcase, Filter, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { ApplicationDetailModal } from "@/components/applications/ApplicationDetailModal";
import { useApplications } from "@/hooks/useApplications";
import type { Application } from "@/types";

type FilterTab = "all" | "active" | "archived";
type SortOption = "recent" | "oldest" | "company";

export default function ApplicationsPage() {
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch applications
  const { data, isLoading, error, refetch } = useApplications();

  // Filter applications based on active tab
  const getFilteredApplications = () => {
    if (!data?.applications) return [];

    let filtered = [...data.applications];

    // Apply tab filter
    if (filterTab === "active") {
      filtered = filtered.filter(app =>
        ["PENDING", "REVIEWED", "SHORTLISTED", "INTERVIEW_SCHEDULED", "INTERVIEWED", "OFFERED"].includes(app.status)
      );
    } else if (filterTab === "archived") {
      filtered = filtered.filter(app =>
        ["REJECTED", "WITHDRAWN", "ACCEPTED"].includes(app.status)
      );
    }

    // Apply sorting
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime());
    } else if (sortBy === "company") {
      filtered.sort((a, b) => {
        const companyA = a.job?.employer?.companyName || "";
        const companyB = b.job?.employer?.companyName || "";
        return companyA.localeCompare(companyB);
      });
    }

    return filtered;
  };

  const filteredApplications = getFilteredApplications();

  // Calculate stats
  const totalApplications = data?.applications?.length || 0;
  const activeApplications = data?.applications?.filter(app =>
    ["PENDING", "REVIEWED", "SHORTLISTED", "INTERVIEW_SCHEDULED", "INTERVIEWED", "OFFERED"].includes(app.status)
  ).length || 0;
  const interviewsScheduled = data?.applications?.filter(app =>
    app.status === "INTERVIEW_SCHEDULED"
  ).length || 0;
  const responseRate = totalApplications > 0
    ? Math.round(((data?.applications?.filter(app => app.status !== "PENDING").length || 0) / totalApplications) * 100)
    : 0;

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  const handleWithdrawSuccess = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">
            You've applied to <span className="font-semibold text-primary-600">{totalApplications}</span> jobs
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-900">{totalApplications}</p>
                </div>
                <Briefcase className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium mb-1">Active Applications</p>
                  <p className="text-3xl font-bold text-green-900">{activeApplications}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium mb-1">Interviews Scheduled</p>
                  <p className="text-3xl font-bold text-purple-900">{interviewsScheduled}</p>
                </div>
                <Clock className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium mb-1">Response Rate</p>
                  <p className="text-3xl font-bold text-orange-900">{responseRate}%</p>
                </div>
                <CheckCircle className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sort */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <div className="flex gap-2">
                  <Button
                    variant={filterTab === "all" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilterTab("all")}
                  >
                    All Applications
                  </Button>
                  <Button
                    variant={filterTab === "active" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilterTab("active")}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filterTab === "archived" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilterTab("archived")}
                  >
                    Archived
                  </Button>
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest</option>
                  <option value="company">Company Name</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your applications...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Applications</h3>
              <p className="text-red-700 mb-4">There was an error loading your applications. Please try again.</p>
              <Button variant="primary" onClick={() => refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : filteredApplications.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-12 text-center">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filterTab === "all"
                  ? "You haven't applied to any jobs yet"
                  : filterTab === "active"
                  ? "No active applications"
                  : "No archived applications"}
              </h3>
              <p className="text-gray-600 mb-6">
                {filterTab === "all"
                  ? "Start your job search and apply to positions that match your skills"
                  : "Try changing your filter to see more applications"}
              </p>
              {filterTab === "all" && (
                <Button variant="primary" asChild>
                  <a href="/candidate/jobs">Browse Jobs</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onViewDetails={handleViewDetails}
                onWithdrawSuccess={handleWithdrawSuccess}
              />
            ))}
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedApplication(null);
          }}
          onWithdrawSuccess={handleWithdrawSuccess}
        />
      )}
    </div>
  );
}
