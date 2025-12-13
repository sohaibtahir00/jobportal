"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { useCandidateDashboard } from "@/hooks/useDashboard";
import { convertSalaryToDollars, convertSalaryToCents, JobType } from "@/types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  useToast,
  ConfirmationModal,
  CollapsibleSection,
  SettingsProgress,
  Input,
  SectionStatus,
} from "@/components/ui";
import {
  Loader2,
  User,
  Briefcase,
  DollarSign,
  MapPin,
  Link as LinkIcon,
  Code,
  Mail,
  Phone,
  Github,
  Linkedin,
  Globe,
  FileText,
  Upload,
  Camera,
  Award,
  CheckCircle,
  TrendingUp,
  Target,
  Trash2,
  Plus,
  GraduationCap,
  Building,
  Calendar,
  FileUp,
  Sparkles,
  Edit,
  Save,
} from "lucide-react";
import { api } from "@/lib/api";
import { extractTextFromPDF, extractTextFromDOCX } from "@/lib/pdf-utils";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { SkillsScoreCard } from "@/components/skills";
import {
  getWorkExperiences,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getEducationEntries,
  createEducation,
  updateEducation,
  deleteEducation,
  uploadFile,
  type WorkExperience,
  type Education,
} from "@/lib/api/profile";

type ProfileFormData = {
  phone: string;
  location: string;
  bio: string;
  currentRole: string;
  experience: number;
  education: string;
  portfolio: string;
  personalWebsite: string;
  github: string;
  linkedIn: string;
  preferredJobType: JobType | "";
  expectedSalaryMin: number | "";
  expectedSalaryMax: number | "";
  availability: boolean;
  desiredRoles: string;
  nicheCategory: string;
  remotePreference: string;
  startDateAvailability: string;
  openToContract: boolean;
  willingToRelocate: boolean;
};

