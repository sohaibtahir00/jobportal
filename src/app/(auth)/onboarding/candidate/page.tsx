"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Phone,
  Briefcase,
  TrendingUp,
  CheckCircle,
  Upload,
  FileText,
  MapPin,
  User,
  Link as LinkIcon,
  GraduationCap,
  Building,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Edit2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast, Button } from "@/components/ui";
import { useSession, signOut } from "next-auth/react";
import api from "@/lib/api";
import { uploadFile } from "@/lib/api/profile";
import { JobType } from "@/types";
import { extractTextFromPDF, extractTextFromDOCX, isPDFFile, isWordFile } from "@/lib/pdf-utils";

// Types
interface WorkExperience {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  location: string | null;
}

interface Education {
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: number;
  gpa: number | null;
}

interface ResumeData {
  name: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  currentRole: string | null;
  experience: number;
  skills: string[];
  linkedIn: string | null;
  github: string | null;
  personalWebsite: string | null;
  portfolio: string | null;
  workExperience: WorkExperience[];
  education: Education[];
}

interface JobPreferences {
  nicheCategory: string;
  preferredJobType: JobType | "";
  expectedSalary: number | "";
  remotePreference: string;
  openToContract: boolean;
  willingToRelocate: boolean;
}

const nicheCategories = [
  { value: "AI_ML", label: "AI / Machine Learning", icon: "🤖" },
  { value: "HEALTHCARE_IT", label: "Healthcare IT", icon: "🏥" },
  { value: "FINTECH", label: "FinTech", icon: "💰" },
  { value: "CYBERSECURITY", label: "Cybersecurity", icon: "🔒" },
];

const remotePreferences = [
  { value: "REMOTE", label: "Remote Only" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "On-site" },
  { value: "ANY", label: "No Preference" },
];

const jobTypes = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

