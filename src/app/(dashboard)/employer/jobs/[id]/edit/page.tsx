"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  Users,
  FileText,
  Save,
  X,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";

interface EditJobPageProps {
  params: { id: string };
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    locationType: "remote",
    employmentType: "full-time",
    experienceLevel: "mid",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    skills: [] as string[],
    requiresAssessment: false,
    minScore: 70,
    status: "active",
  });

  const [skillInput, setSkillInput] = useState("");

  // Redirect if not logged in or not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/jobs");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load job data
  useEffect(() => {
    const loadJob = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch real job data from API
        const response = await fetch(`/api/jobs/${params.id}`);

        if (!response.ok) {
          throw new Error(`Failed to load job: ${response.statusText}`);
        }

        const data = await response.json();
        const job = data.job || data;

        // Map API data to form state
        // Map backend enum values to frontend form values
        const expLevelMap: Record<string, string> = {
          "ENTRY_LEVEL": "entry",
          "MID_LEVEL": "mid",
          "SENIOR_LEVEL": "senior",
          "EXECUTIVE": "lead",
        };

        const typeMap: Record<string, string> = {
          "FULL_TIME": "full-time",
          "PART_TIME": "part-time",
          "CONTRACT": "contract",
          "INTERNSHIP": "internship",
        };

        setFormData({
          title: job.title || "",
          company: job.employer?.companyName || "",
          location: job.location || "",
          locationType: job.remote ? "remote" : (job.remoteType?.toLowerCase() || "onsite"),
          employmentType: typeMap[job.type] || "full-time",
          experienceLevel: expLevelMap[job.experienceLevel] || "mid",
          salaryMin: job.salaryMin?.toString() || "",
          salaryMax: job.salaryMax?.toString() || "",
          description: job.description || "",
          requirements: job.requirements || "",
          responsibilities: job.responsibilities || "",
          benefits: job.benefits || "",
          skills: job.skills || [],
          requiresAssessment: job.requiresAssessment || false,
          minScore: job.minSkillsScore || 70,
          status: job.status?.toLowerCase() || "active",
        });
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error loading job:", err);
        setError(err.message || "Failed to load job data");
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && params.id) {
      loadJob();
    }
  }, [params.id, status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      // Transform form data to API format
      const updateData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        location: formData.location,
        remote: formData.locationType === "remote",
        remoteType: formData.locationType.toUpperCase(),
        type: formData.employmentType.toUpperCase().replace("-", "_"),
        experienceLevel: formData.experienceLevel.toUpperCase().replace("-", "_") + "_LEVEL",
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        skills: formData.skills,
        benefits: formData.benefits,
        requiresAssessment: formData.requiresAssessment,
        minSkillsScore: formData.requiresAssessment ? formData.minScore : null,
        status: formData.status.toUpperCase(),
      };

      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save job");
      }

      // Redirect to job dashboard on success
      router.push("/employer/dashboard");
    } catch (err: any) {
      console.error("Error saving job:", err);
      setError(err.message || "Failed to save job. Please try again.");
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete job");
      }

      // Redirect to dashboard on success
      router.push("/employer/dashboard");
    } catch (err: any) {
      console.error("Error deleting job:", err);
      setError(err.message || "Failed to delete job");
      setIsDeleting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-secondary-900">
                Edit Job Posting
              </h1>
              <p className="text-secondary-600">
                Update your job details and requirements
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
            >
              <X className="mr-2 h-5 w-5" />
              Cancel
            </Button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSave}>
            {/* Basic Information */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-bold text-secondary-900">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="mb-2 block text-sm font-medium text-secondary-700">
                      Job Title *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Senior Machine Learning Engineer"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-medium text-secondary-700">
                      Company Name *
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="location" className="mb-2 block text-sm font-medium text-secondary-700">
                        Location *
                      </label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>

                    <div>
                      <label htmlFor="locationType" className="mb-2 block text-sm font-medium text-secondary-700">
                        Location Type *
                      </label>
                      <select
                        id="locationType"
                        name="locationType"
                        value={formData.locationType}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
                        required
                      >
                        <option value="remote">Remote</option>
                        <option value="onsite">On-site</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="employmentType" className="mb-2 block text-sm font-medium text-secondary-700">
                        Employment Type *
                      </label>
                      <select
                        id="employmentType"
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
                        required
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="experienceLevel" className="mb-2 block text-sm font-medium text-secondary-700">
                        Experience Level *
                      </label>
                      <select
                        id="experienceLevel"
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
                        required
                      >
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior</option>
                        <option value="lead">Lead/Principal</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compensation */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-bold text-secondary-900">
                  Compensation
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="salaryMin" className="mb-2 block text-sm font-medium text-secondary-700">
                      Minimum Salary ($) *
                    </label>
                    <Input
                      id="salaryMin"
                      name="salaryMin"
                      type="number"
                      value={formData.salaryMin}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 120000"
                    />
                  </div>

                  <div>
                    <label htmlFor="salaryMax" className="mb-2 block text-sm font-medium text-secondary-700">
                      Maximum Salary ($) *
                    </label>
                    <Input
                      id="salaryMax"
                      name="salaryMax"
                      type="number"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 180000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-bold text-secondary-900">
                  Job Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="description" className="mb-2 block text-sm font-medium text-secondary-700">
                      Job Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
                      placeholder="Describe the role, team, and what the candidate will work on..."
                    />
                  </div>

                  <div>
                    <label htmlFor="requirements" className="mb-2 block text-sm font-medium text-secondary-700">
                      Requirements *
                    </label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
                      placeholder="List required skills, experience, and qualifications..."
                    />
                  </div>

                  <div>
                    <label htmlFor="responsibilities" className="mb-2 block text-sm font-medium text-secondary-700">
                      Responsibilities *
                    </label>
                    <textarea
                      id="responsibilities"
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
                      placeholder="What will the candidate be responsible for..."
                    />
                  </div>

                  <div>
                    <label htmlFor="benefits" className="mb-2 block text-sm font-medium text-secondary-700">
                      Benefits
                    </label>
                    <textarea
                      id="benefits"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
                      placeholder="Health insurance, 401k, remote work, etc..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-bold text-secondary-900">
                  Required Skills
                </h2>

                <div className="mb-4">
                  <label htmlFor="skillInput" className="mb-2 block text-sm font-medium text-secondary-700">
                    Add Skills
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="skillInput"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                      placeholder="e.g. Python, React, AWS"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddSkill}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary-200"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      {skill}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Assessment */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-bold text-secondary-900">
                  Skills Assessment Requirements
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="requiresAssessment"
                      name="requiresAssessment"
                      checked={formData.requiresAssessment}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                    <label htmlFor="requiresAssessment" className="text-sm font-medium text-secondary-700">
                      Require candidates to complete skills assessment
                    </label>
                  </div>

                  {formData.requiresAssessment && (
                    <div>
                      <label htmlFor="minScore" className="mb-2 block text-sm font-medium text-secondary-700">
                        Minimum Score Required (0-100)
                      </label>
                      <Input
                        id="minScore"
                        name="minScore"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.minScore}
                        onChange={handleChange}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Job Status */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-bold text-secondary-900">
                  Job Status
                </h2>

                <div>
                  <label htmlFor="status" className="mb-2 block text-sm font-medium text-secondary-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none md:w-64"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-5 w-5" />
                    Delete Job
                  </>
                )}
              </Button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
