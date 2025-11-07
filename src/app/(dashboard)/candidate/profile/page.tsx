"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { convertSalaryToDollars, convertSalaryToCents, JobType } from "@/types";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  Loader2,
  User,
  Briefcase,
  DollarSign,
  MapPin,
  Calendar,
  Link as LinkIcon,
  GraduationCap,
  Code,
  Mail,
  Phone,
  Github,
  Linkedin,
  Globe,
} from "lucide-react";

type ProfileFormData = {
  phone: string;
  location: string;
  bio: string;
  experience: number;
  education: string;
  portfolio: string;
  github: string;
  linkedIn: string;
  preferredJobType: JobType | "";
  expectedSalaryMin: number | "";
  expectedSalaryMax: number | "";
  availability: boolean;
};

export default function CandidateProfilePage() {
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

  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

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
          github: profile.github || "",
          linkedIn: profile.linkedIn || "",
          preferredJobType: profile.preferredJobType || "",
          expectedSalaryMin: convertSalaryToDollars(profile.expectedSalary) || "",
          expectedSalaryMax: convertSalaryToDollars(profile.expectedSalary) || "",
          availability: profile.availability,
        }
      : undefined,
  });

  // Initialize skills from profile
  useState(() => {
    if (profile?.skills) {
      setSkills(profile.skills);
    }
  });

  const onSubmit = (data: ProfileFormData) => {
    // Convert salary from dollars to cents for backend
    const salaryMin = data.expectedSalaryMin ? Number(data.expectedSalaryMin) : null;
    const salaryMax = data.expectedSalaryMax ? Number(data.expectedSalaryMax) : null;

    // For now, we'll use the minimum as expectedSalary (backend has single field)
    const expectedSalary = convertSalaryToCents(salaryMin);

    const payload = {
      phone: data.phone || null,
      location: data.location || null,
      bio: data.bio || null,
      experience: data.experience || null,
      education: data.education || null,
      portfolio: data.portfolio || null,
      github: data.github || null,
      linkedIn: data.linkedIn || null,
      preferredJobType: (data.preferredJobType as JobType) || null,
      expectedSalary,
      availability: data.availability,
      skills,
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

  // No profile found
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
          {/* Basic Information */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                {!isEditing && (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
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
                      placeholder="Tell employers about yourself, your experience, and what you're looking for..."
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
                        <a
                          href={profile.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
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
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
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
                        <a
                          href={profile.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
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

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {isEditing ? (
                <textarea
                  {...register("education")}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="List your educational background (degrees, institutions, years)..."
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">
                  {profile.education || "Not provided"}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Note: Education is stored as simple text. List your degrees, institutions, and years.
              </p>
            </CardContent>
          </Card>

          {/* Job Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      {profile.preferredJobType
                        ? profile.preferredJobType.replace(/_/g, " ")
                        : "Not specified"}
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <div className="flex justify-end gap-4">
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
