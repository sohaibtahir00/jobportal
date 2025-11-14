"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Download, AlertCircle, CheckCircle, XCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { api } from "@/lib/api";

interface PaymentRecord {
  placementId: string;
  paymentType: "UPFRONT" | "REMAINING";
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  paidAt?: string;
  notes?: string;
}

interface BulkPaymentResult {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  results: {
    successful: any[];
    failed: any[];
  };
}

export default function BulkPaymentPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BulkPaymentResult | null>(null);
  const [error, setError] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());

        // Skip header row
        const dataLines = lines.slice(1);

        const parsedPayments: PaymentRecord[] = dataLines.map((line) => {
          const [placementId, paymentType, amount, paymentMethod, transactionId, paidAt, notes] =
            line.split(",").map((item) => item.trim());

          return {
            placementId,
            paymentType: paymentType as "UPFRONT" | "REMAINING",
            amount: parseInt(amount),
            paymentMethod,
            transactionId: transactionId || undefined,
            paidAt: paidAt || undefined,
            notes: notes || undefined,
          };
        });

        setPayments(parsedPayments);
        setError("");
        setResult(null);
      } catch (err) {
        setError("Failed to parse CSV file. Please check the format.");
      }
    };

    reader.readAsText(file);
  };

  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setPayments(Array.isArray(json) ? json : [json]);
        setError("");
        setResult(null);
      } catch (err) {
        setError("Failed to parse JSON file. Please check the format.");
      }
    };

    reader.readAsText(file);
  };

  const handleManualAdd = () => {
    setPayments([
      ...payments,
      {
        placementId: "",
        paymentType: "UPFRONT",
        amount: 0,
        paymentMethod: "bank_transfer",
      },
    ]);
  };

  const handleRemove = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof PaymentRecord, value: any) => {
    const updated = [...payments];
    updated[index] = { ...updated[index], [field]: value };
    setPayments(updated);
  };

  const handleSubmit = async () => {
    if (payments.length === 0) {
      setError("Please add at least one payment record");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const response = await api.post("/api/admin/placements/bulk-payment", payments);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to process bulk payments");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csv = `placementId,paymentType,amount,paymentMethod,transactionId,paidAt,notes
placement_123,UPFRONT,500000,bank_transfer,TXN001,2025-01-15T10:30:00Z,First payment
placement_456,REMAINING,500000,wire,TXN002,2025-02-15T10:30:00Z,Final payment`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-payment-template.csv";
    a.click();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Bulk Payment Recording</h1>
        <p className="text-secondary-600">
          Record multiple placement payments at once via CSV, JSON, or manual entry
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-secondary-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Upload JSON File
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleJsonUpload}
                className="block w-full text-sm text-secondary-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Download Template
              </label>
              <Button variant="outline" size="sm" onClick={downloadTemplate} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                CSV Template
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={handleManualAdd}>
              Add Manual Entry
            </Button>
            <span className="text-sm text-secondary-600">
              {payments.length} payment{payments.length !== 1 ? "s" : ""} loaded
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Records Table */}
      {payments.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Records ({payments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">#</th>
                    <th className="text-left p-2">Placement ID</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Amount ($)</th>
                    <th className="text-left p-2">Method</th>
                    <th className="text-left p-2">Transaction ID</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={payment.placementId}
                          onChange={(e) => handleUpdate(index, "placementId", e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                          placeholder="placement_id"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={payment.paymentType}
                          onChange={(e) => handleUpdate(index, "paymentType", e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                        >
                          <option value="UPFRONT">UPFRONT</option>
                          <option value="REMAINING">REMAINING</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={payment.amount / 100}
                          onChange={(e) =>
                            handleUpdate(index, "amount", parseFloat(e.target.value) * 100)
                          }
                          className="w-full px-2 py-1 border rounded text-sm"
                          placeholder="5000.00"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={payment.paymentMethod}
                          onChange={(e) => handleUpdate(index, "paymentMethod", e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                        >
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="wire">Wire Transfer</option>
                          <option value="check">Check</option>
                          <option value="stripe">Stripe</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={payment.transactionId || ""}
                          onChange={(e) => handleUpdate(index, "transactionId", e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                          placeholder="Optional"
                        />
                      </td>
                      <td className="p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemove(index)}
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setPayments([])}
                disabled={isProcessing}
              >
                Clear All
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isProcessing || payments.length === 0}
              >
                {isProcessing ? "Processing..." : `Process ${payments.length} Payments`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-red-300 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-900">{result.total}</div>
                <div className="text-sm text-secondary-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{result.successful}</div>
                <div className="text-sm text-secondary-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{result.failed}</div>
                <div className="text-sm text-secondary-600">Failed</div>
              </div>
            </div>

            {/* Successful Payments */}
            {result.results.successful.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Successful Payments ({result.results.successful.length})
                </h3>
                <div className="space-y-2">
                  {result.results.successful.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm"
                    >
                      <span className="font-medium">#{item.index}</span> - {item.placementId} -{" "}
                      {item.paymentType} - ${(item.amount / 100).toLocaleString()} - New Status:{" "}
                      {item.newPaymentStatus}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Failed Payments */}
            {result.results.failed.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Failed Payments ({result.results.failed.length})
                </h3>
                <div className="space-y-2">
                  {result.results.failed.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm"
                    >
                      <div className="font-medium">
                        #{item.index} - {item.placementId} - {item.paymentType}
                      </div>
                      <div className="text-red-700 mt-1">Error: {item.error}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
