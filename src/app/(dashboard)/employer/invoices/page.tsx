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
  CreditCard,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { api } from "@/lib/api";
import { StripeProvider } from "@/components/providers/StripeProvider";
import { PaymentModal } from "@/components/payments/PaymentModal";

interface Placement {
  id: string;
  jobTitle: string;
  companyName: string;
  salary?: number;
  status: string;
  paymentStatus: string;
  feePercentage: number;
  placementFee?: number;
  upfrontAmount?: number;
  remainingAmount?: number;
  upfrontPaidAt?: string;
  remainingPaidAt?: string;
  createdAt: string;
  candidate?: {
    user: {
      name: string;
    };
  };
}

export default function EmployerInvoicesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    upfrontPaid: 0,
    fullyPaid: 0,
    totalAmount: 0,
  });

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState("");
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);
  const [paymentType, setPaymentType] = useState<"upfront" | "remaining">("upfront");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

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
      fetchPlacements();
    }
  }, [status, session]);

  const fetchPlacements = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/placements");
      const data = response.data;
      setPlacements(data.placements || []);

      // Calculate stats
      const total = data.placements?.length || 0;
      const pending =
        data.placements?.filter((p: Placement) => p.paymentStatus === "PENDING").length || 0;
      const upfrontPaid =
        data.placements?.filter((p: Placement) => p.paymentStatus === "UPFRONT_PAID").length || 0;
      const fullyPaid =
        data.placements?.filter((p: Placement) => p.paymentStatus === "PAID").length || 0;
      const totalAmount =
        data.placements?.reduce((sum: number, p: Placement) => sum + (p.placementFee || 0), 0) ||
        0;

      setStats({ total, pending, upfrontPaid, fullyPaid, totalAmount });
    } catch (err: any) {
      setError(err.message || "Failed to load placements");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayNow = async (placement: Placement, type: "upfront" | "remaining") => {
    setIsCreatingPayment(true);
    setError("");

    try {
      const response = await api.post("/api/stripe/create-payment-intent", {
        placementId: placement.id,
        paymentType: type,
      });

      setPaymentClientSecret(response.data.clientSecret);
      setSelectedPlacement(placement);
      setPaymentType(type);
      setPaymentAmount(response.data.amount);
      setPaymentIntentId(response.data.paymentIntentId);
      setShowPaymentModal(true);
    } catch (err: any) {
      console.error("Failed to create payment intent:", err);
      setError(
        err.response?.data?.error || "Failed to initialize payment. Please try again."
      );
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setPaymentClientSecret("");
    setSelectedPlacement(null);
    fetchPlacements(); // Refresh the list
  };

  const getPaymentStatusBadge = (placement: Placement) => {
    if (placement.paymentStatus === "PAID") {
      return (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Fully Paid
        </Badge>
      );
    }

    if (placement.paymentStatus === "UPFRONT_PAID") {
      return (
        <Badge variant="primary" size="sm">
          <Clock className="mr-1 h-3 w-3" />
          50% Paid
        </Badge>
      );
    }

    return (
      <Badge variant="warning" size="sm">
        <AlertCircle className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    );
  };

  const formatAmount = (cents?: number) => {
    if (!cents) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const downloadInvoice = (placementId: string) => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://job-portal-backend-production-cd05.up.railway.app";
    window.open(`${backendUrl}/api/placements/${placementId}/invoice`, "_blank");
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary-600" />
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
          <h1 className="mb-2 text-3xl font-bold text-secondary-900">Invoices</h1>
          <p className="text-secondary-600">Manage your placement fees and payments</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card variant="accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-secondary-600">Total Placements</p>
                  <p className="text-3xl font-bold text-secondary-900">{stats.total}</p>
                </div>
                <div className="rounded-lg bg-primary-100 p-3">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-secondary-600">Pending Payment</p>
                  <p className="text-3xl font-bold text-secondary-900">{stats.pending}</p>
                </div>
                <div className="rounded-lg bg-yellow-100 p-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-secondary-600">Partially Paid</p>
                  <p className="text-3xl font-bold text-secondary-900">{stats.upfrontPaid}</p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-secondary-600">Total Fees</p>
                  <p className="text-3xl font-bold text-secondary-900">
                    {formatAmount(stats.totalAmount)}
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
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
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Placements/Invoices List */}
        <Card variant="accent">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">All Invoices</h2>
              {stats.pending > 0 && (
                <Badge variant="warning" size="lg">
                  {stats.pending} Pending
                </Badge>
              )}
            </div>

            {placements.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="mx-auto mb-4 h-16 w-16 text-secondary-300" />
                <h3 className="mb-2 text-lg font-semibold text-secondary-900">
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                        Placement
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                        Candidate
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                        Total Fee
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                        Upfront (50%)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                        Remaining (50%)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-100">
                    {placements.map((placement) => (
                      <tr key={placement.id} className="hover:bg-secondary-50">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-secondary-900">
                              {placement.jobTitle}
                            </p>
                            <p className="text-sm text-secondary-600">
                              {placement.companyName}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {new Date(placement.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-secondary-900">
                            {placement.candidate?.user?.name || "N/A"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-semibold text-secondary-900">
                              {formatAmount(placement.placementFee)}
                            </p>
                            <p className="text-xs text-secondary-600">
                              ({placement.feePercentage}% of salary)
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm text-secondary-900">
                              {formatAmount(placement.upfrontAmount)}
                            </p>
                            {placement.upfrontPaidAt && (
                              <p className="text-xs text-green-600">
                                Paid {new Date(placement.upfrontPaidAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm text-secondary-900">
                              {formatAmount(placement.remainingAmount)}
                            </p>
                            {placement.remainingPaidAt && (
                              <p className="text-xs text-green-600">
                                Paid {new Date(placement.remainingPaidAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">{getPaymentStatusBadge(placement)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {/* Upfront Payment Button */}
                            {!placement.upfrontPaidAt && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handlePayNow(placement, "upfront")}
                                disabled={isCreatingPayment}
                              >
                                <CreditCard className="mr-1 h-4 w-4" />
                                Pay 50%
                              </Button>
                            )}

                            {/* Remaining Payment Button */}
                            {placement.upfrontPaidAt && !placement.remainingPaidAt && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handlePayNow(placement, "remaining")}
                                disabled={isCreatingPayment}
                              >
                                <CreditCard className="mr-1 h-4 w-4" />
                                Pay Remaining
                              </Button>
                            )}

                            {/* Download Invoice */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadInvoice(placement.id)}
                              title="Download Invoice"
                            >
                              <Download className="h-4 w-4" />
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

      {/* Payment Modal */}
      {showPaymentModal && paymentClientSecret && selectedPlacement && (
        <StripeProvider clientSecret={paymentClientSecret}>
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            placement={{
              id: selectedPlacement.id,
              jobTitle: selectedPlacement.jobTitle,
              companyName: selectedPlacement.companyName,
              candidateName: selectedPlacement.candidate?.user?.name,
            }}
            amount={paymentAmount}
            paymentType={paymentType}
            paymentIntentId={paymentIntentId}
            onSuccess={handlePaymentSuccess}
          />
        </StripeProvider>
      )}
    </div>
  );
}
