"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Building,
  Award,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setDashboardData({
          overview: {
            totalCandidates: 12450,
            candidatesChange: 12.5,
            totalEmployers: 890,
            employersChange: 8.3,
            activeJobs: 2340,
            jobsChange: -3.2,
            assessmentsTaken: 8920,
            assessmentsChange: 15.7,
            totalRevenue: 1245000,
            revenueChange: 22.4,
            successfulHires: 456,
            hiresChange: 18.9,
          },
          recentActivity: [
            {
              id: "1",
              type: "candidate",
              action: "New candidate registered",
              name: "Sarah Chen",
              timestamp: "5 minutes ago",
            },
            {
              id: "2",
              type: "job",
              action: "New job posted",
              name: "Senior ML Engineer at TechCorp AI",
              timestamp: "12 minutes ago",
            },
            {
              id: "3",
              type: "assessment",
              action: "Skills assessment completed",
              name: "Michael Rodriguez - Score: 92",
              timestamp: "25 minutes ago",
            },
            {
              id: "4",
              type: "employer",
              action: "New employer registered",
              name: "FinTech Solutions",
              timestamp: "1 hour ago",
            },
            {
              id: "5",
              type: "hire",
              action: "Successful hire",
              name: "Emily Watson hired for DevOps Engineer",
              timestamp: "2 hours ago",
            },
          ],
          topPerformers: [
            { name: "Sarah Chen", score: 95, tier: "Elite" },
            { name: "David Kim", score: 93, tier: "Elite" },
            { name: "Lisa Patel", score: 91, tier: "Elite" },
            { name: "James Wilson", score: 89, tier: "Advanced" },
            { name: "Maria Garcia", score: 87, tier: "Advanced" },
          ],
          topEmployers: [
            { name: "TechCorp AI", hires: 45, revenue: "$67,500" },
            { name: "DataStart Inc", hires: 38, revenue: "$57,000" },
            { name: "FinTech Solutions", hires: 32, revenue: "$48,000" },
            { name: "CloudTech Inc", hires: 28, revenue: "$42,000" },
            { name: "StartupXYZ", hires: 24, revenue: "$36,000" },
          ],
        });

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      loadDashboard();
    }
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || !dashboardData) {
    return null;
  }

  const { overview, recentActivity, topPerformers, topEmployers } = dashboardData;

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">
              Admin Dashboard
            </h1>
            <p className="text-secondary-600">Platform overview and analytics</p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Candidates */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Total Candidates</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      {overview.totalCandidates.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUp className="h-4 w-4 text-success-600" />
                      <span className="font-semibold text-success-600">
                        {overview.candidatesChange}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Employers */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Total Employers</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      {overview.totalEmployers.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUp className="h-4 w-4 text-success-600" />
                      <span className="font-semibold text-success-600">
                        {overview.employersChange}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                    <Building className="h-6 w-6 text-accent-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Jobs */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Active Jobs</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      {overview.activeJobs.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowDown className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-red-600">
                        {Math.abs(overview.jobsChange)}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                    <Briefcase className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessments Taken */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Assessments Taken</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      {overview.assessmentsTaken.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUp className="h-4 w-4 text-success-600" />
                      <span className="font-semibold text-success-600">
                        {overview.assessmentsChange}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
                    <Award className="h-6 w-6 text-success-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Total Revenue</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      ${(overview.totalRevenue / 1000).toFixed(0)}k
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUp className="h-4 w-4 text-success-600" />
                      <span className="font-semibold text-success-600">
                        {overview.revenueChange}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Successful Hires */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-secondary-600">Successful Hires</p>
                    <p className="mb-2 text-3xl font-bold text-secondary-900">
                      {overview.successfulHires}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUp className="h-4 w-4 text-success-600" />
                      <span className="font-semibold text-success-600">
                        {overview.hiresChange}%
                      </span>
                      <span className="text-secondary-600">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <CheckCircle2 className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-bold text-secondary-900">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((activity: any) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 border-b border-secondary-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                        activity.type === "candidate" ? "bg-primary-100" :
                        activity.type === "employer" ? "bg-accent-100" :
                        activity.type === "job" ? "bg-yellow-100" :
                        activity.type === "assessment" ? "bg-success-100" :
                        "bg-green-100"
                      }`}>
                        {activity.type === "candidate" && <Users className="h-5 w-5 text-primary-600" />}
                        {activity.type === "employer" && <Building className="h-5 w-5 text-accent-600" />}
                        {activity.type === "job" && <Briefcase className="h-5 w-5 text-yellow-600" />}
                        {activity.type === "assessment" && <Award className="h-5 w-5 text-success-600" />}
                        {activity.type === "hire" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-secondary-600">{activity.name}</p>
                        <p className="mt-1 text-xs text-secondary-500">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-6 w-full" size="sm">
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-bold text-secondary-900">
                  Top Performing Candidates
                </h2>
                <div className="space-y-3">
                  {topPerformers.map((performer: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-secondary-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">
                            {performer.name}
                          </p>
                          <Badge variant="secondary" size="sm">
                            {performer.tier}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">
                          {performer.score}
                        </p>
                        <p className="text-xs text-secondary-600">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-6 w-full" size="sm" asChild>
                  <Link href="/admin/candidates">View All Candidates</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Top Employers */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="mb-6 text-xl font-bold text-secondary-900">
                Top Employers by Revenue
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200 text-left">
                      <th className="pb-3 text-sm font-semibold text-secondary-700">Rank</th>
                      <th className="pb-3 text-sm font-semibold text-secondary-700">Company</th>
                      <th className="pb-3 text-sm font-semibold text-secondary-700">Hires</th>
                      <th className="pb-3 text-sm font-semibold text-secondary-700">Revenue</th>
                      <th className="pb-3 text-sm font-semibold text-secondary-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topEmployers.map((employer: any, idx: number) => (
                      <tr key={idx} className="border-b border-secondary-100 last:border-0">
                        <td className="py-3 text-secondary-900">{idx + 1}</td>
                        <td className="py-3 font-semibold text-secondary-900">{employer.name}</td>
                        <td className="py-3 text-secondary-700">{employer.hires}</td>
                        <td className="py-3 font-semibold text-green-600">{employer.revenue}</td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-6 w-full" size="sm" asChild>
                <Link href="/admin/employers">View All Employers</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Button variant="primary" asChild>
              <Link href="/admin/jobs">Manage Jobs</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/candidates">Manage Candidates</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/employers">Manage Employers</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/assessments">View Assessments</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
