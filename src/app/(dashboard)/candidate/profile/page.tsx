"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { useCandidateDashboard } from "@/hooks/useDashboard";
import { convertSalaryToDollars, convertSalaryToCents, JobType } from "@/types";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
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
} from "lucide-react";
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

  // Initialize form with profile data
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
    values: profile
      ? {
          phone: profile.phone || "",
          location: profile.location || "",
          bio: profile.bio || "",
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

  // Initialize skills
  useEffect(() => {
    if (profile?.skills) {
      setSkills(profile.skills);
    }
    if (profile?.resume) {
      setResumeUrl(profile.resume);
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

  const onSubmit = (data: ProfileFormData) => {
    const salaryMin = data.expectedSalaryMin ? Number(data.expectedSalaryMin) : null;
    const expectedSalary = convertSalaryToCents(salaryMin);

    const payload = {
      phone: data.phone || null,
      location: data.location || null,
      bio: data.bio || null,
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
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (file: File, type: 'resume' | 'photo') => {
    setUploading(true);
    try {
      const result = await uploadFile(file, type);
      if (type === 'resume') {
        setResumeUrl(result.url);
      } else {
        setPhotoUrl(result.url);
      }
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
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

          {/* Work Experience - Complex section truncated for space, will continue... */}

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
    </div>
  );
}
