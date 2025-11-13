"use client";

import { useState, FormEvent } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import {
  X,
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  placement: {
    id: string;
    jobTitle: string;
    companyName: string;
    candidateName?: string;
  };
  amount: number;
  paymentType: "upfront" | "remaining";
  paymentIntentId: string;
  onSuccess: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  placement,
  amount,
  paymentType,
  paymentIntentId,
  onSuccess,
}: PaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!isOpen) return null;

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/employer/invoices`,
        },
        redirect: "if_required",
      });

      if (submitError) {
        setError(submitError.message || "Payment failed. Please try again.");
        setIsProcessing(false);
      } else {
        // Payment successful
        setPaymentComplete(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-secondary-200 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Complete Payment</h2>
              <p className="text-sm text-primary-100">
                {paymentType === "upfront" ? "Upfront" : "Remaining"} Placement Fee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Payment Success State */}
        {paymentComplete ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-secondary-900">
              Payment Successful!
            </h3>
            <p className="text-secondary-600">
              Your payment has been processed successfully. Redirecting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Invoice Summary */}
            <div className="border-b border-secondary-200 bg-secondary-50 px-6 py-6">
              <h3 className="mb-4 text-lg font-semibold text-secondary-900">
                Invoice Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-5 w-5 text-secondary-400" />
                    <div>
                      <p className="text-sm font-medium text-secondary-900">
                        Placement Details
                      </p>
                      <p className="text-sm text-secondary-600">{placement.jobTitle}</p>
                      <p className="text-xs text-secondary-500">{placement.companyName}</p>
                      {placement.candidateName && (
                        <p className="text-xs text-secondary-500">
                          Candidate: {placement.candidateName}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={paymentType === "upfront" ? "primary" : "warning"}>
                    {paymentType === "upfront" ? "50% Upfront" : "50% Remaining"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between border-t border-secondary-200 pt-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-secondary-400" />
                    <span className="text-lg font-semibold text-secondary-900">
                      Total Amount
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatAmount(amount)}
                  </span>
                </div>

                {paymentType === "remaining" && (
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs text-blue-800">
                      <Calendar className="mr-1 inline h-4 w-4" />
                      This is the remaining 50% payment, due 30 days after upfront payment
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Form */}
            <div className="px-6 py-6">
              <h3 className="mb-4 text-lg font-semibold text-secondary-900">
                Payment Information
              </h3>

              {/* Stripe Payment Element */}
              <div className="mb-6">
                <PaymentElement />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">Payment Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="mb-6 rounded-lg bg-secondary-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-secondary-900">
                      Secure Payment
                    </p>
                    <p className="text-xs text-secondary-600">
                      Your payment is processed securely through Stripe. We never store your
                      card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!stripe || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay {formatAmount(amount)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
