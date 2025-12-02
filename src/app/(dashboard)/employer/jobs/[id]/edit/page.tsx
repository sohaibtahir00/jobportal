"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Loader2,
  AlertCircle,
  Trash2,
  Plus,
  Info,
  ArrowLeft,
  ChevronRight,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api";

// Benefits options (same as /new page)
const BENEFITS_OPTIONS = [
  "Health Insurance",
  "Dental Insurance",
  "Vision Insurance",
  "401(k) Matching",
  "Flexible Hours",
  "Remote Work",
  "Unlimited PTO",
  "Paid Parental Leave",
  "Professional Development",
  "Gym Membership",
  "Mental Health Support",
  "Stock Options",
];

// Niche categories
const NICHE_CATEGORIES = [
  "AI/ML",
  "Fintech",
  "Cybersecurity",
  "Healthcare IT",
  "Cloud Computing",
  "DevOps",
  "Data Science",
  "Web Development",
  "Mobile Development",
  "Blockchain",
];

interface JobFormData {
  // Basic Info
  title: string;
  nicheCategory: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  remoteType: string;

  // Description
  description: string;
  keyResponsibilities: string[];
  skills: string[];
  niceToHaveSkills: string[];
  techStack: string[];

  // Compensation
  salaryMin: number;
  salaryMax: number;
  isCompetitive: boolean;
  equityOffered: boolean;
  specificBenefits: string[];

  // Skills Assessment
  requiresAssessment: boolean;
  minSkillsScore: number;
  requiredTier: string;
  customAssessmentQuestions: Array<{
    question: string;
    type: string;
    weight?: number;
    options?: string[];
  }>;

  // Hiring Process
  hiringTimeline: string;
  startDateNeeded: string;

  // Application Settings
  deadline: string;
  maxApplicants: string;
  screeningQuestions: Array<{
    question: string;
    required: boolean;
  }>;

  // Status
  status: string;
}

