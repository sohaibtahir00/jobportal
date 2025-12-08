"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Loader2,
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Calendar,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceType: string;
  status: string;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  recipientName: string;
  recipientEmail: string;
  companyName: string;
  subject: string;
  placement: {
    id: string;
    jobTitle: string;
    candidate: string;
  } | null;
  createdAt: string;
}

export default function AdminInvoicesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/invoices");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchInvoices();
    }
  }, [status, session, statusFilter]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      // Fetch invoices from placements (since invoices are linked to placements)
      const response = await fetch("/api/admin/placements");
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      // Extract invoices from placements
      const allInvoices: Invoice[] = [];
      let totalAmount = 0;
      let paidAmount = 0;
      let pendingAmount = 0;
      let overdueCount = 0;

      data.placements?.forEach((placement: any) => {
        placement.invoices?.forEach((invoice: any) => {
          allInvoices.push({
            ...invoice,
            placement: {
              id: placement.id,
              jobTitle: placement.jobTitle,
              candidate: placement.candidate?.name,
            },
          });

          totalAmount += invoice.amount || 0;
          if (invoice.status === "PAID") {
            paidAmount += invoice.amount || 0;
          } else {
            pendingAmount += invoice.amount || 0;
            if (new Date(invoice.dueDate) < new Date()) {
              overdueCount++;
            }
          }
        });
      });

      // Sort by date (newest first)
      allInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Apply status filter
      let filtered = allInvoices;
      if (statusFilter !== "all") {
        filtered = allInvoices.filter(inv => inv.status === statusFilter);
      }

      setInvoices(filtered);
      setSummary({
        total: allInvoices.length,
        totalAmount,
        paidAmount,
        pendingAmount,
        overdueCount,
      });
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (invoice: Invoice) => {
    const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== "PAID";

    if (invoice.status === "PAID") {
      return <Badge variant="success" size="sm"><CheckCircle2 className="w-3 h-3 mr-1" />Paid</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="danger" size="sm"><AlertCircle className="w-3 h-3 mr-1" />Overdue</Badge>;
    }
    if (invoice.status === "SENT") {
      return <Badge variant="primary" size="sm"><Send className="w-3 h-3 mr-1" />Sent</Badge>;
    }
    return <Badge variant="warning" size="sm"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const filteredInvoices = invoices.filter(inv =>
    searchQuery === "" ||
    inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.recipientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Invoices
          </h1>
          <p className="text-secondary-600">
            Manage and track all placement invoices
          </p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{summary.total}</p>
                    <p className="text-xs text-secondary-600">Total Invoices</p>
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
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.paidAmount)}</p>
                    <p className="text-xs text-secondary-600">Paid</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{formatCurrency(summary.pendingAmount)}</p>
                    <p className="text-xs text-secondary-600">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={summary.overdueCount > 0 ? "border-red-300 bg-red-50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{summary.overdueCount}</p>
                    <p className="text-xs text-secondary-600">Overdue</p>
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
              placeholder="Search by invoice #, company, or recipient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "PAID" ? "primary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("PAID")}
            >
              Paid
            </Button>
            <Button
              variant={statusFilter === "SENT" ? "primary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("SENT")}
            >
              Sent
            </Button>
            <Button
              variant={statusFilter === "DRAFT" ? "primary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("DRAFT")}
            >
              Draft
            </Button>
          </div>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Invoice #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Type</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-secondary-900">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Placement</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-secondary-50">
                      <td className="py-3 px-4">
                        <p className="font-mono text-sm font-medium text-secondary-900">
                          {invoice.invoiceNumber || `INV-${invoice.id.slice(-8)}`}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-secondary-900">{invoice.companyName}</p>
                        <p className="text-xs text-secondary-500">{invoice.recipientEmail}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" size="sm">
                          {invoice.invoiceType?.replace(/_/g, " ") || "Invoice"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="font-bold text-secondary-900">{formatCurrency(invoice.amount)}</p>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(invoice)}</td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-secondary-700">
                          {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        {invoice.placement ? (
                          <div>
                            <p className="text-sm text-secondary-900">{invoice.placement.jobTitle}</p>
                            <p className="text-xs text-secondary-500">{invoice.placement.candidate}</p>
                          </div>
                        ) : (
                          <span className="text-secondary-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title="View">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Download">
                            <Download className="w-4 h-4" />
                          </Button>
                          {invoice.status !== "PAID" && (
                            <Button variant="ghost" size="sm" title="Send Reminder">
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600">No invoices found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
