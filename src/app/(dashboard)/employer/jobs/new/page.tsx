"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray, type Control } from "react-hook-form";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  Plus,
  X,
  Loader2,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Building2,
} from "lucide-react";
import {
  Card,
  CardContent,
  Input,
  Select,
  Button,
  Stepper,
  MultiSelect,
  Badge,
  useToast,
  type MultiSelectOption,
} from "@/components/ui";
import {
  jobPostingSchema,
  type JobPostingFormData,
} from "@/lib/validations";

const NICHES = [
  { value: "ai-ml", label: "AI/ML" },
  { value: "healthcare-it", label: "Healthcare IT" },
  { value: "fintech", label: "FinTech" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "data-science", label: "Data Science" },
  { value: "cloud-computing", label: "Cloud Computing" },
];

const REMOTE_TYPES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (3-5 years)" },
  { value: "senior", label: "Senior (5-10 years)" },
  { value: "lead", label: "Lead/Principal (10+ years)" },
];

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const TECH_STACK: MultiSelectOption[] = [
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "tensorflow", label: "TensorFlow" },
  { value: "pytorch", label: "PyTorch" },
  { value: "aws", label: "AWS" },
  { value: "gcp", label: "Google Cloud" },
  { value: "azure", label: "Azure" },
  { value: "docker", label: "Docker" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "sql", label: "SQL" },
  { value: "mongodb", label: "MongoDB" },
  { value: "redis", label: "Redis" },
  { value: "kafka", label: "Kafka" },
  { value: "spark", label: "Apache Spark" },
];

const STEPS = [
  { id: "basic", label: "Basic Info", description: "Job essentials" },
  { id: "details", label: "Details", description: "Requirements & benefits" },
  { id: "review", label: "Review", description: "Preview & publish" },
];

