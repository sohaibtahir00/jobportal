"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Users,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Briefcase,
  MapPin,
  Mail,
  FileText,
} from "lucide-react";
import { Button, Badge, Card, CardContent, useToast } from "@/components/ui";

interface Candidate {
  id: string;
  headline: string | null;
  location: string | null;
  skills: string[];
  experience: number | null;
  resume: string | null;
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  verifiedAt: string | null;
  verificationNotes: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    emailVerified: string | null;
  };
  applicationsCount: number;
}

interface Summary {
  unverified: number;
  pending: number;
  verified: number;
  rejected: number;
  total: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminCandidatesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [activeTab, setActiveTab] = useState<"UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED" | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [verifyModal, setVerifyModal] = useState<{ isOpen: boolean; id: string | null; action: "verify" | "reject" | "pending" | null }>({ isOpen: false, id: null, action: null });
  const [verifyNotes, setVerifyNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/candidates");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchCandidates();
    }
  }, [status, session, activeTab, currentPage]);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      let url = `/api/admin/candidates/pending?page=${currentPage}&limit=20&status=${activeTab}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch candidates");

      const data = await response.json();
      setCandidates(data.candidates || []);
      setSummary(data.summary || null);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      showToast("error", "Error", "Failed to fetch candidates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCandidates();
  };

  const handleVerify = async () => {
    if (!verifyModal.id || !verifyModal.action) return;
    if (verifyModal.action === "reject" && !verifyNotes.trim()) {
      showToast("error", "Error", "Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/candidates/${verifyModal.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: verifyModal.action, notes: verifyNotes || undefined }),
      });

      if (response.ok) {
        const actionLabels = { verify: "verified", reject: "rejected", pending: "set to pending" };
        showToast("success", "Success", `Candidate has been ${actionLabels[verifyModal.action]}`);
        fetchCandidates();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update verification");
      }
    } catch (error: any) {
      showToast("error", "Error", error.message);
    } finally {
      setIsProcessing(false);
      setVerifyModal({ isOpen: false, id: null, action: null });
      setVerifyNotes("");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <Badge variant="success" size="sm"><Shield className="w-3 h-3 mr-1" />Verified</Badge>;
      case "REJECTED":
        return <Badge variant="danger" size="sm"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "PENDING":
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "UNVERIFIED":
      default:
        return <Badge variant="secondary" size="sm">Unverified</Badge>;
    }
  };

  if (status === "loading") {
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
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Candidate Management</h1>
          <p className="text-secondary-600">Verify and manage candidate profiles</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="mb-6 grid gap-4 md:grid-cols-5">
            <Card className={`cursor-pointer ${activeTab === "all" ? "ring-2 ring-primary-500" : ""}`} onClick={() => { setActiveTab("all"); setCurrentPage(1); }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.total}</p>
                    <p className="text-xs text-secondary-600">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${activeTab === "UNVERIFIED" ? "ring-2 ring-gray-500" : ""}`} onClick={() => { setActiveTab("UNVERIFIED"); setCurrentPage(1); }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.unverified}</p>
                    <p className="text-xs text-secondary-600">Unverified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${activeTab === "PENDING" ? "ring-2 ring-yellow-500" : ""}`} onClick={() => { setActiveTab("PENDING"); setCurrentPage(1); }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.pending}</p>
                    <p className="text-xs text-secondary-600">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${activeTab === "VERIFIED" ? "ring-2 ring-green-500" : ""}`} onClick={() => { setActiveTab("VERIFIED"); setCurrentPage(1); }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.verified}</p>
                    <p className="text-xs text-secondary-600">Verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${activeTab === "REJECTED" ? "ring-2 ring-red-500" : ""}`} onClick={() => { setActiveTab("REJECTED"); setCurrentPage(1); }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.rejected}</p>
                    <p className="text-xs text-secondary-600">Rejected</p>
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <Button variant="outline" onClick={() => fetchCandidates()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Candidates Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Candidates Found</h3>
                <p className="text-secondary-600">No candidates match your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200 bg-secondary-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Candidate</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Headline</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Experience</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Applications</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-100">
                    {candidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-secondary-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {candidate.user.image ? (
                              <img src={candidate.user.image} alt={candidate.user.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                                {candidate.user.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-secondary-900">{candidate.user.name}</p>
                              <p className="text-xs text-secondary-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />{candidate.user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-secondary-700 truncate max-w-xs">{candidate.headline || "No headline"}</p>
                          {candidate.location && (
                            <p className="text-xs text-secondary-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{candidate.location}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-secondary-700">{candidate.experience ? `${candidate.experience} years` : "N/A"}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-secondary-700">
                            <Briefcase className="w-4 h-4" />
                            <span className="text-sm">{candidate.applicationsCount}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(candidate.verificationStatus)}</td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-secondary-700">{new Date(candidate.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCandidate(candidate)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {candidate.verificationStatus !== "VERIFIED" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600"
                                onClick={() => setVerifyModal({ isOpen: true, id: candidate.id, action: "verify" })}
                              >
                                <Shield className="w-4 h-4" />
                              </Button>
                            )}
                            {candidate.verificationStatus !== "REJECTED" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => setVerifyModal({ isOpen: true, id: candidate.id, action: "reject" })}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-200">
                <p className="text-sm text-secondary-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-secondary-600">Page {pagination.page} of {pagination.totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pagination.totalPages}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-4 mb-4">
              {selectedCandidate.user.image ? (
                <img src={selectedCandidate.user.image} alt={selectedCandidate.user.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
                  {selectedCandidate.user.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-secondary-900">{selectedCandidate.user.name}</h2>
                  {getStatusBadge(selectedCandidate.verificationStatus)}
                </div>
                <p className="text-secondary-600">{selectedCandidate.headline || "No headline"}</p>
                <p className="text-sm text-secondary-500">{selectedCandidate.user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-secondary-500">Location</p>
                <p className="text-sm font-medium text-secondary-900">{selectedCandidate.location || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-500">Experience</p>
                <p className="text-sm font-medium text-secondary-900">{selectedCandidate.experience ? `${selectedCandidate.experience} years` : "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-500">Applications</p>
                <p className="text-sm font-medium text-secondary-900">{selectedCandidate.applicationsCount}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-500">Email Verified</p>
                <p className="text-sm font-medium text-secondary-900">{selectedCandidate.user.emailVerified ? "Yes" : "No"}</p>
              </div>
            </div>

            {selectedCandidate.skills.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-secondary-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" size="sm">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedCandidate.resume && (
              <div className="mb-4">
                <a href={selectedCandidate.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-600 hover:underline">
                  <FileText className="w-4 h-4" />View Resume
                </a>
              </div>
            )}

            {selectedCandidate.verificationNotes && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-600 mb-1">Verification Notes</p>
                <p className="text-sm text-yellow-700">{selectedCandidate.verificationNotes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              {selectedCandidate.verificationStatus !== "VERIFIED" && (
                <Button variant="primary" onClick={() => { setSelectedCandidate(null); setVerifyModal({ isOpen: true, id: selectedCandidate.id, action: "verify" }); }}>
                  <Shield className="w-4 h-4 mr-2" />Verify
                </Button>
              )}
              {selectedCandidate.verificationStatus !== "REJECTED" && (
                <Button variant="outline" className="text-red-600" onClick={() => { setSelectedCandidate(null); setVerifyModal({ isOpen: true, id: selectedCandidate.id, action: "reject" }); }}>
                  <XCircle className="w-4 h-4 mr-2" />Reject
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedCandidate(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Verify/Reject Modal */}
      {verifyModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-4">
              {verifyModal.action === "verify" ? "Verify Candidate" : verifyModal.action === "reject" ? "Reject Verification" : "Set to Pending"}
            </h2>
            <p className="text-secondary-600 mb-4">
              {verifyModal.action === "verify"
                ? "This will mark the candidate as verified. A verification badge will be visible on their profile."
                : verifyModal.action === "reject"
                ? "Please provide a reason for rejecting this candidate's verification."
                : "This will set the candidate's verification status to pending."}
            </p>
            <textarea
              value={verifyNotes}
              onChange={(e) => setVerifyNotes(e.target.value)}
              rows={3}
              placeholder={verifyModal.action === "reject" ? "Enter rejection reason (required)..." : "Add notes (optional)..."}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setVerifyModal({ isOpen: false, id: null, action: null }); setVerifyNotes(""); }}>
                Cancel
              </Button>
              <Button
                variant={verifyModal.action === "verify" ? "primary" : verifyModal.action === "reject" ? "danger" : "secondary"}
                onClick={handleVerify}
                disabled={isProcessing || (verifyModal.action === "reject" && !verifyNotes.trim())}
              >
                {isProcessing ? "Processing..." : verifyModal.action === "verify" ? "Verify" : verifyModal.action === "reject" ? "Reject" : "Set Pending"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
