"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateJob } from "@/hooks/useJobs";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Plus,
  Trash2,
  Info,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Stepper,
  Progress,
} from "@/components/ui";
import Link from "next/link";
import { api } from "@/lib/api";

// Form data interface matching all backend fields
interface JobFormData {
  // Step 1: Job Basics
  title: string;
  nicheCategory: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  experienceLevel: "ENTRY" | "MID" | "SENIOR" | "LEAD";
  location: string;
  remoteType: "REMOTE" | "HYBRID" | "ONSITE";

  // Step 2: Job Description
  description: string;
  keyResponsibilities: string[];
  skills: string[];
  niceToHaveSkills: string[];
  techStack: string[];

  // Step 3: Compensation & Benefits
  salaryMin: number;
  salaryMax: number;
  isCompetitive: boolean;
  equityOffered: boolean;
  specificBenefits: string[];

  // Step 4: Skills Assessment Requirements (CRITICAL)
  requiresAssessment: boolean;
  minSkillsScore: number;
  requiredTier: string;
  customAssessmentQuestions: Array<{
    question: string;
    type: string;
    weight: number;
    options?: string[]; // For multiple choice
    correctAnswer?: string | number; // Correct answer for validation
  }>;

  // Step 5: Interview Process - DETAILED
  interviewRoundsDetailed: Array<{
    roundNumber: number;
    roundName: string;
    roundDescription: string;
    duration: string;
  }>;
  hiringTimeline: string;
  startDateNeeded: string;

  // Step 6: Application Settings
  deadline: string;
  maxApplicants: string;
  screeningQuestions: Array<{
    question: string;
    required: boolean;
  }>;
}

const NICHE_CATEGORIES = [
  "AI/ML",
  "Healthcare IT",
  "Fintech",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "Data Science",
  "Web Development",
  "Mobile Development",
  "Blockchain",
];

const BENEFITS_OPTIONS = [
  "Health Insurance",
  "Dental Insurance",
  "Vision Insurance",
  "401(k)",
  "Paid Time Off",
  "Remote Work",
  "Flexible Hours",
  "Professional Development",
  "Stock Options",
  "Gym Membership",
  "Commuter Benefits",
  "Life Insurance",
];

const TIER_OPTIONS = [
  { value: "ANY", label: "Any Tier (No Minimum)" },
  { value: "BEGINNER", label: "Beginner+ (Entry Level)" },
  { value: "INTERMEDIATE", label: "Intermediate+ (Competent)" },
  { value: "ADVANCED", label: "Advanced+ (Proficient)" },
  { value: "ELITE", label: "Elite (Expert Only)" },
];

const QUESTION_TYPES = [
  { value: "text", label: "Text Answer" },
  { value: "number", label: "Number" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "yes_no", label: "Yes/No" },
];

// Autofill suggestions
const JOB_TITLE_SUGGESTIONS = [
  "Senior Machine Learning Engineer",
  "ML Engineer",
  "Data Scientist",
  "AI Research Scientist",
  "Computer Vision Engineer",
  "NLP Engineer",
  "Deep Learning Engineer",
  "MLOps Engineer",
  "AI Product Manager",
  "Research Engineer",
  "Senior Software Engineer",
  "Full Stack Developer",
  "Backend Engineer",
  "Frontend Developer",
  "DevOps Engineer",
  "Security Engineer",
  "Cloud Architect",
  "Data Engineer",
];

const LOCATION_SUGGESTIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Boston, MA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Denver, CO",
  "Remote (US)",
  "Remote (Global)",
  "Palo Alto, CA",
  "Mountain View, CA",
  "Sunnyvale, CA",
];