export default function CandidateProfilePage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const {
    profile,
    profileCompletion,
    isLoading,
    error,
    updateProfile,
    isUpdating,
    refetch,
    updateError,
  } = useCandidateProfile();
  const { data: dashboardData } = useCandidateDashboard();

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Work Experience state
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [showWorkExpForm, setShowWorkExpForm] = useState(false);
  const [editingWorkExp, setEditingWorkExp] = useState<WorkExperience | null>(null);

  // Education state
  const [educationEntries, setEducationEntries] = useState<Education[]>([]);
  const [showEduForm, setShowEduForm] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  // File upload state
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);

  // Delete confirmation modals
  const [deleteWorkExpModal, setDeleteWorkExpModal] = useState<{ isOpen: boolean; id: string | null; title: string }>({ isOpen: false, id: null, title: "" });
  const [deleteEduModal, setDeleteEduModal] = useState<{ isOpen: boolean; id: string | null; name: string }>({ isOpen: false, id: null, name: "" });

  // Form submission states
  const [isSubmittingWorkExp, setIsSubmittingWorkExp] = useState(false);
  const [isSubmittingEdu, setIsSubmittingEdu] = useState(false);
  const [isSavingSection, setIsSavingSection] = useState<string | null>(null);

  // Work Experience form state
  const [workExpFormData, setWorkExpFormData] = useState({
    companyName: "",
    jobTitle: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });

  // Education form state
  const [eduFormData, setEduFormData] = useState({
    schoolName: "",
    degree: "",
    fieldOfStudy: "",
    graduationYear: new Date().getFullYear(),
    gpa: "",
    description: "",
  });

  // Basic info form state
  const [basicInfoData, setBasicInfoData] = useState({
    phone: "",
    location: "",
    bio: "",
    currentRole: "",
    experience: 0,
    availability: false,
  });

  // Professional links form state
  const [linksData, setLinksData] = useState({
    portfolio: "",
    personalWebsite: "",
    github: "",
    linkedIn: "",
  });

  // Job preferences form state
  const [preferencesData, setPreferencesData] = useState({
    preferredJobType: "" as JobType | "",
    desiredRoles: "",
    nicheCategory: "",
    remotePreference: "",
    startDateAvailability: "",
    openToContract: false,
    willingToRelocate: false,
    expectedSalaryMin: "" as number | "",
    expectedSalaryMax: "" as number | "",
  });

  // Initialize form data from profile
  useEffect(() => {
    if (profile) {
      setBasicInfoData({
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        currentRole: profile.currentRole || "",
        experience: profile.experience || 0,
        availability: profile.availability || false,
      });
      setLinksData({
        portfolio: profile.portfolio || "",
        personalWebsite: profile.personalWebsite || "",
        github: profile.github || "",
        linkedIn: profile.linkedIn || "",
      });
      setPreferencesData({
        preferredJobType: profile.preferredJobType || "",
        desiredRoles: profile.desiredRoles?.join(", ") || "",
        nicheCategory: profile.nicheCategory || "",
        remotePreference: profile.remotePreference || "",
        startDateAvailability: profile.startDateAvailability ? new Date(profile.startDateAvailability).toISOString().split('T')[0] : "",
        openToContract: profile.openToContract || false,
        willingToRelocate: profile.willingToRelocate || false,
        expectedSalaryMin: convertSalaryToDollars(profile.expectedSalary) || "",
        expectedSalaryMax: convertSalaryToDollars(profile.expectedSalary) || "",
      });
    }
  }, [profile]);

  // Initialize skills and file URLs
  useEffect(() => {
    if (profile?.skills) {
      setSkills(profile.skills);
    }
    if (profile?.resume) {
      setResumeUrl(profile.resume);
    }
    if (profile?.photo) {
      setPhotoUrl(profile.photo);
    }
  }, [profile]);

  // Load work experiences and education
  useEffect(() => {
    if (profile) {
      loadWorkExperiences();
      loadEducation();
    }
  }, [profile]);

  // Section status calculations
  const sectionStatuses = useMemo(() => {
    const basicComplete = basicInfoData.phone && basicInfoData.location && basicInfoData.bio;
    const linksComplete = linksData.linkedIn && linksData.github;
    const resumeComplete = !!resumeUrl;
    const skillsComplete = skills.length > 0;
    const workExpComplete = workExperiences.length > 0;
    const educationComplete = educationEntries.length > 0;
    const preferencesComplete = preferencesData.preferredJobType !== "";

    return {
      basic: basicComplete ? "complete" : "incomplete",
      links: linksComplete ? "complete" : "incomplete",
      resume: resumeComplete ? "complete" : "incomplete",
      skills: skillsComplete ? "complete" : "incomplete",
      workExperience: workExpComplete ? "complete" : "incomplete",
      education: educationComplete ? "complete" : "incomplete",
      preferences: preferencesComplete ? "complete" : "incomplete",
    } as Record<string, SectionStatus>;
  }, [basicInfoData, linksData, resumeUrl, skills, workExperiences, educationEntries, preferencesData]);

  // Progress sections
  const sections = [
    { id: "basic", name: "Basic Info", status: sectionStatuses.basic },
    { id: "links", name: "Links", status: sectionStatuses.links },
    { id: "resume", name: "Resume", status: sectionStatuses.resume },
    { id: "skills", name: "Skills", status: sectionStatuses.skills },
    { id: "workExperience", name: "Experience", status: sectionStatuses.workExperience },
    { id: "education", name: "Education", status: sectionStatuses.education },
    { id: "preferences", name: "Preferences", status: sectionStatuses.preferences },
  ];

  // Section toggle handler
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Handle section click from progress bar
  const handleSectionClick = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      newSet.add(sectionId);
      return newSet;
    });
    setTimeout(() => {
      document.getElementById(`section-content-${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);

  // Get summary text for collapsed sections
  const getSummary = (sectionId: string) => {
    switch (sectionId) {
      case "basic":
        return basicInfoData.currentRole || basicInfoData.location || "Not set";
      case "links":
        const linkCount = [linksData.portfolio, linksData.personalWebsite, linksData.github, linksData.linkedIn].filter(Boolean).length;
        return linkCount > 0 ? `${linkCount} link${linkCount > 1 ? 's' : ''} added` : "No links added";
      case "resume":
        return resumeUrl ? "Resume uploaded" : "No resume uploaded";
      case "skills":
        return skills.length > 0 ? `${skills.length} skill${skills.length > 1 ? 's' : ''}` : "No skills added";
      case "workExperience":
        return workExperiences.length > 0 ? `${workExperiences.length} position${workExperiences.length > 1 ? 's' : ''}` : "No experience added";
      case "education":
        return educationEntries.length > 0 ? `${educationEntries.length} entr${educationEntries.length > 1 ? 'ies' : 'y'}` : "No education added";
      case "preferences":
        return preferencesData.preferredJobType ? preferencesData.preferredJobType.replace(/_/g, " ") : "Not set";
      default:
        return "";
    }
  };

  const loadWorkExperiences = async () => {
    try {
      const data = await getWorkExperiences();
      setWorkExperiences(data.workExperiences);
    } catch (error) {
      console.error("Failed to load work experiences:", error);
    }
  };

  const loadEducation = async () => {
    try {
      const data = await getEducationEntries();
      setEducationEntries(data.educationEntries);
    } catch (error) {
      console.error("Failed to load education:", error);
    }
  };

  const handleDeleteWorkExperience = async (id: string) => {
    try {
      await deleteWorkExperience(id);
      setWorkExperiences(workExperiences.filter(exp => exp.id !== id));
      showToast("success", "Work Experience Deleted", "The work experience has been removed from your profile.");
      queryClient.invalidateQueries({ queryKey: ['candidate-dashboard'] });
    } catch (error) {
      console.error("Failed to delete work experience:", error);
      showToast("error", "Delete Failed", "Failed to delete work experience. Please try again.");
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      await deleteEducation(id);
      setEducationEntries(educationEntries.filter(edu => edu.id !== id));
      showToast("success", "Education Deleted", "The education entry has been removed from your profile.");
      queryClient.invalidateQueries({ queryKey: ['candidate-dashboard'] });
    } catch (error) {
      console.error("Failed to delete education:", error);
      showToast("error", "Delete Failed", "Failed to delete education. Please try again.");
    }
  };

  // Initialize form data when editing work experience
  useEffect(() => {
    if (editingWorkExp) {
      setWorkExpFormData({
        companyName: editingWorkExp.companyName,
        jobTitle: editingWorkExp.jobTitle,
        location: editingWorkExp.location || "",
        startDate: editingWorkExp.startDate.split("T")[0],
        endDate: editingWorkExp.endDate ? editingWorkExp.endDate.split("T")[0] : "",
        isCurrent: editingWorkExp.isCurrent,
        description: editingWorkExp.description || "",
      });
    } else {
      setWorkExpFormData({
        companyName: "",
        jobTitle: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
      });
    }
  }, [editingWorkExp]);

  // Initialize form data when editing education
  useEffect(() => {
    if (editingEdu) {
      setEduFormData({
        schoolName: editingEdu.schoolName,
        degree: editingEdu.degree,
        fieldOfStudy: editingEdu.fieldOfStudy,
        graduationYear: editingEdu.graduationYear,
        gpa: editingEdu.gpa?.toString() || "",
        description: editingEdu.description || "",
      });
    } else {
      setEduFormData({
        schoolName: "",
        degree: "",
        fieldOfStudy: "",
        graduationYear: new Date().getFullYear(),
        gpa: "",
        description: "",
      });
    }
  }, [editingEdu]);

  const handleWorkExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workExpFormData.companyName || !workExpFormData.jobTitle || !workExpFormData.startDate) {
      showToast("error", "Missing Fields", "Please fill in all required fields.");
      return;
    }

    setIsSubmittingWorkExp(true);
    try {
      const payload = {
        companyName: workExpFormData.companyName,
        jobTitle: workExpFormData.jobTitle,
        location: workExpFormData.location || null,
        startDate: workExpFormData.startDate,
        endDate: workExpFormData.isCurrent ? null : workExpFormData.endDate || null,
        isCurrent: workExpFormData.isCurrent,
        description: workExpFormData.description || null,
      };

      if (editingWorkExp) {
        const result = await updateWorkExperience(editingWorkExp.id, payload);
        setWorkExperiences(workExperiences.map(exp =>
          exp.id === editingWorkExp.id ? result.workExperience : exp
        ));
        showToast("success", "Updated", "Work experience has been updated.");
      } else {
        const result = await createWorkExperience(payload);
        setWorkExperiences([...workExperiences, result.workExperience]);
        showToast("success", "Added", "Work experience has been added to your profile.");
      }
      queryClient.invalidateQueries({ queryKey: ['candidate-dashboard'] });
      setShowWorkExpForm(false);
      setEditingWorkExp(null);
    } catch (error: any) {
      console.error("Failed to save work experience:", error);
      showToast("error", "Save Failed", error.response?.data?.error || "Failed to save work experience.");
    } finally {
      setIsSubmittingWorkExp(false);
    }
  };

  const handleEduSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduFormData.schoolName || !eduFormData.degree || !eduFormData.fieldOfStudy) {
      showToast("error", "Missing Fields", "Please fill in all required fields.");
      return;
    }

    setIsSubmittingEdu(true);
    try {
      const payload = {
        schoolName: eduFormData.schoolName,
        degree: eduFormData.degree,
        fieldOfStudy: eduFormData.fieldOfStudy,
        graduationYear: eduFormData.graduationYear,
        gpa: eduFormData.gpa ? parseFloat(eduFormData.gpa) : null,
        description: eduFormData.description || null,
      };

      if (editingEdu) {
        const result = await updateEducation(editingEdu.id, payload);
        setEducationEntries(educationEntries.map(edu =>
          edu.id === editingEdu.id ? result.education : edu
        ));
        showToast("success", "Updated", "Education has been updated.");
      } else {
        const result = await createEducation(payload);
        setEducationEntries([...educationEntries, result.education]);
        showToast("success", "Added", "Education has been added to your profile.");
      }
      queryClient.invalidateQueries({ queryKey: ['candidate-dashboard'] });
      setShowEduForm(false);
      setEditingEdu(null);
    } catch (error: any) {
      console.error("Failed to save education:", error);
      showToast("error", "Save Failed", error.response?.data?.error || "Failed to save education.");
    } finally {
      setIsSubmittingEdu(false);
    }
  };

  // Handle basic info submit
  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSection("basic");

    try {
      await api.patch("/api/candidates/profile", {
        phone: basicInfoData.phone || null,
        location: basicInfoData.location || null,
        bio: basicInfoData.bio || null,
        currentRole: basicInfoData.currentRole || null,
        experience: basicInfoData.experience || null,
        availability: basicInfoData.availability,
        photo: photoUrl,
      });

      showToast("success", "Basic Info Updated", "Your basic information has been saved.");
      queryClient.invalidateQueries({ queryKey: ['candidate-dashboard'] });
      refetch();
    } catch (error: any) {
      console.error("Failed to update basic info:", error);
      showToast("error", "Update Failed", error.response?.data?.error || "Failed to update basic information.");
    } finally {
      setIsSavingSection(null);
    }
  };

  // Handle links submit
  const handleLinksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSection("links");

    try {
      await api.patch("/api/candidates/profile", {
        portfolio: linksData.portfolio || null,
        personalWebsite: linksData.personalWebsite || null,
        github: linksData.github || null,
        linkedIn: linksData.linkedIn || null,
      });

      showToast("success", "Links Updated", "Your professional links have been saved.");
      queryClient.invalidateQueries({ queryKey: ['candidate-dashboard'] });
      refetch();
    } catch (error: any) {
      console.error("Failed to update links:", error);
      showToast("error", "Update Failed", error.response?.data?.error || "Failed to update links.");
    } finally {
      setIsSavingSection(null);
    }
  };

  // Handle skills submit
  const handleSkillsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSection("skills");

    try {
      await api.patch("/api/candidates/profile", {
        skills,
      });

      showToast("success", "Skills Updated", "Your skills have been saved.");
      queryClient.invalidateQueries({ queryKey: ['candidate-dashboard'] });
      refetch();
    } catch (error: any) {
      console.error("Failed to update skills:", error);
      showToast("error", "Update Failed", error.response?.data?.error || "Failed to update skills.");
    } finally {
      setIsSavingSection(null);
    }
  };

  // Handle preferences submit
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSection("preferences");

    try {
      const salaryMin = preferencesData.expectedSalaryMin ? Number(preferencesData.expectedSalaryMin) : null;
      const expectedSalary = convertSalaryToCents(salaryMin);

      await api.patch("/api/candidates/profile", {
        preferredJobType: (preferencesData.preferredJobType as JobType) || null,
        desiredRoles: preferencesData.desiredRoles ? preferencesData.desiredRoles.split(",").map(r => r.trim()).filter(Boolean) : [],
        nicheCategory: preferencesData.nicheCategory || null,
        remotePreference: preferencesData.remotePreference || null,
        startDateAvailability: preferencesData.startDateAvailability || null,
        openToContract: preferencesData.openToContract,
        willingToRelocate: preferencesData.willingToRelocate,
        expectedSalary,
      });

      showToast("success", "Preferences Updated", "Your job preferences have been saved.");
      queryClient.invalidateQueries({ queryKey: ['candidate-dashboard'] });
      refetch();
    } catch (error: any) {
      console.error("Failed to update preferences:", error);
      showToast("error", "Update Failed", error.response?.data?.error || "Failed to update preferences.");
    } finally {
      setIsSavingSection(null);
    }
  };

  // Handle resume submit
  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSection("resume");

    try {
      await api.patch("/api/candidates/profile", {
        resume: resumeUrl,
      });

      showToast("success", "Resume Updated", "Your resume has been saved.");
      queryClient.invalidateQueries({ queryKey: ['candidate-dashboard'] });
      refetch();
    } catch (error: any) {
      console.error("Failed to update resume:", error);
      showToast("error", "Update Failed", error.response?.data?.error || "Failed to update resume.");
    } finally {
      setIsSavingSection(null);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    const removedSkill = skills[index];
    setSkills(skills.filter((_, i) => i !== index));
    showToast("info", "Skill Removed", `"${removedSkill}" has been removed.`);
  };

  const handleFileUpload = async (file: File, type: 'resume' | 'photo') => {
    setUploading(true);
    try {
      const result = await uploadFile(file, type);
      if (type === 'resume') {
        setResumeUrl(result.url);
        showToast("success", "Resume Uploaded", "Your resume has been uploaded successfully.");
      } else {
        setPhotoUrl(result.url);
        showToast("success", "Photo Uploaded", "Your profile photo has been updated.");
      }
      queryClient.invalidateQueries({ queryKey: ['candidate-dashboard'] });
    } catch (error) {
      console.error("File upload failed:", error);
      showToast("error", "Upload Failed", "Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle resume import with AI parsing
  const handleResumeImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith('.pdf') && !fileName.endsWith('.docx') && !fileName.endsWith('.doc')) {
      showToast("error", "Invalid File", "Please upload a PDF or Word document");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "File Too Large", "Maximum file size is 5MB");
      return;
    }

    setIsParsingResume(true);

    try {
      let extractedText: string;
      if (fileName.endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
      } else {
        extractedText = await extractTextFromDOCX(file);
      }

      const response = await api.post("/api/candidates/parse-resume", {
        text: extractedText,
      });

      if (response.data.success) {
        const data = response.data.data;
        const workExperienceData = data.workExperience || [];
        const educationData = data.education || [];

        await api.patch("/api/candidates/profile", {
          phone: data.phone || null,
          location: data.location || null,
          bio: data.bio || null,
          currentRole: data.currentRole || null,
          experience: data.experience || null,
          skills: data.skills || [],
          linkedIn: data.linkedIn || null,
          github: data.github || null,
          personalWebsite: data.personalWebsite || null,
          portfolio: data.portfolio || null,
        });

        for (const exp of workExperienceData) {
          if (exp.companyName && exp.jobTitle && exp.startDate) {
            try {
              await api.post("/api/candidates/work-experience", {
                companyName: exp.companyName,
                jobTitle: exp.jobTitle,
                startDate: exp.startDate,
                endDate: exp.isCurrent ? null : exp.endDate,
                isCurrent: exp.isCurrent || false,
                description: exp.description || null,
                location: exp.location || null,
              });
            } catch (expError) {
              console.error("Work experience save error:", expError);
            }
          }
        }

        for (const edu of educationData) {
          if (edu.schoolName && edu.degree) {
            try {
              await api.post("/api/candidates/education", {
                schoolName: edu.schoolName,
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy || edu.degree,
                graduationYear: edu.graduationYear || new Date().getFullYear(),
                gpa: edu.gpa || null,
              });
            } catch (eduError) {
              console.error("Education save error:", eduError);
            }
          }
        }

        const uploadResult = await uploadFile(file, 'resume');
        if (uploadResult.url) {
          setResumeUrl(uploadResult.url);
          await api.patch("/api/candidates/profile", {
            resume: uploadResult.url,
          });
        }

        showToast("success", "Profile Updated", "Your profile has been updated from your resume!");
        refetch();
        loadWorkExperiences();
        loadEducation();
        queryClient.invalidateQueries({ queryKey: ['candidate-dashboard'] });
      } else {
        throw new Error(response.data.error || "Failed to parse resume");
      }
    } catch (error: any) {
      console.error("Resume parsing error:", error);
      showToast("error", "Import Failed", error.message || "Failed to parse resume. Please try again.");
    } finally {
      setIsParsingResume(false);
      e.target.value = '';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="container">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-secondary-600">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="container">
          <Card className="border-red-200 bg-red-50 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Error Loading Profile
              </h2>
              <p className="text-red-700">{error.message}</p>
              <Button onClick={() => refetch()} className="mt-4" variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="container">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6 text-center">
              <p className="text-secondary-600 mb-4">
                No candidate profile found. Please create your profile.
              </p>
              <Button onClick={() => refetch()}>Refresh</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const testInfo = dashboardData?.testInfo;
  const hasSkillsAssessment = testInfo?.hasTaken || false;

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Resume Import Section - Always visible */}
          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-purple-900">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Update Profile from Resume
              </CardTitle>
              <CardDescription className="text-purple-700">
                Upload your latest resume to automatically extract and update your profile information using AI
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isParsingResume}
                  />
                  <Button
                    className="pointer-events-none bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isParsingResume}
                  >
                    {isParsingResume ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Parsing Resume...
                      </>
                    ) : (
                      <>
                        <FileUp className="h-4 w-4 mr-2" />
                        Choose Resume (PDF or Word)
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-purple-600">
                  We&apos;ll extract your work experience, education, skills, and more
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Header */}
          <SettingsProgress
            sections={sections}
            onSectionClick={handleSectionClick}
            title="Candidate Profile"
            description="Manage your professional information and job preferences"
          />

          {/* Update Error */}
          {updateError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">✗ {updateError.message}</p>
            </div>
          )}

          {/* Profile Header with Photo */}
          <Card variant="accent" className="mb-4">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Photo */}
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Profile" className="h-32 w-32 rounded-full object-cover" />
                    ) : (
                      session?.user?.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 cursor-pointer hover:bg-primary-700 shadow-lg">
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'photo');
                      }}
                    />
                  </label>
                </div>

                {/* Name and Email */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-secondary-900">{session?.user?.name || "Your Name"}</h2>
                  <div className="flex items-center gap-2 text-secondary-600 mt-1">
                    <Mail className="h-4 w-4" />
                    <span>{session?.user?.email}</span>
                  </div>
                  <p className="text-sm text-secondary-500 mt-2">
                    {profile.location || "Add your location"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Assessment Widget */}
          {!hasSkillsAssessment ? (
            <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-blue-50 mb-4">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 shrink-0">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-secondary-900 mb-2">
                      Take Skills Assessment to Unlock Benefits
                    </h3>
                    <p className="text-sm text-secondary-600 mb-4">
                      Complete our skills assessment to unlock exclusive jobs and boost your profile visibility.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary-600" />
                        <span>Priority in employer searches</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary-600" />
                        <span>Access to 250+ exclusive jobs</span>
                      </div>
                    </div>
                    <Button asChild size="sm" className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700">
                      <Link href="/skills-assessment">
                        <Award className="mr-2 h-4 w-4" />
                        Start Assessment
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 mb-4">
              <SkillsScoreCard
                data={{
                  overallScore: testInfo?.score || 0,
                  percentile: testInfo?.percentile || 0,
                  tier: testInfo?.tier?.name?.toUpperCase() || "INTERMEDIATE",
                  completedAt: testInfo?.lastTestDate || new Date().toISOString(),
                  proctored: true,
                }}
                variant="compact"
              />
              <div className="flex gap-2">
                <Button asChild size="sm" className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700">
                  <Link href="/candidate/assessment">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Full Report
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/skills-assessment">
                    Retake Assessment
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Collapsible Sections */}
          <div className="space-y-4">
            {/* Basic Information */}
            <CollapsibleSection
              id="basic"
              icon={<User className="h-5 w-5" />}
              iconBgColor="bg-primary-100"
              iconColor="text-primary-600"
              title="Basic Information"
              description="Your contact information and professional summary"
              summary={getSummary("basic")}
              status={sectionStatuses.basic}
              isExpanded={expandedSections.has("basic")}
              onToggle={() => toggleSection("basic")}
              variant="accent"
            >
              <form onSubmit={handleBasicInfoSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Phone Number
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Phone className="h-5 w-5" />}
                      type="tel"
                      value={basicInfoData.phone}
                      onChange={(e) => setBasicInfoData({ ...basicInfoData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Location
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<MapPin className="h-5 w-5" />}
                      value={basicInfoData.location}
                      onChange={(e) => setBasicInfoData({ ...basicInfoData, location: e.target.value })}
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Current Role/Title
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Briefcase className="h-5 w-5" />}
                      value={basicInfoData.currentRole}
                      onChange={(e) => setBasicInfoData({ ...basicInfoData, currentRole: e.target.value })}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Years of Experience
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<TrendingUp className="h-5 w-5" />}
                      type="number"
                      value={basicInfoData.experience}
                      onChange={(e) => setBasicInfoData({ ...basicInfoData, experience: parseInt(e.target.value) || 0 })}
                      min="0"
                      max="50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Professional Bio
                    </label>
                    <textarea
                      value={basicInfoData.bio}
                      onChange={(e) => setBasicInfoData({ ...basicInfoData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl bg-secondary-50/50 text-sm transition-all duration-200 hover:bg-white hover:border-secondary-300 focus:outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20"
                      placeholder="Tell employers about yourself..."
                      maxLength={500}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-secondary-200 bg-white cursor-pointer hover:border-secondary-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={basicInfoData.availability}
                        onChange={(e) => setBasicInfoData({ ...basicInfoData, availability: e.target.checked })}
                        className="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-secondary-900">Available for opportunities</span>
                        <p className="text-sm text-secondary-500">Let employers know you&apos;re open to new roles</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSavingSection === "basic"}>
                    {isSavingSection === "basic" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Basic Info
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CollapsibleSection>

            {/* Professional Links */}
            <CollapsibleSection
              id="links"
              icon={<LinkIcon className="h-5 w-5" />}
              iconBgColor="bg-accent-100"
              iconColor="text-accent-600"
              title="Professional Links"
              description="Your portfolio and social profiles"
              summary={getSummary("links")}
              status={sectionStatuses.links}
              isExpanded={expandedSections.has("links")}
              onToggle={() => toggleSection("links")}
              variant="accent"
            >
              <form onSubmit={handleLinksSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Portfolio URL
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Globe className="h-5 w-5" />}
                      type="url"
                      value={linksData.portfolio}
                      onChange={(e) => setLinksData({ ...linksData, portfolio: e.target.value })}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Personal Website
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Globe className="h-5 w-5" />}
                      type="url"
                      value={linksData.personalWebsite}
                      onChange={(e) => setLinksData({ ...linksData, personalWebsite: e.target.value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      GitHub URL
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Github className="h-5 w-5" />}
                      type="url"
                      value={linksData.github}
                      onChange={(e) => setLinksData({ ...linksData, github: e.target.value })}
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      LinkedIn URL
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Linkedin className="h-5 w-5" />}
                      type="url"
                      value={linksData.linkedIn}
                      onChange={(e) => setLinksData({ ...linksData, linkedIn: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSavingSection === "links"}>
                    {isSavingSection === "links" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Links
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CollapsibleSection>

            {/* Resume Section */}
            <CollapsibleSection
              id="resume"
              icon={<FileText className="h-5 w-5" />}
              iconBgColor="bg-warning-100"
              iconColor="text-warning-600"
              title="Resume"
              description="Upload your resume for employers"
              summary={getSummary("resume")}
              status={sectionStatuses.resume}
              isExpanded={expandedSections.has("resume")}
              onToggle={() => toggleSection("resume")}
              variant="accent"
            >
              <form onSubmit={handleResumeSubmit}>
                {resumeUrl ? (
                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl border border-secondary-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                        <FileText className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">Resume uploaded</p>
                        <p className="text-sm text-secondary-500">{resumeUrl.split('/').pop()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">Download</Button>
                      </a>
                      <label className="cursor-pointer">
                        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                          <Upload className="h-4 w-4 mr-2" />
                          Replace
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'resume');
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-secondary-200 rounded-xl">
                    <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-3" />
                    <p className="text-secondary-600 mb-4">No resume uploaded</p>
                    <label className="cursor-pointer">
                      <span className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? "Uploading..." : "Upload Resume"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'resume');
                        }}
                      />
                    </label>
                  </div>
                )}
                <p className="text-xs text-secondary-500 mt-3">
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSavingSection === "resume" || !resumeUrl}>
                    {isSavingSection === "resume" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Resume
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CollapsibleSection>

            {/* Skills */}
            <CollapsibleSection
              id="skills"
              icon={<Code className="h-5 w-5" />}
              iconBgColor="bg-success-100"
              iconColor="text-success-600"
              title="Skills"
              description="Your technical and professional skills"
              summary={getSummary("skills")}
              status={sectionStatuses.skills}
              isExpanded={expandedSections.has("skills")}
              onToggle={() => toggleSection("skills")}
              variant="accent"
            >
              <form onSubmit={handleSkillsSubmit}>
                <div className="mb-4 flex gap-2">
                  <Input
                    variant="modern"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill (press Enter)"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[60px] p-4 border border-secondary-200 rounded-xl bg-secondary-50/50">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-1 text-primary-600 hover:text-primary-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-secondary-400 text-sm">No skills added yet. Start typing to add skills.</p>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSavingSection === "skills"}>
                    {isSavingSection === "skills" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Skills
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CollapsibleSection>

            {/* Work Experience */}
            <CollapsibleSection
              id="workExperience"
              icon={<Building className="h-5 w-5" />}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              title="Work Experience"
              description="Your professional work history"
              summary={getSummary("workExperience")}
              status={sectionStatuses.workExperience}
              isExpanded={expandedSections.has("workExperience")}
              onToggle={() => toggleSection("workExperience")}
              variant="accent"
            >
              <div className="mb-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingWorkExp(null);
                    setShowWorkExpForm(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>

              {workExperiences.length > 0 ? (
                <div className="space-y-4">
                  {workExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 bg-secondary-50 rounded-xl border border-secondary-200 relative"
                    >
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingWorkExp(exp);
                            setShowWorkExpForm(true);
                          }}
                          className="p-1.5 text-secondary-400 hover:text-primary-600 rounded-lg hover:bg-white transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteWorkExpModal({ isOpen: true, id: exp.id, title: exp.jobTitle })}
                          className="p-1.5 text-secondary-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="pr-16">
                        <h4 className="font-semibold text-secondary-900">{exp.jobTitle}</h4>
                        <p className="text-secondary-700">{exp.companyName}</p>
                        {exp.location && (
                          <p className="text-sm text-secondary-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </p>
                        )}
                        <p className="text-sm text-secondary-500 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          {" - "}
                          {exp.isCurrent
                            ? "Present"
                            : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                            : "Present"}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-secondary-600 mt-2 whitespace-pre-wrap">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-secondary-200 rounded-xl">
                  <Briefcase className="h-12 w-12 text-secondary-400 mx-auto mb-3" />
                  <p className="text-secondary-600 mb-2">No work experience added yet</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingWorkExp(null);
                      setShowWorkExpForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Experience
                  </Button>
                </div>
              )}
            </CollapsibleSection>

            {/* Education */}
            <CollapsibleSection
              id="education"
              icon={<GraduationCap className="h-5 w-5" />}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              title="Education"
              description="Your educational background"
              summary={getSummary("education")}
              status={sectionStatuses.education}
              isExpanded={expandedSections.has("education")}
              onToggle={() => toggleSection("education")}
              variant="accent"
            >
              <div className="mb-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingEdu(null);
                    setShowEduForm(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>

              {educationEntries.length > 0 ? (
                <div className="space-y-4">
                  {educationEntries.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-4 bg-secondary-50 rounded-xl border border-secondary-200 relative"
                    >
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEdu(edu);
                            setShowEduForm(true);
                          }}
                          className="p-1.5 text-secondary-400 hover:text-primary-600 rounded-lg hover:bg-white transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteEduModal({ isOpen: true, id: edu.id, name: edu.schoolName })}
                          className="p-1.5 text-secondary-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="pr-16">
                        <h4 className="font-semibold text-secondary-900">{edu.degree}</h4>
                        <p className="text-secondary-700">{edu.schoolName}</p>
                        <p className="text-sm text-secondary-500">{edu.fieldOfStudy}</p>
                        <p className="text-sm text-secondary-500 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Class of {edu.graduationYear}
                          {edu.gpa && ` • GPA: ${edu.gpa}`}
                        </p>
                        {edu.description && (
                          <p className="text-sm text-secondary-600 mt-2 whitespace-pre-wrap">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-secondary-200 rounded-xl">
                  <GraduationCap className="h-12 w-12 text-secondary-400 mx-auto mb-3" />
                  <p className="text-secondary-600 mb-2">No education added yet</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingEdu(null);
                      setShowEduForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your Education
                  </Button>
                </div>
              )}
            </CollapsibleSection>

            {/* Job Preferences */}
            <CollapsibleSection
              id="preferences"
              icon={<Target className="h-5 w-5" />}
              iconBgColor="bg-orange-100"
              iconColor="text-orange-600"
              title="Job Preferences"
              description="Your ideal job criteria and preferences"
              summary={getSummary("preferences")}
              status={sectionStatuses.preferences}
              isExpanded={expandedSections.has("preferences")}
              onToggle={() => toggleSection("preferences")}
              variant="accent"
            >
              <form onSubmit={handlePreferencesSubmit}>
                <div className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-secondary-700">
                        Preferred Job Type
                      </label>
                      <select
                        value={preferencesData.preferredJobType}
                        onChange={(e) => setPreferencesData({ ...preferencesData, preferredJobType: e.target.value as JobType })}
                        className="w-full h-12 px-4 border border-secondary-200 rounded-xl bg-secondary-50/50 text-sm transition-all duration-200 hover:bg-white hover:border-secondary-300 focus:outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20"
                      >
                        <option value="">Not specified</option>
                        <option value={JobType.FULL_TIME}>Full-time</option>
                        <option value={JobType.PART_TIME}>Part-time</option>
                        <option value={JobType.CONTRACT}>Contract</option>
                        <option value={JobType.INTERNSHIP}>Internship</option>
                        <option value={JobType.TEMPORARY}>Temporary</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-secondary-700">
                        Remote Preference
                      </label>
                      <select
                        value={preferencesData.remotePreference}
                        onChange={(e) => setPreferencesData({ ...preferencesData, remotePreference: e.target.value })}
                        className="w-full h-12 px-4 border border-secondary-200 rounded-xl bg-secondary-50/50 text-sm transition-all duration-200 hover:bg-white hover:border-secondary-300 focus:outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20"
                      >
                        <option value="">Not specified</option>
                        <option value="REMOTE">Remote</option>
                        <option value="HYBRID">Hybrid</option>
                        <option value="ONSITE">On-site</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Desired Roles (comma-separated)
                    </label>
                    <Input
                      variant="modern"
                      value={preferencesData.desiredRoles}
                      onChange={(e) => setPreferencesData({ ...preferencesData, desiredRoles: e.target.value })}
                      placeholder="Software Engineer, Data Scientist, Product Manager"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-secondary-700">
                        Niche Category
                      </label>
                      <select
                        value={preferencesData.nicheCategory}
                        onChange={(e) => setPreferencesData({ ...preferencesData, nicheCategory: e.target.value })}
                        className="w-full h-12 px-4 border border-secondary-200 rounded-xl bg-secondary-50/50 text-sm transition-all duration-200 hover:bg-white hover:border-secondary-300 focus:outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20"
                      >
                        <option value="">Not specified</option>
                        <option value="AI_ML">AI/ML</option>
                        <option value="HEALTHCARE_IT">Healthcare IT</option>
                        <option value="FINTECH">Fintech</option>
                        <option value="CYBERSECURITY">Cybersecurity</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-secondary-700">
                        Start Date Availability
                      </label>
                      <Input
                        variant="modern"
                        type="date"
                        value={preferencesData.startDateAvailability}
                        onChange={(e) => setPreferencesData({ ...preferencesData, startDateAvailability: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Expected Salary (Annual)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-secondary-500 mb-1">Minimum ($)</label>
                        <Input
                          variant="modern"
                          leftIcon={<DollarSign className="h-5 w-5" />}
                          type="number"
                          value={preferencesData.expectedSalaryMin}
                          onChange={(e) => setPreferencesData({ ...preferencesData, expectedSalaryMin: parseInt(e.target.value) || "" })}
                          placeholder="80000"
                          min="0"
                          step="1000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-secondary-500 mb-1">Maximum ($)</label>
                        <Input
                          variant="modern"
                          leftIcon={<DollarSign className="h-5 w-5" />}
                          type="number"
                          value={preferencesData.expectedSalaryMax}
                          onChange={(e) => setPreferencesData({ ...preferencesData, expectedSalaryMax: parseInt(e.target.value) || "" })}
                          placeholder="120000"
                          min="0"
                          step="1000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-secondary-200 bg-white cursor-pointer hover:border-secondary-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={preferencesData.openToContract}
                        onChange={(e) => setPreferencesData({ ...preferencesData, openToContract: e.target.checked })}
                        className="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-secondary-900">Open to contract work</span>
                        <p className="text-sm text-secondary-500">Consider contract opportunities</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 rounded-xl border border-secondary-200 bg-white cursor-pointer hover:border-secondary-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={preferencesData.willingToRelocate}
                        onChange={(e) => setPreferencesData({ ...preferencesData, willingToRelocate: e.target.checked })}
                        className="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-secondary-900">Willing to relocate</span>
                        <p className="text-sm text-secondary-500">Open to moving for work</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSavingSection === "preferences"}>
                    {isSavingSection === "preferences" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CollapsibleSection>
          </div>
        </div>
      </div>

      {/* Delete Work Experience Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteWorkExpModal.isOpen}
        onClose={() => setDeleteWorkExpModal({ isOpen: false, id: null, title: "" })}
        onConfirm={() => { if (deleteWorkExpModal.id) handleDeleteWorkExperience(deleteWorkExpModal.id); }}
        title="Delete Work Experience"
        message={`Are you sure you want to delete "${deleteWorkExpModal.title}" from your work experience? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Delete Education Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteEduModal.isOpen}
        onClose={() => setDeleteEduModal({ isOpen: false, id: null, name: "" })}
        onConfirm={() => { if (deleteEduModal.id) handleDeleteEducation(deleteEduModal.id); }}
        title="Delete Education"
        message={`Are you sure you want to delete your education at "${deleteEduModal.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Work Experience Form Modal */}
      {showWorkExpForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">
                {editingWorkExp ? "Edit Work Experience" : "Add Work Experience"}
              </h3>
            </div>
            <form onSubmit={handleWorkExpSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                  variant="modern"
                  value={workExpFormData.companyName}
                  onChange={(e) => setWorkExpFormData({ ...workExpFormData, companyName: e.target.value })}
                  placeholder="e.g., Google"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <Input
                  variant="modern"
                  value={workExpFormData.jobTitle}
                  onChange={(e) => setWorkExpFormData({ ...workExpFormData, jobTitle: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Location
                </label>
                <Input
                  variant="modern"
                  value={workExpFormData.location}
                  onChange={(e) => setWorkExpFormData({ ...workExpFormData, location: e.target.value })}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    variant="modern"
                    type="date"
                    value={workExpFormData.startDate}
                    onChange={(e) => setWorkExpFormData({ ...workExpFormData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    End Date
                  </label>
                  <Input
                    variant="modern"
                    type="date"
                    value={workExpFormData.endDate}
                    onChange={(e) => setWorkExpFormData({ ...workExpFormData, endDate: e.target.value })}
                    disabled={workExpFormData.isCurrent}
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workExpFormData.isCurrent}
                    onChange={(e) => setWorkExpFormData({ ...workExpFormData, isCurrent: e.target.checked, endDate: "" })}
                    className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-secondary-700">I currently work here</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  value={workExpFormData.description}
                  onChange={(e) => setWorkExpFormData({ ...workExpFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl bg-secondary-50/50 text-sm transition-all duration-200 hover:bg-white hover:border-secondary-300 focus:outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20"
                  placeholder="Describe your role and responsibilities..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowWorkExpForm(false);
                    setEditingWorkExp(null);
                  }}
                  disabled={isSubmittingWorkExp}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingWorkExp}>
                  {isSubmittingWorkExp ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingWorkExp ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Education Form Modal */}
      {showEduForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">
                {editingEdu ? "Edit Education" : "Add Education"}
              </h3>
            </div>
            <form onSubmit={handleEduSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  School Name <span className="text-red-500">*</span>
                </label>
                <Input
                  variant="modern"
                  value={eduFormData.schoolName}
                  onChange={(e) => setEduFormData({ ...eduFormData, schoolName: e.target.value })}
                  placeholder="e.g., MIT"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Degree <span className="text-red-500">*</span>
                </label>
                <Input
                  variant="modern"
                  value={eduFormData.degree}
                  onChange={(e) => setEduFormData({ ...eduFormData, degree: e.target.value })}
                  placeholder="e.g., Bachelor of Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <Input
                  variant="modern"
                  value={eduFormData.fieldOfStudy}
                  onChange={(e) => setEduFormData({ ...eduFormData, fieldOfStudy: e.target.value })}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Graduation Year <span className="text-red-500">*</span>
                  </label>
                  <Input
                    variant="modern"
                    type="number"
                    value={eduFormData.graduationYear}
                    onChange={(e) => setEduFormData({ ...eduFormData, graduationYear: parseInt(e.target.value) || new Date().getFullYear() })}
                    min="1950"
                    max="2030"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    GPA (optional)
                  </label>
                  <Input
                    variant="modern"
                    value={eduFormData.gpa}
                    onChange={(e) => setEduFormData({ ...eduFormData, gpa: e.target.value })}
                    placeholder="e.g., 3.8"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  value={eduFormData.description}
                  onChange={(e) => setEduFormData({ ...eduFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl bg-secondary-50/50 text-sm transition-all duration-200 hover:bg-white hover:border-secondary-300 focus:outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20"
                  placeholder="Describe your achievements, activities, etc..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEduForm(false);
                    setEditingEdu(null);
                  }}
                  disabled={isSubmittingEdu}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingEdu}>
                  {isSubmittingEdu ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingEdu ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
