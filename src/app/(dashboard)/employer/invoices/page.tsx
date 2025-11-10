"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FileText,
  Download,
  DollarSign,
  Calendar,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  placement: {
    candidate: {
      user: {
        name: string;
      };
    };
    job: {
      title: string;
    };
  };
}

export default function EmployerInvoicesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    overdue: 0,
    totalAmount: 0,
  });

  // Redirect if not logged in or not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/invoices");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "EMPLOYER") {
      fetchInvoices();
    }
  }, [status, session]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/employer/invoices");
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      const data = await response.json();
      setInvoices(data.invoices || []);

      // Calculate stats
      const total = data.invoices?.length || 0;
      const pending = data.invoices?.filter((i: Invoice) => i.status === "PENDING").length || 0;
      const paid = data.invoices?.filter((i: Invoice) => i.status === "PAID").length || 0;
      const overdue = data.invoices?.filter((i: Invoice) =>
        i.status === "PENDING" && new Date(i.dueDate) < new Date()
      ).length || 0;
      const totalAmount = data.invoices?.reduce((sum: number, i: Invoice) => sum + i.amount, 0) || 0;

      setStats({ total, pending, paid, overdue, totalAmount });
    } catch (err: any) {
      setError(err.message || "Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (invoice: Invoice) => {
    if (invoice.status === "PAID") {
      return (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      );
    }

    // Check if overdue
    const isOverdue = new Date(invoice.dueDate) < new Date();
    if (isOverdue) {
      return (
        <Badge variant="danger" size="sm">
          <AlertCircle className="w-3 h-3 mr-1" />
          Overdue
        </Badge>
      );
    }

    return (
      <Badge variant="warning" size="sm">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const downloadInvoice = (invoiceId: string) => {
    // Implement download functionality
    window.open(`/api/employer/invoices/${invoiceId}/download`, "_blank");
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Invoices</h1>
          <p className="text-secondary-600">
            Manage your placement fees and invoices
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">Total Invoices</p>
                  <p className="text-3xl font-bold text-secondary-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-secondary-900">{stats.pending}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">Overdue</p>
                  <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-secondary-900">
                    ${stats.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invoices List */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                All Invoices
              </h2>
              {stats.overdue > 0 && (
                <Badge variant="danger" size="lg">
                  {stats.overdue} Overdue
                </Badge>
              )}
            </div>

            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  No Invoices Yet
                </h3>
                <p className="text-secondary-600">
                  Invoices will appear here once you have successful placements
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                        Invoice #
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                        Placement
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                        Due Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-100">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-secondary-50">
                        <td className="py-4 px-4">
                          <p className="font-mono font-medium text-secondary-900">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="text-xs text-secondary-600">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-secondary-900">
                              {invoice.placement.candidate.user.name}
                            </p>
                            <p className="text-sm text-secondary-600">
                              {invoice.placement.job.title}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-secondary-900">
                            ${invoice.amount.toLocaleString()}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-secondary-400" />
                            <div>
                              <p className="text-sm text-secondary-900">
                                {new Date(invoice.dueDate).toLocaleDateString()}
                              </p>
                              {invoice.paidAt && (
                                <p className="text-xs text-green-600">
                                  Paid {new Date(invoice.paidAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(invoice)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadInvoice(invoice.id)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