export default function CandidateOnboardingPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Import method states
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState<string | null>(null);

  // Step 2: Profile data states
  const [profileData, setProfileData] = useState<ResumeData>({
    name: session?.user?.name || "",
    phone: "",
    location: "",
    bio: "",
    currentRole: "",
    experience: 0,
    skills: [],
    linkedIn: "",
    github: "",
    personalWebsite: "",
    portfolio: "",
    workExperience: [],
    education: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [editingWorkExp, setEditingWorkExp] = useState<number | null>(null);
  const [editingEdu, setEditingEdu] = useState<number | null>(null);

  // Step 3: Job preferences states
  const [jobPreferences, setJobPreferences] = useState<JobPreferences>({
    nicheCategory: "",
    preferredJobType: "",
    expectedSalary: "",
    remotePreference: "",
    openToContract: false,
    willingToRelocate: false,
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle resume file selection and parsing
  const handleResumeSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - PDF or Word documents
    const isPdf = isPDFFile(file);
    const isWord = isWordFile(file);

    if (!isPdf && !isWord) {
      showToast("error", "Invalid File", "Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "File Too Large", "Maximum file size is 5MB");
      return;
    }

    setResumeFile(file);
    setIsParsingResume(true);

    try {
      // Extract text based on file type
      let extractedText: string;

      if (isPdf) {
        extractedText = await extractTextFromPDF(file);
      } else {
        extractedText = await extractTextFromDOCX(file);
      }

      if (!extractedText || extractedText.trim().length < 50) {
        showToast(
          "error",
          "Cannot Read Document",
          isPdf
            ? "Could not extract text from this PDF. Please ensure it contains selectable text, not scanned images."
            : "Could not extract text from this Word document. Please ensure it's not corrupted."
        );
        setResumeFile(null);
        setIsParsingResume(false);
        return;
      }

      // Send extracted text to API for AI parsing
      const response = await api.post("/api/candidates/parse-resume", {
        text: extractedText,
      });

      if (response.data.success) {
        const data = response.data.data;

        // Update profile data with parsed values
        setProfileData({
          name: data.name || session?.user?.name || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          currentRole: data.currentRole || "",
          experience: data.experience || 0,
          skills: data.skills || [],
          linkedIn: data.linkedIn || "",
          github: data.github || "",
          personalWebsite: data.personalWebsite || "",
          portfolio: data.portfolio || "",
          workExperience: data.workExperience || [],
          education: data.education || [],
        });

        // Upload the resume file for storage
        try {
          const uploadResult = await uploadFile(file, "resume");
          setUploadedResumeUrl(uploadResult.url);
        } catch (uploadError) {
          console.error("Resume upload error:", uploadError);
          // Non-critical, continue anyway
        }

        showToast("success", "Resume Parsed!", "We've extracted your information. Please review and edit if needed.");
        setCurrentStep(2);
      }
    } catch (error: any) {
      console.error("Resume parsing error:", error);
      showToast(
        "error",
        "Parsing Failed",
        error.response?.data?.error || "Couldn't read your resume. Please try again or fill in manually."
      );
      setResumeFile(null);
    } finally {
      setIsParsingResume(false);
    }
  };

  // Add skill
  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, skill],
      });
      setSkillInput("");
    }
  };

  // Remove skill
  const removeSkill = (index: number) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((_, i) => i !== index),
    });
  };

  // Add work experience
  const addWorkExperience = () => {
    setProfileData({
      ...profileData,
      workExperience: [
        ...profileData.workExperience,
        {
          companyName: "",
          jobTitle: "",
          startDate: "",
          endDate: null,
          isCurrent: false,
          description: null,
          location: null,
        },
      ],
    });
    setEditingWorkExp(profileData.workExperience.length);
  };

  // Update work experience
  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...profileData.workExperience];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "isCurrent" && value) {
      updated[index].endDate = null;
    }
    setProfileData({ ...profileData, workExperience: updated });
  };

  // Remove work experience
  const removeWorkExperience = (index: number) => {
    setProfileData({
      ...profileData,
      workExperience: profileData.workExperience.filter((_, i) => i !== index),
    });
    setEditingWorkExp(null);
  };

  // Add education
  const addEducation = () => {
    setProfileData({
      ...profileData,
      education: [
        ...profileData.education,
        {
          schoolName: "",
          degree: "",
          fieldOfStudy: "",
          graduationYear: new Date().getFullYear(),
          gpa: null,
        },
      ],
    });
    setEditingEdu(profileData.education.length);
  };

  // Update education
  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...profileData.education];
    updated[index] = { ...updated[index], [field]: value };
    setProfileData({ ...profileData, education: updated });
  };

  // Remove education
  const removeEducation = (index: number) => {
    setProfileData({
      ...profileData,
      education: profileData.education.filter((_, i) => i !== index),
    });
    setEditingEdu(null);
  };

  // Submit all data
  const handleSubmit = async (skipPreferences = false) => {
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!profileData.currentRole) {
        showToast("error", "Required Field", "Please enter your current role/title");
        setCurrentStep(2);
        setIsSubmitting(false);
        return;
      }

      if (!skipPreferences && !jobPreferences.nicheCategory) {
        showToast("error", "Required Field", "Please select your niche category");
        setIsSubmitting(false);
        return;
      }

      // 1. Update candidate profile
      await api.patch("/api/candidates/profile", {
        phone: profileData.phone || null,
        location: profileData.location || null,
        bio: profileData.bio || null,
        currentRole: profileData.currentRole,
        experience: profileData.experience,
        skills: profileData.skills,
        linkedIn: profileData.linkedIn || null,
        github: profileData.github || null,
        personalWebsite: profileData.personalWebsite || null,
        portfolio: profileData.portfolio || null,
        resume: uploadedResumeUrl || null,
        // Job preferences
        nicheCategory: jobPreferences.nicheCategory || null,
        preferredJobType: jobPreferences.preferredJobType || null,
        expectedSalary: jobPreferences.expectedSalary ? Math.round(Number(jobPreferences.expectedSalary) * 100) : null,
        remotePreference: jobPreferences.remotePreference || null,
        openToContract: jobPreferences.openToContract,
        willingToRelocate: jobPreferences.willingToRelocate,
      });

      // 2. Update user name if changed
      if (profileData.name && profileData.name !== session?.user?.name) {
        await api.patch("/api/settings", {
          name: profileData.name,
        });
      }

      // 3. Create work experience records
      for (const exp of profileData.workExperience) {
        if (exp.companyName && exp.jobTitle && exp.startDate) {
          try {
            await api.post("/api/candidates/work-experience", {
              companyName: exp.companyName,
              jobTitle: exp.jobTitle,
              startDate: exp.startDate,
              endDate: exp.isCurrent ? null : exp.endDate,
              isCurrent: exp.isCurrent,
              description: exp.description,
              location: exp.location,
            });
          } catch (expError) {
            console.error("Work experience save error:", expError);
          }
        }
      }

      // 4. Create education records
      for (const edu of profileData.education) {
        if (edu.schoolName && edu.degree && edu.fieldOfStudy) {
          try {
            await api.post("/api/candidates/education", {
              schoolName: edu.schoolName,
              degree: edu.degree,
              fieldOfStudy: edu.fieldOfStudy,
              graduationYear: edu.graduationYear || new Date().getFullYear(),
              gpa: edu.gpa || null,
            });
          } catch (eduError: any) {
            console.error("Education save error:", eduError);
            // Log the actual error for debugging
            console.error("Education save details:", eduError.response?.data);
          }
        }
      }

      // 5. Mark onboarding as completed
      await api.patch("/api/settings", {
        onboardingCompleted: true,
      });

      // 6. Update session to reflect onboardingCompleted change
      // This ensures the JWT token is refreshed with the new value
      await updateSession({ onboardingCompleted: true });

      showToast("success", "Profile Completed!", "Welcome to your dashboard.");
      router.push("/candidate/profile");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      showToast(
        "error",
        "Failed to Save",
        error.response?.data?.error || "Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle skip at any step - saves data up to current step
  const handleSkip = async (fromStep: number) => {
    setIsSubmitting(true);

    try {
      // Step 1: No profile data to save, just mark onboarding complete
      // Step 2 & 3: Save profile data if any exists

      if (fromStep >= 2) {
        // Check if there's any meaningful profile data to save
        const hasProfileData = profileData.currentRole ||
          profileData.phone ||
          profileData.location ||
          profileData.bio ||
          profileData.skills.length > 0 ||
          profileData.workExperience.length > 0 ||
          profileData.education.length > 0;

        if (hasProfileData) {
          // Save candidate profile (without requiring currentRole for skip)
          await api.patch("/api/candidates/profile", {
            phone: profileData.phone || null,
            location: profileData.location || null,
            bio: profileData.bio || null,
            currentRole: profileData.currentRole || null,
            experience: profileData.experience,
            skills: profileData.skills,
            linkedIn: profileData.linkedIn || null,
            github: profileData.github || null,
            personalWebsite: profileData.personalWebsite || null,
            portfolio: profileData.portfolio || null,
            resume: uploadedResumeUrl || null,
            // Skip job preferences when skipping
            nicheCategory: null,
            preferredJobType: null,
            expectedSalary: null,
            remotePreference: null,
            openToContract: false,
            willingToRelocate: false,
          });

          // Update user name if changed
          if (profileData.name && profileData.name !== session?.user?.name) {
            await api.patch("/api/settings", {
              name: profileData.name,
            });
          }

          // Save work experience records
          for (const exp of profileData.workExperience) {
            if (exp.companyName && exp.jobTitle && exp.startDate) {
              try {
                await api.post("/api/candidates/work-experience", {
                  companyName: exp.companyName,
                  jobTitle: exp.jobTitle,
                  startDate: exp.startDate,
                  endDate: exp.isCurrent ? null : exp.endDate,
                  isCurrent: exp.isCurrent,
                  description: exp.description,
                  location: exp.location,
                });
              } catch (expError) {
                console.error("Work experience save error:", expError);
              }
            }
          }

          // Save education records
          for (const edu of profileData.education) {
            if (edu.schoolName && edu.degree && edu.fieldOfStudy) {
              try {
                await api.post("/api/candidates/education", {
                  schoolName: edu.schoolName,
                  degree: edu.degree,
                  fieldOfStudy: edu.fieldOfStudy,
                  graduationYear: edu.graduationYear || new Date().getFullYear(),
                  gpa: edu.gpa || null,
                });
              } catch (eduError) {
                console.error("Education save error:", eduError);
              }
            }
          }
        }
      }

      // Always mark onboarding as completed
      await api.patch("/api/settings", {
        onboardingCompleted: true,
      });

      // Update session to reflect onboardingCompleted change
      await updateSession({ onboardingCompleted: true });

      router.push("/candidate/dashboard");
    } catch (error: any) {
      console.error("Skip onboarding error:", error);
      showToast(
        "error",
        "Failed to Skip",
        error.response?.data?.error || "Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Step 1: Import Method
  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's Set Up Your Profile</h1>
        <p className="text-gray-600">
          Upload your resume for quick setup, or fill in manually
        </p>
      </div>

      {/* Resume Upload Option */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isParsingResume
            ? "border-primary-400 bg-primary-50"
            : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
        }`}
        onClick={() => !isParsingResume && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleResumeSelect}
          disabled={isParsingResume}
        />

        {isParsingResume ? (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-12 w-12 text-primary-600 animate-spin" />
            <p className="text-lg font-medium text-primary-700">
              Analyzing your resume...
            </p>
            <p className="text-sm text-gray-500">This may take a few seconds</p>
          </div>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-primary-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Upload Your Resume
            </p>
            <p className="text-sm text-gray-500 mb-4">
              We'll automatically extract your information using AI
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 rounded-lg px-4 py-2">
              <FileText className="h-4 w-4" />
              PDF or DOCX (max 5MB)
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-gray-500">or</span>
        </div>
      </div>

      {/* Manual Entry Option */}
      <button
        onClick={() => setCurrentStep(2)}
        disabled={isParsingResume || isSubmitting}
        className="w-full py-4 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
      >
        <Edit2 className="h-5 w-5" />
        Fill in Manually
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Skip for now */}
      <button
        type="button"
        onClick={() => handleSkip(1)}
        disabled={isParsingResume || isSubmitting}
        className="w-full text-sm text-gray-600 hover:text-gray-800 underline mt-4"
      >
        {isSubmitting ? "Skipping..." : "Skip for now (you can complete this later)"}
      </button>
    </motion.div>
  );

  // Render Step 2: Profile Data
  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Your Profile</h1>
        <p className="text-gray-600">Edit any information that needs updating</p>
      </div>

      {/* Basic Info */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5 text-primary-600" />
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profileData.name || ""}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={profileData.phone || ""}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={profileData.location || ""}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="San Francisco, CA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.currentRole || ""}
              onChange={(e) => setProfileData({ ...profileData, currentRole: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Machine Learning Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input
              type="number"
              value={profileData.experience}
              onChange={(e) => setProfileData({ ...profileData, experience: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
              max="50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
          <textarea
            value={profileData.bio || ""}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Brief description of your professional background..."
            maxLength={500}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-600" />
          Skills
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {profileData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add a skill..."
          />
          <Button type="button" onClick={addSkill} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Links */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-primary-600" />
          Professional Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input
              type="url"
              value={profileData.linkedIn || ""}
              onChange={(e) => setProfileData({ ...profileData, linkedIn: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <input
              type="url"
              value={profileData.github || ""}
              onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
            <input
              type="url"
              value={profileData.portfolio || ""}
              onChange={(e) => setProfileData({ ...profileData, portfolio: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
            <input
              type="url"
              value={profileData.personalWebsite || ""}
              onChange={(e) => setProfileData({ ...profileData, personalWebsite: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Building className="h-5 w-5 text-primary-600" />
            Work Experience
          </h3>
          <Button type="button" onClick={addWorkExperience} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {profileData.workExperience.map((exp, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {editingWorkExp === index ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={exp.companyName}
                        onChange={(e) => updateWorkExperience(index, "companyName", e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Company Name"
                      />
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) => updateWorkExperience(index, "jobTitle", e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Job Title"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => updateWorkExperience(index, "startDate", e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="date"
                        value={exp.endDate || ""}
                        onChange={(e) => updateWorkExperience(index, "endDate", e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                        disabled={exp.isCurrent}
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={exp.isCurrent}
                        onChange={(e) => updateWorkExperience(index, "isCurrent", e.target.checked)}
                        className="rounded"
                      />
                      Currently working here
                    </label>
                    <input
                      type="text"
                      value={exp.location || ""}
                      onChange={(e) => updateWorkExperience(index, "location", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Location"
                    />
                    <textarea
                      value={exp.description || ""}
                      onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Brief description..."
                      rows={2}
                    />
                    <Button type="button" onClick={() => setEditingWorkExp(null)} size="sm">
                      Done
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">{exp.jobTitle || "Job Title"}</p>
                    <p className="text-sm text-gray-600">{exp.companyName || "Company"}</p>
                    <p className="text-xs text-gray-500">
                      {exp.startDate || "Start"} - {exp.isCurrent ? "Present" : exp.endDate || "End"}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditingWorkExp(editingWorkExp === index ? null : index)}
                  className="p-1.5 text-gray-400 hover:text-primary-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeWorkExperience(index)}
                  className="p-1.5 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {profileData.workExperience.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No work experience added yet</p>
        )}
      </div>

      {/* Education */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary-600" />
            Education
          </h3>
          <Button type="button" onClick={addEducation} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {profileData.education.map((edu, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {editingEdu === index ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={edu.schoolName}
                      onChange={(e) => updateEducation(index, "schoolName", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="School Name"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Degree"
                      />
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Field of Study"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={edu.graduationYear}
                        onChange={(e) => updateEducation(index, "graduationYear", parseInt(e.target.value))}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Graduation Year"
                        min="1950"
                        max="2030"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={edu.gpa || ""}
                        onChange={(e) => updateEducation(index, "gpa", e.target.value ? parseFloat(e.target.value) : null)}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="GPA (optional)"
                      />
                    </div>
                    <Button type="button" onClick={() => setEditingEdu(null)} size="sm">
                      Done
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">{edu.degree || "Degree"} in {edu.fieldOfStudy || "Field"}</p>
                    <p className="text-sm text-gray-600">{edu.schoolName || "School"}</p>
                    <p className="text-xs text-gray-500">
                      {edu.graduationYear}{edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditingEdu(editingEdu === index ? null : index)}
                  className="p-1.5 text-gray-400 hover:text-primary-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="p-1.5 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {profileData.education.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No education added yet</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-3 pt-4">
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} disabled={isSubmitting}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button type="button" onClick={() => setCurrentStep(3)} disabled={isSubmitting}>
            Continue <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <button
          type="button"
          onClick={() => handleSkip(2)}
          disabled={isSubmitting}
          className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
        >
          {isSubmitting ? "Skipping..." : "Skip for now (you can complete this later)"}
        </button>
      </div>
    </motion.div>
  );

  // Render Step 3: Job Preferences
  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Preferences</h1>
        <p className="text-gray-600">Help us match you with the right opportunities</p>
      </div>

      {/* Niche Category */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          What's Your Niche? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {nicheCategories.map((niche) => (
            <label
              key={niche.value}
              className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition-all ${
                jobPreferences.nicheCategory === niche.value
                  ? "border-primary-600 bg-primary-50 ring-2 ring-primary-500/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="nicheCategory"
                value={niche.value}
                checked={jobPreferences.nicheCategory === niche.value}
                onChange={(e) => setJobPreferences({ ...jobPreferences, nicheCategory: e.target.value })}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <span className="text-2xl">{niche.icon}</span>
                <span className={`font-medium ${
                  jobPreferences.nicheCategory === niche.value ? "text-primary-900" : "text-gray-700"
                }`}>
                  {niche.label}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Job Type & Salary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Job Type</label>
          <select
            value={jobPreferences.preferredJobType}
            onChange={(e) => setJobPreferences({ ...jobPreferences, preferredJobType: e.target.value as JobType })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">No preference</option>
            {jobTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Salary ($/year)</label>
          <input
            type="number"
            value={jobPreferences.expectedSalary}
            onChange={(e) => setJobPreferences({ ...jobPreferences, expectedSalary: e.target.value ? parseInt(e.target.value) : "" })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., 120000"
            min="0"
          />
        </div>
      </div>

      {/* Remote Preference */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Work Location Preference</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {remotePreferences.map((pref) => (
            <label
              key={pref.value}
              className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${
                jobPreferences.remotePreference === pref.value
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="remotePreference"
                value={pref.value}
                checked={jobPreferences.remotePreference === pref.value}
                onChange={(e) => setJobPreferences({ ...jobPreferences, remotePreference: e.target.value })}
                className="sr-only"
              />
              <span className={`text-sm font-medium ${
                jobPreferences.remotePreference === pref.value ? "text-primary-700" : "text-gray-600"
              }`}>
                {pref.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={jobPreferences.openToContract}
            onChange={(e) => setJobPreferences({ ...jobPreferences, openToContract: e.target.checked })}
            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-gray-700">I'm open to contract/freelance work</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={jobPreferences.willingToRelocate}
            onChange={(e) => setJobPreferences({ ...jobPreferences, willingToRelocate: e.target.checked })}
            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-gray-700">I'm willing to relocate for the right opportunity</span>
        </label>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-3 pt-4">
        <Button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" />
              Saving...
            </span>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete Profile
            </>
          )}
        </Button>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} disabled={isSubmitting}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <button
            type="button"
            onClick={() => handleSkip(3)}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Skipping..." : "Skip for now"}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of 3</span>
            <span>
              {currentStep === 1 && "Import Method"}
              {currentStep === 2 && "Profile Details"}
              {currentStep === 3 && "Job Preferences"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </AnimatePresence>
      </div>
    </div>
  );
}
