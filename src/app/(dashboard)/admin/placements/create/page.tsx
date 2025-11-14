"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select } from "@/components/ui";
import { api } from "@/lib/api";
import { AlertCircle, CheckCircle, DollarSign } from "lucide-react";

interface Candidate {
  id: string;
  user: {
    name: string;
    email: string;
  };
  availability: boolean;
}

interface Job {
  id: string;
  title: string;
  experienceLevel: string;
  employer: {
    companyName: string;
  };
}

export default function CreatePlacementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [formData, setFormData] = useState({
    candidateId: "",
    jobId: "",
    jobTitle: "",
    companyName: "",
    startDate: "",
    salary: "",
    feePercentage: "18",
    upfrontPercentage: "50",
    remainingPercentage: "50",
    guaranteePeriodDays: "90",
    notes: "",
  });

  // Derived calculations
  const salaryInCents = parseFloat(formData.salary || "0") * 100;
  const placementFee = salaryInCents * (parseFloat(formData.feePercentage) / 100);
  const upfrontAmount = placementFee * (parseFloat(formData.upfrontPercentage) / 100);
  const remainingAmount = placementFee - upfrontAmount;

  useEffect(() => {
    fetchCandidates();
    fetchJobs();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await api.get("/api/admin/candidates?availability=true&limit=100");
      setCandidates(response.data.candidates || []);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await api.get("/api/jobs?status=ACTIVE&limit=100");
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const handleJobSelect = (jobId: string) => {
    const selectedJob = jobs.find((j) => j.id === jobId);
    if (selectedJob) {
      setFormData({
        ...formData,
        jobId,
        jobTitle: selectedJob.title,
        companyName: selectedJob.employer.companyName,
      });
    }
  };

  const handleUpfrontPercentageChange = (value: string) => {
    const upfront = parseFloat(value || "0");
    const remaining = 100 - upfront;
    setFormData({
      ...formData,
      upfrontPercentage: value,
      remainingPercentage: remaining.toString(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/api/placements", {
        candidateId: formData.candidateId,
        jobId: formData.jobId || undefined,
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        startDate: new Date(formData.startDate).toISOString(),
        salary: salaryInCents,
        feePercentage: parseFloat(formData.feePercentage),
        upfrontPercentage: parseFloat(formData.upfrontPercentage),
        remainingPercentage: parseFloat(formData.remainingPercentage),
        guaranteePeriodDays: parseInt(formData.guaranteePeriodDays),
        notes: formData.notes || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/placements");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create placement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Create Custom Placement
        </h1>
        <p className="text-secondary-600">
          Create a placement with customizable payment plan splits
        </p>
      </div>

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

      {success && (
        <Card className="mb-6 border-green-300 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>Placement created successfully! Redirecting...</span>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Placement Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Candidate *
              </label>
              <select
                required
                value={formData.candidateId}
                onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a candidate</option>
                {candidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.user.name} ({candidate.user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Job (Optional)
              </label>
              <select
                value={formData.jobId}
                onChange={(e) => handleJobSelect(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a job (or enter manually below)</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.employer.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Annual Salary ($) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="120000.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Additional notes about this placement..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Plan Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Fee Percentage (%)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.feePercentage}
                  onChange={(e) => setFormData({ ...formData, feePercentage: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Guarantee Period (Days)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.guaranteePeriodDays}
                  onChange={(e) =>
                    setFormData({ ...formData, guaranteePeriodDays: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-primary-900 mb-3">
                Payment Split Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Upfront Payment (%)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.upfrontPercentage}
                    onChange={(e) => handleUpfrontPercentageChange(e.target.value)}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Remaining Payment (%)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.remainingPercentage}
                    disabled
                    className="w-full px-4 py-2 border border-secondary-300 rounded-md bg-secondary-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="text-sm text-secondary-600">
                Common splits: 50/50 (default), 30/70, 25/75, 100/0 (full upfront)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="mb-6 border-green-300 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <DollarSign className="h-5 w-5" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-700">Annual Salary:</span>
                <span className="font-semibold text-secondary-900">
                  ${(salaryInCents / 100).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-700">
                  Placement Fee ({formData.feePercentage}%):
                </span>
                <span className="font-semibold text-secondary-900">
                  ${(placementFee / 100).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <hr className="border-secondary-300" />
              <div className="flex justify-between items-center">
                <span className="text-secondary-700">
                  Upfront ({formData.upfrontPercentage}%):
                </span>
                <span className="font-bold text-green-700 text-lg">
                  ${(upfrontAmount / 100).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-700">
                  Remaining ({formData.remainingPercentage}%):
                </span>
                <span className="font-bold text-green-700 text-lg">
                  ${(remainingAmount / 100).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Creating..." : "Create Placement"}
          </Button>
        </div>
      </form>
    </div>
  );
}