export default function NewJobPage() {
  const router = useRouter();
  const createJob = useCreateJob();
  const [profileCheckDone, setProfileCheckDone] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Initialize form data with localStorage if available
  const [formData, setFormData] = useState<JobFormData>(() => {
    const defaultData = {
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
      interviewRoundsDetailed: [],
      hiringTimeline: "",
      startDateNeeded: "",
      deadline: "",
      maxApplicants: "",
      screeningQuestions: [],
    };

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jobFormDraft");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Merge with defaults to ensure all new fields exist
          return {
            ...defaultData,
            ...parsed,
            // Ensure array fields are always arrays
            keyResponsibilities: Array.isArray(parsed.keyResponsibilities) ? parsed.keyResponsibilities : [],
            skills: Array.isArray(parsed.skills) ? parsed.skills : [],
            niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
            techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
            specificBenefits: Array.isArray(parsed.specificBenefits) ? parsed.specificBenefits : [],
            customAssessmentQuestions: Array.isArray(parsed.customAssessmentQuestions) ? parsed.customAssessmentQuestions : [],
            interviewRoundsDetailed: Array.isArray(parsed.interviewRoundsDetailed) ? parsed.interviewRoundsDetailed : [],
            screeningQuestions: Array.isArray(parsed.screeningQuestions) ? parsed.screeningQuestions : [],
            // Ensure numbers are numbers
            salaryMin: typeof parsed.salaryMin === 'number' ? parsed.salaryMin : 0,
            salaryMax: typeof parsed.salaryMax === 'number' ? parsed.salaryMax : 0,
          };
        } catch (error) {
          console.error("Failed to parse localStorage draft, using defaults:", error);
          // Clear corrupted data
          localStorage.removeItem("jobFormDraft");
          return defaultData;
        }
      }
    }
    return defaultData;
  });

  // Auto-save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jobFormDraft", JSON.stringify(formData));
    }
  }, [formData]);

  // Check employer profile
  useEffect(() => {
    const checkEmployerProfile = async () => {
      try {
        await api.get("/api/employers/profile");
        setProfileCheckDone(true);
      } catch (error: any) {
        if (error.response?.status === 404) {
          alert("Please complete your employer profile before posting jobs.");
          router.push("/employer/profile");
        } else {
          setProfileCheckDone(true);
        }
      }
    };
    checkEmployerProfile();
  }, [router]);

  // Helper: Update form data
  const updateFormData = (updates: Partial<JobFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Helper: Add item to array field
  const addArrayItem = (field: keyof JobFormData, value: string) => {
    if (!value.trim()) return;
    const currentArray = formData[field] as string[];
    updateFormData({ [field]: [...currentArray, value.trim()] });
  };

  // Helper: Remove item from array field
  const removeArrayItem = (field: keyof JobFormData, index: number) => {
    const currentArray = formData[field] as any[];
    updateFormData({ [field]: currentArray.filter((_, i) => i !== index) });
  };

  // Helper: Add custom assessment question
  const addCustomQuestion = () => {
    if (formData.customAssessmentQuestions.length >= 3) {
      alert("Maximum 3 custom questions allowed");
      return;
    }
    updateFormData({
      customAssessmentQuestions: [
        ...formData.customAssessmentQuestions,
        { question: "", type: "text", weight: 1 },
      ],
    });
  };

  // Helper: Update custom question
  const updateCustomQuestion = (
    index: number,
    updates: Partial<{
      question: string;
      type: string;
      weight: number;
      options: string[];
      correctAnswer: string | number;
    }>
  ) => {
    const updated = [...formData.customAssessmentQuestions];
    updated[index] = { ...updated[index], ...updates };
    updateFormData({ customAssessmentQuestions: updated });
  };

  // Helper: Add screening question
  const addScreeningQuestion = () => {
    updateFormData({
      screeningQuestions: [
        ...formData.screeningQuestions,
        { question: "", required: false },
      ],
    });
  };

  // Helper: Update screening question
  const updateScreeningQuestion = (
    index: number,
    updates: Partial<{ question: string; required: boolean }>
  ) => {
    const updated = [...formData.screeningQuestions];
    updated[index] = { ...updated[index], ...updates };
    updateFormData({ screeningQuestions: updated });
  };

  // Helper: Import job from JSON
  const handleImportJob = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        // Merge with existing data, preserving structure
        updateFormData({
          ...formData,
          ...imported,
        });
        alert("Job data imported successfully!");
      } catch (error) {
        alert("Failed to import job. Please ensure the file is valid JSON.");
      }
    };
    reader.readAsText(file);
  };

  // Helper: Export current job as JSON
  const handleExportJob = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `job-${formData.title || "draft"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper: Add interview round
  const addInterviewRound = () => {
    const newRound = {
      roundNumber: formData.interviewRoundsDetailed.length + 1,
      roundName: "",
      roundDescription: "",
      duration: "",
    };
    updateFormData({
      interviewRoundsDetailed: [...formData.interviewRoundsDetailed, newRound],
    });
  };

  // Helper: Update interview round
  const updateInterviewRound = (
    index: number,
    updates: Partial<{
      roundName: string;
      roundDescription: string;
      duration: string;
    }>
  ) => {
    const updated = [...formData.interviewRoundsDetailed];
    updated[index] = { ...updated[index], ...updates };
    updateFormData({ interviewRoundsDetailed: updated });
  };

  // Helper: Remove interview round
  const removeInterviewRound = (index: number) => {
    const updated = formData.interviewRoundsDetailed
      .filter((_, i) => i !== index)
      .map((round, idx) => ({ ...round, roundNumber: idx + 1 }));
    updateFormData({ interviewRoundsDetailed: updated });
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Job Basics
        return !!(
          formData.title &&
          formData.nicheCategory &&
          formData.location
        );
      case 1: // Job Description
        return !!(
          formData.description &&
          formData.keyResponsibilities.length > 0 &&
          formData.skills.length > 0
        );
      case 2: // Compensation
        return true; // Optional fields
      case 3: // Skills Assessment
        if (formData.requiresAssessment) {
          return !!(formData.minSkillsScore >= 0 && formData.requiredTier);
        }
        return true;
      case 4: // Interview Process - NOW REQUIRED
        return !!(
          formData.interviewRoundsDetailed.length > 0 &&
          formData.interviewRoundsDetailed.every(
            (round) => round.roundName && round.roundDescription
          ) &&
          formData.hiringTimeline
        );
      case 5: // Application Settings
        return true; // Optional fields
      default:
        return false;
    }
  };

  // Navigation
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      alert("Please fill in all required fields before proceeding.");
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Calculate progress
  const calculateProgress = (): number => {
    let completed = 0;
    let total = 6;

    if (formData.title && formData.nicheCategory && formData.location)
      completed++;
    if (formData.description && formData.keyResponsibilities.length > 0)
      completed++;
    if (
      formData.salaryMin ||
      formData.salaryMax ||
      formData.specificBenefits.length > 0
    )
      completed++;
    if (
      !formData.requiresAssessment ||
      (formData.minSkillsScore >= 0 && formData.requiredTier)
    )
      completed++;
    if (
      formData.interviewRoundsDetailed.length > 0 &&
      formData.hiringTimeline
    )
      completed++;
    completed++; // Application settings are optional

    return Math.round((completed / total) * 100);
  };

  // Transform form data to backend payload
  const transformToBackendPayload = () => {
    // Map frontend experience levels to backend enum values
    const experienceLevelMap: Record<string, string> = {
      ENTRY: "ENTRY_LEVEL",
      MID: "MID_LEVEL",
      SENIOR: "SENIOR_LEVEL",
      LEAD: "EXECUTIVE",
    };

    return {
      // Basic info
      title: formData.title,
      description: formData.description,
      type: formData.employmentType,
      location: formData.location,
      remote: formData.remoteType === "REMOTE",
      experienceLevel:
        experienceLevelMap[formData.experienceLevel] ||
        formData.experienceLevel,

      // New comprehensive fields
      nicheCategory: formData.nicheCategory,
      remoteType: formData.remoteType,
      keyResponsibilities: formData.keyResponsibilities,

      // Skills
      skills: formData.skills,
      niceToHaveSkills: formData.niceToHaveSkills,
      techStack: formData.techStack,

      // Compensation
      salaryMin: formData.salaryMin || null,
      salaryMax: formData.salaryMax || null,
      equityOffered: formData.equityOffered,
      specificBenefits: formData.specificBenefits,

      // Skills Assessment (CRITICAL)
      requiresAssessment: formData.requiresAssessment,
      minSkillsScore: formData.requiresAssessment
        ? formData.minSkillsScore
        : null,
      requiredTier: formData.requiresAssessment ? formData.requiredTier : null,
      customAssessmentQuestions:
        formData.requiresAssessment &&
        formData.customAssessmentQuestions.length > 0
          ? formData.customAssessmentQuestions
          : null,

      // Interview Process - transformed to backend format
      interviewRounds: formData.interviewRoundsDetailed.length || null,
      interviewProcess: formData.interviewRoundsDetailed.length > 0
        ? formData.interviewRoundsDetailed
            .map(
              (r, i) =>
                `Round ${r.roundNumber}: ${r.roundName}\n${r.roundDescription}${
                  r.duration ? ` (${r.duration})` : ""
                }`
            )
            .join("\n\n")
        : null,
      interviewRoundsDetailed: formData.interviewRoundsDetailed.length > 0
        ? formData.interviewRoundsDetailed
        : null,
      hiringTimeline: formData.hiringTimeline || null,
      startDateNeeded: formData.startDateNeeded
        ? new Date(formData.startDateNeeded).toISOString()
        : null,

      // Application Settings
      deadline: formData.deadline
        ? new Date(formData.deadline).toISOString()
        : null,
      maxApplicants: formData.maxApplicants
        ? parseInt(formData.maxApplicants)
        : null,
      screeningQuestions:
        formData.screeningQuestions.length > 0
          ? formData.screeningQuestions
          : null,

      // Dummy fields required by backend
      requirements: formData.skills.join(", "),
      responsibilities: formData.keyResponsibilities.join(", "),
    };
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();

    // Validate all steps before final submission
    if (!saveAsDraft) {
      for (let i = 0; i < 6; i++) {
        if (!validateStep(i)) {
          alert(`Please complete Step ${i + 1} before submitting.`);
          setCurrentStep(i);
          return;
        }
      }
    }

    try {
      if (saveAsDraft) {
        setIsSavingDraft(true);
      }

      const payload = transformToBackendPayload();
      console.log("[Job Form] Submitting payload:", payload);

      await createJob.mutateAsync(payload as any);

      // Clear draft from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("jobFormDraft");
      }

      // Success
      setTimeout(() => {
        router.push("/employer/dashboard");
      }, 2000);
    } catch (error) {
      console.error("[Job Form] Submission error:", error);
    } finally {
      if (saveAsDraft) {
        setIsSavingDraft(false);
      }
    }
  };

  // Loading state
  if (!profileCheckDone) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  // Success state
  if (createJob.isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Job Posted Successfully!
            </h2>
            <p className="text-secondary-600 text-center mb-6">
              Your job is now live and accepting applications. Candidates can
              start applying immediately.
            </p>
            <Button variant="primary" asChild>
              <Link href="/employer/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Stepper steps
  const steps = [
    { id: "basics", label: "Job Basics" },
    { id: "description", label: "Description" },
    { id: "compensation", label: "Compensation" },
    { id: "assessment", label: "Skills Assessment" },
    { id: "interview", label: "Interview Process" },
    { id: "settings", label: "Application Settings" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/employer/dashboard"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Post a New Job
            </h1>
            <p className="text-secondary-600 mt-2">
              Complete all 6 steps to create your comprehensive job posting
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportJob}
              title="Export job data as JSON"
            >
              Export JSON
            </Button>
            <label className="cursor-pointer inline-block">
              <span className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors">
                Import JSON
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJob}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-secondary-700">
            Overall Progress
          </span>
          <span className="text-sm font-medium text-primary-600">
            {calculateProgress()}%
          </span>
        </div>
        <Progress value={calculateProgress()} />
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <Stepper steps={steps} currentStep={currentStep + 1} />
      </div>

      {/* Error Message */}
      {createJob.isError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">
                Failed to post job
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {(createJob.error as any)?.response?.data?.message ||
                  "Please check your inputs and try again."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* STEP 1: Job Basics */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Job Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  list="job-titles"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Senior Machine Learning Engineer"
                />
                <datalist id="job-titles">
                  {JOB_TITLE_SUGGESTIONS.map((title) => (
                    <option key={title} value={title} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Niche Category *
                </label>
                <select
                  required
                  value={formData.nicheCategory}
                  onChange={(e) =>
                    updateFormData({ nicheCategory: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a niche...</option>
                  {NICHE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">
                    Employment Type *
                  </label>
                  <select
                    required
                    value={formData.employmentType}
                    onChange={(e) =>
                      updateFormData({
                        employmentType: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">
                    Experience Level *
                  </label>
                  <select
                    required
                    value={formData.experienceLevel}
                    onChange={(e) =>
                      updateFormData({
                        experienceLevel: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="ENTRY">Entry Level</option>
                    <option value="MID">Mid Level</option>
                    <option value="SENIOR">Senior</option>
                    <option value="LEAD">Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  list="locations"
                  value={formData.location}
                  onChange={(e) => updateFormData({ location: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., San Francisco, CA"
                />
                <datalist id="locations">
                  {LOCATION_SUGGESTIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Remote Type *
                </label>
                <select
                  required
                  value={formData.remoteType}
                  onChange={(e) =>
                    updateFormData({ remoteType: e.target.value as any })
                  }
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">On-site</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Job Description */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Job Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData({ description: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe the role, what the candidate will do, and why they should join your team..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Key Responsibilities *
                </label>
                <div className="space-y-2">
                  {formData.keyResponsibilities.map((resp, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={resp}
                        readOnly
                        className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg bg-secondary-50"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          removeArrayItem("keyResponsibilities", index)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="new-responsibility"
                      placeholder="Add a key responsibility..."
                      className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          addArrayItem("keyResponsibilities", input.value);
                          input.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.getElementById(
                          "new-responsibility"
                        ) as HTMLInputElement;
                        if (input) {
                          addArrayItem("keyResponsibilities", input.value);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Required Skills *
                </label>
                <div className="space-y-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                        {skill}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("skills", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="new-skill"
                      placeholder="Add a required skill..."
                      className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          addArrayItem("skills", input.value);
                          input.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.getElementById(
                          "new-skill"
                        ) as HTMLInputElement;
                        if (input) {
                          addArrayItem("skills", input.value);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Nice-to-Have Skills
                </label>
                <div className="space-y-2">
                  {formData.niceToHaveSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                        {skill}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          removeArrayItem("niceToHaveSkills", index)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="new-nice-skill"
                      placeholder="Add a nice-to-have skill..."
                      className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          addArrayItem("niceToHaveSkills", input.value);
                          input.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.getElementById(
                          "new-nice-skill"
                        ) as HTMLInputElement;
                        if (input) {
                          addArrayItem("niceToHaveSkills", input.value);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Tech Stack
                </label>
                <div className="space-y-2">
                  {formData.techStack.map((tech, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {tech}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("techStack", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="new-tech"
                      placeholder="Add a technology..."
                      className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          addArrayItem("techStack", input.value);
                          input.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.getElementById(
                          "new-tech"
                        ) as HTMLInputElement;
                        if (input) {
                          addArrayItem("techStack", input.value);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: Compensation & Benefits */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Compensation & Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">
                    Min Salary (Annual)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center border border-secondary-300 rounded-lg overflow-hidden">
                      <span className="px-3 py-2 bg-secondary-50 text-secondary-600">
                        $
                      </span>
                      <input
                        type="text"
                        value={formData.salaryMin.toLocaleString()}
                        readOnly
                        className="flex-1 px-4 py-2 focus:outline-none text-right"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFormData({
                            salaryMin: formData.salaryMin + 5000,
                          })
                        }
                        className="px-2 py-1 text-xs"
                      >
                        +5K
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFormData({
                            salaryMin: formData.salaryMin + 1000,
                          })
                        }
                        className="px-2 py-1 text-xs"
                      >
                        +1K
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFormData({
                            salaryMin: Math.max(0, formData.salaryMin - 5000),
                          })
                        }
                        className="px-2 py-1 text-xs"
                      >
                        -5K
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFormData({
                            salaryMin: Math.max(0, formData.salaryMin - 1000),
                          })
                        }
                        className="px-2 py-1 text-xs"
                      >
                        -1K
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">
                    Max Salary (Annual)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center border border-secondary-300 rounded-lg overflow-hidden">
                      <span className="px-3 py-2 bg-secondary-50 text-secondary-600">
                        $
                      </span>
                      <input
                        type="text"
                        value={formData.salaryMax.toLocaleString()}
                        readOnly
                        className="flex-1 px-4 py-2 focus:outline-none text-right"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFormData({
                            salaryMax: formData.salaryMax + 5000,
                          })
                        }
                        className="px-2 py-1 text-xs"
                      >
                        +5K
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFormData({
                            salaryMax: formData.salaryMax + 1000,
                          })
                        }
                        className="px-2 py-1 text-xs"
                      >
                        +1K
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFormData({
                            salaryMax: Math.max(0, formData.salaryMax - 5000),
                          })
                        }
                        className="px-2 py-1 text-xs"
                      >
                        -5K
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFormData({
                            salaryMax: Math.max(0, formData.salaryMax - 1000),
                          })
                        }
                        className="px-2 py-1 text-xs"
                      >
                        -1K
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="competitive-salary"
                  checked={formData.isCompetitive}
                  onChange={(e) =>
                    updateFormData({ isCompetitive: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="competitive-salary"
                  className="text-sm font-medium text-secondary-900"
                >
                  Competitive salary (check if salary is negotiable/competitive)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="equity-offered"
                  checked={formData.equityOffered}
                  onChange={(e) =>
                    updateFormData({ equityOffered: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="equity-offered"
                  className="text-sm font-medium text-secondary-900"
                >
                  Equity/Stock options offered
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-3">
                  Benefits
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BENEFITS_OPTIONS.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`benefit-${benefit}`}
                        checked={formData.specificBenefits.includes(benefit)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData({
                              specificBenefits: [
                                ...formData.specificBenefits,
                                benefit,
                              ],
                            });
                          } else {
                            updateFormData({
                              specificBenefits:
                                formData.specificBenefits.filter(
                                  (b) => b !== benefit
                                ),
                            });
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      />
                      <label
                        htmlFor={`benefit-${benefit}`}
                        className="text-sm text-secondary-700"
                      >
                        {benefit}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: Skills Assessment Requirements (CRITICAL) */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 4: Skills Assessment Requirements
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                  CRITICAL NEW FEATURE
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      About Skills Assessment
                    </h4>
                    <p className="text-sm text-blue-700">
                      Require candidates to complete a skills assessment before
                      applying. You can set minimum score requirements and tier
                      levels to filter qualified applicants.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requires-assessment"
                  checked={formData.requiresAssessment}
                  onChange={(e) =>
                    updateFormData({ requiresAssessment: e.target.checked })
                  }
                  className="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="requires-assessment"
                  className="text-base font-medium text-secondary-900"
                >
                  Require skills assessment for this position
                </label>
              </div>

              {formData.requiresAssessment && (
                <div className="space-y-6 pl-8 border-l-2 border-primary-200">
                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-3">
                      Minimum Skills Score: {formData.minSkillsScore}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.minSkillsScore}
                      onChange={(e) =>
                        updateFormData({
                          minSkillsScore: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex justify-between text-xs text-secondary-600 mt-1">
                      <span>0 (Any score)</span>
                      <span>50 (Average)</span>
                      <span>100 (Perfect)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-2">
                      Required Tier
                    </label>
                    <select
                      value={formData.requiredTier}
                      onChange={(e) =>
                        updateFormData({ requiredTier: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {TIER_OPTIONS.map((tier) => (
                        <option key={tier.value} value={tier.value}>
                          {tier.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-900 mb-2">
                      Custom Assessment Questions (Max 3)
                    </label>
                    <div className="space-y-3">
                      {formData.customAssessmentQuestions.map((q, index) => (
                        <div
                          key={index}
                          className="border border-secondary-300 rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-secondary-700">
                              Question {index + 1}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeArrayItem(
                                  "customAssessmentQuestions",
                                  index
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <input
                            type="text"
                            placeholder="Enter your question..."
                            value={q.question}
                            onChange={(e) =>
                              updateCustomQuestion(index, {
                                question: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-secondary-600 mb-1">
                                Answer Type
                              </label>
                              <select
                                value={q.type}
                                onChange={(e) =>
                                  updateCustomQuestion(index, {
                                    type: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                {QUESTION_TYPES.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-secondary-600 mb-1">
                                Weight (1-10)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={q.weight}
                                onChange={(e) =>
                                  updateCustomQuestion(index, {
                                    weight: parseInt(e.target.value) || 1,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                          </div>

                          {/* Multiple Choice Options */}
                          {q.type === "multiple_choice" && (
                            <div className="mt-3 pt-3 border-t border-secondary-200">
                              <label className="block text-xs text-secondary-600 mb-2">
                                Answer Options (one per line)
                              </label>
                              <textarea
                                placeholder="Option A&#10;Option B&#10;Option C&#10;Option D"
                                value={(q.options || []).join("\n")}
                                onChange={(e) =>
                                  updateCustomQuestion(index, {
                                    options: e.target.value
                                      .split("\n")
                                      .filter((o) => o.trim()),
                                  })
                                }
                                rows={4}
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                              {q.options && q.options.length > 0 && (
                                <div className="mt-2">
                                  <label className="block text-xs text-secondary-600 mb-1">
                                    Correct Answer
                                  </label>
                                  <select
                                    value={q.correctAnswer || ""}
                                    onChange={(e) =>
                                      updateCustomQuestion(index, {
                                        correctAnswer: e.target.value,
                                      })
                                    }
                                    className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  >
                                    <option value="">Select correct answer...</option>
                                    {q.options.map((opt, optIdx) => (
                                      <option key={optIdx} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Yes/No - Store correct answer */}
                          {q.type === "yes_no" && (
                            <div className="mt-3 pt-3 border-t border-secondary-200">
                              <label className="block text-xs text-secondary-600 mb-2">
                                Correct Answer
                              </label>
                              <select
                                value={q.correctAnswer || ""}
                                onChange={(e) =>
                                  updateCustomQuestion(index, {
                                    correctAnswer: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                <option value="">Select correct answer...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </div>
                          )}
                        </div>
                      ))}

                      {formData.customAssessmentQuestions.length < 3 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addCustomQuestion}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Custom Question
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* STEP 5: Interview Process - DETAILED */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Interview Process *</CardTitle>
              <p className="text-sm text-secondary-600 mt-1">
                Define each interview round in detail
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-3">
                  Interview Rounds * (Add at least one)
                </label>
                <div className="space-y-4">
                  {formData.interviewRoundsDetailed.map((round, index) => (
                    <div
                      key={index}
                      className="border border-secondary-300 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-secondary-700">
                          Round {round.roundNumber}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeInterviewRound(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div>
                        <label className="block text-xs text-secondary-600 mb-1">
                          Round Name/Type *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Technical Phone Screen, System Design, Behavioral"
                          value={round.roundName}
                          onChange={(e) =>
                            updateInterviewRound(index, {
                              roundName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-secondary-600 mb-1">
                          Description *
                        </label>
                        <textarea
                          required
                          placeholder="Describe what this round covers, who conducts it, and what to expect..."
                          value={round.roundDescription}
                          onChange={(e) =>
                            updateInterviewRound(index, {
                              roundDescription: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-secondary-600 mb-1">
                          Duration (optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 45 minutes, 1 hour"
                          value={round.duration}
                          onChange={(e) =>
                            updateInterviewRound(index, {
                              duration: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addInterviewRound}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Interview Round
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Overall Hiring Timeline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.hiringTimeline}
                  onChange={(e) =>
                    updateFormData({ hiringTimeline: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 2-4 weeks from application to offer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Start Date Needed
                </label>
                <input
                  type="date"
                  value={formData.startDateNeeded}
                  onChange={(e) =>
                    updateFormData({ startDateNeeded: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 6: Application Settings */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 6: Application Settings</CardTitle>
              <p className="text-sm text-secondary-600 mt-1">
                Configure application deadline and screening questions (optional)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      Final Step - Review Before Posting
                    </h4>
                    <p className="text-sm text-blue-700">
                      These settings are optional. Click "Create Job" at the bottom when you're ready to post.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      updateFormData({ deadline: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">
                    Maximum Applicants
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxApplicants}
                    onChange={(e) =>
                      updateFormData({ maxApplicants: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Screening Questions
                </label>
                <div className="space-y-3">
                  {formData.screeningQuestions.map((q, index) => (
                    <div
                      key={index}
                      className="border border-secondary-300 rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Enter screening question..."
                          value={q.question}
                          onChange={(e) =>
                            updateScreeningQuestion(index, {
                              question: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            removeArrayItem("screeningQuestions", index)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`screening-required-${index}`}
                          checked={q.required}
                          onChange={(e) =>
                            updateScreeningQuestion(index, {
                              required: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                        />
                        <label
                          htmlFor={`screening-required-${index}`}
                          className="text-xs text-secondary-700"
                        >
                          Required question
                        </label>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addScreeningQuestion}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Screening Question
                  </Button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <h4 className="text-sm font-semibold text-green-900 mb-2">
                  Ready to Submit
                </h4>
                <p className="text-sm text-green-700">
                  Review all the information you've entered. Your job will be
                  posted immediately and will be live for candidates to apply.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t">
          <div>
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={createJob.isPending || isSavingDraft}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e as any, true)}
              disabled={createJob.isPending || isSavingDraft}
            >
              {isSavingDraft ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>

            {currentStep < 5 ? (
              <Button
                type="button"
                variant="primary"
                onClick={goToNextStep}
                disabled={createJob.isPending || isSavingDraft}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={createJob.isPending || isSavingDraft}
                className="min-w-[140px]"
              >
                {createJob.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Job"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
