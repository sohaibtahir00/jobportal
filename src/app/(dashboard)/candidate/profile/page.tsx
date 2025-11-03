"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save,
  User,
  Briefcase,
  Link as LinkIcon,
  Code,
  Settings,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  Input,
  Select,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  MultiSelect,
  useToast,
  type MultiSelectOption,
} from "@/components/ui";
import {
  candidateProfileSchema,
  type CandidateProfileFormData,
} from "@/lib/validations";

// Mock data for dropdowns
const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona (MST)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
];

const YEARS_OF_EXPERIENCE = [
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-7", label: "5-7 years" },
  { value: "7-10", label: "7-10 years" },
  { value: "10+", label: "10+ years" },
];

const SKILLS: MultiSelectOption[] = [
  { value: "python", label: "Python" },
  { value: "tensorflow", label: "TensorFlow" },
  { value: "pytorch", label: "PyTorch" },
  { value: "keras", label: "Keras" },
  { value: "scikit-learn", label: "Scikit-learn" },
  { value: "pandas", label: "Pandas" },
  { value: "numpy", label: "NumPy" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "deep-learning", label: "Deep Learning" },
  { value: "nlp", label: "Natural Language Processing" },
  { value: "computer-vision", label: "Computer Vision" },
  { value: "reinforcement-learning", label: "Reinforcement Learning" },
  { value: "data-science", label: "Data Science" },
  { value: "statistics", label: "Statistics" },
  { value: "sql", label: "SQL" },
  { value: "spark", label: "Apache Spark" },
  { value: "aws", label: "AWS" },
  { value: "gcp", label: "Google Cloud Platform" },
  { value: "azure", label: "Azure" },
  { value: "docker", label: "Docker" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "mlops", label: "MLOps" },
  { value: "git", label: "Git" },
  { value: "jupyter", label: "Jupyter" },
];

const DESIRED_ROLES: MultiSelectOption[] = [
  { value: "ml-engineer", label: "Machine Learning Engineer" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "ai-researcher", label: "AI Researcher" },
  { value: "research-scientist", label: "Research Scientist" },
  { value: "ml-ops-engineer", label: "MLOps Engineer" },
  { value: "computer-vision-engineer", label: "Computer Vision Engineer" },
  { value: "nlp-engineer", label: "NLP Engineer" },
  { value: "ai-engineer", label: "AI Engineer" },
  { value: "data-engineer", label: "Data Engineer" },
  { value: "applied-scientist", label: "Applied Scientist" },
];

