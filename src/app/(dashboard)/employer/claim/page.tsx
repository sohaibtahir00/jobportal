"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Search,
  Briefcase,
  Users,
  CheckCircle,
  Calendar,
  Eye,
  Award,
  Phone,
  Mail,
  DollarSign,
  Loader2,
  X,
  Clock,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Input,
  EmptyState,
  useToast,
} from "@/components/ui";
import { useClaimedJobs, useSearchUnclaimedJobs, useClaimJob } from "@/hooks/useJobs";
import { AgreementGate } from "@/components/employer/AgreementGate";

interface ClaimFormData {
  phone: string;
  roleLevel: string;
  salaryMin: string;
  salaryMax: string;
  startDateNeeded: string;
  candidatesNeeded: string;
}

export default function EmployerClaimPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();

  // Claimed jobs data
  const { data: claimedData, isLoading: isLoadingClaimed } = useClaimedJobs();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const { data: searchData, isLoading: isSearching } = useSearchUnclaimedJobs(
    searchQuery,
    isSearchEnabled
  );

  // Claim modal state
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [formData, setFormData] = useState<ClaimFormData>({
    phone: "",
    roleLevel: "",
    salaryMin: "",
    salaryMax: "",
    startDateNeeded: "",
    candidatesNeeded: "10",
  });

  const claimMutation = useClaimJob(selectedJob?.id || "");

  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      setIsSearchEnabled(true);
    }
  };

  const handleClaimClick = (job: any) => {
    setSelectedJob(job);
    // Pre-fill form with job data
    setFormData({
      phone: "",
      roleLevel: job.experienceLevel || "",
      salaryMin: job.salaryMin?.toString() || "",
      salaryMax: job.salaryMax?.toString() || "",
      startDateNeeded: "",
      candidatesNeeded: "10",
    });
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await claimMutation.mutateAsync({
        phone: formData.phone,
        roleLevel: formData.roleLevel,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        startDateNeeded: formData.startDateNeeded || undefined,
        candidatesNeeded: formData.candidatesNeeded ? parseInt(formData.candidatesNeeded) : 10,
      });

      showToast(
        "success",
        "Job Claimed Successfully!",
        result.message
      );

      // Close modal and reset
      setSelectedJob(null);
      setFormData({
        phone: "",
        roleLevel: "",
        salaryMin: "",
        salaryMax: "",
        startDateNeeded: "",
        candidatesNeeded: "10",
      });

      // Refresh search
      setIsSearchEnabled(false);
      setTimeout(() => setIsSearchEnabled(true), 500);
    } catch (error: any) {
      showToast(
        "error",
        "Claim Failed",
        error.response?.data?.message || "Failed to claim job. Please try again."
      );
    }
  };

  const claimedJobs = claimedData?.claimedJobs || [];
  const unclaimedJobs = searchData?.jobs || [];

  return (
    <AgreementGate>
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Claim Jobs</h1>
        <p className="text-secondary-600 mt-2">
          Claim and manage jobs posted on other platforms
        </p>
      </div>

      {/* ===================================================================== */}
      {/* CLAIMED JOBS SECTION */}
      {/* ===================================================================== */}
      {isLoadingClaimed ? (
        <Card className="mb-8">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
            <p className="text-secondary-600 mt-4">Loading claimed jobs...</p>
          </CardContent>
        </Card>
      ) : claimedJobs.length > 0 ? (
        <div className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Claimed Jobs</CardTitle>
                  <p className="text-sm text-secondary-600 mt-1">
                    {claimedData?.totalClaimed} job{claimedData?.totalClaimed !== 1 ? "s" : ""} claimed •{" "}
                    {claimedData?.totalApplicants} total applicant{claimedData?.totalApplicants !== 1 ? "s" : ""} •{" "}
                    {claimedData?.totalSkillsVerified} skills-verified
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claimedJobs.map((job: any) => (
                  <div
                    key={job.id}
                    className="border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <Briefcase className="h-5 w-5 text-primary-600 mt-1" />
                          <div>
                            <h3 className="text-lg font-semibold text-secondary-900">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-secondary-600">
                              <span>{job.location}</span>
                              <span>•</span>
                              <span>{job.type}</span>
                              {job.salaryMin && job.salaryMax && (
                                <>
                                  <span>•</span>
                                  <span>
                                    ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="bg-secondary-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-sm text-secondary-600 mb-1">
                              <Calendar className="h-4 w-4" />
                              Claimed
                            </div>
                            <p className="text-sm font-semibold text-secondary-900">
                              {new Date(job.claimedAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                              <Users className="h-4 w-4" />
                              Applicants
                            </div>
                            <p className="text-sm font-semibold text-blue-900">
                              {job.applicantsCount}
                            </p>
                          </div>

                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-sm text-green-600 mb-1">
                              <Award className="h-4 w-4" />
                              Skills-Verified
                            </div>
                            <p className="text-sm font-semibold text-green-900">
                              {job.skillsVerifiedCount}
                            </p>
                          </div>

                          <div className="bg-purple-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-sm text-purple-600 mb-1">
                              <CheckCircle className="h-4 w-4" />
                              Status
                            </div>
                            <Badge
                              variant={job.status === "ACTIVE" ? "success" : "secondary"}
                              size="sm"
                            >
                              {job.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Tier Breakdown */}
                        {job.skillsVerifiedCount > 0 && (
                          <div className="mt-4 pt-4 border-t border-secondary-200">
                            <p className="text-xs font-medium text-secondary-700 mb-2">
                              Skills Tier Breakdown
                            </p>
                            <div className="flex items-center gap-4">
                              {job.tierBreakdown.ELITE > 0 && (
                                <Badge variant="danger" size="sm">
                                  Elite: {job.tierBreakdown.ELITE}
                                </Badge>
                              )}
                              {job.tierBreakdown.ADVANCED > 0 && (
                                <Badge variant="primary" size="sm">
                                  Advanced: {job.tierBreakdown.ADVANCED}
                                </Badge>
                              )}
                              {job.tierBreakdown.INTERMEDIATE > 0 && (
                                <Badge variant="secondary" size="sm">
                                  Intermediate: {job.tierBreakdown.INTERMEDIATE}
                                </Badge>
                              )}
                              {job.tierBreakdown.BEGINNER > 0 && (
                                <Badge variant="outline" size="sm">
                                  Beginner: {job.tierBreakdown.BEGINNER}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="primary"
                        onClick={() => router.push(`/employer/jobs/${job.id}/applicants`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Applicants
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* ===================================================================== */}
      {/* CLAIM NEW JOB SECTION */}
      {/* ===================================================================== */}
      <Card>
        <CardHeader>
          <CardTitle>
            {claimedJobs.length > 0 ? "Claim More Jobs" : "Claim Your Jobs"}
          </CardTitle>
          <p className="text-sm text-secondary-600 mt-1">
            Search for your company's jobs that have been posted on other platforms
          </p>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search for your company's jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={searchQuery.trim().length < 2}
              loading={isSearching}
            >
              Search
            </Button>
          </div>

          {/* Search Results */}
          {isSearchEnabled && (
            <>
              {isSearching ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
                  <p className="text-secondary-600 mt-4">Searching for jobs...</p>
                </div>
              ) : unclaimedJobs.length > 0 ? (
                <div>
                  <p className="text-sm text-secondary-700 mb-4">
                    {searchData?.message}
                  </p>
                  <div className="space-y-4">
                    {unclaimedJobs.map((job: any) => (
                      <div
                        key={job.id}
                        className="border-2 border-primary-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-primary-50/30"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <Briefcase className="h-5 w-5 text-primary-600 mt-1" />
                              <div>
                                <h3 className="text-lg font-semibold text-secondary-900">
                                  {job.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-secondary-600">
                                  <span>{job.location}</span>
                                  <span>•</span>
                                  <span>{job.type}</span>
                                  <span>•</span>
                                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-secondary-700 mb-3 line-clamp-2">
                              {job.description}
                            </p>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-blue-600" />
                                <span className="text-secondary-700">
                                  {job.applicationCount} applicant{job.applicationCount !== 1 ? "s" : ""}
                                </span>
                              </div>
                              {job.salaryMin && job.salaryMax && (
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="text-secondary-700">
                                    ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="primary"
                            onClick={() => handleClaimClick(job)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Claim This Job
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={AlertCircle}
                  title="No unclaimed jobs found"
                  description={`No unclaimed jobs found for "${searchQuery}". Try a different search term or post a new job instead.`}
                  action={{
                    label: "Post a New Job",
                    onClick: () => router.push("/employer/jobs/new"),
                  }}
                />
              )}
            </>
          )}

          {!isSearchEnabled && claimedJobs.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-600">
                Search for your company name to find jobs you can claim
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===================================================================== */}
      {/* CLAIM FORM MODAL */}
      {/* ===================================================================== */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-secondary-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900">Claim Job</h2>
                  <p className="text-sm text-secondary-600 mt-1">{selectedJob.title}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitClaim} className="p-6 space-y-6">
              {/* Company Info (Pre-filled, Display Only) */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <p className="text-sm font-medium text-secondary-700 mb-2">Job Information</p>
                <div className="space-y-1 text-sm text-secondary-600">
                  <p><strong>Title:</strong> {selectedJob.title}</p>
                  <p><strong>Company:</strong> {selectedJob.employer?.companyName}</p>
                  <p><strong>Location:</strong> {selectedJob.location}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  value={session?.user?.name || ""}
                  disabled
                  leftIcon={<Mail className="h-4 w-4" />}
                />
                <Input
                  label="Your Email"
                  value={session?.user?.email || ""}
                  disabled
                  leftIcon={<Mail className="h-4 w-4" />}
                />
              </div>

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                leftIcon={<Phone className="h-4 w-4" />}
              />

              {/* Role Level */}
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Role Level Confirmation *
                </label>
                <select
                  value={formData.roleLevel}
                  onChange={(e) => setFormData({ ...formData, roleLevel: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select level...</option>
                  <option value="ENTRY">Entry Level</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior</option>
                  <option value="LEAD">Lead</option>
                </select>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Min Salary"
                  type="number"
                  placeholder="100000"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                  leftIcon={<DollarSign className="h-4 w-4" />}
                />
                <Input
                  label="Max Salary"
                  type="number"
                  placeholder="150000"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                  leftIcon={<DollarSign className="h-4 w-4" />}
                />
              </div>

              {/* Start Date */}
              <Input
                label="Start Date Needed"
                type="date"
                value={formData.startDateNeeded}
                onChange={(e) => setFormData({ ...formData, startDateNeeded: e.target.value })}
                leftIcon={<Calendar className="h-4 w-4" />}
              />

              {/* Candidates Needed */}
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  How many candidates do you want to review?
                </label>
                <select
                  value={formData.candidatesNeeded}
                  onChange={(e) => setFormData({ ...formData, candidatesNeeded: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="5">5 candidates</option>
                  <option value="10">10 candidates</option>
                  <option value="15">15 candidates</option>
                  <option value="20">20+ candidates</option>
                </select>
              </div>

              {/* What Happens Next */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                      What happens after you submit:
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>✓ Our team will call you within 24 hours</li>
                      <li>✓ We'll show you the qualified candidates immediately</li>
                      <li>✓ You'll see their Skills Score Cards and profiles</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedJob(null)}
                  disabled={claimMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={claimMutation.isPending}
                  loadingText="Claiming job..."
                >
                  Submit Claim
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </AgreementGate>
  );
}
