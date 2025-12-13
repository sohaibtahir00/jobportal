"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Building2,
  Mail,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Upload,
  X,
  Video,
  ExternalLink,
  FileText,
  Plus,
  Edit,
  Star,
  Calendar,
  CreditCard,
  Users,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  FileImage,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  Button,
  Badge,
  Card,
  CardContent,
  Input,
  ConfirmationModal,
  useToast,
  CollapsibleSection,
  SettingsProgress,
  SectionStatus,
} from "@/components/ui";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

export default function EmployerSettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Confirmation modal states
  const [deleteMemberModal, setDeleteMemberModal] = useState<{
    isOpen: boolean;
    memberId: string | null;
    memberName: string;
  }>({ isOpen: false, memberId: null, memberName: "" });
  const [disconnectVideoModal, setDisconnectVideoModal] = useState(false);
  const [disconnectCalendarModal, setDisconnectCalendarModal] = useState(false);
  const [deleteTemplateModal, setDeleteTemplateModal] = useState<{
    isOpen: boolean;
    templateId: string | null;
    templateName: string;
  }>({ isOpen: false, templateId: null, templateName: "" });
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deleteAccountConfirmModal, setDeleteAccountConfirmModal] =
    useState(false);

  // Form state
  const [profileData, setProfileData] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    companySize: "",
    industry: "",
    description: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newApplications: true,
    interviewReminders: true,
    messages: true,
    placementUpdates: true,
    marketingEmails: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showCompanyProfile: true,
    allowCandidateContact: true,
  });

  // Team members state
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    title: "",
  });

  // Video integration state
  const [videoIntegration, setVideoIntegration] = useState<any>(null);
  const [employerId, setEmployerId] = useState<string>("");

  // Google Calendar integration state
  const [calendarIntegration, setCalendarIntegration] = useState<any>(null);

  // Interview templates state
  const [templates, setTemplates] = useState<any[]>([]);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    rounds: [{ name: "", duration: 30, description: "" }],
  });

  // Billing state
  const [isSettingUpBilling, setIsSettingUpBilling] = useState(false);
  const [hasStripeCustomer, setHasStripeCustomer] = useState(false);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<{
    id: string;
    last4: string;
    expMonth: number;
    expYear: number;
    brand: string;
  } | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);

  // Calculate section statuses
  const sectionStatuses = useMemo(() => {
    const companyProfileComplete =
      profileData.companyName &&
      profileData.email &&
      profileData.location &&
      profileData.industry;

    // Notifications are complete if user has made a choice (either some enabled OR explicitly all disabled)
    const notificationsComplete = true; // Always complete since user can choose to disable all

    const teamComplete = teamMembers.length > 0;

    const videoComplete = !!videoIntegration;

    const calendarComplete = !!calendarIntegration?.connected;

    const billingComplete = hasStripeCustomer;

    const templatesComplete = templates.length > 0;

    return {
      company: companyProfileComplete ? "complete" : "incomplete",
      password: "complete", // Always complete since it's optional
      notifications: notificationsComplete ? "complete" : "incomplete",
      team: teamComplete ? "complete" : "incomplete",
      video: videoComplete ? "complete" : "incomplete",
      calendar: calendarComplete ? "complete" : "incomplete",
      billing: billingComplete ? "complete" : "incomplete",
      templates: templatesComplete ? "complete" : "incomplete",
    } as Record<string, SectionStatus>;
  }, [
    profileData,
    notificationSettings,
    teamMembers,
    videoIntegration,
    calendarIntegration,
    hasStripeCustomer,
    templates,
  ]);

  // Get summary text for each section
  const getSummary = (section: string): string => {
    switch (section) {
      case "company":
        if (profileData.companyName && profileData.location) {
          return `${profileData.companyName} • ${profileData.location}`;
        }
        return "Company details not set";
      case "password":
        return "Password is set";
      case "notifications":
        const enabledCount = Object.values(notificationSettings).filter(Boolean).length;
        return `${enabledCount} of ${Object.keys(notificationSettings).length} notifications enabled`;
      case "team":
        if (teamMembers.length === 0) return "No team members added";
        return `${teamMembers.length} team member${teamMembers.length !== 1 ? "s" : ""}`;
      case "video":
        if (videoIntegration?.platform) {
          return `${videoIntegration.platform === "ZOOM" ? "Zoom" : "Google Meet"} connected`;
        }
        return "Not connected";
      case "calendar":
        if (calendarIntegration?.connected) {
          return `Connected as ${calendarIntegration.email}`;
        }
        return "Not connected";
      case "billing":
        if (hasStripeCustomer) {
          return paymentMethod
            ? `${paymentMethod.brand} •••• ${paymentMethod.last4}`
            : "Account set up";
        }
        return "Not set up";
      case "templates":
        if (templates.length === 0) return "No templates created";
        return `${templates.length} template${templates.length !== 1 ? "s" : ""}`;
      default:
        return "";
    }
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load employer profile
        const profileResponse = await api.get("/api/employers/profile");
        const profileData = profileResponse.data;

        // Map employer data to form fields
        setProfileData({
          companyName: profileData.employer.companyName || "",
          email: session?.user?.email || "",
          phone: profileData.employer.phone || "",
          website: profileData.employer.companyWebsite || "",
          location: profileData.employer.location || "",
          companySize: profileData.employer.companySize || "",
          industry: profileData.employer.industry || "",
          description: profileData.employer.description || "",
        });

        // Load user settings (for notifications)
        const settingsResponse = await api.get("/api/settings");
        const settingsData = settingsResponse.data;

        if (settingsData.settings) {
          setNotificationSettings({
            emailNotifications:
              settingsData.settings.emailNotifications ?? true,
            newApplications:
              settingsData.settings.notifyNewApplications ?? true,
            interviewReminders:
              settingsData.settings.notifyInterviewReminders ?? true,
            messages: settingsData.settings.notifyMessages ?? true,
            placementUpdates:
              settingsData.settings.notifyPlacementUpdates ?? true,
            marketingEmails:
              settingsData.settings.notifyMarketingEmails ?? false,
          });
        }

        // Load team members
        const teamResponse = await api.get("/api/employer/team-members");
        setTeamMembers(teamResponse.data.members || []);

        // Store employer ID for OAuth
        setEmployerId(profileData.employer.id);

        // Load video integration
        try {
          const videoResponse = await api.get(
            "/api/employer/integrations/video"
          );
          setVideoIntegration(videoResponse.data.integration);
        } catch (err) {
          // No integration yet, that's fine
          setVideoIntegration(null);
        }

        // Load Google Calendar integration
        try {
          const calendarResponse = await api.get(
            "/api/employer/integrations/google-calendar/status"
          );
          if (calendarResponse.data.connected) {
            setCalendarIntegration({
              connected: true,
              email: calendarResponse.data.email,
            });
          } else {
            setCalendarIntegration(null);
          }
        } catch (err) {
          // No integration yet, that's fine
          setCalendarIntegration(null);
        }

        // Load interview templates
        try {
          const templatesResponse = await api.get(
            "/api/employer/interview-templates"
          );
          setTemplates(templatesResponse.data.templates || []);
        } catch (err) {
          console.error("Failed to load templates:", err);
          setTemplates([]);
        }

        // Load billing status
        try {
          const billingResponse = await api.get("/api/stripe/billing-status");
          if (billingResponse.data) {
            setHasStripeCustomer(!!billingResponse.data.stripeCustomerId);
            setStripeCustomerId(billingResponse.data.stripeCustomerId);
            setPaymentMethod(billingResponse.data.paymentMethod);
          }
        } catch (err) {
          console.error("Failed to load billing status:", err);
        } finally {
          setBillingLoading(false);
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error("Failed to load settings:", err);
        setErrorMessage(err.response?.data?.error || "Failed to load settings");
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.role === "EMPLOYER") {
      loadSettings();
    }
  }, [status, session]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Update employer profile
      await api.patch("/api/employers/profile", {
        companyName: profileData.companyName,
        phone: profileData.phone,
        companyWebsite: profileData.website,
        location: profileData.location,
        companySize: profileData.companySize,
        industry: profileData.industry,
        description: profileData.description,
      });

      // Update user name (for display in header/sidebar)
      await api.patch("/api/settings", {
        name: profileData.companyName,
      });

      // Refresh the session to update displayed name
      // Pass the updated name directly to force immediate update
      await update({
        name: profileData.companyName,
      });

      // Invalidate the employer dashboard query to trigger refresh
      queryClient.invalidateQueries({ queryKey: ["employer-dashboard"] });

      setSuccessMessage("Profile updated successfully!");
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setErrorMessage(err.response?.data?.error || "Failed to update profile");
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.post("/api/settings/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccessMessage("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to change password:", err);
      setErrorMessage(err.response?.data?.error || "Failed to change password");
      setIsSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.patch("/api/settings", {
        emailNotifications: notificationSettings.emailNotifications,
        notifyNewApplications: notificationSettings.newApplications,
        notifyInterviewReminders: notificationSettings.interviewReminders,
        notifyMessages: notificationSettings.messages,
        notifyPlacementUpdates: notificationSettings.placementUpdates,
        notifyMarketingEmails: notificationSettings.marketingEmails,
      });

      setSuccessMessage("Notification preferences updated!");
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to update preferences:", err);
      setErrorMessage(
        err.response?.data?.error || "Failed to update preferences"
      );
      setIsSaving(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email) {
      setErrorMessage("Name and email are required");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await api.post("/api/employer/team-members", newMember);
      setTeamMembers([response.data.member, ...teamMembers]);
      setNewMember({ name: "", email: "", title: "" });
      setShowAddMember(false);
      setSuccessMessage("Team member added successfully!");
      // Invalidate the employer dashboard query to update banner
      queryClient.invalidateQueries({ queryKey: ["employer-dashboard"] });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to add team member:", err);
      setErrorMessage(err.response?.data?.error || "Failed to add team member");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      await api.delete(`/api/employer/team-members?id=${id}`);
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
      showToast(
        "success",
        "Member Removed",
        "Team member removed successfully!"
      );
      // Invalidate the employer dashboard query to update banner
      queryClient.invalidateQueries({ queryKey: ["employer-dashboard"] });
    } catch (err: any) {
      console.error("Failed to delete team member:", err);
      showToast(
        "error",
        "Error",
        err.response?.data?.error || "Failed to delete team member"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const connectZoom = () => {
    const clientId = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      setErrorMessage("Backend URL not configured. Please contact support.");
      return;
    }

    const redirectUri = `${backendUrl}/api/employer/integrations/zoom/callback`;
    const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${employerId}`;
    window.location.href = authUrl;
  };

  const connectGoogleMeet = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      setErrorMessage("Backend URL not configured. Please contact support.");
      return;
    }

    const redirectUri = `${backendUrl}/api/employer/integrations/google-meet/callback`;
    const scope =
      "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(
      scope
    )}&state=${employerId}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  const disconnectVideo = async () => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      await api.delete("/api/employer/integrations/video");
      setVideoIntegration(null);
      showToast(
        "success",
        "Disconnected",
        "Video integration disconnected successfully!"
      );
      // Invalidate the employer dashboard query to update banner
      queryClient.invalidateQueries({ queryKey: ["employer-dashboard"] });
    } catch (err: any) {
      console.error("Failed to disconnect video integration:", err);
      showToast(
        "error",
        "Error",
        err.response?.data?.error || "Failed to disconnect integration"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const disconnectCalendar = async () => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      await api.delete("/api/employer/integrations/google-calendar/disconnect");
      setCalendarIntegration(null);
      showToast(
        "success",
        "Disconnected",
        "Google Calendar disconnected successfully!"
      );
      // Invalidate the employer dashboard query to update banner
      queryClient.invalidateQueries({ queryKey: ["employer-dashboard"] });
    } catch (err: any) {
      console.error("Failed to disconnect Google Calendar:", err);
      showToast(
        "error",
        "Error",
        err.response?.data?.error || "Failed to disconnect calendar"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Interview template functions
  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim()) {
      setErrorMessage("Template name is required");
      return;
    }

    if (newTemplate.rounds.some((r) => !r.name.trim() || !r.duration)) {
      setErrorMessage("All rounds must have a name and duration");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await api.post("/api/employer/interview-templates", {
        name: newTemplate.name,
        rounds: newTemplate.rounds,
        isDefault: false,
      });

      setTemplates([...templates, response.data.template]);
      setNewTemplate({
        name: "",
        rounds: [{ name: "", duration: 30, description: "" }],
      });
      setShowCreateTemplate(false);
      setSuccessMessage("Template created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to create template:", err);
      setErrorMessage(err.response?.data?.error || "Failed to create template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await api.put(
        `/api/employer/interview-templates/${editingTemplate.id}`,
        {
          name: editingTemplate.name,
          rounds: editingTemplate.rounds,
          isDefault: editingTemplate.isDefault,
        }
      );

      setTemplates(
        templates.map((t) =>
          t.id === editingTemplate.id ? response.data.template : t
        )
      );
      setEditingTemplate(null);
      setSuccessMessage("Template updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to update template:", err);
      setErrorMessage(err.response?.data?.error || "Failed to update template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      await api.delete(`/api/employer/interview-templates/${templateId}`);
      setTemplates(templates.filter((t) => t.id !== templateId));
      showToast(
        "success",
        "Template Deleted",
        "Template deleted successfully!"
      );
    } catch (err: any) {
      console.error("Failed to delete template:", err);
      showToast(
        "error",
        "Error",
        err.response?.data?.error || "Failed to delete template"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefaultTemplate = async (templateId: string) => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await api.put(
        `/api/employer/interview-templates/${templateId}`,
        { isDefault: true }
      );

      // Update all templates - set selected as default, others as not default
      setTemplates(
        templates.map((t) => ({
          ...t,
          isDefault: t.id === templateId,
        }))
      );

      setSuccessMessage("Default template set successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to set default template:", err);
      setErrorMessage(
        err.response?.data?.error || "Failed to set default template"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const addRoundToNewTemplate = () => {
    setNewTemplate({
      ...newTemplate,
      rounds: [
        ...newTemplate.rounds,
        { name: "", duration: 30, description: "" },
      ],
    });
  };

  const removeRoundFromNewTemplate = (index: number) => {
    setNewTemplate({
      ...newTemplate,
      rounds: newTemplate.rounds.filter((_, i) => i !== index),
    });
  };

  const handleAccountDeletion = async () => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      await api.delete("/api/settings");

      // Sign out the user after account deletion
      await signOut({ redirect: false });
      router.push("/");
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      showToast(
        "error",
        "Error",
        err.response?.data?.error || "Failed to delete account"
      );
      setIsSaving(false);
    }
  };

  const initiateAccountDeletion = () => {
    setDeleteAccountModal(true);
  };

  const confirmFirstDeletion = () => {
    setDeleteAccountModal(false);
    setDeleteAccountConfirmModal(true);
  };

  const confirmFinalDeletion = async () => {
    setDeleteAccountConfirmModal(false);
    await handleAccountDeletion();
  };

  // Set up billing (create Stripe customer)
  const handleSetupBilling = async () => {
    setIsSettingUpBilling(true);
    setErrorMessage("");
    try {
      const response = await api.post("/api/stripe/create-customer");
      if (response.data.customerId) {
        setHasStripeCustomer(true);
        setStripeCustomerId(response.data.customerId);
        showToast(
          "success",
          "Billing Set Up",
          "Your billing account has been set up successfully!"
        );
        // Invalidate the employer dashboard query to update banner
        queryClient.invalidateQueries({ queryKey: ["employer-dashboard"] });
      }
    } catch (err: any) {
      console.error("Failed to set up billing:", err);
      showToast(
        "error",
        "Error",
        err.response?.data?.error ||
          "Failed to set up billing. Please try again."
      );
    } finally {
      setIsSettingUpBilling(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Section configuration for progress tracking (new order: Company, Team, Video, Calendar, Billing, Templates, Notifications, Password)
  const sections = [
    { id: "company", name: "Company Profile", status: sectionStatuses.company },
    { id: "team", name: "Team Members", status: sectionStatuses.team },
    { id: "video", name: "Video Conferencing", status: sectionStatuses.video },
    { id: "calendar", name: "Google Calendar", status: sectionStatuses.calendar },
    { id: "billing", name: "Billing & Payments", status: sectionStatuses.billing },
    { id: "templates", name: "Interview Templates", status: sectionStatuses.templates },
    { id: "notifications", name: "Notification Preferences", status: sectionStatuses.notifications },
  ];

  // Handler to expand a section when clicked from the incomplete list
  const handleSectionClick = (sectionId: string) => {
    setExpandedSections(new Set([sectionId]));
    // Scroll to the section
    setTimeout(() => {
      const element = document.getElementById(`section-content-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Progress Header */}
          <SettingsProgress sections={sections} onSectionClick={handleSectionClick} />

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-success-50 border border-success-200 p-4">
              <CheckCircle2 className="h-5 w-5 text-success-600" />
              <p className="text-sm text-success-700">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-error-50 border border-error-200 p-4">
              <AlertCircle className="h-5 w-5 text-error-600" />
              <p className="text-sm text-error-700">{errorMessage}</p>
            </div>
          )}

          {/* Collapsible Sections */}
          <div className="space-y-4">
            {/* Company Profile */}
            <CollapsibleSection
              id="company"
              icon={<Building2 className="h-5 w-5" />}
              iconBgColor="bg-primary-100"
              iconColor="text-primary-600"
              title="Company Profile"
              description="Update your company information"
              summary={getSummary("company")}
              status={sectionStatuses.company}
              isExpanded={expandedSections.has("company")}
              onToggle={() => toggleSection("company")}
              variant="accent"
            >
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Company Name
                    </label>
                    <Input
                      value={profileData.companyName}
                      disabled
                      variant="modern"
                      leftIcon={<Building2 className="h-5 w-5" />}
                      className="bg-secondary-100/50 cursor-not-allowed"
                      placeholder="Your company name"
                    />
                    <p className="mt-1.5 text-xs text-secondary-500">
                      Company name cannot be changed after registration
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      variant="modern"
                      leftIcon={<Mail className="h-5 w-5" />}
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      placeholder="company@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Phone
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Phone className="h-5 w-5" />}
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Website
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Globe className="h-5 w-5" />}
                      value={profileData.website}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          website: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Location
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<MapPin className="h-5 w-5" />}
                      value={profileData.location}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          location: e.target.value,
                        })
                      }
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Company Size
                    </label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-secondary-400 transition-colors duration-200 group-focus-within:text-accent-500">
                        <Users className="h-5 w-5" />
                      </div>
                      <select
                        value={profileData.companySize}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            companySize: e.target.value,
                          })
                        }
                        className="h-12 w-full rounded-xl border border-secondary-200 bg-secondary-50/50 pl-12 pr-4 py-3 text-sm transition-all duration-200 hover:bg-white hover:border-secondary-300 focus:outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20"
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Industry
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Briefcase className="h-5 w-5" />}
                      value={profileData.industry}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          industry: e.target.value,
                        })
                      }
                      placeholder="e.g., Technology, Healthcare, Finance"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Company Description
                    </label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute top-4 left-4 text-secondary-400 transition-colors duration-200 group-focus-within:text-accent-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <textarea
                        value={profileData.description}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 pl-12 pr-4 py-3 text-sm transition-all duration-200 hover:bg-white hover:border-secondary-300 focus:outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20"
                        placeholder="Brief description of your company..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CollapsibleSection>

            {/* Team Members */}
            <CollapsibleSection
              id="team"
              icon={<Users className="h-5 w-5" />}
              iconBgColor="bg-primary-100"
              iconColor="text-primary-600"
              title="Team Members"
              description="Manage team members who conduct interviews"
              summary={getSummary("team")}
              status={sectionStatuses.team}
              isExpanded={expandedSections.has("team")}
              onToggle={() => toggleSection("team")}
              variant="accent"
            >
              <div className="mb-4 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setShowAddMember(true)}
                  disabled={isSaving}
                >
                  + Add Member
                </Button>
              </div>

              {teamMembers.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-secondary-200 bg-secondary-50 p-8 text-center">
                  <p className="text-secondary-600">
                    No team members added yet. Add team members who will conduct
                    interviews.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border border-secondary-200 p-4"
                    >
                      <div>
                        <h3 className="font-semibold text-secondary-900">
                          {member.name}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {member.email}
                        </p>
                        {member.title && (
                          <p className="text-sm text-secondary-500">
                            {member.title}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setDeleteMemberModal({
                            isOpen: true,
                            memberId: member.id,
                            memberName: member.name,
                          })
                        }
                        disabled={isSaving}
                        className="border-error-300 text-error-600 hover:bg-error-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>

            {/* Video Conferencing */}
            <CollapsibleSection
              id="video"
              icon={<Video className="h-5 w-5" />}
              iconBgColor="bg-primary-100"
              iconColor="text-primary-600"
              title="Video Conferencing"
              description="Connect your video conferencing accounts to auto-generate meeting links"
              summary={getSummary("video")}
              status={sectionStatuses.video}
              isExpanded={expandedSections.has("video")}
              onToggle={() => toggleSection("video")}
              variant="accent"
            >
              {/* Zoom Integration */}
              <div className="mb-4 rounded-lg border border-secondary-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Video className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">Zoom</h3>
                      {videoIntegration?.platform === "ZOOM" ? (
                        <p className="text-sm text-success-600">
                          Connected as {videoIntegration.email}
                        </p>
                      ) : (
                        <p className="text-sm text-secondary-500">
                          Not connected
                        </p>
                      )}
                    </div>
                  </div>

                  {videoIntegration?.platform === "ZOOM" ? (
                    <Button
                      variant="outline"
                      onClick={() => setDisconnectVideoModal(true)}
                      disabled={isSaving}
                      className="border-error-300 text-error-600 hover:bg-error-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Disconnecting...
                        </>
                      ) : (
                        "Disconnect"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={connectZoom}
                      disabled={
                        isSaving ||
                        (videoIntegration &&
                          videoIntegration.platform !== "ZOOM")
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Connect Zoom
                    </Button>
                  )}
                </div>
              </div>

              {/* Google Meet Integration */}
              <div className="rounded-lg border border-secondary-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <Video className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">
                        Google Meet
                      </h3>
                      {videoIntegration?.platform === "GOOGLE_MEET" ? (
                        <p className="text-sm text-success-600">
                          Connected as {videoIntegration.email}
                        </p>
                      ) : (
                        <p className="text-sm text-secondary-500">
                          Not connected
                        </p>
                      )}
                    </div>
                  </div>

                  {videoIntegration?.platform === "GOOGLE_MEET" ? (
                    <Button
                      variant="outline"
                      onClick={() => setDisconnectVideoModal(true)}
                      disabled={isSaving}
                      className="border-error-300 text-error-600 hover:bg-error-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Disconnecting...
                        </>
                      ) : (
                        "Disconnect"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={connectGoogleMeet}
                      disabled={
                        isSaving ||
                        (videoIntegration &&
                          videoIntegration.platform !== "GOOGLE_MEET")
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Connect Google Meet
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-800">
                  Connect Zoom or Google Meet to
                  automatically generate meeting links when scheduling
                  interviews. You can only connect one platform at a time.
                </p>
              </div>
            </CollapsibleSection>

            {/* Google Calendar */}
            <CollapsibleSection
              id="calendar"
              icon={<Calendar className="h-5 w-5" />}
              iconBgColor="bg-primary-100"
              iconColor="text-primary-600"
              title="Google Calendar Integration"
              description="Sync your calendar to prevent double-booking when scheduling interviews"
              summary={getSummary("calendar")}
              status={sectionStatuses.calendar}
              isExpanded={expandedSections.has("calendar")}
              onToggle={() => toggleSection("calendar")}
              variant="accent"
            >
              <div className="rounded-lg border border-secondary-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">
                        Google Calendar
                      </h3>
                      {calendarIntegration?.connected ? (
                        <p className="text-sm text-success-600">
                          Connected as {calendarIntegration.email}
                        </p>
                      ) : (
                        <p className="text-sm text-secondary-500">
                          Not connected
                        </p>
                      )}
                    </div>
                  </div>

                  {calendarIntegration?.connected ? (
                    <Button
                      variant="outline"
                      onClick={() => setDisconnectCalendarModal(true)}
                      disabled={isSaving}
                      className="border-error-300 text-error-600 hover:bg-error-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Disconnecting...
                        </>
                      ) : (
                        "Disconnect"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => {
                        // Use frontend proxy route which adds auth headers
                        window.location.href =
                          "/api/employer/integrations/google-calendar/oauth";
                      }}
                      disabled={isSaving}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Connect Google Calendar
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-800">
                  When you connect Google Calendar,
                  your busy times will automatically show when setting interview
                  availability, helping you avoid scheduling conflicts.
                </p>
              </div>
            </CollapsibleSection>

            {/* Billing */}
            <CollapsibleSection
              id="billing"
              icon={<CreditCard className="h-5 w-5" />}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              title="Billing & Payments"
              description="Manage your payment methods and billing information"
              summary={getSummary("billing")}
              status={sectionStatuses.billing}
              isExpanded={expandedSections.has("billing")}
              onToggle={() => toggleSection("billing")}
              variant="accent"
            >
              {billingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stripe Customer Status */}
                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          hasStripeCustomer ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-secondary-900">
                          Billing Account Status
                        </p>
                        <p className="text-sm text-secondary-600">
                          {hasStripeCustomer
                            ? `Connected (ID: ...${stripeCustomerId?.slice(
                                -6
                              )})`
                            : "Not set up yet"}
                        </p>
                      </div>
                    </div>
                    {!hasStripeCustomer && (
                      <Button
                        onClick={handleSetupBilling}
                        disabled={isSettingUpBilling}
                      >
                        {isSettingUpBilling ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Setting up...
                          </>
                        ) : (
                          "Set Up Billing"
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Payment Method */}
                  {hasStripeCustomer && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-secondary-900">
                        Payment Method
                      </h4>
                      {paymentMethod ? (
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-secondary-500" />
                            <div>
                              <p className="font-medium text-secondary-900">
                                {paymentMethod.brand.charAt(0).toUpperCase() +
                                  paymentMethod.brand.slice(1)}{" "}
                                {paymentMethod.last4}
                              </p>
                              <p className="text-sm text-secondary-600">
                                Expires{" "}
                                {paymentMethod.expMonth
                                  .toString()
                                  .padStart(2, "0")}
                                /{paymentMethod.expYear}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 border border-dashed rounded-lg">
                          <p className="text-secondary-600">
                            No payment method on file
                          </p>
                          <p className="text-sm text-secondary-500">
                            Payment methods are added during checkout
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Invoices Link */}
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      asChild
                      className="w-full sm:w-auto"
                    >
                      <Link href="/employer/invoices">
                        <FileText className="h-4 w-4 mr-2" />
                        View Invoices & Payment History
                      </Link>
                    </Button>
                  </div>

                  {/* Info Box */}
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm text-blue-800">
                      Your billing account will be
                      automatically set up when you make your first payment. You
                      can also set it up now to streamline the checkout process.
                    </p>
                  </div>
                </div>
              )}
            </CollapsibleSection>

            {/* Interview Templates */}
            <CollapsibleSection
              id="templates"
              icon={<FileText className="h-5 w-5" />}
              iconBgColor="bg-primary-100"
              iconColor="text-primary-600"
              title="Interview Templates"
              description="Manage custom interview templates for your hiring process"
              summary={getSummary("templates")}
              status={sectionStatuses.templates}
              isExpanded={expandedSections.has("templates")}
              variant="accent"
              onToggle={() => toggleSection("templates")}
            >
              <div className="mb-4 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setShowCreateTemplate(true)}
                  disabled={isSaving}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>

              {/* Template List */}
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="rounded-lg border border-secondary-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-secondary-900">
                            {template.name}
                          </h3>
                          {template.isDefault && (
                            <Badge variant="success">Default</Badge>
                          )}
                          {template.isBuiltIn && (
                            <Badge variant="secondary">Built-in</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-secondary-600">
                          {template.rounds.length} round
                          {template.rounds.length !== 1 ? "s" : ""}:{" "}
                          {template.rounds
                            .map((r: any) => `${r.name} (${r.duration} min)`)
                            .join(", ")}
                        </p>
                      </div>

                      {!template.isBuiltIn && (
                        <div className="flex gap-2">
                          {!template.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleSetDefaultTemplate(template.id)
                              }
                              disabled={isSaving}
                            >
                              <Star className="mr-1 h-3 w-3" />
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTemplate(template)}
                            disabled={isSaving}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setDeleteTemplateModal({
                                isOpen: true,
                                templateId: template.id,
                                templateName: template.name,
                              })
                            }
                            disabled={isSaving}
                            className="border-error-300 text-error-600 hover:bg-error-50"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {templates.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-secondary-200 p-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-secondary-400" />
                    <p className="mt-2 text-sm text-secondary-600">
                      No custom templates yet. Create your first template to get
                      started.
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            {/* Notification Preferences */}
            <CollapsibleSection
              id="notifications"
              icon={<Bell className="h-5 w-5" />}
              iconBgColor="bg-accent-100"
              iconColor="text-accent-600"
              title="Notification Preferences"
              description="Choose what updates you want to receive"
              summary={getSummary("notifications")}
              status={sectionStatuses.notifications}
              variant="accent"
              isExpanded={expandedSections.has("notifications")}
              onToggle={() => toggleSection("notifications")}
            >
              <div className="space-y-4">
                {/* Disable All Notifications Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-secondary-50 to-secondary-100/50 border border-secondary-200">
                  <div>
                    <p className="font-semibold text-secondary-900">Disable All Notifications</p>
                    <p className="text-sm text-secondary-500">Turn off all notification types at once</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={!Object.values(notificationSettings).some(Boolean)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Disable all notifications
                          setNotificationSettings({
                            emailNotifications: false,
                            newApplications: false,
                            interviewReminders: false,
                            messages: false,
                            placementUpdates: false,
                            marketingEmails: false,
                          });
                        } else {
                          // Re-enable default notifications
                          setNotificationSettings({
                            emailNotifications: true,
                            newApplications: true,
                            interviewReminders: true,
                            messages: true,
                            placementUpdates: true,
                            marketingEmails: false,
                          });
                        }
                      }}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-secondary-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-secondary-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-error-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-error-500/20"></div>
                  </label>
                </div>

                <div className="border-t border-secondary-200 pt-4">
                  <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider mb-4">Individual Preferences</p>
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-secondary-900">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              [key]: e.target.checked,
                            })
                          }
                          className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-secondary-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-secondary-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleNotificationUpdate}
                  disabled={isSaving}
                >
                  {isSaving ? (
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
            </CollapsibleSection>

            {/* Change Password */}
            <CollapsibleSection
              id="password"
              icon={<Lock className="h-5 w-5" />}
              iconBgColor="bg-warning-100"
              iconColor="text-warning-600"
              title="Change Password"
              description="Update your password to keep your account secure"
              summary={getSummary("password")}
              variant="accent"
              status={sectionStatuses.password}
              isExpanded={expandedSections.has("password")}
              onToggle={() => toggleSection("password")}
            >
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Current Password
                  </label>
                  <div className="relative group">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      variant="modern"
                      leftIcon={<Lock className="h-5 w-5" />}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-accent-500 transition-colors"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    New Password
                  </label>
                  <div className="relative group">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      variant="modern"
                      leftIcon={<Lock className="h-5 w-5" />}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-accent-500 transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-secondary-500">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    variant="modern"
                    leftIcon={<Lock className="h-5 w-5" />}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </form>
            </CollapsibleSection>

            {/* Danger Zone - Enhanced modern design */}
            <div className="overflow-hidden rounded-2xl border-2 border-error-200/60 bg-gradient-to-br from-white via-white to-error-50/30 shadow-sm">
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error-100 shadow-sm">
                    <Trash2 className="h-5 w-5 text-error-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-error-700">
                      Danger Zone
                    </h2>
                    <p className="text-sm text-error-600/80">
                      Irreversible and destructive actions
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-error-100/60 p-6">
                <div className="rounded-xl bg-gradient-to-r from-error-50 to-error-100/50 border border-error-200/50 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-error-100 border border-error-200/50">
                      <AlertCircle className="h-5 w-5 text-error-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-error-900 mb-1">
                        Delete Account
                      </h3>
                      <p className="text-sm text-error-700/80 mb-4">
                        Once you delete your account, there is no going back. All your
                        job postings, applicant data, and account information will be
                        permanently deleted.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteAccountModal(true)}
                        disabled={isSaving}
                        className="border-error-300 text-error-600 hover:bg-error-50 hover:border-error-400 transition-colors"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Account
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-secondary-900">
                  Add Team Member
                </h3>
                <button
                  onClick={() => {
                    setShowAddMember(false);
                    setNewMember({ name: "", email: "", title: "" });
                  }}
                  className="rounded-lg p-2 hover:bg-secondary-100"
                  disabled={isSaving}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Name <span className="text-error-600">*</span>
                  </label>
                  <Input
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    placeholder="John Doe"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Email <span className="text-error-600">*</span>
                  </label>
                  <Input
                    type="email"
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    placeholder="john@company.com"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Title (Optional)
                  </label>
                  <Input
                    value={newMember.title}
                    onChange={(e) =>
                      setNewMember({ ...newMember, title: e.target.value })
                    }
                    placeholder="Engineering Manager"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddMember(false);
                    setNewMember({ name: "", email: "", title: "" });
                  }}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddMember}
                  disabled={isSaving || !newMember.name || !newMember.email}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Member"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-secondary-900">
                Create Interview Template
              </h3>
              <button
                onClick={() => setShowCreateTemplate(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Template Name
                </label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({
                      ...newTemplate,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Engineering 3-Round"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-secondary-700">
                    Interview Rounds
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addRoundToNewTemplate}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Round
                  </Button>
                </div>

                <div className="space-y-3">
                  {newTemplate.rounds.map((round, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-secondary-200 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-secondary-700">
                          Round {index + 1}
                        </span>
                        {newTemplate.rounds.length > 1 && (
                          <button
                            onClick={() =>
                              removeRoundFromNewTemplate(index)
                            }
                            className="text-error-600 hover:text-error-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Input
                          value={round.name}
                          onChange={(e) => {
                            const updatedRounds = [
                              ...newTemplate.rounds,
                            ];
                            updatedRounds[index].name = e.target.value;
                            setNewTemplate({
                              ...newTemplate,
                              rounds: updatedRounds,
                            });
                          }}
                          placeholder="Round name (e.g., Phone Screen)"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            value={round.duration}
                            onChange={(e) => {
                              const updatedRounds = [
                                ...newTemplate.rounds,
                              ];
                              updatedRounds[index].duration =
                                parseInt(e.target.value) || 30;
                              setNewTemplate({
                                ...newTemplate,
                                rounds: updatedRounds,
                              });
                            }}
                            placeholder="Duration (minutes)"
                          />
                          <Input
                            value={round.description}
                            onChange={(e) => {
                              const updatedRounds = [
                                ...newTemplate.rounds,
                              ];
                              updatedRounds[index].description =
                                e.target.value;
                              setNewTemplate({
                                ...newTemplate,
                                rounds: updatedRounds,
                              });
                            }}
                            placeholder="Description (optional)"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateTemplate(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateTemplate}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Template"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-secondary-900">
                Edit Interview Template
              </h3>
              <button
                onClick={() => setEditingTemplate(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Template Name
                </label>
                <Input
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Engineering 3-Round"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-secondary-700">
                    Interview Rounds
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setEditingTemplate({
                        ...editingTemplate,
                        rounds: [
                          ...editingTemplate.rounds,
                          { name: "", duration: 30, description: "" },
                        ],
                      })
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Round
                  </Button>
                </div>

                <div className="space-y-3">
                  {editingTemplate.rounds.map(
                    (round: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg border border-secondary-200 p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-secondary-700">
                            Round {index + 1}
                          </span>
                          {editingTemplate.rounds.length > 1 && (
                            <button
                              onClick={() =>
                                setEditingTemplate({
                                  ...editingTemplate,
                                  rounds: editingTemplate.rounds.filter(
                                    (_: any, i: number) => i !== index
                                  ),
                                })
                              }
                              className="text-error-600 hover:text-error-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid gap-2">
                          <Input
                            value={round.name}
                            onChange={(e) => {
                              const updatedRounds = [
                                ...editingTemplate.rounds,
                              ];
                              updatedRounds[index].name =
                                e.target.value;
                              setEditingTemplate({
                                ...editingTemplate,
                                rounds: updatedRounds,
                              });
                            }}
                            placeholder="Round name (e.g., Phone Screen)"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              value={round.duration}
                              onChange={(e) => {
                                const updatedRounds = [
                                  ...editingTemplate.rounds,
                                ];
                                updatedRounds[index].duration =
                                  parseInt(e.target.value) || 30;
                                setEditingTemplate({
                                  ...editingTemplate,
                                  rounds: updatedRounds,
                                });
                              }}
                              placeholder="Duration (minutes)"
                            />
                            <Input
                              value={round.description}
                              onChange={(e) => {
                                const updatedRounds = [
                                  ...editingTemplate.rounds,
                                ];
                                updatedRounds[index].description =
                                  e.target.value;
                                setEditingTemplate({
                                  ...editingTemplate,
                                  rounds: updatedRounds,
                                });
                              }}
                              placeholder="Description (optional)"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setEditingTemplate(null)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateTemplate}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Template"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Team Member Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteMemberModal.isOpen}
        onClose={() =>
          setDeleteMemberModal({
            isOpen: false,
            memberId: null,
            memberName: "",
          })
        }
        onConfirm={() => {
          if (deleteMemberModal.memberId)
            handleDeleteMember(deleteMemberModal.memberId);
        }}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${
          deleteMemberModal.memberName || "this team member"
        }? They will no longer have access to your company's account.`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Disconnect Video Integration Confirmation Modal */}
      <ConfirmationModal
        isOpen={disconnectVideoModal}
        onClose={() => setDisconnectVideoModal(false)}
        onConfirm={disconnectVideo}
        title="Disconnect Video Integration"
        message="Are you sure you want to disconnect your video integration? You will need to reconnect it to schedule video interviews."
        confirmText="Disconnect"
        cancelText="Cancel"
        variant="warning"
      />

      {/* Disconnect Calendar Confirmation Modal */}
      <ConfirmationModal
        isOpen={disconnectCalendarModal}
        onClose={() => setDisconnectCalendarModal(false)}
        onConfirm={disconnectCalendar}
        title="Disconnect Google Calendar"
        message="Are you sure you want to disconnect Google Calendar? Calendar sync and availability features will be disabled."
        confirmText="Disconnect"
        cancelText="Cancel"
        variant="warning"
      />

      {/* Delete Template Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTemplateModal.isOpen}
        onClose={() =>
          setDeleteTemplateModal({
            isOpen: false,
            templateId: null,
            templateName: "",
          })
        }
        onConfirm={() => {
          if (deleteTemplateModal.templateId)
            handleDeleteTemplate(deleteTemplateModal.templateId);
        }}
        title="Delete Template"
        message={`Are you sure you want to delete the template "${
          deleteTemplateModal.templateName || "this template"
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Delete Account First Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        onConfirm={() => {
          setDeleteAccountModal(false);
          setDeleteAccountConfirmModal(true);
        }}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Continue"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Delete Account Final Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteAccountConfirmModal}
        onClose={() => setDeleteAccountConfirmModal(false)}
        onConfirm={handleAccountDeletion}
        title="Final Confirmation"
        message="This will permanently delete all your job postings, applicant data, team members, and account information. Are you absolutely sure?"
        confirmText="Delete My Account"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