const REMOTE_PREFERENCES = [
  { value: "remote", label: "Remote Only" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
  { value: "flexible", label: "Flexible" },
];

export default function CandidateProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { showToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CandidateProfileFormData>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: {
      fullName: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
      yearsOfExperience: "3-5",
      currentTitle: "Machine Learning Engineer",
      currentCompany: "TechCorp AI",
      bio: "Passionate Machine Learning Engineer with 4+ years of experience building and deploying ML models at scale. Specialized in NLP and computer vision applications.",
      resumeUrl: "",
      linkedinUrl: "https://linkedin.com/in/sarahjohnson",
      githubUrl: "https://github.com/sarahjohnson",
      portfolioUrl: "",
      skills: ["python", "tensorflow", "pytorch", "machine-learning"],
      desiredRoles: ["ml-engineer", "data-scientist"],
      salaryMin: 120000,
      salaryMax: 180000,
      remotePreference: "remote",
      availabilityDate: "2025-12-01",
    },
  });

  const onSubmit = async (data: CandidateProfileFormData) => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast("success", "Profile updated!", "Your changes have been saved successfully.");
    } catch (error) {
      showToast("error", "Update failed", "There was a problem updating your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const bioValue = watch("bio");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 lg:text-3xl">
          Edit Profile
        </h1>
        <p className="mt-1 text-secondary-600">
          Update your profile information to help employers find you
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-0">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-secondary-200 overflow-x-auto">
                <TabsList className="h-auto w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger value="basic" className="gap-2">
                    <User className="hidden h-4 w-4 sm:inline" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="gap-2">
                    <Briefcase className="hidden h-4 w-4 sm:inline" />
                    Experience
                  </TabsTrigger>
                  <TabsTrigger value="links" className="gap-2">
                    <LinkIcon className="hidden h-4 w-4 sm:inline" />
                    Profile Links
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="gap-2">
                    <Code className="hidden h-4 w-4 sm:inline" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="gap-2">
                    <Settings className="hidden h-4 w-4 sm:inline" />
                    Preferences
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6 p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    placeholder="Your full name"
                    error={errors.fullName?.message}
                    required
                    {...register("fullName")}
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Input
                    label="Location"
                    placeholder="City, State/Country"
                    error={errors.location?.message}
                    helperText="Where are you currently based?"
                    required
                    {...register("location")}
                  />

                  <Controller
                    name="timezone"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Timezone"
                        options={TIMEZONES}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.timezone?.message}
                        required
                      />
                    )}
                  />
                </div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6 p-6">
                <Controller
                  name="yearsOfExperience"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Years of Experience"
                      options={YEARS_OF_EXPERIENCE}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.yearsOfExperience?.message}
                      required
                    />
                  )}
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  <Input
                    label="Current Title"
                    placeholder="e.g., Machine Learning Engineer"
                    error={errors.currentTitle?.message}
                    {...register("currentTitle")}
                  />

                  <Input
                    label="Current Company"
                    placeholder="e.g., TechCorp AI"
                    error={errors.currentCompany?.message}
                    {...register("currentCompany")}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Professional Bio <span className="text-danger-600">*</span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tell us about your experience, expertise, and what you're passionate about..."
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.bio
                        ? "border-danger-300 focus:border-danger-500 focus:ring-danger-500"
                        : "border-secondary-300 focus:border-primary-500 focus:ring-primary-500"
                    }`}
                    {...register("bio")}
                  />
                  <div className="mt-1.5 flex items-center justify-between text-xs">
                    <span
                      className={
                        errors.bio ? "text-danger-600" : "text-secondary-500"
                      }
                    >
                      {errors.bio?.message || "50-1000 characters"}
                    </span>
                    <span className="text-secondary-500">
                      {bioValue?.length || 0} / 1000
                    </span>
                  </div>
                </div>
              </TabsContent>

              {/* Profile Links Tab */}
              <TabsContent value="links" className="space-y-6 p-6">
                <Input
                  label="Resume URL"
                  type="url"
                  placeholder="https://example.com/resume.pdf"
                  error={errors.resumeUrl?.message}
                  helperText="Link to your resume or CV"
                  {...register("resumeUrl")}
                />

                <Input
                  label="LinkedIn Profile"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  error={errors.linkedinUrl?.message}
                  {...register("linkedinUrl")}
                />

                <Input
                  label="GitHub Profile"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  error={errors.githubUrl?.message}
                  {...register("githubUrl")}
                />

                <Input
                  label="Portfolio Website"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  error={errors.portfolioUrl?.message}
                  helperText="Your personal website or online portfolio"
                  {...register("portfolioUrl")}
                />
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-6 p-6">
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      label="Technical Skills"
                      options={SKILLS}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select your skills..."
                      error={errors.skills?.message}
                      helperText="Select all skills that apply to you"
                      required
                    />
                  )}
                />

                <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4">
                  <p className="mb-2 text-sm font-medium text-secondary-900">
                    Tips for selecting skills:
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm text-secondary-600">
                    <li>Focus on skills you have practical experience with</li>
                    <li>Include both technical and domain-specific skills</li>
                    <li>Keep your skill list updated as you learn new things</li>
                    <li>Prioritize in-demand skills for your desired roles</li>
                  </ul>
                </div>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6 p-6">
                <Controller
                  name="desiredRoles"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      label="Desired Roles"
                      options={DESIRED_ROLES}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select roles you're interested in..."
                      error={errors.desiredRoles?.message}
                      helperText="What types of positions are you looking for?"
                      required
                    />
                  )}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Salary Range (USD){" "}
                    <span className="text-danger-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Controller
                        name="salaryMin"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            placeholder="Minimum"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            error={errors.salaryMin?.message}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        name="salaryMax"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            placeholder="Maximum"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            error={errors.salaryMax?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-secondary-500">
                    Your expected annual salary range
                  </p>
                </div>

                <Controller
                  name="remotePreference"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Remote Work Preference"
                      options={REMOTE_PREFERENCES}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.remotePreference?.message}
                      helperText="What's your preferred work arrangement?"
                      required
                    />
                  )}
                />

                <Input
                  label="Availability Date"
                  type="date"
                  error={errors.availabilityDate?.message}
                  helperText="When can you start a new position?"
                  {...register("availabilityDate")}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
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
      </form>
    </div>
  );
}
