"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateJob } from "@/hooks/useJobs";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import Link from "next/link";

export default function NewJobPage() {
  const router = useRouter();
  const createJob = useCreateJob();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    niche: "",
    location: "",
    remoteType: "REMOTE" as "REMOTE" | "HYBRID" | "ONSITE",
    experienceLevel: "MID" as "ENTRY" | "MID" | "SENIOR" | "LEAD",
    employmentType: "FULL_TIME" as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    skills: "",
    benefits: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createJob.mutateAsync({
        title: formData.title,
        description: formData.description,
        niche: formData.niche,
        location: formData.location,
        remoteType: formData.remoteType,
        experienceLevel: formData.experienceLevel,
        employmentType: formData.employmentType,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        currency: formData.currency,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : undefined,
        benefits: formData.benefits
          ? formData.benefits.split(",").map((s) => s.trim())
          : undefined,
      });

      // Success - redirect after delay
      setTimeout(() => {
        router.push("/employer/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Job posting failed:", error);
    }
  };

  if (createJob.isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">Job Posted Successfully!</h2>
            <p className="text-secondary-600 text-center mb-6">
              Your job posting is now live and candidates can apply.
            </p>
            <Button variant="primary" asChild>
              <Link href="/employer/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/employer/dashboard"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-secondary-900">Post a New Job</h1>
        <p className="text-secondary-600 mt-2">
          Fill in the details below to create your job posting
        </p>
      </div>

      {createJob.isError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">Failed to post job</h3>
              <p className="text-sm text-red-700 mt-1">
                {(createJob.error as any)?.response?.data?.message ||
                  "Please check your inputs and try again."}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-900 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Senior Machine Learning Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-900 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe the role, responsibilities, and requirements..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Niche *
                </label>
                <input
                  type="text"
                  name="niche"
                  required
                  value={formData.niche}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Machine Learning, AI, Data Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., San Francisco, CA or Remote"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Remote Type *
                </label>
                <select
                  name="remoteType"
                  required
                  value={formData.remoteType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Experience Level *
                </label>
                <select
                  name="experienceLevel"
                  required
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ENTRY">Entry Level</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior</option>
                  <option value="LEAD">Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Employment Type *
                </label>
                <select
                  name="employmentType"
                  required
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compensation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Min Salary
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Max Salary
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 150000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-900 mb-2">
                Required Skills (comma-separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Python, TensorFlow, PyTorch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-900 mb-2">
                Benefits (comma-separated)
              </label>
              <input
                type="text"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Health Insurance, 401k, Remote Work"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/employer/dashboard")}
            disabled={createJob.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={createJob.isPending}
            className="min-w-[140px]"
          >
            {createJob.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Job"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
