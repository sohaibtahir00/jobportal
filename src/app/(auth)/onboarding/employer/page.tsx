"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Phone,
  Globe,
  CheckCircle,
  Building2,
  ChevronRight,
  ChevronLeft,
  Upload,
  MapPin,
  Users,
  Briefcase,
  FileText,
  Image as ImageIcon,
  X,
  Sparkles,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui";
import { useSession } from "next-auth/react";
import api from "@/lib/api";

// Company size options
const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
];

// Industry options
const INDUSTRIES = [
  "Technology",
  "AI/ML",
  "SaaS",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Cybersecurity",
  "Education",
  "Media & Entertainment",
  "Manufacturing",
  "Consulting",
  "Other",
];

interface CompanyData {
  companyName: string;
  companyWebsite: string;
  phone: string;
  location: string;
  companySize: string;
  industry: string;
  description: string;
  companyLogo: string | null;
}

export default function EmployerOnboardingPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Company data state
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyName: session?.user?.name || "",
    companyWebsite: "",
    phone: "",
    location: "",
    companySize: "",
    industry: "",
    description: "",
    companyLogo: null,
  });

  // Validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyData, string>>>({});

  // Handle website import
  const handleImportWebsite = async () => {
    if (!websiteUrl.trim()) {
      setImportError("Please enter a website URL");
      return;
    }

    // Ensure URL has protocol
    let urlToImport = websiteUrl.trim();
    if (!urlToImport.startsWith("http://") && !urlToImport.startsWith("https://")) {
      urlToImport = "https://" + urlToImport;
    }

    setIsImporting(true);
    setImportError(null);

    try {
      const response = await api.post("/api/employers/parse-website", {
        url: urlToImport,
      });

      if (response.data.success && response.data.data) {
        const data = response.data.data;

        setCompanyData(prev => ({
          ...prev,
          companyName: data.companyName || prev.companyName,
          companyWebsite: urlToImport,
          phone: data.phone || prev.phone,
          location: data.location || prev.location,
          companySize: data.companySize || prev.companySize,
          industry: data.industry || prev.industry,
          description: data.description || prev.description,
          companyLogo: data.logo || prev.companyLogo,
        }));

        showToast("success", "Company Info Imported", "Review and edit the details below.");
        setCurrentStep(2);
      } else {
        setImportError("Couldn't extract company info. Please fill in manually.");
      }
    } catch (error: any) {
      console.error("Import error:", error);
      setImportError(error.response?.data?.error || "Couldn't reach this website. Please fill in manually.");
    } finally {
      setIsImporting(false);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("error", "Invalid File", "Please upload an image file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "File Too Large", "Logo must be less than 5MB.");
      return;
    }

    setIsUploadingLogo(true);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "logo");

      const response = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.url) {
        setCompanyData(prev => ({ ...prev, companyLogo: response.data.url }));
        showToast("success", "Logo Uploaded", "Your company logo has been uploaded.");
      }
    } catch (error: any) {
      console.error("Logo upload error:", error);
      showToast("error", "Upload Failed", error.response?.data?.error || "Please try again.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Validate step 2 data
  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyData, string>> = {};

    if (!companyData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!companyData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[1-9]\d{1,14}$/.test(companyData.phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (companyData.companyWebsite && !isValidUrl(companyData.companyWebsite)) {
      newErrors.companyWebsite = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit company profile
  const handleSubmit = async () => {
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Update employer profile
      await api.patch("/api/employers/profile", {
        companyName: companyData.companyName,
        companyWebsite: companyData.companyWebsite || null,
        phone: companyData.phone.replace(/[\s-]/g, ""),
        location: companyData.location || null,
        companySize: companyData.companySize || null,
        industry: companyData.industry || null,
        description: companyData.description || null,
        companyLogo: companyData.companyLogo || null,
      });

      // Update user name if changed
      if (companyData.companyName !== session?.user?.name) {
        await api.patch("/api/settings", {
          name: companyData.companyName,
        });
      }

      // Mark onboarding as completed
      await api.patch("/api/settings", {
        onboardingCompleted: true,
      });

      // Update session
      await updateSession({ onboardingCompleted: true });

      showToast("success", "Profile Completed!", "Your company profile is ready.");
      router.push("/employer/settings");
    } catch (error: any) {
      console.error("Submit error:", error);
      showToast("error", "Failed to Save", error.response?.data?.error || "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skip onboarding
  const handleSkip = async () => {
    setIsSkipping(true);

    try {
      // Save any data that was entered
      if (currentStep >= 2 && (companyData.phone || companyData.companyWebsite || companyData.location)) {
        await api.patch("/api/employers/profile", {
          companyWebsite: companyData.companyWebsite || null,
          phone: companyData.phone?.replace(/[\s-]/g, "") || null,
          location: companyData.location || null,
          companySize: companyData.companySize || null,
          industry: companyData.industry || null,
          description: companyData.description || null,
          companyLogo: companyData.companyLogo || null,
        });
      }

      // Mark onboarding as completed
      await api.patch("/api/settings", {
        onboardingCompleted: true,
      });

      await updateSession({ onboardingCompleted: true });
      router.push("/employer/dashboard");
    } catch (error) {
      console.error("Skip error:", error);
      // Still try to redirect
      router.push("/employer/dashboard");
    } finally {
      setIsSkipping(false);
    }
  };

  // Render Step 1: Import Company Info
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
          <Building2 className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Let's Set Up Your Company Profile
        </h1>
        <p className="text-gray-600">
          Import your company info from your website or fill in manually
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Step 1 of 2</span>
          <span>Import Company Info</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full w-1/2"></div>
        </div>
      </div>

      {/* Import from Website */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-primary-700 font-semibold">
          <Sparkles className="w-5 h-5" />
          <span>Auto-Import from Website</span>
        </div>
        <p className="text-sm text-gray-600">
          Enter your company website and we'll automatically extract your company information.
        </p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => {
                setWebsiteUrl(e.target.value);
                setImportError(null);
              }}
              placeholder="https://yourcompany.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              disabled={isImporting}
            />
            <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={handleImportWebsite}
            disabled={isImporting || !websiteUrl.trim()}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isImporting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Importing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Import
              </>
            )}
          </button>
        </div>
        {importError && (
          <p className="text-sm text-red-600">{importError}</p>
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

      {/* Manual Entry */}
      <button
        onClick={() => setCurrentStep(2)}
        disabled={isImporting}
        className="w-full py-4 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
      >
        <Edit2 className="h-5 w-5" />
        Fill in Manually
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Skip */}
      <button
        type="button"
        onClick={handleSkip}
        disabled={isImporting || isSubmitting || isSkipping}
        className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
      >
        {isSkipping ? "Skipping..." : "Skip for now (you can complete this later)"}
      </button>
    </motion.div>
  );

  // Render Step 2: Review & Edit
  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Company Information
        </h1>
        <p className="text-gray-600">
          Edit any details below and complete your profile
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Step 2 of 2</span>
          <span>Company Details</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full w-full"></div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="relative">
          {companyData.companyLogo ? (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200">
              <img
                src={companyData.companyLogo}
                alt="Company Logo"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setCompanyData(prev => ({ ...prev, companyLogo: null }))}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">Company Logo</p>
          <p className="text-sm text-gray-500 mb-2">PNG, JPG up to 5MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingLogo}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            {isUploadingLogo ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Logo
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-4">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={companyData.companyName}
              onChange={(e) => {
                setCompanyData(prev => ({ ...prev, companyName: e.target.value }));
                setErrors(prev => ({ ...prev, companyName: undefined }));
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                errors.companyName ? "border-red-500" : "border-gray-300 focus:border-primary-500"
              }`}
              placeholder="Your Company Name"
            />
            <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              value={companyData.phone}
              onChange={(e) => {
                setCompanyData(prev => ({ ...prev, phone: e.target.value }));
                setErrors(prev => ({ ...prev, phone: undefined }));
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                errors.phone ? "border-red-500" : "border-gray-300 focus:border-primary-500"
              }`}
              placeholder="+1 234 567 8900"
            />
            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company Website
          </label>
          <div className="relative">
            <input
              type="url"
              value={companyData.companyWebsite}
              onChange={(e) => {
                setCompanyData(prev => ({ ...prev, companyWebsite: e.target.value }));
                setErrors(prev => ({ ...prev, companyWebsite: undefined }));
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary-500/20 transition-all outline-none pr-12 ${
                errors.companyWebsite ? "border-red-500" : "border-gray-300 focus:border-primary-500"
              }`}
              placeholder="https://yourcompany.com"
            />
            <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.companyWebsite && (
            <p className="mt-1 text-sm text-red-600">{errors.companyWebsite}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Headquarters Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={companyData.location}
              onChange={(e) => setCompanyData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none pr-12"
              placeholder="San Francisco, CA"
            />
            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Company Size & Industry */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Size
            </label>
            <div className="relative">
              <select
                value={companyData.companySize}
                onChange={(e) => setCompanyData(prev => ({ ...prev, companySize: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none bg-white pr-10"
              >
                <option value="">Select size</option>
                {COMPANY_SIZES.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
              <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Industry
            </label>
            <div className="relative">
              <select
                value={companyData.industry}
                onChange={(e) => setCompanyData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none bg-white pr-10"
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company Description
          </label>
          <div className="relative">
            <textarea
              value={companyData.description}
              onChange={(e) => setCompanyData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none resize-none"
              placeholder="Tell candidates about your company, culture, and mission..."
            />
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-4">
        <p className="font-semibold text-gray-900 mb-2">What you'll get access to:</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Post unlimited jobs",
            "Skills-verified candidates",
            "Application tracking",
            "Direct messaging",
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || isSkipping}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" />
              Saving...
            </span>
          ) : (
            "Complete Profile"
          )}
        </button>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(1)}
            disabled={isSubmitting || isSkipping}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleSkip}
            disabled={isSubmitting || isSkipping}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            {isSkipping ? "Skipping..." : "Skip for now"}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Helper function to validate URL
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
