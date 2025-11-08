"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Trash2, AlertCircle, Briefcase, CheckCircle } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { SavedJobCard } from "@/components/saved-jobs/SavedJobCard";
import { useSavedJobs, useClearAllSavedJobs } from "@/hooks/useSavedJobs";

export default function SavedJobsPage() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { data, isLoading, error, refetch } = useSavedJobs();
  const clearAllMutation = useClearAllSavedJobs();

  const savedJobs = data?.savedJobs || [];
  const totalCount = data?.pagination?.total || 0;

  const handleClearAll = async () => {
    try {
      await clearAllMutation.mutateAsync();
      setShowClearConfirm(false);
      refetch();
    } catch (error) {
      console.error("Failed to clear saved jobs:", error);
    }
  };

  const handleUnsaveSuccess = () => {
    refetch();
  };

  // Check for jobs that are about to expire (within 7 days)
  const expiringJobs = savedJobs.filter((savedJob) => {
    if (savedJob.job.status !== "ACTIVE") return false;
    // This is a placeholder - you'd need a deadline field on the job
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
            <p className="text-gray-600">
              You have <span className="font-semibold text-primary-600">{totalCount}</span> saved job
              {totalCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Clear All Button */}
          {totalCount > 0 && !showClearConfirm && (
            <Button
              variant="outline"
              onClick={() => setShowClearConfirm(true)}
              className="text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}

          {/* Clear All Confirmation */}
          {showClearConfirm && (
            <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-700 font-medium">
                Clear all {totalCount} saved jobs?
              </span>
              <Button
                variant="danger"
                size="sm"
                onClick={handleClearAll}
                disabled={clearAllMutation.isPending}
              >
                {clearAllMutation.isPending ? "Clearing..." : "Yes, Clear All"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearConfirm(false)}
                disabled={clearAllMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Expiring Jobs Alert */}
        {expiringJobs.length > 0 && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">
                    {expiringJobs.length} saved job{expiringJobs.length !== 1 ? "s" : ""} expiring soon
                  </h3>
                  <p className="text-sm text-yellow-800">
                    Some of your saved jobs have approaching deadlines. Apply soon to not miss out!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Jobs List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your saved jobs...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Saved Jobs</h3>
              <p className="text-red-700 mb-4">There was an error loading your saved jobs. Please try again.</p>
              <Button variant="primary" onClick={() => refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : savedJobs.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-12 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <Briefcase className="h-16 w-16 text-gray-300" />
                  <Heart className="h-8 w-8 text-gray-400 absolute -top-2 -right-2" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">You haven't saved any jobs yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start saving jobs to easily find them later. Click the heart icon on any job to add it to your
                saved list.
              </p>
              <Button variant="primary" asChild>
                <Link href="/candidate/jobs">Browse Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((savedJob) => (
              <SavedJobCard
                key={savedJob.id}
                savedJob={savedJob}
                onUnsaveSuccess={handleUnsaveSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