export default function NewJobPostingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<JobPostingFormData>({
    defaultValues: {
      title: "",
      niche: "",
      location: "",
      remoteType: "remote",
      experienceLevel: "mid",
      employmentType: "full-time",
      description: "",
      responsibilities: [""],
      requirements: [""],
      niceToHaves: [""],
      techStack: [],
      salaryMin: 0,
      salaryMax: 0,
      salaryCurrency: "USD",
      benefits: [""],
    },
  });

  // Note: Type assertion needed due to react-hook-form's type inference limitations with Zod schemas
  // The form fields are still type-safe through the schema validation
  const {
    fields: responsibilityFields,
    append: appendResponsibility,
    remove: removeResponsibility,
  } = useFieldArray({
    control: control as unknown as Control,
    name: "responsibilities",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control: control as unknown as Control,
    name: "requirements",
  });

  const {
    fields: niceToHaveFields,
    append: appendNiceToHave,
    remove: removeNiceToHave,
  } = useFieldArray({
    control: control as unknown as Control,
    name: "niceToHaves",
  });

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control: control as unknown as Control,
    name: "benefits",
  });

  const formValues = watch();
  const descriptionValue = watch("description");

  const handleNext = async () => {
    let fieldsToValidate: (keyof JobPostingFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "title",
        "niche",
        "location",
        "remoteType",
        "experienceLevel",
        "employmentType",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "description",
        "responsibilities",
        "requirements",
        "techStack",
        "salaryMin",
        "salaryMax",
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSaveDraft = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to save draft
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast("success", "Draft saved!", "Your job posting has been saved as a draft.");
    } catch (error) {
      showToast("error", "Save failed", "There was a problem saving your draft. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPublish = async (data: JobPostingFormData) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to publish job
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast("success", "Job published!", "Your job posting is now live.");
      router.push("/employer/dashboard");
    } catch (error) {
      showToast("error", "Publish failed", "There was a problem publishing your job. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 lg:text-3xl">
          Post a New Job
        </h1>
        <p className="mt-1 text-secondary-600">
          Fill out the details below to create a new job posting
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={currentStep} />

      <form onSubmit={handleSubmit(onPublish)}>
        <Card>
          <CardContent className="p-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Basic Information
                  </h2>
                  <p className="mt-1 text-sm text-secondary-600">
                    Start with the essential details about the position
                  </p>
                </div>

                <Input
                  label="Job Title"
                  placeholder="e.g., Senior Machine Learning Engineer"
                  error={errors.title?.message}
                  helperText="Be specific and descriptive"
                  required
                  {...register("title")}
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  <Controller
                    name="niche"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Niche"
                        options={NICHES}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.niche?.message}
                        helperText="Select the primary industry"
                        required
                      />
                    )}
                  />

                  <Input
                    label="Location"
                    placeholder="e.g., San Francisco, CA or Remote"
                    error={errors.location?.message}
                    required
                    {...register("location")}
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <Controller
                    name="remoteType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Remote Type"
                        options={REMOTE_TYPES}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.remoteType?.message}
                        required
                      />
                    )}
                  />

                  <Controller
                    name="experienceLevel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Experience Level"
                        options={EXPERIENCE_LEVELS}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.experienceLevel?.message}
                        required
                      />
                    )}
                  />

                  <Controller
                    name="employmentType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Employment Type"
                        options={EMPLOYMENT_TYPES}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.employmentType?.message}
                        required
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Job Details
                  </h2>
                  <p className="mt-1 text-sm text-secondary-600">
                    Provide comprehensive information about the role
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Job Description <span className="text-danger-600">*</span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Describe the role, team, and company culture. What makes this opportunity unique?"
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.description
                        ? "border-danger-300 focus:border-danger-500 focus:ring-danger-500"
                        : "border-secondary-300 focus:border-primary-500 focus:ring-primary-500"
                    }`}
                    {...register("description")}
                  />
                  <div className="mt-1.5 flex items-center justify-between text-xs">
                    <span
                      className={
                        errors.description
                          ? "text-danger-600"
                          : "text-secondary-500"
                      }
                    >
                      {errors.description?.message || "100-5000 characters"}
                    </span>
                    <span className="text-secondary-500">
                      {descriptionValue?.length || 0} / 5000
                    </span>
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Key Responsibilities{" "}
                    <span className="text-danger-600">*</span>
                  </label>
                  <p className="mb-3 text-xs text-secondary-500">
                    Add at least 3 responsibilities
                  </p>
                  <div className="space-y-2">
                    {responsibilityFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          placeholder={`Responsibility ${index + 1}`}
                          error={
                            errors.responsibilities?.[index]?.message
                          }
                          {...register(
                            `responsibilities.${index}` as const
                          )}
                        />
                        {responsibilityFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeResponsibility(index)}
                            className="flex-shrink-0 rounded-lg border border-secondary-300 p-2 text-secondary-600 hover:bg-secondary-50"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => appendResponsibility("")}
                    className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Responsibility
                  </button>
                  {errors.responsibilities?.root && (
                    <p className="mt-1.5 text-sm text-danger-600">
                      {errors.responsibilities.root.message}
                    </p>
                  )}
                </div>

                {/* Requirements */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Requirements <span className="text-danger-600">*</span>
                  </label>
                  <p className="mb-3 text-xs text-secondary-500">
                    Add at least 3 requirements
                  </p>
                  <div className="space-y-2">
                    {requirementFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          placeholder={`Requirement ${index + 1}`}
                          error={errors.requirements?.[index]?.message}
                          {...register(`requirements.${index}` as const)}
                        />
                        {requirementFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="flex-shrink-0 rounded-lg border border-secondary-300 p-2 text-secondary-600 hover:bg-secondary-50"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => appendRequirement("")}
                    className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Requirement
                  </button>
                  {errors.requirements?.root && (
                    <p className="mt-1.5 text-sm text-danger-600">
                      {errors.requirements.root.message}
                    </p>
                  )}
                </div>

                {/* Nice to Haves */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Nice to Haves (Optional)
                  </label>
                  <div className="space-y-2">
                    {niceToHaveFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          placeholder={`Nice to have ${index + 1}`}
                          {...register(`niceToHaves.${index}` as const)}
                        />
                        <button
                          type="button"
                          onClick={() => removeNiceToHave(index)}
                          className="flex-shrink-0 rounded-lg border border-secondary-300 p-2 text-secondary-600 hover:bg-secondary-50"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => appendNiceToHave("")}
                    className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Nice to Have
                  </button>
                </div>

                {/* Tech Stack */}
                <Controller
                  name="techStack"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      label="Tech Stack"
                      options={TECH_STACK}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select technologies..."
                      error={errors.techStack?.message}
                      helperText="Select the main technologies used in this role"
                      required
                    />
                  )}
                />

                {/* Salary Range */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Salary Range (USD) <span className="text-danger-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
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
                  <p className="mt-1.5 text-xs text-secondary-500">
                    Annual salary range
                  </p>
                </div>

                {/* Benefits */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Benefits (Optional)
                  </label>
                  <div className="space-y-2">
                    {benefitFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          placeholder={`Benefit ${index + 1}`}
                          {...register(`benefits.${index}` as const)}
                        />
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="flex-shrink-0 rounded-lg border border-secondary-300 p-2 text-secondary-600 hover:bg-secondary-50"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => appendBenefit("")}
                    className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Benefit
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Review Job Posting
                  </h2>
                  <p className="mt-1 text-sm text-secondary-600">
                    Review your job posting before publishing
                  </p>
                </div>

                {/* Job Preview */}
                <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <h3 className="text-2xl font-bold text-secondary-900">
                        {formValues.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="primary">{formValues.niche}</Badge>
                        <Badge variant="secondary">
                          {formValues.employmentType}
                        </Badge>
                        <Badge variant="secondary">
                          {formValues.experienceLevel}
                        </Badge>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                      <span className="flex items-center">
                        <MapPin className="mr-1.5 h-4 w-4" />
                        {formValues.location}
                      </span>
                      <span className="flex items-center">
                        <Briefcase className="mr-1.5 h-4 w-4" />
                        {formValues.remoteType}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="mr-1.5 h-4 w-4" />
                        ${formValues.salaryMin?.toLocaleString()} - $
                        {formValues.salaryMax?.toLocaleString()}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="border-t border-secondary-200 pt-4">
                      <h4 className="mb-2 font-semibold text-secondary-900">
                        Description
                      </h4>
                      <p className="whitespace-pre-wrap text-sm text-secondary-700">
                        {formValues.description}
                      </p>
                    </div>

                    {/* Responsibilities */}
                    {formValues.responsibilities &&
                      formValues.responsibilities.filter((r) => r).length >
                        0 && (
                        <div className="border-t border-secondary-200 pt-4">
                          <h4 className="mb-2 font-semibold text-secondary-900">
                            Responsibilities
                          </h4>
                          <ul className="list-inside list-disc space-y-1 text-sm text-secondary-700">
                            {formValues.responsibilities
                              .filter((r) => r)
                              .map((resp, idx) => (
                                <li key={idx}>{resp}</li>
                              ))}
                          </ul>
                        </div>
                      )}

                    {/* Requirements */}
                    {formValues.requirements &&
                      formValues.requirements.filter((r) => r).length > 0 && (
                        <div className="border-t border-secondary-200 pt-4">
                          <h4 className="mb-2 font-semibold text-secondary-900">
                            Requirements
                          </h4>
                          <ul className="list-inside list-disc space-y-1 text-sm text-secondary-700">
                            {formValues.requirements
                              .filter((r) => r)
                              .map((req, idx) => (
                                <li key={idx}>{req}</li>
                              ))}
                          </ul>
                        </div>
                      )}

                    {/* Nice to Haves */}
                    {formValues.niceToHaves &&
                      formValues.niceToHaves.filter((n) => n).length > 0 && (
                        <div className="border-t border-secondary-200 pt-4">
                          <h4 className="mb-2 font-semibold text-secondary-900">
                            Nice to Haves
                          </h4>
                          <ul className="list-inside list-disc space-y-1 text-sm text-secondary-700">
                            {formValues.niceToHaves
                              .filter((n) => n)
                              .map((nice, idx) => (
                                <li key={idx}>{nice}</li>
                              ))}
                          </ul>
                        </div>
                      )}

                    {/* Tech Stack */}
                    {formValues.techStack && formValues.techStack.length > 0 && (
                      <div className="border-t border-secondary-200 pt-4">
                        <h4 className="mb-2 font-semibold text-secondary-900">
                          Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {formValues.techStack.map((tech) => {
                            const techOption = TECH_STACK.find(
                              (t) => t.value === tech
                            );
                            return (
                              <Badge key={tech} variant="secondary">
                                {techOption?.label || tech}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Benefits */}
                    {formValues.benefits &&
                      formValues.benefits.filter((b) => b).length > 0 && (
                        <div className="border-t border-secondary-200 pt-4">
                          <h4 className="mb-2 font-semibold text-secondary-900">
                            Benefits
                          </h4>
                          <ul className="list-inside list-disc space-y-1 text-sm text-secondary-700">
                            {formValues.benefits
                              .filter((b) => b)
                              .map((benefit, idx) => (
                                <li key={idx}>{benefit}</li>
                              ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            {currentStep < 3 && (
              <Button
                type="button"
                variant="outline"
                onClick={onSaveDraft}
                loading={isLoading}
              >
                <Save className="mr-2 h-5 w-5" />
                Save Draft
              </Button>
            )}

            {currentStep < 3 ? (
              <Button type="button" variant="primary" onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSaveDraft}
                  loading={isLoading}
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  loadingText="Publishing..."
                >
                  <Send className="mr-2 h-5 w-5" />
                  Publish Job
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
