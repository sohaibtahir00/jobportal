"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input, ConfirmationModal, useToast } from "@/components/ui";
import { api } from "@/lib/api";

export default function EmployerSettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Confirmation modal states
  const [deleteMemberModal, setDeleteMemberModal] = useState<{ isOpen: boolean; memberId: string | null; memberName: string }>({ isOpen: false, memberId: null, memberName: "" });
  const [disconnectVideoModal, setDisconnectVideoModal] = useState(false);
  const [disconnectCalendarModal, setDisconnectCalendarModal] = useState(false);
  const [deleteTemplateModal, setDeleteTemplateModal] = useState<{ isOpen: boolean; templateId: string | null; templateName: string }>({ isOpen: false, templateId: null, templateName: "" });
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deleteAccountConfirmModal, setDeleteAccountConfirmModal] = useState(false);

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
            emailNotifications: settingsData.settings.emailNotifications ?? true,
            newApplications: settingsData.settings.notifyNewApplications ?? true,
            interviewReminders: settingsData.settings.notifyInterviewReminders ?? true,
            messages: settingsData.settings.notifyMessages ?? true,
            placementUpdates: settingsData.settings.notifyPlacementUpdates ?? true,
            marketingEmails: settingsData.settings.notifyMarketingEmails ?? false,
          });
        }

        // Load team members
        const teamResponse = await api.get("/api/employer/team-members");
        setTeamMembers(teamResponse.data.members || []);

        // Store employer ID for OAuth
        setEmployerId(profileData.employer.id);

        // Load video integration
        try {
          const videoResponse = await api.get("/api/employer/integrations/video");
          setVideoIntegration(videoResponse.data.integration);
        } catch (err) {
          // No integration yet, that's fine
          setVideoIntegration(null);
        }

        // Load Google Calendar integration
        try {
          const calendarResponse = await api.get("/api/employer/integrations/google-calendar/status");
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
          const templatesResponse = await api.get("/api/employer/interview-templates");
          setTemplates(templatesResponse.data.templates || []);
        } catch (err) {
          console.error("Failed to load templates:", err);
          setTemplates([]);
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
      setErrorMessage(err.response?.data?.error || "Failed to update preferences");
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
      showToast("success", "Member Removed", "Team member removed successfully!");
    } catch (err: any) {
      console.error("Failed to delete team member:", err);
      showToast("error", "Error", err.response?.data?.error || "Failed to delete team member");
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
    const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${employerId}`;
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
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${employerId}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  const disconnectVideo = async () => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      await api.delete("/api/employer/integrations/video");
      setVideoIntegration(null);
      showToast("success", "Disconnected", "Video integration disconnected successfully!");
    } catch (err: any) {
      console.error("Failed to disconnect video integration:", err);
      showToast("error", "Error", err.response?.data?.error || "Failed to disconnect integration");
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
      showToast("success", "Disconnected", "Google Calendar disconnected successfully!");
    } catch (err: any) {
      console.error("Failed to disconnect Google Calendar:", err);
      showToast("error", "Error", err.response?.data?.error || "Failed to disconnect calendar");
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
      showToast("success", "Template Deleted", "Template deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete template:", err);
      showToast("error", "Error", err.response?.data?.error || "Failed to delete template");
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
      showToast("error", "Error", err.response?.data?.error || "Failed to delete account");
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

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">
              Company Settings
            </h1>
            <p className="text-secondary-600">
              Manage your company profile and account preferences
            </p>
          </div>

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

          {/* Company Profile */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                  <Building2 className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">
                    Company Profile
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Update your company information
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Company Name
                    </label>
                    <Input
                      value={profileData.companyName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          companyName: e.target.value,
                        })
                      }
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      placeholder="company@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Phone
                    </label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Website
                    </label>
                    <Input
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
                    <select
                      value={profileData.companySize}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          companySize: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Industry
                    </label>
                    <Input
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
                    <textarea
                      value={profileData.description}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                      placeholder="Brief description of your company..."
                    />
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
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-100">
                  <Lock className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">
                    Change Password
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
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
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-secondary-500">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
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
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
                  <Bell className="h-5 w-5 text-accent-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Choose what updates you want to receive
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
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
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                    <Building2 className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-secondary-900">
                      Team Members
                    </h2>
                    <p className="text-sm text-secondary-600">
                      Manage team members who conduct interviews
                    </p>
                  </div>
                </div>
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
                    No team members added yet. Add team members who will conduct interviews.
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
                        <h3 className="font-semibold text-secondary-900">{member.name}</h3>
                        <p className="text-sm text-secondary-600">{member.email}</p>
                        {member.title && (
                          <p className="text-sm text-secondary-500">{member.title}</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteMember(member.id)}
                        disabled={isSaving}
                        className="border-error-300 text-error-600 hover:bg-error-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Member Modal */}
          {showAddMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-md">
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-secondary-900">Add Team Member</h3>
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
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
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
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
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
                        onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
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

          {/* Video Conferencing Integrations */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                  <Video className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">
                    Video Conferencing
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Connect your video conferencing accounts to auto-generate meeting links
                  </p>
                </div>
              </div>

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
                          ✓ Connected as {videoIntegration.email}
                        </p>
                      ) : (
                        <p className="text-sm text-secondary-500">Not connected</p>
                      )}
                    </div>
                  </div>

                  {videoIntegration?.platform === "ZOOM" ? (
                    <Button
                      variant="outline"
                      onClick={disconnectVideo}
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
                        (videoIntegration && videoIntegration.platform !== "ZOOM")
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
                      <h3 className="font-semibold text-secondary-900">Google Meet</h3>
                      {videoIntegration?.platform === "GOOGLE_MEET" ? (
                        <p className="text-sm text-success-600">
                          ✓ Connected as {videoIntegration.email}
                        </p>
                      ) : (
                        <p className="text-sm text-secondary-500">Not connected</p>
                      )}
                    </div>
                  </div>

                  {videoIntegration?.platform === "GOOGLE_MEET" ? (
                    <Button
                      variant="outline"
                      onClick={disconnectVideo}
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
                  💡 <strong>Tip:</strong> Connect Zoom or Google Meet to automatically generate
                  meeting links when scheduling interviews. You can only connect one platform at a
                  time.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Google Calendar Integration */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                  <Calendar className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">
                    Google Calendar Integration
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Sync your calendar to prevent double-booking when scheduling interviews
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-secondary-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">Google Calendar</h3>
                      {calendarIntegration?.connected ? (
                        <p className="text-sm text-success-600">
                          ✓ Connected as {calendarIntegration.email}
                        </p>
                      ) : (
                        <p className="text-sm text-secondary-500">Not connected</p>
                      )}
                    </div>
                  </div>

                  {calendarIntegration?.connected ? (
                    <Button
                      variant="outline"
                      onClick={disconnectCalendar}
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
                        window.location.href = '/api/employer/integrations/google-calendar/oauth';
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
                  💡 <strong>Tip:</strong> When you connect Google Calendar, your busy times will automatically
                  show when setting interview availability, helping you avoid scheduling conflicts.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Interview Templates */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-secondary-900">
                      Interview Templates
                    </h2>
                    <p className="text-sm text-secondary-600">
                      Manage custom interview templates for your hiring process
                    </p>
                  </div>
                </div>
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
                            onClick={() => handleDeleteTemplate(template.id)}
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
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-error-200">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100">
                  <Trash2 className="h-5 w-5 text-error-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-error-900">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-error-700">
                    Irreversible and destructive actions
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-error-50 p-4">
                <h3 className="mb-2 font-bold text-error-900">
                  Delete Account
                </h3>
                <p className="mb-4 text-sm text-error-700">
                  Once you delete your account, there is no going back. All your
                  job postings, applicant data, and account information will be
                  permanently deleted.
                </p>
                <Button
                  variant="outline"
                  onClick={handleAccountDeletion}
                  disabled={isSaving}
                  className="border-error-600 text-error-600 hover:bg-error-50"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
