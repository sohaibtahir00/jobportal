"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { useCandidateDashboard } from "@/hooks/useDashboard";
import { convertSalaryToDollars, convertSalaryToCents, JobType } from "@/types";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, useToast, ConfirmationModal } from "@/components/ui";
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
  Edit,
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
} from "lucide-react";
import { api } from "@/lib/api";
import { extractTextFromPDF, extractTextFromDOCX } from "@/lib/pdf-utils";
import Link from "next/link";
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

  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

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

  // Initialize form with profile data
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
    values: profile
      ? {
          phone: profile.phone || "",
          location: profile.location || "",
          bio: profile.bio || "",
          currentRole: profile.currentRole || "",
          experience: profile.experience || 0,
          education: profile.education || "",
          portfolio: profile.portfolio || "",
          personalWebsite: profile.personalWebsite || "",
          github: profile.github || "",
          linkedIn: profile.linkedIn || "",
          preferredJobType: profile.preferredJobType || "",
          expectedSalaryMin: convertSalaryToDollars(profile.expectedSalary) || "",
          expectedSalaryMax: convertSalaryToDollars(profile.expectedSalary) || "",
          availability: profile.availability,
          desiredRoles: profile.desiredRoles?.join(", ") || "",
          nicheCategory: profile.nicheCategory || "",
          remotePreference: profile.remotePreference || "",
          startDateAvailability: profile.startDateAvailability ? new Date(profile.startDateAvailability).toISOString().split('T')[0] : "",
          openToContract: profile.openToContract || false,
          willingToRelocate: profile.willingToRelocate || false,
        }
      : undefined,
  });

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
      setShowEduForm(false);
      setEditingEdu(null);
    } catch (error: any) {
      console.error("Failed to save education:", error);
      showToast("error", "Save Failed", error.response?.data?.error || "Failed to save education.");
    } finally {
      setIsSubmittingEdu(false);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    const salaryMin = data.expectedSalaryMin ? Number(data.expectedSalaryMin) : null;
    const expectedSalary = convertSalaryToCents(salaryMin);

    const payload = {
      phone: data.phone || null,
      location: data.location || null,
      bio: data.bio || null,
      currentRole: data.currentRole || null,
      experience: data.experience || null,
      education: data.education || null,
      portfolio: data.portfolio || null,
      personalWebsite: data.personalWebsite || null,
      github: data.github || null,
      linkedIn: data.linkedIn || null,
      preferredJobType: (data.preferredJobType as JobType) || null,
      expectedSalary,
      availability: data.availability,
      skills,
      resume: resumeUrl,
      photo: photoUrl,
      desiredRoles: data.desiredRoles ? data.desiredRoles.split(",").map(r => r.trim()).filter(Boolean) : [],
      nicheCategory: data.nicheCategory || null,
      remotePreference: data.remotePreference || null,
      startDateAvailability: data.startDateAvailability || null,
      openToContract: data.openToContract,
      willingToRelocate: data.willingToRelocate,
    };

    updateProfile(payload, {
      onSuccess: () => {
        setIsEditing(false);
        showToast("success", "Profile Updated", "Your profile has been saved successfully.");
      },
      onError: (error: any) => {
        showToast("error", "Update Failed", error.message || "Failed to update profile.");
      },
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
    if (profile?.skills) {
      setSkills(profile.skills);
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

    // Validate file type
    if (!fileName.endsWith('.pdf') && !fileName.endsWith('.docx') && !fileName.endsWith('.doc')) {
      showToast("error", "Invalid File", "Please upload a PDF or Word document");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "File Too Large", "Maximum file size is 5MB");
      return;
    }

    setIsParsingResume(true);

    try {
      // Extract text based on file type
      let extractedText: string;
      if (fileName.endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
      } else {
        extractedText = await extractTextFromDOCX(file);
      }

      // Parse with AI
      const response = await api.post("/api/candidates/parse-resume", {
        text: extractedText,
      });

      if (response.data.success) {
        const data = response.data.data;

        // Extract work experience and education arrays (handled separately)
        const workExperienceData = data.workExperience || [];
        const educationData = data.education || [];

        // Update profile with simple fields only (not arrays)
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

        // Create work experience records
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

        // Create education records
        for (const edu of educationData) {
          if (edu.schoolName && edu.degree) {
            try {
              await api.post("/api/candidates/education", {
                schoolName: edu.schoolName,
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy || edu.degree, // Use degree as fallback since fieldOfStudy is required
                graduationYear: edu.graduationYear || new Date().getFullYear(),
                gpa: edu.gpa || null,
              });
            } catch (eduError) {
              console.error("Education save error:", eduError);
            }
          }
        }

        // Upload the resume file using the helper function (sets proper headers)
        const uploadResult = await uploadFile(file, 'resume');
        if (uploadResult.url) {
          setResumeUrl(uploadResult.url);
        }

        showToast("success", "Profile Updated", "Your profile has been updated from your resume!");

        // Refresh profile data and work experience/education lists
        refetch();
        loadWorkExperiences();
        loadEducation();
      } else {
        throw new Error(response.data.error || "Failed to parse resume");
      }
    } catch (error: any) {
      console.error("Resume parsing error:", error);
      showToast("error", "Import Failed", error.message || "Failed to parse resume. Please try again.");
    } finally {
      setIsParsingResume(false);
      // Reset file input
      e.target.value = '';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
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
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              No candidate profile found. Please create your profile.
            </p>
            <Button onClick={() => refetch()}>Refresh</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const testInfo = dashboardData?.testInfo;
  const hasSkillsAssessment = testInfo?.hasTaken || false;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Candidate Profile
          </h1>
          <p className="text-gray-600">
            Manage your professional information and job preferences
          </p>
        </div>

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

        {/* Profile Completion */}
        {profileCompletion && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Profile Completion
                  </h3>
                  <p className="text-sm text-blue-700">
                    {profileCompletion.percentage}% complete
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      profileCompletion.status === "excellent"
                        ? "bg-green-100 text-green-800"
                        : profileCompletion.status === "good"
                        ? "bg-blue-100 text-blue-800"
                        : profileCompletion.status === "basic"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {profileCompletion.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion.percentage}%` }}
                />
              </div>
              {profileCompletion.missingFields.length > 0 && (
                <p className="text-xs text-blue-800 mt-3">
                  <strong>Missing:</strong>{" "}
                  {profileCompletion.missingFields.join(", ")}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Update Error */}
        {updateError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">✗ {updateError.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Header with Photo */}
          <Card>
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
                  {isEditing && (
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
                  )}
                </div>

                {/* Name and Email */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{session?.user?.name || "Your Name"}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Mail className="h-4 w-4" />
                    <span>{session?.user?.email}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {profile.location || "Add your location"}
                  </p>
                </div>

                {!isEditing && (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills Assessment Widget */}
          {!hasSkillsAssessment ? (
            <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 shrink-0">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Take Skills Assessment to Unlock Benefits
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
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
                    <Button asChild size="sm" className="bg-primary-600 hover:bg-primary-700">
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
            <div className="space-y-4">
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
                <Button asChild size="sm" className="bg-primary-600 hover:bg-primary-700">
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

          {/* Basic Information */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      {...register("location")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="San Francisco, CA"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.location || "Not provided"}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      {...register("bio")}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell employers about yourself..."
                      maxLength={500}
                    />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {profile.bio || "No bio provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Current Role/Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      {...register("currentRole")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Machine Learning Engineer"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.currentRole || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Years of Experience
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      {...register("experience", { valueAsNumber: true })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="0"
                      max="50"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.experience ? `${profile.experience} years` : "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  {isEditing ? (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register("availability")}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">
                        Available for opportunities
                      </span>
                    </label>
                  ) : (
                    <p className="text-gray-900">
                      {profile.availability ? (
                        <span className="text-green-600 font-medium">✓ Available</span>
                      ) : (
                        <span className="text-gray-600">Not available</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Professional Links
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Portfolio URL
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      {...register("portfolio")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://yourportfolio.com"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.portfolio ? (
                        <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          {profile.portfolio}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Personal Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      {...register("personalWebsite")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.personalWebsite ? (
                        <a href={profile.personalWebsite} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          {profile.personalWebsite}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub URL
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      {...register("github")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://github.com/username"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.github ? (
                        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          {profile.github}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn URL
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      {...register("linkedIn")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.linkedIn ? (
                        <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          {profile.linkedIn}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {resumeUrl ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">Resume uploaded</p>
                      <p className="text-sm text-gray-500">{resumeUrl.split('/').pop()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">Download</Button>
                    </a>
                    {isEditing && (
                      <label className="cursor-pointer">
                        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
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
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No resume uploaded</p>
                  {isEditing && (
                    <label className="cursor-pointer">
                      <span className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
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
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, DOC, DOCX (Max 10MB)
              </p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {isEditing && (
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add a skill (press Enter)"
                  />
                  <Button type="button" onClick={addSkill}>
                    Add
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-1 text-primary-600 hover:text-primary-800 font-bold"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Work Experience
                </CardTitle>
                {isEditing && (
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
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {workExperiences.length > 0 ? (
                <div className="space-y-4">
                  {workExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
                    >
                      {isEditing && (
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingWorkExp(exp);
                              setShowWorkExpForm(true);
                            }}
                            className="p-1 text-gray-400 hover:text-primary-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteWorkExpModal({ isOpen: true, id: exp.id, title: exp.jobTitle })}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <div className="pr-16">
                        <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                        <p className="text-gray-700">{exp.companyName}</p>
                        {exp.location && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
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
                          <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">No work experience added yet</p>
                  {isEditing && (
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
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
                {isEditing && (
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
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {educationEntries.length > 0 ? (
                <div className="space-y-4">
                  {educationEntries.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
                    >
                      {isEditing && (
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEdu(edu);
                              setShowEduForm(true);
                            }}
                            className="p-1 text-gray-400 hover:text-primary-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteEduModal({ isOpen: true, id: edu.id, name: edu.schoolName })}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <div className="pr-16">
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-700">{edu.schoolName}</p>
                        <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Class of {edu.graduationYear}
                          {edu.gpa && ` • GPA: ${edu.gpa}`}
                        </p>
                        {edu.description && (
                          <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">No education added yet</p>
                  {isEditing && (
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
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Job Preferences
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Job Type
                  </label>
                  {isEditing ? (
                    <select
                      {...register("preferredJobType")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Not specified</option>
                      <option value={JobType.FULL_TIME}>Full-time</option>
                      <option value={JobType.PART_TIME}>Part-time</option>
                      <option value={JobType.CONTRACT}>Contract</option>
                      <option value={JobType.INTERNSHIP}>Internship</option>
                      <option value={JobType.TEMPORARY}>Temporary</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {profile.preferredJobType ? profile.preferredJobType.replace(/_/g, " ") : "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desired Roles (comma-separated)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      {...register("desiredRoles")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Software Engineer, Data Scientist, Product Manager"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.desiredRoles?.join(", ") || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niche Category
                  </label>
                  {isEditing ? (
                    <select
                      {...register("nicheCategory")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Not specified</option>
                      <option value="AI_ML">AI/ML</option>
                      <option value="HEALTHCARE_IT">Healthcare IT</option>
                      <option value="FINTECH">Fintech</option>
                      <option value="CYBERSECURITY">Cybersecurity</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {profile.nicheCategory?.replace(/_/g, " ") || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remote Preference
                  </label>
                  {isEditing ? (
                    <select
                      {...register("remotePreference")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Not specified</option>
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="ONSITE">On-site</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {profile.remotePreference || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date Availability
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      {...register("startDateAvailability")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.startDateAvailability ? new Date(profile.startDateAvailability).toLocaleDateString() : "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register("openToContract")}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Open to contract work</span>
                    </label>
                  ) : (
                    <p className="text-gray-900">
                      <strong>Open to contract:</strong> {profile.openToContract ? "Yes" : "No"}
                    </p>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register("willingToRelocate")}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Willing to relocate</span>
                    </label>
                  ) : (
                    <p className="text-gray-900">
                      <strong>Willing to relocate:</strong> {profile.willingToRelocate ? "Yes" : "No"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Expected Salary (Annual)
                  </label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Minimum ($)
                        </label>
                        <input
                          type="number"
                          {...register("expectedSalaryMin", { valueAsNumber: true })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="80000"
                          min="0"
                          step="1000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Maximum ($)
                        </label>
                        <input
                          type="number"
                          {...register("expectedSalaryMax", { valueAsNumber: true })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="120000"
                          min="0"
                          step="1000"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-900">
                      {profile.expectedSalary
                        ? `$${convertSalaryToDollars(profile.expectedSalary)?.toLocaleString()}`
                        : "Not specified"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          {isEditing && (
            <div className="flex justify-end gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating} className="min-w-[120px]">
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </form>
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingWorkExp ? "Edit Work Experience" : "Add Work Experience"}
              </h3>
            </div>
            <form onSubmit={handleWorkExpSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={workExpFormData.companyName}
                  onChange={(e) => setWorkExpFormData({ ...workExpFormData, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Google"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={workExpFormData.jobTitle}
                  onChange={(e) => setWorkExpFormData({ ...workExpFormData, jobTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={workExpFormData.location}
                  onChange={(e) => setWorkExpFormData({ ...workExpFormData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={workExpFormData.startDate}
                    onChange={(e) => setWorkExpFormData({ ...workExpFormData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={workExpFormData.endDate}
                    onChange={(e) => setWorkExpFormData({ ...workExpFormData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                    disabled={workExpFormData.isCurrent}
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={workExpFormData.isCurrent}
                    onChange={(e) => setWorkExpFormData({ ...workExpFormData, isCurrent: e.target.checked, endDate: "" })}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">I currently work here</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={workExpFormData.description}
                  onChange={(e) => setWorkExpFormData({ ...workExpFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe your role and responsibilities..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEdu ? "Edit Education" : "Add Education"}
              </h3>
            </div>
            <form onSubmit={handleEduSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eduFormData.schoolName}
                  onChange={(e) => setEduFormData({ ...eduFormData, schoolName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., MIT"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eduFormData.degree}
                  onChange={(e) => setEduFormData({ ...eduFormData, degree: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Bachelor of Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eduFormData.fieldOfStudy}
                  onChange={(e) => setEduFormData({ ...eduFormData, fieldOfStudy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={eduFormData.graduationYear}
                    onChange={(e) => setEduFormData({ ...eduFormData, graduationYear: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1950"
                    max="2030"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA (optional)
                  </label>
                  <input
                    type="text"
                    value={eduFormData.gpa}
                    onChange={(e) => setEduFormData({ ...eduFormData, gpa: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 3.8"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={eduFormData.description}
                  onChange={(e) => setEduFormData({ ...eduFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe your achievements, activities, etc..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
