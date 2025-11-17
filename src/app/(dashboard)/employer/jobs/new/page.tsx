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
  Link as LinkIcon,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  remoteType: "REMOTE" | "HYBRID" | "ON_SITE";

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

export default function NewJobPage() {
  const router = useRouter();
  const createJob = useCreateJob();

  // 3-Phase Flow State
  const [flow, setFlow] = useState<'import' | 'review' | 'customize'>('import');
  const [customizationStep, setCustomizationStep] = useState(0); // 0, 1, 2 for steps 4, 5, 6
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Import State
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");

  // Profile check
  const [profileCheckDone, setProfileCheckDone] = useState(false);

  // Form Data - Initialize with defaults
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
    interviewRoundsDetailed: [
      { roundNumber: 1, roundName: '', roundDescription: '', duration: '' }
    ],
    hiringTimeline: "",
    startDateNeeded: "",
    deadline: "",
    maxApplicants: "",
    screeningQuestions: [],
  });

  // Check employer profile on mount
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await api.get('/api/employers/profile');
        // Backend returns { employer, applicationStats }, so check employer.companyName
        if (!response.data.employer?.companyName) {
          router.push('/employer/settings?required=true');
          return;
        }
        setProfileCheckDone(true);
      } catch (error) {
        console.error('Failed to fetch employer profile:', error);
        router.push('/employer/settings?required=true');
      }
    };
    checkProfile();
  }, [router]);

  // Update form data helper
  const updateFormData = (updates: Partial<JobFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Handle job import from URL
  const handleImport = async () => {
    if (!importUrl.trim()) {
      setImportError("Please enter a valid job posting URL");
      return;
    }

    setIsImporting(true);
    setImportError("");

    try {
      const response = await api.post('/api/jobs/import', { url: importUrl });
      const { jobData } = response.data;

      // Merge imported data with form data
      setFormData(prev => ({
        ...prev,
        ...jobData,
        // Ensure Steps 4-6 remain empty for manual customization
        requiresAssessment: false,
        minSkillsScore: 0,
        requiredTier: "ANY",
        customAssessmentQuestions: [],
        interviewRoundsDetailed: [
          { roundNumber: 1, roundName: '', roundDescription: '', duration: '' }
        ],
        hiringTimeline: jobData.hiringTimeline || "",
        startDateNeeded: jobData.startDateNeeded || "",
        deadline: jobData.deadline || "",
        maxApplicants: "",
        screeningQuestions: [],
      }));

      // Move to review phase
      setFlow('review');
    } catch (error: any) {
      console.error("Import error:", error);
      setImportError(
        error.response?.data?.error ||
        "Failed to import job posting. Please check the URL and try again."
      );
    } finally {
      setIsImporting(false);
    }
  };

  // Add/remove items from arrays
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

  const updateArrayItem = (field: keyof JobFormData, index: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => i === index ? value : item)
    }));
  };

  // Submit job posting
  const handleSubmit = async () => {
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
        equityOffered: formData.equityOffered,
        specificBenefits: formData.specificBenefits,
        requiresAssessment: formData.requiresAssessment,
        minSkillsScore: formData.requiresAssessment ? formData.minSkillsScore : undefined,
        requiredTier: formData.requiresAssessment ? formData.requiredTier : undefined,
        customAssessmentQuestions: formData.requiresAssessment ? formData.customAssessmentQuestions : undefined,
        interviewRounds: formData.interviewRoundsDetailed.length,
        interviewProcess: JSON.stringify(formData.interviewRoundsDetailed),
        hiringTimeline: formData.hiringTimeline,
        startDateNeeded: formData.startDateNeeded || undefined,
        maxApplicants: formData.maxApplicants ? parseInt(formData.maxApplicants) : undefined,
        screeningQuestions: formData.screeningQuestions,
      };

      await createJob.mutateAsync(jobPayload);

      // Clear localStorage draft if exists
      if (typeof window !== "undefined") {
        localStorage.removeItem("jobFormDraft");
      }

      router.push('/employer/jobs?posted=true');
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  // Validation for customization steps
  const isCustomizationStepValid = (step: number): boolean => {
    if (step === 0) {
      // Skills Assessment - always valid (optional feature)
      return true;
    }
    if (step === 1) {
      // Interview Process - at least one round with name
      return formData.interviewRoundsDetailed.length > 0 &&
             formData.interviewRoundsDetailed[0].roundName.trim() !== '';
    }
    if (step === 2) {
      // Application Settings - at least deadline
      return formData.deadline !== '';
    }
    return false;
  };

  if (!profileCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ==================== PHASE 1: IMPORT ====================
  if (flow === 'import') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Post Your Job in 4 Minutes
            </h1>
            <p className="text-lg text-gray-600">
              Import your existing job posting, then customize for skills-verified candidates
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <LinkIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Import Your Job Posting</h2>
                <p className="text-sm text-gray-600">
                  Paste URL from LinkedIn, Indeed, or your career page
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="url"
                placeholder="https://company.com/careers/ml-engineer"
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && importUrl && !isImporting) {
                    handleImport();
                  }
                }}
              />

              <button
                onClick={handleImport}
                disabled={!importUrl || isImporting}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Import Job Details
                  </>
                )}
              </button>
            </div>

            {importError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  {importError}
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-gray-500 mb-4">
                Next: Review job details, then set up skills assessment & interview process
              </p>
              <div className="flex justify-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Step 1: Import
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                  Step 2: Review
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                  Step 3: Customize
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== PHASE 2: REVIEW ====================
  if (flow === 'review') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            Job Imported Successfully!
          </h1>
          <p className="text-gray-600">
            Review the imported details below. Click "Looks Good" to continue, or expand any section to make edits.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-6 flex justify-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            ✓ Step 1: Imported
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            Step 2: Review
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
            Step 3: Customize
          </span>
        </div>

        <div className="space-y-4">

          {/* Job Basics - Collapsible */}
          <div className="bg-white rounded-xl border shadow-sm">
            <button
              onClick={() => setExpandedSection(expandedSection === 'basics' ? null : 'basics')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Job Basics</h3>
                  <p className="text-sm text-gray-600">
                    {formData.title} • {formData.location} • {formData.employmentType.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'basics' ? 'rotate-180' : ''}`} />
            </button>

            {expandedSection === 'basics' && (
              <div className="px-6 pb-6 border-t">
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Job Title</label>
                    <input
                      value={formData.title}
                      onChange={(e) => updateFormData({ title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={formData.nicheCategory}
                      onChange={(e) => updateFormData({ nicheCategory: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category...</option>
                      {NICHE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      value={formData.location}
                      onChange={(e) => updateFormData({ location: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Remote Type</label>
                    <select
                      value={formData.remoteType}
                      onChange={(e) => updateFormData({ remoteType: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="ON_SITE">On-site</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Employment Type</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => updateFormData({ employmentType: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="FULL_TIME">Full-time</option>
                      <option value="PART_TIME">Part-time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience Level</label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => updateFormData({ experienceLevel: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ENTRY">Entry Level</option>
                      <option value="MID">Mid Level</option>
                      <option value="SENIOR">Senior Level</option>
                      <option value="LEAD">Lead/Staff</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description & Requirements - Collapsible */}
          <div className="bg-white rounded-xl border shadow-sm">
            <button
              onClick={() => setExpandedSection(expandedSection === 'description' ? null : 'description')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Description & Requirements</h3>
                  <p className="text-sm text-gray-600">
                    {formData.description?.slice(0, 80)}...
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'description' ? 'rotate-180' : ''}`} />
            </button>

            {expandedSection === 'description' && (
              <div className="px-6 pb-6 border-t">
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Job Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormData({ description: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Key Responsibilities</label>
                    {formData.keyResponsibilities.map((resp, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          value={resp}
                          onChange={(e) => updateArrayItem('keyResponsibilities', idx, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => removeFromArray('keyResponsibilities', idx)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addToArray('keyResponsibilities', '')}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Responsibility
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Required Skills</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                          {skill}
                          <button
                            onClick={() => removeFromArray('skills', idx)}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      placeholder="Add a skill and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          addToArray('skills', e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nice-to-Have Skills</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.niceToHaveSkills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2">
                          {skill}
                          <button
                            onClick={() => removeFromArray('niceToHaveSkills', idx)}
                            className="hover:text-gray-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      placeholder="Add a skill and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          addToArray('niceToHaveSkills', e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tech Stack</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.techStack.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                          {tech}
                          <button
                            onClick={() => removeFromArray('techStack', idx)}
                            className="hover:text-purple-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      placeholder="Add technology and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          addToArray('techStack', e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Compensation - Collapsible */}
          <div className="bg-white rounded-xl border shadow-sm">
            <button
              onClick={() => setExpandedSection(expandedSection === 'compensation' ? null : 'compensation')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Compensation & Benefits</h3>
                  <p className="text-sm text-gray-600">
                    {formData.salaryMin && formData.salaryMax
                      ? `$${formData.salaryMin.toLocaleString()} - $${formData.salaryMax.toLocaleString()}`
                      : 'Competitive salary'
                    }
                    {formData.specificBenefits.length > 0 && ` • ${formData.specificBenefits.length} benefits`}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'compensation' ? 'rotate-180' : ''}`} />
            </button>

            {expandedSection === 'compensation' && (
              <div className="px-6 pb-6 border-t">
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Min Salary (Annual)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.salaryMin || ''}
                        onChange={(e) => updateFormData({ salaryMin: Number(e.target.value) })}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Salary (Annual)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.salaryMax || ''}
                        onChange={(e) => updateFormData({ salaryMax: Number(e.target.value) })}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isCompetitive}
                      onChange={(e) => updateFormData({ isCompetitive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Competitive salary (if range not specified)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.equityOffered}
                      onChange={(e) => updateFormData({ equityOffered: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Equity/Stock options offered</span>
                  </label>
                </div>

                {/* Benefits Section - Hybrid Design */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-3">Benefits</label>

                  {/* Imported Benefits (as removable tags) */}
                  {formData.specificBenefits && formData.specificBenefits.length > 0 && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700 font-medium mb-2">
                        Imported from job posting ({formData.specificBenefits.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.specificBenefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm"
                          >
                            {benefit}
                            <button
                              onClick={() => {
                                const updated = formData.specificBenefits.filter((_, i) => i !== idx);
                                updateFormData({ specificBenefits: updated });
                              }}
                              className="hover:bg-blue-700 rounded-full p-0.5"
                              type="button"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Benefits (checkboxes for benefits NOT already imported) */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2">
                      Additional benefits (optional)
                    </p>
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
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setFlow('import')}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Re-import
          </button>
          <button
            onClick={() => {
              setFlow('customize');
              setCustomizationStep(0);
            }}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Looks Good - Continue to Customization
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Next: Set up skills assessment, interview process & screening questions
        </p>
      </div>
    );
  }

  // ==================== PHASE 3: CUSTOMIZE ====================
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Progress Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Customize for Skills-Verified Candidates
        </h1>
        <div className="flex items-center gap-4">
          <div className={`flex-1 h-2 rounded-full transition-colors ${customizationStep >= 0 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-2 rounded-full transition-colors ${customizationStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-2 rounded-full transition-colors ${customizationStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className={customizationStep === 0 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Skills Assessment
          </span>
          <span className={customizationStep === 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Interview Process
          </span>
          <span className={customizationStep === 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Application Settings
          </span>
        </div>
      </div>

      {/* CUSTOMIZATION STEP 1: Skills Assessment (Current Step 4) */}
      {customizationStep === 0 && (
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
              onClick={() => setFlow('review')}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Review
            </button>
            <button
              onClick={() => setCustomizationStep(1)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              type="button"
            >
              Next: Interview Process
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* CUSTOMIZATION STEP 2: Interview Process (Current Step 5) */}
      {customizationStep === 1 && (
        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Interview Process Setup</h2>
            <p className="text-gray-600">
              Define your interview rounds so candidates know what to expect.
            </p>
          </div>

          <div className="space-y-6">
            {/* Interview Rounds */}
            <div>
              <label className="block text-sm font-medium mb-2">Interview Rounds</label>

              {formData.interviewRoundsDetailed.map((round, idx) => (
                <div key={idx} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Round {round.roundNumber}</h4>
                    {formData.interviewRoundsDetailed.length > 1 && (
                      <button
                        onClick={() => {
                          const updated = formData.interviewRoundsDetailed
                            .filter((_, i) => i !== idx)
                            .map((r, i) => ({ ...r, roundNumber: i + 1 }));
                          updateFormData({ interviewRoundsDetailed: updated });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      placeholder="Round name (e.g., Technical Screen)"
                      value={round.roundName}
                      onChange={(e) => {
                        const updated = [...formData.interviewRoundsDetailed];
                        updated[idx] = { ...updated[idx], roundName: e.target.value };
                        updateFormData({ interviewRoundsDetailed: updated });
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <textarea
                      placeholder="Round description (what will be covered)"
                      value={round.roundDescription}
                      onChange={(e) => {
                        const updated = [...formData.interviewRoundsDetailed];
                        updated[idx] = { ...updated[idx], roundDescription: e.target.value };
                        updateFormData({ interviewRoundsDetailed: updated });
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      placeholder="Duration (e.g., 45 minutes)"
                      value={round.duration}
                      onChange={(e) => {
                        const updated = [...formData.interviewRoundsDetailed];
                        updated[idx] = { ...updated[idx], duration: e.target.value };
                        updateFormData({ interviewRoundsDetailed: updated });
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() => addToArray('interviewRoundsDetailed', {
                  roundNumber: formData.interviewRoundsDetailed.length + 1,
                  roundName: '',
                  roundDescription: '',
                  duration: ''
                })}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Interview Round
              </button>
            </div>

            {/* Hiring Timeline */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Hiring Timeline
              </label>
              <input
                placeholder="e.g., 2-3 weeks from first interview"
                value={formData.hiringTimeline}
                onChange={(e) => updateFormData({ hiringTimeline: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              onClick={() => setCustomizationStep(0)}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setCustomizationStep(2)}
              disabled={!isCustomizationStepValid(1)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              Next: Application Settings
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* CUSTOMIZATION STEP 3: Application Settings (Current Step 6) */}
      {customizationStep === 2 && (
        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Application Settings</h2>
            <p className="text-gray-600">
              Set application deadline and add screening questions.
            </p>
          </div>

          <div className="space-y-6">
            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Application Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => updateFormData({ deadline: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Max Applicants */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum Applicants (Optional)
              </label>
              <input
                type="number"
                placeholder="Leave empty for unlimited"
                value={formData.maxApplicants}
                onChange={(e) => updateFormData({ maxApplicants: e.target.value })}
                min="1"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Screening Questions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Screening Questions
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Ask candidates specific questions before they apply
              </p>

              {formData.screeningQuestions.map((q, idx) => (
                <div key={idx} className="mb-3 p-3 border rounded-lg">
                  <div className="flex gap-2 items-start">
                    <input
                      placeholder="Question"
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...formData.screeningQuestions];
                        updated[idx] = { ...updated[idx], question: e.target.value };
                        updateFormData({ screeningQuestions: updated });
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center gap-2 whitespace-nowrap">
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
                      onClick={() => removeFromArray('screeningQuestions', idx)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => addToArray('screeningQuestions', {
                  question: '',
                  required: false
                })}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Screening Question
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setCustomizationStep(1)}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isCustomizationStepValid(2) || createJob.isPending}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {createJob.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing Job...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Publish Job Posting
                </>
              )}
            </button>
          </div>

          {createJob.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {(createJob.error as any)?.message || 'Failed to publish job. Please try again.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