export default function EditJobPage() {
  const params = useParams();
  const jobId = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [customizationStep, setCustomizationStep] = useState(0);

  // Form state with all fields
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    nicheCategory: "",
    employmentType: "FULL_TIME",
    experienceLevel: "MID",
    location: "",
    remoteType: "REMOTE",
    description: "",
    keyResponsibilities: [],
    skills: [],
    niceToHaveSkills: [],
    techStack: [],
    salaryMin: 0,
    salaryMax: 0,
    isCompetitive: false,
    equityOffered: false,
    specificBenefits: [],
    requiresAssessment: false,
    minSkillsScore: 0,
    requiredTier: "ANY",
    customAssessmentQuestions: [],
    hiringTimeline: "",
    startDateNeeded: "",
    deadline: "",
    maxApplicants: "",
    screeningQuestions: [],
    status: "ACTIVE",
  });

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
      if (!jobId || status !== "authenticated") {
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await api.get(`/api/jobs/${jobId}`);
        const job = response.data.job || response.data;

        if (!job || !job.title) {
          throw new Error("Invalid job data received");
        }

        // Map backend data to form state
        const expLevelMap: Record<string, string> = {
          ENTRY_LEVEL: "ENTRY",
          MID_LEVEL: "MID",
          SENIOR_LEVEL: "SENIOR",
          EXECUTIVE: "LEAD",
        };

        const typeMap: Record<string, string> = {
          FULL_TIME: "FULL_TIME",
          PART_TIME: "PART_TIME",
          CONTRACT: "CONTRACT",
          INTERNSHIP: "INTERNSHIP",
        };

        // Parse benefits string into array
        const benefitsArray = job.benefits
          ? job.benefits.split(",").map((b: string) => b.trim()).filter(Boolean)
          : [];

        // Parse responsibilities string into array
        const responsibilitiesArray = job.responsibilities
          ? job.responsibilities.split("\n").map((r: string) => r.trim()).filter(Boolean)
          : [];

        setFormData({
          title: job.title || "",
          nicheCategory: job.nicheCategory || "",
          employmentType: typeMap[job.type] || "FULL_TIME",
          experienceLevel: expLevelMap[job.experienceLevel] || "MID",
          location: job.location || "",
          remoteType: job.remoteType || (job.remote ? "REMOTE" : "ON_SITE"),
          description: job.description || "",
          keyResponsibilities: job.keyResponsibilities || responsibilitiesArray,
          skills: job.skills || [],
          niceToHaveSkills: job.niceToHaveSkills || [],
          techStack: job.techStack || [],
          salaryMin: job.salaryMin || 0,
          salaryMax: job.salaryMax || 0,
          isCompetitive: job.isCompetitive || false,
          equityOffered: job.equityOffered || false,
          specificBenefits: job.specificBenefits || benefitsArray,
          requiresAssessment: job.requiresAssessment || false,
          minSkillsScore: job.minSkillsScore || 0,
          requiredTier: job.requiredTier || "ANY",
          customAssessmentQuestions: job.customAssessmentQuestions || [],
          hiringTimeline: job.hiringTimeline || "",
          startDateNeeded: job.startDateNeeded ? job.startDateNeeded.split('T')[0] : "",
          deadline: job.deadline ? job.deadline.split('T')[0] : "",
          maxApplicants: job.maxApplicants ? String(job.maxApplicants) : "",
          screeningQuestions: job.screeningQuestions || [],
          status: job.status || "ACTIVE",
        });

        setIsLoading(false);
      } catch (err: any) {
        console.error("Error loading job:", err);
        setError(err.response?.data?.error || err.message || "Failed to load job data");
        setIsLoading(false);
      }
    };

    loadJob();
  }, [status, jobId]);

  // Helper functions
  const updateFormData = (updates: Partial<JobFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addToArray = (field: keyof JobFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), value]
    }));
  };

  const removeFromArray = (field: keyof JobFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      // Map experience level to backend format
      const experienceLevelMap: Record<string, string> = {
        'ENTRY': 'ENTRY_LEVEL',
        'MID': 'MID_LEVEL',
        'SENIOR': 'SENIOR_LEVEL',
        'LEAD': 'EXECUTIVE'
      };

      // Transform data for backend
      const jobPayload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.skills.join(", "),
        responsibilities: formData.keyResponsibilities.join("\n"),
        type: formData.employmentType,
        location: formData.location,
        remote: formData.remoteType === "REMOTE",
        salaryMin: formData.salaryMin || undefined,
        salaryMax: formData.salaryMax || undefined,
        experienceLevel: experienceLevelMap[formData.experienceLevel] as any,
        skills: formData.skills,
        niceToHaveSkills: formData.niceToHaveSkills,
        techStack: formData.techStack,
        benefits: formData.specificBenefits.join(", "),
        deadline: formData.deadline || undefined,
        nicheCategory: formData.nicheCategory,
        remoteType: formData.remoteType,
        keyResponsibilities: formData.keyResponsibilities,
        specificBenefits: formData.specificBenefits,
        equityOffered: formData.equityOffered,
        requiresAssessment: formData.requiresAssessment,
        minSkillsScore: formData.requiresAssessment ? formData.minSkillsScore : undefined,
        requiredTier: formData.requiresAssessment ? formData.requiredTier : undefined,
        customAssessmentQuestions: formData.requiresAssessment ? formData.customAssessmentQuestions : [],
        hiringTimeline: formData.hiringTimeline,
        startDateNeeded: formData.startDateNeeded || undefined,
        maxApplicants: formData.maxApplicants ? parseInt(formData.maxApplicants) : undefined,
        screeningQuestions: formData.screeningQuestions,
        status: formData.status,
      };

      await api.patch(`/api/jobs/${jobId}`, jobPayload);
      router.push("/employer/jobs?updated=true");
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
      await api.delete(`/api/jobs/${jobId}`);
      router.push("/employer/jobs?deleted=true");
    } catch (err: any) {
      console.error("Error deleting job:", err);
      setError(err.message || "Failed to delete job");
      setIsDeleting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Job Posting
            </h1>
            <p className="text-gray-600">
              Update your job details and requirements
            </p>
          </div>
          <button
            onClick={() => setCustomizationStep(0)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8 bg-white rounded-xl border shadow-sm p-6">
          <div className="flex gap-2 mb-3">
            <div className={`flex-1 h-2 rounded-full transition-colors ${customizationStep >= 0 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded-full transition-colors ${customizationStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded-full transition-colors ${customizationStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded-full transition-colors ${customizationStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
          <div className="flex justify-between text-sm">
            <span className={customizationStep === 0 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Basic Info
            </span>
            <span className={customizationStep === 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Skills Assessment
            </span>
            <span className={customizationStep === 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Hiring Process
            </span>
            <span className={customizationStep === 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Application Settings
            </span>
          </div>
        </div>

          {/* STEP 0: Basic Information & Description */}
          {customizationStep === 0 && (
            <div className="bg-white rounded-xl border shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                <p className="text-gray-600">
                  Update job title, category, and core details
                </p>
              </div>

              <div className="space-y-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="e.g. Senior Machine Learning Engineer"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Niche Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Niche Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.nicheCategory}
                    onChange={(e) => updateFormData({ nicheCategory: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {NICHE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Employment Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Employment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.employmentType}
                      onChange={(e) => updateFormData({ employmentType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="FULL_TIME">Full-time</option>
                      <option value="PART_TIME">Part-time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Experience Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.experienceLevel}
                      onChange={(e) => updateFormData({ experienceLevel: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ENTRY">Entry Level</option>
                      <option value="MID">Mid Level</option>
                      <option value="SENIOR">Senior</option>
                      <option value="LEAD">Lead/Principal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => updateFormData({ location: e.target.value })}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Remote Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Work Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.remoteType}
                      onChange={(e) => updateFormData({ remoteType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="REMOTE">Remote</option>
                      <option value="ON_SITE">On-site</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    rows={6}
                    placeholder="Describe the role, team, and what makes this opportunity unique..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Key Responsibilities */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Key Responsibilities
                  </label>
                  {formData.keyResponsibilities.map((resp, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        value={resp}
                        onChange={(e) => {
                          const updated = [...formData.keyResponsibilities];
                          updated[idx] = e.target.value;
                          updateFormData({ keyResponsibilities: updated });
                        }}
                        placeholder="Enter a responsibility"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeFromArray('keyResponsibilities', idx)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addToArray('keyResponsibilities', '')}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Responsibility
                  </button>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Required Skills
                  </label>
                  {formData.skills.map((skill, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        value={skill}
                        onChange={(e) => {
                          const updated = [...formData.skills];
                          updated[idx] = e.target.value;
                          updateFormData({ skills: updated });
                        }}
                        placeholder="Enter a skill"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeFromArray('skills', idx)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addToArray('skills', '')}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>

                {/* Nice-to-Have Skills */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nice-to-Have Skills
                  </label>
                  {formData.niceToHaveSkills.map((skill, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        value={skill}
                        onChange={(e) => {
                          const updated = [...formData.niceToHaveSkills];
                          updated[idx] = e.target.value;
                          updateFormData({ niceToHaveSkills: updated });
                        }}
                        placeholder="Enter a nice-to-have skill"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeFromArray('niceToHaveSkills', idx)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addToArray('niceToHaveSkills', '')}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Nice-to-Have Skill
                  </button>
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tech Stack
                  </label>
                  {formData.techStack.map((tech, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        value={tech}
                        onChange={(e) => {
                          const updated = [...formData.techStack];
                          updated[idx] = e.target.value;
                          updateFormData({ techStack: updated });
                        }}
                        placeholder="Enter a technology"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeFromArray('techStack', idx)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addToArray('techStack', '')}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Technology
                  </button>
                </div>

                {/* Compensation */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Compensation & Benefits</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Minimum Salary ($)
                      </label>
                      <input
                        type="number"
                        value={formData.salaryMin || ''}
                        onChange={(e) => updateFormData({ salaryMin: Number(e.target.value) })}
                        placeholder="e.g. 100000"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Maximum Salary ($)
                      </label>
                      <input
                        type="number"
                        value={formData.salaryMax || ''}
                        onChange={(e) => updateFormData({ salaryMax: Number(e.target.value) })}
                        placeholder="e.g. 150000"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isCompetitive}
                        onChange={(e) => updateFormData({ isCompetitive: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Competitive salary (no specific range disclosed)</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.equityOffered}
                        onChange={(e) => updateFormData({ equityOffered: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Equity/Stock options offered</span>
                    </label>
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Benefits</label>

                    {formData.specificBenefits.length > 0 && (
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700 font-medium mb-2">
                          Selected benefits ({formData.specificBenefits.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {formData.specificBenefits.map((benefit, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm"
                            >
                              {benefit}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = formData.specificBenefits.filter((_, i) => i !== idx);
                                  updateFormData({ specificBenefits: updated });
                                }}
                                className="hover:bg-blue-700 rounded-full p-0.5"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {BENEFITS_OPTIONS.filter(benefit => !formData.specificBenefits.includes(benefit)).map(benefit => (
                        <label key={benefit} className="flex items-center gap-2 text-sm p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateFormData({
                                  specificBenefits: [...formData.specificBenefits, benefit]
                                });
                              }
                            }}
                            className="w-4 h-4"
                          />
                          {benefit}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Job Status */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Job Status</h3>
                  <select
                    value={formData.status}
                    onChange={(e) => updateFormData({ status: e.target.value })}
                    className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">Active - Accepting applications</option>
                    <option value="PAUSED">Paused - Not accepting applications</option>
                    <option value="CLOSED">Closed - No longer hiring</option>
                  </select>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => setCustomizationStep(0)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setCustomizationStep(1)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Next: Skills Assessment
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* CUSTOMIZATION STEP 1: Skills Assessment (Current Step 4) */}
          {customizationStep === 1 && (
            <div className="bg-white rounded-xl border shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Skills Assessment Requirements</h2>
                <p className="text-gray-600">
                  Require candidates to complete skills assessments to see their verified capabilities before interviewing.
                </p>
              </div>
    
              {/* Toggle for requiring assessment */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requiresAssessment}
                    onChange={(e) => updateFormData({ requiresAssessment: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="font-semibold">Require Skills Assessment</div>
                    <div className="text-sm text-gray-600">
                      Candidates must complete our {formData.nicheCategory || 'skills'} test to apply
                    </div>
                  </div>
                </label>
              </div>
    
              {formData.requiresAssessment && (
                <div className="space-y-8">
                  {/* Minimum Score - Visual Slider */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <label className="block text-sm font-semibold mb-4 text-gray-800">
                      Minimum Score & Required Skill Tier
                    </label>
    
                    {/* Large Percentage Display */}
                    <div className="text-center mb-6">
                      <div className="text-6xl font-bold text-blue-600">
                        {formData.minSkillsScore}%
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {formData.minSkillsScore === 0 && "No minimum score required - Any Tier"}
                        {formData.minSkillsScore > 0 && formData.minSkillsScore < 40 && "Entry-level candidates can apply - Any Tier"}
                        {formData.minSkillsScore >= 40 && formData.minSkillsScore < 60 && "Beginner+ level required"}
                        {formData.minSkillsScore >= 60 && formData.minSkillsScore < 80 && "Intermediate+ level required"}
                        {formData.minSkillsScore >= 80 && formData.minSkillsScore < 90 && "Advanced+ level required"}
                        {formData.minSkillsScore >= 90 && "Elite level only - top performers"}
                      </p>
                    </div>
    
                    {/* Slider */}
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.minSkillsScore}
                        onChange={(e) => {
                          const score = Number(e.target.value);
                          // Auto-set tier based on score
                          let tier = "ANY";
                          if (score >= 90) tier = "ELITE";
                          else if (score >= 80) tier = "ADVANCED";
                          else if (score >= 60) tier = "INTERMEDIATE";
                          else if (score >= 40) tier = "BEGINNER";
    
                          updateFormData({
                            minSkillsScore: score,
                            requiredTier: tier
                          });
                        }}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${formData.minSkillsScore}%, #e5e7eb ${formData.minSkillsScore}%, #e5e7eb 100%)`
                        }}
                      />
    
                      {/* Tier Markers */}
                      <div className="flex justify-between mt-3 text-xs text-gray-500">
                        <span className="text-left">0%<br/>Any</span>
                        <span className="text-center">40%<br/>Beginner</span>
                        <span className="text-center">60%<br/>Intermediate</span>
                        <span className="text-center">80%<br/>Advanced</span>
                        <span className="text-right">90%+<br/>Elite</span>
                      </div>
                    </div>
                  </div>
    
                  {/* Custom Assessment Questions - Card Design */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800">
                          Custom Assessment Questions
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          Add role-specific questions to complement our standard skills test
                        </p>
                      </div>
                    </div>
    
                    {/* Empty State */}
                    {formData.customAssessmentQuestions.length === 0 && (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                        <div className="text-gray-400 mb-3">
                          <Info className="w-12 h-12 mx-auto" />
                        </div>
                        <p className="text-gray-600 mb-2 font-medium">No custom questions yet</p>
                        <p className="text-sm text-gray-500 mb-4">Example questions:</p>
                        <ul className="text-sm text-gray-500 text-left max-w-md mx-auto space-y-1">
                          <li>• "Describe your experience with [specific technology]"</li>
                          <li>• "How many years of experience do you have?"</li>
                          <li>• "Are you authorized to work in the US?"</li>
                        </ul>
                      </div>
                    )}
    
                    {/* Question Cards */}
                    <div className="space-y-4">
                      {formData.customAssessmentQuestions.map((q, idx) => {
                        const getTypeName = (type: string) => {
                          const typeMap: Record<string, string> = {
                            'text': 'Text Answer',
                            'number': 'Number',
                            'multiple_choice': 'Multiple Choice',
                            'yes_no': 'Yes/No'
                          };
                          return typeMap[type] || 'Select Type';
                        };
    
                        return (
                          <div key={idx} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                            {/* Card Header */}
                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                              <h4 className="font-semibold text-gray-800">
                                Question {idx + 1} {q.type && `- ${getTypeName(q.type)}`}
                              </h4>
                              <button
                                onClick={() => removeFromArray('customAssessmentQuestions', idx)}
                                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                type="button"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
    
                            {/* Card Body */}
                            <div className="p-5 space-y-4">
                              {/* Question Text */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Question</label>
                                <input
                                  placeholder="Enter your question here..."
                                  value={q.question}
                                  onChange={(e) => {
                                    const updated = [...formData.customAssessmentQuestions];
                                    updated[idx] = { ...updated[idx], question: e.target.value };
                                    updateFormData({ customAssessmentQuestions: updated });
                                  }}
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
    
                              {/* Type Selector - Icon Buttons */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Question Type</label>
                                <div className="grid grid-cols-4 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formData.customAssessmentQuestions];
                                      updated[idx] = { ...updated[idx], type: 'text' };
                                      updateFormData({ customAssessmentQuestions: updated });
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                      q.type === 'text'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                                  >
                                    <div className="text-2xl mb-1">📝</div>
                                    <div className="text-xs font-medium">Text</div>
                                  </button>
    
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formData.customAssessmentQuestions];
                                      updated[idx] = { ...updated[idx], type: 'number' };
                                      updateFormData({ customAssessmentQuestions: updated });
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                      q.type === 'number'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                                  >
                                    <div className="text-2xl mb-1">123</div>
                                    <div className="text-xs font-medium">Number</div>
                                  </button>
    
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formData.customAssessmentQuestions];
                                      updated[idx] = { ...updated[idx], type: 'multiple_choice' };
                                      updateFormData({ customAssessmentQuestions: updated });
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                      q.type === 'multiple_choice'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                                  >
                                    <div className="text-2xl mb-1">☐</div>
                                    <div className="text-xs font-medium">Choice</div>
                                  </button>
    
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formData.customAssessmentQuestions];
                                      updated[idx] = { ...updated[idx], type: 'yes_no' };
                                      updateFormData({ customAssessmentQuestions: updated });
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                      q.type === 'yes_no'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                                  >
                                    <div className="text-2xl mb-1">✓✗</div>
                                    <div className="text-xs font-medium">Yes/No</div>
                                  </button>
                                </div>
                              </div>
    
                              {/* Multiple Choice Options (conditional) */}
                              {q.type === 'multiple_choice' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <label className="block text-xs font-medium text-blue-900 mb-3">
                                    Multiple Choice Options
                                  </label>
                                  <div className="space-y-2">
                                    {[0, 1, 2, 3].map((optionIdx) => (
                                      <div key={optionIdx} className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-blue-700 w-8">
                                          {String.fromCharCode(65 + optionIdx)}.
                                        </span>
                                        <input
                                          type="text"
                                          placeholder={`Option ${String.fromCharCode(65 + optionIdx)}`}
                                          value={q.options?.[optionIdx] || ''}
                                          onChange={(e) => {
                                            const updated = [...formData.customAssessmentQuestions];
                                            const currentOptions = updated[idx].options || ['', '', '', ''];
                                            currentOptions[optionIdx] = e.target.value;
                                            updated[idx] = { ...updated[idx], options: currentOptions };
                                            updateFormData({ customAssessmentQuestions: updated });
                                          }}
                                          className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
    
                              {/* Weight Slider */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                  Question Weight (Points)
                                </label>
                                <div className="flex items-center gap-4">
                                  <span className="text-xs text-gray-500 w-12">Low</span>
                                  <div className="flex-1">
                                    <input
                                      type="range"
                                      min="1"
                                      max="10"
                                      value={q.weight || 5}
                                      onChange={(e) => {
                                        const updated = [...formData.customAssessmentQuestions];
                                        updated[idx] = { ...updated[idx], weight: Number(e.target.value) };
                                        updateFormData({ customAssessmentQuestions: updated });
                                      }}
                                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                      style={{
                                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((q.weight || 5) - 1) * 11.11}%, #e5e7eb ${((q.weight || 5) - 1) * 11.11}%, #e5e7eb 100%)`
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-500 w-12 text-right">High</span>
                                  <div className="w-12 text-center">
                                    <span className="text-lg font-bold text-blue-600">{q.weight || 5}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
    
                    {/* Add Question Button */}
                    <button
                      onClick={() => addToArray('customAssessmentQuestions', {
                        question: '',
                        type: 'text',
                        weight: 5
                      })}
                      className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
                      type="button"
                    >
                      <Plus className="w-5 h-5" />
                      Add Custom Question
                    </button>
                  </div>
                </div>
              )}
    
              {/* Navigation */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setCustomizationStep(2)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  type="button"
                >
                  Next: Hiring Process
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
    
          {/* CUSTOMIZATION STEP 2: Hiring Process (Current Step 5) */}
          {customizationStep === 2 && (
            <div className="bg-white rounded-xl border shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Hiring Process Setup</h2>
                <p className="text-gray-600">
                  Set your hiring timeline and expected start date.
                </p>
              </div>
    
              <div className="space-y-8">
                {/* Hiring Timeline - Visual Cards */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Hiring Timeline <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    How quickly do you need to fill this role?
                  </p>
    
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Urgent Card */}
                    <button
                      type="button"
                      onClick={() => updateFormData({ hiringTimeline: '1-2 weeks' })}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        formData.hiringTimeline === '1-2 weeks'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">🔥</div>
                      <div className="font-semibold text-gray-900">ASAP</div>
                      <div className="text-xs text-gray-600 mt-1">1-2 weeks</div>
                      <div className="text-xs mt-2 text-gray-500">Urgent</div>
                    </button>
    
                    {/* Fast Card */}
                    <button
                      type="button"
                      onClick={() => updateFormData({ hiringTimeline: '2-3 weeks' })}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        formData.hiringTimeline === '2-3 weeks'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">⚡</div>
                      <div className="font-semibold text-gray-900">Fast</div>
                      <div className="text-xs text-gray-600 mt-1">2-3 weeks</div>
                      <div className="text-xs mt-2 text-gray-500">Priority</div>
                      <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    </button>
    
                    {/* Standard Card */}
                    <button
                      type="button"
                      onClick={() => updateFormData({ hiringTimeline: '3-4 weeks' })}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        formData.hiringTimeline === '3-4 weeks'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">📅</div>
                      <div className="font-semibold text-gray-900">Standard</div>
                      <div className="text-xs text-gray-600 mt-1">3-4 weeks</div>
                      <div className="text-xs mt-2 text-gray-500">Normal</div>
                    </button>
    
                    {/* Flexible Card */}
                    <button
                      type="button"
                      onClick={() => updateFormData({ hiringTimeline: '1-2+ months' })}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        formData.hiringTimeline === '1-2+ months'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">🌱</div>
                      <div className="font-semibold text-gray-900">Flexible</div>
                      <div className="text-xs text-gray-600 mt-1">1-2+ months</div>
                      <div className="text-xs mt-2 text-gray-500">Patient</div>
                    </button>
                  </div>
                </div>
    
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDateNeeded}
                    onChange={(e) => updateFormData({ startDateNeeded: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
    
              {/* Navigation */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setCustomizationStep(1)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setCustomizationStep(3)}
                  disabled={!formData.hiringTimeline}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  type="button"
                >
                  Next: Application Settings
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
    
          {/* CUSTOMIZATION STEP 3: Application Settings (Current Step 6) */}
          {customizationStep === 3 && (
            <div className="bg-white rounded-xl border shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Application Settings</h2>
                <p className="text-gray-600">
                  Configure deadline and screening questions (all optional).
                </p>
              </div>
    
              {/* Info Banner */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">All settings on this page are optional</p>
                  <p className="text-blue-700">
                    You can skip this step and publish your job immediately, or customize these settings to better filter candidates.
                  </p>
                </div>
              </div>
    
              <div className="space-y-6">
                {/* Application Deadline with Quick Presets */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Application Deadline
                  </label>
                  <p className="text-xs text-gray-600 mb-3">
                    Leave blank for no deadline
                  </p>
    
                  {/* Quick Preset Buttons */}
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 7);
                        updateFormData({ deadline: date.toISOString().split('T')[0] });
                      }}
                      className="px-4 py-2 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      7 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 14);
                        updateFormData({ deadline: date.toISOString().split('T')[0] });
                      }}
                      className="px-4 py-2 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      14 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 30);
                        updateFormData({ deadline: date.toISOString().split('T')[0] });
                      }}
                      className="px-4 py-2 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      30 Days
                    </button>
                  </div>
    
                  {/* Date Picker */}
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => updateFormData({ deadline: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
    
                {/* Screening Questions */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Screening Questions
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Ask candidates specific questions before they apply (max 5 questions)
                  </p>
    
                  {formData.screeningQuestions.length === 0 ? (
                    // Empty State with Examples
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="text-gray-400 mb-3">
                        <Plus className="w-8 h-8 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        No screening questions added yet
                      </p>
                      <div className="text-xs text-gray-500 mb-4 space-y-1">
                        <p>💡 Example questions:</p>
                        <p className="text-gray-600">"Are you authorized to work in the US?"</p>
                        <p className="text-gray-600">"Do you have at least 3 years of experience with React?"</p>
                        <p className="text-gray-600">"Are you willing to relocate to San Francisco?"</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToArray('screeningQuestions', {
                          question: '',
                          required: false
                        })}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Add Your First Question
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Question Cards */}
                      {formData.screeningQuestions.map((q, idx) => (
                        <div key={idx} className="mb-3 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-semibold text-gray-500 mt-2">
                              Question {idx + 1}
                            </span>
                            <input
                              placeholder="Enter your question"
                              value={q.question}
                              onChange={(e) => {
                                const updated = [...formData.screeningQuestions];
                                updated[idx] = { ...updated[idx], question: e.target.value };
                                updateFormData({ screeningQuestions: updated });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            <label className="flex items-center gap-2 whitespace-nowrap mt-2">
                              <input
                                type="checkbox"
                                checked={q.required}
                                onChange={(e) => {
                                  const updated = [...formData.screeningQuestions];
                                  updated[idx] = { ...updated[idx], required: e.target.checked };
                                  updateFormData({ screeningQuestions: updated });
                                }}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">Required</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeFromArray('screeningQuestions', idx)}
                              className="text-red-600 hover:text-red-700 p-2 mt-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
    
                      {/* Add Another Question Button (only show if less than 5) */}
                      {formData.screeningQuestions.length < 5 && (
                        <button
                          type="button"
                          onClick={() => addToArray('screeningQuestions', {
                            question: '',
                            required: false
                          })}
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Another Question ({formData.screeningQuestions.length}/5)
                        </button>
                      )}
    
                      {/* Max Limit Message */}
                      {formData.screeningQuestions.length >= 5 && (
                        <p className="text-xs text-gray-500 italic">
                          Maximum of 5 screening questions reached
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
    
              {/* Navigation */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setCustomizationStep(2)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
    
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    {error || 'Failed to save job. Please try again.'}
                  </p>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
