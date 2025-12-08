"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Loader2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
  FileText,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function AdminReportsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<"overview" | "monthly" | "employers">("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/reports");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchReport();
    }
  }, [status, session, selectedYear]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reports/financial?year=${selectedYear}`);
      if (!response.ok) throw new Error("Failed to fetch report");

      const data = await response.json();
      setReport(data.report);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!report) return;

    const headers = ["Month", "Placements", "Revenue", "Collected", "Pending"];
    const rows = report.monthlyBreakdown.map((m: any) => [
      m.month,
      m.placements,
      m.revenue / 100,
      m.collected / 100,
      m.pending / 100,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r: any) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${selectedYear}.csv`;
    a.click();
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Financial Reports
            </h1>
            <p className="text-secondary-600">
              Revenue analytics and financial performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Year Selector */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-secondary-200 p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedYear(selectedYear - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-3 font-semibold text-secondary-900">{selectedYear}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedYear(selectedYear + 1)}
                disabled={selectedYear >= new Date().getFullYear()}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {report && (
          <>
            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    {report.comparison.yoyGrowth !== "N/A" && (
                      <Badge
                        variant={parseFloat(report.comparison.yoyGrowth) >= 0 ? "success" : "danger"}
                        size="sm"
                      >
                        {parseFloat(report.comparison.yoyGrowth) >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {report.comparison.yoyGrowth}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-secondary-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {report.summary.totalRevenueFormatted}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-secondary-600 mb-1">Collected</p>
                  <p className="text-2xl font-bold text-green-600">
                    {report.summary.totalCollectedFormatted}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">
                    {report.summary.collectionRate} collection rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-sm text-secondary-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {report.summary.totalPendingFormatted}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-secondary-600 mb-1">Placements</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {report.summary.totalPlacements}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">
                    Avg: {report.summary.avgPlacementValueFormatted}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 flex gap-2 border-b border-secondary-200">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-secondary-600 hover:text-secondary-900"
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("monthly")}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "monthly"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-secondary-600 hover:text-secondary-900"
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Monthly Breakdown
              </button>
              <button
                onClick={() => setActiveTab("employers")}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "employers"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-secondary-600 hover:text-secondary-900"
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Top Employers
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Quarterly Breakdown */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                      Quarterly Performance
                    </h3>
                    <div className="space-y-4">
                      {report.quarterlyBreakdown.map((q: any) => (
                        <div key={q.quarter} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center font-bold text-primary-700">
                              {q.quarter}
                            </div>
                            <div>
                              <p className="font-medium text-secondary-900">{q.revenueFormatted}</p>
                              <p className="text-xs text-secondary-500">{q.placements} placements</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">{q.collectedFormatted}</p>
                            <p className="text-xs text-secondary-500">collected</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Status */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                      Payment Status Breakdown
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="font-medium text-secondary-900">Fully Paid</span>
                        </div>
                        <span className="font-bold text-green-600">
                          {report.paymentBreakdown.fullyPaid}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span className="font-medium text-secondary-900">Partially Paid</span>
                        </div>
                        <span className="font-bold text-yellow-600">
                          {report.paymentBreakdown.partiallyPaid}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <span className="font-medium text-secondary-900">Pending</span>
                        </div>
                        <span className="font-bold text-red-600">
                          {report.paymentBreakdown.pending}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* YoY Comparison */}
                <Card className="lg:col-span-2">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                      Year-over-Year Comparison
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-secondary-50 rounded-lg">
                        <p className="text-sm text-secondary-600 mb-2">{selectedYear - 1} Revenue</p>
                        <p className="text-2xl font-bold text-secondary-900">
                          {report.comparison.lastYear.revenueFormatted}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          {report.comparison.lastYear.placements} placements
                        </p>
                      </div>
                      <div className="text-center p-4 bg-primary-50 rounded-lg">
                        <p className="text-sm text-secondary-600 mb-2">{selectedYear} Revenue</p>
                        <p className="text-2xl font-bold text-primary-600">
                          {report.summary.totalRevenueFormatted}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          {report.summary.totalPlacements} placements
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-secondary-600 mb-2">Growth</p>
                        <p className={`text-2xl font-bold ${
                          report.comparison.yoyGrowth !== "N/A" && parseFloat(report.comparison.yoyGrowth) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}>
                          {report.comparison.yoyGrowth}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "monthly" && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Monthly Revenue Breakdown
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-secondary-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Month</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-secondary-900">Placements</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-secondary-900">Revenue</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-secondary-900">Collected</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-secondary-900">Pending</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-secondary-100">
                        {report.monthlyBreakdown.map((m: any) => (
                          <tr key={m.month} className="hover:bg-secondary-50">
                            <td className="py-3 px-4 font-medium text-secondary-900">{m.month}</td>
                            <td className="py-3 px-4 text-right text-secondary-700">{m.placements}</td>
                            <td className="py-3 px-4 text-right font-medium text-secondary-900">
                              {m.revenueFormatted}
                            </td>
                            <td className="py-3 px-4 text-right text-green-600">
                              {m.collectedFormatted}
                            </td>
                            <td className="py-3 px-4 text-right text-yellow-600">
                              {m.pendingFormatted}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-secondary-300 bg-secondary-50">
                          <td className="py-3 px-4 font-bold text-secondary-900">Total</td>
                          <td className="py-3 px-4 text-right font-bold text-secondary-900">
                            {report.summary.totalPlacements}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-secondary-900">
                            {report.summary.totalRevenueFormatted}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-green-600">
                            {report.summary.totalCollectedFormatted}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-yellow-600">
                            {report.summary.totalPendingFormatted}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "employers" && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Top Employers by Revenue
                  </h3>
                  {report.topEmployers.length > 0 ? (
                    <div className="space-y-3">
                      {report.topEmployers.map((employer: any, index: number) => (
                        <div
                          key={employer.name}
                          className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-secondary-900">{employer.name}</p>
                              <p className="text-xs text-secondary-500">
                                {employer.placements} placement{employer.placements !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-primary-600">{employer.revenueFormatted}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-secondary-500">
                      No employer data available
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Placements */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Recent Placements
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Candidate</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Company</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Position</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-secondary-900">Fee</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                      {report.recentPlacements.map((p: any) => (
                        <tr key={p.id} className="hover:bg-secondary-50">
                          <td className="py-3 px-4 font-medium text-secondary-900">{p.candidate}</td>
                          <td className="py-3 px-4 text-secondary-700">{p.company}</td>
                          <td className="py-3 px-4 text-secondary-700">{p.jobTitle}</td>
                          <td className="py-3 px-4 text-right font-medium text-primary-600">
                            {p.feeFormatted}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                p.paymentStatus === "FULLY_PAID"
                                  ? "success"
                                  : p.paymentStatus === "UPFRONT_PAID"
                                  ? "primary"
                                  : "warning"
                              }
                              size="sm"
                            >
                              {p.paymentStatus.replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-secondary-500 text-sm">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
