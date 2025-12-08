"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Loader2,
  Users,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  UserPlus,
  UserMinus,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

interface Application {
  id: string;
  status: string;
  claimStatus: string;
  claimedAt: string | null;
  claimNotes: string | null;
  appliedAt: string;
  candidate: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    title: string | null;
    location: string | null;
  };
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
  };
  latestInterview: any;
  offer: any;
}

const STATUS_COLUMNS = [
  { key: "PENDING", label: "Applied", color: "bg-gray-100", icon: Clock },
  { key: "REVIEWED", label: "Reviewed", color: "bg-blue-100", icon: Users },
  { key: "SHORTLISTED", label: "Shortlisted", color: "bg-purple-100", icon: CheckCircle2 },
  { key: "INTERVIEW_SCHEDULED", label: "Interview", color: "bg-yellow-100", icon: Calendar },
  { key: "INTERVIEWED", label: "Interviewed", color: "bg-orange-100", icon: MessageSquare },
  { key: "OFFERED", label: "Offered", color: "bg-green-100", icon: Briefcase },
  { key: "ACCEPTED", label: "Accepted", color: "bg-emerald-100", icon: CheckCircle2 },
];

export default function AdminPipelinePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [statusGroups, setStatusGroups] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMyOnly, setShowMyOnly] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimNotes, setClaimNotes] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/pipeline");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchClaimedApplications();
    }
  }, [status, session, showMyOnly]);

  const fetchClaimedApplications = async () => {
    setIsLoading(true);
    try {
      let url = "/api/admin/applications/claimed?";
      if (showMyOnly) url += "myOnly=true&";
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setApplications(data.applications || []);
      setSummary(data.summary || null);
      setStatusGroups(data.statusGroups || null);
    } catch (error) {
      console.error("Failed to fetch claimed applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async (applicationId: string) => {
    setIsClaiming(true);
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: claimNotes }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to claim");
      }

      await fetchClaimedApplications();
      setShowClaimModal(false);
      setClaimNotes("");
      setSelectedApp(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleRelease = async (applicationId: string) => {
    if (!confirm("Are you sure you want to release this candidate?")) return;

    setIsReleasing(true);
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/release`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Released from pipeline" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to release");
      }

      await fetchClaimedApplications();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsReleasing(false);
    }
  };

  const getApplicationsByStatus = (statusKey: string) => {
    return applications.filter(app => app.status === statusKey);
  };

  const getClaimBadge = (claimStatus: string) => {
    switch (claimStatus) {
      case "CLAIMED":
        return <Badge variant="primary" size="sm">Claimed</Badge>;
      case "CONVERTED":
        return <Badge variant="success" size="sm">Converted</Badge>;
      case "RELEASED":
        return <Badge variant="secondary" size="sm">Released</Badge>;
      default:
        return null;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Candidate Pipeline
          </h1>
          <p className="text-secondary-600">
            Track and manage claimed candidates through the hiring process
          </p>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.claimed}</p>
                    <p className="text-xs text-secondary-600">Active Claims</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.converted}</p>
                    <p className="text-xs text-secondary-600">Converted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <UserMinus className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.released}</p>
                    <p className="text-xs text-secondary-600">Released</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.total}</p>
                    <p className="text-xs text-secondary-600">Total Pipeline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search candidates, jobs, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchClaimedApplications()}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <Button
            variant={showMyOnly ? "primary" : "outline"}
            onClick={() => setShowMyOnly(!showMyOnly)}
          >
            <Filter className="w-4 h-4 mr-2" />
            My Claims Only
          </Button>
          <Button variant="outline" onClick={fetchClaimedApplications}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Pipeline Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STATUS_COLUMNS.map((column) => {
              const columnApps = getApplicationsByStatus(column.key);
              const Icon = column.icon;

              return (
                <div
                  key={column.key}
                  className={`w-72 rounded-lg ${column.color} p-3`}
                >
                  {/* Column Header */}
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <Icon className="w-4 h-4 text-secondary-700" />
                    <span className="font-semibold text-secondary-900">{column.label}</span>
                    <Badge variant="secondary" size="sm" className="ml-auto">
                      {columnApps.length}
                    </Badge>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {columnApps.map((app) => (
                      <Card
                        key={app.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {app.candidate.image ? (
                                <img
                                  src={app.candidate.image}
                                  alt={app.candidate.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                                  {app.candidate.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-secondary-900 text-sm">
                                  {app.candidate.name}
                                </p>
                                <p className="text-xs text-secondary-500">
                                  {app.candidate.title || "Candidate"}
                                </p>
                              </div>
                            </div>
                            {getClaimBadge(app.claimStatus)}
                          </div>

                          <div className="mb-2">
                            <p className="text-xs font-medium text-secondary-700 truncate">
                              {app.job.title}
                            </p>
                            <p className="text-xs text-secondary-500 truncate">
                              {app.job.company}
                            </p>
                          </div>

                          {app.claimNotes && (
                            <p className="text-xs text-secondary-600 bg-yellow-50 p-2 rounded mb-2 line-clamp-2">
                              {app.claimNotes}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-secondary-100">
                            <span className="text-xs text-secondary-500">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                            {app.claimStatus === "CLAIMED" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRelease(app.id);
                                }}
                                disabled={isReleasing}
                                className="text-xs h-6 px-2"
                              >
                                Release
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {columnApps.length === 0 && (
                      <div className="text-center py-8 text-secondary-500 text-sm">
                        No candidates
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {applications.length === 0 && !isLoading && (
          <Card className="mt-8">
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                No Claimed Candidates
              </h3>
              <p className="text-secondary-600 mb-4">
                Start by claiming candidates from the applications list to track them here.
              </p>
              <Button variant="primary" onClick={() => router.push("/admin/applications")}>
                View Applications
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Claim Modal */}
        {showClaimModal && selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-4">
                Claim Candidate
              </h2>
              <p className="text-secondary-600 mb-4">
                You are claiming <strong>{selectedApp.candidate.name}</strong> for{" "}
                <strong>{selectedApp.job.title}</strong>
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes about this candidate..."
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowClaimModal(false);
                    setSelectedApp(null);
                    setClaimNotes("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleClaim(selectedApp.id)}
                  disabled={isClaiming}
                >
                  {isClaiming ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Claiming...</>
                  ) : (
                    <><UserPlus className="w-4 h-4 mr-2" />Claim</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
