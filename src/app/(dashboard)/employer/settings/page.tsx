"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  Check,
  XCircle,
  Clock,
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

  // Password strength calculator
  const passwordValidation = useMemo(() => {
    const password = passwordData.newPassword;
    return {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[^a-zA-Z\d]/.test(password),
      passwordsMatch: password.length > 0 && password === passwordData.confirmPassword,
    };
  }, [passwordData.newPassword, passwordData.confirmPassword]);

  const passwordStrength = useMemo(() => {
    let strength = 0;
    if (passwordValidation.minLength) strength++;
    if (passwordValidation.hasLowercase && passwordValidation.hasUppercase) strength++;
    if (passwordValidation.hasNumber) strength++;
    if (passwordValidation.hasSpecial) strength++;
    return strength;
  }, [passwordValidation]);

  const getPasswordStrengthLabel = () => {
    if (passwordData.newPassword.length === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    if (passwordStrength === 4) return "Strong";
    return "Very Weak";
  };

  const getPasswordStrengthColor = (level: number) => {
    if (passwordStrength >= level) {
      if (passwordStrength === 1) return "bg-red-500";
      if (passwordStrength === 2) return "bg-orange-500";
      if (passwordStrength === 3) return "bg-yellow-500";
      return "bg-green-500";
    }
    return "bg-secondary-200";
  };

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
        showToast("error", "Load Failed", err.response?.data?.error || "Failed to load settings");
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

      showToast("success", "Profile Updated", "Your company profile has been updated successfully");
      setIsSaving(false);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      showToast("error", "Update Failed", err.response?.data?.error || "Failed to update profile");
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("error", "Passwords don't match", "New password and confirm password must be the same");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast("error", "Password too short", "Password must be at least 8 characters");
      return;
    }

    // Check password strength
    const hasLowercase = /[a-z]/.test(passwordData.newPassword);
    const hasUppercase = /[A-Z]/.test(passwordData.newPassword);
    const hasNumber = /\d/.test(passwordData.newPassword);

    if (!hasLowercase || !hasUppercase || !hasNumber) {
      showToast("error", "Weak password", "Password must contain at least one uppercase letter, one lowercase letter, and one number");
      return;
    }

    setIsSaving(true);

    try {
      await api.post("/api/settings/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      showToast("success", "Password changed", "Your password has been updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsSaving(false);
    } catch (err: any) {
      console.error("Failed to change password:", err);
      showToast("error", "Password change failed", err.response?.data?.error || "Failed to change password");
      setIsSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setIsSaving(true);

    try {
      await api.patch("/api/settings", {
        emailNotifications: notificationSettings.emailNotifications,
        notifyNewApplications: notificationSettings.newApplications,
        notifyInterviewReminders: notificationSettings.interviewReminders,
        notifyMessages: notificationSettings.messages,
        notifyPlacementUpdates: notificationSettings.placementUpdates,
        notifyMarketingEmails: notificationSettings.marketingEmails,
      });

      showToast("success", "Preferences Saved", "Your notification preferences have been updated");
      setIsSaving(false);
    } catch (err: any) {
      console.error("Failed to update preferences:", err);
      showToast("error", "Update Failed", err.response?.data?.error || "Failed to update preferences");
      setIsSaving(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email) {
      showToast("error", "Missing Fields", "Name and email are required");
      return;
    }

    setIsSaving(true);

    try {
      const response = await api.post("/api/employer/team-members", newMember);
      setTeamMembers([response.data.member, ...teamMembers]);
      setNewMember({ name: "", email: "", title: "" });
      setShowAddMember(false);
      showToast("success", "Member Added", "Team member added successfully");
      // Invalidate the employer dashboard query to update banner
      queryClient.invalidateQueries({ queryKey: ["employer-dashboard"] });
    } catch (err: any) {
      console.error("Failed to add team member:", err);
      showToast("error", "Failed to Add", err.response?.data?.error || "Failed to add team member");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    setIsSaving(true);

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
      showToast("error", "Configuration Error", "Backend URL not configured. Please contact support.");
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
      showToast("error", "Configuration Error", "Backend URL not configured. Please contact support.");
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
      showToast("error", "Missing Name", "Template name is required");
      return;
    }

    if (newTemplate.rounds.some((r) => !r.name.trim() || !r.duration)) {
      showToast("error", "Incomplete Rounds", "All rounds must have a name and duration");
      return;
    }

    setIsSaving(true);

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
      showToast("success", "Template Created", "Interview template created successfully");
    } catch (err: any) {
      console.error("Failed to create template:", err);
      showToast("error", "Creation Failed", err.response?.data?.error || "Failed to create template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;

    setIsSaving(true);

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
      showToast("success", "Template Updated", "Interview template updated successfully");
    } catch (err: any) {
      console.error("Failed to update template:", err);
      showToast("error", "Update Failed", err.response?.data?.error || "Failed to update template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    setIsSaving(true);

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

      showToast("success", "Default Set", "Default template set successfully");
    } catch (err: any) {
      console.error("Failed to set default template:", err);
      showToast("error", "Failed", err.response?.data?.error || "Failed to set default template");
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
    { id: "templates", name: "Interview Process", status: sectionStatuses.templates },
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
              {teamMembers.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-secondary-200 bg-gradient-to-br from-secondary-50 to-secondary-100/50 p-10 text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">No team members yet</h3>
                  <p className="text-secondary-600 text-sm max-w-sm mx-auto mb-4">
                    Add team members who will conduct interviews. They&apos;ll be available when scheduling interview rounds.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowAddMember(true)}
                    disabled={isSaving}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Team Member
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {teamMembers.map((member, index) => (
                      <div
                        key={member.id}
                        className="group flex items-center justify-between rounded-xl border border-secondary-200 bg-gradient-to-r from-white to-secondary-50/50 p-4 hover:border-accent-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-primary-600 font-semibold text-lg shadow-sm">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-secondary-900">
                              {member.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Mail className="h-3.5 w-3.5 text-secondary-400" />
                              <p className="text-sm text-secondary-600">
                                {member.email}
                              </p>
                            </div>
                            {member.title && (
                              <div className="flex items-center gap-2 mt-0.5">
                                <Briefcase className="h-3.5 w-3.5 text-secondary-400" />
                                <p className="text-sm text-secondary-500">
                                  {member.title}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDeleteMemberModal({
                              isOpen: true,
                              memberId: member.id,
                              memberName: member.name,
                            })
                          }
                          disabled={isSaving}
                          className="border-error-200 text-error-500 hover:bg-error-50 hover:border-error-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add Member Button - Below the list */}
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="primary"
                      onClick={() => setShowAddMember(true)}
                      disabled={isSaving}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Team Member
                    </Button>
                  </div>
                </>
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
              <div className="space-y-4">
                {/* Zoom Integration */}
                <div className={`rounded-xl border-2 p-5 transition-all duration-200 ${
                  videoIntegration?.platform === "ZOOM"
                    ? "border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-sm"
                    : "border-secondary-200 bg-gradient-to-r from-white to-secondary-50/30 hover:border-secondary-300"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-sm ${
                        videoIntegration?.platform === "ZOOM"
                          ? "bg-blue-500"
                          : "bg-gradient-to-br from-blue-100 to-blue-200"
                      }`}>
                        <Video className={`h-7 w-7 ${videoIntegration?.platform === "ZOOM" ? "text-white" : "text-blue-600"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-secondary-900">Zoom</h3>
                          {videoIntegration?.platform === "ZOOM" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
                              Connected
                            </span>
                          )}
                        </div>
                        {videoIntegration?.platform === "ZOOM" ? (
                          <p className="text-sm text-secondary-600 mt-0.5">
                            {videoIntegration.email}
                          </p>
                        ) : (
                          <p className="text-sm text-secondary-500 mt-0.5">
                            Connect to auto-generate meeting links
                          </p>
                        )}
                      </div>
                    </div>

                    {videoIntegration?.platform === "ZOOM" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDisconnectVideoModal(true)}
                        disabled={isSaving}
                        className="bg-white border-secondary-300 text-secondary-600 hover:bg-error-50 hover:text-error-600 hover:border-error-300 shadow-sm"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
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
                        className="shadow-sm"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>

                {/* Google Meet Integration */}
                <div className={`rounded-xl border-2 p-5 transition-all duration-200 ${
                  videoIntegration?.platform === "GOOGLE_MEET"
                    ? "border-green-300 bg-gradient-to-r from-green-50 to-green-100/50 shadow-sm"
                    : "border-secondary-200 bg-gradient-to-r from-white to-secondary-50/30 hover:border-secondary-300"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-sm ${
                        videoIntegration?.platform === "GOOGLE_MEET"
                          ? "bg-green-500"
                          : "bg-gradient-to-br from-green-100 to-green-200"
                      }`}>
                        <Video className={`h-7 w-7 ${videoIntegration?.platform === "GOOGLE_MEET" ? "text-white" : "text-green-600"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-secondary-900">Google Meet</h3>
                          {videoIntegration?.platform === "GOOGLE_MEET" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
                              Connected
                            </span>
                          )}
                        </div>
                        {videoIntegration?.platform === "GOOGLE_MEET" ? (
                          <p className="text-sm text-secondary-600 mt-0.5">
                            {videoIntegration.email}
                          </p>
                        ) : (
                          <p className="text-sm text-secondary-500 mt-0.5">
                            Connect to auto-generate meeting links
                          </p>
                        )}
                      </div>
                    </div>

                    {videoIntegration?.platform === "GOOGLE_MEET" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDisconnectVideoModal(true)}
                        disabled={isSaving}
                        className="bg-white border-secondary-300 text-secondary-600 hover:bg-error-50 hover:text-error-600 hover:border-error-300 shadow-sm"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
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
                        className="shadow-sm"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-5 rounded-xl bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200/60 p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100">
                      <Video className="h-4 w-4 text-accent-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900 mb-1">Auto-generate meeting links</p>
                    <p className="text-sm text-secondary-600">
                      Connect Zoom or Google Meet to automatically create meeting links when scheduling interviews. Only one platform can be connected at a time.
                    </p>
                  </div>
                </div>
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
              <div className={`rounded-xl border-2 p-5 transition-all duration-200 ${
                calendarIntegration?.connected
                  ? "border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-sm"
                  : "border-secondary-200 bg-gradient-to-r from-white to-secondary-50/30 hover:border-secondary-300"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-sm ${
                      calendarIntegration?.connected
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : "bg-gradient-to-br from-blue-100 to-blue-200"
                    }`}>
                      <Calendar className={`h-7 w-7 ${calendarIntegration?.connected ? "text-white" : "text-blue-600"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-secondary-900">
                          Google Calendar
                        </h3>
                        {calendarIntegration?.connected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
                            Connected
                          </span>
                        )}
                      </div>
                      {calendarIntegration?.connected ? (
                        <p className="text-sm text-secondary-600 mt-0.5">
                          {calendarIntegration.email}
                        </p>
                      ) : (
                        <p className="text-sm text-secondary-500 mt-0.5">
                          Sync your calendar to prevent double-booking
                        </p>
                      )}
                    </div>
                  </div>

                  {calendarIntegration?.connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDisconnectCalendarModal(true)}
                      disabled={isSaving}
                      className="bg-white border-secondary-300 text-secondary-600 hover:bg-error-50 hover:text-error-600 hover:border-error-300 shadow-sm"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
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
                      className="shadow-sm"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-5 rounded-xl bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200/60 p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100">
                      <Calendar className="h-4 w-4 text-accent-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900 mb-1">Avoid scheduling conflicts</p>
                    <p className="text-sm text-secondary-600">
                      When connected, your busy times will automatically show when setting interview availability, helping you avoid double-booking.
                    </p>
                  </div>
                </div>
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
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary-600 mx-auto mb-3" />
                    <p className="text-sm text-secondary-500">Loading billing information...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Stripe Customer Status */}
                  <div className={`rounded-xl border-2 p-5 transition-all duration-200 ${
                    hasStripeCustomer
                      ? "border-green-300 bg-gradient-to-r from-green-50 to-green-100/50"
                      : "border-warning-300 bg-gradient-to-r from-warning-50 to-warning-100/50"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-sm ${
                          hasStripeCustomer
                            ? "bg-gradient-to-br from-green-500 to-green-600"
                            : "bg-gradient-to-br from-warning-400 to-warning-500"
                        }`}>
                          <CreditCard className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-secondary-900">
                              Billing Account
                            </p>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              hasStripeCustomer
                                ? "bg-success-100 text-success-700"
                                : "bg-warning-100 text-warning-700"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                hasStripeCustomer ? "bg-success-500" : "bg-warning-500"
                              }`}></span>
                              {hasStripeCustomer ? "Active" : "Not Set Up"}
                            </span>
                          </div>
                          <p className="text-sm text-secondary-600 mt-0.5">
                            {hasStripeCustomer
                              ? `Customer ID: •••${stripeCustomerId?.slice(-6)}`
                              : "Set up billing to streamline payments"}
                          </p>
                        </div>
                      </div>
                      {!hasStripeCustomer && (
                        <Button
                          variant="primary"
                          onClick={handleSetupBilling}
                          disabled={isSettingUpBilling}
                          className="shadow-sm"
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
                  </div>

                  {/* Payment Method */}
                  {hasStripeCustomer && (
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider">Payment Method</p>
                      {paymentMethod ? (
                        <div className="rounded-xl border-2 border-secondary-200 bg-gradient-to-r from-white to-secondary-50/30 p-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-200">
                              <CreditCard className="h-6 w-6 text-secondary-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-secondary-900">
                                {paymentMethod.brand.charAt(0).toUpperCase() +
                                  paymentMethod.brand.slice(1)}{" "}
                                •••• {paymentMethod.last4}
                              </p>
                              <p className="text-sm text-secondary-500 mt-0.5">
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
                        <div className="rounded-xl border-2 border-dashed border-secondary-200 bg-gradient-to-br from-secondary-50 to-secondary-100/50 p-6 text-center">
                          <div className="mx-auto w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center mb-3">
                            <CreditCard className="h-6 w-6 text-secondary-400" />
                          </div>
                          <p className="font-medium text-secondary-700 mb-1">
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
                  <div className="pt-4 border-t border-secondary-200">
                    <Button
                      variant="outline"
                      asChild
                      className="w-full sm:w-auto hover:border-accent-300 hover:bg-accent-50"
                    >
                      <Link href="/employer/invoices">
                        <FileText className="h-4 w-4 mr-2" />
                        View Invoices & Payment History
                      </Link>
                    </Button>
                  </div>

                  {/* Info Box */}
                  <div className="rounded-xl bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200/60 p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100">
                          <CreditCard className="h-4 w-4 text-accent-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900 mb-1">Automatic billing setup</p>
                        <p className="text-sm text-secondary-600">
                          Your billing account will be automatically set up when you make your first payment. You can also set it up now to streamline the checkout process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CollapsibleSection>

            {/* Interview Process Templates */}
            <CollapsibleSection
              id="templates"
              icon={<FileText className="h-5 w-5" />}
              iconBgColor="bg-primary-100"
              iconColor="text-primary-600"
              title="Interview Process Templates"
              description="Manage custom interview process templates for your hiring workflow"
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
                    className={`group rounded-xl border-2 p-5 transition-all duration-200 ${
                      template.isDefault
                        ? "border-accent-300 bg-gradient-to-r from-accent-50/50 to-primary-50/30"
                        : "border-secondary-200 bg-gradient-to-r from-white to-secondary-50/30 hover:border-secondary-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-sm ${
                          template.isDefault
                            ? "bg-gradient-to-br from-accent-500 to-primary-500"
                            : template.isBuiltIn
                            ? "bg-gradient-to-br from-secondary-200 to-secondary-300"
                            : "bg-gradient-to-br from-primary-100 to-accent-100"
                        }`}>
                          <FileText className={`h-6 w-6 ${template.isDefault ? "text-white" : template.isBuiltIn ? "text-secondary-600" : "text-primary-600"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-secondary-900">
                              {template.name}
                            </h3>
                            {template.isDefault && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
                                <Star className="h-3 w-3" />
                                Default
                              </span>
                            )}
                            {template.isBuiltIn && (
                              <Badge variant="secondary">Built-in</Badge>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {template.rounds.map((r: any, idx: number) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary-100 text-secondary-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary-400"></span>
                                {r.name} ({r.duration} min)
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {!template.isBuiltIn && (
                        <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!template.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleSetDefaultTemplate(template.id)
                              }
                              disabled={isSaving}
                              className="hover:border-accent-300 hover:bg-accent-50"
                            >
                              <Star className="mr-1 h-3 w-3" />
                              Default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTemplate(template)}
                            disabled={isSaving}
                            className="hover:border-accent-300 hover:bg-accent-50"
                          >
                            <Edit className="h-3 w-3" />
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
                            className="border-error-200 text-error-500 hover:bg-error-50 hover:border-error-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {templates.length === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-secondary-200 bg-gradient-to-br from-secondary-50 to-secondary-100/50 p-10 text-center">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-secondary-900 mb-2">No templates yet</h3>
                    <p className="text-secondary-600 text-sm max-w-sm mx-auto">
                      Create custom interview templates to standardize your hiring process across all positions.
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

                  {/* Password Strength Indicator */}
                  {passwordData.newPassword && (
                    <div className="mt-3 space-y-3">
                      {/* Strength Bar */}
                      <div>
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor(level)}`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${
                          passwordStrength <= 1 ? "text-red-600" :
                          passwordStrength === 2 ? "text-orange-600" :
                          passwordStrength === 3 ? "text-yellow-600" :
                          "text-green-600"
                        }`}>
                          {getPasswordStrengthLabel()}
                        </p>
                      </div>

                      {/* Validation Checklist */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`flex items-center gap-2 text-xs ${passwordValidation.minLength ? "text-green-600" : "text-secondary-400"}`}>
                          {passwordValidation.minLength ? <Check className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          8+ characters
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasUppercase ? "text-green-600" : "text-secondary-400"}`}>
                          {passwordValidation.hasUppercase ? <Check className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          Uppercase letter
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasLowercase ? "text-green-600" : "text-secondary-400"}`}>
                          {passwordValidation.hasLowercase ? <Check className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          Lowercase letter
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasNumber ? "text-green-600" : "text-secondary-400"}`}>
                          {passwordValidation.hasNumber ? <Check className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          Number
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasSpecial ? "text-green-600" : "text-secondary-400"}`}>
                          {passwordValidation.hasSpecial ? <Check className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          Special character
                        </div>
                      </div>
                    </div>
                  )}
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
                  {/* Password Match Indicator */}
                  {passwordData.confirmPassword && (
                    <div className={`mt-2 flex items-center gap-2 text-xs ${passwordValidation.passwordsMatch ? "text-green-600" : "text-red-600"}`}>
                      {passwordValidation.passwordsMatch ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Passwords match
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5" />
                          Passwords don&apos;t match
                        </>
                      )}
                    </div>
                  )}
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
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 border-b border-secondary-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-sm">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-secondary-900">
                      Add Team Member
                    </h3>
                    <p className="text-sm text-secondary-500">Add someone who conducts interviews</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddMember(false);
                    setNewMember({ name: "", email: "", title: "" });
                  }}
                  className="rounded-lg p-2 hover:bg-secondary-100 transition-colors"
                  disabled={isSaving}
                >
                  <X className="h-5 w-5 text-secondary-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Full Name <span className="text-error-600">*</span>
                </label>
                <Input
                  variant="modern"
                  leftIcon={<User className="h-5 w-5" />}
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
                  Email Address <span className="text-error-600">*</span>
                </label>
                <Input
                  type="email"
                  variant="modern"
                  leftIcon={<Mail className="h-5 w-5" />}
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
                  Job Title <span className="text-error-600">*</span>
                </label>
                <Input
                  variant="modern"
                  leftIcon={<Briefcase className="h-5 w-5" />}
                  value={newMember.title}
                  onChange={(e) =>
                    setNewMember({ ...newMember, title: e.target.value })
                  }
                  placeholder="Engineering Manager"
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-secondary-100 bg-secondary-50/50 p-6 flex gap-3">
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
                  disabled={isSaving || !newMember.name || !newMember.email || !newMember.title}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </>
                  )}
                </Button>
              </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 border-b border-secondary-100 p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-sm">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-secondary-900">
                      Create Interview Process Template
                    </h3>
                    <p className="text-sm text-secondary-500">Define the stages of your interview process</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateTemplate(false)}
                  className="rounded-lg p-2 hover:bg-secondary-100 transition-colors"
                >
                  <X className="h-5 w-5 text-secondary-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Template Name <span className="text-error-600">*</span>
                </label>
                <Input
                  variant="modern"
                  leftIcon={<FileText className="h-5 w-5" />}
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({
                      ...newTemplate,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Engineering 3-Round Process"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-secondary-700">
                      Interview Rounds
                    </label>
                    <p className="text-xs text-secondary-500 mt-0.5">Add the stages of your interview process</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addRoundToNewTemplate}
                    className="hover:border-accent-300 hover:bg-accent-50"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Round
                  </Button>
                </div>

                <div className="space-y-3">
                  {newTemplate.rounds.map((round, index) => (
                    <div
                      key={index}
                      className="rounded-xl border-2 border-secondary-200 bg-gradient-to-r from-white to-secondary-50/30 p-4 hover:border-secondary-300 transition-all"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-sm font-semibold">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-secondary-700">
                            Round {index + 1}
                          </span>
                        </div>
                        {newTemplate.rounds.length > 1 && (
                          <button
                            onClick={() =>
                              removeRoundFromNewTemplate(index)
                            }
                            className="p-1.5 rounded-lg text-secondary-400 hover:text-error-600 hover:bg-error-50 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid gap-3">
                        <Input
                          variant="modern"
                          leftIcon={<FileText className="h-5 w-5" />}
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
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-secondary-400 transition-colors duration-200 group-focus-within:text-accent-500">
                              <Clock className="h-5 w-5" />
                            </div>
                            <input
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
                              placeholder="Duration"
                              className="h-12 w-full rounded-xl border border-secondary-200 bg-secondary-50/50 pl-12 pr-16 py-3 text-sm transition-all duration-200 hover:bg-white hover:border-secondary-300 focus:outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 text-sm">min</span>
                          </div>
                          <Input
                            variant="modern"
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

            {/* Modal Footer */}
            <div className="border-t border-secondary-100 bg-secondary-50/50 p-6 flex gap-3 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowCreateTemplate(false)}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateTemplate}
                disabled={isSaving || !newTemplate.name}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                  </>
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
