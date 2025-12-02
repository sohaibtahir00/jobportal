"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Users,
  Search,
  Filter,
  Loader2,
  UserCheck,
  UserX,
  Crown,
  Building2,
  User as UserIcon,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input, ConfirmationModal, useToast } from "@/components/ui";

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [suspendModal, setSuspendModal] = useState<{ isOpen: boolean; userId: string | null; userName: string }>({ isOpen: false, userId: null, userName: "" });

  // Redirect if not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/users");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchUsers();
    }
  }, [status, session, currentPage, roleFilter, statusFilter, searchQuery]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        includeStats: "true",
      });

      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.users || []);
      setStats(data.stats);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Suspended by admin" }),
      });

      if (response.ok) {
        fetchUsers();
        showToast("success", "User Suspended", "The user has been suspended successfully.");
      } else {
        showToast("error", "Suspension Failed", "Failed to suspend the user.");
      }
    } catch (error) {
      console.error("Failed to suspend user:", error);
      showToast("error", "Suspension Failed", "An error occurred while suspending the user.");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge variant="danger" size="sm">
            <Crown className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case "EMPLOYER":
        return (
          <Badge variant="primary" size="sm">
            <Building2 className="w-3 h-3 mr-1" />
            Employer
          </Badge>
        );
      case "CANDIDATE":
        return (
          <Badge variant="secondary" size="sm">
            <UserIcon className="w-3 h-3 mr-1" />
            Candidate
          </Badge>
        );
      default:
        return <Badge variant="secondary" size="sm">{role}</Badge>;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            User Management
          </h1>
          <p className="text-secondary-600">
            Manage all users across the platform
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {(stats.byRole?.ADMIN || 0) + (stats.byRole?.EMPLOYER || 0) + (stats.byRole?.CANDIDATE || 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Candidates</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {stats.byRole?.CANDIDATE || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Employers</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {stats.byRole?.EMPLOYER || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary-600 mb-1">Suspended</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.byStatus?.suspended || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="CANDIDATE">Candidates</option>
                <option value="EMPLOYER">Employers</option>
                <option value="ADMIN">Admins</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Joined
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-secondary-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-secondary-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-secondary-600">
                            {user.email}
                          </p>
                          {user.candidate && (
                            <p className="text-xs text-secondary-500 mt-1">
                              {user.candidate.location || "No location"}
                            </p>
                          )}
                          {user.employer && (
                            <p className="text-xs text-secondary-500 mt-1">
                              {user.employer.companyName || "No company"}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-4 px-4">
                        {user.isSuspended ? (
                          <Badge variant="danger" size="sm">
                            <UserX className="w-3 h-3 mr-1" />
                            Suspended
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-secondary-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        {!user.isSuspended && user.role !== "ADMIN" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSuspendModal({ isOpen: true, userId: user.id, userName: user.name })}
                          >
                            Suspend
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-secondary-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Suspend Confirmation Modal */}
      <ConfirmationModal
        isOpen={suspendModal.isOpen}
        onClose={() => setSuspendModal({ isOpen: false, userId: null, userName: "" })}
        onConfirm={() => { if (suspendModal.userId) handleSuspend(suspendModal.userId); }}
        title="Suspend User"
        message={`Are you sure you want to suspend ${suspendModal.userName || "this user"}? They will no longer be able to access their account.`}
        confirmText="Suspend"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
